from icrawler.builtin import GoogleImageCrawler
import os
import time
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
            clean_name = celeb.replace(" ", "_").replace("/", "_").replace("\\", "_")
            folder = f'celebrities/{clean_name}'
            
            # Create folder for this celebrity
            os.makedirs(folder, exist_ok=True)
            
            # Set up crawler
            crawler = GoogleImageCrawler(
                storage={'root_dir': folder},
                feeder_threads=1,
                parser_threads=1,
                downloader_threads=4
            )
            
            # Download images
            crawler.crawl(
                keyword=f"{celeb} face portrait",
                max_num=3,
                min_size=(200, 200),
                max_size=(1000, 1000),
                file_idx_offset=0
            )
            
            successful_downloads += 1
            
            # Small delay to be respectful to servers
            time.sleep(0.5)
            
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