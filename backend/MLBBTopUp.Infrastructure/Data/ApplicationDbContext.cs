using Microsoft.EntityFrameworkCore;
using MLBBTopUp.Core.Entities;

namespace MLBBTopUp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var isSqlite = Database.ProviderName?.Contains("Sqlite") == true;
        var utcDateSql = isSqlite ? "CURRENT_TIMESTAMP" : "GETUTCDATE()";

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql(utcDateSql);
        });

        // Configure Product entity
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId);
            entity.Property(e => e.DiamondAmount).IsRequired();
            entity.Property(e => e.Price).IsRequired().HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql(utcDateSql);
        });

        // Configure Order entity
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId);
            entity.Property(e => e.PlayerID).IsRequired().HasMaxLength(50);
            entity.Property(e => e.ServerID).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Amount).IsRequired().HasColumnType("decimal(18,2)");
            entity.Property(e => e.PaymentStatus).IsRequired().HasMaxLength(20);
            entity.Property(e => e.TopupStatus).IsRequired().HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql(utcDateSql);

            // Relationships
            entity.HasOne(e => e.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(e => e.UserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Product)
                .WithMany(p => p.Orders)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Payment)
                .WithOne(p => p.Order)
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Payment entity
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId);
            entity.Property(e => e.PaymentMethod).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TransactionID).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.TransactionID).IsUnique();
            entity.Property(e => e.Amount).IsRequired().HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql(utcDateSql);
        });

        // Seed initial data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed official Mobile Legends Real Diamond packages
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                ProductId = 1,
                DiamondAmount = 11,
                Price = 0.25m,
                CostPrice = 0.21m,
                ResellerPrice = 0.23m,
                Status = "Active",
                Description = "11 Diamonds (10 + 1 Bonus) - Official MLBB Denomination",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 2,
                DiamondAmount = 55,
                Price = 1.15m,
                CostPrice = 0.98m,
                ResellerPrice = 1.06m,
                Status = "Active",
                Description = "55 Diamonds (50 + 5 Bonus) - Quick Hero / Emote Boost",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 3,
                DiamondAmount = 86,
                Price = 1.75m,
                CostPrice = 1.49m,
                ResellerPrice = 1.61m,
                Status = "Active",
                Description = "86 Diamonds (78 + 8 Bonus) - Popular Daily Recharge",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 4,
                DiamondAmount = 172,
                Price = 3.45m,
                CostPrice = 2.93m,
                ResellerPrice = 3.17m,
                Status = "Active",
                Description = "172 Diamonds (156 + 16 Bonus) - Elite Skin Pack",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 5,
                DiamondAmount = 210,
                Price = 1.99m,
                CostPrice = 1.69m,
                ResellerPrice = 1.83m,
                Status = "Active",
                Description = "Weekly Diamond Pass (210 Total Diamonds + 70 COA + Badges)",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 6,
                DiamondAmount = 257,
                Price = 5.10m,
                CostPrice = 4.34m,
                ResellerPrice = 4.69m,
                Status = "Active",
                Description = "257 Diamonds (234 + 23 Bonus) - Starlight Member Pack",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 7,
                DiamondAmount = 344,
                Price = 6.80m,
                CostPrice = 5.78m,
                ResellerPrice = 6.26m,
                Status = "Active",
                Description = "344 Diamonds (312 + 32 Bonus) - Special Skin Bundle",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 8,
                DiamondAmount = 429,
                Price = 8.50m,
                CostPrice = 7.22m,
                ResellerPrice = 7.82m,
                Status = "Active",
                Description = "429 Diamonds (390 + 39 Bonus) - Epic Event Pack",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 9,
                DiamondAmount = 500,
                Price = 9.99m,
                CostPrice = 8.49m,
                ResellerPrice = 9.19m,
                Status = "Active",
                Description = "Twilight Pass (Instant 500 Diamonds + Exclusive Miya Skin)",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 10,
                DiamondAmount = 514,
                Price = 10.20m,
                CostPrice = 8.67m,
                ResellerPrice = 9.38m,
                Status = "Active",
                Description = "514 Diamonds (468 + 46 Bonus) - Epic Skin Recharge",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 11,
                DiamondAmount = 706,
                Price = 10.30m,
                CostPrice = 8.75m,
                ResellerPrice = 9.48m,
                Status = "Active",
                Description = "706 Diamonds (625 + 81 Bonus) - Collector Event Pack",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 12,
                DiamondAmount = 1050,
                Price = 15.50m,
                CostPrice = 13.15m,
                ResellerPrice = 14.25m,
                Status = "Active",
                Description = "1050 Diamonds (933 + 117 Bonus) - High Value Bundle",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 13,
                DiamondAmount = 2195,
                Price = 29.99m,
                CostPrice = 25.49m,
                ResellerPrice = 27.59m,
                Status = "Active",
                Description = "2195 Diamonds (1860 + 335 Bonus) - Mythic Chest Pack",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 14,
                DiamondAmount = 3688,
                Price = 49.99m,
                CostPrice = 42.49m,
                ResellerPrice = 45.99m,
                Status = "Active",
                Description = "3688 Diamonds (3099 + 589 Bonus) - Legend Skin Pack",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 15,
                DiamondAmount = 5532,
                Price = 75.00m,
                CostPrice = 63.75m,
                ResellerPrice = 69.00m,
                Status = "Active",
                Description = "5532 Diamonds (4649 + 883 Bonus) - Grand Master Pack",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                ProductId = 16,
                DiamondAmount = 9288,
                Price = 125.00m,
                CostPrice = 106.25m,
                ResellerPrice = 115.00m,
                Status = "Active",
                Description = "9288 Diamonds (7740 + 1548 Bonus) - Ultimate Whale Pack",
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed default admin user (password: Admin@123)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                Name = "Admin",
                Email = "admin@mlbbtopup.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
