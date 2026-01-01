# Weather App Startup Script for PowerShell
# Usage: .\start.ps1

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  Weather App - Startup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend .env file exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "[ERROR] backend\.env file not found!" -ForegroundColor Red
    Write-Host "Please create the .env file with your OpenWeatherMap API key." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Visit: https://openweathermap.org/api" -ForegroundColor Green
    Write-Host ""
    Write-Host "Copy backend\.env.example to backend\.env and add your API key." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] Starting Weather App..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "[INFO] Starting Backend on port 5000..." -ForegroundColor Green
$backendJob = Start-Process powershell -ArgumentList {
    cd "backend"
    npm run dev
} -NoNewWindow -PassThru

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[INFO] Starting Frontend on port 3000..." -ForegroundColor Green
$frontendJob = Start-Process powershell -ArgumentList {
    cd "frontend"
    npm start
} -NoNewWindow -PassThru

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  Application started!" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend:   http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Waiting for processes... Press Ctrl+C to stop." -ForegroundColor Green
Write-Host ""

# Wait for processes to complete
$backendJob | Wait-Process
$frontendJob | Wait-Process
