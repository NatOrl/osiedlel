@echo off
echo ========================================
echo Setting up Image Support for Posts
echo ========================================
echo.

cd backend
node setup-images.js

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Image support has been added to the posts table.
echo You can now upload images with announcements.
echo.
pause
