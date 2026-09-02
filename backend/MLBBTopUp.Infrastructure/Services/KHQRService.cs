using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MLBBTopUp.Core.DTOs;
using MLBBTopUp.Core.Interfaces;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace MLBBTopUp.Infrastructure.Services;

public class KHQRPaymentResponse
{
    public bool Success { get; set; }
    public string BillNumber { get; set; } = string.Empty;
    public string QrCode { get; set; } = string.Empty;
    public string Md5Hash { get; set; } = string.Empty;
    public string? Deeplink { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string? QrImageUrl { get; set; }
    public string? Error { get; set; }
}

public class KHQRStatusResponse
{
    public string Md5Hash { get; set; } = string.Empty;
    public string Status { get; set; } = "UNPAID"; // UNPAID, PAID, FAILED
    public string? Warning { get; set; }
    public bool RateLimited { get; set; }
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
        _logger = logger;

        var rawUrl = configuration["KHQR:ApiUrl"] ?? configuration["KHQR__ApiUrl"] ?? "https://mlbb-khqr-api.onrender.com";
        rawUrl = rawUrl.Trim().TrimEnd('/');

        if (rawUrl.Contains(":5001") || rawUrl.Contains("localhost") || rawUrl.Contains("127.0.0.1"))
        {
            if (!rawUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase))
            {
                rawUrl = "http://" + rawUrl.Replace("https://", "");
            }
        }
        else if (!rawUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase) && !rawUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            rawUrl = "https://" + rawUrl;
        }

        _khqrApiUrl = rawUrl;
    }

    public static string CalculateEmvCoCrc16(string data)
    {
        ushort crc = 0xFFFF;
        ushort polynomial = 0x1021;
        byte[] bytes = Encoding.UTF8.GetBytes(data);

        foreach (byte b in bytes)
        {
            for (int i = 0; i < 8; i++)
            {
                bool bit = ((b >> (7 - i)) & 1) == 1;
                bool c15 = ((crc >> 15) & 1) == 1;
                crc <<= 1;
                if (c15 ^ bit)
                {
                    crc ^= polynomial;
                }
            }
        }
        return (crc & 0xFFFF).ToString("X4");
    }

    public static string GetMd5Hash(string input)
    {
        using var md5 = MD5.Create();
        byte[] bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
        var sb = new StringBuilder();
        foreach (var b in bytes)
        {
            sb.Append(b.ToString("x2"));
        }
        return sb.ToString();
    }

    public static (string qrCode, string md5Hash) GenerateEmvCoKhqr(
        string bakongId,
        string name,
        string city,
        decimal amount,
        string currency)
    {
        bool isKhr = currency.Equals("KHR", StringComparison.OrdinalIgnoreCase);
        string currencyCode = isKhr ? "116" : "840";
        decimal finalAmt = isKhr ? Math.Round(amount * 4100m) : amount;
        string amtStr = isKhr ? $"{finalAmt:F0}" : $"{finalAmt:F2}";

        var payload = new StringBuilder();
        payload.Append("000201"); // Tag 00: Format Indicator
        payload.Append("010212"); // Tag 01: Dynamic QR

        // Tag 29: Merchant Account Info
        string sub00 = $"00{bakongId.Length:D2}{bakongId}";
        string sub01 = $"01{name.Length:D2}{name}";
        string sub02 = "0206Bakong";
        string tag29Content = sub00 + sub01 + sub02;
        payload.Append("29").Append($"{tag29Content.Length:D2}").Append(tag29Content);

        payload.Append("52045999"); // Tag 52: MCC
        payload.Append("5303").Append(currencyCode); // Tag 53: Currency
        payload.Append("54").Append($"{amtStr.Length:D2}").Append(amtStr); // Tag 54: Amount
        payload.Append("5802KH"); // Tag 58: Country
        payload.Append("59").Append($"{name.Length:D2}").Append(name); // Tag 59: Merchant Name
        string cityStr = string.IsNullOrWhiteSpace(city) ? "Phnom Penh" : city;
        payload.Append("60").Append($"{cityStr.Length:D2}").Append(cityStr); // Tag 60: City

        // Tag 99: Bakong Expiration Timestamp (5 Minutes)
        long nowMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        long expireMs = nowMs + (5 * 60 * 1000);
        string createdStr = nowMs.ToString();
        string expireStr = expireMs.ToString();
        string subT00 = $"00{createdStr.Length:D2}{createdStr}";
        string subT01 = $"01{expireStr.Length:D2}{expireStr}";
        string tag99Content = subT00 + subT01;
        payload.Append("99").Append($"{tag99Content.Length:D2}").Append(tag99Content);

        payload.Append("6304"); // Tag 63: CRC Header

        string crc = CalculateEmvCoCrc16(payload.ToString());
        string fullKhqr = payload.ToString() + crc;
        string md5Hash = GetMd5Hash(fullKhqr);

        return (fullKhqr, md5Hash);
    }

    public async Task<KHQRPaymentResponse> CreatePaymentAsync(int orderId, decimal amount, string currency = "USD")
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

        try
        {
            HttpResponseMessage? response = null;
            try
            {
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                response = await _httpClient.PostAsync($"{_khqrApiUrl}/api/payment/create", content);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Primary KHQR URL {Url} failed, trying public fallback", _khqrApiUrl);
                var publicFallback = "https://mlbb-khqr-api.onrender.com/api/payment/create";
                var fallbackContent = new StringContent(json, Encoding.UTF8, "application/json");
                response = await _httpClient.PostAsync(publicFallback, fallbackContent);
            }

            if (response != null && response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<KHQRPaymentResponse>(responseBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (result != null && !string.IsNullOrWhiteSpace(result.Md5Hash))
                {
                    result.Success = true;
                    result.QrImageUrl = $"{_khqrApiUrl}/api/payment/qr/{result.Md5Hash}";
                    return result;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating KHQR payment for order {OrderId}", orderId);
        }

        // Direct authentic EMVCo standard KHQR generation matching Restaurant Management System
        var (realQr, realMd5) = GenerateEmvCoKhqr(
            "deth_peak3@aclb",
            "PuDeth Smart-PAY",
            "Phnom Penh",
            amount,
            currency
        );

        return new KHQRPaymentResponse
        {
            Success = true,
            BillNumber = billNumber,
            Md5Hash = realMd5,
            Amount = amount,
            Currency = currency,
            QrCode = realQr,
            Deeplink = $"https://bakong.nbc.org.kh/pay?md5={realMd5}",
            QrImageUrl = $"{_khqrApiUrl}/api/payment/qr/{realMd5}"
        };
    }

    public async Task<KHQRStatusResponse> CheckPaymentStatusAsync(string md5Hash)
    {
        // 1. Try Scorekhqr-bakong microservice
        try
        {
            HttpResponseMessage? response = null;
            try
            {
                response = await _httpClient.GetAsync($"{_khqrApiUrl}/api/payment/status/{md5Hash}");
            }
            catch
            {
                var publicFallback = $"https://mlbb-khqr-api.onrender.com/api/payment/status/{md5Hash}";
                response = await _httpClient.GetAsync(publicFallback);
            }

            if (response != null && response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<KHQRStatusResponse>(responseBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (result != null && result.Status.Equals("PAID", StringComparison.OrdinalIgnoreCase))
                {
                    return result;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Microservice status check notice for {Md5Hash}", md5Hash);
        }

        // 2. Direct NBC Bakong API verification matching Restaurant Management System
        try
        {
            var nbcUrl = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";
            var tokens = new[]
            {
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYzY4NGNhNTUwNTJmNDRjYiJ9LCJpYXQiOjE3ODcwNTkwNTIsImV4cCI6MTc5NDgzNTA1Mn0.IOaSl7-TRdyrTjWM7mQMaaaAUP0E7N7zgtX-AsPZPLE",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMmNhMWUwOGI1M2IxNGNmOCJ9LCJpYXQiOjE3ODgwODkzMDIsImV4cCI6MTc5NTg2NTMwMn0.TZw81eqJhAUIP7Cqg8Od8jlb9yjFvesCrdGU03E1JqM"
            };

            foreach (var tok in tokens)
            {
                using var msg = new HttpRequestMessage(HttpMethod.Post, nbcUrl);
                msg.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tok);
                msg.Content = new StringContent(JsonSerializer.Serialize(new { md5 = md5Hash }), Encoding.UTF8, "application/json");

                var nbcResp = await _httpClient.SendAsync(msg);
                if (nbcResp.IsSuccessStatusCode)
                {
                    var nbcJson = await nbcResp.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(nbcJson);
                    if (doc.RootElement.TryGetProperty("responseCode", out var codeProp) && codeProp.GetInt32() == 0)
                    {
                        return new KHQRStatusResponse { Md5Hash = md5Hash, Status = "PAID" };
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Direct NBC status check notice for {Md5Hash}", md5Hash);
        }

        return new KHQRStatusResponse
        {
            Md5Hash = md5Hash,
            Status = "UNPAID"
        };
    }

    public string GetQRImageUrl(string md5Hash)
    {
        return $"{_khqrApiUrl}/api/payment/qr/{md5Hash}";
    }
}
