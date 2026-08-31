@echo off
echo ========================================
echo Installing Missing Dependencies
echo ========================================
echo.

if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo Warning: Virtual environment not found
    echo Run setup.bat first!
    echo.
    pause
    exit /b 1
)

echo.
echo Installing QR code dependencies...
echo.

pip install --upgrade pillow qrcode[pil]

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo You can now restart your API server:
echo   python api.py
echo.
pause
