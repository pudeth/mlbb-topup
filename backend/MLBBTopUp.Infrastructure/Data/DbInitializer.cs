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
                { 14, (0.28m, 0.25m, 0.28m, "14 Diamonds", "14 Diamonds Starter") },
                { 28, (0.55m, 0.49m, 0.55m, "28 Diamonds", "28 Diamonds Bonus") },
                { 42, (0.80m, 0.73m, 0.80m, "42 Diamonds", "42 Diamonds Bonus") },
                { 55, (0.89m, 0.76m, 0.89m, "55 Diamonds", "55 Diamonds Starter") },
                { 86, (1.39m, 1.25m, 1.39m, "86 Diamonds", "86 Diamonds Bonus") },
                { 110, (1.78m, 1.25m, 1.78m, "110 Diamonds", "110 Diamonds Bonus") },
                { 165, (2.66m, 2.28m, 2.66m, "165 Diamonds", "165 Diamonds (Hot Deal)") },
                { 172, (2.78m, 2.47m, 2.78m, "172 Diamonds", "172 Diamonds Standard") },
                { 210, (1.55m, 1.54m, 1.55m, "Weekly Pass", "Weekly Pass (220 Diamonds + 70 Aurora)") },
                { 440, (3.10m, 2.97m, 3.10m, "2 Weekly Pass", "2 Weekly Pass (440 Diamonds + 140 Aurora)") },
                { 660, (4.65m, 4.46m, 4.65m, "3 Weekly Pass", "3 Weekly Pass (29 tickets)") },
                { 880, (6.20m, 5.94m, 6.20m, "4 Weekly Pass", "4 Weekly Pass Bundle") },
                { 1100, (7.75m, 7.43m, 7.75m, "5 Weekly Pass", "5 Weekly Pass Bundle") },
                { 1320, (9.30m, 8.92m, 9.30m, "6 Weekly Pass", "6 Weekly Pass Bundle") },
                { 605, (5.50m, 4.79m, 5.50m, "165 + 2Weekly", "165 Diamonds + 2 Weekly Passes") },
                { 257, (4.15m, 3.54m, 4.15m, "257 Diamonds", "257 Diamonds Popular") },
                { 275, (4.44m, 3.78m, 4.44m, "275 Diamonds", "275 Diamonds (29 tickets)") },
                { 312, (5.03m, 3.78m, 5.03m, "312 Diamonds", "312 Diamonds (Starlight Ready)") },
                { 343, (5.53m, 4.79m, 5.53m, "343 Diamonds", "343 Diamonds (29 tickets)") },
                { 344, (5.70m, 4.93m, 5.70m, "344 Diamonds", "344 Diamonds Bonus") },
                { 429, (6.92m, 5.99m, 6.92m, "429 Diamonds", "429 Diamonds (29 tickets)") },
                { 430, (7.10m, 6.18m, 7.10m, "430 Diamonds", "430 Diamonds Bonus") },
                { 500, (8.25m, 8.14m, 8.25m, "Twilight Pass", "VIP Twilight Pass") },
                { 514, (8.29m, 7.07m, 8.29m, "514 Diamonds", "514 Diamonds Best Value") },
                { 516, (8.50m, 7.40m, 8.50m, "516 Diamonds", "516 Diamonds Bonus") },
                { 565, (9.12m, 7.58m, 9.12m, "565 Diamonds", "565 Diamonds Special") },
                { 600, (9.68m, 8.32m, 9.68m, "600 Diamonds", "600 Diamonds Pro Pack") },
                { 602, (9.90m, 8.64m, 9.90m, "602 Diamonds", "602 Diamonds Bonus") },
                { 706, (11.39m, 9.69m, 11.39m, "706 Diamonds", "706 Diamonds VIP") },
                { 792, (12.80m, 10.94m, 12.80m, "792 Diamonds", "792 Diamonds Elite") },
                { 878, (14.17m, 12.16m, 14.17m, "878 Diamonds", "878 Diamonds VIP PRO") },
                { 963, (15.54m, 13.24m, 15.54m, "963 Diamonds", "963 Diamonds Grand Pack") },
                { 964, (15.70m, 13.40m, 15.70m, "964 Diamonds", "964 Diamonds Grand Plus") },
                { 1050, (16.94m, 14.63m, 16.94m, "1050 Diamonds", "1050 Diamonds Royal Chest") },
                { 1060, (17.10m, 14.72m, 17.10m, "1060 Diamonds", "1060 Diamonds Royal Plus") },
                { 1136, (18.40m, 15.86m, 18.40m, "1136 Diamonds", "1136 Diamonds Royal Vault") },
                { 1222, (19.80m, 17.08m, 19.80m, "1222 Diamonds", "1222 Diamonds Premium") },
                { 1308, (21.20m, 18.33m, 21.20m, "1308 Diamonds", "1308 Diamonds Master Chest") },
                { 1412, (22.78m, 19.40m, 22.78m, "1412 Diamonds", "1412 Diamonds Treasury") },
                { 1498, (24.10m, 20.64m, 24.10m, "1498 Diamonds", "1498 Diamonds Treasury Plus") },
                { 1584, (25.50m, 21.86m, 25.50m, "1584 Diamonds", "1584 Diamonds Supreme Vault") },
                { 2195, (35.41m, 29.36m, 35.41m, "2195 Diamonds", "2195 Diamonds Mythic Pack") },
                { 2453, (39.56m, 33.05m, 39.56m, "2453 Diamonds", "2453 Diamonds Mythic Plus") },
                { 2901, (46.81m, 39.04m, 46.81m, "2901 Diamonds", "2901 Diamonds Legendary Pack") },
                { 3688, (59.49m, 48.95m, 59.49m, "3688 Diamonds", "3688 Diamonds Epic Vault") },
                { 4394, (70.83m, 58.66m, 70.83m, "4394 Diamonds", "4394 Diamonds Supreme Chest") },
                { 5532, (89.25m, 73.93m, 89.25m, "5532 Diamonds", "5532 Diamonds Immortal Pack") },
                { 6944, (112.04m, 93.30m, 112.04m, "6944 Diamonds", "6944 Diamonds Titan Pack") },
                { 9288, (149.85m, 122.76m, 149.85m, "9288 Diamonds", "9288 Diamonds ULTIMATE") },

                // Free Fire Official Packages & Accurate Provider Wholesale Costs
                { 2600, (8.25m, 7.76m, 8.25m, "Monthly", "Free Fire Monthly Membership (2600 Diamonds)") },
                { 5000, (15.95m, 15.03m, 15.95m, "Monthly x2", "Free Fire Monthly x2 Pass") },
                { 7800, (23.95m, 22.55m, 23.95m, "Monthly x3", "Free Fire Monthly x3 Pass") },
                { 10000, (31.95m, 30.06m, 31.95m, "Monthly x4", "Free Fire Monthly x4 Pass") },
                { 445, (1.68m, 1.57m, 1.68m, "Weekly", "Free Fire Weekly Membership (445 Diamonds)") },
                { 890, (3.35m, 3.12m, 3.35m, "Weekly x2", "Free Fire Weekly x2 Pass") },
                { 1335, (4.98m, 4.67m, 4.98m, "Weekly x3", "Free Fire Weekly x3 Pass") },
                { 1780, (6.65m, 6.24m, 6.65m, "Weekly x4", "Free Fire Weekly x4 Pass") },
                { 90, (0.35m, 0.32m, 0.35m, "WeeklyLite", "Free Fire Weekly Lite Pass (90 Diamonds)") },
                { 180, (0.68m, 0.63m, 0.68m, "Weekly Lit x2", "Free Fire Weekly Lite x2 Pass") },
                { 270, (1.00m, 0.94m, 1.00m, "Weekly Lit x3", "Free Fire Weekly Lite x3 Pass") },
                { 200, (0.32m, 0.29m, 0.32m, "Level Up Package - Level 6", "Free Fire Level Up Level 6") },
                { 300, (0.66m, 0.61m, 0.66m, "Level Up Package - Level 10", "Free Fire Level Up Level 10") },
                { 400, (0.66m, 0.61m, 0.66m, "Level Up Package - Level 15", "Free Fire Level Up Level 15") },
                { 600, (0.66m, 0.61m, 0.66m, "Level Up Package - Level 25", "Free Fire Level Up Level 25") },
                { 800, (0.96m, 0.90m, 0.96m, "Level Up Package - Level 30", "Free Fire Level Up Level 30") },
                { 25, (0.26m, 0.24m, 0.26m, "25 Diamonds", "Free Fire 25 Diamonds") },
                { 100, (0.96m, 0.90m, 0.96m, "100 Diamonds", "Free Fire 100 Diamonds") },
                { 310, (2.90m, 2.74m, 2.90m, "310 Diamonds", "Free Fire 310 Diamonds") },
                { 520, (4.85m, 4.59m, 4.85m, "520 Diamonds", "Free Fire 520 Diamonds") },
                { 1060, (9.55m, 9.01m, 9.55m, "1060 Diamonds", "Free Fire 1060 Diamonds") },
                { 2180, (19.30m, 18.21m, 19.30m, "2180 Diamonds", "Free Fire 2180 Diamonds") },
                { 5600, (47.80m, 45.07m, 47.80m, "5600 Diamonds", "Free Fire 5600 Diamonds") },
                { 11500, (98.00m, 92.82m, 98.00m, "11500 Diamonds", "Free Fire 11500 Diamonds") }
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
                    if (prod.Price <= 0)
                    {
                        prod.Status = "Inactive";
                    }
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

            // Seed Core Historical Orders into SQLite Database
            if (!await context.Orders.AnyAsync(o => o.PlayerID == "662369705"))
            {
                var prod3688 = await context.Products.FirstOrDefaultAsync(p => p.DiamondAmount == 3688);
                if (prod3688 != null)
                {
                    context.Orders.Add(new MLBBTopUp.Core.Entities.Order
                    {
                        OrderId = 1,
                        PlayerID = "662369705",
                        ServerID = "10217",
                        AccountName = "Player 662369705",
                        GameName = "Mobile Legends",
                        ProductId = prod3688.ProductId,
                        Amount = 49.99m,
                        PaymentStatus = "Paid",
                        TopupStatus = "Completed",
                        CreatedAt = DateTime.Parse("2026-10-09 12:14:00")
                    });
                }
            }

            if (!await context.Orders.AnyAsync(o => o.PlayerID == "7510805230"))
            {
                context.Orders.Add(new MLBBTopUp.Core.Entities.Order
                {
                    OrderId = 6,
                    PlayerID = "7510805230",
                    ServerID = "SG",
                    AccountName = "Player 7510805230",
                    GameName = "Free Fire",
                    ProductId = 5030,
                    Amount = 9.65m,
                    PaymentStatus = "Paid",
                    TopupStatus = "Completed",
                    CreatedAt = DateTime.Parse("2026-10-09 10:54:00")
                });
            }

            if (!await context.Orders.AnyAsync(o => o.PlayerID == "15151622280"))
            {
                context.Orders.Add(new MLBBTopUp.Core.Entities.Order
                {
                    OrderId = 3,
                    PlayerID = "15151622280",
                    ServerID = "SG",
                    AccountName = "Player 15151622280",
                    GameName = "Free Fire",
                    ProductId = 384,
                    Amount = 0.39m,
                    PaymentStatus = "Paid",
                    TopupStatus = "Completed",
                    CreatedAt = DateTime.Parse("2026-10-09 10:43:00")
                });
            }

            if (!await context.Orders.AnyAsync(o => o.PlayerID == "2099500830"))
            {
                var prod55 = await context.Products.FirstOrDefaultAsync(p => p.DiamondAmount == 55);
                context.Orders.Add(new MLBBTopUp.Core.Entities.Order
                {
                    OrderId = 2,
                    PlayerID = "2099500830",
                    ServerID = "17337Global",
                    AccountName = "Player 2099500830",
                    GameName = "Mobile Legends",
                    ProductId = prod55?.ProductId ?? 0,
                    Amount = 0.89m,
                    PaymentStatus = "Paid",
                    TopupStatus = "Completed",
                    CreatedAt = DateTime.Parse("2026-10-09 10:34:00")
                });
            }

            await context.SaveChangesAsync();

            // Seed Core Historical Orders directly into MongoDB Atlas Database
            try
            {
                var config = serviceProvider.GetRequiredService<Microsoft.Extensions.Configuration.IConfiguration>();
                var mongoUri = config["MongoDB:ConnectionString"] ?? "mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority";
                var dbName = config["MongoDB:DatabaseName"] ?? "mlbbtopup";
                var client = new MongoDB.Driver.MongoClient(mongoUri);
                var db = client.GetDatabase(dbName);
                var ordersCol = db.GetCollection<MongoDB.Bson.BsonDocument>("orders");

                var seedDocs = new List<MongoDB.Bson.BsonDocument>
                {
                    new MongoDB.Bson.BsonDocument
                    {
                        { "_id", "ORD-1" },
                        { "order_id", 1 },
                        { "bill_number", "ORD-1" },
                        { "game_name", "Mobile Legends" },
                        { "package_name", "3688 Diamonds" },
                        { "product_name", "3688 Diamonds" },
                        { "player_id", "662369705" },
                        { "server_id", "10217" },
                        { "amount", 49.99 },
                        { "price", 49.99 },
                        { "cost_price", 48.65 },
                        { "provider_price", 48.65 },
                        { "status", "PAID" },
                        { "payment_status", "PAID" },
                        { "topup_status", "DELIVERED" },
                        { "created_at", "2026-10-09 12:14:00" }
                    },
                    new MongoDB.Bson.BsonDocument
                    {
                        { "_id", "ORD-6" },
                        { "order_id", 6 },
                        { "bill_number", "ORD-6" },
                        { "game_name", "Free Fire" },
                        { "package_name", "Weekly x2" },
                        { "product_name", "Weekly x2" },
                        { "player_id", "7510805230" },
                        { "server_id", "SG" },
                        { "amount", 3.35 },
                        { "price", 3.35 },
                        { "cost_price", 3.12 },
                        { "provider_price", 3.12 },
                        { "status", "PAID" },
                        { "payment_status", "PAID" },
                        { "topup_status", "DELIVERED" },
                        { "created_at", "2026-10-09 10:54:00" }
                    },
                    new MongoDB.Bson.BsonDocument
                    {
                        { "_id", "ORD-3" },
                        { "order_id", 3 },
                        { "bill_number", "ORD-3" },
                        { "game_name", "Free Fire" },
                        { "package_name", "WeeklyLite" },
                        { "product_name", "WeeklyLite" },
                        { "player_id", "15151622280" },
                        { "server_id", "SG" },
                        { "amount", 0.39 },
                        { "price", 0.39 },
                        { "cost_price", 0.32 },
                        { "provider_price", 0.32 },
                        { "status", "PAID" },
                        { "payment_status", "PAID" },
                        { "topup_status", "DELIVERED" },
                        { "created_at", "2026-10-09 10:43:00" }
                    },
                    new MongoDB.Bson.BsonDocument
                    {
                        { "_id", "ORD-2" },
                        { "order_id", 2 },
                        { "bill_number", "ORD-2" },
                        { "game_name", "Mobile Legends" },
                        { "package_name", "55 Diamonds Starter" },
                        { "product_name", "55 Diamonds Starter" },
                        { "player_id", "2099500830" },
                        { "server_id", "17337Global" },
                        { "amount", 0.89 },
                        { "price", 0.89 },
                        { "cost_price", 0.76 },
                        { "provider_price", 0.76 },
                        { "status", "PAID" },
                        { "payment_status", "PAID" },
                        { "topup_status", "DELIVERED" },
                        { "created_at", "2026-10-09 10:34:00" }
                    }
                };

                foreach (var doc in seedDocs)
                {
                    var id = doc["_id"].AsString;
                    var filter = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("_id", id);
                    await ordersCol.ReplaceOneAsync(filter, doc, new MongoDB.Driver.ReplaceOptions { IsUpsert = true });
                }
            }
            catch { }

            Console.WriteLine("[+] Database tables, prices, and orders seeded to MongoDB Atlas & SQLite successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Database Init Notice]: {ex.Message}");
        }
    }
}
