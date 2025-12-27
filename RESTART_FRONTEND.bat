@echo off
cls
echo.
echo ========================================
echo   Restarting GearGuard Frontend
echo ========================================
echo.
echo This will restart the frontend server
echo to load the new .env.local file
echo.
echo ========================================
echo.
echo Starting Frontend Server...
echo.

cd frontend
start "GearGuard Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Frontend Server Started!
echo ========================================
echo.
echo The frontend is now running with Google OAuth configured.
echo.
echo Open your browser to: http://localhost:3000/login
echo.
echo Press any key to close this window...
pause >nul

