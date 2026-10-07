@echo off
echo ========================================================
echo   Sync ABA PayWay Receipts to MongoDB Atlas
echo ========================================================
python "%~dp0scripts\sync_aba_receipts_to_mongodb.py"
echo.
pause
