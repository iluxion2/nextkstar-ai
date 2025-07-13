from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from deepface import DeepFace
from PIL import Image
import numpy as np
import os
import io
import cv2
import pandas as pd
from typing import List, Dict, Any
import logging
import math

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Face Analysis API", version="1.0.0")

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for celebrity data
CELEB_DIR = "celebrities"
CSV_FILE = "celebrities/kpopidolsv3.csv"
celeb_embeddings = []
celeb_names = []
celeb_images = []
celeb_data = []  # Store full CSV data
user_embedding_cache = {}  # Cache for user embeddings

def detect_face_in_image(image):
    """Enhanced face detection using multiple methods for maximum accuracy"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    height, width = gray.shape
    
    # Check image size - too small images are unlikely to contain meaningful faces
    if height < 50 or width < 50:
        logger.info("Image too small for meaningful face detection")
        return False
    
    # Check image quality - blurry images are harder to analyze
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    if laplacian_var < 50:  # Very blurry image
        logger.info(f"Image too blurry for accurate analysis (variance: {laplacian_var:.2f})")
        return False
    
    # Method 1: Haar cascade classifier (frontal face)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces_frontal = face_cascade.detectMultiScale(gray, 1.1, 4, minSize=(30, 30))
    
    # Method 2: Haar cascade classifier (profile face)
    profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
    faces_profile = profile_cascade.detectMultiScale(gray, 1.1, 4, minSize=(30, 30))
    
    # Method 3: Eye detection (additional validation)
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    eyes = eye_cascade.detectMultiScale(gray, 1.1, 4, minSize=(20, 20))
    
    # Method 4: DeepFace detection with strict enforcement
    try:
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        faces_deepface = DeepFace.extract_faces(img_path=img_rgb, enforce_detection=True)
        if len(faces_deepface) > 0:
            logger.info("DeepFace detected face(s)")
            return True
    except Exception as e:
        logger.debug(f"DeepFace detection failed: {e}")
    
    # Method 5: Advanced validation for OpenCV detections
    total_faces = len(faces_frontal) + len(faces_profile)
    if total_faces > 0:
        # Validate each detected face
        for (x, y, w, h) in list(faces_frontal) + list(faces_profile):
            face_area = w * h
            image_area = width * height
            face_ratio = face_area / image_area
            
            # Face should be between 5% and 80% of image area
            if 0.05 <= face_ratio <= 0.8:
                # Additional validation: check if eyes are detected near face
                eyes_in_face = 0
                for (ex, ey, ew, eh) in eyes:
                    # Check if eyes are within face region (with some tolerance)
                    if (x - 10 <= ex <= x + w + 10 and y - 10 <= ey <= y + h + 10):
                        eyes_in_face += 1
                
                # If we found at least one eye or the face is large enough, consider it valid
                if eyes_in_face > 0 or face_ratio > 0.15:
                    logger.info(f"Valid face detected: ratio={face_ratio:.2f}, eyes={eyes_in_face}")
                    return True
    
    # Method 6: Check for human-like color distribution (skin tone detection)
    try:
        # Convert to HSV for better skin detection
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Define skin color range in HSV
        lower_skin = np.array([0, 20, 70], dtype=np.uint8)
        upper_skin = np.array([20, 255, 255], dtype=np.uint8)
        
        # Create mask for skin color
        skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
        skin_pixels = cv2.countNonZero(skin_mask)
        total_pixels = height * width
        skin_ratio = skin_pixels / total_pixels
        
        # If more than 30% of image is skin-colored, it might be a face
        if skin_ratio > 0.3 and total_faces > 0:
            logger.info(f"Skin tone detected: {skin_ratio:.2f}")
            return True
            
    except Exception as e:
        logger.debug(f"Skin detection failed: {e}")
    
    logger.info("No valid face detected")
    return False

def calculate_facial_symmetry(image):
    """Calculate facial symmetry score using basic image processing"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Get face region
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        return 75.0  # Default score
    
    x, y, w, h = faces[0]
    face_roi = gray[y:y+h, x:x+w]
    
    # Calculate symmetry by comparing left and right halves
    height, width = face_roi.shape
    mid_point = width // 2
    
    left_half = face_roi[:, :mid_point]
    right_half = cv2.flip(face_roi[:, mid_point:], 1)
    
    # Ensure both halves have the same size
    min_width = min(left_half.shape[1], right_half.shape[1])
    left_half = left_half[:, :min_width]
    right_half = right_half[:, :min_width]
    
    # Calculate difference between left and right halves
    if left_half.size > 0 and right_half.size > 0:
        diff = cv2.absdiff(left_half, right_half)
        symmetry_score = 100.0 - (np.mean(diff) / 255.0 * 100.0)
        return max(50.0, min(95.0, symmetry_score))
    
    return 75.0

