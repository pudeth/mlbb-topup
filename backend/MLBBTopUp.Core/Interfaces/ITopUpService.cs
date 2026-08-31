namespace MLBBTopUp.Core.Interfaces;

public class CheckAccountResult
{
    public bool Valid { get; set; }
    public string PlayerId { get; set; } = string.Empty;
    public string ServerId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? Country { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Message { get; set; }
}

public class TopUpExecutionResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public string? ErrorReason { get; set; }
}

public interface ITopUpService
{
    Task<CheckAccountResult> CheckAccountAsync(string playerId, string serverId);
    Task<TopUpExecutionResult> ProcessTopUpAsync(int orderId, string playerId, string serverId, int diamondAmount);
    Task<string> GetTopUpStatusAsync(string transactionId);
}

