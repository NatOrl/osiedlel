# Quick Start Guide

## Project Structure

```
OsiedleL/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   └── ApiExample.jsx    # Example API integration component
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/           # Express.js server
│   ├── server.js      # Main server file
│   └── package.json
└── package.json       # Root package.json for running both
```

## First Time Setup

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

   Or install separately:
   ```bash
   npm run install:frontend
   npm run install:backend
   ```

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)

```bash
npm install
npm run dev
```

This will start:
- Backend on http://localhost:3000
- Frontend on http://localhost:5173

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

## Testing the API Integration

Once both servers are running:

1. Open http://localhost:5173 in your browser
2. You should see the React app with an "API Integration Example" section
3. The component will automatically fetch data from the backend
4. Click "Refresh Data" to test the API connection

## Database Setup (PostgreSQL)

Before running the backend, set up PostgreSQL:

1. **Install PostgreSQL** (if not already installed)
2. **Create database:**
   ```bash
   psql -U postgres
   CREATE DATABASE osiedlel;
   \q
   ```
3. **Run database schema:**
   ```bash
   cd backend
   psql -U postgres -d osiedlel -f database/schema.sql
   ```
4. **Configure environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

See [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md) for detailed instructions.

## Available API Endpoints

- `GET http://localhost:3000/api` - Welcome message
- `GET http://localhost:3000/api/health` - Health check
- `GET http://localhost:3000/api/data` - Example static data
- `GET http://localhost:3000/api/db/test` - Database connection test
- `GET http://localhost:3000/api/items` - Get all items from database
- `POST http://localhost:3000/api/items` - Create new item

## Adding New API Endpoints

Edit `backend/server.js`:

```javascript
app.get('/api/your-endpoint', (req, res) => {
  res.json({ message: 'Your response' });
});
```

## Calling API from Frontend

The frontend is configured with a proxy, so you can call APIs like this:

```javascript
fetch('/api/your-endpoint')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Building for Production

```bash
npm run build:frontend
```

The built files will be in `frontend/dist/`
