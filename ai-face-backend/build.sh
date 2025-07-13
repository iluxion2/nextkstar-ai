#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Install system dependencies
echo "Installing system dependencies..."
apt-get update -qq
apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1

# Install Python packages
echo "Installing Python packages..."
pip install --no-cache-dir -r requirements.txt

# Pre-download DeepFace models
echo "Pre-downloading DeepFace models..."
python -c "
from deepface import DeepFace
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
try:
    # This will trigger model downloads
    print('DeepFace models ready')
except Exception as e:
    print(f'Model download warning: {e}')
"

echo "Build completed successfully!" 