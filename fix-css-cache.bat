@echo off
echo ========================================
echo Fixing CSS Cache Issue
echo ========================================
echo.

cd frontend

echo Step 1: Clearing Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo Vite cache cleared!
) else (
    echo No Vite cache found.
)

echo.
echo Step 2: Starting dev server...
echo.
echo IMPORTANT: After the server starts:
echo 1. Go to your browser
echo 2. Press Ctrl + Shift + R (hard refresh)
echo 3. The title should have a RED background
echo 4. If you see the red background, CSS is working!
echo.
echo Press Ctrl+C to stop the server when done testing
echo.

call npm run dev
