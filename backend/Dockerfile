FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY MLBBTopUp.Core/MLBBTopUp.Core.csproj MLBBTopUp.Core/
COPY MLBBTopUp.Infrastructure/MLBBTopUp.Infrastructure.csproj MLBBTopUp.Infrastructure/
COPY MLBBTopUp.API/MLBBTopUp.API.csproj MLBBTopUp.API/

# Restore dependencies
RUN dotnet restore MLBBTopUp.API/MLBBTopUp.API.csproj

# Copy the rest of the source code
COPY . .

# Build and publish
WORKDIR /src/MLBBTopUp.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Environment configuration
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

CMD ["sh", "-c", "dotnet MLBBTopUp.API.dll --urls http://0.0.0.0:${PORT:-5000}"]
