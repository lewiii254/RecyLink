#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment files...\n');

// Server .env
const serverEnvContent = `# Database
MONGODB_URI=mongodb://localhost:27017/recylink

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173`;

// Client .env
const clientEnvContent = `# API Configuration
VITE_API_URL=http://localhost:5000/api`;

try {
  // Create server .env
  if (!fs.existsSync('server/.env')) {
    fs.writeFileSync('server/.env', serverEnvContent);
    console.log('✅ Created server/.env');
  } else {
    console.log('⚠️  server/.env already exists');
  }

  // Create client .env
  if (!fs.existsSync('client/.env')) {
    fs.writeFileSync('client/.env', clientEnvContent);
    console.log('✅ Created client/.env');
  } else {
    console.log('⚠️  client/.env already exists');
  }

  console.log('\n🎉 Environment setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure MongoDB is running (or update MONGODB_URI in server/.env)');
  console.log('2. Start the development servers: npm run dev');
  console.log('3. Visit http://localhost:5173');

} catch (error) {
  console.error('❌ Error setting up environment files:', error.message);
}
