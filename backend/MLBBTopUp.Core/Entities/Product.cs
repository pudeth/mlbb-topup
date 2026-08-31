namespace MLBBTopUp.Core.Entities;

public class Product
{
    public int ProductId { get; set; }
    public int DiamondAmount { get; set; }
    public decimal Price { get; set; } // Customer / Retail Price
    public decimal CostPrice { get; set; } // Wholesale / Upstream Supplier Cost
    public decimal ResellerPrice { get; set; } // Reseller / Agent Wholesale Price
    public string Status { get; set; } = "Active"; // Active or Inactive
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

