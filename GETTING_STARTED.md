# 🚀 RecyLink - Complete Setup Guide for Learners

Welcome to RecyLink! This comprehensive guide will help you set up the complete MERN stack application on your machine. Follow these steps carefully to ensure everything works perfectly.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Testing the Application](#testing-the-application)
8. [Troubleshooting](#troubleshooting)
9. [Project Structure](#project-structure)
10. [Features Overview](#features-overview)

---

## 🔧 Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (Version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`
   - Should show: `v18.x.x` or higher

2. **MongoDB** (Version 5.0 or higher)
   - **Option A: MongoDB Community Server (Local)**
     - Download from: https://www.mongodb.com/try/download/community
     - Follow installation guide for your operating system
   - **Option B: MongoDB Atlas (Cloud - Recommended)**
     - Sign up at: https://www.mongodb.com/atlas
     - Create a free cluster (no credit card required)

3. **Git** (Latest version)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Code Editor** (Recommended: VS Code)
   - Download from: https://code.visualstudio.com/
   - Install extensions: ES7+ React/Redux/React-Native snippets, Prettier

---

## 💻 System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **Internet**: Required for downloading dependencies and MongoDB Atlas

---

## 📥 Installation Steps

### Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd Desktop

# Clone the repository
git clone <repository-url>
cd RecyLink
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

This command will:
- Install root dependencies
- Install server dependencies (Node.js/Express)
- Install client dependencies (React/Vite)

### Step 3: Verify Installation

```bash
# Check if all packages are installed correctly
npm list --depth=0
```

---

## 🗄️ Database Setup

### Option A: MongoDB Atlas (Recommended for Beginners)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up with your email
   - Choose the free tier (M0 Sandbox)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select a cloud provider and region
   - Name your cluster (e.g., "recylink-cluster")

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `recylink-user`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `recylink`

### Option B: Local MongoDB Installation

1. **Install MongoDB Community Server**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow the installation wizard
   - Make sure to install MongoDB Compass (GUI tool)

2. **Start MongoDB Service**
   - **Windows**: MongoDB should start automatically as a service
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. **Verify MongoDB is Running**
   ```bash
   # Check if MongoDB is running
   mongosh --version
   ```

---

## ⚙️ Environment Configuration

### Step 1: Set Up Environment Files

```bash
# Run the setup script to create environment files
node setup-env.js
```

This creates:
- `server/.env` - Server configuration
- `client/.env` - Client configuration

### Step 2: Configure Server Environment

Edit `server/.env`:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://recylink-user:YOUR_PASSWORD@recylink-cluster.xxxxx.mongodb.net/recylink?retryWrites=true&w=majority

# JWT Secret (Change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

**Important**: Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password.

### Step 3: Configure Client Environment

The `client/.env` file should already be configured correctly:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Step 1: Start the Development Servers

```bash
# Start both server and client simultaneously
npm run dev
```

This will start:
- **Backend Server**: http://localhost:5000
- **Frontend Client**: http://localhost:5173

### Step 2: Verify Everything is Working

1. **Check Backend Health**
   - Open: http://localhost:5000/api/health
   - Should show: `{"success":true,"message":"RecyLink API is running"}`

2. **Check Frontend**
   - Open: http://localhost:5173
   - Should show the RecyLink homepage

### Step 3: Create Admin User (Optional)

```bash
# Create an admin user for testing
cd server
node ../create-admin.js
cd ..
```

This creates:
- Email: `admin@recylink.com`
- Password: `password123`
- Role: Admin

---

## 🧪 Testing the Application

### Test User Registration

1. Go to http://localhost:5173
2. Click "Sign In" → "Create a new account"
3. Fill in the registration form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Create account"
5. You should be redirected to the dashboard

### Test Report Submission

1. Click "New Report" in the dashboard
2. Fill in the report form:
   - Title: `Test Waste Report`
   - Description: `This is a test report`
   - Location: Use "Use current location" or enter coordinates
   - Image URL: `https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500`
3. Click "Submit Report"
4. You should see a success message and earn 25 points

### Test Report Verification

1. Go to "Reports" page
2. Find a report from another user
3. Click the verify button (checkmark icon)
4. The report should show increased verification count

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot find module" errors

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json
npm run install-all
```

#### 2. MongoDB Connection Error

**For MongoDB Atlas:**
- Check your connection string
- Verify your IP address is whitelisted
- Ensure your database user has correct permissions

**For Local MongoDB:**
```bash
# Check if MongoDB is running
netstat -an | findstr :27017  # Windows
lsof -i :27017                # macOS/Linux
```

#### 3. Port Already in Use

```bash
# Kill processes using ports 5000 and 5173
npx kill-port 5000
npx kill-port 5173
```

#### 4. Frontend Not Loading

- Check if the backend server is running on port 5000
- Verify `client/.env` has correct API URL
- Clear browser cache and cookies

#### 5. Authentication Issues

- Check JWT_SECRET in `server/.env`
- Verify MongoDB connection
- Try creating a new user

### Getting Help

If you encounter issues:

1. **Check the console logs** in your terminal
2. **Check browser developer tools** (F12) for errors
3. **Verify all prerequisites** are installed correctly
4. **Check environment variables** are set correctly

---

## 📁 Project Structure

```
RecyLink/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context (Authentication)
│   │   ├── pages/          # Main application pages
│   │   ├── utils/          # API utilities and helpers
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js Backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication & validation
│   ├── server.js           # Main server file
│   └── package.json
├── package.json            # Root package.json
├── README.md
└── GETTING_STARTED.md      # This file
```

---

## ✨ Features Overview

### 🔐 Authentication System
- User registration and login
- JWT-based authentication
- Role-based access control (User/Admin)
- Secure password hashing

### 📊 Dashboard
- User statistics and points display
- Recent reports overview
- Quick actions for common tasks
- Points breakdown and tips

### 📝 Report Management
- Create waste reports with photos and location
- View and filter reports
- Community verification system
- Status tracking (Reported → Verified → Collected)

### 🏆 Points & Rewards System
- **25 points** for submitting a report
- **50 points** when your report gets verified (3 verifications)
- **100 points** when waste is collected
- Points history and statistics

### 👨‍💼 Admin Features
- View all community reports
- Mark reports as collected
- Manage user accounts
- System statistics

### 🎨 Modern UI/UX
- Responsive design (mobile-friendly)
- Clean, professional interface
- Real-time notifications
- Loading states and error handling

---

## 🎯 Learning Objectives

By working with this project, you'll learn:

1. **Full-Stack Development**
   - React.js with hooks and context
   - Node.js with Express.js
   - MongoDB with Mongoose
   - RESTful API design

2. **Authentication & Security**
   - JWT tokens
   - Password hashing
   - Protected routes
   - CORS configuration

3. **Database Design**
   - MongoDB schemas
   - Relationships between collections
   - Data validation
   - Indexing for performance

4. **Modern Development Practices**
   - Environment variables
   - Error handling
   - Code organization
   - Git version control

5. **UI/UX Design**
   - Responsive design with Tailwind CSS
   - Component-based architecture
   - State management
   - User feedback systems

---

## 🚀 Next Steps

Once you have the application running:

1. **Explore the Code**
   - Read through the components and understand the structure
   - Modify the UI to match your preferences
   - Add new features or improve existing ones

2. **Deploy to Production**
   - Deploy backend to Heroku, Railway, or DigitalOcean
   - Deploy frontend to Vercel, Netlify, or GitHub Pages
   - Set up production MongoDB Atlas cluster

3. **Extend the Application**
   - Add email notifications
   - Implement real-time updates with Socket.io
   - Add mobile app with React Native
   - Integrate with blockchain for token rewards

---

## 📞 Support

If you need help:

1. **Check this guide** first for common solutions
2. **Review the code comments** for implementation details
3. **Ask questions** in your learning community
4. **Experiment** with the code to understand how it works

---

## 🎉 Congratulations!

You now have a fully functional MERN stack application running on your machine! This project demonstrates modern web development practices and provides a solid foundation for building more complex applications.

Happy coding! 🚀
