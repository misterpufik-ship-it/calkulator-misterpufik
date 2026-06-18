Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

$ErrorActionPreference = "SilentlyContinue"

$CodexHome = Join-Path $env:USERPROFILE ".codex"
$SessionsRoot = Join-Path $CodexHome "sessions"
$RefreshMs = 2000
$MaxTailLines = 800

function Format-Count {
    param([double]$Value)

    if ($null -eq $Value) { return "n/a" }
    if ($Value -ge 1000000) { return ("{0:N1}M" -f ($Value / 1000000)) }
    if ($Value -ge 1000) { return ("{0:N1}K" -f ($Value / 1000)) }
    return ("{0:N0}" -f $Value)
}

function Format-Reset {
    param($UnixSeconds)

    if ($null -eq $UnixSeconds) { return "reset n/a" }

    try {
        $reset = [DateTimeOffset]::FromUnixTimeSeconds([int64]$UnixSeconds).ToLocalTime()
        $remaining = $reset - [DateTimeOffset]::Now
        if ($remaining.TotalSeconds -le 0) { return "reset now" }
        if ($remaining.TotalDays -ge 1) { return ("reset {0:N0}d {1:N0}h" -f [math]::Floor($remaining.TotalDays), $remaining.Hours) }
        if ($remaining.TotalHours -ge 1) { return ("reset {0:N0}h {1:N0}m" -f [math]::Floor($remaining.TotalHours), $remaining.Minutes) }
        return ("reset {0:N0}m" -f [math]::Max(1, [math]::Ceiling($remaining.TotalMinutes)))
    }
    catch {
        return "reset n/a"
    }
}

function Get-LatestTokenCount {
    if (-not (Test-Path -LiteralPath $SessionsRoot)) {
        return $null
    }

    $session = Get-ChildItem -LiteralPath $SessionsRoot -Recurse -Filter "*.jsonl" |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if ($null -eq $session) {
        return $null
    }

    $lines = Get-Content -LiteralPath $session.FullName -Tail $MaxTailLines
    for ($i = $lines.Count - 1; $i -ge 0; $i--) {
        try {
            $event = $lines[$i] | ConvertFrom-Json
            if ($event.type -eq "event_msg" -and $event.payload.type -eq "token_count") {
                return [pscustomobject]@{
                    Session = $session
                    Event = $event
                }
            }
        }
        catch {
        }
    }

    return [pscustomobject]@{
        Session = $session
        Event = $null
    }
}

function New-Text {
    param(
        [string]$Name,
        [double]$Size = 12,
        [string]$Weight = "Normal",
        [string]$Color = "#F4F2EE"
    )

    $text = New-Object Windows.Controls.TextBlock
    $text.Name = $Name
    $text.FontSize = $Size
    $text.FontWeight = $Weight
    $text.Foreground = $Color
    $text.TextTrimming = "CharacterEllipsis"
    $text.Margin = "0,0,0,4"
    return $text
}

function New-Bar {
    param([string]$Name)

    $bar = New-Object Windows.Controls.ProgressBar
    $bar.Name = $Name
    $bar.Height = 6
    $bar.Minimum = 0
    $bar.Maximum = 100
    $bar.Margin = "0,0,0,8"
    return $bar
}

$window = New-Object Windows.Window
$window.Title = "Codex Status"
$window.Width = 260
$window.Height = 190
$window.Topmost = $true
$window.WindowStyle = "None"
$window.ResizeMode = "NoResize"
$window.AllowsTransparency = $true
$window.Background = "Transparent"
$window.ShowInTaskbar = $true

$screen = [System.Windows.SystemParameters]::WorkArea
$window.Left = $screen.Right - $window.Width - 18
$window.Top = $screen.Top + 18

$border = New-Object Windows.Controls.Border
$border.Background = "#E61B1D22"
$border.BorderBrush = "#5AFFFFFF"
$border.BorderThickness = 1
$border.CornerRadius = 8
$border.Padding = 12

$stack = New-Object Windows.Controls.StackPanel
$stack.Orientation = "Vertical"

