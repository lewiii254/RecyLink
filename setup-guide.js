#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 RecyLink Setup Guide\n');

console.log('📋 Prerequisites Checklist:');
console.log('□ Node.js (v18+) installed');
console.log('□ MongoDB (Atlas or Local) configured');
console.log('□ Git installed');
console.log('□ Code editor (VS Code recommended)\n');

console.log('🔧 Setup Steps:');
console.log('1. Install dependencies: npm run install-all');
console.log('2. Set up environment: node setup-env.js');
console.log('3. Configure MongoDB connection in server/.env');
console.log('4. Start development: npm run dev');
console.log('5. Create admin user: cd server && node ../create-admin.js\n');

console.log('🌐 Access Points:');
console.log('• Frontend: http://localhost:5173');
console.log('• Backend API: http://localhost:5000/api');
console.log('• Health Check: http://localhost:5000/api/health\n');

console.log('👤 Test Credentials:');
console.log('• Admin: admin@recylink.com / password123');
console.log('• Regular: test@example.com / password123\n');

console.log('📚 Documentation:');
console.log('• Complete guide: GETTING_STARTED.md');
console.log('• Project info: README.md\n');

console.log('🎯 Features to Test:');
console.log('• User registration and login');
console.log('• Report submission (earn 25 points)');
console.log('• Report verification (earn 50 points)');
console.log('• Admin report collection (earn 100 points)');
console.log('• Dashboard with points tracking\n');

console.log('🆘 Need Help?');
console.log('• Check GETTING_STARTED.md for detailed instructions');
console.log('• Verify all prerequisites are installed');
console.log('• Check console logs for error messages\n');

console.log('Happy coding! 🎉');
