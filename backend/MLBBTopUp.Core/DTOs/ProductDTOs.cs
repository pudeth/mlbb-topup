namespace MLBBTopUp.Core.DTOs;

public class ProductResponse
{
    public int ProductId { get; set; }
    public int DiamondAmount { get; set; }
    public decimal Price { get; set; }
    public decimal CostPrice { get; set; }
    public decimal ResellerPrice { get; set; }
    public decimal ProfitAmount { get; set; }
    public decimal ProfitMarginPct { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class CreateProductRequest
{
    public int DiamondAmount { get; set; }
    public decimal Price { get; set; }
    public decimal? CostPrice { get; set; }
    public decimal? ResellerPrice { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class UpdateProductRequest
{
    public decimal? Price { get; set; }
    public decimal? CostPrice { get; set; }
    public decimal? ResellerPrice { get; set; }
    public string? Status { get; set; }
    public string? Description { get; set; }
}

