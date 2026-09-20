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

public class SupplierSettingsModel
{
    public string ActiveProvider { get; set; } = "FazerCards"; // "FazerCards" or "KhmerTopUp"
    public string Environment { get; set; } = "Production";    // "Production" or "Sandbox"
    public bool AutoDispatchOnPayment { get; set; } = true;
    public bool AutoFailoverEnabled { get; set; } = true;       // Automatic failover if primary provider balance is 0 or fails
    public string MerchantId { get; set; } = "peakmao007";
    public string ApiKey { get; set; } = "fc_5f79a0016d5d87bd1e83ea4f";
    public string FazerCardsApiKey { get; set; } = "fc_5f79a0016d5d87bd1e83ea4f";
    public List<FazerCardsTokenItem> FazerCardsTokens { get; set; } = new();
    public string KhmerTopUpApiKey { get; set; } = "kt_6d38a3a5940e970221cc62fa306ae96044736364";
    public string FazerCardsApiUrl { get; set; } = "https://api.fzr.cards/api/v2";
    public string KhmerTopUpApiUrl { get; set; } = "https://khmer-topup.com/api/v1/orders";
    public string WebhookUrl { get; set; } = "https://mlbb-backend-api.onrender.com/api/supplier/webhook";
    public decimal BalanceUSD { get; set; } = 18.50m;
    public decimal FazerCardsBalanceUSD { get; set; } = 18.50m;
    public decimal KhmerTopUpBalanceUSD { get; set; } = 1.45m;
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
