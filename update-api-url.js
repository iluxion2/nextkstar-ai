#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
    /return 'http:\/\/localhost:8000'/g,
    `return '${newUrl}'`
  );
  
  fs.writeFileSync(configPath, updatedContent);
  console.log('✅ API URL updated successfully!');
  console.log(`   New URL: ${newUrl}`);
  return true;
}

// Function to build and deploy
function buildAndDeploy() {
  console.log('🚀 Building and deploying...');
  
  // Build the project
  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
    
    // Deploy to Firebase
    execSync('firebase deploy', { stdio: 'inherit' });
    console.log('✅ Deployment completed successfully!');
    
  } catch (error) {
    console.error('❌ Build or deployment failed:', error.message);
    return false;
  }
  
  return true;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Usage: node update-api-url.js <backend-url>');
    console.log('   Example: node update-api-url.js https://your-backend.railway.app');
    console.log('');
    console.log('🔧 This script will:');
    console.log('   1. Update the API URL in your frontend config');
    console.log('   2. Build your Next.js project');
    console.log('   3. Deploy to Firebase Hosting');
    process.exit(1);
  }
  
  const newUrl = args[0];
  
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
}

module.exports = { updateApiUrl, buildAndDeploy }; 