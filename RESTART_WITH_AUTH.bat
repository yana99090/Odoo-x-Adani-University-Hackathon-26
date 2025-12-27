@echo off
cls
echo.
echo ========================================
echo   GearGuard - Restart with Authentication
echo ========================================
echo.
echo This will:
echo 1. Stop any running servers
echo 2. Reset the database (new User model)
echo 3. Start backend and frontend
echo.
echo ========================================
echo.

echo Step 1: Stopping any running servers...
echo (Close any open PowerShell windows manually)
timeout /t 3 /nobreak >nul

echo.
echo Step 2: Resetting database...
cd backend

if exist gearguard.db (
    echo Deleting old database...
    del /F gearguard.db 2>nul
    if exist gearguard.db (
        echo WARNING: Could not delete database file.
        echo Please close any running servers and try again.
        pause
        exit /b 1
    )
)

echo Initializing new database with authentication...
python init_data.py

if errorlevel 1 (
    echo ERROR: Failed to initialize database
    pause
    exit /b 1
)

cd ..

echo.
echo Step 3: Starting Backend Server...
start "GearGuard Backend" cmd /k "cd backend && python main.py"

timeout /t 5 /nobreak >nul

echo.
echo Step 4: Starting Frontend Server...
start "GearGuard Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   GearGuard is Starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Login credentials:
echo   Email: admin@gearguard.com
echo   Password: admin123
echo.
echo Or create a new account at:
echo   http://localhost:3000/signup
echo.
echo Opening browser in 5 seconds...
echo.

timeout /t 5 /nobreak >nul

start http://localhost:3000/login

echo.
echo ========================================
echo   GearGuard is Running!
echo ========================================
echo.
echo Two terminal windows have opened:
echo   1. Backend (Python FastAPI)
echo   2. Frontend (Next.js)
echo.
echo You will be redirected to the login page.
echo.
echo Keep both windows open while using GearGuard
echo Close them when you're done
echo.
echo Press any key to exit this window...
pause >nul

