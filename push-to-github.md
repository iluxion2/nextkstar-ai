# Push to GitHub Instructions

After creating your GitHub repository, run these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Example:
If your GitHub username is `lucaschoi` and repository name is `nextkstar`:
```bash
git remote add origin https://github.com/lucaschoi/nextkstar.git
git branch -M main
git push -u origin main
```

## After pushing to GitHub:

1. **Deploy Backend to Railway** (follow deploy-backend.md)
2. **Update Frontend API URL** (run update-api-url.js)
3. **Deploy Frontend to Firebase** (npm run build && firebase deploy)

Your live site will be fully functional with AI analysis! 