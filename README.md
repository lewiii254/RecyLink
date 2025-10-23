# RecyLink - Waste Collection & Reward System (MERN MVP)

A comprehensive waste collection and reward system built with the MERN stack.

## Project Structure

```
recylink-mern-mvp/
├── client/          # React frontend (Vite + Tailwind CSS)
├── server/          # Node.js backend (Express + MongoDB)
├── package.json     # Root package.json for monorepo scripts
└── README.md
```

## Features

- **User Authentication**: JWT-based authentication with role-based access
- **Waste Reporting**: Users can report waste issues with location and images
- **Verification System**: Community-driven verification with point rewards
- **Admin Dashboard**: Admin tools for managing reports and collections
- **Point System**: Internal reward system for user engagement

## 🚀 Quick Start

For a complete setup guide, see **[GETTING_STARTED.md](./GETTING_STARTED.md)** - a comprehensive guide for learners.

### Quick Setup

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   ```bash
   node setup-env.js
   ```

3. **Configure MongoDB** in `server/.env`

4. **Start development servers**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

### Test Credentials
- **Admin**: `admin@recylink.com` / `password123`
- **Regular User**: `test@example.com` / `password123`

## Troubleshooting

### Website Flickering Issue
If you experience flickering between `/auth` and home page:

1. **Check server status**: Make sure the backend server is running on port 5000
2. **Check MongoDB**: Ensure MongoDB is running and accessible
3. **Clear browser cache**: Clear your browser's cache and cookies
4. **Check console**: Open browser dev tools and check for any errors

### Common Issues

**Server won't start:**
- Check if port 5000 is available
- Verify MongoDB connection string in `server/.env`
- Make sure all dependencies are installed: `npm run install-all`

**Client won't start:**
- Check if port 5173 is available
- Verify `client/.env` exists with correct API URL

**Authentication issues:**
- Check browser console for errors
- Verify JWT secret in `server/.env`
- Try creating a new user or use the admin credentials

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Reports
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get user's reports (or all for admin)
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id/verify` - Verify a report

### Admin
- `PUT /api/admin/reports/:id/collect` - Mark report as collected

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Database**: MongoDB with Mongoose ODM
