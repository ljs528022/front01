$ErrorActionPreference = "Stop"

$scriptPath = Join-Path $PSScriptRoot "..\static\js\setting\event.js"
$stylePath = Join-Path $PSScriptRoot "..\static\css\setting\setting.css"
$scriptSource = Get-Content -Path $scriptPath -Encoding utf8 -Raw
$styleSource = Get-Content -Path $stylePath -Encoding utf8 -Raw

function Assert-Match {
    param(
        [string]$Source,
        [string]$Pattern,
        [string]$Message
    )

    if ($Source -notmatch $Pattern) {
        throw $Message
    }
}

Assert-Match $scriptSource 'activeDetailRoute\s*===\s*"privacy-discoverability-edit"' `
    "Discoverability detail route is not implemented."

Assert-Match $scriptSource '"/settings/privacy_and_safety/discoverability_and_contacts"' `
    "Discoverability navigation target is missing."

Assert-Match $scriptSource 'data-privacy-discoverability-toggle="email"' `
    "Email discoverability toggle is missing."

Assert-Match $scriptSource 'data-privacy-discoverability-toggle="phone"' `
    "Phone discoverability toggle is missing."

Assert-Match $scriptSource 'data-privacy-discoverability-manage="contacts"' `
    "Contacts management row is missing."

Assert-Match $styleSource 'privacy-discoverability-editor__manage-row' `
    "Discoverability styling block is missing."

Write-Host "PASS: privacy discoverability screen is wired."
