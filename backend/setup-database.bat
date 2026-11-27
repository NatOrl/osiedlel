@echo off
echo ========================================
echo PostgreSQL Database Setup for OsiedleL
echo ========================================
echo.

echo Step 1: Creating database 'osiedlel'...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE osiedlel;"
if %errorlevel% neq 0 (
    echo Database might already exist or there was an error.
    echo Continuing anyway...
)
echo.

echo Step 2: Running database schema...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d osiedlel -f database\schema.sql
if %errorlevel% neq 0 (
    echo Error running schema. Please check the error above.
    pause
    exit /b 1
)
echo.

echo ========================================
echo Database setup completed successfully!
echo ========================================
echo.
echo You can now restart your backend server.
echo The database connection should work now.
echo.
pause
