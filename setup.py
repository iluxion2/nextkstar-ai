#!/usr/bin/env python3
"""
Setup script for AI Face Analysis Backend
Downloads sample celebrity images and prepares the environment
"""

import os
import requests
from pathlib import Path

def download_image(url, filename):
    """Download an image from URL"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"✓ Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")
        return False

def setup_celebrities():
    """Download sample celebrity images"""
    celeb_dir = Path("celebrities")
    celeb_dir.mkdir(exist_ok=True)
    
    # Sample celebrity images (public domain or fair use)
    celebrities = [
        {
            "name": "jennie_blackpink.jpg",
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jennie_Kim_%28BLACKPINK%29_at_the_2022_Met_Gala.jpg/800px-Jennie_Kim_%28BLACKPINK%29_at_the_2022_Met_Gala.jpg"
        },
        {
            "name": "v_bts.jpg", 
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/V_%28BTS%29_at_the_2022_Met_Gala.jpg/800px-V_%28BTS%29_at_the_2022_Met_Gala.jpg"
        },
        {
            "name": "leonardo_dicaprio.jpg",
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Leonardo_Dicaprio_Cannes_2019.jpg/800px-Leonardo_Dicaprio_Cannes_2019.jpg"
        },
        {
            "name": "emma_watson.jpg",
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/800px-Emma_Watson_2013.jpg"
        },
        {
            "name": "tom_holland.jpg",
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tom_Holland_by_Gage_Skidmore.jpg/800px-Tom_Holland_by_Gage_Skidmore.jpg"
        }
    ]
    
    print("Downloading sample celebrity images...")
    downloaded = 0
    
    for celeb in celebrities:
        filename = celeb_dir / celeb["name"]
        if not filename.exists():
            if download_image(celeb["url"], filename):
                downloaded += 1
        else:
            print(f"✓ Already exists: {filename}")
            downloaded += 1
    
    print(f"\nSetup complete! Downloaded {downloaded} celebrity images.")
    print("You can add more celebrity images to the 'celebrities/' folder.")

def main():
    """Main setup function"""
    print("🎭 AI Face Analysis Backend Setup")
    print("=" * 40)
    
    # Create celebrities directory and download images
    setup_celebrities()
    
    print("\n📋 Next steps:")
    print("1. Install Python dependencies: pip install -r requirements.txt")
    print("2. Run the backend: uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    print("3. Test the API: curl http://localhost:8000/")
    print("4. Connect your Next.js frontend to http://localhost:8000/analyze/")

if __name__ == "__main__":
    main() 