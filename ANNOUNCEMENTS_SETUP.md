# Announcements Module Setup Guide

This guide will help you set up and test the newly implemented Announcements Module (Point #2 from the frontend roadmap).

## What Was Implemented

✅ **Backend:**
- Created `posts` table in PostgreSQL database
- Implemented full CRUD API endpoints at `/api/posts`
- Added sample announcement data in Polish

✅ **Frontend:**
- Updated Announcements page to fetch data from API
- Added loading state with spinner animation
- Added error handling with retry functionality
- Displays announcements in chronological order

## Setup Instructions

### Step 1: Update the Database

If you already have the database set up, you need to add the new `posts` table. Choose one of these methods:

#### Option A: Run the migration script (Recommended)
```bash
# Using psql command line
psql -U postgres -d osiedlel -f backend/database/add-posts-table.sql
```

#### Option B: Recreate the entire database
```bash
# Drop and recreate (WARNING: This will delete all existing data)
psql -U postgres -c "DROP DATABASE IF EXISTS osiedlel;"
psql -U postgres -c "CREATE DATABASE osiedlel;"
psql -U postgres -d osiedlel -f backend/database/schema.sql
```

### Step 2: Start the Backend Server

```bash
cd backend
npm install  # If not already installed
npm start
```

The backend should start on `http://localhost:3000`

### Step 3: Start the Frontend Development Server

```bash
cd frontend
npm install  # If not already installed
npm run dev
```

The frontend should start on `http://localhost:5173`

### Step 4: Test the Implementation

1. **Open your browser** and navigate to `http://localhost:5173`
2. **Click on "Ogłoszenia"** (Announcements) in the navigation menu
3. **You should see:**
   - A loading spinner briefly
   - Three sample announcements displayed in chronological order
   - Each announcement showing: category badge, date, title, summary, and content

## API Endpoints

The following endpoints are now available:

### Get All Posts
```bash
GET http://localhost:3000/api/posts
```

### Get Single Post
```bash
GET http://localhost:3000/api/posts/:id
```

### Create New Post
```bash
POST http://localhost:3000/api/posts
Content-Type: application/json

{
  "title": "Nowe Ogłoszenie",
  "category": "Informacja",
  "summary": "Krótkie podsumowanie",
  "content": "Pełna treść ogłoszenia",
  "published_date": "2026-03-27"
}
```

### Update Post
```bash
PUT http://localhost:3000/api/posts/:id
Content-Type: application/json

{
  "title": "Zaktualizowany Tytuł",
  "category": "Informacja",
  "summary": "Zaktualizowane podsumowanie",
  "content": "Zaktualizowana treść",
  "published_date": "2026-03-27"
}
```

### Delete Post
```bash
DELETE http://localhost:3000/api/posts/:id
```

## Testing the API with curl

### Get all announcements:
```bash
curl http://localhost:3000/api/posts
```

### Create a new announcement:
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Test Announcement\",\"category\":\"Test\",\"summary\":\"Test summary\",\"content\":\"Test content\"}"
```

## Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running
- Check your `.env` file in the backend folder has correct database credentials
- Verify the database `osiedlel` exists

### Posts Table Not Found
- Run the migration script: `psql -U postgres -d osiedlel -f backend/database/add-posts-table.sql`
- Or recreate the database using the full schema.sql

### Frontend Shows Error State
- Check that the backend server is running on port 3000
- Open browser console (F12) to see detailed error messages
- Verify the API proxy is configured correctly in `vite.config.js`

### No Announcements Displayed
- Check if the posts table has data: `psql -U postgres -d osiedlel -c "SELECT * FROM posts;"`
- If empty, run the migration script to insert sample data

## Database Schema

The `posts` table structure:

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    summary TEXT,
    content TEXT NOT NULL,
    published_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Next Steps

Now that the Announcements Module is complete, you can:

1. **Add more announcements** using the POST endpoint
2. **Implement the Admin Panel** (Point #4) to manage announcements through a UI
3. **Add pagination** if you have many announcements
4. **Add filtering** by category
5. **Implement individual announcement detail pages**

## Files Modified

- `backend/database/schema.sql` - Added posts table
- `backend/database/add-posts-table.sql` - Migration script
- `backend/server.js` - Added /api/posts endpoints
- `frontend/src/pages/Announcements.jsx` - API integration
- `frontend/src/pages/Announcements.css` - Loading/error styles
- `frontend/README.md` - Updated roadmap
