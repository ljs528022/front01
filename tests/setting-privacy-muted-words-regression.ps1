$ErrorActionPreference = "Stop"

$scriptPath = Join-Path $PSScriptRoot "..\static\js\setting\event.js"
$templatePath = Join-Path $PSScriptRoot "..\templates\setting\setting.html"
$scriptSource = Get-Content -Path $scriptPath -Raw
$templateSource = Get-Content -Path $templatePath -Raw

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

Assert-Match $scriptSource 'activeDetailRoute\s*===\s*"privacy-muted-words-edit"' `
    "Muted words detail route is not implemented."

Assert-Match $scriptSource 'data-privacy-mute-block-item="muted-words"' `
    "Muted words list row is missing."

Assert-Match $scriptSource 'action:\s*"muted-words-add"' `
    "Muted words add action is not configured."

Assert-Match $scriptSource 'iconPath:\s*icons\.add' `
    "Muted words add action is not using the dedicated add icon."

Assert-Match $scriptSource 'privacy-muted-words-editor__empty-title' `
    "Muted words empty state heading is missing."

Assert-Match $scriptSource 'privacy-muted-words-editor__list' `
    "Muted words server-rendered list container is missing."

Assert-Match $scriptSource 'privacy-muted-word-item__term' `
    "Muted word list item markup is missing."

Assert-Match $templateSource 'id="settingsDetailActionButton"' `
    "Detail header action button slot is missing from the template."

Write-Host "PASS: muted words detail screen is wired."
