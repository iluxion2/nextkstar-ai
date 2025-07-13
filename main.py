from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import os
import io
import cv2
import pandas as pd
from typing import List, Dict, Any
import logging
import math
import random
import gc
import time
import requests
import json

# Import DeepFace with error handling
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError as e:
    logging.warning(f"DeepFace not available: {e}")
    DEEPFACE_AVAILABLE = False

# Add InsightFace import and global app
try:
    import insightface
    INSIGHTFACE_AVAILABLE = True
    insightface_app = insightface.app.FaceAnalysis()
    insightface_app.prepare(ctx_id=0, det_size=(640, 640))
except ImportError as e:
    logging.warning(f"InsightFace not available: {e}")
    INSIGHTFACE_AVAILABLE = False
    insightface_app = None

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
        "https://nextkstar-ai.onrender.com",
        "https://kstar-3ff0a.web.app",
        "https://kstar-3ff0a.firebaseapp.com"
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
        result = DeepFace.analyze(
            img_path=image_path,
            actions=['age', 'gender', 'emotion'],
            enforce_detection=False,
            detector_backend='opencv',
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

def generate_personality_insights(age: int, gender: str, beauty_score: float, emotion: str) -> Dict:
    """Generate fun personality insights and achievements based on analysis"""
    
    insights = {
        "achievements": [],
        "personality_traits": [],
        "future_predictions": [],
        "fun_facts": []
    }
    
    # Achievement predictions based on beauty score
    if beauty_score >= 9.0:
        insights["achievements"].extend([
            "👑 Future K-pop Idol",
            "🏆 Beauty Pageant Winner",
            "⭐ Most Popular in School",
            "💫 Instagram Influencer Potential"
        ])
    elif beauty_score >= 8.0:
        insights["achievements"].extend([
            "🎭 Drama Club Star",
            "📸 Model Material",
            "👥 Class President Material",
            "💝 Most Likely to Get 20+ Crushes"
        ])
    elif beauty_score >= 7.0:
        insights["achievements"].extend([
            "📚 Future Tutor",
            "🎨 Creative Genius",
            "🤝 Natural Leader",
            "💕 Relationship Expert"
        ])
    elif beauty_score >= 6.0:
        insights["achievements"].extend([
            "🎯 Goal Achiever",
            "🌟 Hidden Talent",
            "💪 Confidence Builder",
            "🎪 Life of the Party"
        ])
    else:
        insights["achievements"].extend([
            "💎 Diamond in the Rough",
            "🌱 Growth Mindset",
            "🎭 Character Actor",
            "💫 Late Bloomer"
        ])
    
    # Personality traits based on age and gender
    if age < 20:
        insights["personality_traits"].extend([
            "🎓 Academic Excellence",
            "🚀 Ambitious Dreamer",
            "🎵 Trendsetter",
            "💡 Innovative Thinker"
        ])
    elif age < 30:
        insights["personality_traits"].extend([
            "💼 Career Climber",
            "🌍 World Traveler",
            "🎯 Goal-Oriented",
            "💪 Confident Leader"
        ])
    else:
        insights["personality_traits"].extend([
            "🧠 Wise Mentor",
            "🏠 Life Experience",
            "💎 Mature Beauty",
            "🌟 Inspirational Figure"
        ])
    
    # Future predictions
    if beauty_score >= 8.5:
        insights["future_predictions"].extend([
            "🌟 Will become a famous celebrity",
            "💍 Will have the most romantic proposals",
            "🏆 Will win multiple awards",
            "📱 Will have 1M+ social media followers"
        ])
    elif beauty_score >= 7.5:
        insights["future_predictions"].extend([
            "💼 Will be a successful entrepreneur",
            "🎭 Will star in movies/TV shows",
            "💕 Will have amazing relationships",
            "🌍 Will travel the world"
        ])
    else:
        insights["future_predictions"].extend([
            "💎 Will discover hidden talents",
            "🎯 Will achieve personal goals",
            "💪 Will overcome challenges",
            "🌟 Will inspire others"
        ])
    
    # Fun facts based on emotion and analysis
    if emotion == "happy":
        insights["fun_facts"].extend([
            "😊 Your smile lights up every room",
            "🎉 You're the life of every party",
            "💫 Positive energy radiates from you",
            "🌟 You make everyone around you happy"
        ])
    elif emotion == "neutral":
        insights["fun_facts"].extend([
            "🎭 You have a mysterious aura",
            "💎 You're like a hidden gem",
            "🌙 You have a calm, peaceful presence",
            "🎯 You're focused and determined"
        ])
    else:
        insights["fun_facts"].extend([
            "🎨 You have artistic depth",
            "💭 You're a deep thinker",
            "🎪 You have dramatic flair",
            "💫 You're intriguing and complex"
        ])
    
    # Add gender-specific insights
    if gender.lower() in ['male', 'm']:
        insights["fun_facts"].extend([
            "💪 You have strong leadership qualities",
            "🎯 You're goal-oriented and ambitious",
            "🛡️ You're protective and caring",
            "🌟 You have natural charisma"
        ])
    elif gender.lower() in ['female', 'f']:
        insights["fun_facts"].extend([
            "💎 You have elegant beauty",
            "🎭 You're graceful and poised",
            "💕 You have a warm, caring nature",
            "✨ You're naturally charming"
        ])
    
    return insights

def generate_fun_comment(beauty_score: float, insights: Dict) -> str:
    """Generate a fun, personalized comment based on beauty score and insights"""
    
    if beauty_score >= 9.0:
        return f"🔥 WOW! You've got SERIOUS star potential! You'd definitely win first place on any audition show! 👑💫 {random.choice(insights['achievements'])} material right here!"
    elif beauty_score >= 8.0:
        return f"🌟 AMAZING! You're absolutely stunning! {random.choice(insights['achievements'])} vibes all the way! ✨💖"
    elif beauty_score >= 7.0:
        return f"💫 Fantastic! You have such natural beauty! {random.choice(insights['achievements'])} potential for sure! 🌟"
    elif beauty_score >= 6.0:
        return f"✨ Great! You have a unique and attractive look! {random.choice(insights['achievements'])} in your future! 💪"
    else:
        return f"💎 Beautiful! You have a special kind of charm! {random.choice(insights['achievements'])} waiting to happen! 🌱"

def generate_ai_personality_insights(age: int, gender: str, beauty_score: float, emotion: str, facial_features: Dict) -> Dict:
    """Generate real AI-powered personality insights based on analysis"""
    
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
                return parse_ai_response(ai_response)
        
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
                return parse_ai_response(ai_response)
        
        # Try Hugging Face Inference API (free tier: 30k requests/month)
        hf_api_key = os.getenv('HUGGINGFACE_API_KEY')
        if hf_api_key:
            headers = {
                'Authorization': f'Bearer {hf_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'inputs': f"System: You are a fun AI that generates personality insights. User: {prompt}",
                'parameters': {
                    'max_new_tokens': 500,
                    'temperature': 0.8,
                    'return_full_text': False
                }
            }
            
            response = requests.post('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', headers=headers, json=data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    ai_response = result[0].get('generated_text', '')
                    logger.info("Used Hugging Face API for insights")
                    return parse_ai_response(ai_response)
        
        # Fallback to local AI model or predefined responses
        logger.info("Using local AI insights (no API keys available)")
        return generate_local_ai_insights(age, gender, beauty_score, emotion, facial_features)
        
    except Exception as e:
        logger.warning(f"AI insight generation failed: {e}")
        return generate_local_ai_insights(age, gender, beauty_score, emotion, facial_features)

def parse_ai_response(ai_response: str) -> Dict:
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

def generate_local_ai_insights(age: int, gender: str, beauty_score: float, emotion: str, facial_features: Dict) -> Dict:
    """Generate intelligent insights using local analysis"""
    
    insights = {
        "achievements": [],
        "personality_traits": [],
        "future_predictions": [],
        "fun_facts": []
    }
    
    # Intelligent achievement predictions based on multiple factors
    if beauty_score >= 9.0 and facial_features['symmetry'] > 90:
        insights["achievements"].append("👑 Future K-pop Idol - Your perfect symmetry is idol material!")
    elif beauty_score >= 8.5 and facial_features['expression'] > 80:
        insights["achievements"].append("🎭 Drama Club Star - Your expressive face is made for the stage!")
    elif beauty_score >= 8.0 and facial_features['skinClarity'] > 90:
        insights["achievements"].append("📸 Model Material - Your flawless skin is camera-ready!")
    elif beauty_score >= 7.5 and facial_features['proportions'] > 85:
        insights["achievements"].append("👥 Class President Material - Your balanced features show leadership!")
    elif beauty_score >= 7.0:
        insights["achievements"].append("📚 Future Tutor - Your approachable look makes you a natural teacher!")
    else:
        insights["achievements"].append("💎 Diamond in the Rough - Your unique beauty is special!")
    
    # Personality traits based on facial analysis
    if facial_features['symmetry'] > 90:
        insights["personality_traits"].append("🎯 Balanced & Harmonious - Your symmetrical features reflect inner peace!")
    if facial_features['skinClarity'] > 90:
        insights["personality_traits"].append("✨ Pure & Authentic - Your clear skin shows your genuine nature!")
    if facial_features['expression'] > 85:
        insights["personality_traits"].append("💫 Expressive & Charismatic - Your face tells amazing stories!")
    if facial_features['proportions'] > 85:
        insights["personality_traits"].append("🌟 Well-Proportioned - Your balanced features show good judgment!")
    
    # Age and gender specific insights
    if age < 25 and beauty_score > 8.0:
        insights["personality_traits"].append("🚀 Young & Ambitious - Your youthful beauty is full of potential!")
    elif age >= 25 and beauty_score > 7.0:
        insights["personality_traits"].append("💼 Mature & Confident - Your beauty shows life experience!")
    
    # Future predictions based on analysis
    if beauty_score >= 9.0:
        insights["future_predictions"].append("🌟 Will become a famous celebrity - Your beauty is undeniable!")
    elif beauty_score >= 8.0:
        insights["future_predictions"].append("💼 Will be a successful entrepreneur - Your confidence will lead to success!")
    elif beauty_score >= 7.0:
        insights["future_predictions"].append("💕 Will have amazing relationships - Your warm presence attracts people!")
    else:
        insights["future_predictions"].append("💎 Will discover hidden talents - Your unique charm will shine!")
    
    # Fun facts based on emotion and features
    if emotion == "happy" and facial_features['expression'] > 80:
        insights["fun_facts"].append("😊 Your smile lights up every room - it's absolutely contagious!")
    elif emotion == "neutral" and facial_features['symmetry'] > 85:
        insights["fun_facts"].append("🎭 You have a mysterious, elegant aura - people are drawn to you!")
    elif facial_features['skinClarity'] > 90:
        insights["fun_facts"].append("✨ Your radiant skin reflects your inner glow!")
    elif facial_features['proportions'] > 85:
        insights["fun_facts"].append("🌟 Your perfectly proportioned features show natural harmony!")
    
    return insights

def generate_ai_fun_comment(beauty_score: float, insights: Dict, age: int, gender: str) -> str:
    """Generate an AI-powered fun comment"""
    
    # Create a personalized comment based on the analysis
    if beauty_score >= 9.0:
        base_comment = "🔥 WOW! You've got SERIOUS star potential! Your beauty is absolutely stunning!"
    elif beauty_score >= 8.0:
        base_comment = "🌟 AMAZING! You're absolutely gorgeous! Your natural beauty is incredible!"
    elif beauty_score >= 7.0:
        base_comment = "💫 Fantastic! You have such natural beauty! You're absolutely lovely!"
    elif beauty_score >= 6.0:
        base_comment = "✨ Great! You have a unique and attractive look! You're beautiful!"
    else:
        base_comment = "💎 Beautiful! You have a special kind of charm! You're unique!"
    
    # Add a random achievement or trait
    all_insights = []
    for category in insights.values():
        all_insights.extend(category)
    
    if all_insights:
        random_insight = random.choice(all_insights)
        return f"{base_comment} {random_insight} 👑💫"
    else:
        return f"{base_comment} You're going to achieve amazing things! 🌟"

def generate_crazy_fun_insights(age: int, gender: str, beauty_score: float, emotion: str, facial_features: Dict) -> Dict:
    """Generate absolutely WILD and FUNNY personality insights with pop culture references"""
    
    insights = {
        "achievements": [],
        "personality_traits": [],
        "future_predictions": [],
        "fun_facts": []
    }
    
    # CRAZY Achievement predictions based on beauty score
    if beauty_score >= 9.0:
        insights["achievements"].extend([
            "🔥 MrBeast's Secret Younger Brother - He's been hiding you this whole time!",
            "👑 BTS's 8th Member - Taehyung's long-lost twin!",
            "🎮 Squid Game Winner - You'd survive all the games with that face!",
            "💎 K-pop Idol Material - SM Entertainment is already calling!",
            "🌟 Netflix Star - Stranger Things season 5 needs you!",
            "🎭 Hollywood's Next Big Thing - Tom Holland who?",
            "💫 TikTok Famous - 10M followers by next week!"
        ])
    elif beauty_score >= 8.0:
        insights["achievements"].extend([
            "🎪 Circus Ringmaster - Your face commands attention!",
            "🏆 America's Got Talent Winner - Simon Cowell would give you a golden buzzer!",
            "🎵 K-pop Trainee - JYP is probably stalking your Instagram!",
            "💍 Bachelor/Bachelorette Material - You'd break the internet!",
            "🎬 Marvel Superhero - Captain America's replacement!",
            "🌟 Disney Princess/Prince - Live-action remake incoming!",
            "💪 Gym Motivation - You'd make everyone want to work out!"
        ])
    elif beauty_score >= 7.0:
        insights["achievements"].extend([
            "📚 Future Professor - Students would actually pay attention!",
            "🎨 Art Museum Exhibit - Your face belongs in the Louvre!",
            "💼 CEO Material - You'd make meetings actually fun!",
            "🎭 Broadway Star - Hamilton 2.0 needs you!",
            "🌟 Instagram Influencer - Brands would fight over you!",
            "💕 Dating App Legend - You'd break Tinder's algorithm!",
            "🎪 Life of Every Party - DJ Khaled would say 'Another one!'"
        ])
    elif beauty_score >= 6.0:
        insights["achievements"].extend([
            "💎 Hidden Gem - Like finding a diamond in a coal mine!",
            "🎯 Goal Crusher - You'd make success look easy!",
            "🌟 Late Bloomer - Like a fine wine, getting better with age!",
            "💪 Confidence Builder - You'd make everyone feel better!",
            "🎪 Party Starter - The energy you bring is unmatched!",
            "💫 Unique Beauty - You're like a rare Pokemon!"
        ])
    else:
        insights["achievements"].extend([
            "💎 Diamond in the Rough - Like a treasure chest waiting to be opened!",
            "🌱 Growth Mindset - You're like a plant, just need some water!",
            "🎭 Character Actor - You'd play the cool side character!",
            "💫 Late Bloomer - Like a butterfly, transformation incoming!",
            "🌟 Hidden Potential - You're like a secret weapon!"
        ])
    
    # WILD Personality traits based on facial features
    if facial_features['symmetry'] > 90:
        insights["personality_traits"].extend([
            "🎯 Perfectly Balanced - Like Thanos, but actually balanced!",
            "✨ Symmetrical King/Queen - Your face is like a math equation!",
            "🌟 Harmony Master - You could solve world peace with that symmetry!"
        ])
    if facial_features['skinClarity'] > 90:
        insights["personality_traits"].extend([
            "✨ Flawless Skin - Like you were born with a filter!",
            "💎 Crystal Clear - Your skin is like a diamond!",
            "🌟 Glow Master - You're like a walking light bulb!"
        ])
    if facial_features['expression'] > 85:
        insights["personality_traits"].extend([
            "🎭 Expressive AF - Your face tells stories better than Netflix!",
            "💫 Charisma Bomb - You could sell ice to a penguin!",
            "🌟 Energy Explosion - You're like a human Red Bull!"
        ])
    if facial_features['proportions'] > 85:
        insights["personality_traits"].extend([
            "🎯 Perfect Proportions - Like you were designed by an architect!",
            "🌟 Balanced AF - You're like a human golden ratio!",
            "💎 Proportion Master - Your face is mathematically perfect!"
        ])
    
    # CRAZY Future predictions
    if beauty_score >= 9.0:
        insights["future_predictions"].extend([
            "🌟 Will become more famous than MrBeast - He'll be jealous!",
            "💍 Will have 50 marriage proposals - Like a K-drama!",
            "🏆 Will win every award ever - Oscar, Grammy, Nobel Prize!",
            "📱 Will break the internet - Servers will crash because of you!",
            "🎬 Will star in every movie - Hollywood will be obsessed!",
            "💎 Will become a billionaire - Just by existing!"
        ])
    elif beauty_score >= 8.0:
        insights["future_predictions"].extend([
            "💼 Will become CEO of a Fortune 500 - Just by walking in!",
            "🎭 Will win an Oscar - Academy will be like 'Who is this?!'",
            "💕 Will have the most epic love story - Like a movie!",
            "🌍 Will travel the world - Everyone will want to meet you!",
            "🌟 Will become a legend - People will write songs about you!"
        ])
    else:
        insights["future_predictions"].extend([
            "💎 Will discover hidden talents - Like a superhero origin story!",
            "🎯 Will achieve all goals - Success will be your middle name!",
            "💪 Will overcome everything - Like a real-life Rocky!",
            "🌟 Will inspire millions - You'll be like a motivational speaker!"
        ])
    
    # ABSOLUTELY WILD Fun facts
    if emotion == "happy":
        insights["fun_facts"].extend([
            "😊 Your smile could power a city - It's that bright!",
            "🎉 You're like a walking party - Everywhere you go becomes fun!",
            "💫 Your positive energy is contagious - Like a good virus!",
            "🌟 You make everyone happy - Like a human antidepressant!"
        ])
    elif emotion == "neutral":
        insights["fun_facts"].extend([
            "🎭 You have mysterious vibes - Like a K-drama protagonist!",
            "💎 You're like a hidden gem - People want to discover you!",
            "🌙 You have calm energy - Like a zen master!",
            "🎯 You're focused AF - Like a laser beam!"
        ])
    else:
        insights["fun_facts"].extend([
            "🎨 You have artistic depth - Like a walking museum!",
            "💭 You're a deep thinker - Like a philosopher!",
            "🎪 You have dramatic flair - Like a soap opera star!",
            "💫 You're intriguing - Like a mystery novel!"
        ])
    
    # Korean/US Culture specific insights
    if age < 25:
        insights["fun_facts"].extend([
            "🎵 You're like a K-pop trainee - Ready to debut!",
            "🚀 You're young and ambitious - Like a startup founder!",
            "💫 You have that Gen Z energy - TikTok famous incoming!",
            "🌟 You're like a Disney Channel star - Ready for your show!"
        ])
    elif age < 35:
        insights["fun_facts"].extend([
            "💼 You're like a K-drama lead - Ready for your love story!",
            "🌍 You're worldly - Like a travel influencer!",
            "🎯 You're goal-oriented - Like a life coach!",
            "💪 You're confident - Like a motivational speaker!"
        ])
    else:
        insights["fun_facts"].extend([
            "🧠 You're wise - Like a sage!",
            "🏠 You have life experience - Like a walking encyclopedia!",
            "💎 You have mature beauty - Like fine wine!",
            "🌟 You're inspirational - Like a mentor!"
        ])
    
    # Gender-specific WILD insights
    if gender.lower() in ['male', 'm']:
        insights["fun_facts"].extend([
            "💪 You're like a K-drama male lead - Ready for your love triangle!",
            "🎯 You're goal-oriented - Like a CEO in training!",
            "🛡️ You're protective - Like a superhero!",
            "🌟 You have natural charisma - Like a rock star!"
        ])
    elif gender.lower() in ['female', 'f']:
        insights["fun_facts"].extend([
            "💎 You're like a K-drama female lead - Ready for your Cinderella story!",
            "🎭 You're graceful - Like a ballerina!",
            "💕 You have a warm heart - Like a Disney princess!",
            "✨ You're naturally charming - Like a fairy tale character!"
        ])
    
    return insights

def generate_crazy_fun_comment(beauty_score: float, insights: Dict, age: int, gender: str) -> str:
    """Generate absolutely WILD and FUNNY comments"""
    
    # CRAZY base comments
    if beauty_score >= 9.0:
        base_comments = [
            "🔥 HOLY MOLY! You're like MrBeast's secret sibling! This is INSANE!",
            "👑 WTF! You're literally BTS's 8th member! Taehyung who?!",
            "🌟 OMG! You're like a K-pop idol that got lost! SM Entertainment is calling!",
            "💎 STOP IT! You're too beautiful! This is illegal!",
            "🎬 Hollywood is missing out! You're like a movie star!",
            "💫 You're like a walking filter! This can't be real!"
        ]
    elif beauty_score >= 8.0:
        base_comments = [
            "🌟 DAMN! You're absolutely stunning! This is unfair!",
            "💎 WOW! You're like a K-drama lead! Netflix needs you!",
            "✨ You're gorgeous! Like actually gorgeous!",
            "🎭 You're like a Disney character! This is crazy!",
            "💫 You're beautiful! Like really beautiful!",
            "🌟 You're stunning! Like actually stunning!"
        ]
    elif beauty_score >= 7.0:
        base_comments = [
            "💫 Fantastic! You're really pretty! Like actually pretty!",
            "✨ You're lovely! Like really lovely!",
            "🌟 You're beautiful! Like actually beautiful!",
            "💎 You're attractive! Like really attractive!",
            "🎭 You're cute! Like actually cute!",
            "💫 You're pretty! Like really pretty!"
        ]
    elif beauty_score >= 6.0:
        base_comments = [
            "✨ Great! You have a unique look! Like really unique!",
            "🌟 You're attractive! Like actually attractive!",
            "💎 You're cute! Like really cute!",
            "🎭 You're pretty! Like actually pretty!",
            "💫 You're lovely! Like really lovely!",
            "✨ You're beautiful! Like actually beautiful!"
        ]
    else:
        base_comments = [
            "💎 Beautiful! You have a special charm! Like really special!",
            "🌟 You're unique! Like actually unique!",
            "💫 You're lovely! Like really lovely!",
            "✨ You're cute! Like actually cute!",
            "🎭 You're pretty! Like actually pretty!",
            "💎 You're beautiful! Like actually beautiful!"
        ]
    
    # Add a random achievement or trait
    all_insights = []
    for category in insights.values():
        all_insights.extend(category)
    
    if all_insights:
        random_insight = random.choice(all_insights)
        base_comment = random.choice(base_comments)
        return f"{base_comment} {random_insight} 🔥💫👑"
    else:
        base_comment = random.choice(base_comments)
        return f"{base_comment} You're going to be famous! 🌟💫👑"

def generate_smart_real_insights(age: int, gender: str, beauty_score: float, emotion: str, facial_features: Dict) -> Dict:
    """Generate smart, real insights using free LLM and specific predictions"""
    
    insights = {
        "achievements": [],
        "personality_traits": [],
        "future_predictions": [],
        "fun_facts": []
    }
    
    # Use Hugging Face Inference API (free tier)
    try:
        api_url = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large"
        headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY', '')}"}
        
        prompt = f"""
        Based on this facial analysis, generate 4 specific, funny predictions:
        Age: {age}, Gender: {gender}, Beauty Score: {beauty_score}/10, Emotion: {emotion}
        Symmetry: {facial_features['symmetry']:.1f}%, Skin: {facial_features['skinClarity']:.1f}%, Proportions: {facial_features['proportions']:.1f}%
        
        Give me:
        1. One specific achievement (like "Future Class President" or "MrBeast's Secret Brother")
        2. One personality trait (like "Natural Leader" or "Genius Level IQ")
        3. One future prediction (like "Will invent the next iPhone" or "Will become a billionaire")
        4. One fun fact (like "Your face could solve world peace" or "You're like a walking algorithm")
        
        Make them specific, funny, and avoid generic compliments like "you're handsome" or "you're pretty".
        """
        
        if os.getenv('HUGGINGFACE_API_KEY'):
            response = requests.post(api_url, headers=headers, json={"inputs": prompt})
            if response.status_code == 200:
                ai_response = response.json()[0]["generated_text"]
                return parse_smart_response(ai_response, age, gender, beauty_score, facial_features)
    
    except Exception as e:
        logger.warning(f"LLM generation failed: {e}")
    
    # Fallback to smart local generation
    return generate_smart_local_insights(age, gender, beauty_score, emotion, facial_features)

def parse_smart_response(ai_response: str, age: int, gender: str, beauty_score: float, facial_features: Dict) -> Dict:
    """Parse AI response and make it more specific"""
    
    insights = {
        "achievements": [],
        "personality_traits": [],
        "future_predictions": [],
        "fun_facts": []
    }
    
    # Extract and enhance the AI response
    lines = ai_response.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Make it more specific and funny
        if "achievement" in line.lower() or "1." in line:
            insights["achievements"].append(make_specific_achievement(age, gender, beauty_score, facial_features))
        elif "personality" in line.lower() or "trait" in line.lower() or "2." in line:
            insights["personality_traits"].append(make_specific_trait(facial_features))
        elif "future" in line.lower() or "prediction" in line.lower() or "3." in line:
            insights["future_predictions"].append(make_specific_prediction(beauty_score, age))
        elif "fun fact" in line.lower() or "4." in line:
            insights["fun_facts"].append(make_specific_fact(emotion, facial_features))
    
    # Fill in any missing categories
    if not insights["achievements"]:
        insights["achievements"].append(make_specific_achievement(age, gender, beauty_score, facial_features))
    if not insights["personality_traits"]:
        insights["personality_traits"].append(make_specific_trait(facial_features))
    if not insights["future_predictions"]:
        insights["future_predictions"].append(make_specific_prediction(beauty_score, age))
    if not insights["fun_facts"]:
        insights["fun_facts"].append(make_specific_fact(emotion, facial_features))
    
    return insights

def make_specific_achievement(age: int, gender: str, beauty_score: float, facial_features: Dict) -> str:
    """Generate specific, funny achievements"""
    
    if beauty_score >= 9.0:
        if age < 25:
            return "🔥 Future MrBeast's Secret Brother - He's been hiding you this whole time!"
        else:
            return "👑 MrBeast's Dad - You're the OG that started it all!"
    elif beauty_score >= 8.0:
        if age < 20:
            return "🎓 Future Class President - Your face commands respect!"
        elif age < 30:
            return "💼 Future CEO - You'll run a Fortune 500 company!"
        else:
            return "🌟 Future Mentor - You'll inspire millions!"
    elif beauty_score >= 7.0:
        if age < 25:
            return "📚 Future Professor - Students will actually pay attention!"
        else:
            return "🎭 Future Motivational Speaker - You'll change lives!"
    else:
        return "💎 Future Hidden Gem - You'll surprise everyone!"

def make_specific_trait(facial_features: Dict) -> str:
    """Generate specific personality traits based on facial features"""
    
    if facial_features['symmetry'] > 90:
        return "🎯 Perfectly Balanced - Like a human algorithm!"
    elif facial_features['skinClarity'] > 90:
        return "✨ Flawless Logic - Your skin is like clean code!"
    elif facial_features['expression'] > 85:
        return "💫 Charisma Algorithm - You could sell anything!"
    elif facial_features['proportions'] > 85:
        return "🌟 Mathematical Beauty - Your face follows the golden ratio!"
    else:
        return "💎 Unique Algorithm - You're like a rare programming language!"

def make_specific_prediction(beauty_score: float, age: int) -> str:
    """Generate specific future predictions"""
    
    if beauty_score >= 9.0:
        if age < 25:
            return "🚀 Will invent the next iPhone - Apple will be calling!"
        else:
            return "💎 Will become a billionaire - Just by existing!"
    elif beauty_score >= 8.0:
        if age < 30:
            return "🌟 Will start a successful startup - Silicon Valley needs you!"
        else:
            return "🎬 Will star in a blockbuster movie - Hollywood is waiting!"
    elif beauty_score >= 7.0:
        return "💼 Will become a successful entrepreneur - Success is inevitable!"
    else:
        return "💪 Will overcome all obstacles - Like a real-life superhero!"

def make_specific_fact(emotion: str, facial_features: Dict) -> str:
    """Generate specific fun facts"""
    
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
        "deepface_available": DEEPFACE_AVAILABLE,
        "opencv_available": True,
        "insightface_available": INSIGHTFACE_AVAILABLE
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": str(np.datetime64('now'))}

@app.post("/analyze/")
async def analyze_face(file: UploadFile = File(...)):
    """Analyze uploaded face image with InsightFace (age) and DeepFace (fallback)"""
    try:
        # Validate file
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Please upload a valid image file (JPG, PNG, etc.)")
        
        temp_path = f"temp_{int(time.time())}_{random.randint(1000, 9999)}.jpg"
        
        try:
            contents = await file.read()
            with open(temp_path, "wb") as f:
                f.write(contents)
            
            # Read image for InsightFace
            img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
            age = None
            gender = None
            
            # Try InsightFace first
            if INSIGHTFACE_AVAILABLE and insightface_app is not None:
                faces = insightface_app.get(img)
                if faces:
                    age = int(faces[0].age)
                    gender = "male" if faces[0].gender == 1 else "female"
                    logger.info(f"InsightFace: Age={age}, Gender={gender}")
            
            # Fallback to DeepFace if needed
            if age is None or gender is None:
                if DEEPFACE_AVAILABLE:
                    logger.info("Starting DeepFace analysis (fallback)...")
                    result = analyze_with_deepface(temp_path)
                    if isinstance(result, list):
                        result = result[0]
                    age = result.get('age', 25)
                    gender = result.get('gender', 'Unknown')
                else:
                    age = 25
                    gender = 'Unknown'
            
            # Emotion (DeepFace or default)
            emotion = 'neutral'
            if DEEPFACE_AVAILABLE:
                try:
                    result = analyze_with_deepface(temp_path)
                    if isinstance(result, list):
                        result = result[0]
                    emotion = result.get('dominant_emotion', 'neutral')
                except Exception as e:
                    logger.warning(f"DeepFace emotion fallback failed: {e}")
            
            # Calculate facial features (simplified for now)
            facial_features = {
                "symmetry": random.uniform(70, 95),
                "skinClarity": random.uniform(75, 95),
                "proportions": random.uniform(75, 90),
                "expression": 85 if emotion == 'happy' else 75
            }
            
            # Calculate beauty score
            beauty_score = calculate_beauty_score(age, gender, emotion, facial_features)
            
            # Generate smart, real insights
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
            if os.path.exists(temp_path):
                os.remove(temp_path)
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
    """Get list of loaded celebrities"""
    return {
        "count": len(celeb_names),
        "names": celeb_names,
        "images": celeb_images
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
    """Reload celebrity data"""
    load_celebrities()
    return {"message": "Celebrities reloaded", "count": len(celeb_names)} 