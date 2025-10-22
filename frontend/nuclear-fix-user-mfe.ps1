#!/usr/bin/env pwsh
# NUCLEAR FIX: Complete rebuild and cache clear for user-mfe

Write-Host "🔥 NUCLEAR FIX: Clearing all caches and rebuilding user-mfe" -ForegroundColor Yellow
Write-Host ""

# Step 1: Kill any existing user-mfe processes
Write-Host "Step 1: Stopping existing user-mfe processes..." -ForegroundColor Cyan
$processes = Get-Process | Where-Object { $_.ProcessName -like "*node*" -and $_.MainWindowTitle -like "*4301*" }
if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "✅ Stopped existing processes" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No existing user-mfe processes found" -ForegroundColor Gray
}

# Step 2: Navigate to user-mfe directory
$userMfePath = "E:\Microservices\OneWorld\frontend\user-mfe"
if (Test-Path $userMfePath) {
    Set-Location $userMfePath
    Write-Host "✅ Navigated to: $userMfePath" -ForegroundColor Green
} else {
    Write-Host "❌ Cannot find user-mfe directory: $userMfePath" -ForegroundColor Red
    exit 1
}

# Step 3: Clear all caches
Write-Host ""
Write-Host "Step 2: Clearing all build caches..." -ForegroundColor Cyan

$cacheDirs = @(
    "node_modules\.cache",
    "build",
    "dist",
    ".webpack-cache"
)

foreach ($dir in $cacheDirs) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force
        Write-Host "✅ Removed: $dir" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ Not found: $dir" -ForegroundColor Gray
    }
}

# Step 4: Clean npm cache
Write-Host ""
Write-Host "Step 3: Cleaning npm cache..." -ForegroundColor Cyan
npm cache clean --force
Write-Host "✅ NPM cache cleared" -ForegroundColor Green

# Step 5: Reinstall dependencies
Write-Host ""
Write-Host "Step 4: Reinstalling dependencies..." -ForegroundColor Cyan
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
Write-Host "✅ Dependencies reinstalled" -ForegroundColor Green

# Step 6: Start the service
Write-Host ""
Write-Host "Step 5: Starting user-mfe service..." -ForegroundColor Cyan
Write-Host "🚀 Starting on port 4301..." -ForegroundColor Yellow
Write-Host ""
Write-Host "INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Wait for 'Compiled successfully!' message" -ForegroundColor White
Write-Host "2. In browser: Press Ctrl+Shift+R to hard refresh" -ForegroundColor White
Write-Host "3. Go to: http://localhost:4200/login" -ForegroundColor White
Write-Host "4. Should see login form without errors" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop this service when needed" -ForegroundColor Gray
Write-Host ""

# Start the service
npm start