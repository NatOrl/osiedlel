# OsiedleL

Full-stack application with React frontend and Express backend.

## Project Structure

```
OsiedleL/
├── frontend/          # React + Vite frontend
├── backend/           # Express.js backend
└── README.md
```

## Getting Started

### Installation

Install dependencies for both frontend and backend:

```bash
npm run install:all
```

Or install them separately:

```bash
npm run install:frontend
npm run install:backend
```

### Development

Run both frontend and backend concurrently:

```bash
npm install
npm run dev
```

Or run them separately:

**Frontend** (runs on http://localhost:5173):
```bash
npm run dev:frontend
```

**Backend** (runs on http://localhost:5000):
```bash
npm run dev:backend
```

### Production Build

Build the frontend:
```bash
npm run build:frontend
```

Start the backend:
```bash
npm run start:backend
```

## Tech Stack

### Frontend
- React 19
- Vite
- ESLint

### Backend
- Node.js
- Express.js
- CORS
- PostgreSQL (pg driver)
- dotenv

## Port Configuration

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Database:** PostgreSQL on port 5432

## API Endpoints

The backend provides the following endpoints:

- `GET /api` - Welcome message
- `GET /api/health` - Health check
- `GET /api/data` - Example static data
- `GET /api/db/test` - Database connection test
- `GET /api/items` - Get all items from database
- `POST /api/items` - Create new item

## Database Setup

See [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md) for detailed PostgreSQL setup instructions.

Quick setup:
1. Install PostgreSQL
2. Create database: `CREATE DATABASE osiedlel;`
3. Run schema: `psql -U postgres -d osiedlel -f backend/database/schema.sql`
4. Copy `backend/.env.example` to `backend/.env` and configure
5. Install backend dependencies: `npm run install:backend`

## Development Notes

- Frontend runs on port 5173 and proxies `/api/*` requests to backend
- Backend runs on port 3000
- CORS is enabled for cross-origin requests
- Database connection is tested on server startup
# osiedlel
