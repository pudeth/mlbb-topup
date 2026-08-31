# MLBB Top-Up Application - Quick Commands

## 🚀 Quick Start Commands

### **START THE PROJECT**
```batch
start.bat
```
Starts all services:
- Backend API (http://localhost:5000)
- KHQR Bakong API (http://localhost:5000)
- Frontend (http://localhost:3001)

Opens 3 separate terminal windows for each service.

---

### **STOP THE PROJECT**
```batch
stop.bat
```
Stops all running services:
- Kills all Node.js processes (Frontend)
- Kills all dotnet processes (Backend)
- Kills all Python processes (KHQR API)

---

### **RESTART THE PROJECT**
```batch
restart.bat
```
Stops all services, waits 3 seconds, then starts them again.

---

### **CHECK STATUS**
```batch
status.bat
```
Shows which services are currently running and displays the service URLs.

---

## 🔧 Setup Commands

### **INSTALL DEPENDENCIES**
```batch
install.bat
```
First-time setup - installs all dependencies:
- Backend: `dotnet restore`
- KHQR API: Python virtual environment + packages
- Frontend: `npm install`

---

### **BUILD FOR PRODUCTION**
```batch
build.bat
```
Creates production builds:
- Backend: `dotnet build`
- Frontend: `npm run build` (optimized static files)

---

## 📋 Manual Commands

### **Backend API (ASP.NET Core)**
```bash
cd backend/MLBBTopUp.API
dotnet restore          # Install dependencies
dotnet build           # Build project
dotnet run             # Run development server
```

### **KHQR Bakong API (Python Flask)**
```bash
cd Scorekhqr-bakong
python -m venv venv                    # Create virtual environment
venv\Scripts\activate                  # Activate virtual environment
pip install -r requirements.txt        # Install dependencies
python api.py                          # Run API server
```

### **Frontend (React)**
```bash
cd frontend
npm install            # Install dependencies
npm start              # Run development server
npm run build          # Build for production
```

---

## 🌐 Service URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **KHQR API**: http://localhost:5000
- **Backend Swagger**: http://localhost:5000/swagger

---

## 📝 Notes

1. **First Time Setup**: Run `install.bat` before using `start.bat`
2. **Port Conflicts**: Make sure ports 3001 and 5000 are available
3. **Windows Defender**: May need to allow Node.js, Python, and dotnet through firewall
4. **Stop Services**: Always use `stop.bat` to properly close all services

---

## 🔍 Troubleshooting

### Service won't start?
- Check if port is already in use
- Run `stop.bat` first to clear any stuck processes
- Check Windows Firewall settings

### KHQR API database error?
- This is normal! API uses in-memory cache as fallback
- MySQL database is optional for demo purposes

### Frontend won't compile?
- Delete `node_modules` folder
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

---

## 🎮 Guest Checkout Flow

1. Open http://localhost:3001
2. Click "Top Up Now"
3. Enter Player ID and Server ID
4. Select diamond package
5. Review and proceed to payment
6. Scan KHQR code with banking app

**No login required!**
