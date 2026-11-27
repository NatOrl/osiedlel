# Quick Start Guide - Announcements Module

Follow these simple steps to get the Announcements feature working:

## Step 1: Set Up the Database

1. **Make sure PostgreSQL is running** (check your system tray or services)

2. **Double-click** `setup-posts-table.bat` in the project root folder
   - When prompted, press Enter to use default database name (osiedlel)
   - When prompted, press Enter to use default user (postgres)
   - Enter your PostgreSQL password when asked
   - You should see "SUCCESS! Posts table created."

## Step 2: Start the Backend Server

1. **Double-click** `start-backend.bat` in the project root folder
2. Wait for the message: "Server is running on http://localhost:3000"
3. You should also see: "Database connected successfully"
4. **Keep this window open** - don't close it!

## Step 3: Start the Frontend Server

1. **Double-click** `start-frontend.bat` in the project root folder
2. Wait for the message showing the local URL (usually http://localhost:5173)
3. **Keep this window open** - don't close it!

## Step 4: View the Announcements

1. **Open your web browser**
2. Go to: `http://localhost:5173`
3. Click on **"Ogłoszenia"** (Announcements) in the navigation menu
4. You should see 3 sample announcements!

## Troubleshooting

### "Failed to fetch posts" error

**Check if backend is running:**
- Look for the terminal window from `start-backend.bat`
- It should say "Server is running on http://localhost:3000"
- If not, run `start-backend.bat` again

**Check if database has posts table:**
- Run `setup-posts-table.bat` if you haven't already
- Make sure you see "SUCCESS! Posts table created."

### Backend won't start

**Error: "Database connection error"**
- Make sure PostgreSQL is running
- Check your `backend/.env` file has correct database credentials
- Default values:
  ```
  DB_USER=postgres
  DB_HOST=localhost
  DB_NAME=osiedlel
  DB_PASSWORD=your_password_here
  DB_PORT=5432
  ```

**Error: "Port 3000 is already in use"**
- Another application is using port 3000
- Close any other backend servers
- Or change the port in `backend/.env`: `PORT=3001`

### Frontend won't start

**Error: "Port 5173 is already in use"**
- Close any other Vite dev servers
- Or the script will suggest an alternative port

### Database doesn't exist

If you get "database osiedlel does not exist":

1. Open Command Prompt or PowerShell
2. Run: `psql -U postgres`
3. Enter your password
4. Run: `CREATE DATABASE osiedlel;`
5. Exit: `\q`
6. Now run `setup-posts-table.bat` again

## What You Should See

When everything is working:

1. **Backend terminal** shows:
   ```
   Database connected successfully at: [timestamp]
   Server is running on http://localhost:3000
   ```

2. **Frontend terminal** shows:
   ```
   VITE v[version] ready in [time] ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Browser** shows:
   - Loading spinner (briefly)
   - Three announcements with Polish text
   - Each announcement has a category badge, date, title, summary, and content

## Testing the API

You can test if the backend is working by opening these URLs in your browser:

- http://localhost:3000/api/health - Should show: `{"status":"OK","timestamp":"..."}`
- http://localhost:3000/api/posts - Should show JSON with 3 announcements

## Need More Help?

See `ANNOUNCEMENTS_SETUP.md` for detailed troubleshooting and API documentation.
