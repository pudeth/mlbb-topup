using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.API.Middleware;

public class HybridEncryptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<HybridEncryptionMiddleware> _logger;

    private static readonly string[] WhitelistedPaths = new[]
    {
        "/swagger",
        "/api/crypto/public-key",
        "/api/payway/callback",
        "/api/telegram/webhook",
        "/api/supplier/webhook",
        "/favicon.ico"
    };

    public HybridEncryptionMiddleware(RequestDelegate next, ILogger<HybridEncryptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ICryptoService cryptoService)
    {
        var path = context.Request.Path.Value ?? "";

        // Skip CORS pre-flight, health check root, and whitelisted endpoints
        if (context.Request.Method == "OPTIONS" || 
            path == "/" || 
            WhitelistedPaths.Any(p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase)))
        {
            await _next(context);
            return;
        }

        byte[]? aesKey = null;

        // 1. Check for header-based encrypted AES key (used for GET/DELETE or header-mode requests)
        if (context.Request.Headers.TryGetValue("X-Encrypted-Key", out var encKeyHeader) && 
            !string.IsNullOrWhiteSpace(encKeyHeader))
        {
            try
            {
                aesKey = cryptoService.DecryptAesKeyWithRsa(encKeyHeader.ToString());
                context.Items["AesKey"] = aesKey;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[HybridEncryption] Failed to decrypt X-Encrypted-Key header");
            }
        }

        // 2. Check for body-based encrypted payload (used for POST/PUT/PATCH requests)
        if (context.Request.ContentLength > 0 &&
            (context.Request.ContentType?.Contains("application/json", StringComparison.OrdinalIgnoreCase) == true ||
             context.Request.ContentType?.Contains("text/plain", StringComparison.OrdinalIgnoreCase) == true))
        {
            context.Request.EnableBuffering();
            using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
            var bodyText = await reader.ReadToEndAsync();
            context.Request.Body.Position = 0;

            if (!string.IsNullOrWhiteSpace(bodyText) && bodyText.TrimStart().StartsWith("{"))
            {
                try
                {
                    using var doc = JsonDocument.Parse(bodyText);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("_enc", out var encProp) && encProp.GetBoolean())
                    {
                        var keyStr = root.GetProperty("key").GetString();
                        var ivStr = root.GetProperty("iv").GetString();
                        var dataStr = root.GetProperty("data").GetString();

                        if (!string.IsNullOrEmpty(keyStr) && !string.IsNullOrEmpty(ivStr) && !string.IsNullOrEmpty(dataStr))
                        {
                            aesKey = cryptoService.DecryptAesKeyWithRsa(keyStr);
                            context.Items["AesKey"] = aesKey;

                            var iv = Convert.FromBase64String(ivStr);
                            var cipherBytes = Convert.FromBase64String(dataStr);
                            var plainBytes = cryptoService.DecryptAes(cipherBytes, aesKey, iv);

                            // Replace request body with decrypted plaintext stream
                            var memoryStream = new MemoryStream(plainBytes);
                            context.Request.Body = memoryStream;
                            context.Request.ContentLength = plainBytes.Length;
                            context.Request.ContentType = "application/json";
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[HybridEncryption] Failed to parse/decrypt encrypted request body");
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{\"success\":false,\"message\":\"Invalid encrypted payload\"}");
                    return;
                }
            }
        }

        // 3. If no encryption is requested/present, proceed normally
        if (aesKey == null)
        {
            await _next(context);
            return;
        }

        // 4. Intercept and encrypt response
        var originalBodyStream = context.Response.Body;
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        try
        {
            await _next(context);

            responseBody.Seek(0, SeekOrigin.Begin);
            var responseBytes = responseBody.ToArray();

            // Only encrypt if we have a valid response and client requested encryption
            if (responseBytes.Length > 0 && context.Response.StatusCode != StatusCodes.Status204NoContent)
            {
                var responseIv = RandomNumberGenerator.GetBytes(16);
                var encryptedBytes = cryptoService.EncryptAes(responseBytes, aesKey, responseIv);

                var responsePayload = new
                {
                    _enc = true,
                    iv = Convert.ToBase64String(responseIv),
                    data = Convert.ToBase64String(encryptedBytes)
                };

                var jsonResponse = JsonSerializer.Serialize(responsePayload);
                var encryptedUtf8Bytes = Encoding.UTF8.GetBytes(jsonResponse);

                context.Response.Headers["Content-Type"] = "application/json; charset=utf-8";
                context.Response.Headers["X-Encrypted"] = "1";
                context.Response.Headers.Remove("Content-Length");

                await originalBodyStream.WriteAsync(encryptedUtf8Bytes, 0, encryptedUtf8Bytes.Length);
            }
            else
            {
                await responseBody.CopyToAsync(originalBodyStream);
            }
        }
        finally
        {
            context.Response.Body = originalBodyStream;
        }
    }
}
