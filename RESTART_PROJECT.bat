@echo off
cls
echo.
echo ========================================
echo   GearGuard - Full Project Restart
echo ========================================
echo.
echo This will restart both backend and frontend servers
echo.
echo ========================================
echo.

REM Kill any existing processes on ports 8000 and 3000
echo Stopping any existing servers...
echo.

REM Kill processes on port 8000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    echo Stopping backend on port 8000...
    taskkill /F /PID %%a >nul 2>&1
)

REM Kill processes on port 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Stopping frontend on port 3000...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   Starting Backend Server...
echo ========================================
echo.

start "GearGuard Backend" cmd /k "cd backend && python main.py"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Starting Frontend Server...
echo ========================================
echo.

start "GearGuard Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   GearGuard Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Two new windows have opened:
echo   1. GearGuard Backend  (Python/FastAPI)
echo   2. GearGuard Frontend (Next.js)
echo.
echo ========================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul

start http://localhost:3000/login

echo.
echo Press any key to close this window...
pause >nul

