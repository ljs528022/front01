$ErrorActionPreference = "Stop"

$cssPath = Join-Path $PSScriptRoot "..\static\css\setting\setting.css"
$jsPath = Join-Path $PSScriptRoot "..\static\js\setting\event.js"
$cssSource = Get-Content -Path $cssPath -Raw
$jsSource = Get-Content -Path $jsPath -Raw

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

Assert-Match $cssSource 'min-height:\s*60px;' `
    "Muted word item row height is not aligned with the reviewed layout."

Assert-Match $cssSource 'width:\s*34px;[\s\S]*height:\s*34px;' `
    "Muted word action button size is not aligned with the reviewed layout."

Assert-Match $cssSource 'border:\s*1px solid rgba\(207,\s*217,\s*222,\s*0\.95\)' `
    "Muted word action button border should use the neutral outline from the reviewed layout."

Assert-Match $cssSource 'privacy-muted-word-item__action-icon[\s\S]*width:\s*18px;[\s\S]*height:\s*18px;' `
    "Muted word action icon should render at the clearer reviewed size."

Assert-Match $jsSource 'privacy-muted-word-item__action-icon' `
    "Muted word item action icon markup is missing."

Assert-Match $jsSource 'mute:\s*"M18 6\.59V1\.2L8\.71 7H5\.5C4\.12 7 3 8\.12 3 9\.5v5C3 15\.88 4\.12 17 5\.5 17h2\.09' `
    "Muted word action should use the updated, clearer mute speaker icon."

Write-Host "PASS: muted word item styling is aligned."
