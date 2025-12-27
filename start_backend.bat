@echo off
echo.
echo ========================================
echo   GearGuard Backend Server
echo ========================================
echo.

cd backend

echo Checking if database exists...
if not exist gearguard.db (
    echo Database not found. Initializing...
    python init_data.py
    echo.
)

echo Starting FastAPI server...
echo.
echo Backend will run at: http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py

pause

