using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MLBBTopUp.Infrastructure.PaymentGateways;

/// <summary>
/// Mock payment gateway for testing purposes
/// Replace with actual payment gateway implementation (Stripe, PayPal, etc.)
/// </summary>
public class MockPaymentGateway : IPaymentGatewayClient
{
    private readonly ILogger<MockPaymentGateway> _logger;
    private readonly IConfiguration _configuration;

    public MockPaymentGateway(ILogger<MockPaymentGateway> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<PaymentResult> CreatePaymentAsync(decimal amount, string currency, string orderId)
    {
        _logger.LogInformation(
            "Mock Payment Gateway: Creating payment for Order {OrderId}, Amount: {Amount} {Currency}",
            orderId, amount, currency);

        // Simulate API call delay
        await Task.Delay(500);

        // Mock transaction ID
        var transactionId = $"MOCK-TXN-{DateTime.UtcNow:yyyyMMddHHmmss}-{orderId}";

        // In production, this would call actual payment gateway API
        // Example with Stripe:
        // var options = new PaymentIntentCreateOptions
        // {
        //     Amount = (long)(amount * 100),
        //     Currency = currency,
        //     Metadata = new Dictionary<string, string> { { "order_id", orderId } }
        // };
        // var service = new PaymentIntentService();
        // var paymentIntent = await service.CreateAsync(options);

        return new PaymentResult
        {
            Success = true,
            TransactionId = transactionId,
            PaymentUrl = $"https://mock-gateway.example.com/checkout/{transactionId}",
            Status = "Pending"
        };
    }

    public async Task<PaymentResult> GetPaymentStatusAsync(string transactionId)
    {
        _logger.LogInformation(
            "Mock Payment Gateway: Getting status for transaction {TransactionId}",
            transactionId);

        // Simulate API call delay
        await Task.Delay(300);

        // In production, query actual payment gateway
        // Example with Stripe:
        // var service = new PaymentIntentService();
        // var paymentIntent = await service.GetAsync(transactionId);

        return new PaymentResult
        {
            Success = true,
            TransactionId = transactionId,
            Status = "Completed" // Mock status
        };
    }

    public bool VerifyWebhookSignature(string payload, string signature)
    {
        _logger.LogInformation("Mock Payment Gateway: Verifying webhook signature");

        // In production, verify actual webhook signature
        // Example with Stripe:
        // try
        // {
        //     var webhookSecret = _configuration["PaymentGateway:WebhookSecret"];
        //     var stripeEvent = EventUtility.ConstructEvent(
        //         payload, 
        //         signature, 
        //         webhookSecret
        //     );
        //     return true;
        // }
        // catch (StripeException)
        // {
        //     return false;
        // }

        // For testing, always return true
        return true;
    }
}
