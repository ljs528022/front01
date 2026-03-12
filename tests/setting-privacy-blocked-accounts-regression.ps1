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

Assert-Match 'activeDetailRoute\s*===\s*"privacy-blocked-accounts-edit"' `
    "Blocked accounts detail route is not implemented."

Assert-Match 'data-privacy-mute-block-item="blocked-accounts"' `
    "Blocked accounts list row is missing."

Assert-Match 'data-privacy-blocked-accounts-link' `
    "Blocked accounts help link is missing."

Assert-Match 'privacy-blocked-accounts-editor__empty-title' `
    "Blocked accounts empty state heading is missing."

Write-Host "PASS: blocked accounts detail screen is wired."
