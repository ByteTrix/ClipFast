# Define source and destination paths
$SourcePath = "D:\ClipFast\src"
$DistDir = "D:\ClipFast\dist"
$ChromeDir = Join-Path $DistDir "chrome"
$FirefoxDir = Join-Path $DistDir "firefox"

# Clean up existing dist folder if any
Write-Output "Cleaning up old dist directory..."
if (Test-Path $DistDir) {
    Remove-Item -Recurse -Force $DistDir
}

# Create new directory structure
Write-Output "Creating directory structure..."
New-Item -ItemType Directory -Path $ChromeDir -Force | Out-Null
New-Item -ItemType Directory -Path $FirefoxDir -Force | Out-Null

# Copy files for Chrome
Write-Output "Setting up Chrome extension..."
Copy-Item -Path (Join-Path $SourcePath "background_chrome.js") -Destination (Join-Path $ChromeDir "background.js") -Force
Copy-Item -Path (Join-Path $SourcePath "manifest.chrome.json") -Destination (Join-Path $ChromeDir "manifest.json") -Force
Copy-Item -Path (Join-Path $SourcePath "urlpopup.js") -Destination $ChromeDir -Force
if (Test-Path (Join-Path $SourcePath "icons")) {
    $ChromeIconsDir = Join-Path $ChromeDir "icons"
    New-Item -ItemType Directory -Path $ChromeIconsDir -Force | Out-Null
    Copy-Item -Path (Join-Path $SourcePath "icons\*") -Destination $ChromeIconsDir -Recurse -Force
} else {
    Write-Output "No icons folder found for Chrome."
}

# Copy files for Firefox
Write-Output "Setting up Firefox extension..."
Copy-Item -Path (Join-Path $SourcePath "background.js") -Destination $FirefoxDir -Force
Copy-Item -Path (Join-Path $SourcePath "manifest.json") -Destination $FirefoxDir -Force
Copy-Item -Path (Join-Path $SourcePath "urlpopup.js") -Destination $FirefoxDir -Force
if (Test-Path (Join-Path $SourcePath "icons")) {
    $FirefoxIconsDir = Join-Path $FirefoxDir "icons"
    New-Item -ItemType Directory -Path $FirefoxIconsDir -Force | Out-Null
    Copy-Item -Path (Join-Path $SourcePath "icons\*") -Destination $FirefoxIconsDir -Recurse -Force
} else {
    Write-Output "No icons folder found for Firefox."
}

Write-Output "Build complete. Extensions are available in 'D:\ClipFast\dist'."
