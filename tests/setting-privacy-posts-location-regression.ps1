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

Assert-Match 'activeDetailRoute\s*===\s*"privacy-posts-location-edit"' `
    "Post location detail route is not implemented."

Assert-Match 'data-privacy-posts-route="location"' `
    "Location entry does not navigate to a dedicated route."

Assert-Match 'data-privacy-posts-location-toggle' `
    "Location toggle markup is missing."

Assert-Match 'data-privacy-posts-location-delete' `
    "Delete all location data action is missing."

Write-Host "PASS: privacy post location screen is wired."
