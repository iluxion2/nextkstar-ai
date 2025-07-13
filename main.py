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
import requests
import random
import time
import gc

# Import OpenCV with error handling
try:
    import cv2
    CV2_AVAILABLE = True
except ImportError as e:
    logging.warning(f"OpenCV not available: {e}")
    CV2_AVAILABLE = False

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

def analyze_with_opencv(image_path: str):
    """Analyze image using OpenCV (simplified face analysis)"""
    if not CV2_AVAILABLE:
        raise Exception("OpenCV is not available")
    
    try:
        # Load image with OpenCV
        img = cv2.imread(image_path)
        if img is None:
            raise Exception("Could not load image")
        
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Load face cascade classifier
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            raise Exception("No faces detected")
        
        # Get the first face
        x, y, w, h = faces[0]
        
        # Simple analysis based on face size and position
        face_area = w * h
        image_area = img.shape[0] * img.shape[1]
        face_ratio = face_area / image_area
        
        # Estimate age based on face size (very simplified)
        estimated_age = 25 + int((face_ratio - 0.1) * 100)
        estimated_age = max(18, min(60, estimated_age))
        
        # Simple gender estimation (placeholder)
        estimated_gender = "Unknown"
        
        # Simple emotion estimation (placeholder)
        estimated_emotion = "neutral"
        
        return {
            'age': estimated_age,
            'gender': estimated_gender,
            'dominant_emotion': estimated_emotion,
            'face_detected': True,
            'face_count': len(faces)
        }
        
    except Exception as e:
        logger.error(f"OpenCV analysis error: {e}")
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

