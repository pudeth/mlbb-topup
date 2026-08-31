# Payment Gateway & Top-Up Provider Integration Guide

This guide explains how to integrate your payment gateway and MLBB top-up provider with the system.

## Table of Contents
1. [Payment Gateway Integration](#payment-gateway-integration)
2. [Top-Up Provider Integration](#top-up-provider-integration)
3. [Testing](#testing)
4. [Security Best Practices](#security-best-practices)

---

## Payment Gateway Integration

The payment flow works as follows:
1. Customer creates an order
2. System creates a payment record with a unique transaction ID
3. Customer is redirected to payment gateway
4. Payment gateway processes payment
5. Gateway sends webhook notification to your server
6. System verifies payment and updates order status
7. System triggers top-up delivery

### Supported Payment Methods

Configure your payment gateway to support:
- Credit/Debit Cards (Visa, Mastercard, etc.)
- PayPal
- GCash (Philippines)
- PayMaya (Philippines)
- Other local payment methods

### Configuration

Update `appsettings.json`:

```json
{
  "PaymentGateway": {
    "Provider": "Stripe",  // or "PayPal", "Xendit", etc.
    "ApiKey": "your-api-key",
    "SecretKey": "your-secret-key",
    "ApiUrl": "https://api.provider.com",
    "WebhookUrl": "https://yourapp.com/api/payments/webhook",
    "WebhookSecret": "your-webhook-secret"
  }
}
```

### Implementation Steps

#### 1. Create Payment Gateway Client

Create a new file: `backend/MLBBTopUp.Infrastructure/PaymentGateways/StripePaymentGateway.cs`

```csharp
public interface IPaymentGatewayClient
{
    Task<PaymentResult> CreatePaymentAsync(decimal amount, string currency, string orderId);
    Task<PaymentResult> GetPaymentStatusAsync(string transactionId);
    bool VerifyWebhookSignature(string payload, string signature);
}

public class StripePaymentGateway : IPaymentGatewayClient
{
    private readonly string _apiKey;
    private readonly string _webhookSecret;
    
    public StripePaymentGateway(IConfiguration configuration)
    {
        _apiKey = configuration["PaymentGateway:ApiKey"];
        _webhookSecret = configuration["PaymentGateway:WebhookSecret"];
    }
    
    public async Task<PaymentResult> CreatePaymentAsync(decimal amount, string currency, string orderId)
    {
        // Stripe implementation
        // var options = new PaymentIntentCreateOptions
        // {
        //     Amount = (long)(amount * 100), // Convert to cents
        //     Currency = currency,
        //     Metadata = new Dictionary<string, string>
        //     {
        //         { "order_id", orderId }
        //     }
        // };
        // var service = new PaymentIntentService();
        // var paymentIntent = await service.CreateAsync(options);
        
        return new PaymentResult
        {
            Success = true,
            TransactionId = "stripe_transaction_id",
            PaymentUrl = "https://checkout.stripe.com/..."
        };
    }
    
    public async Task<PaymentResult> GetPaymentStatusAsync(string transactionId)
    {
        // Query Stripe API for payment status
        return await Task.FromResult(new PaymentResult
        {
            Success = true,
            Status = "Completed"
        });
    }
    
    public bool VerifyWebhookSignature(string payload, string signature)
    {
        // Verify Stripe webhook signature
        // return EventUtility.ConstructEvent(payload, signature, _webhookSecret) != null;
        return true;
    }
}

public class PaymentResult
{
    public bool Success { get; set; }
    public string TransactionId { get; set; }
    public string PaymentUrl { get; set; }
    public string Status { get; set; }
    public string ErrorMessage { get; set; }
}
```

#### 2. Update PaymentService

Modify `PaymentService.cs` to use the gateway client:

```csharp
private readonly IPaymentGatewayClient _gatewayClient;

public async Task<PaymentResponse?> CreatePaymentAsync(CreatePaymentRequest request)
{
    var order = await _context.Orders.FindAsync(request.OrderId);
    if (order == null) return null;
    
    // Call payment gateway
    var gatewayResult = await _gatewayClient.CreatePaymentAsync(
        order.Amount,
        "USD",
        order.OrderId.ToString()
    );
    
    if (!gatewayResult.Success)
    {
        return null;
    }
    
    var payment = new Payment
    {
        OrderId = request.OrderId,
        PaymentMethod = request.PaymentMethod,
        TransactionID = gatewayResult.TransactionId,
        Amount = order.Amount,
        Status = "Pending",
        CreatedAt = DateTime.UtcNow
    };
    
    _context.Payments.Add(payment);
    await _context.SaveChangesAsync();
    
    return MapToResponse(payment);
}
```

#### 3. Handle Webhook Notifications

The webhook endpoint is already created in `PaymentsController.cs`. Update `PaymentService.ProcessPaymentWebhookAsync`:

```csharp
public async Task<bool> ProcessPaymentWebhookAsync(PaymentWebhookRequest request)
{
    // Verify webhook signature
    if (!_gatewayClient.VerifyWebhookSignature(request.Payload, request.Signature))
    {
        return false;
    }
    
    var payment = await _context.Payments
        .Include(p => p.Order)
        .FirstOrDefaultAsync(p => p.TransactionID == request.TransactionID);
        
    if (payment == null) return false;
    
    payment.Status = request.Status;
    
    if (request.Status == "Completed")
    {
        payment.PaidAt = DateTime.UtcNow;
        await _orderService.UpdateOrderPaymentStatusAsync(payment.OrderId, "Paid");
        
        // Automatically trigger top-up
        await _topUpService.ProcessTopUpAsync(
            payment.OrderId,
            payment.Order.PlayerID,
            payment.Order.ServerID,
            payment.Order.Product.DiamondAmount
        );
    }
    else if (request.Status == "Failed")
    {
        await _orderService.UpdateOrderPaymentStatusAsync(payment.OrderId, "Failed");
    }
    
    await _context.SaveChangesAsync();
    return true;
}
```

### Popular Payment Gateway Examples

#### Stripe
- Website: https://stripe.com
- Docs: https://stripe.com/docs/api
- NuGet: `Stripe.net`

#### PayPal
- Website: https://developer.paypal.com
- Docs: https://developer.paypal.com/docs/api/overview/
- NuGet: `PayPalCheckoutSdk`

#### Xendit (Southeast Asia)
- Website: https://xendit.co
- Docs: https://developers.xendit.co/api-reference/
- SDK: HTTP client

#### Razorpay (India)
- Website: https://razorpay.com
- Docs: https://razorpay.com/docs/api/
- NuGet: `Razorpay`

---

## Top-Up Provider Integration

### How Top-Up Works

1. Payment is confirmed
2. System calls top-up provider API with:
   - Player ID
   - Server ID
   - Diamond amount
   - Order ID
3. Provider processes the top-up
4. Provider sends diamonds to player's account
5. Provider sends confirmation webhook
6. System marks order as completed

### Configuration

Update `appsettings.json`:

```json
{
  "TopUpProvider": {
    "Provider": "UniPin",  // or your provider name
    "ApiKey": "your-api-key",
    "ApiUrl": "https://api.topupprovider.com",
    "WebhookSecret": "your-webhook-secret"
  }
}
```

### Implementation Steps

#### 1. Create Top-Up Provider Client

Create: `backend/MLBBTopUp.Infrastructure/TopUpProviders/MLBBTopUpClient.cs`

```csharp
public interface ITopUpProviderClient
{
    Task<TopUpResult> SendTopUpAsync(string playerId, string serverId, int diamondAmount, string orderId);
    Task<TopUpStatus> GetTopUpStatusAsync(string transactionId);
}

public class MLBBTopUpClient : ITopUpProviderClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _apiUrl;
    
    public MLBBTopUpClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["TopUpProvider:ApiKey"];
        _apiUrl = configuration["TopUpProvider:ApiUrl"];
        
        _httpClient.BaseAddress = new Uri(_apiUrl);
        _httpClient.DefaultRequestHeaders.Add("X-API-Key", _apiKey);
    }
    
    public async Task<TopUpResult> SendTopUpAsync(
        string playerId, 
        string serverId, 
        int diamondAmount, 
        string orderId)
    {
        var request = new
        {
            player_id = playerId,
            server_id = serverId,
            diamond_amount = diamondAmount,
            order_reference = orderId,
            callback_url = "https://yourapp.com/api/topup/callback"
        };
        
        var response = await _httpClient.PostAsJsonAsync("/topup", request);
        
        if (!response.IsSuccessStatusCode)
        {
            return new TopUpResult
            {
                Success = false,
                ErrorMessage = await response.Content.ReadAsStringAsync()
            };
        }
        
        var result = await response.Content.ReadFromJsonAsync<TopUpApiResponse>();
        
        return new TopUpResult
        {
            Success = true,
            TransactionId = result.transaction_id,
            Status = result.status
        };
    }
    
    public async Task<TopUpStatus> GetTopUpStatusAsync(string transactionId)
    {
        var response = await _httpClient.GetAsync($"/topup/status/{transactionId}");
        var result = await response.Content.ReadFromJsonAsync<TopUpStatusResponse>();
        
        return new TopUpStatus
        {
            Status = result.status,
            Message = result.message
        };
    }
}

public class TopUpResult
{
    public bool Success { get; set; }
    public string TransactionId { get; set; }
    public string Status { get; set; }
    public string ErrorMessage { get; set; }
}

public class TopUpStatus
{
    public string Status { get; set; }
    public string Message { get; set; }
}
```

#### 2. Update TopUpService

Modify `TopUpService.cs`:

```csharp
private readonly ITopUpProviderClient _providerClient;

public async Task<bool> ProcessTopUpAsync(
    int orderId, 
    string playerId, 
    string serverId, 
    int diamondAmount)
{
    try
    {
        await _orderService.UpdateOrderTopupStatusAsync(orderId, "Processing");
        
        var result = await _providerClient.SendTopUpAsync(
            playerId,
            serverId,
            diamondAmount,
            orderId.ToString()
        );
        
        if (result.Success)
        {
            await _orderService.UpdateOrderTopupStatusAsync(orderId, "Completed");
            return true;
        }
        else
        {
            _logger.LogError("Top-up failed for order {OrderId}: {Error}", 
                orderId, result.ErrorMessage);
            await _orderService.UpdateOrderTopupStatusAsync(orderId, "Failed");
            return false;
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error processing top-up for order {OrderId}", orderId);
        await _orderService.UpdateOrderTopupStatusAsync(orderId, "Failed");
        return false;
    }
}
```

### Popular MLBB Top-Up Providers

#### UniPin
- Website: https://www.unipin.com
- Focus: Southeast Asia
- Supports: MLBB, Mobile games

#### Codashop
- Website: https://www.codashop.com
- Focus: Southeast Asia, LATAM
- Supports: MLBB, Multiple games

#### Smile.One
- Website: https://www.smile.one
- Focus: Southeast Asia
- Supports: MLBB, Gaming credits

#### SeaGM
- Website: https://www.seagm.com
- Focus: Global
- Supports: Multiple games

**Note:** You need to apply for a reseller/API account with these providers.

---

## Testing

### Test Mode Configuration

Most providers offer test/sandbox environments:

```json
{
  "PaymentGateway": {
    "TestMode": true,
    "TestApiKey": "test_key_here"
  },
  "TopUpProvider": {
    "TestMode": true,
    "TestApiKey": "test_key_here"
  }
}
```

### Manual Testing Steps

1. **Test Payment Flow:**
   ```bash
   # Create order
   POST /api/orders
   
   # Create payment
   POST /api/payments
   
   # Simulate webhook
   POST /api/payments/webhook
   ```

2. **Test Top-Up Flow:**
   ```bash
   # Process top-up (admin)
   POST /api/admin/orders/{orderId}/process-topup
   ```

3. **Verify Status:**
   ```bash
   GET /api/orders/{orderId}/status
   ```

### Automated Testing

Create integration tests:

```csharp
[Fact]
public async Task ProcessPayment_ShouldUpdateOrderStatus()
{
    // Arrange
    var order = await CreateTestOrder();
    var payment = await CreateTestPayment(order.OrderId);
    
    // Act
    var webhook = new PaymentWebhookRequest
    {
        TransactionID = payment.TransactionID,
        Status = "Completed"
    };
    await _paymentService.ProcessPaymentWebhookAsync(webhook);
    
    // Assert
    var updatedOrder = await _orderService.GetOrderByIdAsync(order.OrderId);
    Assert.Equal("Paid", updatedOrder.PaymentStatus);
}
```

---

## Security Best Practices

### 1. API Key Security

✅ **DO:**
- Store API keys in environment variables or Azure Key Vault
- Use different keys for development and production
- Rotate keys regularly
- Restrict API key permissions

❌ **DON'T:**
- Commit API keys to source control
- Share keys via email or chat
- Use production keys in development

### 2. Webhook Validation

Always verify webhook signatures:

```csharp
public bool VerifyWebhookSignature(string payload, string signature)
{
    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_webhookSecret));
    var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
    var computedSignature = Convert.ToBase64String(hash);
    return computedSignature == signature;
}
```

### 3. HTTPS Only

Ensure all API calls and webhooks use HTTPS:

```csharp
services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
    options.HttpsPort = 443;
});
```

### 4. Rate Limiting

Implement rate limiting for API endpoints:

```csharp
services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("api", config =>
    {
        config.Window = TimeSpan.FromMinutes(1);
        config.PermitLimit = 10;
    });
});
```

### 5. Logging & Monitoring

Log all payment and top-up transactions:

```csharp
_logger.LogInformation(
    "Payment processed: OrderId={OrderId}, Amount={Amount}, Status={Status}",
    orderId, amount, status);
```

### 6. Idempotency

Ensure duplicate webhooks don't cause issues:

```csharp
if (payment.Status == "Completed")
{
    // Already processed, return success
    return true;
}
```

---

## Support

For integration support:
- Check provider documentation
- Contact provider support
- Review error logs
- Test in sandbox environment first

## Next Steps

1. Sign up for payment gateway account
2. Sign up for top-up provider account
3. Implement gateway client
4. Implement provider client
5. Test in sandbox
6. Deploy to production
7. Monitor transactions