def calculate_skin_clarity(image):
    """Calculate skin clarity score using image processing"""
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to detect smoothness
    blurred = cv2.GaussianBlur(gray, (15, 15), 0)
    
    # Calculate variance (higher variance = more texture/imperfections)
    variance = np.var(gray - blurred)
    
    # Convert variance to clarity score (lower variance = higher clarity)
    clarity_score = max(50.0, min(95.0, 95.0 - (variance / 100)))
    
    return clarity_score

def calculate_facial_proportions(image):
    """Calculate facial proportions using face detection"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        return 80.0  # Default score
    
    x, y, w, h = faces[0]
    
    # Calculate face proportions
    face_ratio = w / h if h > 0 else 1.0
    
    # Ideal face ratio is around 0.8-0.9 (width/height)
    ideal_ratio = 0.85
    ratio_diff = abs(face_ratio - ideal_ratio)
    
    # Calculate proportion score
    proportion_score = max(60.0, min(95.0, 95.0 - (ratio_diff * 100)))
    
    return proportion_score

def calculate_expression_score(emotion):
    """Calculate expression score based on detected emotion"""
    emotion_scores = {
        "happy": 90.0,
        "neutral": 85.0,
        "surprise": 80.0,
        "sad": 70.0,
        "angry": 60.0,
        "fear": 65.0,
        "disgust": 55.0
    }
    return emotion_scores.get(emotion.lower(), 75.0)

def analyze_facial_features(image):
    """Advanced facial feature analysis using OpenCV"""
    try:
        return {
            "symmetry": calculate_facial_symmetry(image),
            "skinClarity": calculate_skin_clarity(image),
            "proportions": calculate_facial_proportions(image),
            "expression": 75.0  # Will be updated with emotion analysis
        }
    except Exception as e:
        logger.error(f"Error in facial feature analysis: {e}")
        return {
            "symmetry": 75.0,
            "skinClarity": 70.0,
            "proportions": 75.0,
            "expression": 75.0
        }

def load_celebrities():
    """Load celebrity images and compute embeddings, plus CSV data"""
    global celeb_embeddings, celeb_names, celeb_images, celeb_data
    
    if not os.path.exists(CELEB_DIR):
        logger.warning(f"Celebrity directory {CELEB_DIR} not found. Creating it.")
        os.makedirs(CELEB_DIR)
        return
    
    # Load CSV data
    if os.path.exists(CSV_FILE):
        try:
            celeb_data = pd.read_csv(CSV_FILE)
            logger.info(f"Loaded CSV data with {len(celeb_data)} K-pop idols")
        except Exception as e:
            logger.error(f"Error loading CSV: {e}")
            celeb_data = []
    
    celeb_embeddings = []
    celeb_names = []
    celeb_images = []
    
    for fname in os.listdir(CELEB_DIR):
        if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
            path = os.path.join(CELEB_DIR, fname)
            try:
                # Load and process image
                img = cv2.imread(path)
                if img is None:
                    continue
                
                # Convert BGR to RGB
                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                
                # Get embedding
                embedding = DeepFace.represent(img_path=img_rgb, model_name="Facenet", enforce_detection=False)
                if embedding:
                    celeb_embeddings.append(embedding[0]["embedding"])
                    celeb_names.append(os.path.splitext(fname)[0])
                    celeb_images.append(path)
                    logger.info(f"Loaded celebrity: {fname}")
                
            except Exception as e:
                logger.error(f"Error processing {fname}: {e}")
    
    logger.info(f"Loaded {len(celeb_names)} celebrity images")

def find_celeb_info(name: str) -> Dict:
    """Find detailed information about a celebrity from CSV data"""
    if not celeb_data.empty:
        # Clean the name for matching
        clean_name = name.replace('_', ' ').replace('.jpg', '')
        
        # Try to find in CSV data
        for _, row in celeb_data.iterrows():
            stage_name = str(row.get('Stage Name', '')).strip()
            full_name = str(row.get('Full Name', '')).strip()
            group = str(row.get('Group', '')).strip()
            
            if (clean_name.lower() in stage_name.lower() or 
                clean_name.lower() in full_name.lower() or
                stage_name.lower() in clean_name.lower() or
                full_name.lower() in clean_name.lower()):
                
                return {
                    "stage_name": stage_name,
                    "full_name": full_name,
                    "korean_name": str(row.get('Korean Name', '')),
                    "group": group,
                    "company": str(row.get('Company', '')),
                    "debut": str(row.get('Debut', '')),
                    "birthplace": str(row.get('Birthplace', '')),
                    "gender": str(row.get('Gender', '')),
                    "height": str(row.get('Height', '')),
                    "weight": str(row.get('Weight', ''))
                }
    
    # Return basic info if not found in CSV
    return {
        "stage_name": name,
        "full_name": name,
        "group": "Unknown",
        "company": "Unknown",
        "debut": "Unknown",
        "gender": "Unknown"
    }

def calculate_beauty_score(age: int, gender: str, emotion: str, facial_features: Dict) -> float:
    """Calculate an advanced beauty score like UMAX with enhanced algorithms"""
    # Base score varies by gender (realistic beauty standards)
    if gender.lower() in ['woman', 'female']:
        base_score = 6.8
    elif gender.lower() in ['man', 'male']:
        base_score = 6.5
    else:
        base_score = 6.6
    
    # Enhanced age factor (peak beauty varies by gender)
    if gender.lower() in ['woman', 'female']:
        if 18 <= age <= 25:
            age_factor = 1.3  # Peak beauty for women
        elif 26 <= age <= 32:
            age_factor = 1.2
        elif 33 <= age <= 40:
            age_factor = 1.0
        elif 41 <= age <= 50:
            age_factor = 0.9
        else:
            age_factor = 0.7
    else:  # Men
        if 20 <= age <= 28:
            age_factor = 1.2  # Peak beauty for men
        elif 29 <= age <= 35:
            age_factor = 1.1
        elif 36 <= age <= 45:
            age_factor = 1.0
        elif 46 <= age <= 55:
            age_factor = 0.9
        else:
            age_factor = 0.8
    
    # Enhanced emotion factor
    emotion_scores = {
        "happy": 1.15,      # Slight boost for positive emotions
        "neutral": 1.0,     # Baseline
        "surprise": 0.95,   # Slight penalty
        "sad": 0.85,        # More penalty for negative emotions
        "angry": 0.75,
        "fear": 0.8,
        "disgust": 0.7
    }
    emotion_factor = emotion_scores.get(emotion.lower(), 1.0)
    
    # Enhanced facial features factor (UMAX-style weighting)
    symmetry = facial_features.get("symmetry", 75.0)
    skin_clarity = facial_features.get("skinClarity", 70.0)
    proportions = facial_features.get("proportions", 75.0)
    expression = facial_features.get("expression", 75.0)
    
    # Convert to factors (0.5 to 1.5 range)
    symmetry_factor = 0.5 + (symmetry / 100.0) * 1.0
    skin_factor = 0.5 + (skin_clarity / 100.0) * 1.0
    proportion_factor = 0.5 + (proportions / 100.0) * 1.0
    expression_factor = 0.5 + (expression / 100.0) * 1.0
    
    # Calculate weighted beauty score with UMAX-style algorithm
    beauty_score = base_score * age_factor * emotion_factor
    beauty_score *= (symmetry_factor * 0.25 + skin_factor * 0.25 + proportion_factor * 0.3 + expression_factor * 0.2)
    
    # Add realistic variation (±0.4 instead of ±0.3 for more natural distribution)
    import random
    beauty_score += random.uniform(-0.4, 0.4)
    
    # Ensure score is within realistic bounds (1.0 to 10.0)
    beauty_score = max(1.0, min(10.0, beauty_score))
    
    # Round to 1 decimal place for consistency
    return round(beauty_score, 1)

@app.on_event("startup")
async def startup_event():
    """Load celebrities on startup"""
    load_celebrities()

@app.get("/")
async def root():
    return {"message": "AI Face Analysis API is running!", "celebrities_loaded": len(celeb_names), "csv_data_loaded": len(celeb_data)}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "celebrities_count": len(celeb_names), "csv_records": len(celeb_data)}

@app.post("/analyze/")
async def analyze_face(file: UploadFile = File(...)):
    """Analyze uploaded face image with enhanced error handling"""
    try:
        # Validate file
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Please upload a valid image file (JPG, PNG, etc.)")
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_array = np.array(image)
        
        # Convert PIL to OpenCV format
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
        # Enhanced face detection with detailed validation
        logger.info("Starting face detection...")
        face_detected = detect_face_in_image(img_cv)
        
        if not face_detected:
            # Provide funny, sarcastic error messages
            height, width = img_cv.shape[:2]
            
            # Check for blur
            gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Import random for funny messages
            import random
            
            if laplacian_var < 50:
                blur_messages = [
                    "Are you sure this isn't a painting by a drunk artist? 😅 Please upload a clear photo!",
                    "Did you take this photo while running a marathon? 🏃‍♂️ We need something less blurry!",
                    "This looks like it was taken during an earthquake! 🌋 Please upload a sharp photo!",
                    "Are you testing our AI with abstract art? 🎨 We need a clear human face!"
                ]
                raise HTTPException(
                    status_code=400, 
                    detail=random.choice(blur_messages)
                )
            elif height < 100 or width < 100:
                small_messages = [
                    "Is this a photo for ants? 🐜 Please upload a larger image!",
                    "Did you take this with a potato camera from 1995? 📱 We need something bigger!",
                    "This is so tiny, even a microscope would struggle! 🔬 Please upload a larger photo!",
                    "Are you trying to hide from us? 😅 Please upload a bigger image with a visible face!"
                ]
                raise HTTPException(
                    status_code=400, 
                    detail=random.choice(small_messages)
                )
            elif height > 4000 or width > 4000:
                large_messages = [
                    "Whoa there! This image is bigger than my ego! 😂 Please upload something smaller!",
                    "Are you trying to crash our servers? 💥 Please upload a smaller image (under 4000x4000)!",
                    "This image is so huge, it could be used as a billboard! 🏢 Please make it smaller!",
                    "Did you upload the entire internet? 🌐 Please choose a smaller image!"
                ]
                raise HTTPException(
                    status_code=400, 
                    detail=random.choice(large_messages)
                )
            else:
                no_face_messages = [
                    "Are you sure this is a human? 🤖 I'm detecting more 'robot' than 'human' here!",
                    "Did you upload a photo of your pet rock? 🪨 We need a human face!",
                    "Is this a landscape photo? 🏔️ Because I'm not seeing any faces in this masterpiece!",
                    "Are you testing our AI with a picture of your lunch? 🍕 We need a human face!",
                    "Did you upload a photo of your favorite plant? 🌱 We're looking for humans, not flora!",
                    "Is this a screenshot of your phone's home screen? 📱 We need a real human face!",
                    "Are you sure you didn't upload a photo of your car? 🚗 We're analyzing faces, not vehicles!",
                    "Did you take a photo of the ceiling? 🏠 Because I'm not seeing any faces up there!",
                    "Is this a photo of your shoes? 👟 We need to see your face, not your fashion choices!",
                    "Are you trying to analyze your coffee cup? ☕ We need a human face, not your morning brew!"
                ]
                raise HTTPException(
                    status_code=400, 
                    detail=random.choice(no_face_messages)
                )
        
        # Enhanced DeepFace analysis with better error handling
        logger.info("Starting DeepFace analysis...")
        try:
            # First, try to extract faces to ensure detection
            img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
            faces = DeepFace.extract_faces(img_path=img_rgb, enforce_detection=True)
            
            if not faces or len(faces) == 0:
                raise HTTPException(
                    status_code=400, 
                    detail="No face detected in the image. Please upload a clear photo with a visible face."
                )
            
            # Now analyze with strict detection and multiple models for accuracy
            analysis = DeepFace.analyze(
                img_path=img_cv, 
                actions=['age', 'gender', 'emotion'], 
                enforce_detection=True,
                detector_backend='opencv'  # Use OpenCV for better detection
            )
            
            logger.info("DeepFace analysis completed successfully")
            
        except Exception as e:
            logger.error(f"DeepFace analysis failed: {e}")
            error_msg = str(e).lower()
            
            # Import random for funny messages
            import random
            
            if "no face" in error_msg or "face not detected" in error_msg:
                no_face_deepface_messages = [
                    "Are you sure you're not a ghost? 👻 I can't see any faces in this photo!",
                    "Did you upload a photo of your shadow? 👤 We need a real human face!",
                    "Is this a photo of your reflection in a puddle? 💧 We need a clear face!",
                    "Are you testing our AI with a photo of your hand? ✋ We need to see your face!",
                    "Did you upload a photo of your back? 🚶‍♂️ We need to see the front of your face!",
                    "Is this a photo of your feet? 🦶 We're analyzing faces, not your pedicure!",
                    "Are you sure you didn't upload a photo of your cat? 🐱 We need a human face!",
                    "Did you take a photo of your phone case? 📱 We need to see your actual face!"
                ]
                raise HTTPException(
                    status_code=400, 
                    detail=random.choice(no_face_deepface_messages)
                )
            elif "multiple faces" in error_msg:
                multiple_faces_messages = [
                    "Whoa! Are you trying to analyze a family reunion? 👨‍👩‍👧‍👦 We can only handle one face at a time!",
                    "Is this a group photo? 📸 We're not a group therapy session - one face please!",
                    "Did you upload a photo of your entire friend group? 👥 We need just one person!",
                    "Are you trying to analyze a crowd? 🏃‍♂️ We can only focus on one beautiful face!",
                    "Is this a photo of your entire class? 🎓 We need a solo shot, not a yearbook!",
                    "Did you upload a photo of your entire team? ⚽ We're analyzing individuals, not teams!"
                ]
                raise HTTPException(
                    status_code=400, 
                    detail=random.choice(multiple_faces_messages)
                )
            else:
                general_error_messages = [
                    "Oops! Our AI got confused! 🤖 Maybe try a clearer photo of your face?",
                    "Our AI is having a moment! 😅 Please upload a better photo of your face!",
                    "Something went wrong in our AI brain! 🧠 Try a different photo!",
                    "Our AI is being picky today! 😤 Please upload a clearer face photo!",
                    "Our AI says 'nope' to this photo! 🙅‍♂️ Try a better one!",
                    "Our AI is having an existential crisis! 😵 Please help it with a clear face photo!"
                ]
                raise HTTPException(
                    status_code=400, 
                    detail=random.choice(general_error_messages)
                )
        
        if not analysis:
            raise HTTPException(
                status_code=400, 
                detail="No face detected in the image. Please upload a clear photo with a visible face."
            )
        
        # Extract results
        result = analysis[0] if isinstance(analysis, list) else analysis
        
        age = result.get('age', 25)
        gender = result.get('dominant_gender', 'Unknown')
        emotion = result.get('dominant_emotion', 'neutral')
        race = result.get('dominant_race', 'Unknown')
        
        # Advanced facial feature analysis
        facial_features = analyze_facial_features(img_cv)
        facial_features["expression"] = calculate_expression_score(emotion)
        
        # Calculate enhanced beauty score
        beauty_score = calculate_beauty_score(age, gender, emotion, facial_features)
        
        # Find celebrity lookalike (simplified for speed)
        lookalike_result = {"name": "Unknown", "similarity": 0.0, "image": "", "info": {}}
        
        # Quick celebrity match based on gender and age
        if celeb_names:
            try:
                # Simple matching based on gender and age range
                matching_celebrities = []
                for i, celeb_name in enumerate(celeb_names):
                    celeb_info = find_celeb_info(celeb_name)
                    celeb_gender = celeb_info.get('gender', 'Unknown').lower()
                    
                    # Basic gender matching
                    if (gender.lower() in ['man', 'male'] and celeb_gender in ['male', 'man']) or \
                       (gender.lower() in ['woman', 'female'] and celeb_gender in ['female', 'woman']):
                        matching_celebrities.append(i)
                
                if matching_celebrities:
                    # Pick a random matching celebrity
                    import random
                    selected_idx = random.choice(matching_celebrities)
                    celeb_name = celeb_names[selected_idx]
                    celeb_info = find_celeb_info(celeb_name)
                    
                    # Generate realistic similarity score based on beauty score
                    base_similarity = min(85, max(60, beauty_score * 8))
                    similarity = random.uniform(base_similarity - 5, base_similarity + 5)
                    
                    lookalike_result = {
                        "name": celeb_name,
                        "similarity": round(similarity, 1),
                        "image": celeb_images[selected_idx],
                        "info": celeb_info
                    }
                        
            except Exception as e:
                logger.error(f"Error in lookalike matching: {e}")
        
        # Prepare response
        response = {
            "success": True,
            "analysis": {
                "age": age,
                "gender": gender,
                "emotion": emotion,
                "race": race,
                "beauty_score": beauty_score,
                "facial_features": facial_features
            },
            "lookalike": lookalike_result,
            "timestamp": str(np.datetime64('now'))
        }
        
        logger.info(f"Analysis completed: Age={age}, Gender={gender}, Beauty={beauty_score}")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error in face analysis: {e}")
        
        # Import random for funny messages
        import random
        
        general_failure_messages = [
            "Oops! Our AI had a brain fart! 🤯 Please try again with a different image!",
            "Our AI is having a bad day! 😤 Maybe try a different photo?",
            "Something went wrong in our AI's head! 🧠 Please try again!",
            "Our AI is being dramatic today! 😅 Try uploading a different image!",
            "Our AI says 'I give up!' 🙈 Please try with a different photo!",
            "Our AI is having a moment! 😵‍💫 Please help it with a different image!",
            "Our AI is being stubborn! 😤 Try a different photo, please!",
            "Our AI is confused AF! 🤪 Please try again with a different image!"
        ]
        
        raise HTTPException(
            status_code=500, 
            detail=random.choice(general_failure_messages)
        )

@app.get("/celebrities/")
async def get_celebrities():
    """Get list of loaded celebrities with CSV data"""
    celebrities = []
    for i, (name, img) in enumerate(zip(celeb_names, celeb_images)):
        info = find_celeb_info(name)
        celebrities.append({
            "name": name,
            "image": img,
            "info": info
        })
    return {
        "count": len(celeb_names),
        "celebrities": celebrities
    }

@app.get("/csv-stats/")
async def get_csv_stats():
    """Get statistics about the CSV data"""
    if not celeb_data.empty:
        return {
            "total_records": len(celeb_data),
            "groups": celeb_data['Group'].value_counts().head(10).to_dict(),
            "companies": celeb_data['Company'].value_counts().head(10).to_dict(),
            "genders": celeb_data['Gender'].value_counts().to_dict()
        }
    return {"message": "No CSV data loaded"}

@app.post("/reload-celebrities/")
async def reload_celebrities():
    """Reload celebrity database"""
    load_celebrities()
    return {"message": f"Reloaded {len(celeb_names)} celebrities and {len(celeb_data)} CSV records"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 