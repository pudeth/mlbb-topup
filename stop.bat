@echo off
echo ========================================
echo Stopping MLBB Top-Up Application
echo ========================================
echo.

echo Stopping all Node.js processes (Frontend)...
taskkill /F /IM node.exe >nul 2>&1

echo Stopping all dotnet processes (Backend)...
taskkill /F /IM dotnet.exe >nul 2>&1

echo Stopping all Python processes (KHQR API)...
taskkill /F /IM python.exe >nul 2>&1

echo.
echo ========================================
echo All services stopped!
echo ========================================
echo.
pause
