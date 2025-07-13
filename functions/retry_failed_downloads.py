#!/usr/bin/env python3
"""
Retry failed celebrity downloads and download from GitHub repository
"""

import os
import requests
import time
import json
from pathlib import Path
import pandas as pd
from urllib.parse import quote_plus
import re
import zipfile
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
        img_pattern = r'"murl":"([^"]+)"'
        matches = re.findall(img_pattern, content)
        
        for match in matches[:max_results]:
            if match.startswith('http') and any(ext in match.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                urls.append(match)
        
        return urls
    except Exception as e:
        print(f"Error searching Bing: {e}")
        return []

def get_failed_celebrities():
    """Get list of celebrities that failed to download"""
    failed_celebrities = [
        # K-pop that failed
        ("BTS Jungkook", "K-pop"),
        ("BTS V", "K-pop"),
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
        
        # US Actors that failed
        ("Chris Evans", "US Actor"),
        
        # Korean Actors that failed
        ("Ji Chang Wook", "Korean Actor"),
        ("Suzy", "Korean Actor"),
        ("IU", "Korean Actor"),
        ("Kim Go Eun", "Korean Actor"),
        ("Seo Ye Ji", "Korean Actor"),
        ("Kim Da Mi", "Korean Actor"),
        ("Han So Hee", "Korean Actor"),
        ("Nam Joo Hyuk", "Korean Actor"),
        
        # Individual names that failed
        ("Jin", "K-pop (BTS)"),
        ("RM", "K-pop (BTS)"),
        ("Jennie", "K-pop (BLACKPINK)"),
        ("Lisa", "K-pop (BLACKPINK)"),
        ("Mina", "K-pop (TWICE)"),
        ("Momo", "K-pop (TWICE)"),
        ("Sana", "K-pop (TWICE)"),
        ("Irene", "K-pop (Red Velvet)"),
        ("Yeri", "K-pop (Red Velvet)"),
        ("Danielle", "K-pop (NewJeans)"),
        ("Hanni", "K-pop (NewJeans)"),
        ("Minji", "K-pop (NewJeans)"),
        ("Gaeul", "K-pop (IVE)"),
        ("Leeseo", "K-pop (IVE)"),
        ("Wonyoung", "K-pop (IVE)"),
    ]
    
    return failed_celebrities

def retry_failed_downloads():
    """Retry downloading failed celebrities with different search strategies"""
    failed_celebrities = get_failed_celebrities()
    
    print(f"🔄 Retrying {len(failed_celebrities)} failed downloads...")
    downloaded_count = 0
    
    for i, (name, category) in enumerate(failed_celebrities):
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
        
        print(f"Retrying {name} ({category}) ({i+1}/{len(failed_celebrities)})...")
        
        # Try multiple search methods with different query variations
        image_urls = []
        
        # Try different search variations
        search_variations = [
            name,
            name.replace(' ', ' '),
            name.split()[0] + ' ' + name.split()[-1] if len(name.split()) > 1 else name,
            name.replace('BTS ', '').replace('BLACKPINK ', '').replace('TWICE ', '').replace('Red Velvet ', ''),
        ]
        
        for variation in search_variations:
            # Try Wikipedia first
            image_urls.extend(search_images_wikipedia(variation))
            
            # Try DuckDuckGo
            if not image_urls:
                image_urls.extend(search_images_duckduckgo(variation))
            
            # Try Bing as fallback
            if not image_urls:
                image_urls.extend(search_images_bing(variation))
            
            if image_urls:
                break
        
        # Download the first valid image
        for url in image_urls[:5]:  # Try more URLs
            if download_image(url, filepath):
                print(f"✓ Downloaded {name}")
                downloaded_count += 1
                break
        else:
            print(f"✗ Still failed to download {name}")
        
        # Be respectful with rate limiting
        time.sleep(2)
    
    return downloaded_count

def download_from_github_repo():
    """Download images from the GitHub repository"""
    print("📥 Downloading images from GitHub repository...")
    
    try:
        # Get the repository contents
        api_url = "https://api.github.com/repos/PCEO-AI-CLUB/KID-F/contents"
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()
        contents = response.json()
        
        downloaded_count = 0
        
        for item in contents:
            if item['type'] == 'file' and item['name'].lower().endswith(('.jpg', '.jpeg', '.png')):
                # Check if we already have this file
                filename = item['name']
                filepath = CELEBRITIES_DIR / filename
                
                if filepath.exists() and filepath.stat().st_size > 10000:
                    print(f"✓ {filename} already exists")
                    downloaded_count += 1
                    continue
                
                print(f"Downloading {filename}...")
                
                # Download the file
                download_url = item['download_url']
                if download_image(download_url, filepath):
                    print(f"✓ Downloaded {filename}")
                    downloaded_count += 1
                else:
                    print(f"✗ Failed to download {filename}")
                
                time.sleep(1)  # Rate limiting
        
        return downloaded_count
        
    except Exception as e:
        print(f"Error downloading from GitHub: {e}")
        return 0

def download_additional_celebrities():
    """Download additional well-known celebrities"""
    additional_celebrities = [
        # More K-pop idols
        ("NewJeans Hyein", "K-pop"),
        ("NewJeans Haerin", "K-pop"),
        ("aespa Karina", "K-pop"),
        ("aespa Winter", "K-pop"),
        ("aespa Giselle", "K-pop"),
        ("aespa Ningning", "K-pop"),
        ("ITZY Yeji", "K-pop"),
        ("ITZY Lia", "K-pop"),
        ("ITZY Ryujin", "K-pop"),
        ("ITZY Chaeryeong", "K-pop"),
        ("ITZY Yuna", "K-pop"),
        ("STAYC Sumin", "K-pop"),
        ("STAYC Sieun", "K-pop"),
        ("STAYC Isa", "K-pop"),
        ("STAYC Seeun", "K-pop"),
        ("STAYC Yoon", "K-pop"),
        ("STAYC J", "K-pop"),
        
        # More US celebrities
        ("Tom Cruise", "US Actor"),
        ("Bradley Cooper", "US Actor"),
        ("Ryan Gosling", "US Actor"),
        ("Emma Stone", "US Actor"),
        ("Jennifer Aniston", "US Actor"),
        ("Sandra Bullock", "US Actor"),
        ("Julia Roberts", "US Actor"),
        ("Nicole Kidman", "US Actor"),
        ("Reese Witherspoon", "US Actor"),
        ("Charlize Theron", "US Actor"),
        ("Cate Blanchett", "US Actor"),
        ("Meryl Streep", "US Actor"),
        ("Viola Davis", "US Actor"),
        ("Octavia Spencer", "US Actor"),
        ("Lupita Nyong'o", "US Actor"),
        ("Zoe Saldana", "US Actor"),
        ("Salma Hayek", "US Actor"),
        ("Penelope Cruz", "US Actor"),
        ("Marion Cotillard", "US Actor"),
        ("Audrey Tautou", "US Actor"),
        ("Sophie Marceau", "US Actor"),
        ("Eva Green", "US Actor"),
        ("Lea Seydoux", "US Actor"),
        ("Adèle Exarchopoulos", "US Actor"),
        ("Marion Cotillard", "US Actor"),
    ]
    
    print(f"🎭 Downloading {len(additional_celebrities)} additional celebrities...")
    downloaded_count = 0
    
    for i, (name, category) in enumerate(additional_celebrities):
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
        
        print(f"Searching for {name} ({category}) ({i+1}/{len(additional_celebrities)})...")
        
        # Try multiple search methods
        image_urls = []
        
        # Try Wikipedia first
        image_urls.extend(search_images_wikipedia(name))
        
        # Try DuckDuckGo
        if not image_urls:
            image_urls.extend(search_images_duckduckgo(name))
        
        # Try Bing as fallback
        if not image_urls:
            image_urls.extend(search_images_bing(name))
        
        # Download the first valid image
        for url in image_urls[:3]:
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
    print("🔄 Retry Failed Downloads & GitHub Download")
    print("=" * 50)
    
    # Retry failed downloads
    retry_count = retry_failed_downloads()
    
    # Download from GitHub repository
    github_count = download_from_github_repo()
    
    # Download additional celebrities
    additional_count = download_additional_celebrities()
    
    # Summary
    total_images = len(list(CELEBRITIES_DIR.glob("*.jpg")))
    print(f"\n🎉 Successfully downloaded:")
    print(f"   - Retry: {retry_count} images")
    print(f"   - GitHub: {github_count} images")
    print(f"   - Additional: {additional_count} images")
    print(f"📁 Total celebrity images: {total_images}")
    print(f"📁 Images saved in: {CELEBRITIES_DIR.absolute()}")

if __name__ == "__main__":
    main() 