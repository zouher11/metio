@echo off
REM Weather App Startup Script for Windows

echo.
echo ===================================
echo   Weather App - Startup
echo ===================================
echo.

REM Check if backend .env file exists
if not exist "backend\.env" (
    echo [ERROR] backend\.env file not found!
    echo Please create the .env file with your OpenWeatherMap API key.
    echo.
    echo Visit: https://openweathermap.org/api
    echo.
    echo Copy backend\.env.example to backend\.env and add your API key.
    pause
    exit /b 1
)

echo [INFO] Starting Weather App...
echo.

REM Open two new terminals for backend and frontend
echo [INFO] Starting Backend on port 5000...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak

echo [INFO] Starting Frontend on port 3000...
start cmd /k "cd frontend && npm start"

echo.
echo ===================================
echo   Application started!
echo ===================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo.
echo Close these windows to stop the application.
echo.

pause
