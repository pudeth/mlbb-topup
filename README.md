# MLBB Top-Up Website

A complete web application for selling Mobile Legends: Bang Bang diamonds through a secure and user-friendly platform.

## 🎉 **NEW: Guest Checkout Enabled!**

✅ **Customers can now top-up diamonds WITHOUT login or registration!**
- No account creation required
- Direct access to top-up
- KHQR payment with QR code
- Auto-open banking app
- Simplified navigation: Home | Top Up | Support

📚 **See [docs/GUEST-CHECKOUT-GUIDE.md](docs/GUEST-CHECKOUT-GUIDE.md) for complete documentation.**

---

## Project Structure

```
mlbb-topup-website/
├── backend/                 # ASP.NET Core Web API
│   ├── MLBBTopUp.API/      # Main API project
│   ├── MLBBTopUp.Core/     # Domain models and interfaces
│   └── MLBBTopUp.Infrastructure/ # Data access and external services
├── frontend/               # React + Tailwind CSS
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: SQL Server / MySQL
- **Authentication**: JWT Bearer Tokens
- **ORM**: Entity Framework Core
- **Password Hashing**: BCrypt.NET

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **State Management**: React Context API

## Features

### **Customer Features (No Login Required!)**
- ✅ **Guest checkout** - Buy diamonds without account
- ✅ Browse and select diamond packages
- ✅ **KHQR payment** - Bakong QR code payment
- ✅ **Auto-open banking app** - Seamless mobile experience
- ✅ **Real-time account verification** - MLBB Player ID check
- ✅ **Smart ID detection** - Auto-extracts Server ID from paste
- ✅ Order tracking by Order ID

### **Admin Features (Protected)**
- ✅ User authentication (JWT Bearer Tokens)
- ✅ Admin dashboard for order management
- ✅ Order tracking and history
- ✅ Transaction logging
- ✅ Payment verification

### **Technical Features**
- ✅ Integration with KHQR Bakong payment system
- ✅ SQLite database (easy setup, no MySQL required)
- ✅ RESTful API with Swagger documentation
- ✅ Responsive design (mobile-first)
- ✅ Secure payment processing

## Prerequisites

- .NET 8.0 SDK
- Node.js 18+ and npm
- Python 3.8+ (for KHQR Bakong API)
- SQLite (included) or SQL Server/MySQL

## 🚀 Quick Start (Windows)

### **Easiest Way: Use Command Files**

Located in root directory (`d:\TopUP\`):

```batch
# First time only
install.bat          # Installs all dependencies

# Daily usage
start.bat           # Start all services
stop.bat            # Stop all services
menu.bat            # Interactive menu with all options

# Utilities
status.bat          # Check what's running
restart.bat         # Restart services
build.bat           # Build for production
```

Then open: **http://localhost:3001**

📖 **See also**: `START-HERE.txt`, `HOW-TO-USE.md`, `QUICK-START.txt`

---

### **Manual Setup (Alternative)**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=MLBBTopUp;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
     }
   }
   ```

3. Apply database migrations:
   ```bash
   dotnet ef database update --project MLBBTopUp.API
   ```

4. Run the API:
   ```bash
   cd MLBBTopUp.API
   dotnet run
   ```
   API will be available at `https://localhost:7001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API URL in `.env`:
   ```
   REACT_APP_API_URL=https://localhost:7001/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   App will be available at `http://localhost:3000`

## Configuration

### Payment Gateway

Update `appsettings.json` with your payment gateway credentials:
```json
{
  "PaymentGateway": {
    "Provider": "YourProvider",
    "ApiKey": "your-api-key",
    "SecretKey": "your-secret-key",
    "WebhookUrl": "https://yourapp.com/api/payments/webhook"
  }
}
```

### Top-Up Provider

