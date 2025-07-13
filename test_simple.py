#!/usr/bin/env python3
"""
Simple test script to check imports and basic functionality
"""

print("Testing imports...")

try:
    import fastapi
    print("✓ FastAPI imported successfully")
except Exception as e:
    print(f"✗ FastAPI import failed: {e}")

try:
    import deepface
    print("✓ DeepFace imported successfully")
except Exception as e:
    print(f"✗ DeepFace import failed: {e}")

try:
    import cv2
    print("✓ OpenCV imported successfully")
except Exception as e:
    print(f"✗ OpenCV import failed: {e}")

try:
    import numpy as np
    print("✓ NumPy imported successfully")
except Exception as e:
    print(f"✗ NumPy import failed: {e}")

try:
    from PIL import Image
    print("✓ PIL imported successfully")
except Exception as e:
    print(f"✗ PIL import failed: {e}")

print("\nTesting basic DeepFace functionality...")

try:
    from deepface import DeepFace
    print("✓ DeepFace class imported successfully")
except Exception as e:
    print(f"✗ DeepFace class import failed: {e}")

print("\nAll tests completed!") 