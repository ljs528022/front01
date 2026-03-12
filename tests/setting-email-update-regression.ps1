$ErrorActionPreference = "Stop"

$templatePath = Join-Path $PSScriptRoot "..\templates\setting\setting.html"
$scriptPath = Join-Path $PSScriptRoot "..\static\js\setting\event.js"
$stylePath = Join-Path $PSScriptRoot "..\static\css\setting\setting.css"
$templateSource = Get-Content -Path $templatePath -Raw
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

Assert-Match $scriptSource 'class="email-editor__action"[\s\S]*data-modal-type="email-add"' `
    "Email update action is not wired to an email modal."

Assert-Match $templateSource 'id="emailAddModal"' `
    "Email add modal markup is missing."

Assert-Match $templateSource 'id="emailVerifyModal"' `
    "Email verify modal markup is missing."

Assert-Match $templateSource 'id="emailAddInput"' `
    "Email input field is missing."

Assert-Match $templateSource 'id="emailCodeInput"' `
    "Email verification code input is missing."

Assert-Match $scriptSource 'const emailModalState = \{' `
    "Email modal state is missing."

Assert-Match $scriptSource 'modalType === "email-add"' `
    "Email modal open flow is missing."

Assert-Match $scriptSource 'emailModalState\.step === "code"' `
    "Email modal code step flow is missing."

Assert-Match $styleSource 'email-modal__action--primary' `
    "Email modal styles are missing."

Write-Host "PASS: email update flow is wired."
