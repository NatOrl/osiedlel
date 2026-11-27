@echo off
echo ========================================
echo Starting OsiedleL Frontend Server
echo ========================================
echo.

cd frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed.
)

echo.
echo Starting development server on http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

call npm run dev
