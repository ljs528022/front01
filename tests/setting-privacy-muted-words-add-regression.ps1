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

Assert-Match 'activeDetailRoute\s*===\s*"privacy-muted-words-add-edit"' `
    "Muted words add detail route is not implemented."

Assert-Match 'activeDetailRoute\s*=\s*"privacy-muted-words-add-edit"' `
    "Muted words add action does not navigate to the form route."

Assert-Match 'data-privacy-muted-word-input' `
    "Muted word input field is missing."

Assert-Match 'data-privacy-muted-word-notifications-toggle' `
    "Muted word notifications toggle is missing."

Assert-Match 'data-privacy-muted-word-save' `
    "Muted word save button is missing."

Write-Host "PASS: muted words add screen is wired."
