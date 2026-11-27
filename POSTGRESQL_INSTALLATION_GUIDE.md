# PostgreSQL Installation & Setup Guide

## Current Status

✅ PostgreSQL 17 is being installed via winget
✅ Backend .env file configured with password: `postgres`
✅ Database setup script created

## What to Do After Installation Completes

### Step 1: Complete PostgreSQL Installation

The installer will open a GUI window. Follow these steps:

1. **Welcome Screen** - Click "Next"
2. **Installation Directory** - Keep default: `C:\Program Files\PostgreSQL\17` - Click "Next"
3. **Select Components** - Keep all selected - Click "Next"
4. **Data Directory** - Keep default - Click "Next"
5. **Password** - Enter: `postgres` (as we configured) - Click "Next"
6. **Port** - Keep default: `5432` - Click "Next"
7. **Locale** - Keep default - Click "Next"
8. **Summary** - Click "Next"
9. **Installation** - Wait for completion
10. **Finish** - Uncheck "Launch Stack Builder" - Click "Finish"

### Step 2: Verify PostgreSQL is Running

Open a new terminal and run:

```bash
# Check if PostgreSQL service is running
sc query postgresql-x64-17
```

If not running, start it:

```bash
net start postgresql-x64-17
```

### Step 3: Run Database Setup Script

From the backend directory, run the setup script:

```bash
cd backend
setup-database.bat
```

**When prompted for password, enter:** `postgres`

This script will:
- Create the `osiedlel` database
- Run the schema to create the `items` table
- Insert sample data

### Step 4: Restart Backend Server

1. Stop the current backend server (Ctrl+C in the terminal running it)
2. Start it again:

```bash
cd backend
npm run dev
```

You should now see:
```
Server is running on http://localhost:3000
Database connected successfully at: [timestamp]
```

### Step 5: Test Database Connection

Open your browser and test these endpoints:

1. **Database Test:**
   ```
   http://localhost:3000/api/db/test
   ```
   Should return database version and current time

2. **Get Items:**
   ```
   http://localhost:3000/api/items
   ```
   Should return the 3 sample items from the database

## Alternative: Manual Setup

If the script doesn't work, you can set up manually:

### 1. Open PostgreSQL Command Line

```bash
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
```

Enter password: `postgres`

### 2. Create Database

```sql
CREATE DATABASE osiedlel;
\q
```

### 3. Run Schema

```bash
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d osiedlel -f backend/database/schema.sql
```

## Troubleshooting

### Installation Stuck
- The installer might be waiting for user input in a GUI window
- Check your taskbar for a PostgreSQL installer window

### "psql is not recognized"
- PostgreSQL might not be in your PATH
- Use the full path: `"C:\Program Files\PostgreSQL\17\bin\psql.exe"`

### Connection Refused
- Make sure PostgreSQL service is running
- Check: `sc query postgresql-x64-17`
- Start: `net start postgresql-x64-17`

### Authentication Failed
- Verify password in `backend/.env` matches what you set during installation
- Default is: `postgres`

### Database Already Exists
- This is fine! Just run the schema:
  ```bash
  "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d osiedlel -f backend/database/schema.sql
  ```

## What's Next?

Once PostgreSQL is set up and the backend connects successfully:

1. ✅ Your frontend (http://localhost:5173) will be able to fetch data from the database
2. ✅ You can use all database endpoints
3. ✅ You can add more tables and features

## Quick Reference

**PostgreSQL Info:**
- Version: 17
- User: postgres
- Password: postgres
- Host: localhost
- Port: 5432
- Database: osiedlel

**Useful Commands:**
```bash
# Connect to database
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d osiedlel

# List databases
\l

# List tables
\dt

# View table data
SELECT * FROM items;

# Exit
\q
```

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify PostgreSQL service is running
3. Confirm password matches in .env file
4. Check backend/DATABASE_SETUP.md for more details
