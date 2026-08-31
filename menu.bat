@echo off
:menu
cls
echo ========================================
echo   MLBB TOP-UP APPLICATION
echo   Command Menu
echo ========================================
echo.
echo   [1] Start Project
echo   [2] Stop Project
echo   [3] Restart Project
echo   [4] Check Status
echo   [5] Install Dependencies
echo   [6] Build Production
echo   [7] Open Frontend (Browser)
echo   [8] Share Online (Free Public Link)
echo   [9] View README
echo   [0] Exit
echo.
echo ========================================
echo.
set /p choice="Select option (0-9): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto status
if "%choice%"=="5" goto install
if "%choice%"=="6" goto build
if "%choice%"=="7" goto open
if "%choice%"=="8" goto share
if "%choice%"=="9" goto readme
if "%choice%"=="0" goto end
echo Invalid option! Press any key to try again...
pause >nul
goto menu

:start
cls
echo Starting project...
call "%~dp0start.bat"
goto menu

:stop
cls
echo Stopping project...
call "%~dp0stop.bat"
goto menu

:restart
cls
echo Restarting project...
call "%~dp0restart.bat"
goto menu

:status
cls
call "%~dp0status.bat"
goto menu

:install
cls
echo Installing dependencies...
call "%~dp0install.bat"
goto menu

:build
cls
echo Building production...
call "%~dp0build.bat"
goto menu

:open
cls
echo Opening frontend in browser...
start http://localhost:3001
echo.
echo Frontend opened in default browser!
echo If services are not running, select option [1] to start.
echo.
pause
goto menu

:share
cls
echo Starting free public online tunnel...
call "%~dp0share-online-free.bat"
goto menu

:readme
cls
type "%~dp0README-COMMANDS.md"
echo.
echo.
pause
goto menu

:end
cls
echo ========================================
echo Thank you for using MLBB Top-Up!
echo ========================================
echo.
timeout /t 2 /nobreak >nul
exit
