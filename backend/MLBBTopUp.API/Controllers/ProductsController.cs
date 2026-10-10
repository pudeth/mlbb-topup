using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLBBTopUp.Core.DTOs;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : BaseController
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    /// <summary>
    /// Get all active diamond packages (Public Customer Endpoint)
    /// Privacy Guaranteed: CostPrice, ProfitAmount, ProfitMarginPct, and ProviderPackageId are completely omitted.
    /// ResellerPrice is only included for authenticated Resellers or Admins.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetActiveProducts()
    {
        var products = await _productService.GetActiveProductsAsync();
        var isAdmin = IsAdmin();
        var isReseller = IsReseller();

        if (!isAdmin)
        {
            var sanitized = products.Select(p => new ProductResponse
            {
                ProductId = p.ProductId,
                DiamondAmount = p.DiamondAmount,
                Price = p.Price,
                Status = p.Status,
                Description = p.Description,
                ResellerPrice = isReseller ? p.ResellerPrice : null,
                CostPrice = null,
                ProfitAmount = null,
                ProfitMarginPct = null,
                ProviderPackageId = null
            });
            return Ok(sanitized);
        }

        return Ok(products);
    }

    /// <summary>
    /// Get all products (including inactive) - Admin only with full business metrics
    /// </summary>
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }

    /// <summary>
    /// Get product by ID (Privacy Protected for non-admins)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);

        if (product == null)
        {
            return NotFound(new { message = "Product not found" });
        }

        if (!IsAdmin())
        {
            var isReseller = IsReseller();
            return Ok(new ProductResponse
            {
                ProductId = product.ProductId,
                DiamondAmount = product.DiamondAmount,
                Price = product.Price,
                Status = product.Status,
                Description = product.Description,
                ResellerPrice = isReseller ? product.ResellerPrice : null,
                CostPrice = null,
                ProfitAmount = null,
                ProfitMarginPct = null,
                ProviderPackageId = null
            });
        }

        return Ok(product);
    }

    /// <summary>
    /// Create new product - Admin only with Active Safety Protections
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid input data" });
        }

        // Active Safety Protections: Block selling below provider wholesale cost
        if (request.CostPrice.HasValue && request.CostPrice.Value > 0)
        {
            if (request.Price > 0 && request.Price < request.CostPrice.Value)
            {
                return BadRequest(new { message = $"Active Safety Protection: Customer Retail Price (${request.Price:F2}) cannot be lower than Upstream Wholesale Cost (${request.CostPrice.Value:F2})." });
            }
            if (request.ResellerPrice.HasValue && request.ResellerPrice.Value > 0 && request.ResellerPrice.Value < request.CostPrice.Value)
            {
                return BadRequest(new { message = $"Active Safety Protection: Reseller B2B Price (${request.ResellerPrice.Value:F2}) cannot be lower than Upstream Wholesale Cost (${request.CostPrice.Value:F2})." });
            }
        }

        var product = await _productService.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, product);
    }

    /// <summary>
    /// Update product - Admin only with Active Safety Protections
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        var existing = await _productService.GetProductByIdAsync(id);
        if (existing == null)
        {
            return NotFound(new { message = "Product not found" });
        }

        // Active Safety Protections: Block selling below provider wholesale cost
        var effectiveCost = request.CostPrice ?? existing.CostPrice;
        var effectivePrice = request.Price ?? existing.Price;
        var effectiveReseller = request.ResellerPrice ?? existing.ResellerPrice;

        if (effectiveCost > 0)
        {
            if (effectivePrice > 0 && effectivePrice < effectiveCost)
            {
                return BadRequest(new { message = $"Active Safety Protection: Customer Retail Price (${effectivePrice:F2}) cannot be lower than Upstream Wholesale Cost (${effectiveCost:F2})." });
            }
            if (effectiveReseller > 0 && effectiveReseller < effectiveCost)
            {
                return BadRequest(new { message = $"Active Safety Protection: Reseller B2B Price (${effectiveReseller:F2}) cannot be lower than Upstream Wholesale Cost (${effectiveCost:F2})." });
            }
        }

        var product = await _productService.UpdateProductAsync(id, request);
        return Ok(product);
    }

    /// <summary>
    /// Delete product (soft delete) - Admin only
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await _productService.DeleteProductAsync(id);

        if (!result)
        {
            return NotFound(new { message = "Product not found" });
        }

        return Ok(new { message = "Product deleted successfully" });
    }
}
