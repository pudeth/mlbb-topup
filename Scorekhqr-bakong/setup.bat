@echo off
echo ========================================
echo Bakong KHQR Payment System - Setup
echo ========================================
echo.

REM Try to find Python
set PYTHON_CMD=
for %%P in (python py python3) do (
    %%P --version >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set PYTHON_CMD=%%P
        goto :found_python
    )
)

:found_python
if "%PYTHON_CMD%"=="" (
    echo [ERROR] Python is not installed or not working properly!
    echo.
    echo The Windows Store Python stub was detected but Python is not installed.
    echo.
    echo Please follow these steps:
    echo 1. Go to Settings ^> Apps ^> App execution aliases
    echo 2. Turn OFF python.exe and python3.exe
    echo 3. Download and install Python from: https://www.python.org/downloads/
    echo 4. During installation, check "Add Python to PATH"
    echo 5. Run this setup again
    echo.
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('%PYTHON_CMD% --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [OK] Python %PYTHON_VERSION% found (using %PYTHON_CMD%)
echo.

REM Create virtual environment
echo Creating virtual environment...
if exist "venv" (
    echo Removing old virtual environment...
    rmdir /s /q venv
)
%PYTHON_CMD% -m venv venv
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create virtual environment!
    pause
    exit /b 1
)
echo [OK] Virtual environment created
echo.

REM Activate and install dependencies
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Installing dependencies...
echo This may take a few minutes...
echo.
%PYTHON_CMD% -m pip install --upgrade pip
pip install -r requirements.txt
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo Setup Complete!
    echo ========================================
    echo.
    echo You can now run: start_all.bat
    echo.
) else (
    echo ========================================
    echo Setup encountered some errors
    echo ========================================
    echo.
    echo Please check the error messages above
    echo.
)

pause
