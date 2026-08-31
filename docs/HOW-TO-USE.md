# 🎮 MLBB Top-Up Application - Complete Guide

## 📁 Command Files Created

All command files are in the root directory: `d:\TopUP\`

| File | Purpose |
|------|---------|
| **menu.bat** | Interactive menu with all options (RECOMMENDED) |
| **start.bat** | Start all services (Backend + KHQR API + Frontend) |
| **stop.bat** | Stop all running services |
| **restart.bat** | Restart all services |
| **status.bat** | Check which services are running |
| **install.bat** | First-time setup - installs all dependencies |
| **build.bat** | Build for production deployment |

---

## 🚀 Quick Start (3 Steps)

### **Step 1: First Time Only**
Double-click: `install.bat`
- Installs backend dependencies (.NET packages)
- Creates Python virtual environment for KHQR API
- Installs frontend dependencies (npm packages)
- Takes 3-5 minutes

### **Step 2: Start Services**
Double-click: `start.bat`
- Opens 3 terminal windows:
  - **Window 1**: Backend API (port 5000)
  - **Window 2**: KHQR Bakong API (port 5000)
  - **Window 3**: Frontend React (port 3001)

### **Step 3: Open Browser**
Navigate to: **http://localhost:3001**

---

## 💻 Using the Interactive Menu

Double-click: `menu.bat`

```
========================================
  MLBB TOP-UP APPLICATION
  Command Menu
========================================

  [1] Start Project
  [2] Stop Project
  [3] Restart Project
  [4] Check Status
  [5] Install Dependencies
  [6] Build Production
  [7] Open Frontend (Browser)
  [8] View README
  [0] Exit
```

---

## 🔧 What Each Command Does

### **start.bat**
- Starts Backend API on http://localhost:5000
- Starts KHQR Bakong API on http://localhost:5000
- Starts Frontend on http://localhost:3001
- Opens 3 separate terminal windows
- Leave windows open while working

### **stop.bat**
- Closes all Node.js processes (Frontend)
- Closes all dotnet processes (Backend)
- Closes all Python processes (KHQR API)
- Frees up ports 3001 and 5000

### **restart.bat**
- Runs stop.bat
- Waits 3 seconds
- Runs start.bat
- Useful after making code changes

### **status.bat**
- Shows which services are running
- Displays process information
- Shows service URLs

### **install.bat**
- Runs `dotnet restore` for Backend
- Creates Python venv for KHQR API
- Runs `pip install -r requirements.txt`
- Runs `npm install` for Frontend

### **build.bat**
- Builds Backend: `dotnet build`
- Builds Frontend: `npm run build`
- Creates production-ready files
- Output in `frontend/build/`

---

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3001 | User interface (React) |
| **Backend API** | http://localhost:5000 | REST API (.NET Core) |
| **KHQR API** | http://localhost:5000 | KHQR Payment API (Python Flask) |
| **Swagger Docs** | http://localhost:5000/swagger | API Documentation |

---

## ✨ Application Features

### **Guest Checkout**
- ✅ No login required
- ✅ No registration needed
- ✅ Direct top-up access

### **KHQR Payment**
- ✅ QR code displayed prominently
- ✅ Auto-opens banking app (mobile)
- ✅ Deep link support
- ✅ Reference number tracking

### **Smart ID Detection**
- ✅ Auto-detects Player ID format
- ✅ Extracts Server ID automatically
- ✅ Supports multiple formats:
  - `1225368571 (11446)`
  - `1225368571 11446`
  - `User ID: 1225368571 Zone ID: 11446`

### **Real-time Verification**
- ✅ Account validation
- ✅ Player info display
- ✅ Auto-check on input

---

## 📱 Customer Flow

1. **Homepage** → Click "Top Up Now"
2. **Enter Account**:
   - Player ID: `1225368571`
   - Server ID: `11446`
   - Or paste: `1225368571 (11446)`
3. **Select Package** → Choose diamond amount
4. **Review Order** → Check details
5. **Payment** → KHQR code displays
6. **Scan QR** → Banking app opens automatically
7. **Confirm** → Complete payment in banking app

---

## 🔍 Troubleshooting

### **Services won't start?**
```batch
1. Double-click: stop.bat (clear stuck processes)
2. Wait 5 seconds
3. Double-click: start.bat (start fresh)
```

### **Port already in use?**
```powershell
# Check what's using the ports
netstat -ano | findstr ":3001 :5000"

