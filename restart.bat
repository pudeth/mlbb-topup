@echo off
echo ========================================
echo Restarting MLBB Top-Up Application
echo ========================================
echo.

echo Stopping existing services...
call "%~dp0stop.bat"

echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Starting services again...
call "%~dp0start.bat"
