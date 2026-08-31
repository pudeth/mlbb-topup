using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MLBBTopUp.Infrastructure.Services;

public class KHQRPaymentResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("bill_number")]
    public string? BillNumber { get; set; }

    [JsonPropertyName("qr_code")]
    public string? QrCode { get; set; }

    [JsonPropertyName("md5_hash")]
    public string? Md5Hash { get; set; }

    [JsonPropertyName("deeplink")]
    public string? Deeplink { get; set; }

    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }

    [JsonPropertyName("currency")]
    public string? Currency { get; set; }

    [JsonPropertyName("qr_image_url")]
    public string? QrImageUrl { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

public class KHQRStatusResponse
{
    [JsonPropertyName("md5_hash")]
    public string? Md5Hash { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("rate_limited")]
    public bool RateLimited { get; set; }

    [JsonPropertyName("warning")]
    public string? Warning { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

public interface IKHQRService
{
    Task<KHQRPaymentResponse> CreatePaymentAsync(int orderId, decimal amount, string currency = "USD");
    Task<KHQRStatusResponse> CheckPaymentStatusAsync(string md5Hash);
    string GetQRImageUrl(string md5Hash);
}

public class KHQRService : IKHQRService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<KHQRService> _logger;
    private readonly string _khqrApiUrl;

    public KHQRService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<KHQRService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        var rawUrl = configuration["KHQR:ApiUrl"] ?? "http://localhost:5001";
        if (!rawUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase) && !rawUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            rawUrl = "https://" + rawUrl;
        }
        _khqrApiUrl = rawUrl.TrimEnd('/');
    }

    public async Task<KHQRPaymentResponse> CreatePaymentAsync(int orderId, decimal amount, string currency = "USD")
    {
        try
        {
            var billNumber = $"MLBB{orderId:D6}";
            
            var requestData = new
            {
                amount = amount,
                currency = currency,
                phone = "85512345678",
                bill_number = billNumber
            };

            var json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _logger.LogInformation("Creating KHQR payment for order {OrderId}, amount: {Amount} {Currency}", 
                orderId, amount, currency);

            var response = await _httpClient.PostAsync($"{_khqrApiUrl}/api/payment/create", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("KHQR API error: {StatusCode} - {Response}", 
                    response.StatusCode, responseBody);
                
                return new KHQRPaymentResponse
                {
                    Success = false,
                    Error = $"Payment service error: {response.StatusCode}"
                };
            }

            var result = JsonSerializer.Deserialize<KHQRPaymentResponse>(responseBody, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result != null)
            {
                result.QrImageUrl = $"{_khqrApiUrl}{result.QrImageUrl}";
                _logger.LogInformation("KHQR payment created successfully: {Md5Hash}", result.Md5Hash);
            }

            return result ?? new KHQRPaymentResponse { Success = false, Error = "Invalid response" };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating KHQR payment for order {OrderId}", orderId);
            return new KHQRPaymentResponse
            {
                Success = false,
                Error = ex.Message
            };
        }
    }

    public async Task<KHQRStatusResponse> CheckPaymentStatusAsync(string md5Hash)
    {
        try
        {
            _logger.LogInformation("Checking KHQR payment status for {Md5Hash}", md5Hash);

            var response = await _httpClient.GetAsync($"{_khqrApiUrl}/api/payment/status/{md5Hash}");
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("KHQR status check error: {StatusCode} - {Response}", 
                    response.StatusCode, responseBody);
                
                return new KHQRStatusResponse
                {
                    Md5Hash = md5Hash,
                    Status = "ERROR",
                    Error = $"Status check error: {response.StatusCode}"
                };
            }

            var result = JsonSerializer.Deserialize<KHQRStatusResponse>(responseBody, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            _logger.LogInformation("KHQR payment status for {Md5Hash}: {Status}", md5Hash, result?.Status);

            return result ?? new KHQRStatusResponse { Md5Hash = md5Hash, Status = "UNKNOWN" };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking KHQR payment status for {Md5Hash}", md5Hash);
            return new KHQRStatusResponse
            {
                Md5Hash = md5Hash,
                Status = "ERROR",
                Error = ex.Message
            };
        }
    }

    public string GetQRImageUrl(string md5Hash)
    {
        return $"{_khqrApiUrl}/api/payment/qr/{md5Hash}";
    }
}
