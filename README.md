# NextKStar - AI Face Analysis Platform

A revolutionary AI-powered face analysis platform that provides beauty scoring, celebrity matching, and cultural bias insights.

## Features

- **AI Beauty Analysis**: Advanced facial feature analysis with beauty scoring
- **Celebrity Matching**: Find your celebrity twin using AI
- **Cultural Bias Insights**: Understand beauty standards across different cultures
- **Multi-language Support**: English, Korean, Japanese
- **Real-time Analysis**: Instant results with detailed breakdowns
- **Responsive Design**: Works perfectly on all devices

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Firebase** - Authentication & Database

### Backend
- **FastAPI** - Python web framework
- **DeepFace** - AI face analysis
- **OpenCV** - Image processing
- **Uvicorn** - ASGI server

## Quick Start

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd ai-face-backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Deployment

### Frontend (Firebase Hosting)
```bash
npm run build
firebase deploy
```

### Backend (Railway/Render)
See `deploy-backend.md` for detailed instructions.

## Live Demo

Visit: [https://nextkstar.com](https://nextkstar.com)

## License

© 2025 KStar. All rights reserved. 