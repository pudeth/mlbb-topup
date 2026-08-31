# 📁 MLBB Top-Up Project Structure

## Overview

Clean, organized project structure with documentation centralized in `docs/` folder.

---

## 🗂️ Root Directory

```
d:\TopUP\
├── 📄 README.md              # Main project documentation
├── 📄 START-HERE.txt         # Visual quick start guide
├── 📄 QUICK-START.txt        # Quick reference card
├── 📄 .gitignore             # Git ignore rules
│
├── ⚙️ menu.bat                # Interactive command menu
├── ▶️ start.bat               # Start all services
├── ⏹️ stop.bat                # Stop all services
├── 🔄 restart.bat            # Restart all services
├── 📊 status.bat             # Check service status
├── 🔧 install.bat            # Install dependencies
├── 📦 build.bat              # Build for production
│
├── 📂 backend/               # ASP.NET Core API
├── 📂 frontend/              # React application
├── 📂 Scorekhqr-bakong/      # KHQR Bakong API
├── 📂 docs/                  # Documentation (organized)
└── 📂 scripts/               # Setup & utility scripts
```

---

## 📂 Backend Structure

```
backend/
├── MLBBTopUp.API/
│   ├── Controllers/          # API endpoints
│   ├── Program.cs           # App entry point
│   ├── appsettings.json     # Configuration
│   └── mlbbtopup.db         # SQLite database
│
├── MLBBTopUp.Core/
│   ├── DTOs/                # Data transfer objects
│   ├── Entities/            # Domain models
│   └── Interfaces/          # Service interfaces
│
└── MLBBTopUp.Infrastructure/
    ├── Services/            # Business logic
    └── Data/                # Database context
```

**Clean:** No bin/ or obj/ folders (removed during cleanup)

---

## 📂 Frontend Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── context/            # React context
│   └── App.js              # Main app
│
├── public/                 # Static assets
├── package.json           # Dependencies
└── tailwind.config.js     # Tailwind config
```

**Clean:** No build/ folder (regenerated with build.bat)

---

## 📂 KHQR API Structure

```
Scorekhqr-bakong/
├── api.py                  # Flask API
├── requirements.txt        # Python dependencies
├── venv/                   # Python virtual env
└── README.md              # API documentation
```

---

## 📂 Documentation Structure

```
docs/
├── 📄 README.md                      # Documentation index
│
├── 🚀 Getting Started
│   ├── HOW-TO-USE.md                # Complete user guide
│   ├── QUICK-START.md               # Quick start guide
│   └── README-COMMANDS.md           # Command reference
│
├── 👥 User Roles & Features
│   ├── GUEST-CHECKOUT-GUIDE.md      # Guest checkout docs
│   └── ROLE-SUMMARY.md              # Roles & permissions
│
├── 🔧 Technical Documentation
│   ├── KHQR-INTEGRATION.md          # Payment integration
│   ├── KHQR-SETUP-COMPLETE.md       # Setup completion
│   ├── INTEGRATION-GUIDE.md         # API integration
│   ├── MIGRATIONS.md                # Database migrations
│   └── add-khqr-fields.sql          # SQL migration script
│
├── 🚀 Deployment
│   └── DEPLOYMENT.md                # Production deployment
│
├── 🎨 Features
│   └── AVATAR-FEATURE.md            # Avatar docs (legacy)
│
└── 📝 Project Management
    ├── CHANGELOG.md                 # Version history
    └── CONTRIBUTING.md              # Contribution guide
```

---

## 📂 Scripts Structure

```
scripts/
├── dotnet-install.ps1      # .NET SDK installer
└── setup-khqr.ps1          # KHQR API setup
```

---

## 🧹 What Was Cleaned Up

### ✅ Removed
- ❌ `Font/` folder (unused)
- ❌ `backend/bin/` folders (6 folders)
- ❌ `backend/obj/` folders (build artifacts)
- ❌ `frontend/build/` folder (can rebuild)

### ✅ Organized
- ✅ Moved 14 documentation files to `docs/`
- ✅ Moved 2 script files to `scripts/`
- ✅ Created documentation index in `docs/README.md`
- ✅ Updated main README with new structure

---

## 📊 File Count Summary

| Category | Count | Location |
|----------|-------|----------|
| **Root Files** | 10 | Root directory |
| **Command Files** | 7 | Root (*.bat) |
| **Documentation** | 14 | docs/ |
| **Scripts** | 2 | scripts/ |
| **Backend** | ~50 | backend/ |
| **Frontend** | ~30 | frontend/ |
| **KHQR API** | ~10 | Scorekhqr-bakong/ |

---

## 🎯 Key Features of Clean Structure

### **Easy Navigation**
✅ Essential files in root  
✅ Documentation centralized  
✅ Scripts organized  
✅ No build artifacts  

### **Clear Purpose**
✅ Each folder has clear role  
✅ Documentation indexed  
✅ Commands at root level  

### **Developer Friendly**
✅ Quick access to commands  
✅ Easy to find docs  
✅ Clean git status  

---

## 🚀 Quick Access

### **Start Developing**
```
1. Open: START-HERE.txt
2. Run: menu.bat
3. Done!
```

### **Read Documentation**
```
1. Go to: docs/
2. Read: docs/README.md
3. Find what you need!
```

### **Run Commands**
```
All .bat files in root:
- menu.bat (easiest)
- start.bat
- stop.bat
- etc.
```

---

## 📝 Maintenance

### **Keep Clean**
- Run `build.bat` only when needed
- Don't commit bin/obj folders
- Keep docs in docs/ folder
- Use .gitignore properly

### **Add New Docs**
```
1. Create file in docs/
2. Update docs/README.md index
3. Reference in main README.md
```

---

## ✅ Benefits of Clean Structure

1. **Easy Onboarding** - New developers find things quickly
2. **Professional** - Organized and maintainable
3. **Efficient** - No clutter or confusion
4. **Scalable** - Easy to add new features
5. **Git Friendly** - Clean commits and diffs

---

**Project organized and ready for production!** 🚀

*Last Updated: August 28, 2026*
