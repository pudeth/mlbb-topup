using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MLBBTopUp.Infrastructure.TopUpProviders;

/// <summary>
/// Mock MLBB top-up provider for testing purposes
/// Replace with actual provider implementation (UniPin, Codashop, etc.)
/// </summary>
public class MockTopUpProvider : ITopUpProviderClient
{
    private readonly ILogger<MockTopUpProvider> _logger;
    private readonly IConfiguration _configuration;

    public MockTopUpProvider(ILogger<MockTopUpProvider> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<TopUpResult> SendTopUpAsync(
        string playerId, 
        string serverId, 
        int diamondAmount, 
        string orderId)
    {
        _logger.LogInformation(
            "Mock Top-Up Provider: Sending {DiamondAmount} diamonds to Player {PlayerId} (Server: {ServerId})",
            diamondAmount, playerId, serverId);

        // Validate inputs
        if (string.IsNullOrWhiteSpace(playerId) || string.IsNullOrWhiteSpace(serverId))
        {
            return new TopUpResult
            {
                Success = false,
                ErrorMessage = "Invalid Player ID or Server ID"
            };
        }

        // Simulate API call delay
        await Task.Delay(2000);

        // Mock transaction ID
        var transactionId = $"TOPUP-{DateTime.UtcNow:yyyyMMddHHmmss}-{orderId}";

        // In production, call actual top-up provider API
        // Example:
        // var httpClient = new HttpClient();
        // httpClient.DefaultRequestHeaders.Add("X-API-Key", _configuration["TopUpProvider:ApiKey"]);
        // 
        // var request = new
        // {
        //     player_id = playerId,
        //     server_id = serverId,
        //     diamond_amount = diamondAmount,
        //     order_reference = orderId,
        //     callback_url = "https://yourapp.com/api/topup/callback"
        // };
        // 
        // var response = await httpClient.PostAsJsonAsync(
        //     _configuration["TopUpProvider:ApiUrl"] + "/topup", 
        //     request
        // );
        // 
        // if (!response.IsSuccessStatusCode)
        // {
        //     return new TopUpResult
        //     {
        //         Success = false,
        //         ErrorMessage = await response.Content.ReadAsStringAsync()
        //     };
        // }
        // 
        // var result = await response.Content.ReadFromJsonAsync<TopUpApiResponse>();

        _logger.LogInformation(
            "Mock Top-Up Provider: Successfully sent {DiamondAmount} diamonds (Transaction: {TransactionId})",
            diamondAmount, transactionId);

        return new TopUpResult
        {
            Success = true,
            TransactionId = transactionId,
            Status = "Completed"
        };
    }

    public async Task<TopUpStatusResult> GetTopUpStatusAsync(string transactionId)
    {
        _logger.LogInformation(
            "Mock Top-Up Provider: Getting status for transaction {TransactionId}",
            transactionId);

        // Simulate API call delay
        await Task.Delay(300);

        // In production, query actual provider API
        // Example:
        // var httpClient = new HttpClient();
        // httpClient.DefaultRequestHeaders.Add("X-API-Key", _configuration["TopUpProvider:ApiKey"]);
        // 
        // var response = await httpClient.GetAsync(
        //     _configuration["TopUpProvider:ApiUrl"] + $"/topup/status/{transactionId}"
        // );
        // 
        // var result = await response.Content.ReadFromJsonAsync<TopUpStatusResponse>();

        return new TopUpStatusResult
        {
            Status = "Completed",
            Message = "Diamonds delivered successfully",
            IsCompleted = true,
            IsFailed = false
        };
    }
}
