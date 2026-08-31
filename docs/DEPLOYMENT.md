# Deployment Guide

This guide covers deploying your MLBB Top-Up website to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] Payment gateway integration is complete and tested
- [ ] Top-up provider integration is complete and tested
- [ ] Default admin password has been changed
- [ ] JWT secret key is secure and unique
- [ ] Database connection string uses production credentials
- [ ] CORS settings are configured for production domain
- [ ] HTTPS is enabled for both frontend and backend
- [ ] API keys are stored in environment variables
- [ ] Error logging is configured
- [ ] Backup strategy is in place

---

## Backend Deployment

### Option 1: Azure App Service (Recommended)

#### Step 1: Create Azure Resources

```bash
# Login to Azure
az login

# Create resource group
az group create --name mlbb-topup-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name mlbb-topup-plan \
  --resource-group mlbb-topup-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name mlbb-topup-api \
  --resource-group mlbb-topup-rg \
  --plan mlbb-topup-plan \
  --runtime "DOTNET|8.0"
```

#### Step 2: Configure Environment Variables

```bash
# Set connection string
az webapp config connection-string set \
  --name mlbb-topup-api \
  --resource-group mlbb-topup-rg \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:yourserver.database.windows.net,1433;Database=MLBBTopUp;User ID=sqladmin;Password=YourPassword;Encrypt=True;"

# Set JWT settings
az webapp config appsettings set \
  --name mlbb-topup-api \
  --resource-group mlbb-topup-rg \
  --settings \
    Jwt__SecretKey="your-production-secret-key-min-32-characters" \
    Jwt__Issuer="MLBBTopUpAPI" \
    Jwt__Audience="MLBBTopUpClient" \
    PaymentGateway__ApiKey="your-payment-api-key" \
    TopUpProvider__ApiKey="your-topup-api-key"
```

#### Step 3: Deploy

```bash
cd backend/MLBBTopUp.API

# Publish
dotnet publish -c Release -o ./publish

# Create deployment package
cd publish
zip -r ../deploy.zip .
cd ..

# Deploy to Azure
az webapp deployment source config-zip \
  --name mlbb-topup-api \
  --resource-group mlbb-topup-rg \
  --src deploy.zip
```

#### Step 4: Enable HTTPS

```bash
# Enable HTTPS only
az webapp update \
  --name mlbb-topup-api \
  --resource-group mlbb-topup-rg \
  --https-only true
```

### Option 2: Docker Container

#### Create Dockerfile

Create `backend/MLBBTopUp.API/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MLBBTopUp.API/MLBBTopUp.API.csproj", "MLBBTopUp.API/"]
COPY ["MLBBTopUp.Core/MLBBTopUp.Core.csproj", "MLBBTopUp.Core/"]
COPY ["MLBBTopUp.Infrastructure/MLBBTopUp.Infrastructure.csproj", "MLBBTopUp.Infrastructure/"]
RUN dotnet restore "MLBBTopUp.API/MLBBTopUp.API.csproj"
COPY . .
WORKDIR "/src/MLBBTopUp.API"
RUN dotnet build "MLBBTopUp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MLBBTopUp.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MLBBTopUp.API.dll"]
```

#### Build and Deploy

```bash
cd backend

# Build image
docker build -t mlbb-topup-api -f MLBBTopUp.API/Dockerfile .

# Run container
docker run -d \
  -p 80:80 \
  -p 443:443 \
  -e ConnectionStrings__DefaultConnection="your-connection-string" \
  -e Jwt__SecretKey="your-jwt-secret" \
  --name mlbb-topup-api \
  mlbb-topup-api
```

### Option 3: Traditional Server (IIS/Linux)

#### Windows IIS

1. Install .NET 8.0 Hosting Bundle
2. Publish application:
   ```bash
   dotnet publish -c Release -o C:\inetpub\mlbb-topup
   ```
3. Create IIS Site pointing to publish folder
4. Configure Application Pool (.NET CLR Version: No Managed Code)
5. Enable HTTPS with SSL certificate

#### Linux (Nginx + Systemd)

1. Publish application:
   ```bash
   dotnet publish -c Release -o /var/www/mlbb-topup
   ```

2. Create systemd service `/etc/systemd/system/mlbb-topup.service`:
   ```ini
   [Unit]
   Description=MLBB Top-Up API
   
   [Service]
   WorkingDirectory=/var/www/mlbb-topup
   ExecStart=/usr/bin/dotnet /var/www/mlbb-topup/MLBBTopUp.API.dll
   Restart=always
   RestartSec=10
   SyslogIdentifier=mlbb-topup
   User=www-data
   Environment=ASPNETCORE_ENVIRONMENT=Production
   
   [Install]
   WantedBy=multi-user.target
   ```

