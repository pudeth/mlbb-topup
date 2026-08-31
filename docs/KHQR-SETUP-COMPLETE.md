# ✅ KHQR Bakong Payment Integration - Complete!

## 🎉 What Was Done

I've successfully integrated the KHQR Bakong payment system from the `Scorekhqr-bakong` folder with your MLBB Top-Up application.

## 📋 Summary of Changes

### Backend Changes:
1. ✅ Created `KHQRService.cs` - Service to communicate with KHQR API
2. ✅ Created `KHQRController.cs` - API endpoints for QR codes
3. ✅ Updated `Payment.cs` entity with KHQR fields
4. ✅ Updated `PaymentService.cs` to integrate KHQR
5. ✅ Updated `PaymentDTOs.cs` with KHQR response fields
6. ✅ Registered KHQR service in `Program.cs`
7. ✅ Added KHQR configuration to `appsettings.json`

### Frontend Changes:
8. ✅ Already set payment method to "KHQR only"
9. ✅ Modern KHQR payment card display

### Database Changes:
10. ✅ Added 4 new columns to Payments table:
    - KHQRBillNumber
    - KHQRMd5Hash
    - KHQRQRCode
    - KHQRDeeplink

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)

```powershell
cd d:\TopUP
.\setup-khqr.ps1
```

This script will:
- Check if KHQR API is running
- Apply database migrations
- Build the backend
- Verify configuration

### Option 2: Manual Setup

#### Step 1: Start KHQR API

```bash
cd d:\TopUP\Scorekhqr-bakong
start_all.bat
```

KHQR API will start on `http://localhost:5000`

#### Step 2: Apply Database Migration

```bash
cd d:\TopUP\backend

# Create migration
dotnet ef migrations add AddKHQRFields --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API

# Apply to database
dotnet ef database update --project MLBBTopUp.API
```

**OR** if using SQLite directly:

```bash
cd d:\TopUP\backend
sqlite3 MLBBTopUp.API\mlbbtopup.db < add-khqr-fields.sql
```

#### Step 3: Build & Run Backend

```bash
cd d:\TopUP\backend\MLBBTopUp.API
dotnet build
dotnet run
```

Backend API: `http://localhost:5000`

#### Step 4: Frontend (Already Running)

Frontend should already be running on `http://localhost:3001`

If not:
```bash
cd d:\TopUP\frontend
npm start
```

## 💰 How It Works

### Payment Flow:

1. **User enters order details** → Selects product
2. **Proceeds to payment** → Sees KHQR payment method (only option)
3. **Creates order** → Backend calls KHQR API
4. **QR Code generated** → Using reference: `MLBB{OrderId}`
   - Example: Order 123 → Bill Number: `MLBB000123`
5. **User scans QR** → Opens Bakong app
6. **Pays via Bakong** → Money transferred
7. **Status updates** → Backend polls KHQR API
8. **Order completed** → Diamonds delivered

### Reference Code Format:

```
Bill Number: MLBB{OrderId:D6}

Examples:
- Order 1     → MLBB000001
- Order 123   → MLBB000123  
- Order 9999  → MLBB009999
```

This makes it easy to:
- Identify MLBB payments in Bakong dashboard
- Track payments per order
- Provide customer support

## 🔗 API Endpoints

### MLBB Backend API

#### Create Payment (with KHQR)
```http
POST http://localhost:5000/api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": 123,
  "paymentMethod": "khqr"
}
```

**Response:**
```json
{
  "paymentId": 456,
  "orderId": 123,
  "paymentMethod": "khqr",
  "amount": 1.49,
  "status": "Pending",
  "khqrBillNumber": "MLBB000123",
  "khqrMd5Hash": "abc123...",
  "khqrQRImageUrl": "/api/khqr/qr/abc123..."
}
```

#### Get QR Code Image
```http
GET http://localhost:5000/api/khqr/qr/{md5Hash}
```

Returns PNG image

#### Check Payment Status
```http
GET http://localhost:5000/api/khqr/status/{md5Hash}
```

**Response:**
```json
{
  "md5Hash": "abc123...",
  "status": "PAID"  // or "UNPAID"
}
```

### KHQR Bakong API (Port 5000)

These are called internally by the backend:

- `POST /api/payment/create` - Create payment
- `GET /api/payment/status/{md5}` - Check status  
- `GET /api/payment/qr/{md5}` - Get QR image

## ⚙️ Configuration

### Backend Config (appsettings.json)

```json
{
  "KHQR": {
    "ApiUrl": "http://localhost:5000"
  }
}
```

### KHQR API Config (Scorekhqr-bakong/.env)

```env
# Already configured in your .env file:
BAKONG_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MERCHANT_BAKONG_ID=deth_peak3@aclb
MERCHANT_NAME="PuDeth Smart-PAY"
MERCHANT_CITY="PHNOM PENH"
```

## 🧪 Testing

### 1. Test KHQR API Health

```bash
curl http://localhost:5000/health
```

