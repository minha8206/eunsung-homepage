
$ErrorActionPreference = 'Continue'
$src = [System.IO.Path]::Combine($env:USERPROFILE, "OneDrive", [System.Text.Encoding]::UTF8.GetString([byte[]]@(235,172,184,236,132,156)), [System.Text.Encoding]::UTF8.GetString([byte[]]@(236,185,180,236,185,180,236,150,164,237,131,161,32,235,176,155,236,154,180,32,237,140,140,236,151,188)))
Write-Host "Src path: $src"
Write-Host "Exists: $(Test-Path $src)"
if (Test-Path $src) {
    $files = Get-ChildItem $src -Filter "*277*"
    $files | ForEach-Object { Write-Host $_.Name }
}
