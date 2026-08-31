using System.Text.Json.Serialization;

namespace MLBBTopUp.Core.DTOs;

public class CreatePaymentRequest
{
    [JsonPropertyName("orderId")]
    public int OrderId { get; set; }

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; set; } = string.Empty;

    [JsonPropertyName("currency")]
    public string? Currency { get; set; } = "USD";
}

public class PaymentResponse
{
    [JsonPropertyName("paymentId")]
    public int PaymentId { get; set; }

    [JsonPropertyName("orderId")]
    public int OrderId { get; set; }

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; set; } = string.Empty;

    [JsonPropertyName("transactionId")]
    public string TransactionID { get; set; } = string.Empty;

    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = "USD";

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("paidAt")]
    public DateTime? PaidAt { get; set; }
    
    // KHQR specific fields
    [JsonPropertyName("khqrBillNumber")]
    public string? KHQRBillNumber { get; set; }

    [JsonPropertyName("khqrMd5Hash")]
    public string? KHQRMd5Hash { get; set; }

    [JsonPropertyName("khqrQRImageUrl")]
    public string? KHQRQRImageUrl { get; set; }

    [JsonPropertyName("khqrDeeplink")]
    public string? KHQRDeeplink { get; set; }

    [JsonPropertyName("khqrQRCode")]
    public string? KHQRQRCode { get; set; }
}

public class PaymentWebhookRequest
{
    public string TransactionID { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Signature { get; set; } = string.Empty;
}
