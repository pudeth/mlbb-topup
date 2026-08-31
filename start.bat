@echo off
echo ========================================
echo Starting MLBB Top-Up Application
echo ========================================
echo.

REM Start Backend API
echo [1/3] Starting Backend API...
start "MLBB Backend API" cmd /k "cd /d %~dp0backend\MLBBTopUp.API && dotnet run"
ping 127.0.0.1 -n 4 >nul 2>&1

REM Start KHQR Bakong API
echo [2/3] Starting KHQR Bakong API...
start "KHQR Bakong API" cmd /k "cd /d %~dp0Scorekhqr-bakong && venv\Scripts\activate && python api.py"
ping 127.0.0.1 -n 4 >nul 2>&1

REM Start Frontend
echo [3/3] Starting Frontend...
start "MLBB Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Backend API:      http://localhost:5000
echo KHQR API:         http://localhost:5001
echo Frontend:         http://localhost:3001
echo.
echo Press any key to exit this window...
echo Note: Service windows will remain open.
echo ========================================
pause >nul
