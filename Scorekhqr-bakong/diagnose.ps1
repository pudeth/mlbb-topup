Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Python Installation Diagnostic" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Python installations..." -ForegroundColor Yellow
Write-Host ""

# Check PATH
Write-Host "1. Checking PATH for Python:" -ForegroundColor Cyan
$env:PATH -split ';' | Where-Object { $_ -like '*python*' } | ForEach-Object {
    Write-Host "   - $_" -ForegroundColor Gray
}
Write-Host ""

# Try different Python commands
Write-Host "2. Testing Python commands:" -ForegroundColor Cyan
$commands = @("python", "py", "python3")
foreach ($cmd in $commands) {
    Write-Host "   Testing '$cmd'..." -ForegroundColor Gray
    try {
        $output = & $cmd --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   [OK] $cmd works: $output" -ForegroundColor Green
        } else {
            Write-Host "   [FAIL] $cmd failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        }
    } catch {
        Write-Host "   [FAIL] $cmd not found or error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Check Windows Store aliases
Write-Host "3. Checking Windows Store aliases:" -ForegroundColor Cyan
$aliasPath = "$env:LOCALAPPDATA\Microsoft\WindowsApps"
if (Test-Path $aliasPath) {
    $pythonAliases = Get-ChildItem $aliasPath -Filter "python*.exe" -ErrorAction SilentlyContinue
    if ($pythonAliases) {
        Write-Host "   Found Python aliases (these may not work):" -ForegroundColor Yellow
        $pythonAliases | ForEach-Object {
            Write-Host "   - $($_.FullName)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   No Python aliases found" -ForegroundColor Green
    }
} else {
    Write-Host "   WindowsApps folder not found" -ForegroundColor Gray
}
Write-Host ""

# Check common Python installation locations
Write-Host "4. Checking common Python installation folders:" -ForegroundColor Cyan
$commonPaths = @(
    "$env:LOCALAPPDATA\Programs\Python",
    "C:\Python*",
    "C:\Program Files\Python*",
    "C:\Program Files (x86)\Python*"
)

$foundPython = $false
foreach ($path in $commonPaths) {
    $items = Get-ChildItem $path -ErrorAction SilentlyContinue
    if ($items) {
        Write-Host "   Found: $path" -ForegroundColor Green
        $items | ForEach-Object {
            Write-Host "      - $($_.FullName)" -ForegroundColor Gray
            $pythonExe = Join-Path $_.FullName "python.exe"
            if (Test-Path $pythonExe) {
                Write-Host "         python.exe exists!" -ForegroundColor Green
                $foundPython = $true
            }
        }
    }
}

if (-not $foundPython) {
    Write-Host "   No Python installations found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Diagnosis Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $foundPython) {
    Write-Host "RECOMMENDATION:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Python is not properly installed on your system." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Disable Windows Store Python aliases:" -ForegroundColor Cyan
    Write-Host "   - Open Settings"
    Write-Host "   - Go to Apps > App execution aliases"
    Write-Host "   - Turn OFF 'python.exe' and 'python3.exe'"
    Write-Host ""
    Write-Host "2. Install Python:" -ForegroundColor Cyan
    Write-Host "   - Go to https://www.python.org/downloads/"
    Write-Host "   - Download Python 3.8 or newer"
    Write-Host "   - Run the installer"
    Write-Host "   - CHECK 'Add Python to PATH' during installation!"
    Write-Host "   - Complete the installation"
    Write-Host ""
    Write-Host "3. Restart your terminal/PowerShell" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "4. Run this diagnostic again to verify" -ForegroundColor Cyan
    Write-Host ""
}

Read-Host "Press Enter to exit"
