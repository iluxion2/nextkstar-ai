#!/usr/bin/env python3
import requests

# Test the API
try:
    # Test root endpoint
    r = requests.get('http://localhost:8000/')
    print("Root endpoint:", r.status_code)
    if r.status_code == 200:
        data = r.json()
        print(f"Message: {data.get('message')}")
        print(f"Celebrities loaded: {data.get('celebrities_loaded')}")
        print(f"CSV data loaded: {data.get('csv_data_loaded')}")
    
    print("\n" + "="*50)
    
    # Test celebrities endpoint
    r = requests.get('http://localhost:8000/celebrities')
    print("Celebrities endpoint:", r.status_code)
    if r.status_code == 200:
        data = r.json()
        print(f"Total celebrities returned: {len(data)}")
        print("First 5 celebrities:")
        for i, celeb in enumerate(data[:5]):
            print(f"  {i+1}. {celeb}")
    else:
        print("Error:", r.text[:200])
        
except Exception as e:
    print(f"Error testing API: {e}") 