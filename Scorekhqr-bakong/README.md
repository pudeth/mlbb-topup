# Bakong KHQR Payment System

A complete payment system using Bakong KHQR API for processing payments in Cambodia.

## Features

- 🔐 Bakong KHQR payment integration
- 💳 QR code generation
- 💰 Support for USD and KHR currencies
- 📊 MySQL database integration
- 📱 Telegram notifications
- 🌐 Web interface
- 🔄 Real-time payment status checking

## Prerequisites

Before running this project, make sure you have:

1. **Python 3.8 or higher** installed
   - Download from: https://www.python.org/downloads/
   - ⚠️ **Important**: Check "Add Python to PATH" during installation

2. **MySQL Database** running
   - Create a database named `khqr_payment`
   - Update credentials in `.env` file

3. **Bakong Account** with API access
   - Get your token from Bakong dashboard
   - Update `BAKONG_TOKEN` in `.env` file

4. **Telegram Bot** (optional, for notifications)
   - Create a bot via @BotFather
   - Update `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env` file

## Quick Start

### Step 1: Setup

Run the setup script to create virtual environment and install dependencies:

```bash
setup.bat
```

This will:
- Create a Python virtual environment
- Install all required packages
- Prepare the project for running

### Step 2: Configure

Make sure your `.env` file has the correct settings:

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=khqr_payment
DB_USERNAME=root
DB_PASSWORD=

# Bakong API
BAKONG_TOKEN=your_token_here

# Merchant Info
MERCHANT_BAKONG_ID=your_bakong_id
MERCHANT_NAME="Your Store Name"
MERCHANT_CITY="PHNOM PENH"
```

### Step 3: Run

Start both servers with one command:

```bash
start_all.bat
```

This will start:
- API Server on `http://localhost:5000`
- Web Server on `http://localhost:8080`
- Browser will open automatically

## Manual Running

If you prefer to run servers individually:

### API Server Only
```bash
venv\Scripts\activate
python api.py
```

### Web Server Only
```bash
venv\Scripts\activate
python serve_web.py
```

### Combined App (API + Web + CLI)
```bash
venv\Scripts\activate
python app.py
```

## API Endpoints

### Create Payment
```http
POST /api/payment/create
Content-Type: application/json

{
  "amount": 10.00,
  "currency": "USD",
  "phone": "85512345678",
  "bill_number": "TRX123"
}
```

### Check Payment Status
```http
GET /api/payment/status/{md5_hash}
```

### Get Payment Info
```http
GET /api/payment/info/{md5_hash}
```

### List Payments
```http
GET /api/payments?status=UNPAID&limit=20
```

### Get QR Code Image
```http
GET /api/payment/qr/{md5_hash}
```

## Project Structure

```
E-Lerning/
├── api.py              # Flask API server
├── app.py              # Combined app with CLI
├── serve_web.py        # Web server
├── index.html          # Web interface
├── .env                # Configuration
├── requirements.txt    # Python dependencies
├── setup.bat          # Setup script
├── start_all.bat      # Start all servers
├── bakong_khqr/       # KHQR SDK
│   ├── khqr.py
│   └── sdk/
└── build/             # Build artifacts
```

## Troubleshooting

### Python not found
- Install Python from https://www.python.org/downloads/
- Make sure "Add Python to PATH" is checked during installation
- Restart your terminal/command prompt

### Database connection failed
- Make sure MySQL is running
- Check database credentials in `.env`
- Create the database: `CREATE DATABASE khqr_payment;`

### Port already in use
- Close other applications using ports 5000 or 8080
- Or change ports in the Python files

### Module not found errors
- Run `setup.bat` again
- Or manually: `pip install -r requirements.txt`

### CORS errors
- Make sure both API and Web servers are running
- Check that ports match in configuration

## Dependencies

- Flask - Web framework
- Flask-CORS - CORS handling
- python-dotenv - Environment variables
- mysql-connector-python - MySQL database
- requests - HTTP requests
- Pillow - Image processing
- qrcode - QR code generation

## License

This project is for educational purposes.

## Support

For issues or questions, please contact the development team.
