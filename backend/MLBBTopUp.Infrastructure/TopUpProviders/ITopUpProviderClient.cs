namespace MLBBTopUp.Infrastructure.TopUpProviders;

public interface ITopUpProviderClient
{
    /// <summary>
    /// Send top-up request to provider
    /// </summary>
    Task<TopUpResult> SendTopUpAsync(string playerId, string serverId, int diamondAmount, string orderId);
    
    /// <summary>
    /// Get top-up status from provider
    /// </summary>
    Task<TopUpStatusResult> GetTopUpStatusAsync(string transactionId);
}

public class TopUpResult
{
    public bool Success { get; set; }
    public string? TransactionId { get; set; }
    public string? Status { get; set; }
    public string? ErrorMessage { get; set; }
}

public class TopUpStatusResult
{
    public string Status { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public bool IsFailed { get; set; }
}
