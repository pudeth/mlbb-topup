using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MLBBTopUp.Core.Interfaces;
using System.Text;
using System.Text.Json;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class TelegramController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ITopUpService _topUpService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<TelegramController> _logger;

    public TelegramController(
        IOrderService orderService,
        ITopUpService topUpService,
        IConfiguration configuration,
        ILogger<TelegramController> logger)
    {
        _orderService = orderService;
        _topUpService = topUpService;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook([FromBody] JsonElement update)
    {
        var botToken = _configuration["Telegram:BotToken"] ?? "8516986555:AAH3enGgrbjWPKnQRPwXRQHKVfGgqiQ2Rhw";
        var topicId = _configuration["Telegram:TopicId"] ?? "35";

        try
        {
            // 1. Handle Callback Query (Inline Button Click by Admin)
            if (update.TryGetProperty("callback_query", out var cb))
            {
                var cbId = cb.TryGetProperty("id", out var idProp) ? idProp.GetString() : null;
                var cbData = cb.TryGetProperty("data", out var dataProp) ? dataProp.GetString() : string.Empty;
                var fromUser = "Admin";
                if (cb.TryGetProperty("from", out var fromProp) && fromProp.TryGetProperty("first_name", out var fnProp))
                {
                    fromUser = fnProp.GetString() ?? "Admin";
                }

                long? chatId = null;
                int? messageId = null;
                if (cb.TryGetProperty("message", out var msgProp))
                {
                    if (msgProp.TryGetProperty("message_id", out var mIdProp))
                        messageId = mIdProp.GetInt32();
                    if (msgProp.TryGetProperty("chat", out var chatProp) && chatProp.TryGetProperty("id", out var cIdProp))
                        chatId = cIdProp.GetInt64();
                }

                _logger.LogInformation("Telegram callback received from {Admin}: {Data}", fromUser, cbData);

                // If already processed
                if (cbData == "done")
                {
                    if (!string.IsNullOrEmpty(cbId))
                    {
                        await AnswerCallbackQueryAsync(botToken, cbId, "ℹ️ Order has already been approved and delivered.", showAlert: true);
                    }
                    return Ok(new { ok = true });
                }

                // Handle Confirm Approval: confirm_{orderId}_{md5}
                if (!string.IsNullOrEmpty(cbData) && cbData.StartsWith("confirm_"))
                {
                    var parts = cbData.Split('_');
                    var orderIdStr = parts.Length > 1 ? parts[1] : "0";
                    var md5 = parts.Length > 2 ? parts[2] : string.Empty;

                    // Answer Telegram callback IMMEDIATELY so the button doesn't spin or show error!
                    if (!string.IsNullOrEmpty(cbId))
                    {
                        await AnswerCallbackQueryAsync(botToken, cbId, $"🎉 Order #{orderIdStr} APPROVED! Processing diamonds...", showAlert: true);
                    }

                    if (int.TryParse(orderIdStr, out int orderId))
                    {
                        // 1. Mark order as Paid
                        await _orderService.UpdateOrderPaymentStatusAsync(orderId, "Paid");

                        // 2. Load order details
                        var order = await _orderService.GetOrderByIdAsync(orderId);
                        if (order != null)
                        {
                            // 3. Dispatch diamond delivery
                            var topupRes = await _topUpService.ProcessTopUpAsync(order.OrderId, order.PlayerID, order.ServerID, order.DiamondAmount);
                            if (topupRes.Success)
                            {
                                await _orderService.UpdateOrderTopupStatusAsync(order.OrderId, "Completed");
                            }
                            else
                            {
                                var err = (topupRes.ErrorReason ?? topupRes.Message ?? "").ToLower();
                                var isLowBalance = err.Contains("insufficient") || err.Contains("balance") || err.Contains("funds") || err.Contains("fzr.cards") || err.Contains("wallet");
                                await _orderService.UpdateOrderTopupStatusAsync(order.OrderId, isLowBalance ? "AwaitingBalance" : "Failed");
                            }

                            // 4. Update the button on Telegram to [✅ APPROVED & PAID (Admin)]
                            if (chatId.HasValue && messageId.HasValue)
                            {
                                await EditMessageReplyMarkupAsync(botToken, chatId.Value, messageId.Value, $"✅ APPROVED & PAID ({fromUser})");
                            }

                            // 5. Send rich confirmation message to Topic 35
                            var totalKhr = Math.Round(order.Amount * 4100m);
                            var customerIdText = order.UserId.HasValue ? $"#{order.UserId.Value}" : $"Guest #{order.OrderId}";
                            var playerName = !string.IsNullOrWhiteSpace(order.AccountName) ? order.AccountName : "Player";
                            var gameTitle = !string.IsNullOrWhiteSpace(order.GameName) ? order.GameName : "Mobile Legends: Bang Bang";

                            var confirmMsg = $"✅ <b>ORDER #{order.OrderId} APPROVED & PAID!</b>\n" +
                                             $"━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                                             $"👤 <b>Approved by:</b> {EscapeHtml(fromUser)}\n" +
                                             $"🏷️ <b>Game:</b> {EscapeHtml(gameTitle)}\n" +
                                             $"👤 <b>Account Player:</b> <b>{EscapeHtml(playerName)}</b>\n" +
                                             $"🆔 <b>Player ID:</b> <code>{EscapeHtml(order.PlayerID)}</code> (Zone {EscapeHtml(order.ServerID)})\n" +
                                             $"👤 <b>Customer ID:</b> <code>{customerIdText}</code>\n" +
                                             $"💎 <b>Diamonds:</b> {order.DiamondAmount} 💎\n" +
                                             $"💰 <b>Amount:</b> ${order.Amount:F2} USD ({totalKhr:N0} ៛)\n" +
                                             $"⚡ <b>Delivery:</b> {(topupRes.Success ? "COMPLETED ✅" : "AWAITING BALANCE ⚠️")}\n" +
                                             $"⏰ <b>Timestamp:</b> {DateTime.Now:dd MMM yyyy, HH:mm:ss}\n" +
                                             $"━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                                             $"⚡ <b>Customer screen transitioned to [PAID SUCCESS]!</b>";

                            await SendTelegramAsync(botToken, chatId?.ToString() ?? _configuration["Telegram:ChatId"] ?? "-1004398577975", topicId, confirmMsg);
                        }
                    }

                    return Ok(new { ok = true });
                }

                // Handle Check Bakong: check_{orderId}_{md5}
                if (!string.IsNullOrEmpty(cbData) && cbData.StartsWith("check_"))
                {
                    var parts = cbData.Split('_');
                    var orderIdStr = parts.Length > 1 ? parts[1] : "0";
                    if (int.TryParse(orderIdStr, out int orderId))
                    {
                        var order = await _orderService.GetOrderByIdAsync(orderId);
                        var status = order?.PaymentStatus ?? "Pending";
                        if (!string.IsNullOrEmpty(cbId))
                        {
                            await AnswerCallbackQueryAsync(botToken, cbId, $"🔍 Order #{orderIdStr} Status: {status}", showAlert: true);
                        }
                    }
                    return Ok(new { ok = true });
                }
            }

            return Ok(new { ok = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Telegram webhook error: {Message}", ex.Message);
            return Ok(new { ok = false, error = ex.Message });
        }
    }

    [HttpGet("set-webhook")]
    [HttpPost("set-webhook")]
    public async Task<IActionResult> SetWebhook([FromQuery] string? url = null)
    {
        var botToken = _configuration["Telegram:BotToken"] ?? "8516986555:AAH3enGgrbjWPKnQRPwXRQHKVfGgqiQ2Rhw";
        var webhookUrl = url ?? "https://mlbb-backend-api.onrender.com/api/telegram/webhook";

        using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
        var setUrl = $"https://api.telegram.org/bot{botToken}/setWebhook?url={Uri.EscapeDataString(webhookUrl)}&drop_pending_updates=false&allowed_updates=[\"message\",\"callback_query\"]";
        var res = await httpClient.GetStringAsync(setUrl);

        return Content(res, "application/json");
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var botToken = _configuration["Telegram:BotToken"] ?? "8516986555:AAH3enGgrbjWPKnQRPwXRQHKVfGgqiQ2Rhw";
        using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };

        var meJson = await httpClient.GetStringAsync($"https://api.telegram.org/bot{botToken}/getMe");
        var webhookJson = await httpClient.GetStringAsync($"https://api.telegram.org/bot{botToken}/getWebhookInfo");

        return Ok(new
        {
            bot = JsonDocument.Parse(meJson).RootElement,
            webhook = JsonDocument.Parse(webhookJson).RootElement
        });
    }

    private static async Task AnswerCallbackQueryAsync(string botToken, string callbackQueryId, string text, bool showAlert = false)
    {
        try
        {
            using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
            var payload = new
            {
                callback_query_id = callbackQueryId,
                text = text,
                show_alert = showAlert
            };
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            await httpClient.PostAsync($"https://api.telegram.org/bot{botToken}/answerCallbackQuery", content);
        }
        catch { }
    }

    private static async Task EditMessageReplyMarkupAsync(string botToken, long chatId, int messageId, string buttonText)
    {
        try
        {
            using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
            var payload = new
            {
                chat_id = chatId,
                message_id = messageId,
                reply_markup = new
                {
                    inline_keyboard = new[]
                    {
                        new[] { new { text = buttonText, callback_data = "done" } }
                    }
                }
            };
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            await httpClient.PostAsync($"https://api.telegram.org/bot{botToken}/editMessageReplyMarkup", content);
        }
        catch { }
    }

    private static async Task SendTelegramAsync(string botToken, string chatId, string topicId, string message)
    {
        try
        {
            using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(6) };
            var payload = new Dictionary<string, object>
            {
                ["chat_id"] = chatId,
                ["text"] = message,
                ["parse_mode"] = "HTML"
            };
            if (!string.IsNullOrEmpty(topicId) && int.TryParse(topicId, out int threadId))
            {
                payload["message_thread_id"] = threadId;
            }
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            await httpClient.PostAsync($"https://api.telegram.org/bot{botToken}/sendMessage", content);
        }
        catch { }
    }

    private static string EscapeHtml(string? input)
    {
        if (string.IsNullOrEmpty(input)) return string.Empty;
        return input.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;");
    }
}
