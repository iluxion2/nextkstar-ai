#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the Railway URL from command line argument
const railwayUrl = process.argv[2];

if (!railwayUrl) {
  console.log('Usage: node update-api-url.js <RAILWAY_URL>');
  console.log('Example: node update-api-url.js https://nextkstar-backend.railway.app');
  process.exit(1);
}

// Remove trailing slash if present
const cleanUrl = railwayUrl.replace(/\/$/, '');

// Read the analysis page
const analysisPath = path.join(__dirname, 'app', 'analysis', 'page.tsx');
let content = fs.readFileSync(analysisPath, 'utf8');

// Replace the localhost URL with Railway URL
const oldUrl = 'http://localhost:8000';
const newUrl = cleanUrl;

if (content.includes(oldUrl)) {
  content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
  
  // Write back to file
  fs.writeFileSync(analysisPath, content);
  
  console.log(`✅ Updated API URL from ${oldUrl} to ${newUrl}`);
  console.log('📝 Now run: npm run build && firebase deploy');
} else {
  console.log('❌ Could not find localhost:8000 in the file');
  console.log('🔍 Please manually update the API URL in app/analysis/page.tsx');
} 