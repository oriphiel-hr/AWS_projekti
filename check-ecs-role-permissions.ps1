# Provjeri ECS Task Execution Role Permisije
$RoleName = "ecsTaskExecutionRole"
$Region = "eu-north-1"
$AccountId = "666203386231"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ECS Task Execution Role - Provjera" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Provjeri da li role postoji
Write-Host "1️⃣ Provjera da li role postoji..." -ForegroundColor Yellow
try {
    $role = aws iam get-role --role-name $RoleName --region $Region 2>$null | ConvertFrom-Json
    if ($role.Role) {
        Write-Host "   ✅ Role '$RoleName' POSTOJI" -ForegroundColor Green
        Write-Host "   ARN: $($role.Role.Arn)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Role '$RoleName' NE POSTOJI!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Provjeri attached managed policies
Write-Host "2️⃣ Provjera managed policies..." -ForegroundColor Yellow
$attachedPolicies = aws iam list-attached-role-policies --role-name $RoleName --region $Region 2>$null | ConvertFrom-Json

if ($attachedPolicies.AttachedPolicies) {
    Write-Host "   📋 Attached policies:" -ForegroundColor Cyan
    $hasECSPolicy = $false
    foreach ($policy in $attachedPolicies.AttachedPolicies) {
        Write-Host "      - $($policy.PolicyName)" -ForegroundColor White
        if ($policy.PolicyArn -like "*AmazonECSTaskExecutionRolePolicy*") {
            $hasECSPolicy = $true
            Write-Host "        ✅ Ova policy uključuje Secrets Manager permisije!" -ForegroundColor Green
        }
    }
    
    if (-not $hasECSPolicy) {
        Write-Host ""
        Write-Host "   ⚠️  NEDOSTAJE AmazonECSTaskExecutionRolePolicy!" -ForegroundColor Yellow
        Write-Host "   💡 Dodaj policy:" -ForegroundColor Yellow
        Write-Host "      aws iam attach-role-policy --role-name $RoleName --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy --region $Region" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "   ✅ AmazonECSTaskExecutionRolePolicy je priložena!" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Nema attached policies!" -ForegroundColor Red
    Write-Host "   💡 Dodaj AmazonECSTaskExecutionRolePolicy!" -ForegroundColor Yellow
}

Write-Host ""

# 3. Provjeri inline policies
Write-Host "3️⃣ Provjera inline policies..." -ForegroundColor Yellow
$inlinePolicies = aws iam list-role-policies --role-name $RoleName --region $Region 2>$null | ConvertFrom-Json

if ($inlinePolicies.PolicyNames -and $inlinePolicies.PolicyNames.Count -gt 0) {
    Write-Host "   📋 Inline policies:" -ForegroundColor Cyan
    foreach ($policyName in $inlinePolicies.PolicyNames) {
        Write-Host "      - $policyName" -ForegroundColor White
    }
} else {
    Write-Host "   ℹ️  Nema inline policies" -ForegroundColor Gray
}

Write-Host ""

# 4. Provjeri permisije za Twilio secret
Write-Host "4️⃣ Provjera permisija za Twilio secret..." -ForegroundColor Yellow
$secretArn = "arn:aws:secretsmanager:$Region:$AccountId:secret:uslugar-twilio-config-*"

try {
    $simulation = aws iam simulate-principal-policy `
        --policy-source-arn "arn:aws:iam::${AccountId}:role/${RoleName}" `
        --action-names secretsmanager:GetSecretValue `
        --resource-arns $secretArn `
        --region $Region 2>$null | ConvertFrom-Json
    
    if ($simulation.EvaluationResults) {
        $result = $simulation.EvaluationResults[0]
        Write-Host "   Action: $($result.EvalActionName)" -ForegroundColor White
        Write-Host "   Resource: $($result.EvalResourceName)" -ForegroundColor White
        Write-Host "   Decision: $($result.EvalDecision)" -ForegroundColor $(if ($result.EvalDecision -eq "allowed") { "Green" } else { "Red" })
        
        if ($result.EvalDecision -eq "allowed") {
            Write-Host "   ✅ Role IMA permisije za Twilio secret!" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Role NEMA permisije za Twilio secret!" -ForegroundColor Red
            Write-Host "   💡 Dodaj AmazonECSTaskExecutionRolePolicy!" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ⚠️  Nije moguće simulirati permisije (možda nedostaju permisije za simulaciju)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Provjera završena" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 5. Preporuka
Write-Host "📝 Preporuka:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ako role nema AmazonECSTaskExecutionRolePolicy, pokreni:" -ForegroundColor White
Write-Host ""
Write-Host "aws iam attach-role-policy \`" -ForegroundColor Gray
Write-Host "  --role-name $RoleName \`" -ForegroundColor Gray
Write-Host "  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy \`" -ForegroundColor Gray
Write-Host "  --region $Region" -ForegroundColor Gray
Write-Host ""

