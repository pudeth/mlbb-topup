# Quick Start Guide

Get your MLBB Top-Up website running in 15 minutes!

## Prerequisites

Ensure you have the following installed:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- [SQL Server 2019+](https://www.microsoft.com/sql-server/sql-server-downloads) or [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-editions-express)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

## Step 1: Clone and Navigate

```bash
cd mlbb-topup-website
```

## Step 2: Backend Setup (5 minutes)

### 2.1 Update Database Connection

Open `backend/MLBBTopUp.API/appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MLBBTopUp;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
  }
}
```

For Windows Authentication, use:
```json
"DefaultConnection": "Server=localhost;Database=MLBBTopUp;Integrated Security=true;TrustServerCertificate=True"
```

### 2.2 Install Dependencies and Create Database

```bash
cd backend
dotnet restore
dotnet ef migrations add InitialCreate --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
dotnet ef database update --project MLBBTopUp.API
```

### 2.3 Run Backend

```bash
cd MLBBTopUp.API
dotnet run
```

Backend will be available at: **https://localhost:7001**

Swagger API docs: **https://localhost:7001/swagger**

## Step 3: Frontend Setup (5 minutes)

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will be available at: **http://localhost:3000**

## Step 4: Test the Application (5 minutes)

### 4.1 Login as Admin

1. Navigate to http://localhost:3000/login
2. Use these credentials:
   - **Email:** admin@mlbbtopup.com
   - **Password:** Admin@123

⚠️ **Change this password immediately in production!**

### 4.2 Test Order Flow

1. Go to **Top Up** page
2. Enter test Player ID: `12345678`
3. Enter test Server ID: `1234`
4. Select a diamond package
5. Complete the mock payment

### 4.3 Access Admin Dashboard

1. Click **Admin** in the navigation
2. View orders, users, and reports
3. Process pending orders

## Default Accounts

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@mlbbtopup.com | Admin@123 |

## Project Structure

```
mlbb-topup-website/
├── backend/                    # ASP.NET Core API
│   ├── MLBBTopUp.API/         # API controllers and startup
│   ├── MLBBTopUp.Core/        # Domain models and interfaces
│   └── MLBBTopUp.Infrastructure/ # Data access and services
├── frontend/                   # React application
│   ├── public/                # Static files
│   └── src/
│       ├── components/        # Reusable components
│       ├── pages/            # Page components
│       ├── services/         # API services
│       └── context/          # React context
└── docs/                      # Documentation
```

## Common Issues & Solutions

### Issue: Database connection fails

**Solution:** 
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Ensure firewall allows SQL Server connection
- Try using `(localdb)\\mssqllocaldb` for LocalDB

### Issue: CORS error in browser

**Solution:**
- Ensure backend is running on https://localhost:7001
- Check CORS configuration in `Program.cs`
- Verify frontend .env has correct API URL

### Issue: npm install fails

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Migration fails

**Solution:**
```bash
dotnet ef migrations remove --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
dotnet ef migrations add InitialCreate --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
dotnet ef database update --project MLBBTopUp.API
```

## Next Steps

1. ✅ **Configure Payment Gateway** - See [INTEGRATION-GUIDE.md](backend/INTEGRATION-GUIDE.md)
2. ✅ **Configure Top-Up Provider** - See [INTEGRATION-GUIDE.md](backend/INTEGRATION-GUIDE.md)
3. ✅ **Update Security Settings** - Change default admin password and JWT secret
4. ✅ **Customize Branding** - Update colors, logo, and text
5. ✅ **Deploy to Production** - See [DEPLOYMENT.md](DEPLOYMENT.md)

## Development Tips

### Hot Reload

Both backend and frontend support hot reload:
- Backend: Changes to .cs files auto-reload
- Frontend: Changes to React files auto-reload in browser

### Debug Mode

**Backend (VS Code):**
```bash
# Press F5 or use Debug panel
```

**Frontend:**
```bash
# Browser DevTools (F12)
```

### View Logs

**Backend:**
- Console output in terminal
- Check `logs/` folder if configured

**Frontend:**
- Browser console (F12)
- Network tab for API calls

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/products` - Get diamond packages

### Protected Endpoints (Requires Auth)
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/payments` - Create payment

### Admin Endpoints
- `GET /api/admin/orders` - Get all orders
- `POST /api/admin/orders/{id}/process-topup` - Process top-up
- `GET /api/admin/reports` - Get sales reports

Full API documentation: **https://localhost:7001/swagger**

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🔧 Check [INTEGRATION-GUIDE.md](backend/INTEGRATION-GUIDE.md) for payment/top-up setup
- 🗃️ Review [MIGRATIONS.md](backend/MIGRATIONS.md) for database help
- 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Project Status

✅ Backend API - Fully functional  
✅ Frontend UI - Fully functional  
✅ Authentication - JWT implemented  
✅ Order Management - Complete  
⚠️ Payment Gateway - Mock implementation (needs real gateway)  
⚠️ Top-Up Provider - Mock implementation (needs real provider)  

Replace mock implementations with real payment and top-up providers before going to production!
