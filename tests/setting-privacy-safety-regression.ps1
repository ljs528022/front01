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

Assert-Match 'id:\s*"privacy_and_safety"[\s\S]*href:\s*"/settings/privacy_and_safety"' `
    "Privacy and safety navigation item is not defined with a unique route."

Assert-Match 'privacy_and_safety:\s*\{' `
    "Privacy and safety detail section is missing from detailSections."

Assert-Match '/settings/privacy_and_safety/sensitive_content' `
    "Sensitive content entry is missing from the privacy and safety section."

Assert-Match '/settings/privacy_and_safety/mute_and_block' `
    "Mute and block entry is missing from the privacy and safety section."

Write-Host "PASS: privacy and safety settings section is wired."