def generate_smart_real_insights(age: int, gender: str, beauty_score: float, emotion: str, facial_features: Dict) -> Dict:
    """Generate smart, real insights using free LLM and specific predictions"""
    
    # Create a detailed prompt for the AI
    prompt = f"""
    Based on this facial analysis, generate fun and engaging personality insights:
    
    Age: {age} years old
    Gender: {gender}
    Beauty Score: {beauty_score}/10
    Emotion: {emotion}
    Facial Features:
    - Symmetry: {facial_features['symmetry']:.1f}%
    - Skin Clarity: {facial_features['skinClarity']:.1f}%
    - Proportions: {facial_features['proportions']:.1f}%
    - Expression: {facial_features['expression']:.1f}%
    
    Generate 4 categories of insights:
    1. Achievements (like "Future K-pop Idol", "Class President Material")
    2. Personality Traits (like "Natural Leader", "Creative Genius")
    3. Future Predictions (like "Will become famous", "Will have amazing relationships")
    4. Fun Facts (like "Your smile lights up rooms", "You have mysterious aura")
    
    Make them fun, engaging, and personalized to the analysis results. Include emojis and be encouraging!
    """
    
    try:
        # Try Groq API first (free tier: 100 requests/day, super fast)
        groq_api_key = os.getenv('GROQ_API_KEY')
        if groq_api_key:
            headers = {
                'Authorization': f'Bearer {groq_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'llama2-70b-4096',  # Fast and free
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a fun, encouraging AI that analyzes facial features and generates entertaining personality insights. Be creative, use emojis, and make people feel special!'
                    },
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 500,
                'temperature': 0.8
            }
            
            response = requests.post('https://api.groq.com/openai/v1/chat/completions', headers=headers, json=data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
                logger.info("Used Groq API for insights")
                return parse_smart_response(ai_response, age, gender, beauty_score, facial_features)
        
        # Try OpenAI API if available
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if openai_api_key:
            headers = {
                'Authorization': f'Bearer {openai_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a fun, encouraging AI that analyzes facial features and generates entertaining personality insights. Be creative, use emojis, and make people feel special!'
                    },
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 500,
                'temperature': 0.8
            }
            
            response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
                logger.info("Used OpenAI API for insights")
                return parse_smart_response(ai_response, age, gender, beauty_score, facial_features)
        
        # Try Hugging Face Inference API (free tier: 30k requests/month)
        api_url = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large"
        headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY', '')}"}
        
        data = {
            'inputs': f"System: You are a fun AI that generates personality insights. User: {prompt}",
            'parameters': {
                'max_new_tokens': 500,
                'temperature': 0.8,
                'return_full_text': False
            }
        }
        
        if os.getenv('HUGGINGFACE_API_KEY'):
            response = requests.post(api_url, headers=headers, json=data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    ai_response = result[0].get('generated_text', '')
                    logger.info("Used Hugging Face API for insights")
                    return parse_smart_response(ai_response, age, gender, beauty_score, facial_features)
        
        # Fallback to local AI model or predefined responses
        logger.info("Using local AI insights (no API keys available)")
        return generate_smart_local_insights(age, gender, beauty_score, emotion, facial_features)
        
    except Exception as e:
        logger.warning(f"LLM generation failed: {e}")
        return generate_smart_local_insights(age, gender, beauty_score, emotion, facial_features)

def parse_smart_response(ai_response: str, age: int, gender: str, beauty_score: float, facial_features: Dict) -> Dict:
    """Parse AI response into structured format"""
    try:
        # Try to extract structured data from AI response
        insights = {
            "achievements": [],
            "personality_traits": [],
            "future_predictions": [],
            "fun_facts": []
        }
        
        # Simple parsing - look for patterns in the response
        lines = ai_response.split('\n')
        current_category = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if 'achievement' in line.lower() or '1.' in line:
                current_category = 'achievements'
            elif 'personality' in line.lower() or 'trait' in line.lower() or '2.' in line:
                current_category = 'personality_traits'
            elif 'future' in line.lower() or 'prediction' in line.lower() or '3.' in line:
                current_category = 'future_predictions'
            elif 'fun fact' in line.lower() or '4.' in line:
                current_category = 'fun_facts'
            elif current_category and line.startswith('-') or line.startswith('•'):
                insights[current_category].append(line[1:].strip())
        
        # If parsing failed, return the raw response
        if not any(insights.values()):
            insights["fun_facts"] = [ai_response]
            
        return insights
        
    except Exception as e:
        logger.warning(f"Failed to parse AI response: {e}")
        return {"fun_facts": [ai_response]}

def make_specific_achievement(age: int, gender: str, beauty_score: float, facial_features: Dict) -> str:
    """Make specific achievement based on analysis"""
    if beauty_score >= 9.0 and facial_features['symmetry'] > 90:
        return "👑 Future K-pop Idol - Your perfect symmetry is idol material!"
    elif beauty_score >= 8.5 and facial_features['expression'] > 80:
        return "🎭 Drama Club Star - Your expressive face is made for the stage!"
    elif beauty_score >= 8.0 and facial_features['skinClarity'] > 90:
        return "💎 Model Material - Your flawless skin is runway ready!"
    elif beauty_score >= 7.5 and facial_features['proportions'] > 85:
        return "🌟 Instagram Influencer - Your proportions are camera perfect!"
    elif age < 25:
        return "🚀 Young Achiever - You're going to accomplish amazing things!"
    else:
        return "💪 Life Champion - You've got what it takes to succeed!"

def make_specific_trait(facial_features: Dict) -> str:
    """Make specific personality trait based on facial features"""
    if facial_features['symmetry'] > 90:
        return "🎯 Balanced & Harmonious - You bring peace to any situation!"
    elif facial_features['skinClarity'] > 90:
        return "✨ Pure & Authentic - Your inner beauty shines through!"
    elif facial_features['expression'] > 85:
        return "💫 Expressive & Charismatic - You light up every room!"
    elif facial_features['proportions'] > 85:
        return "🌟 Well-Proportioned - You have natural elegance!"
    else:
        return "💎 Unique & Special - You're one of a kind!"

def make_specific_prediction(beauty_score: float, age: int) -> str:
    """Make specific future prediction"""
    if beauty_score >= 9.0:
        return "🌟 Will become internationally famous - The world will know your name!"
    elif beauty_score >= 8.0:
        return "💼 Will achieve great success - Your future is bright!"
    elif beauty_score >= 7.0:
        return "💫 Will inspire many people - You'll make a difference!"
    elif age < 25:
        return "🚀 Will discover amazing talents - Your potential is unlimited!"
    else:
        return "💪 Will overcome all challenges - You're unstoppable!"

def make_specific_fact(emotion: str, facial_features: Dict) -> str:
    """Make specific fun fact"""
    if emotion == "happy":
        return "😊 Your smile could power a data center - It's that efficient!"
    elif emotion == "neutral":
        return "🎭 You have mysterious energy - Like a quantum particle!"
    elif facial_features['symmetry'] > 90:
        return "🎯 Your face is mathematically perfect - Like a theorem!"
    elif facial_features['skinClarity'] > 90:
        return "✨ Your skin is like a high-resolution display - Crystal clear!"
    else:
        return "💎 You're like a rare algorithm - Unique and powerful!"

def generate_smart_local_insights(age: int, gender: str, beauty_score: float, emotion: str, facial_features: Dict) -> Dict:
    """Generate smart local insights when LLM is not available"""
    
    insights = {
        "achievements": [make_specific_achievement(age, gender, beauty_score, facial_features)],
        "personality_traits": [make_specific_trait(facial_features)],
        "future_predictions": [make_specific_prediction(beauty_score, age)],
        "fun_facts": [make_specific_fact(emotion, facial_features)]
    }
    
    return insights

def generate_smart_comment(beauty_score: float, insights: Dict, age: int, gender: str) -> str:
    """Generate smart, specific comments"""
    
    # Get the first achievement for a specific comment
    achievement = insights["achievements"][0] if insights["achievements"] else "Future Legend"
    
    if beauty_score >= 9.0:
        if age < 25:
            return f"🔥 HOLY MOLY! {achievement}! This is absolutely INSANE! 🔥"
        else:
            return f"👑 WTF! {achievement}! You're the real deal! 👑"
    elif beauty_score >= 8.0:
        return f"🌟 DAMN! {achievement}! This is next level! 🌟"
    elif beauty_score >= 7.0:
        return f"💫 WOW! {achievement}! You're going places! 💫"
    elif beauty_score >= 6.0:
        return f"✨ NICE! {achievement}! You've got potential! ✨"
    else:
        return f"💎 COOL! {achievement}! You're unique! 💎"

@app.on_event("startup")
async def startup_event():
    """Load celebrities on startup"""
    load_celebrities()

@app.get("/")
async def root():
    """Root endpoint with API status"""
    return {
        "message": "AI Face Analysis API is running!",
        "celebrities_loaded": len(celeb_names),
        "csv_data_loaded": len(celeb_data),
        "opencv_available": CV2_AVAILABLE,
        "llm_apis": {
            "groq": bool(os.getenv('GROQ_API_KEY')),
            "openai": bool(os.getenv('OPENAI_API_KEY')),
            "huggingface": bool(os.getenv('HUGGINGFACE_API_KEY'))
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": str(np.datetime64('now'))}

@app.post("/analyze/")
async def analyze_face(file: UploadFile = File(...)):
    """Analyze uploaded face image with OpenCV and AI insights"""
    try:
        # Validate file
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Please upload a valid image file (JPG, PNG, etc.)")
        
        temp_path = f"temp_{int(time.time())}_{random.randint(1000, 9999)}.jpg"
        
        try:
            contents = await file.read()
            with open(temp_path, "wb") as f:
                f.write(contents)
            
            # Analyze with OpenCV
            logger.info("Starting OpenCV face analysis...")
            result = analyze_with_opencv(temp_path)
            
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
            
            # Generate smart, real insights using LLM APIs
            insights = generate_smart_real_insights(age, gender, beauty_score, emotion, facial_features)
            
            # Generate smart comment
            fun_comment = generate_smart_comment(beauty_score, insights, age, gender)
            
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
                "personality_insights": insights,
                "fun_comment": fun_comment,
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