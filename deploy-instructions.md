# Deployment Instructions

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click "New repository"
3. Name: `nextkstar-ai`
4. Description: `AI-powered face analysis platform`
5. Make it **Public**
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, run these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nextkstar-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select the `nextkstar-ai` repository
6. Railway will automatically detect it's a Python project
7. Deploy!

## Step 4: Update Frontend

Once Railway deploys, you'll get a URL like:
`https://your-app.railway.app`

Then update your frontend to use this URL:

```bash
# Update the API URL in your frontend
# Replace localhost:8000 with your Railway URL
```

## Step 5: Deploy Frontend

```bash
npm run build
firebase deploy
```

## Done! 🎉

Your NextKStar app will now be fully functional at:
- Frontend: https://nextkstar.com
- Backend: https://your-app.railway.app 