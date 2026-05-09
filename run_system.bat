@echo off
echo ==========================================
echo   Smart Management System - Startup
echo ==========================================

:: 1. Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is NOT running.
    echo Please open Docker Desktop and wait for it to start.
    echo After Docker is running, press any key to continue...
    pause >nul
)

:: 2. Build and Run with Docker Compose
echo [INFO] Starting containers...
docker-compose up --build -d

echo.
echo ==========================================
echo   SYSTEM STARTED SUCCESSFULLY
echo ==========================================
echo Frontend: http://localhost
echo Backend API: http://localhost:8080/api
echo.
echo To see logs, run: docker-compose logs -f
pause