3. Configure Nginx as reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection keep-alive;
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Update `.env.production`:
   ```
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

3. Deploy:
   ```bash
   cd frontend
   vercel --prod
   ```

### Option 2: Netlify

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy via Netlify CLI or drag-and-drop:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

3. Configure environment variables in Netlify dashboard:
   - `REACT_APP_API_URL`: Your backend API URL

### Option 3: Azure Static Web Apps

```bash
# Create Static Web App
az staticwebapp create \
  --name mlbb-topup-frontend \
  --resource-group mlbb-topup-rg \
  --source frontend \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

### Option 4: Traditional Web Server

#### Nginx

1. Build:
   ```bash
   cd frontend
   npm run build
   ```

2. Copy to web root:
   ```bash
   sudo cp -r build/* /var/www/html/
   ```

3. Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

## Database Setup

### Azure SQL Database

1. Create Azure SQL Server:
   ```bash
   az sql server create \
     --name mlbb-topup-sql \
     --resource-group mlbb-topup-rg \
     --location eastus \
     --admin-user sqladmin \
     --admin-password YourSecurePassword123!
   ```

2. Create database:
   ```bash
   az sql db create \
     --name MLBBTopUp \
     --server mlbb-topup-sql \
     --resource-group mlbb-topup-rg \
     --service-objective S0
   ```

3. Configure firewall:
   ```bash
   az sql server firewall-rule create \
     --server mlbb-topup-sql \
     --resource-group mlbb-topup-rg \
     --name AllowAzureServices \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0
   ```

4. Run migrations:
   ```bash
   dotnet ef database update --project MLBBTopUp.API
   ```

### Production SQL Server

1. Restore database backup or run migrations
2. Create login for application
3. Grant appropriate permissions
4. Enable SSL/TLS encryption
5. Configure backup schedule

---

## Environment Variables

### Backend Environment Variables

```bash
# Database
ConnectionStrings__DefaultConnection="your-connection-string"

# JWT
Jwt__SecretKey="your-256-bit-secret-key"
Jwt__Issuer="MLBBTopUpAPI"
Jwt__Audience="MLBBTopUpClient"
Jwt__ExpiryInMinutes="60"

# Payment Gateway
PaymentGateway__Provider="Stripe"
PaymentGateway__ApiKey="your-api-key"
PaymentGateway__SecretKey="your-secret-key"
PaymentGateway__WebhookSecret="your-webhook-secret"

# Top-Up Provider
TopUpProvider__Provider="UniPin"
TopUpProvider__ApiKey="your-api-key"
TopUpProvider__ApiUrl="https://api.provider.com"

# CORS
AllowedOrigins="https://yourdomain.com,https://www.yourdomain.com"
```

### Frontend Environment Variables

```bash
REACT_APP_API_URL=https://api.yourdomain.com/api
```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Backend API is accessible at production URL
- [ ] Swagger UI is disabled in production
- [ ] Frontend loads correctly
- [ ] API calls from frontend work
- [ ] Authentication flow works
- [ ] Order creation works
- [ ] Admin dashboard is accessible

### 2. Security Checklist

- [ ] HTTPS is enforced on both frontend and backend
- [ ] Default admin password has been changed
- [ ] API keys are not exposed in client-side code
- [ ] CORS is configured for production domain only
- [ ] SQL injection protection is enabled
- [ ] Rate limiting is configured
- [ ] Error messages don't expose sensitive information

### 3. Monitoring Setup

#### Application Insights (Azure)

```bash
# Add Application Insights
az monitor app-insights component create \
  --app mlbb-topup-insights \
  --location eastus \
  --resource-group mlbb-topup-rg
```

Add to `appsettings.json`:
```json
{
  "ApplicationInsights": {
    "InstrumentationKey": "your-key"
  }
}
```

#### Health Checks

Add health check endpoint in `Program.cs`:
```csharp
app.MapHealthChecks("/health");
```

### 4. Backup Strategy

- Enable automated backups for database
- Schedule regular database exports
- Store backups in separate location
- Test backup restoration process

### 5. Performance Optimization

- Enable response compression
- Configure caching headers
- Use CDN for frontend static assets
- Optimize database indexes
- Enable application-level caching

---

## Troubleshooting

### Issue: API returns 500 errors

**Check:**
1. Database connection string
2. Application logs
3. Missing environment variables

### Issue: Frontend can't connect to API

**Check:**
1. CORS configuration
2. API URL in frontend .env
3. Network/firewall rules

### Issue: Slow performance

**Solutions:**
1. Enable response compression
2. Add database indexes
3. Implement caching
4. Use CDN
5. Scale up resources

---

## Scaling Considerations

### Horizontal Scaling

- Use Azure App Service scale-out
- Implement session state externalization
- Use distributed caching (Redis)

### Database Scaling

- Upgrade to higher tier
- Implement read replicas
- Optimize queries and indexes

### CDN Integration

- Serve static assets via CDN
- Cache API responses where appropriate

---

## Support

For deployment issues:
- Check Azure/Vercel/Netlify documentation
- Review application logs
- Contact hosting provider support
