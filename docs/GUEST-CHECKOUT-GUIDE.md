# 🎮 Guest Checkout - Customer Role Documentation

## 🎯 Overview

The MLBB Top-Up application now supports **GUEST CHECKOUT** - customers can purchase diamonds without creating an account or logging in.

---

## 👤 Customer Role: Guest User

### **What Guests Can Do (No Login Required)**

✅ **Browse Homepage** - View all features and packages  
✅ **Top-Up Diamonds** - Complete purchase without account  
✅ **Enter Player Details** - Only need MLBB Player ID & Server ID  
✅ **Select Packages** - Choose any diamond package  
✅ **Make Payment** - Pay via KHQR (Bakong QR code)  
✅ **View QR Code** - Payment QR displayed immediately  
✅ **Track Order** - Via order ID (no account needed)  

### **What Guests Cannot Do**

❌ **View Order History** - No persistent order records  
❌ **Save Payment Methods** - No stored payment info  
❌ **Create Profile** - No user profile or settings  
❌ **Access Admin Panel** - Admin features require authentication  

---

## 🔐 Removed Features (For Guest Experience)

The following have been **removed or hidden** from the customer interface:

- ❌ **Login Button** - Not shown in navigation
- ❌ **Register Button** - Not shown in navigation
- ❌ **"Sign in to your account" Page** - Not accessible via normal flow
- ❌ **My Orders Link** - Hidden from navigation
- ❌ **User Profile** - No user management

---

## 🛒 Guest Checkout Flow

### **Step-by-Step Process**

```
1. Homepage (/)
   ↓ Click "Top Up Now"

2. Account Info (/topup - Step 1)
   ↓ Enter Player ID & Server ID
   ↓ Account auto-verified
   ↓ Click "Continue"

3. Select Package (/topup - Step 2)
   ↓ Choose diamond amount
   ↓ Click "Continue"

4. Review Order (/topup - Step 3)
   ↓ Verify details
   ↓ Payment method: KHQR (fixed)
   ↓ Click "Proceed to Payment"

5. QR Code Display (/topup - Step 4)
   ↓ QR code shown prominently
   ↓ Banking app auto-opens (mobile)
   ↓ Scan QR and pay
   ↓ Order complete!
```

---

## 🌐 Navigation Structure

### **Public Access (Guest Users)**

```
┌─────────────────────────────────────┐
│  MLBB Top-Up                        │
│                                     │
│  [Home] [Top Up] [Support]         │
└─────────────────────────────────────┘
```

### **No Login/Register Buttons Visible**

The navigation is intentionally simplified:
- **Home** - Landing page with features
- **Top Up** - Direct access to purchase flow
- **Support** - Help and contact information

---

## 📱 Customer Data Required

### **Minimum Information Needed**

| Field | Required | Purpose |
|-------|----------|---------|
| **Player ID** | ✅ Yes | MLBB game account identifier |
| **Server ID** | ✅ Yes | MLBB server/zone identifier |
| **Package Selection** | ✅ Yes | Diamond amount to purchase |

### **No Personal Information Required**

- ❌ No email address
- ❌ No phone number
- ❌ No password
- ❌ No name or address
- ❌ No account creation

---

## 💳 Payment Process (KHQR)

### **How It Works**

1. **Order Created** → Backend generates order with unique ID
2. **KHQR Request** → System calls Bakong API with order details
3. **QR Generated** → KHQR API returns QR code and deep link
4. **Display QR** → Frontend shows QR prominently
5. **Auto-Open Bank** → Deep link opens banking app (1 second delay)
6. **Customer Pays** → Scans QR in ABA/Wing/other banking app
7. **Payment Confirmed** → Backend receives webhook (future feature)
8. **Diamonds Delivered** → Automatically credited to player account

### **Payment Data Stored**

```javascript
{
  orderId: "12345",
  playerID: "1225368571",
  serverID: "11446",
  amount: 4.00,
  diamondAmount: 275,
  paymentMethod: "khqr",
  khqrBillNumber: "MLBB000012",  // Reference number
  khqrMd5Hash: "abc123...",       // Payment tracking
  khqrQRCode: "base64...",        // QR image data
  khqrDeeplink: "bakong://..."    // Deep link URL
}
```

---

## 🔒 Security Considerations

### **Guest Order Security**

- ✅ **Order IDs are unique** - UUID v4 format
- ✅ **Player verification** - MLBB account checked before order
- ✅ **Payment tracking** - KHQR MD5 hash for status checking
- ✅ **No sensitive data** - No passwords or payment methods stored
- ✅ **Temporary orders** - Can implement cleanup after completion

### **What's Protected**

- ❌ **Admin Panel** - Requires authentication (AdminRoute)
- ❌ **Order History** - Requires authentication (PrivateRoute)
- ❌ **User Management** - Admin only

---

## 🎨 UI/UX Changes

