namespace MLBBTopUp.Core.Entities;

public class Payment
{
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string TransactionID { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Completed, Failed, Refunded
    public DateTime? PaidAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // KHQR specific fields
    public string? KHQRBillNumber { get; set; }
    public string? KHQRMd5Hash { get; set; }
    public string? KHQRQRCode { get; set; }
    public string? KHQRDeeplink { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;
}
