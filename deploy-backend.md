# Backend Deployment Instructions

## Option 1: Railway (Recommended - Easiest)

1. **Go to [railway.app](https://railway.app)** and sign up
2. **Create a new project**
3. **Connect your GitHub** (upload your backend code)
4. **Deploy automatically**

## Option 2: Render (Alternative)

1. **Go to [render.com](https://render.com)** and sign up
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Set build command**: `pip install -r requirements.txt`
5. **Set start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Option 3: Heroku (Paid)

1. **Install Heroku CLI**
2. **Run these commands**:
   ```bash
   cd ai-face-backend
   heroku create your-app-name
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

## After Deployment

Once deployed, you'll get a URL like:
- Railway: `https://your-app.railway.app`
- Render: `https://your-app.onrender.com`
- Heroku: `https://your-app.herokuapp.com`

Then update your frontend to use this URL instead of localhost:8000.

## Quick Test

Test your deployed backend:
```bash
curl https://your-deployed-url.com/
```

You should see: `{"message":"AI Face Analysis API is running!","celebrities_loaded":140,"csv_data_loaded":1778}` 