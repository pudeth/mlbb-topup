# KHQR Bakong Payment Integration

## Overview
This integration connects the MLBB Top-Up system with the existing KHQR Bakong payment API located in `Scorekhqr-bakong` folder.

## Changes Made

### 1. Backend Services

#### New Files Created:
- `MLBBTopUp.Infrastructure/Services/KHQRService.cs` - Service to communicate with KHQR API
- `MLBBTopUp.API/Controllers/KHQRController.cs` - Controller for KHQR endpoints

#### Modified Files:
- `MLBBTopUp.Core/Entities/Payment.cs` - Added KHQR fields
- `MLBBTopUp.Core/DTOs/PaymentDTOs.cs` - Added KHQR response fields
- `MLBBTopUp.Infrastructure/Services/PaymentService.cs` - Integrated KHQR service
- `MLBBTopUp.API/Program.cs` - Registered KHQR service
- `MLBBTopUp.API/appsettings.json` - Added KHQR configuration

### 2. Database Changes

New fields added to `Payments` table:
- `KHQRBillNumber` (string, nullable) - Bill number format: MLBB{OrderId}
- `KHQRMd5Hash` (string, nullable) - MD5 hash from KHQR API
- `KHQRQRCode` (string, nullable) - QR code string
- `KHQRDeeplink` (string, nullable) - Deep link for payment

### 3. How It Works

1. **Payment Creation Flow:**
   - User selects KHQR payment method
   - Frontend sends payment request to `/api/payments`
   - Backend calls KHQR API at `http://localhost:5000/api/payment/create`
   - KHQR API generates QR code with bill number format: `MLBB{OrderId}`
   - Payment record saved with KHQR details

2. **QR Code Display:**
   - Frontend receives `KHQRQRImageUrl` in payment response
   - Image URL: `/api/khqr/qr/{md5Hash}`
   - Controller proxies request to KHQR API

3. **Payment Verification:**
   - Frontend polls `/api/khqr/status/{md5Hash}`
   - Backend checks KHQR API for payment status
   - When status = "PAID", updates payment and order status

## Setup Instructions

### Step 1: Start KHQR API Server

```bash
cd d:\TopUP\Scorekhqr-bakong
start_all.bat
```

This starts the KHQR Bakong API on `http://localhost:5000`

### Step 2: Apply Database Migration

```bash
cd d:\TopUP\backend
dotnet ef migrations add AddKHQRFields --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
dotnet ef database update --project MLBBTopUp.API
```

### Step 3: Build and Run Backend

```bash
cd d:\TopUP\backend\MLBBTopUp.API
dotnet build
dotnet run
```

Backend will run on `http://localhost:5000` (or your configured port)

### Step 4: Update Frontend (Already Done)

The frontend is already configured to:
- Display KHQR as the only payment method
- Show QR code after payment creation
- Poll payment status

## API Endpoints

### MLBB Top-Up API

#### Create Payment with KHQR
```http
POST /api/payments
Content-Type: application/json
Authorization: Bearer {token}

{
  "orderId": 123,
  "paymentMethod": "khqr"
}
```

Response:
```json
{
  "paymentId": 456,
  "orderId": 123,
  "paymentMethod": "khqr",
  "transactionID": "TXN-20260828140530-123",
  "amount": 1.49,
  "status": "Pending",
  "khqrBillNumber": "MLBB000123",
  "khqrMd5Hash": "abc123def456",
  "khqrQRImageUrl": "/api/khqr/qr/abc123def456"
}
```

#### Get QR Code Image
```http
GET /api/khqr/qr/{md5Hash}
```

Returns: PNG image

#### Check Payment Status
```http
GET /api/khqr/status/{md5Hash}
```

Response:
```json
{
  "md5Hash": "abc123def456",
  "status": "PAID"  // or "UNPAID"
}
```

### KHQR Bakong API (localhost:5000)

The MLBB backend communicates with these endpoints:

- `POST /api/payment/create` - Create payment
- `GET /api/payment/status/{md5}` - Check status
- `GET /api/payment/qr/{md5}` - Get QR image

## Configuration

### Backend (appsettings.json)
```json
{
  "KHQR": {
    "ApiUrl": "http://localhost:5000"
  }
}
```

### KHQR API (.env in Scorekhqr-bakong folder)
```env
BAKONG_TOKEN=your_token_here
MERCHANT_BAKONG_ID=your_bakong_id
MERCHANT_NAME="PuDeth Smart-PAY"
MERCHANT_CITY="PHNOM PENH"
```

## Testing

### 1. Test KHQR API
```bash
curl http://localhost:5000/health
```

### 2. Create Test Payment
```bash
curl -X POST http://localhost:5000/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 1.49, "currency": "USD", "bill_number": "MLBB000001"}'
```

### 3. Check Payment Status
```bash
curl http://localhost:5000/api/payment/status/{md5_hash}
```

## Bill Number Format

Format: `MLBB{OrderId:D6}`

Examples:
- Order 1 → MLBB000001
- Order 123 → MLBB000123
- Order 9999 → MLBB009999

This ensures:
- Easy identification of MLBB payments
- Unique reference per order
- Readable format for customer support

## Troubleshooting

### KHQR API Not Running
**Error:** Connection refused to localhost:5000

**Solution:**
```bash
cd d:\TopUP\Scorekhqr-bakong
start_all.bat
```

### Database Migration Error
**Error:** Column already exists

**Solution:**
```bash
dotnet ef migrations remove --project MLBBTopUp.Infrastructure
dotnet ef migrations add AddKHQRFields --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
dotnet ef database update --project MLBBTopUp.API
```

### QR Code Not Displaying
**Error:** 404 on QR image

**Checklist:**
1. KHQR API is running
2. Payment was created successfully
3. MD5 hash is valid
4. Check KHQR API logs

### Payment Status Stuck on "Pending"
**Causes:**
1. KHQR API demo mode enabled
2. Bakong token expired
3. Payment not actually made

**Check:**
```bash
curl http://localhost:5000/api/payment/status/{md5}
```

## Production Considerations

1. **KHQR API Deployment:**
   - Deploy KHQR API to production server
   - Update `KHQR:ApiUrl` in appsettings.json
   - Use HTTPS for production

2. **Bakong Token:**
   - Get production token from Bakong
   - Store securely in environment variables
   - Set up token refresh mechanism

3. **Database:**
   - Add indexes on KHQR fields
   - Set up cleanup job for old QR codes
   - Monitor payment status checks

4. **Monitoring:**
   - Set up logging for KHQR API calls
   - Monitor payment success rate
   - Alert on API failures

5. **Security:**
   - Validate webhook signatures
   - Rate limit status check endpoint
   - Encrypt sensitive payment data

## Support

For issues with:
- **MLBB Integration:** Check this documentation
- **KHQR API:** See `Scorekhqr-bakong/README.md`
- **Bakong Service:** Contact Bakong support

## References

- KHQR Bakong API: `d:\TopUP\Scorekhqr-bakong\`
- Bakong Documentation: https://api-bakong.nbc.gov.kh/docs
- MLBB API Documentation: `/swagger`
