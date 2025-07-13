#!/usr/bin/env python3
"""
Startup script for AI Face Analysis Backend
Handles deployment issues and provides better error handling
"""

import os
import sys
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are available"""
    try:
        import fastapi
        import uvicorn
        import deepface
        import cv2
        import numpy as np
        import pandas as pd
        from PIL import Image
        logger.info("✓ All core dependencies available")
        return True
    except ImportError as e:
        logger.error(f"✗ Missing dependency: {e}")
        return False

def check_directories():
    """Check if required directories exist"""
    celebrities_dir = Path("celebrities")
    if not celebrities_dir.exists():
        logger.warning("⚠ celebrities directory not found, creating it")
        celebrities_dir.mkdir(exist_ok=True)
    
    # Create a sample CSV if it doesn't exist
    csv_file = Path("celebrities/kpopidolsv3.csv")
    if not csv_file.exists():
        logger.warning("⚠ CSV file not found, creating sample data")
        import pandas as pd
        sample_data = pd.DataFrame({
            'name': ['Sample Celebrity'],
            'group': ['Sample Group'],
            'age': [25],
            'gender': ['Unknown']
        })
        sample_data.to_csv(csv_file, index=False)
        logger.info("✓ Created sample CSV file")

def main():
    """Main startup function"""
    logger.info("🚀 Starting AI Face Analysis Backend...")
    
    # Check dependencies
    if not check_dependencies():
        logger.error("❌ Dependencies check failed")
        sys.exit(1)
    
    # Check directories
    check_directories()
    
    # Import and run the main app
    try:
        from main import app
        import uvicorn
        
        port = int(os.environ.get("PORT", 8000))
        host = os.environ.get("HOST", "0.0.0.0")
        
        logger.info(f"🌐 Starting server on {host}:{port}")
        uvicorn.run(app, host=host, port=port)
        
    except Exception as e:
        logger.error(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 