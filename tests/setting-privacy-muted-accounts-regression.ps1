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

Assert-Match 'activeDetailRoute\s*===\s*"privacy-muted-accounts-edit"' `
    "Muted accounts detail route is not implemented."

Assert-Match 'data-privacy-mute-block-item="muted-accounts"' `
    "Muted accounts list row is missing."

Assert-Match 'data-privacy-muted-accounts-link' `
    "Muted accounts help link is missing."

Assert-Match 'privacy-muted-accounts-editor__empty-title' `
    "Muted accounts empty state heading is missing."

Write-Host "PASS: muted accounts detail screen is wired."
