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

Assert-Match $scriptSource 'activeDetailRoute\s*===\s*"privacy-chat-edit"' `
    "Chat detail route is not implemented."

Assert-Match $scriptSource '"/settings/privacy_and_safety/direct_messages"' `
    "Direct messages navigation target is missing."

Assert-Match $scriptSource 'detailTitle\.textContent\s*=\s*"채팅"' `
    "Chat detail title is missing."

Assert-Match $scriptSource 'data-privacy-chat-allow="none"' `
    "No one chat request option is missing."

Assert-Match $scriptSource 'data-privacy-chat-allow="verified"' `
    "Verified users chat request option is missing."

Assert-Match $scriptSource 'data-privacy-chat-allow="everyone"' `
    "Everyone chat request option is missing."

Assert-Match $scriptSource 'data-privacy-chat-toggle="filter-low-quality"' `
    "Low-quality filter toggle is missing."

Assert-Match $scriptSource 'data-privacy-chat-toggle="read-receipts"' `
    "Read receipts toggle is missing."

Assert-Match $styleSource 'privacy-chat-editor__request-option' `
    "Chat detail styling block is missing."

Write-Host "PASS: privacy chat screen is wired."
