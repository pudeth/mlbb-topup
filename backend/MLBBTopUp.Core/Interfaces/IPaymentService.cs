using MLBBTopUp.Core.DTOs;

namespace MLBBTopUp.Core.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponse?> CreatePaymentAsync(CreatePaymentRequest request);
    Task<PaymentResponse?> GetPaymentByOrderIdAsync(int orderId);
    Task<bool> ProcessPaymentWebhookAsync(PaymentWebhookRequest request);
    Task<bool> VerifyPaymentAsync(int orderId);
}
