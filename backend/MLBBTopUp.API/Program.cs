using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MLBBTopUp.Core.Interfaces;
using MLBBTopUp.Infrastructure.Data;
using MLBBTopUp.Infrastructure.Services;
using System.Text;
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory
});

builder.Configuration.Sources.Clear();
builder.Configuration
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: false)
    .AddEnvironmentVariables();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger with JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MLBB Top-Up API",
        Version = "v1",
        Description = "API for Mobile Legends: Bang Bang diamond top-up service"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=mlbbtopup.db";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (connectionString.Contains(".db") || connectionString.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
    {
        options.UseSqlite(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
});

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ITopUpService, TopUpService>();

// Register KHQR Service
builder.Services.AddHttpClient<IKHQRService, KHQRService>();
builder.Services.AddScoped<IKHQRService, KHQRService>();

// Register payment gateway and top-up provider
// Replace MockPaymentGateway and MockTopUpProvider with actual implementations
builder.Services.AddScoped<MLBBTopUp.Infrastructure.PaymentGateways.IPaymentGatewayClient, 
    MLBBTopUp.Infrastructure.PaymentGateways.MockPaymentGateway>();
builder.Services.AddHttpClient<MLBBTopUp.Infrastructure.TopUpProviders.ITopUpProviderClient, 
    MLBBTopUp.Infrastructure.TopUpProviders.RealTopUpProviderClient>();
builder.Services.AddScoped<MLBBTopUp.Infrastructure.TopUpProviders.ITopUpProviderClient, 
    MLBBTopUp.Infrastructure.TopUpProviders.RealTopUpProviderClient>();

// Configure CORS to allow both localhost and all Vercel/production domains
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Ensure database is created and seeded with latest pricing
await DbInitializer.InitializeAsync(app.Services);

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MLBB Top-Up API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/", () => "MLBB Top-Up Backend API is Running!");
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();
