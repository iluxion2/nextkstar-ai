#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to update API URL in the config file
function updateApiUrl(newUrl) {
  const configPath = path.join(__dirname, 'app', 'config', 'api.ts');
  
  if (!fs.existsSync(configPath)) {
    console.error('❌ API config file not found:', configPath);
    return false;
  }

  let content = fs.readFileSync(configPath, 'utf8');
  
  // Replace the localhost URL with the new URL
  const updatedContent = content.replace(
    /return 'http:\/\/localhost:8000' \/\/ This will be replaced by environment variable/g,
    `return '${newUrl}'`
  );
  
  fs.writeFileSync(configPath, updatedContent);
  console.log('✅ API URL updated successfully!');
  console.log(`   New URL: ${newUrl}`);
  return true;
}

// Function to test backend connection
function testBackend(url) {
  try {
    console.log(`🔍 Testing backend at: ${url}`);
    const response = execSync(`curl -s ${url}/health`, { encoding: 'utf8' });
    console.log('✅ Backend is working!');
    console.log('Response:', response);
    return true;
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
    return false;
  }
}

// Function to build and deploy
function buildAndDeploy() {
  try {
    console.log('🔨 Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('🚀 Deploying to Firebase...');
    execSync('firebase deploy', { stdio: 'inherit' });
    
    console.log('✅ Deployment successful!');
    return true;
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return false;
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Usage: node update-backend-url.js <backend-url>');
    console.log('   Example: node update-backend-url.js https://your-backend.onrender.com');
    console.log('');
    console.log('🔧 This script will:');
    console.log('   1. Test your backend connection');
    console.log('   2. Update the API URL in your frontend config');
    console.log('   3. Build your Next.js project');
    console.log('   4. Deploy to Firebase Hosting');
    process.exit(1);
  }
  
  const newUrl = args[0];
  
  console.log('🔍 Testing backend connection...');
  if (testBackend(newUrl)) {
    console.log('');
    console.log('🔧 Updating API URL...');
    if (updateApiUrl(newUrl)) {
      console.log('');
      console.log('🚀 Building and deploying...');
      if (buildAndDeploy()) {
        console.log('');
        console.log('🎉 Success! Your live site should now work with the new backend URL.');
        console.log(`   Live site: https://nextkstar.com`);
        console.log(`   Backend: ${newUrl}`);
      }
    }
  } else {
    console.log('');
    console.log('⚠️  Backend is not accessible. Please check:');
    console.log('   1. Is your backend deployed on Render?');
    console.log('   2. Is the URL correct?');
    console.log('   3. Is the backend service running?');
  }
}

module.exports = { updateApiUrl, testBackend, buildAndDeploy }; 