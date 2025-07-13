import os
import glob

def check_download_progress():
    celebrities_dir = 'celebrities'
    
    if not os.path.exists(celebrities_dir):
        print("No celebrities directory found. Downloads haven't started yet.")
        return
    
    # Count folders and images
    celeb_folders = [d for d in os.listdir(celebrities_dir) if os.path.isdir(os.path.join(celebrities_dir, d))]
    total_images = 0
    
    print(f"Found {len(celeb_folders)} celebrity folders")
    print("\nChecking image counts...")
    
    # Count images in each folder
    for folder in celeb_folders[:10]:  # Show first 10
        folder_path = os.path.join(celebrities_dir, folder)
        images = glob.glob(os.path.join(folder_path, "*.jpg")) + glob.glob(os.path.join(folder_path, "*.jpeg")) + glob.glob(os.path.join(folder_path, "*.png"))
        print(f"{folder}: {len(images)} images")
        total_images += len(images)
    
    if len(celeb_folders) > 10:
        print(f"... and {len(celeb_folders) - 10} more folders")
    
    print(f"\nTotal images downloaded so far: {total_images}")
    
    # Read total celebrities from file
    try:
        with open('celebrities.txt', 'r', encoding='utf-8') as f:
            total_celebrities = len([line.strip() for line in f if line.strip()])
        print(f"Total celebrities in list: {total_celebrities}")
        print(f"Progress: {len(celeb_folders)}/{total_celebrities} celebrities processed ({len(celeb_folders)/total_celebrities*100:.1f}%)")
    except FileNotFoundError:
        print("celebrities.txt not found")

if __name__ == "__main__":
    check_download_progress() 