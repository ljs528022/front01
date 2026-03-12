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

Assert-Match 'href:\s*"/settings/privacy_and_safety/your_posts"' `
    "Your posts entry route is missing."

Assert-Match 'activeDetailRoute\s*===\s*"privacy-posts-edit"' `
    "Privacy posts detail route is not implemented."

Assert-Match 'data-privacy-posts-sensitive-toggle' `
    "Sensitive media toggle markup is missing."

Assert-Match 'class="privacy-posts-editor__item"' `
    "Location information row is missing from the privacy posts screen."

Write-Host "PASS: privacy posts detail screen is wired."
