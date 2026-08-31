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
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV ASPNETCORE_HTTP_PORTS=5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "MLBBTopUp.API.dll"]
