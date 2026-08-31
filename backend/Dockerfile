FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MLBBTopUp.Core/MLBBTopUp.Core.csproj MLBBTopUp.Core/
COPY MLBBTopUp.Infrastructure/MLBBTopUp.Infrastructure.csproj MLBBTopUp.Infrastructure/
COPY MLBBTopUp.API/MLBBTopUp.API.csproj MLBBTopUp.API/

RUN dotnet restore MLBBTopUp.API/MLBBTopUp.API.csproj

COPY . .

WORKDIR /src/MLBBTopUp.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
USER root
WORKDIR /app
COPY --from=build /app/publish .

# Create writable data directory for SQLite database
RUN mkdir -p /app/data && chmod -R 777 /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/mlbbtopup.db"

ENTRYPOINT ["dotnet", "MLBBTopUp.API.dll"]
