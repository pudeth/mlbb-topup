@echo off
echo ========================================
echo Starting MLBB Top-Up Application
echo ========================================
echo.

REM Start Backend API
echo [1/2] Starting Backend API (with ABA PayWay Gateway)...
if exist "%~dp0dotnet\dotnet.exe" (
    set "PATH=%~dp0dotnet;%PATH%"
    set "DOTNET_ROOT=%~dp0dotnet"
    start "MLBB Backend API (ABA PayWay)" cmd /k "cd /d %~dp0backend\MLBBTopUp.API && ""%~dp0dotnet\dotnet.exe"" bin\Debug\net8.0\MLBBTopUp.API.dll"
) else (
    start "MLBB Backend API (ABA PayWay)" cmd /k "cd /d %~dp0backend\MLBBTopUp.API && dotnet run"
)
ping 127.0.0.1 -n 4 >nul 2>&1

REM Start Frontend
echo [2/2] Starting Frontend...
start "MLBB Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Backend API (ABA PayWay): http://localhost:5000
echo Frontend Storefront:      http://localhost:3001
echo.
echo Press any key to exit this window...
echo Note: Service windows will remain open.
echo ========================================
pause >nul
