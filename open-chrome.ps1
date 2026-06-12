$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$port = $null
foreach ($candidate in 4173..4190) {
  $listener = $null
  try {
    $listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Parse("127.0.0.1"), $candidate)
    $listener.Start()
    $listener.Stop()
    $port = $candidate
    break
  } catch {
    if ($listener) {
      $listener.Stop()
    }
  }
}

if (-not $port) {
  throw "No free port found for the site."
}

$env:PORT = $port
$python = "C:\Users\mrpuf\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
Start-Process -FilePath $python -ArgumentList "server.py" -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Seconds 2
Start-Process "chrome.exe" "http://127.0.0.1:$port"