### **Before (With Login)**
```
Navigation: [Home] [Top Up] [My Orders] [Support] [Login] [Register]
Flow: Homepage → Login → Top Up → Payment
```

### **After (Guest Checkout)**
```
Navigation: [Home] [Top Up] [Support]
Flow: Homepage → Top Up → Payment (Direct!)
```

### **Removed Elements**

- Login form and page
- Register form and page
- "Create a new account" links
- User profile dropdowns
- "My Orders" navigation item
- Authentication prompts

---

## 🛠️ Backend Changes

### **OrdersController.cs**

```csharp
[HttpPost]
[AllowAnonymous]  // ← Added: Allows guest orders
public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
{
    // UserId is now nullable - guests don't have userId
    var order = await _orderService.CreateOrder(
        userId: null,  // ← Guest orders have no userId
        playerID: request.PlayerID,
        serverID: request.ServerID,
        productId: request.ProductId
    );
    
    return Ok(order);
}
```

### **Order Entity**

```csharp
public class Order
{
    public Guid OrderId { get; set; }
    public Guid? UserId { get; set; }  // ← Nullable for guests
    public string PlayerID { get; set; }  // ← Required
    public string ServerID { get; set; }  // ← Required
    // ... other fields
}
```

---

## 📊 Analytics & Tracking

### **Recommended Metrics to Track**

1. **Guest vs Registered Orders**
   - How many orders are from guests?
   - Conversion rate comparison

2. **Completion Rate**
   - % of guests who complete payment
   - Drop-off points in funnel

3. **Average Order Value**
   - Guest AOV vs registered user AOV

4. **Popular Packages**
   - Which packages do guests prefer?

---

## 🚀 Future Enhancements (Optional)

### **Optional Features to Add**

1. **Email Receipt** (Optional)
   - Ask for email after payment
   - Send receipt without requiring account

2. **Order Tracking by ID**
   - `/order-status/:orderId` page
   - Allow guests to check order status
   - No login required

3. **Phone Number (Optional)**
   - For SMS notifications
   - Still no account creation

4. **Guest-to-User Conversion**
   - After successful order, offer to create account
   - Link past orders to new account

---

## 📝 Testing Checklist

### **Verify Guest Checkout Works**

- [ ] Can access `/topup` directly without login
- [ ] Navigation shows: Home | Top Up | Support only
- [ ] No Login/Register buttons visible
- [ ] Can enter Player ID and Server ID
- [ ] Account verification works
- [ ] Can select diamond package
- [ ] Can proceed to payment without login prompt
- [ ] Order creates successfully (check backend logs)
- [ ] QR code displays correctly
- [ ] Banking app opens automatically (mobile)
- [ ] Payment has reference number (MLBB######)

### **Verify Login Still Works (For Admins)**

- [ ] Can access `/admin` (redirects to login if not authenticated)
- [ ] Admin can login at `/login`
- [ ] Admin dashboard accessible after login
- [ ] Order history works for registered users

---

## 🔧 Configuration

### **Backend: OrdersController.cs**

Location: `backend/MLBBTopUp.API/Controllers/OrdersController.cs`

```csharp
[HttpPost]
[AllowAnonymous]  // ← This attribute allows guest access
public async Task<IActionResult> CreateOrder(...)
```

### **Frontend: TopUp.js**

Location: `frontend/src/pages/TopUp.js`

```javascript
// Removed authentication check
const handleCreateOrder = async () => {
  // No login check here - direct order creation
  const orderResponse = await ordersAPI.create({ ... });
  // ...
}
```

### **Frontend: Navbar.js**

Location: `frontend/src/components/Navbar.js`

```javascript
// Login/Register buttons removed
{isAuthenticated() && (
  <div>...</div>  // Only shows if admin is logged in
)}
```

---

## 📖 Documentation for Customers

### **Customer-Facing Instructions**

**"How to Top-Up Without an Account"**

1. Go to the homepage
2. Click "Top Up Now"
3. Enter your MLBB Player ID and Server ID
4. Choose your diamond package
5. Review your order
6. Scan the QR code with your banking app
7. Complete payment in your banking app
8. Diamonds will be delivered within minutes!

**No registration needed!**

---

## ✅ Summary

### **What Changed**

✅ **Removed** - Login and Register buttons from navigation  
✅ **Removed** - My Orders link (for guests)  
✅ **Added** - `[AllowAnonymous]` to OrdersController.CreateOrder  
✅ **Updated** - Frontend to allow order creation without auth  
✅ **Simplified** - Navigation to: Home | Top Up | Support  

### **Customer Experience**

- **Before**: Homepage → Login → Top Up → Payment (4 steps)
- **After**: Homepage → Top Up → Payment (2 steps)

### **Security**

- Guest orders are tracked by Order ID
- No sensitive customer data stored
- Admin panel still protected
- Payment processing secure via KHQR

---

**Made with ❤️ for seamless customer experience**

*Last Updated: August 28, 2026*
