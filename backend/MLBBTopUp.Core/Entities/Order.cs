namespace MLBBTopUp.Core.Entities;

public class Order
{
    public int OrderId { get; set; }
    public int? UserId { get; set; }
    public string PlayerID { get; set; } = string.Empty;
    public string ServerID { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Failed
    public string TopupStatus { get; set; } = "Pending"; // Pending, Processing, Completed, Failed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public User? User { get; set; }
    public Product Product { get; set; } = null!;
    public Payment? Payment { get; set; }
}
