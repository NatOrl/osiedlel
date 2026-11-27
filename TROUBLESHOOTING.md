# Troubleshooting: Changes Not Appearing on Website

## Quick Fixes (Try these in order)

### 1. Hard Refresh the Browser
The most common issue is browser caching. Try these keyboard shortcuts:

- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

This forces the browser to reload all files without using the cache.

### 2. Clear Browser Cache Completely
If hard refresh doesn't work:

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Choose "All time"
4. Click "Clear data"

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"

### 3. Restart the Frontend Development Server

**Option A: Using the batch file**
1. Stop the current server (press `Ctrl + C` in the terminal)
2. Run `start-frontend.bat` again

**Option B: Manual restart**
```bash
cd frontend
npm run dev
```

### 4. Check You're on the Correct Port
Make sure you're viewing: **http://localhost:5173**

Not:
- ~~http://localhost:3000~~ (this is the backend)
- ~~http://127.0.0.1:5173~~ (use localhost instead)

### 5. Verify Dev Server is Running
Look for this message in your terminal:
```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 6. Check for Console Errors
1. Open browser DevTools: `F12` or `Ctrl + Shift + I`
2. Go to the "Console" tab
3. Look for any red error messages
4. Check the "Network" tab to see if files are loading

### 7. Force Vite to Reload
If changes still don't appear:

1. Stop the dev server (`Ctrl + C`)
2. Delete the Vite cache:
   ```bash
   cd frontend
   rmdir /s /q node_modules\.vite
   ```
3. Restart the server:
   ```bash
   npm run dev
   ```

### 8. Try Incognito/Private Mode
Open your browser in incognito/private mode and navigate to `http://localhost:5173`

This ensures no extensions or cached data interfere.

### 9. Check File Saving
- Make sure you've **saved the file** (`Ctrl + S`)
- Check if VS Code shows a dot next to the filename (unsaved changes)
- Look for "Auto Save" in VS Code: File → Auto Save

### 10. Verify Correct File Location
Make sure you're editing files in:
- `c:\Users\NataliaOrl\OsiedleL\frontend\src\`

Not in any backup or duplicate folders.

## Advanced Troubleshooting

### Check Vite HMR (Hot Module Replacement)
If HMR is broken, you'll need to manually refresh. Check the browser console for:
```
[vite] connected.
[vite] hot updated: /src/pages/Home.css
```

### Restart Both Servers
Sometimes the issue is with the backend connection:
1. Stop both frontend and backend servers
2. Start backend first: `start-backend.bat`
3. Then start frontend: `start-frontend.bat`

### Check for Port Conflicts
If port 5173 is already in use:
```bash
netstat -ano | findstr :5173
```

If something is using it, kill that process or change the port in `vite.config.js`.

### Nuclear Option: Full Reinstall
If nothing works:
```bash
cd frontend
rmdir /s /q node_modules
rmdir /s /q .vite
del package-lock.json
npm install
npm run dev
```

## Prevention Tips

1. **Enable Auto Save** in VS Code: File → Auto Save
2. **Keep DevTools open** to see live updates and errors
3. **Use one browser tab** for development to avoid confusion
4. **Check the terminal** for Vite error messages

## Still Not Working?

If you've tried all the above:
1. Check what changes you made - are they in the correct file?
2. Look for syntax errors in your CSS/JSX
3. Verify the file is imported correctly
4. Check if there are any console errors in the browser
5. Make sure you're not viewing a production build