$titleRow = New-Object Windows.Controls.DockPanel
$title = New-Text -Name "TitleText" -Size 13 -Weight "SemiBold"
$title.Text = "Codex status"
$close = New-Object Windows.Controls.Button
$close.Content = "x"
$close.Width = 22
$close.Height = 22
$close.Margin = "8,0,0,0"
$close.Padding = "0"
$close.ToolTip = "Close"
[Windows.Controls.DockPanel]::SetDock($close, "Right")
$titleRow.Children.Add($close) | Out-Null
$titleRow.Children.Add($title) | Out-Null

$contextText = New-Text -Name "ContextText" -Size 18 -Weight "Bold" -Color "#FFFFFF"
$contextBar = New-Bar -Name "ContextBar"
$tokensText = New-Text -Name "TokensText"
$primaryText = New-Text -Name "PrimaryText"
$primaryBar = New-Bar -Name "PrimaryBar"
$secondaryText = New-Text -Name "SecondaryText"
$secondaryBar = New-Bar -Name "SecondaryBar"
$sessionText = New-Text -Name "SessionText" -Size 10 -Color "#B7BBC6"

$stack.Children.Add($titleRow) | Out-Null
$stack.Children.Add($contextText) | Out-Null
$stack.Children.Add($contextBar) | Out-Null
$stack.Children.Add($tokensText) | Out-Null
$stack.Children.Add($primaryText) | Out-Null
$stack.Children.Add($primaryBar) | Out-Null
$stack.Children.Add($secondaryText) | Out-Null
$stack.Children.Add($secondaryBar) | Out-Null
$stack.Children.Add($sessionText) | Out-Null

$border.Child = $stack
$window.Content = $border

$border.Add_MouseLeftButtonDown({
    try { $window.DragMove() } catch {}
})

$close.Add_Click({
    $window.Close()
})

function Update-Widget {
    $snapshot = Get-LatestTokenCount
    if ($null -eq $snapshot) {
        $contextText.Text = "No Codex session"
        $tokensText.Text = "Waiting for local session files"
        $primaryText.Text = "Rate 5h: n/a"
        $secondaryText.Text = "Rate 7d: n/a"
        $sessionText.Text = ""
        $contextBar.Value = 0
        $primaryBar.Value = 0
        $secondaryBar.Value = 0
        return
    }

    if ($null -eq $snapshot.Event) {
        $contextText.Text = "No token data yet"
        $tokensText.Text = "Run /status once or send a Codex turn"
        $primaryText.Text = "Rate 5h: n/a"
        $secondaryText.Text = "Rate 7d: n/a"
        $sessionText.Text = $snapshot.Session.Name
        $contextBar.Value = 0
        $primaryBar.Value = 0
        $secondaryBar.Value = 0
        return
    }

    $payload = $snapshot.Event.payload
    $usage = $payload.info.total_token_usage
    $windowSize = [double]$payload.info.model_context_window
    $total = [double]$usage.total_tokens
    $contextPercent = 0
    if ($windowSize -gt 0) {
        $contextPercent = [math]::Min(100, [math]::Round(($total / $windowSize) * 100, 1))
    }
    $remaining = [math]::Max(0, $windowSize - $total)

    $primary = $payload.rate_limits.primary
    $secondary = $payload.rate_limits.secondary
    $primaryPercent = if ($null -ne $primary.used_percent) { [double]$primary.used_percent } else { 0 }
    $secondaryPercent = if ($null -ne $secondary.used_percent) { [double]$secondary.used_percent } else { 0 }

    $contextText.Text = "Context: $contextPercent% used"
    $contextBar.Value = $contextPercent
    $tokensText.Text = ("{0} used / {1} left" -f (Format-Count $total), (Format-Count $remaining))

    $primaryText.Text = ("Rate 5h: {0:N1}% used, {1}" -f $primaryPercent, (Format-Reset $primary.resets_at))
    $primaryBar.Value = [math]::Min(100, $primaryPercent)

    $secondaryText.Text = ("Rate 7d: {0:N1}% used, {1}" -f $secondaryPercent, (Format-Reset $secondary.resets_at))
    $secondaryBar.Value = [math]::Min(100, $secondaryPercent)

    $sessionText.Text = $snapshot.Session.Name
}

$timer = New-Object Windows.Threading.DispatcherTimer
$timer.Interval = [TimeSpan]::FromMilliseconds($RefreshMs)
$timer.Add_Tick({ Update-Widget })
$timer.Start()

Update-Widget
$window.ShowDialog() | Out-Null
