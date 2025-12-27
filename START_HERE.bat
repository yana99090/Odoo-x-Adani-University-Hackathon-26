@echo off
cls
echo.
echo ========================================
echo   GearGuard Standalone Setup
echo ========================================
echo.
echo This will start GearGuard in standalone mode
echo (No Odoo required!)
echo.
echo ========================================
echo.
echo Step 1: Starting Backend Server...
echo.

start "GearGuard Backend" cmd /k "cd backend && python init_data.py && python main.py"

timeout /t 5 /nobreak >nul

echo.
echo Step 2: Starting Frontend Server...
echo.

start "GearGuard Frontend" cmd /k "cd frontend && npm install && npm run dev"

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
echo Opening browser in 5 seconds...
echo.

timeout /t 5 /nobreak >nul

start http://localhost:3000

echo.
echo ========================================
echo   GearGuard is Running!
echo ========================================
echo.
echo Two terminal windows have opened:
echo   1. Backend (Python FastAPI)
echo   2. Frontend (Next.js)
echo.
echo Keep both windows open while using GearGuard
echo Close them when you're done
echo.
echo Press any key to exit this window...
pause >nul

