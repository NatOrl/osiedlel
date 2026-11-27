@echo off
echo ========================================
echo Multiple Images Migration Setup
echo ========================================
echo.
echo This script will add support for multiple images to announcements
echo.

cd backend
node setup-multiple-images.js

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo.
pause
