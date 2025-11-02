# PowerShell skripta za pokretanje GitHub Actions workflow-a

param(
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    [string]$Repo = "AWS_projekti",
    [string]$Owner = "oriphiel",
    [string]$Workflow = "prisma-uslugar.yml"
)

Write-Host "🚀 Pokretanje GitHub Actions workflow..." -ForegroundColor Cyan
Write-Host ""

if (-not $GitHubToken) {
    Write-Host "⚠️  GITHUB_TOKEN nije postavljen" -ForegroundColor Yellow
    Write-Host "   Postavi GitHub token kao environment variable:" -ForegroundColor Gray
    Write-Host "   `$env:GITHUB_TOKEN = 'your-token-here'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Ili koristi GitHub CLI:" -ForegroundColor Yellow
    Write-Host "   gh workflow run prisma-uslugar.yml" -ForegroundColor Gray
    exit 1
}

$headers = @{
    "Accept" = "application/vnd.github.v3+json"
    "Authorization" = "token $GitHubToken"
}

$body = @{
    ref = "main"
} | ConvertTo-Json

try {
    $url = "https://api.github.com/repos/$Owner/$Repo/actions/workflows/$Workflow/dispatches"
    Write-Host "POST $url" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "✅ Workflow pokrenut!" -ForegroundColor Green
    Write-Host "   Provjeri status: https://github.com/$Owner/$Repo/actions" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Greška pri pokretanju workflow-a:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternativa: Pushaj promjene na main branch da se workflow automatski pokrene" -ForegroundColor Yellow
    exit 1
}

