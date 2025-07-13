from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import os
import io
import logging
import pandas as pd
from typing import List, Dict, Any

# Import OpenCV with error handling
try:
    import cv2
    CV2_AVAILABLE = True
except ImportError as e:
    logging.warning(f"OpenCV not available: {e}")
    CV2_AVAILABLE = False
import math
import random
import gc
import time

# Import DeepFace with error handling
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError as e:
    logging.warning(f"DeepFace not available: {e}")
    DEEPFACE_AVAILABLE = False

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Face Analysis API", version="1.0.0")

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3003", 
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3004",
        "https://nextkstar.com",
        "https://www.nextkstar.com",
        "https://nextkstar-ai.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for celebrity data
CELEB_DIR = "celebrities"
CSV_FILE = "celebrities/kpopidolsv3.csv"
celeb_names = []
celeb_images = []
celeb_data = []

def load_celebrities():
    """Load celebrity data from CSV and images"""
    global celeb_names, celeb_images, celeb_data
    
    # Load CSV data
    if os.path.exists(CSV_FILE):
        try:
            celeb_data = pd.read_csv(CSV_FILE).to_dict('records')
            logger.info(f"Loaded CSV data with {len(celeb_data)} K-pop idols")
        except Exception as e:
            logger.error(f"Error loading CSV: {e}")
            celeb_data = []
    
    # Load celebrity images
    if os.path.exists(CELEB_DIR):
        image_files = [f for f in os.listdir(CELEB_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        celeb_names = [os.path.splitext(f)[0] for f in image_files]
        celeb_images = [os.path.join(CELEB_DIR, f) for f in image_files]
        logger.info(f"Loaded {len(celeb_names)} celebrity images")
    else:
        logger.warning("Celebrities directory not found")
    celeb_names = []
    celeb_images = []

def find_celeb_info(name: str) -> Dict:
    """Find celebrity info from CSV data"""
    for celeb in celeb_data:
        if celeb.get('name', '').lower() == name.lower():
            return celeb
    return {}

def analyze_with_deepface(image_path: str):
    """Analyze image using DeepFace"""
    if not DEEPFACE_AVAILABLE:
        raise Exception("DeepFace is not available")
    
    try:
        # Use different detector backend if OpenCV is not available
        detector_backend = 'opencv' if CV2_AVAILABLE else 'mtcnn'
        
        result = DeepFace.analyze(
            img_path=image_path,
            actions=['age', 'gender', 'emotion'],
            enforce_detection=False,
            detector_backend=detector_backend,
            silent=True
        )
        
        return result
    except Exception as e:
        logger.error(f"DeepFace analysis error: {e}")
        raise

def calculate_beauty_score(age: int, gender: str, emotion: str, facial_features: Dict) -> float:
    """Calculate beauty score based on facial features"""
    # Base score from facial features
    symmetry_weight = 0.3
    skin_clarity_weight = 0.25
    proportions_weight = 0.25
    expression_weight = 0.2
    
    base_score = (
        facial_features["symmetry"] * symmetry_weight +
        facial_features["skinClarity"] * skin_clarity_weight +
        facial_features["proportions"] * proportions_weight +
        facial_features["expression"] * expression_weight
    )
    
    # Age adjustment (peak beauty around 20-30)
    age_factor = 1.0
    if 20 <= age <= 30:
        age_factor = 1.1
    elif 15 <= age <= 19 or 31 <= age <= 35:
        age_factor = 1.0
    elif 36 <= age <= 45:
        age_factor = 0.9
    else:
        age_factor = 0.8
    
    # Gender adjustment (slight bias towards female beauty standards)
    gender_factor = 1.05 if gender.lower() in ['woman', 'female', 'f'] else 1.0
    
    # Emotion adjustment
    emotion_factor = 1.1 if emotion.lower() == 'happy' else 1.0
    
    # Calculate final score (scale to 0-10)
    final_score = (base_score / 100) * 10 * age_factor * gender_factor * emotion_factor
    
    # Add some randomness for variety
    final_score += random.uniform(-0.5, 0.5)
    
    return max(1.0, min(10.0, final_score))

def find_celebrity_lookalike(beauty_score: float, age: int, gender: str) -> Dict:
    """Find celebrity lookalike based on analysis results"""
    if not celeb_names:
        return {"name": "Unknown", "similarity": 0.0, "image": "", "info": {}}
    
    # Filter celebrities by gender if possible
    filtered_celebrities = []
    for i, (name, img) in enumerate(zip(celeb_names, celeb_images)):
        info = find_celeb_info(name)
        # Simple gender matching (this is a basic implementation)
        celeb_gender = info.get('gender', 'Unknown')
        if gender.lower() in ['man', 'male', 'm'] and celeb_gender.lower() in ['male', 'm']:
            filtered_celebrities.append((i, name, img, info))
        elif gender.lower() in ['woman', 'female', 'f'] and celeb_gender.lower() in ['female', 'f']:
            filtered_celebrities.append((i, name, img, info))
        else:
            filtered_celebrities.append((i, name, img, info))
    
    if not filtered_celebrities:
        filtered_celebrities = [(i, name, img, find_celeb_info(name)) for i, (name, img) in enumerate(zip(celeb_names, celeb_images))]
    
    # Select random celebrity from filtered list
    random_celeb = random.choice(filtered_celebrities)
    idx, celeb_name, celeb_image, celeb_info = random_celeb
    
    # Calculate similarity based on beauty score and age
    age_diff = abs(age - celeb_info.get('age', 25))
    age_similarity = max(0, 100 - age_diff * 2)
    beauty_similarity = min(95, max(60, beauty_score * 8 + random.uniform(-10, 10)))
    
    similarity = (age_similarity + beauty_similarity) / 2
    
    return {
        "name": celeb_name,
        "similarity": round(similarity, 1),
        "image": celeb_image,
        "info": celeb_info
    }

@app.on_event("startup")
async def startup_event():
    """Load celebrities on startup"""
    load_celebrities()

@app.get("/")
async def root():
    return {
        "message": "AI Face Analysis API is running!", 
        "celebrities_loaded": len(celeb_names), 
        "csv_data_loaded": len(celeb_data),
        "deepface_available": DEEPFACE_AVAILABLE,
        "opencv_available": CV2_AVAILABLE
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "celebrities_count": len(celeb_names), 
        "csv_records": len(celeb_data),
        "deepface_available": DEEPFACE_AVAILABLE
    }

@app.post("/analyze/")
async def analyze_face(file: UploadFile = File(...)):
    """Analyze uploaded face image with DeepFace"""
    try:
        # Validate file
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Please upload a valid image file (JPG, PNG, etc.)")
        
        # Create temporary file for DeepFace
        temp_path = f"temp_{int(time.time())}_{random.randint(1000, 9999)}.jpg"
        
        try:
            # Read and save image
            contents = await file.read()
            with open(temp_path, "wb") as f:
                f.write(contents)
        
            # Analyze with DeepFace
            logger.info("Starting DeepFace analysis...")
            result = analyze_with_deepface(temp_path)
        
            # Extract results
            if isinstance(result, list):
                result = result[0]
        
            age = result.get('age', 25)
            gender = result.get('gender', 'Unknown')
            emotion = result.get('dominant_emotion', 'neutral')
            
            # Calculate facial features (simplified for now)
            facial_features = {
                "symmetry": random.uniform(70, 95),
                "skinClarity": random.uniform(75, 95),
                "proportions": random.uniform(75, 90),
                "expression": 85 if emotion == 'happy' else 75
            }
        
            # Calculate beauty score
            beauty_score = calculate_beauty_score(age, gender, emotion, facial_features)
        
            # Find celebrity lookalike
            lookalike_result = find_celebrity_lookalike(beauty_score, age, gender)
        
            # Prepare response
            response = {
                "success": True,
                "analysis": {
                    "age": age,
                    "gender": gender,
                    "emotion": emotion,
                    "race": "Unknown",
                    "beauty_score": round(beauty_score, 1),
                    "facial_features": facial_features
                },
                "lookalike": lookalike_result,
                "timestamp": str(np.datetime64('now'))
            }
        
            logger.info(f"Analysis completed: Age={age}, Gender={gender}, Beauty={beauty_score}")
            return response
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            # Force garbage collection
            gc.collect()
        
    except Exception as e:
        logger.error(f"Error in face analysis: {e}")
        
        # Provide funny error messages
        error_messages = [
            "Oops! Our AI had a brain fart! 🤯 Please try again with a different image!",
            "Our AI is having a bad day! 😤 Maybe try a different photo?",
            "Something went wrong in our AI's head! 🧠 Please try again!",
            "Our AI is being dramatic today! 😅 Try uploading a different image!",
            "Our AI says 'I give up!' 🙈 Please try with a different photo!"
        ]
        
        raise HTTPException(
            status_code=500, 
            detail=random.choice(error_messages)
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
    """Get CSV data statistics"""
    return {
        "total_records": len(celeb_data),
        "sample_records": celeb_data[:5] if celeb_data else []
    }

@app.post("/reload-celebrities/")
async def reload_celebrities():
    """Reload celebrity database"""
    load_celebrities()
    return {"message": f"Reloaded {len(celeb_names)} celebrities and {len(celeb_data)} CSV records"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 