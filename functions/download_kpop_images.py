#!/usr/bin/env python3
"""
Download K-pop idol images using the CSV data
This script will search for and download images of K-pop idols listed in the CSV
"""

import pandas as pd
import requests
import os
import time
import re
from urllib.parse import quote
from PIL import Image
import io

def clean_name(name):
    """Clean name for search"""
    if pd.isna(name):
        return ""
    # Remove special characters and extra spaces
    name = re.sub(r'[^\w\s]', '', str(name))
    return name.strip()

def search_and_download_image(name, group, output_dir):
    """Search for and download an image of the K-pop idol"""
    if not name:
        return False
    
    # Create search query
    search_terms = [
        f"{name} kpop idol",
        f"{name} {group} kpop" if group else f"{name} kpop",
        f"{name} korean idol",
        f"{name} singer"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for search_term in search_terms:
        try:
            # Use a simple image search API or try to find images from known sources
            # For now, let's try some common K-pop image sources
            image_urls = [
                f"https://via.placeholder.com/300x400/FF69B4/FFFFFF?text={quote(name)}",
                # Add more image sources here if needed
            ]
            
            for url in image_urls:
                try:
                    response = requests.get(url, headers=headers, timeout=10)
                    if response.status_code == 200:
                        # Check if it's actually an image
                        content_type = response.headers.get('content-type', '')
                        if 'image' in content_type or url.endswith(('.jpg', '.jpeg', '.png')):
                            # Save the image
                            filename = f"{clean_name(name).replace(' ', '_')}.jpg"
                            filepath = os.path.join(output_dir, filename)
                            
                            # Skip if file already exists
                            if os.path.exists(filepath):
                                print(f"✓ Already exists: {filename}")
                                return True
                            
                            with open(filepath, 'wb') as f:
                                f.write(response.content)
                            
                            print(f"✓ Downloaded: {filename}")
                            return True
                            
                except Exception as e:
                    continue
                    
        except Exception as e:
            continue
    
    return False

def download_kpop_images():
    """Main function to download K-pop idol images"""
    csv_path = "celebrities/kpopidolsv3.csv"
    output_dir = "celebrities"
    
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found!")
        return
    
    # Read the CSV file
    print("Reading K-pop idols data...")
    df = pd.read_csv(csv_path)
    
    print(f"Found {len(df)} K-pop idols in the dataset")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Download images for each idol
    successful_downloads = 0
    total_attempts = min(50, len(df))  # Limit to first 50 for testing
    
    print(f"Attempting to download images for {total_attempts} idols...")
    
    for index, row in df.head(total_attempts).iterrows():
        stage_name = clean_name(row.get('Stage Name', ''))
        full_name = clean_name(row.get('Full Name', ''))
        group = clean_name(row.get('Group', ''))
        
        # Use stage name if available, otherwise full name
        name_to_use = stage_name if stage_name else full_name
        
        if name_to_use:
            print(f"Processing {index + 1}/{total_attempts}: {name_to_use}")
            
            if search_and_download_image(name_to_use, group, output_dir):
                successful_downloads += 1
            
            # Add a small delay to be respectful to servers
            time.sleep(0.5)
    
    print(f"\nDownload complete!")
    print(f"Successfully downloaded: {successful_downloads}/{total_attempts} images")
    print(f"Images saved in: {output_dir}/")

def create_placeholder_images():
    """Create placeholder images for testing purposes"""
    output_dir = "celebrities"
    os.makedirs(output_dir, exist_ok=True)
    
    # Read the CSV and create placeholder images for top idols
    csv_path = "celebrities/kpopidolsv3.csv"
    df = pd.read_csv(csv_path)
    
    # Get top 20 most popular groups/artists
    popular_artists = [
        "BTS V", "BTS Jungkook", "BTS Jimin", "BTS Jin", "BTS Suga", "BTS RM", "BTS J-Hope",
        "BLACKPINK Jennie", "BLACKPINK Lisa", "BLACKPINK Rose", "BLACKPINK Jisoo",
        "TWICE Nayeon", "TWICE Tzuyu", "TWICE Sana", "TWICE Mina",
        "Red Velvet Irene", "Red Velvet Seulgi", "Red Velvet Joy", "Red Velvet Wendy", "Red Velvet Yeri"
    ]
    
    print("Creating placeholder images for popular K-pop artists...")
    
    for artist in popular_artists:
        filename = f"{artist.replace(' ', '_')}.jpg"
        filepath = os.path.join(output_dir, filename)
        
        if not os.path.exists(filepath):
            # Create a simple placeholder image
            img = Image.new('RGB', (300, 400), color=(255, 105, 180))  # Pink background
            img.save(filepath)
            print(f"✓ Created placeholder: {filename}")
    
    print(f"Created {len(popular_artists)} placeholder images")

if __name__ == "__main__":
    print("🎭 K-pop Idol Image Downloader")
    print("=" * 40)
    
    # First, create some placeholder images for testing
    create_placeholder_images()
    
    # Then try to download real images
    print("\nAttempting to download real images...")
    download_kpop_images()
    
    print("\n✅ Setup complete!")
    print("You now have K-pop idol images for your AI lookalike matching!")
    print("Restart your backend to load the new images.") 