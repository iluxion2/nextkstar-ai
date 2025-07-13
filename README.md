# AI Face Analysis Backend

A FastAPI backend that provides AI-powered face analysis including beauty scoring, age detection, emotion analysis, and celebrity lookalike matching using DeepFace.

## Features

- **Face Analysis**: Age, gender, emotion, and race detection
- **Beauty Scoring**: AI-powered beauty score calculation
- **Celebrity Lookalike**: Find which celebrity you look most like
- **Real-time API**: Fast response times with async processing
- **CORS Enabled**: Works with your Next.js frontend

## Setup

### 1. Install Python Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Add Celebrity Images

Place celebrity images in the `celebrities/` folder:
- Supported formats: JPG, JPEG, PNG
- Use clear, front-facing photos
- Name files descriptively (e.g., `jennie_blackpink.jpg`, `leonardo_dicaprio.jpg`)

### 3. Run the Backend

```bash
# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /` - API status and celebrity count
- `GET /health` - Health check

### Face Analysis
- `POST /analyze/` - Upload image for analysis
- `GET /celebrities/` - List loaded celebrities
- `POST /reload-celebrities/` - Reload celebrity database

## Usage Example

### Upload and Analyze Image

```javascript
// Frontend code (Next.js/React)
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('http://localhost:8000/analyze/', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result);
```

### Response Format

```json
{
  "success": true,
  "analysis": {
    "age": 25,
    "gender": "Woman",
    "emotion": "happy",
    "race": "asian",
    "beauty_score": 8.2
  },
  "lookalike": {
    "name": "jennie_blackpink",
    "similarity": 85.3,
    "image": "celebrities/jennie_blackpink.jpg"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

## Integration with Next.js Frontend

Update your frontend API calls to use the real backend:

```javascript
// Replace mock data with real API calls
const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:8000/analyze/', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};
```

## Troubleshooting

### Common Issues

1. **No celebrities loaded**: Add images to the `celebrities/` folder
2. **Face not detected**: Ensure the image has a clear, front-facing face
3. **CORS errors**: The backend is configured for localhost:3003 and localhost:3000
4. **Memory issues**: DeepFace models are large; ensure sufficient RAM

### Performance Tips

- Use smaller images (max 1024x1024) for faster processing
- The first analysis may be slower as models load
- Consider using a GPU for better performance

## Development

### Adding New Features

1. **New Analysis Types**: Modify the DeepFace.analyze() call
2. **Custom Beauty Algorithm**: Update calculate_beauty_score()
3. **Additional Celebrities**: Add images to celebrities/ folder

### Deployment

This backend can be deployed to:
- **Render.com** (free tier available)
- **Railway.app** (free tier available)
- **Fly.io** (free tier available)
- **Hugging Face Spaces** (for demos)

## License

MIT License - Feel free to use and modify for your projects! 