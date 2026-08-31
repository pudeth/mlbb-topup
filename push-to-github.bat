@echo off
setlocal
echo ========================================================
echo   MLBB Top-Up - Push Code to GitHub Repository
echo ========================================================
echo.

REM Check if git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH. Please install Git first.
    pause
    exit /b 1
)

REM Initialize git if not already initialized
if not exist "%~dp0.git" (
    echo [1/4] Initializing Git repository...
    git init
    git branch -M main
) else (
    echo [1/4] Git repository already initialized.
)

REM Stage and commit files
echo.
echo [2/4] Staging files...
git add .
git commit -m "Deploy: Full production configurations for Vercel and Render"

echo.
echo ========================================================
echo [3/4] GitHub Repository Connection
echo ========================================================
echo.
echo Please create a new EMPTY repository on https://github.com/new
echo (Do not check "Add README" or "Add .gitignore")
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/my-repo.git): "

if "%REPO_URL%"=="" (
    echo No URL entered. Aborted.
    pause
    exit /b 1
)

REM Set remote origin
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo.
echo [4/4] Pushing to GitHub (main branch)...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Your project has been pushed to GitHub!
    echo ========================================================
    echo Now follow FREE-HOSTING-GUIDE.md to deploy on Vercel and Render.
) else (
    echo.
    echo [NOTICE] If push failed due to authentication, please log into GitHub CLI or enter your Personal Access Token.
)

echo.
pause
