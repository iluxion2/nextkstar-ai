#!/usr/bin/env python3
"""
Download Korean actors from Squid Game and other popular Korean dramas
"""

import os
import requests
import time
import json
from pathlib import Path
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

def download_korean_actors():
    """Download Korean actors from popular dramas"""
    
    korean_actors = {
        "Squid_Game": [
            ("Lee Jung-jae", "Squid Game - Seong Gi-hun"),
            ("Park Hae-soo", "Squid Game - Cho Sang-woo"),
            ("Wi Ha-joon", "Squid Game - Hwang Jun-ho"),
            ("Jung Ho-yeon", "Squid Game - Kang Sae-byeok"),
            ("O Yeong-su", "Squid Game - Oh Il-nam"),
            ("Heo Sung-tae", "Squid Game - Jang Deok-su"),
            ("Anupam Tripathi", "Squid Game - Ali Abdul"),
            ("Kim Joo-ryoung", "Squid Game - Han Mi-nyeo"),
            ("Lee Yoo-mi", "Squid Game - Ji-yeong"),
            ("Gong Yoo", "Squid Game - The Salesman"),
            ("Lee Byung-hun", "Squid Game - Front Man"),
        ],
        "Parasite": [
            ("Song Kang-ho", "Parasite - Ki-taek"),
            ("Lee Sun-kyun", "Parasite - Park Dong-ik"),
            ("Cho Yeo-jeong", "Parasite - Choi Yeon-gyo"),
            ("Choi Woo-shik", "Parasite - Ki-woo"),
            ("Park So-dam", "Parasite - Ki-jung"),
            ("Jang Hye-jin", "Parasite - Chung-sook"),
            ("Lee Jung-eun", "Parasite - Moon-gwang"),
        ],
        "Train_to_Busan": [
            ("Gong Yoo", "Train to Busan - Seok-woo"),
            ("Ma Dong-seok", "Train to Busan - Sang-hwa"),
            ("Jung Yu-mi", "Train to Busan - Seong-kyeong"),
            ("Kim Su-an", "Train to Busan - Soo-an"),
            ("Choi Woo-shik", "Train to Busan - Yong-guk"),
        ],
        "Kingdom": [
            ("Ju Ji-hoon", "Kingdom - Crown Prince Lee Chang"),
            ("Bae Doona", "Kingdom - Seo-bi"),
            ("Ryu Seung-ryong", "Kingdom - Cho Hak-ju"),
            ("Kim Sang-ho", "Kingdom - Yeong-shin"),
            ("Kim Hye-jun", "Kingdom - Queen Consort Cho"),
        ],
        "Vincenzo": [
            ("Song Joong-ki", "Vincenzo - Vincenzo Cassano"),
            ("Jeon Yeo-been", "Vincenzo - Hong Cha-young"),
            ("Ok Taec-yeon", "Vincenzo - Jang Jun-woo"),
            ("Kim Yeo-jin", "Vincenzo - Choi Myung-hee"),
            ("Kwak Dong-yeon", "Vincenzo - Jang Han-seo"),
        ],
        "Itaewon_Class": [
            ("Park Seo-joon", "Itaewon Class - Park Sae-ro-yi"),
            ("Kim Da-mi", "Itaewon Class - Jo Yi-seo"),
            ("Yoo Jae-myung", "Itaewon Class - Jang Dae-hee"),
            ("Kwon Nara", "Itaewon Class - Oh Soo-ah"),
            ("Ahn Bo-hyun", "Itaewon Class - Jang Geun-won"),
        ],
        "Crash_Landing_on_You": [
            ("Hyun Bin", "Crash Landing on You - Ri Jeong-hyeok"),
            ("Son Ye-jin", "Crash Landing on You - Yoon Se-ri"),
            ("Seo Ji-hye", "Crash Landing on You - Seo Dan"),
            ("Kim Jung-hyun", "Crash Landing on You - Gu Seung-jun"),
            ("Yang Kyung-won", "Crash Landing on You - Pyo Chi-su"),
        ],
        "Goblin": [
            ("Gong Yoo", "Goblin - Kim Shin"),
            ("Kim Go-eun", "Goblin - Ji Eun-tak"),
            ("Lee Dong-wook", "Goblin - Wang Yeo"),
            ("Yoo In-na", "Goblin - Sunny"),
            ("Yook Sung-jae", "Goblin - Yoo Deok-hwa"),
        ],
        "Descendants_of_the_Sun": [
            ("Song Joong-ki", "Descendants of the Sun - Yoo Si-jin"),
            ("Song Hye-kyo", "Descendants of the Sun - Kang Mo-yeon"),
            ("Jin Goo", "Descendants of the Sun - Seo Dae-young"),
            ("Kim Ji-won", "Descendants of the Sun - Yoon Myung-ju"),
            ("Onew", "Descendants of the Sun - Lee Chi-hoon"),
        ],
        "My_Love_from_the_Star": [
            ("Kim Soo-hyun", "My Love from the Star - Do Min-joon"),
            ("Jun Ji-hyun", "My Love from the Star - Cheon Song-yi"),
            ("Park Hae-jin", "My Love from the Star - Lee Hwi-kyung"),
            ("Yoo In-na", "My Love from the Star - Yoo Se-mi"),
            ("Ahn Jae-hyun", "My Love from the Star - Heo Gyun"),
        ],
        "The_Heirs": [
            ("Lee Min-ho", "The Heirs - Kim Tan"),
            ("Park Shin-hye", "The Heirs - Cha Eun-sang"),
            ("Kim Woo-bin", "The Heirs - Choi Young-do"),
            ("Kang Min-hyuk", "The Heirs - Yoon Chan-young"),
            ("Park Hyung-sik", "The Heirs - Jo Myung-soo"),
        ],
        "Boys_Over_Flowers": [
            ("Lee Min-ho", "Boys Over Flowers - Gu Jun-pyo"),
            ("Ku Hye-sun", "Boys Over Flowers - Geum Jan-di"),
            ("Kim Hyun-joong", "Boys Over Flowers - Yoon Ji-hoo"),
            ("Kim Bum", "Boys Over Flowers - So Yi-jung"),
            ("Kim Joon", "Boys Over Flowers - Song Woo-bin"),
        ],
        "Winter_Sonata": [
            ("Bae Yong-joon", "Winter Sonata - Kang Joon-sang"),
            ("Choi Ji-woo", "Winter Sonata - Jung Yoo-jin"),
            ("Park Yong-ha", "Winter Sonata - Kim Sang-hyuk"),
            ("Park Sol-mi", "Winter Sonata - Oh Chae-rin"),
        ],
        "Other_Popular": [
            ("Yoo Ah-in", "Actor"),
            ("Kim Tae-ri", "Actor"),
            ("Kim Go-eun", "Actor"),
            ("Seo Ye-ji", "Actor"),
            ("Kim Da-mi", "Actor"),
            ("Han So-hee", "Actor"),
            ("Kim Yoo-jung", "Actor"),
            ("Nam Joo-hyuk", "Actor"),
            ("Ji Chang-wook", "Actor"),
            ("Park Bo-gum", "Actor"),
            ("Suzy", "Actor"),
            ("IU", "Actor"),
            ("Bae Suzy", "Actor"),
            ("Kim Seon-ho", "Actor"),
            ("Shin Hye-sun", "Actor"),
            ("Jung Hae-in", "Actor"),
            ("Kim Ji-won", "Actor"),
            ("Park Min-young", "Actor"),
            ("Yoona", "Actor"),
            ("Seohyun", "Actor"),
            ("Taecyeon", "Actor"),
            ("Nichkhun", "Actor"),
            ("Chansung", "Actor"),
            ("Wooyoung", "Actor"),
            ("Jun.K", "Actor"),
        ]
    }
    
    total_downloaded = 0
    
    for category, actors in korean_actors.items():
        print(f"\n🎭 Downloading {len(actors)} {category} actors...")
        downloaded_count = 0
        
        for i, (name, role) in enumerate(actors):
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
                total_downloaded += 1
                continue
            
            print(f"Searching for {name} ({role}) ({i+1}/{len(actors)})...")
            
            # Try multiple search methods with different query variations
            image_urls = []
            
            # Try different search variations
            search_variations = [
                name,
                f"{name} Korean actor",
                f"{name} {role.split(' - ')[0] if ' - ' in role else ''}",
                name.replace('-', ' ').replace('_', ' '),
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
                    total_downloaded += 1
                    break
            else:
                print(f"✗ Failed to download {name}")
            
            # Be respectful with rate limiting
            time.sleep(2)
        
        print(f"Downloaded {downloaded_count} {category} actors")
    
    return total_downloaded

def main():
    print("🎭 Korean Actors Downloader (Squid Game & More)")
    print("=" * 60)
    
    # Download Korean actors
    total_downloaded = download_korean_actors()
    
    # Summary
    total_images = len(list(CELEBRITIES_DIR.glob("*.jpg")))
    print(f"\n🎉 Successfully downloaded {total_downloaded} new Korean actor images")
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