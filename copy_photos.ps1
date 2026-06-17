$src = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String("QwA6AFwAVQBzAGUAcgBzAFwAdQBzAGUAcgAtAHAAYwBcAE8AbgBlAEQAcgBpAHYAZQBcADi7HMFcAHTOdM4kxqHRIAAbvEDHIAAM03zH"))
$dst = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String("QwA6AFwAVQBzAGUAcgBzAFwAdQBzAGUAcgAtAHAAYwBcAEMAbABhAHUAZABlAFwAUAByAG8AagBlAGMAdABzAFwAYwBvAHcAbwByAGsAXABpAG0AYQBnAGUAcwBcAGMAYQBzAGUAcwA="))
Write-Host "Src: $src"
Write-Host "Src exists: $(Test-Path $src)"
Copy-Item (Join-Path $src "KakaoTalk_20260616_153941_277_03.jpg") (Join-Path $dst "seongsu-01.jpg") -Force -ErrorAction SilentlyContinue
Copy-Item (Join-Path $src "KakaoTalk_20260616_153941_277_16.jpg") (Join-Path $dst "seongsu-02.jpg") -Force -ErrorAction SilentlyContinue
Copy-Item (Join-Path $src "KakaoTalk_20260616_153941_277_19.jpg") (Join-Path $dst "seongsu-03.jpg") -Force -ErrorAction SilentlyContinue
Copy-Item (Join-Path $src "KakaoTalk_20260616_153941_277_22.jpg") (Join-Path $dst "seongsu-04.jpg") -Force -ErrorAction SilentlyContinue
"Done" | Out-File (Join-Path $dst "copy_done.txt") -Force
Write-Host "Copy complete"
Read-Host "Press Enter to exit"