from icrawler.builtin import GoogleImageCrawler
import os

with open('celebrities.txt', 'r') as f:
    celebrities = [line.strip() for line in f if line.strip()]

os.makedirs('celebrities', exist_ok=True)

for celeb in celebrities:
    folder = f'celebrities/{celeb.replace(" ", "_")}'
    os.makedirs(folder, exist_ok=True)
    crawler = GoogleImageCrawler(storage={'root_dir': folder})
    crawler.crawl(keyword=celeb + " face", max_num=3, min_size=(200,200), file_idx_offset=0) 