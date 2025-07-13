#!/usr/bin/env python3
"""
Download real celebrity images from the web
Uses multiple sources to get high-quality images
"""

import os
import requests
import time
import json
from pathlib import Path
import pandas as pd
from urllib.parse import quote_plus
import re

# Create celebrities directory if it doesn't exist
CELEBRITIES_DIR = Path("celebrities")
CELEBRITIES_DIR.mkdir(exist_ok=True)

def download_image(url, filepath, timeout=10):
    """Download image from URL with error handling"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=timeout, stream=True)
        response.raise_for_status()
        
        # Check if it's actually an image
        content_type = response.headers.get('content-type', '')
        if not content_type.startswith('image/'):
            return False
            
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Check if file is not empty and has reasonable size
        if filepath.stat().st_size < 1000:  # Less than 1KB
            filepath.unlink()
            return False
            
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        if filepath.exists():
            filepath.unlink()
        return False

def search_images_duckduckgo(query, max_results=5):
    """Search for images using DuckDuckGo (no API key needed)"""
    try:
        # DuckDuckGo instant answer API
        search_url = f"https://api.duckduckgo.com/?q={quote_plus(query + ' face photo')}&format=json&no_html=1&skip_disambig=1"
        
        response = requests.get(search_url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        urls = []
        
        # Get abstract image if available
        if data.get('Image'):
            urls.append(data['Image'])
        
        # Get related topics images
        for topic in data.get('RelatedTopics', [])[:max_results]:
            if isinstance(topic, dict) and topic.get('Image'):
                urls.append(topic['Image'])
        
        return urls
    except Exception as e:
        print(f"Error searching DuckDuckGo: {e}")
        return []

def search_images_unsplash(query, max_results=5):
    """Search for images using Unsplash API (free tier)"""
    try:
        # Using Unsplash API (you can get a free API key at https://unsplash.com/developers)
        # For now, we'll use their demo endpoint
        search_url = f"https://api.unsplash.com/search/photos"
        params = {
            'query': f"{query} portrait face",
            'per_page': max_results,
            'orientation': 'portrait'
        }
        headers = {
            'Authorization': 'Client-ID DEMO_KEY'  # Replace with your API key for production
        }
        
        response = requests.get(search_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        urls = []
        for photo in data.get('results', []):
            if photo.get('urls', {}).get('regular'):
                urls.append(photo['urls']['regular'])
        
        return urls
    except Exception as e:
        print(f"Error searching Unsplash: {e}")
        return []

def get_celebrity_images_from_csv():
    """Get celebrity names from CSV and download their images"""
    csv_path = Path("kpopidolsv3.csv")
    if not csv_path.exists():
        print("CSV file not found!")
        return
    
    df = pd.read_csv(csv_path)
    print(f"Found {len(df)} celebrities in CSV")
    
    # Get unique names (avoid duplicates) - try different name columns
    name_columns = ['Stage Name', 'Full Name', 'Korean Name']
    unique_names = []
    
    for col in name_columns:
        if col in df.columns:
            names = df[col].dropna().unique()
            unique_names.extend(names)
    
    # Remove duplicates and clean names
    unique_names = list(set(unique_names))
    print(f"Found {len(unique_names)} unique names")
    
    downloaded_count = 0
    
    for i, name in enumerate(unique_names[:50]):  # Limit to first 50 for testing
        if pd.isna(name) or name.strip() == '':
            continue
            
        # Clean the name
        clean_name = re.sub(r'[^\w\s]', '', name.strip())
        if len(clean_name) < 2:
            continue
            
        filename = f"{clean_name.replace(' ', '_')}.jpg"
        filepath = CELEBRITIES_DIR / filename
        
        # Skip if already exists and has reasonable size
        if filepath.exists() and filepath.stat().st_size > 10000:
            print(f"✓ {name} already exists")
            downloaded_count += 1
            continue
        
        print(f"Searching for {name} ({i+1}/{min(50, len(unique_names))})...")
        
        # Try multiple search methods
        image_urls = []
        
        # Try DuckDuckGo first
        image_urls.extend(search_images_duckduckgo(name))
        
        # Try Unsplash if DuckDuckGo didn't work
        if not image_urls:
            image_urls.extend(search_images_unsplash(name))
        
        # Download the first valid image
        for url in image_urls[:3]:  # Try first 3 URLs
            if download_image(url, filepath):
                print(f"✓ Downloaded {name}")
                downloaded_count += 1
                break
        else:
            print(f"✗ Failed to download {name}")
        
        # Be respectful with rate limiting
        time.sleep(1)
    
    print(f"\nDownloaded {downloaded_count} celebrity images")

def add_popular_us_celebrities():
    """Add popular US celebrities manually"""
    us_celebrities = [
        "Tom Holland", "Zendaya", "Timothee Chalamet", "Florence Pugh",
        "Sydney Sweeney", "Jacob Elordi", "Austin Butler", "Ana de Armas",
        "Henry Cavill", "Gal Gadot", "Ryan Reynolds", "Blake Lively",
        "Chris Hemsworth", "Scarlett Johansson", "Robert Downey Jr",
        "Chris Evans", "Mark Ruffalo", "Jeremy Renner", "Tom Hiddleston",
        "Benedict Cumberbatch", "Tom Hardy", "Leonardo DiCaprio",
        "Brad Pitt", "Angelina Jolie", "Johnny Depp", "Margot Robbie",
        "Will Smith", "Denzel Washington", "Morgan Freeman", "Samuel L Jackson",
        "Emma Stone", "Ryan Gosling", "Emma Watson", "Daniel Radcliffe",
        "Rupert Grint", "Tom Felton", "Jennifer Lawrence", "Josh Hutcherson",
        "Liam Hemsworth", "Woody Harrelson", "Elizabeth Banks",
        "Dwayne Johnson", "Kevin Hart", "Jack Black", "Awkwafina",
        "Simu Liu", "Michelle Yeoh", "Ke Huy Quan", "Stephanie Hsu",
        "James Hong", "Jamie Lee Curtis"
    ]
    
    print(f"\nAdding {len(us_celebrities)} popular US celebrities...")
    downloaded_count = 0
    
    for i, name in enumerate(us_celebrities):
        filename = f"{name.replace(' ', '_')}.jpg"
        filepath = CELEBRITIES_DIR / filename
        
        # Skip if already exists and has reasonable size
        if filepath.exists() and filepath.stat().st_size > 10000:
            print(f"✓ {name} already exists")
            downloaded_count += 1
            continue
        
        print(f"Searching for {name} ({i+1}/{len(us_celebrities)})...")
        
        # Try multiple search methods
        image_urls = []
        
        # Try DuckDuckGo first
        image_urls.extend(search_images_duckduckgo(name))
        
        # Try Unsplash if DuckDuckGo didn't work
        if not image_urls:
            image_urls.extend(search_images_unsplash(name))
        
        # Download the first valid image
        for url in image_urls[:3]:  # Try first 3 URLs
            if download_image(url, filepath):
                print(f"✓ Downloaded {name}")
                downloaded_count += 1
                break
        else:
            print(f"✗ Failed to download {name}")
        
        # Be respectful with rate limiting
        time.sleep(1)
    
    print(f"\nDownloaded {downloaded_count} US celebrity images")

def main():
    print("🎭 Downloading Real Celebrity Images from the Web")
    print("=" * 50)
    
    # Download images from CSV data
    get_celebrity_images_from_csv()
    
    # Add popular US celebrities
    add_popular_us_celebrities()
    
    # Summary
    total_images = len(list(CELEBRITIES_DIR.glob("*.jpg")))
    print(f"\n🎉 Total celebrity images: {total_images}")
    print(f"📁 Images saved in: {CELEBRITIES_DIR.absolute()}")

if __name__ == "__main__":
    main() 