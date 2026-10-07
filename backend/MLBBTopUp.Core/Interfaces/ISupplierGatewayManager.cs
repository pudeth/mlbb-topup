namespace MLBBTopUp.Core.Interfaces;

public class FazerCardsTokenItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N")[..8];
    public string Token { get; set; } = string.Empty;
    public string Name { get; set; } = "Token";
    public bool IsActive { get; set; } = false;
    public decimal? BalanceUSD { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CustomProviderItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N")[..8];
    public string Name { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Icon { get; set; } = "🌐";
    public string Badge { get; set; } = "CUSTOM";
    public string BadgeColor { get; set; } = "emerald";
    public string ApiUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string? MerchantId { get; set; }
    public decimal BalanceUSD { get; set; } = 0m;
    public string? DocsUrl { get; set; }
    public string? RefillUrl { get; set; }
    public string Category { get; set; } = "Custom Gateway";
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class SupplierSettingsModel
{
    public string ActiveProvider { get; set; } = "KhmerTopUp"; // "FazerCards", "KhmerTopUp", or custom id/name
    public string Environment { get; set; } = "Production";    // "Production" or "Sandbox"
    public bool AutoDispatchOnPayment { get; set; } = true;
    public bool AutoFailoverEnabled { get; set; } = true;       // Automatic failover if primary provider balance is 0 or fails
    public string MerchantId { get; set; } = "peakmao007";
    public string ApiKey { get; set; } = "kt_28c2640c86717199395d973670cf039a30ba2716";
    public string FazerCardsApiKey { get; set; } = "fc_5f79a0016d5d87bd1e83ea4f";
    public List<FazerCardsTokenItem> FazerCardsTokens { get; set; } = new();
    public List<CustomProviderItem> CustomProviders { get; set; } = new();
    public object? Providers { get; set; }
    public string KhmerTopUpApiKey { get; set; } = "kt_28c2640c86717199395d973670cf039a30ba2716";
    public string FazerCardsApiUrl { get; set; } = "https://api.fzr.cards/api/v2";
    public string KhmerTopUpApiUrl { get; set; } = "https://khmer-topup.com/api/v1/orders";
    public string WebhookUrl { get; set; } = "https://mlbb-backend-api.onrender.com/api/supplier/webhook";
    public decimal BalanceUSD { get; set; } = 3.0m;
    public decimal FazerCardsBalanceUSD { get; set; } = 0.01m;
    public decimal KhmerTopUpBalanceUSD { get; set; } = 3.0m;
    public string Status { get; set; } = "Connected & Active";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public interface ISupplierGatewayManager
{
    SupplierSettingsModel GetSettings();
    Task<SupplierSettingsModel> UpdateSettingsAsync(SupplierSettingsModel settings);
    Task<SupplierSettingsModel> SwitchProviderAsync(string targetProvider);
    Task<SupplierSettingsModel> RefreshBalancesAsync();
    Task<SupplierSettingsModel> AddFazerCardsTokenAsync(string token, string? name, bool setActive = true);
    Task<SupplierSettingsModel> SwitchFazerCardsTokenAsync(string idOrToken);
    Task<SupplierSettingsModel> DeleteFazerCardsTokenAsync(string id);
    string GetActiveProvider();
    string GetActiveApiKey();
    bool IsAutoDispatchEnabled();
}
