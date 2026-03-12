$ErrorActionPreference = "Stop"

$cssPath = Join-Path $PSScriptRoot "..\static\css\setting\setting.css"
$source = Get-Content -Path $cssPath -Raw

function Assert-Match {
    param(
        [string]$Pattern,
        [string]$Message
    )

    if ($source -notmatch $Pattern) {
        throw $Message
    }
}

Assert-Match 'panel-header__action:focus-visible' `
    "Detail header action button is missing a focus-visible style."

Assert-Match 'privacy-muted-word-form__check-row:hover' `
    "Muted word checkbox rows are missing a hover state."

Assert-Match 'privacy-muted-word-form__radio:focus-visible' `
    "Muted word radio controls are missing a focus-visible style."

Assert-Match 'privacy-muted-word-form__save--enabled:hover' `
    "Muted word save button is missing an enabled hover state."

Write-Host "PASS: setting.css interaction states are wired."
