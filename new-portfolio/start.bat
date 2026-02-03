@echo off
REM Omar Abdelzaher Portfolio - Quick Start Guide (Windows)
REM This batch file helps you get the new portfolio running

echo.
echo 🚀 Omar's New Portfolio - Quick Start
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed. Please install Python 3.x
    pause
    exit /b 1
)

echo ✅ Python found!
echo.
echo Starting development server...
echo Visit: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python -m http.server 8000 --bind 127.0.0.1
pause