Update `appsettings.json` with your authorized MLBB top-up provider credentials:
```json
{
  "TopUpProvider": {
    "Provider": "YourProvider",
    "ApiKey": "your-api-key",
    "ApiUrl": "https://api.provider.com",
    "WebhookSecret": "your-webhook-secret"
  }
}
```

### JWT Settings

Configure JWT authentication:
```json
{
  "Jwt": {
    "SecretKey": "your-256-bit-secret-key-change-this-in-production",
    "Issuer": "MLBBTopUpAPI",
    "Audience": "MLBBTopUpClient",
    "ExpiryInMinutes": 60
  }
}
```

## Database Schema

### Users
- UserID (PK)
- Name
- Email
- PasswordHash
- CreatedAt

### Products
- ProductID (PK)
- DiamondAmount
- Price
- Status

### Orders
- OrderID (PK)
- UserID (FK)
- PlayerID
- ServerID
- ProductID (FK)
- Amount
- PaymentStatus
- TopupStatus
- CreatedAt

### Payments
- PaymentID (PK)
- OrderID (FK)
- PaymentMethod
- TransactionID
- Amount
- Status
- PaidAt

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all active products
- `GET /api/products/{id}` - Get product details

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders/user/{userId}` - Get user order history
- `GET /api/orders/{id}/status` - Check order status

### Payments
- `POST /api/payments` - Process payment
- `POST /api/payments/webhook` - Payment gateway webhook
- `GET /api/payments/order/{orderId}` - Get payment details

### Admin (Requires Admin Role)
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/orders/pending` - List pending orders
- `PUT /api/admin/orders/{id}/verify` - Verify payment
- `POST /api/admin/orders/{id}/topup` - Send top-up request
- `GET /api/admin/users` - List all users
- `GET /api/admin/reports` - Get sales reports

## Security Best Practices

✅ **Never store MLBB passwords** - Only use Player ID + Server ID  
✅ **Server-side validation** - All payment and top-up operations verified server-side  
✅ **API keys secured** - Stored in environment variables, never in frontend code  
✅ **Payment verification** - Always verify payment before processing top-up  
✅ **Transaction logging** - Complete audit trail for dispute handling  
✅ **HTTPS only** - All production traffic over secure connections  
✅ **Input validation** - Prevent SQL injection and XSS attacks  
✅ **Rate limiting** - Prevent abuse and DDoS attacks  

## Deployment

### Backend (Azure App Service)
```bash
cd backend/MLBBTopUp.API
dotnet publish -c Release -o ./publish
# Deploy publish folder to Azure App Service
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy build folder to Vercel or Netlify
```

### Database Migration
```bash
dotnet ef migrations script --output migration.sql
# Run migration.sql on production database
```

## Environment Variables

### Backend (.NET)
- `ConnectionStrings__DefaultConnection`
- `Jwt__SecretKey`
- `PaymentGateway__ApiKey`
- `PaymentGateway__SecretKey`
- `TopUpProvider__ApiKey`

### Frontend (React)
- `REACT_APP_API_URL`

## Support & Maintenance

- Monitor order failure rates
- Check payment gateway webhook logs
- Review top-up provider API responses
- Maintain transaction logs for at least 1 year
- Regular security updates

## 📚 Documentation

All documentation is organized in the [`docs/`](docs/) folder:

- **[docs/HOW-TO-USE.md](docs/HOW-TO-USE.md)** - Complete user guide
- **[docs/GUEST-CHECKOUT-GUIDE.md](docs/GUEST-CHECKOUT-GUIDE.md)** - Guest checkout documentation
- **[docs/ROLE-SUMMARY.md](docs/ROLE-SUMMARY.md)** - User roles & permissions
- **[docs/README-COMMANDS.md](docs/README-COMMANDS.md)** - Command reference
- **[docs/KHQR-INTEGRATION.md](docs/KHQR-INTEGRATION.md)** - KHQR payment integration
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide
- **[docs/](docs/)** - See full documentation index

## License

Proprietary - All rights reserved

## Contact

For support and inquiries, contact your development team.
