using MLBBTopUp.Core.DTOs;

namespace MLBBTopUp.Core.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductResponse>> GetAllProductsAsync();
    Task<IEnumerable<ProductResponse>> GetActiveProductsAsync();
    Task<ProductResponse?> GetProductByIdAsync(int productId);
    Task<ProductResponse> CreateProductAsync(CreateProductRequest request);
    Task<ProductResponse?> UpdateProductAsync(int productId, UpdateProductRequest request);
    Task<bool> DeleteProductAsync(int productId);
}
