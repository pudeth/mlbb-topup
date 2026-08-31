@echo off
setlocal
echo ========================================================
echo   MLBB Top-Up - Instant Free Public Online Link
echo ========================================================
echo.
echo Checking for Cloudflare Tunnel (cloudflared)...

REM Check if cloudflared exists in tools directory or PATH
set "CF_EXE=%~dp0scripts\cloudflared.exe"
if not exist "%CF_EXE%" (
    where cloudflared >nul 2>&1
    if %errorlevel% equ 0 (
        set "CF_EXE=cloudflared"
    ) else (
        echo Cloudflare tunnel helper not found. Downloading lightweight runner...
        if not exist "%~dp0scripts" mkdir "%~dp0scripts"
        curl.exe -L "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -o "%CF_EXE%" 2>nul
        if not exist "%CF_EXE%" (
            powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe', '%CF_EXE%')"
        )
        if not exist "%CF_EXE%" (
            echo Failed to download tunnel. Please check your internet connection.
            pause
            exit /b 1
        )
        echo Downloaded successfully!
    )
)

echo.
echo ========================================================
echo Starting Cloudflare Free Public Tunnel...
echo Your site (port 3001) will be given a free public HTTPS link!
echo Make sure your app is running (start.bat) first!
echo ========================================================
echo.

"%CF_EXE%" tunnel --url http://localhost:3001

pause
