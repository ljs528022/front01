$ErrorActionPreference = "Stop"

$scriptPath = Join-Path $PSScriptRoot "..\static\js\setting\event.js"
$stylePath = Join-Path $PSScriptRoot "..\static\css\setting\setting.css"
$scriptSource = Get-Content -Path $scriptPath -Raw
$styleSource = Get-Content -Path $stylePath -Raw

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

Assert-Match $scriptSource 'data-account-auth-submit' `
    "Account auth submit button is missing a dedicated hook."

Assert-Match $scriptSource 'authSubmitButton\.disabled\s*=\s*!hasPasswordValue' `
    "Account auth submit button is not disabled until a password is entered."

Assert-Match $scriptSource 'detail-form__button--enabled' `
    "Account auth submit button is missing an enabled state class toggle."

Assert-Match $styleSource 'detail-form__button\s*\{[\s\S]*background:\s*#cfd9de;' `
    "Account auth submit button default color is not using the clearer inactive gray tone."

Assert-Match $styleSource 'detail-form__button--enabled\s*\{[\s\S]*background:\s*#0f1419;' `
    "Account auth submit button enabled state is not using the primary dark color."

Assert-Match $styleSource 'detail-form__button--enabled:hover' `
    "Account auth submit button enabled hover state is missing."

Write-Host "PASS: account auth button states are wired."