# Or use stop.bat to kill all processes
```

### **Frontend won't compile?**
```bash
cd frontend
rmdir /s /q node_modules
npm install
```

### **Backend won't start?**
```bash
cd backend/MLBBTopUp.API
dotnet clean
dotnet restore
dotnet build
```

### **KHQR API database error?**
- ✅ This is NORMAL!
- ✅ API uses in-memory cache (no MySQL needed)
- ✅ Message: "Unknown database 'khqr_payment'" is expected

---

## 🎯 Daily Usage

### **Morning (Start Work)**
```
1. Double-click: start.bat
2. Wait for all 3 windows to open
3. Open browser: http://localhost:3001
```

### **Evening (Stop Work)**
```
1. Double-click: stop.bat
2. All services closed
```

### **After Code Changes**
```
1. Double-click: restart.bat
2. Services restart automatically
```

---

## 📂 Project Structure

```
d:\TopUP\
├── menu.bat                    # Interactive menu
├── start.bat                   # Start all services
├── stop.bat                    # Stop all services
├── restart.bat                 # Restart services
├── status.bat                  # Check status
├── install.bat                 # Install dependencies
├── build.bat                   # Build production
├── QUICK-START.txt            # Quick reference
├── README-COMMANDS.md         # Detailed docs
├── HOW-TO-USE.md             # This file
├── backend\                   # .NET Core API
│   ├── MLBBTopUp.API\
│   ├── MLBBTopUp.Core\
│   └── MLBBTopUp.Infrastructure\
├── frontend\                  # React frontend
│   ├── src\
│   ├── public\
│   └── package.json
└── Scorekhqr-bakong\         # Python KHQR API
    ├── api.py
    ├── venv\
    └── requirements.txt
```

---

## 🛡️ Security Notes

- Backend uses JWT authentication (optional for guest checkout)
- KHQR API uses in-memory cache (safe for demo)
- SQLite database for orders/payments
- CORS enabled for localhost development
- Guest checkout allows anonymous orders

---

## 🎨 Navigation (No Login Required)

Current menu shows:
- **Home** - Landing page
- **Top Up** - Diamond purchase (guest access)
- **Support** - Help & contact
- **Admin** - Admin panel (hidden from guests)

Removed:
- ~~Login button~~
- ~~Register button~~
- ~~My Orders~~ (guest users don't have accounts)

---

## 📝 Additional Notes

1. **First time**: Run `install.bat` before `start.bat`
2. **Keep windows open**: Don't close the 3 terminal windows
3. **Port conflicts**: Ensure 3001 and 5000 are available
4. **Windows Firewall**: May prompt for Node.js/Python/.NET access
5. **Auto-open banking app**: Works best on mobile devices

---

## 🆘 Getting Help

- **Quick reference**: `QUICK-START.txt`
- **Detailed commands**: `README-COMMANDS.md`
- **This guide**: `HOW-TO-USE.md`
- **Interactive menu**: `menu.bat`

---

## ✅ Verification Checklist

After starting services, verify:

- [ ] Backend running: http://localhost:5000/swagger (should load)
- [ ] KHQR API running: Terminal shows "Running on http://localhost"
- [ ] Frontend running: http://localhost:3001 (should load homepage)
- [ ] No login buttons visible in navigation
- [ ] "Top Up Now" button clickable
- [ ] Can enter Player ID and Server ID
- [ ] Can select diamond package
- [ ] Can proceed to payment without login

---

**Made with ❤️ for MLBB Top-Up Services**

*Last Updated: August 28, 2026*
