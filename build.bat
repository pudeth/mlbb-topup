@echo off
echo ========================================
echo Building MLBB Top-Up Application
echo ========================================
echo.

REM Build Backend
echo [1/2] Building Backend...
cd /d %~dp0backend\MLBBTopUp.API
dotnet build
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)
echo Backend built successfully!
echo.

REM Build Frontend
echo [2/2] Building Frontend for production...
cd /d %~dp0frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend built successfully!
echo.

echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Production build is ready in:
echo - frontend/build
echo.
pause
