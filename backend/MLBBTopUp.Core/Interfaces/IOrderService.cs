using MLBBTopUp.Core.DTOs;

namespace MLBBTopUp.Core.Interfaces;

public interface IOrderService
{
    Task<OrderResponse?> CreateOrderAsync(int? userId, CreateOrderRequest request);
    Task<OrderResponse?> GetOrderByIdAsync(int orderId);
    Task<IEnumerable<OrderResponse>> GetUserOrdersAsync(int userId);
    Task<IEnumerable<OrderResponse>> GetAllOrdersAsync();
    Task<IEnumerable<OrderResponse>> GetPendingOrdersAsync();
    Task<OrderStatusResponse?> GetOrderStatusAsync(int orderId);
    Task<bool> UpdateOrderPaymentStatusAsync(int orderId, string paymentStatus);
    Task<bool> UpdateOrderTopupStatusAsync(int orderId, string topupStatus);
}