Expected: `{"status":"healthy"}`

### 2. Test Payment Creation

```bash
curl -X POST http://localhost:5000/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1.49,
    "currency": "USD",
    "bill_number": "MLBB000001",
    "phone": "85512345678"
  }'
```

### 3. Complete Flow Test

1. Open `http://localhost:3001`
2. Login (if needed)
3. Go to Top Up page
4. Enter Player ID: `1225368571`
5. Enter Server ID: `11446`
6. Select package (e.g., 50 Diamonds - $1.49)
7. Click "Proceed to Payment"
8. See KHQR payment card
9. Click "Proceed to Payment"
10. QR code should display!

## 📊 Database Schema

New columns in `Payments` table:

| Column | Type | Description |
|--------|------|-------------|
| KHQRBillNumber | TEXT | Format: MLBB{OrderId} |
| KHQRMd5Hash | TEXT | MD5 from KHQR API |
| KHQRQRCode | TEXT | QR code string |
| KHQRDeeplink | TEXT | Bakong deep link |

## 🐛 Troubleshooting

### Issue: KHQR API Not Running

**Error:** Connection refused to localhost:5000

**Solution:**
```bash
cd d:\TopUP\Scorekhqr-bakong
start_all.bat
```

Wait for: `🚀 Starting Bakong KHQR Demo API...`

### Issue: Migration Failed

**Error:** "Column already exists"

**Solution:**
```bash
cd d:\TopUP\backend
dotnet ef migrations remove --project MLBBTopUp.Infrastructure
dotnet ef migrations add AddKHQRFields --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
dotnet ef database update --project MLBBTopUp.API
```

### Issue: QR Code Not Showing

**Checklist:**
1. ✓ KHQR API is running on port 5000
2. ✓ Backend API is running
3. ✓ Payment was created successfully
4. ✓ Check browser console for errors
5. ✓ Check backend logs

**Debug:**
```bash
# Check if QR exists
curl http://localhost:5000/api/payment/qr/{md5Hash}
```

### Issue: Payment Status Stuck on "Pending"

**Causes:**
1. KHQR API in demo mode
2. Bakong token expired
3. Payment not made via Bakong app

**Check status manually:**
```bash
curl http://localhost:5000/api/payment/status/{md5Hash}
```

## 📁 Files Created/Modified

### New Files:
- `backend/MLBBTopUp.Infrastructure/Services/KHQRService.cs`
- `backend/MLBBTopUp.API/Controllers/KHQRController.cs`
- `backend/KHQR-INTEGRATION.md` (detailed docs)
- `backend/add-khqr-fields.sql` (manual migration)
- `setup-khqr.ps1` (setup script)
- `KHQR-SETUP-COMPLETE.md` (this file)

### Modified Files:
- `backend/MLBBTopUp.Core/Entities/Payment.cs`
- `backend/MLBBTopUp.Core/DTOs/PaymentDTOs.cs`
- `backend/MLBBTopUp.Infrastructure/Services/PaymentService.cs`
- `backend/MLBBTopUp.API/Program.cs`
- `backend/MLBBTopUp.API/appsettings.json`
- `frontend/src/pages/TopUp.js` (already set to KHQR only)

## 📚 Documentation

- **Integration Guide:** `backend/KHQR-INTEGRATION.md`
- **KHQR API Docs:** `Scorekhqr-bakong/README.md`
- **Setup Script:** `setup-khqr.ps1`
- **SQL Migration:** `backend/add-khqr-fields.sql`

## 🎯 Next Steps

### Development:
1. ✅ Run setup script or manual steps above
2. ✅ Test payment flow end-to-end
3. ✅ Verify QR code generation
4. ✅ Test payment status updates

### Production:
1. 🔒 Deploy KHQR API to production server
2. 🔒 Update `KHQR:ApiUrl` in appsettings.json
3. 🔒 Use production Bakong token
4. 🔒 Enable HTTPS for all APIs
5. 🔒 Set up monitoring & logging
6. 🔒 Configure webhook callbacks
7. 🔒 Add payment timeout handling

## 💡 Features

✅ **Automatic QR Generation** - Reference code based on order ID
✅ **Real-time Status** - Poll KHQR API for payment updates
✅ **Bakong Integration** - Official Cambodian payment system
✅ **Clean UI** - Modern KHQR payment card design
✅ **Error Handling** - Graceful fallbacks
✅ **Telegram Notifications** - (configured in KHQR API)

## 🆘 Support

For help:
- **MLBB Integration:** See `backend/KHQR-INTEGRATION.md`
- **KHQR API:** See `Scorekhqr-bakong/README.md`
- **Bakong Issues:** Check Bakong documentation

## ✨ Success!

Your MLBB Top-Up system now supports KHQR Bakong payments with:
- Automatic QR code generation
- Order-based reference codes (MLBB{OrderId})
- Real-time payment verification
- Clean user interface

**Ready to accept payments! 🎉**
