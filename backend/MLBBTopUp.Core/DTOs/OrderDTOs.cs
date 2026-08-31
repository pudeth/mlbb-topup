namespace MLBBTopUp.Core.DTOs;

public class CreateOrderRequest
{
    public string PlayerID { get; set; } = string.Empty;
    public string ServerID { get; set; } = string.Empty;
    public int? ProductId { get; set; }
    public int? CustomDiamondAmount { get; set; }
    public decimal? Price { get; set; }
    public decimal? Amount { get; set; }
    public string? Currency { get; set; } = "USD";
    public string? PaymentMethod { get; set; } = "khqr";
}

public class OrderResponse
{
    public int OrderId { get; set; }
    public int? UserId { get; set; }
    public string PlayerID { get; set; } = string.Empty;
    public string ServerID { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int DiamondAmount { get; set; }
    public decimal Amount { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public string TopupStatus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public PaymentResponse? Payment { get; set; }
}

public class OrderStatusResponse
{
    public int OrderId { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public string TopupStatus { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
