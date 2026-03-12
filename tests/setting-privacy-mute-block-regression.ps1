$ErrorActionPreference = "Stop"

$scriptPath = Join-Path $PSScriptRoot "..\static\js\setting\event.js"
$source = Get-Content -Path $scriptPath -Raw

function Assert-Match {
    param(
        [string]$Pattern,
        [string]$Message
    )

    if ($source -notmatch $Pattern) {
        throw $Message
    }
}

Assert-Match 'activeDetailRoute\s*===\s*"privacy-mute-block-edit"' `
    "Mute and block detail route is not implemented."

Assert-Match '"/settings/privacy_and_safety/mute_and_block"' `
    "Mute and block navigation target is missing."

Assert-Match 'data-privacy-mute-block-item="blocked-accounts"' `
    "Blocked accounts row is missing."

Assert-Match 'data-privacy-mute-block-item="muted-notifications"' `
    "Muted notifications row is missing."

Write-Host "PASS: privacy mute and block screen is wired."
