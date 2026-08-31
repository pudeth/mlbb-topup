# Installation Guide - Bakong KHQR Payment System

## 🚨 IMPORTANT: Python is Not Installed

Your system has Windows Store Python aliases but **Python is not actually installed**.

## Quick Fix Steps

### Step 1: Remove Windows Store Aliases

1. Press `Win + I` to open Settings
2. Go to **Apps** → **App execution aliases**
3. Find `python.exe` and `python3.exe`
4. **Turn both OFF**

### Step 2: Install Python

1. Go to https://www.python.org/downloads/
2. Download **Python 3.8 or newer** (recommended: Python 3.11 or 3.12)
3. Run the installer
4. ⚠️ **IMPORTANT**: Check the box **"Add Python to PATH"** at the bottom of the installer
5. Click "Install Now"
6. Wait for installation to complete
7. Click "Close"

### Step 3: Verify Installation

1. **Close ALL command prompts and PowerShell windows**
2. Open a **new** PowerShell window
3. Run the diagnostic:
   ```powershell
   cd "d:\BIU2 Y2_S2\Bong Store System\E-Lerning"
   powershell -ExecutionPolicy Bypass -File diagnose.ps1
   ```
4. You should see `[OK] python works: Python 3.x.x`

### Step 4: Setup the Project

Once Python is verified:

**Option A - PowerShell (Recommended):**
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

**Option B - Command Prompt:**
```cmd
setup.bat
```

### Step 5: Run the Application

After setup is complete:

```cmd
start_all.bat
```

This will:
- Start the API server on http://localhost:5000
- Start the Web server on http://localhost:8080
- Open your browser automatically

---

## Alternative: Manual Setup

If the automated setup doesn't work, follow these manual steps:

### 1. Create Virtual Environment
```cmd
python -m venv venv
```

### 2. Activate Virtual Environment
```cmd
venv\Scripts\activate
```

### 3. Install Dependencies
```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Database

1. Start MySQL
2. Create database:
   ```sql
   CREATE DATABASE khqr_payment;
   ```
3. Update `.env` file with your database credentials

### 5. Start API Server
```cmd
venv\Scripts\activate
python api.py
```

### 6. Start Web Server (in a new terminal)
```cmd
venv\Scripts\activate
python serve_web.py
```

### 7. Open Browser
Navigate to: http://localhost:8080

---

## Configuration

Edit the `.env` file with your settings:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=khqr_payment
DB_USERNAME=root
DB_PASSWORD=your_password

# Bakong API
BAKONG_TOKEN=your_bakong_token_here

# Merchant Information
MERCHANT_BAKONG_ID=your_bakong_id
MERCHANT_NAME="Your Store Name"
MERCHANT_CITY="PHNOM PENH"

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

---

## Troubleshooting

### Python command not found
- Make sure Python is installed with "Add to PATH" checked
- Restart your terminal/PowerShell after installation
- Try running `python --version` to verify

### Virtual environment creation fails
- Make sure you're using the correct Python command
- Try: `py -m venv venv` or `python3 -m venv venv`

### Module not found errors
- Activate virtual environment first: `venv\Scripts\activate`
- Install requirements: `pip install -r requirements.txt`

### Database connection errors
- Verify MySQL is running
- Check database credentials in `.env`
- Create the database if it doesn't exist

### Port already in use
- Close other applications using port 5000 or 8080
- Or change the ports in `api.py` and `serve_web.py`

### CORS errors in browser
- Make sure both API and Web servers are running
- Clear browser cache
- Try a different browser

---

## System Requirements

- **Python**: 3.8 or higher
- **MySQL**: 5.7 or higher
- **RAM**: Minimum 2GB
- **OS**: Windows 10/11

---

## Dependencies

All dependencies are listed in `requirements.txt`:

- flask >= 2.3.0
- flask-cors >= 4.0.0
- python-dotenv >= 1.0.0
- mysql-connector-python >= 8.0.0
- requests >= 2.31.0
- pillow >= 10.0.0
- qrcode >= 7.4.0

---

## Need Help?

1. Run the diagnostic: `powershell -ExecutionPolicy Bypass -File diagnose.ps1`
2. Check the error messages
3. Follow the recommendations
4. Contact support if issues persist

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `diagnose.ps1` | Check Python installation |
| `setup.ps1` or `setup.bat` | Setup the project |
| `start_all.bat` | Start all servers |
| `venv\Scripts\activate` | Activate virtual environment |
| `python api.py` | Start API server only |
| `python serve_web.py` | Start Web server only |
| `python app.py` | Start combined app with CLI |

---

## Support

For technical support, check:
- README.md for general documentation
- Error messages in terminal
- MySQL error logs
- Flask debug output
