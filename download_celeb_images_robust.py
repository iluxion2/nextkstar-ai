from icrawler.builtin import GoogleImageCrawler, BingImageCrawler
import os
import time
import random
from tqdm import tqdm

def download_celebrity_images():
    # Read celebrities from file
    with open('celebrities.txt', 'r', encoding='utf-8') as f:
        celebrities = [line.strip() for line in f if line.strip()]
    
    print(f"Found {len(celebrities)} celebrities to download images for")
    
    # Create main directory
    os.makedirs('celebrities', exist_ok=True)
    
    # Track progress
    successful_downloads = 0
    failed_downloads = 0
    
    # Process each celebrity with progress bar
    for i, celeb in enumerate(tqdm(celebrities, desc="Downloading celebrity images")):
        try:
            # Clean celebrity name for folder
            clean_name = celeb.replace(" ", "_").replace("/", "_").replace("\\", "_").replace("(", "").replace(")", "")
            folder = f'celebrities/{clean_name}'
            
            # Create folder for this celebrity
            os.makedirs(folder, exist_ok=True)
            
            # Try different search terms
            search_terms = [
                f"{celeb} face",
                f"{celeb} portrait",
                f"{celeb} photo",
                f"{celeb} headshot"
            ]
            
            images_downloaded = 0
            
            for search_term in search_terms:
                if images_downloaded >= 3:
                    break
                    
                try:
                    # Use Bing crawler as backup (often more reliable)
                    crawler = BingImageCrawler(
                        storage={'root_dir': folder},
                        feeder_threads=1,
                        parser_threads=1,
                        downloader_threads=2
                    )
                    
                    # Download images
                    crawler.crawl(
                        keyword=search_term,
                        max_num=1,
                        min_size=(200, 200),
                        max_size=(1000, 1000),
                        file_idx_offset=images_downloaded
                    )
                    
                    # Check if images were actually downloaded
                    images = [f for f in os.listdir(folder) if f.endswith(('.jpg', '.jpeg', '.png'))]
                    images_downloaded = len(images)
                    
                    # Small delay
                    time.sleep(random.uniform(1, 2))
                    
                except Exception as e:
                    print(f"\nError with search term '{search_term}' for {celeb}: {str(e)}")
                    continue
            
            if images_downloaded > 0:
                successful_downloads += 1
                print(f"\n✓ Downloaded {images_downloaded} images for {celeb}")
            else:
                failed_downloads += 1
                print(f"\n✗ No images downloaded for {celeb}")
            
            # Longer delay between celebrities
            time.sleep(random.uniform(2, 4))
            
        except Exception as e:
            print(f"\nError downloading images for {celeb}: {str(e)}")
            failed_downloads += 1
            continue
    
    print(f"\nDownload complete!")
    print(f"Successful: {successful_downloads}")
    print(f"Failed: {failed_downloads}")
    print(f"Total celebrities processed: {len(celebrities)}")

if __name__ == "__main__":
    download_celebrity_images() 