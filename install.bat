@echo off
echo ========================================
echo Installing MLBB Top-Up Dependencies
echo ========================================
echo.

REM Install Backend dependencies
echo [1/3] Installing Backend dependencies...
cd /d %~dp0backend\MLBBTopUp.API
dotnet restore
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

REM Install KHQR API dependencies
echo [2/3] Setting up KHQR Bakong API...
cd /d %~dp0Scorekhqr-bakong
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: KHQR API installation failed!
    pause
    exit /b 1
)
echo KHQR API dependencies installed successfully!
echo.

REM Install Frontend dependencies
echo [3/3] Installing Frontend dependencies...
cd /d %~dp0frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo You can now run: start.bat
echo.
pause
