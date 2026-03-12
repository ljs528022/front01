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

Assert-Match 'activeDetailRoute\s*===\s*"privacy-muted-notifications-edit"' `
    "Privacy muted notifications detail route is not implemented."

Assert-Match 'data-privacy-mute-block-item="muted-notifications"' `
    "Muted notifications item is missing from privacy mute and block."

Assert-Match 'muted-notifications"[\s\S]*activeDetailRoute\s*=\s*"privacy-muted-notifications-edit"' `
    "Muted notifications item is not wired to the privacy detail route."

Assert-Match 'data-notification-muted-toggle="nonFollowing"' `
    "Muted notifications options are missing from the privacy route."

Assert-Match 'data-notification-muted-toggle="unverifiedPhone"' `
    "Muted notifications route is missing the full muted account options list."

Write-Host "PASS: privacy muted notifications screen is wired."
