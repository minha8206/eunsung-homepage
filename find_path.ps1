
$ErrorActionPreference = "Continue"
$out = "C:\Users\user-pc\Claude\Projects\cowork\path_check.txt"
$kakao = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String("dM50ziTGodEgABu8QMcgAAzTfMc="))
$munse = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String("OLscwQ=="))

$results = @()
$results += "OneDrive env: $env:OneDrive"
$results += "OneDriveConsumer: $env:OneDriveConsumer"
$results += "UserProfile: $env:UserProfile"

# Check OneDrive paths
$onedrivePaths = @($env:OneDrive, $env:OneDriveConsumer, "$env:UserProfile\OneDrive")
foreach ($od in $onedrivePaths) {
    if ($od -and $od -ne "") {
        $testPath = "$od\$munse\$kakao"
        $exists = Test-Path $testPath
        $results += "Path: $testPath => $exists"
        if ($exists) {
            $files = Get-ChildItem $testPath -Filter "*277*" | Select-Object -ExpandProperty Name
            $results += "  Files: $($files -join ', ')"
        }
    }
}

$results | Out-File $out -Encoding UTF8
Read-Host "Done - press Enter"
