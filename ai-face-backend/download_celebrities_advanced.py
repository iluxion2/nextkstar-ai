#!/usr/bin/env python3
"""
Advanced celebrity image downloader
Uses Google Custom Search API and multiple fallback methods
"""

import os
import requests
import time
import json
from pathlib import Path
import pandas as pd
from urllib.parse import quote_plus
import re
import base64
from PIL import Image
import io

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
        if filepath.stat().st_size < 5000:  # Less than 5KB
            filepath.unlink()
            return False
            
        # Try to open with PIL to verify it's a valid image
        try:
            with Image.open(filepath) as img:
                img.verify()
            return True
        except:
            filepath.unlink()
            return False
            
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        if filepath.exists():
            filepath.unlink()
        return False

def search_images_google_custom_search(query, api_key=None, cx=None, max_results=5):
    """Search for images using Google Custom Search API"""
    if not api_key or not cx:
        print("Google Custom Search API key or CX not provided, skipping...")
        return []
    
    try:
        search_url = "https://www.googleapis.com/customsearch/v1"
        params = {
            'key': api_key,
            'cx': cx,
            'q': f"{query} face portrait",
            'searchType': 'image',
            'num': max_results,
            'imgSize': 'large',
            'imgType': 'face'
        }
        
        response = requests.get(search_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        urls = []
        for item in data.get('items', []):
            if item.get('link'):
                urls.append(item['link'])
        
        return urls
    except Exception as e:
        print(f"Error searching Google Custom Search: {e}")
        return []

def search_images_duckduckgo(query, max_results=5):
    """Search for images using DuckDuckGo (no API key needed)"""
    try:
        # DuckDuckGo instant answer API
        search_url = f"https://api.duckduckgo.com/?q={quote_plus(query + ' face photo portrait')}&format=json&no_html=1&skip_disambig=1"
        
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

def search_images_bing(query, max_results=5):
    """Search for images using Bing Image Search (no API key needed)"""
    try:
        # Using Bing's search suggestions to get image URLs
        search_url = f"https://www.bing.com/images/search"
        params = {
            'q': f"{query} face portrait",
            'form': 'HDRSC2',
            'first': '1'
        }
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(search_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Extract image URLs from the HTML response
        urls = []
        content = response.text
        
        # Look for image URLs in the response
        import re
        img_pattern = r'"murl":"([^"]+)"'
        matches = re.findall(img_pattern, content)
        
        for match in matches[:max_results]:
            if match.startswith('http') and any(ext in match.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                urls.append(match)
        
        return urls
    except Exception as e:
        print(f"Error searching Bing: {e}")
        return []

def search_images_wikipedia(query, max_results=3):
    """Search for images using Wikipedia API"""
    try:
        # Search for the person on Wikipedia
        search_url = "https://en.wikipedia.org/api/rest_v1/page/summary/"
        page_name = query.replace(' ', '_')
        
        response = requests.get(f"{search_url}{page_name}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            # Get the thumbnail image if available
            if data.get('thumbnail', {}).get('source'):
                return [data['thumbnail']['source']]
        
        return []
    except Exception as e:
        print(f"Error searching Wikipedia: {e}")
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
    
    for i, name in enumerate(unique_names[:30]):  # Limit to first 30 for testing
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
        
        print(f"Searching for {name} ({i+1}/{min(30, len(unique_names))})...")
        
        # Try multiple search methods in order of preference
        image_urls = []
        
        # Try Wikipedia first (most reliable for celebrities)
        image_urls.extend(search_images_wikipedia(name))
        
        # Try DuckDuckGo
        if not image_urls:
            image_urls.extend(search_images_duckduckgo(name))
        
        # Try Bing as fallback
        if not image_urls:
            image_urls.extend(search_images_bing(name))
        
        # Download the first valid image
        for url in image_urls[:3]:  # Try first 3 URLs
            if download_image(url, filepath):
                print(f"✓ Downloaded {name}")
                downloaded_count += 1
                break
        else:
            print(f"✗ Failed to download {name}")
        
        # Be respectful with rate limiting
        time.sleep(2)
    
    print(f"\nDownloaded {downloaded_count} celebrity images")

def add_popular_celebrities():
    """Add popular celebrities from different categories"""
    celebrities = {
        "K-pop": [
            "BTS Jungkook", "BTS Jimin", "BTS V", "BTS Jin", "BTS RM", "BTS Suga", "BTS J-Hope",
            "BLACKPINK Jennie", "BLACKPINK Lisa", "BLACKPINK Rose", "BLACKPINK Jisoo",
            "TWICE Nayeon", "TWICE Sana", "TWICE Mina", "TWICE Tzuyu", "TWICE Dahyun", "TWICE Chaeyoung",
            "Red Velvet Irene", "Red Velvet Seulgi", "Red Velvet Wendy", "Red Velvet Joy", "Red Velvet Yeri",
            "NewJeans Hanni", "NewJeans Danielle", "NewJeans Minji", "NewJeans Haerin", "NewJeans Hyein",
            "IVE Yujin", "IVE Gaeul", "IVE Rei", "IVE Wonyoung", "IVE Liz", "IVE Leeseo",
            "LE SSERAFIM Chaewon", "LE SSERAFIM Sakura", "LE SSERAFIM Kazuha", "LE SSERAFIM Yunjin", "LE SSERAFIM Eunchae"
        ],
        "US_Actors": [
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
        ],
        "Korean_Actors": [
            "Lee Min Ho", "Park Seo Joon", "Kim Soo Hyun", "Song Joong Ki",
            "Park Bo Gum", "Ji Chang Wook", "Hyun Bin", "Gong Yoo",
            "Jun Ji Hyun", "Song Hye Kyo", "Kim Tae Hee", "Suzy",
            "IU", "Park Shin Hye", "Kim Go Eun", "Seo Ye Ji",
            "Kim Da Mi", "Han So Hee", "Kim Yoo Jung", "Nam Joo Hyuk"
        ]
    }
    
    total_downloaded = 0
    
    for category, names in celebrities.items():
        print(f"\n🎭 Adding {len(names)} {category} celebrities...")
        downloaded_count = 0
        
        for i, name in enumerate(names):
            filename = f"{name.replace(' ', '_')}.jpg"
            filepath = CELEBRITIES_DIR / filename
            
            # Skip if already exists and has reasonable size
            if filepath.exists() and filepath.stat().st_size > 10000:
                print(f"✓ {name} already exists")
                downloaded_count += 1
                total_downloaded += 1
                continue
            
            print(f"Searching for {name} ({i+1}/{len(names)})...")
            
            # Try multiple search methods in order of preference
            image_urls = []
            
            # Try Wikipedia first (most reliable for celebrities)
            image_urls.extend(search_images_wikipedia(name))
            
            # Try DuckDuckGo
            if not image_urls:
                image_urls.extend(search_images_duckduckgo(name))
            
            # Try Bing as fallback
            if not image_urls:
                image_urls.extend(search_images_bing(name))
            
            # Download the first valid image
            for url in image_urls[:3]:  # Try first 3 URLs
                if download_image(url, filepath):
                    print(f"✓ Downloaded {name}")
                    downloaded_count += 1
                    total_downloaded += 1
                    break
            else:
                print(f"✗ Failed to download {name}")
            
            # Be respectful with rate limiting
            time.sleep(2)
        
        print(f"Downloaded {downloaded_count} {category} celebrity images")
    
    return total_downloaded

def main():
    print("🎭 Advanced Celebrity Image Downloader")
    print("=" * 50)
    
    # Download images from CSV data
    get_celebrity_images_from_csv()
    
    # Add popular celebrities from different categories
    total_downloaded = add_popular_celebrities()
    
    # Summary
    total_images = len(list(CELEBRITIES_DIR.glob("*.jpg")))
    print(f"\n🎉 Total celebrity images: {total_images}")
    print(f"📁 Images saved in: {CELEBRITIES_DIR.absolute()}")
    
    # Show some statistics
    image_sizes = []
    for img_path in CELEBRITIES_DIR.glob("*.jpg"):
        image_sizes.append(img_path.stat().st_size)
    
    if image_sizes:
        avg_size = sum(image_sizes) / len(image_sizes)
        print(f"📊 Average image size: {avg_size/1024:.1f} KB")
        print(f"📊 Largest image: {max(image_sizes)/1024:.1f} KB")
        print(f"📊 Smallest image: {min(image_sizes)/1024:.1f} KB")

if __name__ == "__main__":
    main() 