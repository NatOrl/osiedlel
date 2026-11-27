# OsiedleL - Project Summary

## Overview

Full-stack application with React frontend, Express backend, and PostgreSQL database.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   React App     │────────▶│  Express API    │────────▶│   PostgreSQL    │
│   Port: 5173    │  Proxy  │   Port: 3000    │   pg    │   Port: 5432    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Project Structure

```
OsiedleL/
├── frontend/                    # React + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   └── ApiExample.jsx  # Example API integration
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js          # Vite config with proxy to backend
│   ├── package.json
│   └── README.md
│
├── backend/                     # Express.js Server
│   ├── database/
│   │   └── schema.sql          # PostgreSQL database schema
│   ├── server.js               # Main server file with API routes
│   ├── package.json
│   ├── .env.example            # Environment variables template
│   ├── .gitignore
│   ├── README.md
│   └── DATABASE_SETUP.md       # Database setup guide
│
├── package.json                 # Root package.json for running both
├── .gitignore
├── README.md                    # Main documentation
├── QUICKSTART.md               # Quick start guide
└── PROJECT_SUMMARY.md          # This file

```

## Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **pg** - PostgreSQL client
- **dotenv** - Environment variable management

### Database
- **PostgreSQL** - Relational database

## Port Configuration

| Service    | Port | URL                      |
|------------|------|--------------------------|
| Frontend   | 5173 | http://localhost:5173    |
| Backend    | 3000 | http://localhost:3000    |
| PostgreSQL | 5432 | localhost:5432           |

## API Endpoints

### General Endpoints
- `GET /api` - Welcome message
- `GET /api/health` - Health check with timestamp
- `GET /api/data` - Example static data

### Database Endpoints
- `GET /api/db/test` - Test database connection
- `GET /api/items` - Get all items from database
- `POST /api/items` - Create new item
  - Body: `{ "name": "string", "description": "string" }`

## Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install all project dependencies
npm run install:all
```

### 2. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE osiedlel;
\q

# Run database schema
cd backend
psql -U postgres -d osiedlel -f database/schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Run the Application

```bash
# Run both frontend and backend together
npm run dev

# Or run separately:
npm run dev:frontend  # Terminal 1
npm run dev:backend   # Terminal 2
```

## Development Workflow

### Frontend Development
1. Navigate to `frontend/` directory
2. Run `npm run dev`
3. Edit files in `src/`
4. Hot Module Replacement (HMR) updates automatically

### Backend Development
1. Navigate to `backend/` directory
2. Run `npm run dev` (uses --watch flag)
3. Edit `server.js` or add new route files
4. Server restarts automatically on changes

### Database Changes
1. Edit `backend/database/schema.sql`
2. Run the updated schema against your database
3. Consider creating migration scripts for production

## Environment Variables

### Backend (.env)
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=osiedlel
DB_PASSWORD=your_password
DB_PORT=5432
```

## Key Features

### Frontend → Backend Communication
- Vite proxy configuration forwards `/api/*` requests to backend
- No CORS issues during development
- Clean API calls without hardcoded URLs

### Database Integration
- Connection pooling for efficient database access
- Parameterized queries to prevent SQL injection
- Error handling for database operations
- Automatic timestamp updates via triggers

### Example API Integration
- `ApiExample.jsx` component demonstrates:
  - Fetching data from backend
  - Loading states
  - Error handling
  - Refresh functionality

## Production Deployment

### Frontend
```bash
npm run build:frontend
# Outputs to frontend/dist/
# Deploy to static hosting (Vercel, Netlify, etc.)
```

### Backend
```bash
# Set environment variables
# Run: npm start
# Deploy to Node.js hosting (Heroku, Railway, etc.)
```

### Database
- Use managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
- Update backend .env with production credentials

## Common Commands

```bash
# Development
npm run dev                    # Run both frontend & backend
npm run dev:frontend          # Run only frontend
npm run dev:backend           # Run only backend

# Installation
npm run install:all           # Install all dependencies
npm run install:frontend      # Install frontend dependencies
npm run install:backend       # Install backend dependencies

# Production
npm run build:frontend        # Build frontend for production
npm run start:backend         # Start backend in production mode
```

## Documentation Files

- **README.md** - Main project documentation
- **QUICKSTART.md** - Quick start guide for developers
- **backend/README.md** - Backend-specific documentation
- **backend/DATABASE_SETUP.md** - Detailed database setup guide
- **frontend/README.md** - Frontend-specific documentation
- **PROJECT_SUMMARY.md** - This comprehensive overview

## Next Steps

1. **Set up PostgreSQL** - Follow `backend/DATABASE_SETUP.md`
2. **Install dependencies** - Run `npm run install:all`
3. **Configure environment** - Copy and edit `backend/.env`
4. **Start development** - Run `npm run dev`
5. **Test API** - Visit http://localhost:5173 and check the API Example component

## Troubleshooting

### Frontend won't start
- Check if port 5173 is available
- Run `npm install` in frontend directory

### Backend won't start
- Check if port 3000 is available
- Verify PostgreSQL is running
- Check .env configuration

### Database connection errors
- Ensure PostgreSQL is running
- Verify credentials in .env
- Check if database 'osiedlel' exists
- Confirm schema has been run

### API calls failing
- Ensure backend is running on port 3000
- Check browser console for errors
- Verify proxy configuration in vite.config.js

## Support

For issues or questions:
1. Check the documentation files
2. Review error messages in console/terminal
3. Verify all services are running
4. Check environment configuration
