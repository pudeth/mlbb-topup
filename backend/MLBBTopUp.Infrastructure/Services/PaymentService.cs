using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MLBBTopUp.Core.DTOs;
using MLBBTopUp.Core.Entities;
using MLBBTopUp.Core.Interfaces;
using MLBBTopUp.Infrastructure.Data;

namespace MLBBTopUp.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IOrderService _orderService;
    private readonly IKHQRService _khqrService;
    private readonly ITopUpService _topUpService;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(
        ApplicationDbContext context,
        IConfiguration configuration,
        IOrderService orderService,
        IKHQRService khqrService,
        ITopUpService topUpService,
        IServiceScopeFactory serviceScopeFactory,
        ILogger<PaymentService> logger)
    {
        _context = context;
        _configuration = configuration;
        _orderService = orderService;
        _khqrService = khqrService;
        _topUpService = topUpService;
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    public async Task<PaymentResponse?> CreatePaymentAsync(CreatePaymentRequest request)
    {
        // Validate order exists
        var order = await _context.Orders.FindAsync(request.OrderId);

        if (order == null)
        {
            return null;
        }

        string targetCurrency = (request.Currency ?? "USD").ToUpper();
        bool isKhr = targetCurrency == "KHR";
        decimal payAmount = isKhr ? Math.Round(order.Amount * 4100m) : order.Amount;

        // Check if payment already exists for this order
        var existingPayment = await _context.Payments
            .FirstOrDefaultAsync(p => p.OrderId == request.OrderId);

        if (existingPayment != null)
        {
            if (existingPayment.Status == "Pending" && request.PaymentMethod.ToLower() == "khqr")
            {
                var khqrResult = await _khqrService.CreatePaymentAsync(request.OrderId, payAmount, targetCurrency);
                if (khqrResult.Success)
                {
                    existingPayment.Amount = payAmount;
                    existingPayment.KHQRBillNumber = khqrResult.BillNumber;
                    existingPayment.KHQRMd5Hash = khqrResult.Md5Hash;
                    existingPayment.KHQRQRCode = khqrResult.QrCode;
                    existingPayment.KHQRDeeplink = khqrResult.Deeplink;
                    await _context.SaveChangesAsync();
                }
            }

            var resp = MapToResponse(existingPayment);
            resp.Currency = targetCurrency;
            resp.Amount = payAmount;
            return resp;
        }

        // Generate transaction ID
        var transactionId = $"TXN-{DateTime.UtcNow:yyyyMMddHHmmss}-{request.OrderId}";

        // Create payment record
        var payment = new Payment
        {
            OrderId = request.OrderId,
            PaymentMethod = request.PaymentMethod,
            TransactionID = transactionId,
            Amount = payAmount,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        // If payment method is KHQR, create KHQR payment
        if (request.PaymentMethod.ToLower() == "khqr")
        {
            _logger.LogInformation("Creating KHQR payment for order {OrderId} ({Amount} {Currency})", 
                request.OrderId, payAmount, targetCurrency);
            
            var khqrResult = await _khqrService.CreatePaymentAsync(request.OrderId, payAmount, targetCurrency);
            
            if (khqrResult.Success)
            {
                payment.KHQRBillNumber = khqrResult.BillNumber;
                payment.KHQRMd5Hash = khqrResult.Md5Hash;
                payment.KHQRQRCode = khqrResult.QrCode;
                payment.KHQRDeeplink = khqrResult.Deeplink;
                
                _logger.LogInformation("KHQR payment created: {Md5Hash}", khqrResult.Md5Hash);
            }
            else
            {
                _logger.LogError("Failed to create KHQR payment: {Error}", khqrResult.Error);
            }
        }

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        // Send interactive Telegram card with inline buttons for instant merchant approval
        _ = Task.Run(async () =>
        {
            try
            {
                var buttons = new
                {
                    inline_keyboard = new[]
                    {
                        new[]
                        {
                            new { text = "✅ Approve & Deliver Diamonds", callback_data = $"confirm_{order.OrderId}_{payment.KHQRMd5Hash}" },
                            new { text = "🔍 Check Bakong", callback_data = $"check_{order.OrderId}_{payment.KHQRMd5Hash}" }
                        }
                    }
                };

                var totalKhr = Math.Round(payAmount * (targetCurrency == "USD" ? 4100m : 1m));
                var msg = $"🎮 <b>NEW MLBB TOP-UP ORDER #{order.OrderId}</b>\n" +
                          $"━━━━━━━━━━━━━━━━━━━━━━\n" +
                          $"👤 <b>Player ID:</b> <code>{order.PlayerID}</code> (Zone {order.ServerID})\n" +
                          $"💰 <b>Total:</b> ${order.Amount:F2} USD ({totalKhr:N0} ៛)\n" +
                          $"🔐 <b>MD5:</b> <code>{payment.KHQRMd5Hash}</code>\n" +
                          $"⏰ <b>Status:</b> ⏳ Waiting for payment\n" +
                          $"━━━━━━━━━━━━━━━━━━━━━━\n" +
                          $"👇 <i>Received money in bank? Tap below to approve:</i>";

                await SendTelegramAsync(msg, buttons);
            }
            catch { }
        });

        var createdResp = MapToResponse(payment);
        createdResp.Currency = targetCurrency;
        createdResp.Amount = payAmount;
        return createdResp;
    }

    public async Task<PaymentResponse?> GetPaymentByOrderIdAsync(int orderId)
    {
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.OrderId == orderId);

        if (payment == null)
        {
            return null;
        }

        return MapToResponse(payment);
    }

    public async Task<bool> ProcessPaymentWebhookAsync(PaymentWebhookRequest request)
    {
        // Find payment by transaction ID
        var payment = await _context.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.TransactionID == request.TransactionID);

        if (payment == null)
        {
            return false;
        }

        // Update payment status
        payment.Status = request.Status;

        if (request.Status == "Completed")
        {
            payment.PaidAt = DateTime.UtcNow;

            // Update order payment status
            await _orderService.UpdateOrderPaymentStatusAsync(payment.OrderId, "Paid");
            await _context.SaveChangesAsync();

            // Auto-trigger top-up delivery
            var orderObj = await _orderService.GetOrderByIdAsync(payment.OrderId);
            if (orderObj != null && orderObj.TopupStatus == "Pending")
            {
                _logger.LogInformation("Webhook auto-triggering top-up delivery for order {OrderId}", payment.OrderId);
                _ = Task.Run(async () =>
                {
                    try
                    {
                        using var scope = _serviceScopeFactory.CreateScope();
                        var scopedTopUp = scope.ServiceProvider.GetRequiredService<ITopUpService>();
                        await scopedTopUp.ProcessTopUpAsync(
                            orderObj.OrderId,
                            orderObj.PlayerID,
                            orderObj.ServerID,
                            orderObj.DiamondAmount
                        );
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error auto-processing top-up from webhook for order {OrderId}", payment.OrderId);
                    }
                });
            }
        }
        else if (request.Status == "Failed")
        {
            await _orderService.UpdateOrderPaymentStatusAsync(payment.OrderId, "Failed");
            await _context.SaveChangesAsync();
        }

        return true;
    }

    public async Task<bool> VerifyPaymentAsync(int orderId)
    {
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.OrderId == orderId);

        if (payment == null)
        {
            var ord = await _orderService.GetOrderByIdAsync(orderId);
            if (ord != null)
            {
                var pRes = await CreatePaymentAsync(new CreatePaymentRequest
                {
                    OrderId = orderId,
                    Currency = "USD",
                    PaymentMethod = "khqr"
                });
                payment = await _context.Payments.FirstOrDefaultAsync(p => p.OrderId == orderId);
            }
        }

        if (payment == null)
        {
            return false;
        }

        // If payment already completed, return true
        if (payment.Status == "Completed" && payment.PaidAt.HasValue)
        {
            return true;
        }

        // If KHQR payment, check status with KHQR service
        if (!string.IsNullOrEmpty(payment.KHQRMd5Hash))
        {
            _logger.LogInformation("Verifying KHQR payment for order {OrderId} (MD5: {Md5Hash})", orderId, payment.KHQRMd5Hash);
            
            var statusResult = await _khqrService.CheckPaymentStatusAsync(payment.KHQRMd5Hash);
            var rawSt = (statusResult.Status ?? string.Empty).ToUpper();
            
            if (rawSt == "PAID" || rawSt == "SUCCESS" || rawSt == "COMPLETED")
            {
                _logger.LogInformation("KHQR payment confirmed as PAID for order {OrderId}", orderId);
                
                payment.Status = "Completed";
                payment.PaidAt = DateTime.UtcNow;
                
                await _orderService.UpdateOrderPaymentStatusAsync(orderId, "Paid");
                await _context.SaveChangesAsync();
                
                // Auto-trigger top-up delivery
                var order = await _orderService.GetOrderByIdAsync(orderId);
                if (order != null && order.TopupStatus == "Pending")
                {
                    _logger.LogInformation("Auto-triggering top-up delivery for paid order {OrderId}", orderId);
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            using var scope = _serviceScopeFactory.CreateScope();
                            var scopedTopUp = scope.ServiceProvider.GetRequiredService<ITopUpService>();
                            await scopedTopUp.ProcessTopUpAsync(
                                order.OrderId,
                                order.PlayerID,
                                order.ServerID,
                                order.DiamondAmount
                            );
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error auto-processing top-up for order {OrderId}", orderId);
                        }
                    });

                    // Send Telegram delivery notification
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            var totalKhr = Math.Round(order.Amount * 4100m);
                            var msg = $"🎉 <b>MLBB ORDER #{order.OrderId} CONFIRMED PAID!</b>\n" +
                                      $"━━━━━━━━━━━━━━━━━━━━━━\n" +
                                      $"👤 <b>Player ID:</b> <code>{order.PlayerID}</code> (Zone {order.ServerID})\n" +
                                      $"💎 <b>Diamonds:</b> {order.DiamondAmount}\n" +
                                      $"💰 <b>Amount:</b> ${order.Amount:F2} USD ({totalKhr:N0} ៛)\n" +
                                      $"⏰ <b>Time:</b> {DateTime.UtcNow:dd MMM yyyy, HH:mm:ss} UTC\n" +
                                      $"━━━━━━━━━━━━━━━━━━━━━━\n" +
                                      $"⚡ <b>Customer screen transitioned to [PAID SUCCESS]!</b>";

                            await SendTelegramAsync(msg);
                        }
                        catch { }
                    });
                }
                
                return true;
            }
            
            return false;
        }

        // For non-KHQR payments, check local status
        return payment.Status == "Completed" && payment.PaidAt.HasValue;
    }

    private static PaymentResponse MapToResponse(Payment payment)
    {
        return new PaymentResponse
        {
            PaymentId = payment.PaymentId,
            OrderId = payment.OrderId,
            PaymentMethod = payment.PaymentMethod,
            TransactionID = payment.TransactionID,
            Amount = payment.Amount,
            Status = payment.Status,
            PaidAt = payment.PaidAt,
            KHQRBillNumber = payment.KHQRBillNumber,
            KHQRMd5Hash = payment.KHQRMd5Hash,
            KHQRDeeplink = payment.KHQRDeeplink,
            KHQRQRCode = payment.KHQRQRCode,
            KHQRQRImageUrl = !string.IsNullOrEmpty(payment.KHQRMd5Hash) 
                ? $"/api/khqr/qr/{payment.KHQRMd5Hash}" 
                : null
        };
    }

    private async Task SendTelegramAsync(string message, object? replyMarkup = null, string? customToken = null, string? customTopic = null)
    {
        try
        {
            var botToken = customToken ?? _configuration["Telegram:BotToken"] ?? "8516986555:AAH3enGgrbjWPKnQRPwXRQHKVfGgqiQ2Rhw";
            var chatId = _configuration["Telegram:ChatId"] ?? "-1004398577975";
            var topicId = customTopic ?? _configuration["Telegram:TopicId"] ?? "35";
            if (string.IsNullOrEmpty(botToken) || string.IsNullOrEmpty(chatId)) return;

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
            if (replyMarkup != null)
            {
                payload["reply_markup"] = replyMarkup;
            }

            var jsonContent = System.Text.Json.JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");
            await httpClient.PostAsync($"https://api.telegram.org/bot{botToken}/sendMessage", content);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Telegram send failed: {Message}", ex.Message);
        }
    }

    private async Task SendMasterTotalAsync(string message)
    {
        try
        {
            var masterToken = _configuration["Telegram:MasterBotToken"] ?? "8633673377:AAF35ZeHsmZOgUEsl0oXPraB35gq-vYYc_A";
            var masterTopic = _configuration["Telegram:MasterTotalTopicId"] ?? "126";
            await SendTelegramAsync(message, replyMarkup: null, customToken: masterToken, customTopic: masterTopic);
        }
        catch { }
    }
}
