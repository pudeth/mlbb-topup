@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Bakong KHQR Payment System
echo ========================================
echo.

REM Check for Python
echo Checking for Python installation...
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo.
    echo Please install Python from:
    echo https://www.python.org/downloads/
    echo.
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

REM Get Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [OK] Python %PYTHON_VERSION% found
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to activate virtual environment!
    pause
    exit /b 1
)
echo [OK] Virtual environment activated
echo.

REM Install/upgrade dependencies
echo Checking dependencies...
pip install -q -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Some dependencies may not have installed correctly
)
echo [OK] Dependencies ready
echo.

REM Check for .env file
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Please create .env file with your configuration
    echo.
    pause
)

echo ========================================
echo Starting Servers
echo ========================================
echo.

REM Start API server in new window
echo Starting API Server (port 5000)...
start "Bakong API Server" cmd /k "venv\Scripts\activate && python api.py"
echo [OK] API Server starting...
echo.

REM Wait for API to start
timeout /t 3 /nobreak >nul

REM Start Web server in new window
echo Starting Web Server (port 8080)...
start "Bakong Web Server" cmd /k "venv\Scripts\activate && python serve_web.py"
echo [OK] Web Server starting...
echo.

timeout /t 2 /nobreak >nul

echo ========================================
echo All Servers Started Successfully!
echo ========================================
echo.
echo  API Server:  http://localhost:5000
echo  Web Server:  http://localhost:8080
echo.
echo Browser will open automatically...
echo.
echo To stop: Close both command windows
echo or press Ctrl+C in each window
echo ========================================
echo.

REM Open browser
timeout /t 2 /nobreak >nul
start http://localhost:8080

echo Press any key to exit this window...
pause >nul
