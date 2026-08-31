@echo off
echo ========================================
echo MLBB Top-Up Application Status
echo ========================================
echo.

echo Checking running processes...
echo.

echo [Frontend] Node.js processes:
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo   Status: RUNNING
    tasklist /FI "IMAGENAME eq node.exe" /NH
) else (
    echo   Status: STOPPED
)
echo.

echo [Backend] .NET processes:
tasklist /FI "IMAGENAME eq dotnet.exe" 2>nul | find "dotnet.exe" >nul
if %errorlevel% equ 0 (
    echo   Status: RUNNING
    tasklist /FI "IMAGENAME eq dotnet.exe" /NH
) else (
    echo   Status: STOPPED
)
echo.

echo [KHQR API] Python processes:
tasklist /FI "IMAGENAME eq python.exe" 2>nul | find "python.exe" >nul
if %errorlevel% equ 0 (
    echo   Status: RUNNING
    tasklist /FI "IMAGENAME eq python.exe" /NH
) else (
    echo   Status: STOPPED
)
echo.

echo ========================================
echo Service URLs:
echo ========================================
echo Backend API:      http://localhost:5000
echo KHQR API:         http://localhost:5001
echo Frontend:         http://localhost:3001
echo.
pause
