namespace MLBBTopUp.Infrastructure.PaymentGateways;

public interface IPaymentGatewayClient
{
    /// <summary>
    /// Create a payment transaction
    /// </summary>
    Task<PaymentResult> CreatePaymentAsync(decimal amount, string currency, string orderId);
    
    /// <summary>
    /// Get payment status from gateway
    /// </summary>
    Task<PaymentResult> GetPaymentStatusAsync(string transactionId);
    
    /// <summary>
    /// Verify webhook signature from payment gateway
    /// </summary>
    bool VerifyWebhookSignature(string payload, string signature);
}

public class PaymentResult
{
    public bool Success { get; set; }
    public string? TransactionId { get; set; }
    public string? PaymentUrl { get; set; }
    public string? Status { get; set; }
    public string? ErrorMessage { get; set; }
}
