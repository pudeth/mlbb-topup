using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MLBBTopUp.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        try
        {
            // Ensure database schema and all tables (Products, Orders, Users, Payments) exist
            await context.Database.EnsureCreatedAsync();
            
            // Sync selling prices and exact provider wholesale costs for profit calculation
            var classicPrices = new Dictionary<int, (decimal price, decimal cost, decimal reseller, string name, string desc)>
            {
                { 55, (0.89m, 0.76m, 0.89m, "55 Diamonds", "55 Diamonds Starter") },
                { 86, (1.39m, 1.20m, 1.39m, "86 Diamonds", "86 Diamonds Bonus") },
                { 110, (1.78m, 1.50m, 1.78m, "110 Diamonds", "110 Diamonds Bonus") },
                { 165, (2.66m, 2.25m, 2.66m, "165 Diamonds", "165 Diamonds (Hot Deal)") },
                { 172, (2.78m, 2.35m, 2.78m, "172 Diamonds", "172 Diamonds Standard") },
                { 210, (1.55m, 1.55m, 1.55m, "Weekly Pass", "Weekly Pass (220 Diamonds + 70 Aurora)") },
                { 440, (3.10m, 3.00m, 3.10m, "2 Weekly Pass", "2 Weekly Pass (440 Diamonds + 140 Aurora)") },
                { 660, (4.65m, 4.50m, 4.65m, "3 Weekly Pass", "3 Weekly Pass (29 tickets)") },
                { 880, (6.20m, 6.00m, 6.20m, "4 Weekly Pass", "4 Weekly Pass Bundle") },
                { 1100, (7.75m, 7.50m, 7.75m, "5 Weekly Pass", "5 Weekly Pass Bundle") },
                { 1320, (9.30m, 9.00m, 9.30m, "6 Weekly Pass", "6 Weekly Pass Bundle") },
                { 605, (5.50m, 5.30m, 5.50m, "165 + 2Weekly", "165 Diamonds + 2 Weekly Passes") },
                { 257, (4.15m, 3.40m, 4.15m, "257 Diamonds", "257 Diamonds Popular") },
                { 275, (4.44m, 3.60m, 4.44m, "275 Diamonds", "275 Diamonds (29 tickets)") },
                { 312, (5.03m, 4.00m, 5.03m, "312 Diamonds", "312 Diamonds (Starlight Ready)") },
                { 343, (5.53m, 4.40m, 5.53m, "343 Diamonds", "343 Diamonds (29 tickets)") },
                { 429, (6.92m, 5.80m, 6.92m, "429 Diamonds", "429 Diamonds (29 tickets)") },
                { 500, (8.25m, 8.00m, 8.25m, "Twilight Pass", "VIP Twilight Pass") },
                { 514, (8.29m, 6.45m, 8.29m, "514 Diamonds", "514 Diamonds Best Value") },
                { 565, (9.12m, 7.45m, 9.12m, "565 Diamonds", "565 Diamonds Special") },
                { 600, (9.68m, 7.45m, 9.68m, "600 Diamonds", "600 Diamonds Pro Pack") },
                { 706, (11.39m, 9.25m, 11.39m, "706 Diamonds", "706 Diamonds VIP") },
                { 878, (14.17m, 11.20m, 14.17m, "878 Diamonds", "878 Diamonds VIP PRO") },
                { 963, (15.54m, 11.90m, 15.54m, "963 Diamonds", "963 Diamonds Grand Pack") },
                { 1050, (16.94m, 13.60m, 16.94m, "1050 Diamonds", "1050 Diamonds Royal Chest") },
                { 1412, (22.78m, 19.20m, 22.78m, "1412 Diamonds", "1412 Diamonds Treasury") },
                { 2195, (35.41m, 28.00m, 35.41m, "2195 Diamonds", "2195 Diamonds Mythic Pack") },
                { 2452, (39.56m, 28.50m, 39.56m, "2452 Diamonds", "2452 Diamonds Mythic Plus") },
                { 2901, (46.81m, 35.00m, 46.81m, "2901 Diamonds", "2901 Diamonds Legendary Pack") },
                { 3688, (59.49m, 48.65m, 59.49m, "3688 Diamonds", "3688 Diamonds Epic Vault") },
                { 4390, (70.83m, 55.00m, 70.83m, "4390 Diamonds", "4390 Diamonds Supreme Chest") },
                { 5532, (89.25m, 70.00m, 89.25m, "5532 Diamonds", "5532 Diamonds Immortal Pack") },
                { 6944, (112.04m, 81.00m, 112.04m, "6944 Diamonds", "6944 Diamonds Titan Pack") },
                { 9288, (149.85m, 118.00m, 149.85m, "9288 Diamonds", "9288 Diamonds ULTIMATE") }
            };

            var dbProducts = await context.Products.ToListAsync();

            // Update existing products
            foreach (var prod in dbProducts)
            {
                if (prod.DiamondAmount == 50)
                {
                    prod.DiamondAmount = 55;
                }

                if (classicPrices.TryGetValue(prod.DiamondAmount, out var pInfo))
                {
                    prod.Price = pInfo.price;
                    prod.CostPrice = pInfo.cost;
                    prod.ResellerPrice = pInfo.reseller;
                    prod.Description = pInfo.desc;
                    prod.Status = "Active";
                }
                else
                {
                    prod.Status = "Inactive";
                }
            }

            // Insert any missing product packages
            foreach (var kvp in classicPrices)
            {
                if (!dbProducts.Any(p => p.DiamondAmount == kvp.Key))
                {
                    context.Products.Add(new MLBBTopUp.Core.Entities.Product
                    {
                        DiamondAmount = kvp.Key,
                        Price = kvp.Value.price,
                        CostPrice = kvp.Value.cost,
                        ResellerPrice = kvp.Value.reseller,
                        Description = kvp.Value.desc,
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // Seed Default Admin User if not exists
            if (!await context.Users.AnyAsync(u => u.Role == "Admin"))
            {
                context.Users.Add(new MLBBTopUp.Core.Entities.User
                {
                    Name = "Super Admin",
                    Email = "admin@mlbbtopup.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("AdminPassword123!"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                });
                await context.SaveChangesAsync();
                Console.WriteLine("[+] Default Admin user created: admin@mlbbtopup.com");
            }

            await context.SaveChangesAsync();

            Console.WriteLine("[+] Database tables and prices synced successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Database Init Notice]: {ex.Message}");
        }
    }
}
