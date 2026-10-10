using System.Text.Json.Serialization;

namespace MLBBTopUp.Core.DTOs;

public class ProductResponse
{
    public int ProductId { get; set; }
    public int DiamondAmount { get; set; }
    public decimal Price { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? CostPrice { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? ResellerPrice { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? ProfitAmount { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? ProfitMarginPct { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? ProviderPackageId { get; set; }

    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class CreateProductRequest
{
    public int DiamondAmount { get; set; }
    public decimal Price { get; set; }
    public decimal? CostPrice { get; set; }
    public decimal? ResellerPrice { get; set; }
    public int? ProviderPackageId { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class UpdateProductRequest
{
    public decimal? Price { get; set; }
    public decimal? CostPrice { get; set; }
    public decimal? ResellerPrice { get; set; }
    public int? ProviderPackageId { get; set; }
    public string? Status { get; set; }
    public string? Description { get; set; }
}

