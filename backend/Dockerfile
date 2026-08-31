# Fast Lightweight Build
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

# Copy project files and restore
COPY MLBBTopUp.Core/MLBBTopUp.Core.csproj MLBBTopUp.Core/
COPY MLBBTopUp.Infrastructure/MLBBTopUp.Infrastructure.csproj MLBBTopUp.Infrastructure/
COPY MLBBTopUp.API/MLBBTopUp.API.csproj MLBBTopUp.API/

RUN dotnet restore MLBBTopUp.API/MLBBTopUp.API.csproj

# Copy source and publish
COPY . .
WORKDIR /src/MLBBTopUp.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Ultra-fast 40MB Alpine Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Ensure data directory
RUN mkdir -p /app/data && chmod -R 777 /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/mlbbtopup.db"

ENTRYPOINT ["dotnet", "MLBBTopUp.API.dll"]
