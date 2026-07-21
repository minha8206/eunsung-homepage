# Builds assets/story-montage.mp4 from assets/story-src/*.mov + p1-4.png
# Wraps build-story.py; locates ffmpeg/python even if PATH hasn't refreshed yet.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

function Find-Exe($name, $wingetGlob) {
    $found2 = Get-ChildItem -Path "$env:LOCALAPPDATA\Programs\Python" -Recurse -Filter $name -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found2) { return $found2.FullName }
    $found = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter $name -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { return $found.FullName }
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if ($cmd -and $cmd.Source -notmatch "WindowsApps") { return $cmd.Source }
    throw "$name not found. Install with: winget install $wingetGlob"
}

$ffmpeg = Find-Exe "ffmpeg.exe" "Gyan.FFmpeg"
$python = Find-Exe "python.exe" "Python.Python.3.12"

Write-Host "ffmpeg: $ffmpeg"
Write-Host "python: $python"

$env:FFMPEG_BIN = $ffmpeg
$env:FFPROBE_BIN = ($ffmpeg -replace "ffmpeg\.exe$", "ffprobe.exe")

& $python "$PSScriptRoot\build-story.py"
