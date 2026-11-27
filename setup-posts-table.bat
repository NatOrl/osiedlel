@echo off
echo ========================================
echo Setting up Posts Table for Announcements
echo ========================================
echo.

echo This script will add the posts table to your database.
echo Make sure PostgreSQL is running!
echo.

set /p DB_NAME="Enter database name (default: osiedlel): "
if "%DB_NAME%"=="" set DB_NAME=osiedlel

set /p DB_USER="Enter database user (default: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

echo.
echo Running migration script...
echo Database: %DB_NAME%
echo User: %DB_USER%
echo.

psql -U %DB_USER% -d %DB_NAME% -f backend\database\add-posts-table.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Posts table created.
    echo ========================================
    echo.
    echo You can now start the backend and frontend servers.
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to create posts table
    echo ========================================
    echo.
    echo Possible issues:
    echo 1. PostgreSQL is not running
    echo 2. Database '%DB_NAME%' does not exist
    echo 3. User '%DB_USER%' does not have permission
    echo.
    echo Please check the error message above.
)

echo.
pause
