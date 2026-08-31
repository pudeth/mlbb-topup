# Database Migrations Guide

## Prerequisites

Make sure you have the following installed:
- .NET 8.0 SDK
- SQL Server or MySQL
- Entity Framework Core tools

## Install EF Core Tools

If you don't have EF Core tools installed, run:

```bash
dotnet tool install --global dotnet-ef
```

Or update existing tools:

```bash
dotnet tool update --global dotnet-ef
```

## Creating Migrations

Navigate to the backend directory:

```bash
cd backend
```

### Create Initial Migration

```bash
dotnet ef migrations add InitialCreate --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
```

### Create Additional Migrations

After modifying entity models, create a new migration:

```bash
dotnet ef migrations add YourMigrationName --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
```

## Applying Migrations

### Update Database to Latest Migration

```bash
dotnet ef database update --project MLBBTopUp.API
```

### Update to Specific Migration

```bash
dotnet ef database update MigrationName --project MLBBTopUp.API
```

### Rollback Last Migration

```bash
dotnet ef database update PreviousMigrationName --project MLBBTopUp.API
```

## Removing Migrations

Remove the last migration (only if not applied to database):

```bash
dotnet ef migrations remove --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
```

## Generating SQL Script

Generate SQL script for migrations:

```bash
dotnet ef migrations script --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API --output migration.sql
```

Generate SQL for specific migration range:

```bash
dotnet ef migrations script FromMigration ToMigration --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API --output migration.sql
```

## Viewing Migrations

List all migrations:

```bash
dotnet ef migrations list --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
```

## Database Connection String

Update the connection string in `MLBBTopUp.API/appsettings.json`:

### For SQL Server:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MLBBTopUp;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
  }
}
```

### For MySQL:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MLBBTopUp;User=root;Password=YourPassword;"
  }
}
```

## Troubleshooting

### Error: "Build failed"
Make sure all projects compile successfully:
```bash
dotnet build
```

### Error: "No DbContext was found"
Ensure you're running the command from the backend directory and specifying the correct projects.

### Error: "Cannot connect to database"
- Verify SQL Server is running
- Check connection string in appsettings.json
- Ensure firewall allows connection
- Test connection with SQL Server Management Studio or Azure Data Studio

## Quick Setup Commands

For first-time setup, run these commands in order:

```bash
# Navigate to backend directory
cd backend

# Restore packages
dotnet restore

# Create initial migration
dotnet ef migrations add InitialCreate --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API

# Apply migration to database
dotnet ef database update --project MLBBTopUp.API

# Run the API
cd MLBBTopUp.API
dotnet run
```

## Seeded Data

The initial migration includes:
- 8 diamond packages (50 to 5000 diamonds)
- 1 admin user:
  - Email: admin@mlbbtopup.com
  - Password: Admin@123

⚠️ **Change the default admin password immediately in production!**
