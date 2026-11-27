@echo off
echo ========================================
echo Starting OsiedleL Backend Server
echo ========================================
echo.

cd backend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed.
)

echo.
echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm start
