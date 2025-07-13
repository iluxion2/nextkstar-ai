#!/usr/bin/env python3
"""
Download images for well-known celebrities
Focuses on popular names that are more likely to have good search results
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
        if filepath.stat().st_size < 5000:  # Less than 5KB
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

def get_popular_kpop_from_csv():
    """Get popular K-pop idols from CSV"""
    csv_path = Path("kpopidolsv3.csv")
    if not csv_path.exists():
        print("CSV file not found!")
        return []
    
    df = pd.read_csv(csv_path)
    
    # Filter for popular groups and well-known names
    popular_groups = [
        'BTS', 'BLACKPINK', 'TWICE', 'Red Velvet', 'NewJeans', 'IVE', 
        'LE SSERAFIM', 'aespa', 'ITZY', 'STAYC', 'NMIXX', 'Kep1er',
        'EXO', 'BigBang', '2NE1', 'Girls Generation', 'SHINee', 'Super Junior'
    ]
    
    popular_names = []
    
    for group in popular_groups:
        group_members = df[df['Group'].str.contains(group, case=False, na=False)]
        for _, member in group_members.iterrows():
            # Use stage name if available, otherwise full name
            name = member.get('Stage Name') or member.get('Full Name')
            if name and pd.notna(name):
                popular_names.append((name, group))
    
    # Remove duplicates while preserving group info
    seen = set()
    unique_names = []
    for name, group in popular_names:
        if name not in seen:
            seen.add(name)
            unique_names.append((name, group))
    
    return unique_names[:50]  # Limit to top 50

def download_celebrity_images():
    """Download images for well-known celebrities"""
    
    # Popular celebrities with high success rate
    famous_celebrities = [
        # K-pop (well-known)
        ("BTS Jungkook", "K-pop"),
        ("BTS Jimin", "K-pop"),
        ("BTS V", "K-pop"),
        ("BTS Jin", "K-pop"),
        ("BTS RM", "K-pop"),
        ("BTS Suga", "K-pop"),
        ("BTS J-Hope", "K-pop"),
        ("BLACKPINK Jennie", "K-pop"),
        ("BLACKPINK Lisa", "K-pop"),
        ("BLACKPINK Rose", "K-pop"),
        ("BLACKPINK Jisoo", "K-pop"),
        ("TWICE Nayeon", "K-pop"),
        ("TWICE Sana", "K-pop"),
        ("TWICE Mina", "K-pop"),
        ("TWICE Tzuyu", "K-pop"),
        ("Red Velvet Irene", "K-pop"),
        ("Red Velvet Seulgi", "K-pop"),
        ("Red Velvet Wendy", "K-pop"),
        ("Red Velvet Joy", "K-pop"),
        ("Red Velvet Yeri", "K-pop"),
        
        # US Actors (very well-known)
        ("Tom Holland", "US Actor"),
        ("Zendaya", "US Actor"),
        ("Timothee Chalamet", "US Actor"),
        ("Florence Pugh", "US Actor"),
        ("Sydney Sweeney", "US Actor"),
        ("Jacob Elordi", "US Actor"),
        ("Austin Butler", "US Actor"),
        ("Ana de Armas", "US Actor"),
        ("Henry Cavill", "US Actor"),
        ("Gal Gadot", "US Actor"),
        ("Ryan Reynolds", "US Actor"),
        ("Blake Lively", "US Actor"),
        ("Chris Hemsworth", "US Actor"),
        ("Scarlett Johansson", "US Actor"),
        ("Robert Downey Jr", "US Actor"),
        ("Chris Evans", "US Actor"),
        ("Mark Ruffalo", "US Actor"),
        ("Jeremy Renner", "US Actor"),
        ("Tom Hiddleston", "US Actor"),
        ("Benedict Cumberbatch", "US Actor"),
        ("Tom Hardy", "US Actor"),
        ("Leonardo DiCaprio", "US Actor"),
        ("Brad Pitt", "US Actor"),
        ("Angelina Jolie", "US Actor"),
        ("Johnny Depp", "US Actor"),
        ("Margot Robbie", "US Actor"),
        ("Will Smith", "US Actor"),
        ("Denzel Washington", "US Actor"),
        ("Morgan Freeman", "US Actor"),
        ("Samuel L Jackson", "US Actor"),
        ("Emma Stone", "US Actor"),
        ("Ryan Gosling", "US Actor"),
        ("Emma Watson", "US Actor"),
        ("Daniel Radcliffe", "US Actor"),
        ("Rupert Grint", "US Actor"),
        ("Tom Felton", "US Actor"),
        ("Jennifer Lawrence", "US Actor"),
        ("Josh Hutcherson", "US Actor"),
        ("Liam Hemsworth", "US Actor"),
        ("Woody Harrelson", "US Actor"),
        ("Elizabeth Banks", "US Actor"),
        ("Dwayne Johnson", "US Actor"),
        ("Kevin Hart", "US Actor"),
        ("Jack Black", "US Actor"),
        ("Awkwafina", "US Actor"),
        ("Simu Liu", "US Actor"),
        ("Michelle Yeoh", "US Actor"),
        ("Ke Huy Quan", "US Actor"),
        ("Stephanie Hsu", "US Actor"),
        ("James Hong", "US Actor"),
        ("Jamie Lee Curtis", "US Actor"),
        
        # Korean Actors (well-known)
        ("Lee Min Ho", "Korean Actor"),
        ("Park Seo Joon", "Korean Actor"),
        ("Kim Soo Hyun", "Korean Actor"),
        ("Song Joong Ki", "Korean Actor"),
        ("Park Bo Gum", "Korean Actor"),
        ("Ji Chang Wook", "Korean Actor"),
        ("Hyun Bin", "Korean Actor"),
        ("Gong Yoo", "Korean Actor"),
        ("Jun Ji Hyun", "Korean Actor"),
        ("Song Hye Kyo", "Korean Actor"),
        ("Kim Tae Hee", "Korean Actor"),
        ("Suzy", "Korean Actor"),
        ("IU", "Korean Actor"),
        ("Park Shin Hye", "Korean Actor"),
        ("Kim Go Eun", "Korean Actor"),
        ("Seo Ye Ji", "Korean Actor"),
        ("Kim Da Mi", "Korean Actor"),
        ("Han So Hee", "Korean Actor"),
        ("Kim Yoo Jung", "Korean Actor"),
        ("Nam Joo Hyuk", "Korean Actor")
    ]
    
    # Add popular K-pop from CSV
    csv_celebrities = get_popular_kpop_from_csv()
    for name, group in csv_celebrities:
        if name not in [c[0] for c in famous_celebrities]:
            famous_celebrities.append((name, f"K-pop ({group})"))
    
    print(f"🎭 Downloading images for {len(famous_celebrities)} famous celebrities...")
    downloaded_count = 0
    
    for i, (name, category) in enumerate(famous_celebrities):
        # Clean the name for filename
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
        
        print(f"Searching for {name} ({category}) ({i+1}/{len(famous_celebrities)})...")
        
        # Try multiple search methods in order of preference
        image_urls = []
        
        # Try Wikipedia first (most reliable for celebrities)
        image_urls.extend(search_images_wikipedia(name))
        
        # Try DuckDuckGo
        if not image_urls:
            image_urls.extend(search_images_duckduckgo(name))
        
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
    
    return downloaded_count

def main():
    print("🎭 Famous Celebrity Image Downloader")
    print("=" * 50)
    
    # Download images for famous celebrities
    downloaded_count = download_celebrity_images()
    
    # Summary
    total_images = len(list(CELEBRITIES_DIR.glob("*.jpg")))
    print(f"\n🎉 Successfully downloaded {downloaded_count} new celebrity images")
    print(f"📁 Total celebrity images: {total_images}")
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