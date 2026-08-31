#!/usr/bin/env pwsh
# KHQR Integration Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MLBB Top-Up - KHQR Integration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if KHQR API is accessible
Write-Host "[1/4] Checking KHQR API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ KHQR API is running" -ForegroundColor Green
} catch {
    Write-Host "✗ KHQR API is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Starting KHQR API..." -ForegroundColor Yellow
    
    Push-Location "Scorekhqr-bakong"
    
    # Check if Python virtual environment exists
    if (Test-Path "venv\Scripts\python.exe") {
        Write-Host "  - Activating virtual environment..." -ForegroundColor Gray
        & "venv\Scripts\python.exe" "api.py" 
    } else {
        Write-Host "  - Virtual environment not found. Running setup..." -ForegroundColor Gray
        if (Test-Path "setup.bat") {
            & ".\setup.bat"
        } else {
            Write-Host "  ✗ Setup script not found!" -ForegroundColor Red
            Pop-Location
            exit 1
        }
    }
    
    Pop-Location
    Write-Host "✓ KHQR API started" -ForegroundColor Green
}
Write-Host ""

# Step 2: Apply database migrations
Write-Host "[2/4] Applying database migrations..." -ForegroundColor Yellow
Push-Location "backend"

# Check if migration already exists
$migrationExists = dotnet ef migrations list --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API 2>&1 | Select-String "AddKHQRFields"

if (!$migrationExists) {
    Write-Host "  - Creating migration..." -ForegroundColor Gray
    dotnet ef migrations add AddKHQRFields --project MLBBTopUp.Infrastructure --startup-project MLBBTopUp.API
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Migration created" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to create migration" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} else {
    Write-Host "  - Migration already exists" -ForegroundColor Gray
}

Write-Host "  - Updating database..." -ForegroundColor Gray
dotnet ef database update --project MLBBTopUp.API

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database updated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to update database" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host ""

# Step 3: Build backend
Write-Host "[3/4] Building backend..." -ForegroundColor Yellow
Push-Location "backend\MLBBTopUp.API"

dotnet build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to build backend" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host ""

# Step 4: Verify configuration
Write-Host "[4/4] Verifying configuration..." -ForegroundColor Yellow

$appsettingsPath = "backend\MLBBTopUp.API\appsettings.json"
$appsettings = Get-Content $appsettingsPath | ConvertFrom-Json

if ($appsettings.KHQR.ApiUrl) {
    Write-Host "  ✓ KHQR API URL configured: $($appsettings.KHQR.ApiUrl)" -ForegroundColor Green
} else {
    Write-Host "  ✗ KHQR API URL not configured" -ForegroundColor Red
}

$khqrEnvPath = "Scorekhqr-bakong\.env"
if (Test-Path $khqrEnvPath) {
    Write-Host "  ✓ KHQR .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content $khqrEnvPath
    $bakongToken = $envContent | Select-String "BAKONG_TOKEN=" | Select-Object -First 1
    
    if ($bakongToken) {
        Write-Host "  ✓ Bakong token configured" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Bakong token not found in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ KHQR .env file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start KHQR API:  cd Scorekhqr-bakong && start_all.bat" -ForegroundColor White
Write-Host "2. Start Backend:   cd backend\MLBBTopUp.API && dotnet run" -ForegroundColor White
Write-Host "3. Frontend is already running on http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Documentation: backend\KHQR-INTEGRATION.md" -ForegroundColor Cyan
Write-Host ""
