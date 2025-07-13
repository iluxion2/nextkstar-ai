#!/usr/bin/env python3
import uvicorn
from pyngrok import ngrok
import os

def main():
    # Start the FastAPI server
    print("Starting FastAPI server...")
    
    # Create a tunnel
    print("Creating tunnel...")
    public_url = ngrok.connect(8000)
    print(f"🌐 Your backend is now accessible at: {public_url}")
    print(f"🔗 API endpoint: {public_url}/analyze/")
    
    # Update the frontend environment variable
    print("\n📝 Update your frontend with this URL:")
    print(f"NEXT_PUBLIC_API_URL={public_url}")
    
    print("\n🚀 Starting server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main() 