using Microsoft.EntityFrameworkCore;
using MLBBTopUp.Core.DTOs;
using MLBBTopUp.Core.Entities;
using MLBBTopUp.Core.Interfaces;
using MLBBTopUp.Infrastructure.Data;

namespace MLBBTopUp.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductResponse>> GetAllProductsAsync()
    {
        var products = await _context.Products
            .OrderBy(p => p.DiamondAmount)
            .ToListAsync();

        return products.Select(p => MapToResponse(p));
    }

    public async Task<IEnumerable<ProductResponse>> GetActiveProductsAsync()
    {
        var products = await _context.Products
            .Where(p => p.Status == "Active")
            .OrderBy(p => p.DiamondAmount)
            .ToListAsync();

        return products.Select(p => MapToResponse(p));
    }

    public async Task<ProductResponse?> GetProductByIdAsync(int productId)
    {
        var product = await _context.Products.FindAsync(productId);

        if (product == null)
        {
            return null;
        }

        return MapToResponse(product);
    }

    public async Task<ProductResponse> CreateProductAsync(CreateProductRequest request)
    {
        var costPrice = request.CostPrice ?? (request.Price * 0.85m);
        var resellerPrice = request.ResellerPrice ?? (request.Price * 0.92m);

        var product = new Product
        {
            DiamondAmount = request.DiamondAmount,
            Price = request.Price,
            CostPrice = costPrice,
            ResellerPrice = resellerPrice,
            Description = request.Description,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return MapToResponse(product);
    }

    public async Task<ProductResponse?> UpdateProductAsync(int productId, UpdateProductRequest request)
    {
        var product = await _context.Products.FindAsync(productId);

        if (product == null)
        {
            return null;
        }

        if (request.Price.HasValue)
        {
            product.Price = request.Price.Value;
        }

        if (request.CostPrice.HasValue)
        {
            product.CostPrice = request.CostPrice.Value;
        }

        if (request.ResellerPrice.HasValue)
        {
            product.ResellerPrice = request.ResellerPrice.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            product.Status = request.Status;
        }

        if (!string.IsNullOrWhiteSpace(request.Description))
        {
            product.Description = request.Description;
        }

        await _context.SaveChangesAsync();

        return MapToResponse(product);
    }

    public async Task<bool> DeleteProductAsync(int productId)
    {
        var product = await _context.Products.Include(p => p.Orders).FirstOrDefaultAsync(p => p.ProductId == productId);

        if (product == null)
        {
            return false;
        }

        // If product has no orders, hard delete from database to prevent clutter
        if (!product.Orders.Any())
        {
            _context.Products.Remove(product);
        }
        else
        {
            product.Status = "Inactive";
        }

        await _context.SaveChangesAsync();
        return true;
    }

    private static ProductResponse MapToResponse(Product product)
    {
        var cost = product.CostPrice > 0 ? product.CostPrice : Math.Round(product.Price * 0.85m, 2);
        var reseller = product.ResellerPrice > 0 ? product.ResellerPrice : Math.Round(product.Price * 0.92m, 2);
        var profit = product.Price - cost;
        var marginPct = product.Price > 0 ? Math.Round((profit / product.Price) * 100, 1) : 0;

        return new ProductResponse
        {
            ProductId = product.ProductId,
            DiamondAmount = product.DiamondAmount,
            Price = product.Price,
            CostPrice = cost,
            ResellerPrice = reseller,
            ProfitAmount = profit,
            ProfitMarginPct = marginPct,
            Status = product.Status,
            Description = product.Description
        };
    }
}
