# Build-all script for OneWorld MFEs
# Installs and builds each MFE, writing logs to ../build-logs/<mfe>-install.log and -build.log
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\build-all-mfes.ps1

$root = Resolve-Path "..\"
$projectRoot = Join-Path $PSScriptRoot ".."
$logDir = Join-Path $projectRoot "build-logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

$mfePaths = @(
    "e:\Microservices\OneWorld\frontend\post-mfe",
    "e:\Microservices\OneWorld\frontend\feed-mfe",
    "e:\Microservices\OneWorld\frontend\user-mfe",
    "e:\Microservices\OneWorld\frontend\media-mfe",
    "e:\Microservices\OneWorld\frontend\search-mfe",
    "e:\Microservices\OneWorld\frontend\ai-mfe",
    "e:\Microservices\OneWorld\frontend\messaging-mfe",
    "e:\Microservices\OneWorld\frontend\comment-mfe",
    "e:\Microservices\OneWorld\frontend\analytics-mfe",
    "e:\Microservices\OneWorld\frontend\shell"
)

foreach ($p in $mfePaths) {
    $name = Split-Path $p -Leaf
    Write-Output "\n=== Processing $name ($p) ==="
    if (-not (Test-Path $p)) {
        Write-Output "Skipping $name - path not found"
        continue
    }

    Push-Location $p
    try {
        $installLog = Join-Path $logDir "$name-install.log"
        $buildLog = Join-Path $logDir "$name-build.log"

        Write-Output "Installing dependencies for $name..."
        # npm install with silent flags and redirect
        npm install --no-audit --no-fund > $installLog 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Output "Install failed for $name - see $installLog"
            Pop-Location; continue
        }
        Write-Output "Install finished for $name"

        Write-Output "Building $name..."
        npm run build --silent > $buildLog 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Output "Build failed for $name - see $buildLog"
            Pop-Location; continue
        }
        Write-Output "Build succeeded for $name"
    } catch {
        # Use format operator to avoid ambiguous interpolation like "$name: $_"
        Write-Output ("Exception while building {0}: {1}" -f $name, $_)
    } finally {
        Pop-Location
    }
}

Write-Output "\nAll jobs finished. Logs are under: $logDir"
Get-ChildItem -Path $logDir | Select-Object Name,Length | Format-Table -AutoSize
