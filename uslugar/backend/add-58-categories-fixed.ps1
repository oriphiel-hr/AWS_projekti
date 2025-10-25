# PowerShell script to add categories via AWS ECS
# This uses a two-step approach: first create SQL file, then run it

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  ADD 58 CATEGORIES TO USLUGAR DB" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$cluster = "apps-cluster"
$region = "eu-north-1"

# Step 1: Create SQL file in container using echo
Write-Host "Step 1: Creating SQL file in container..." -ForegroundColor Yellow

$createSqlCmd = @"
echo \"INSERT INTO \\\"Category\\\" (id, name, description, \\\"isActive\\\", icon, \\\"requiresLicense\\\", \\\"nkdCode\\\", \\\"createdAt\\\") VALUES ('arch_001', 'Arhitekti', 'Projektiranje građevina, renovacije, legalizacije', false, '🏗️', true, '71.11', NOW()), ('arch_002', 'Dizajneri interijera', 'Dizajn interijera, namještaj, dekor', false, '🎨', false, '74.10', NOW()), ('arch_003', '3D vizualizacija', '3D modeli, renderi, virtualne turneje', false, '🖼️', false, '74.20', NOW()), ('arch_004', 'Projektiranje građevina', 'Građevinski projekti, statika, instalacije', false, '🏛️', true, '71.12', NOW()), ('arch_005', 'Vrtni dizajn', 'Dizajn vrtova, krajobrazno uređenje', false, '🌳', false, '71.12', NOW()), ('it_001', 'Web dizajn', 'Dizajn web stranica, UI/UX', false, '💻', false, '62.01', NOW()), ('it_002', 'Programiranje', 'Razvoj aplikacija, software', false, '🔧', false, '62.01', NOW()), ('it_003', 'Mobilne aplikacije', 'iOS, Android aplikacije', false, '📱', false, '62.01', NOW()), ('it_004', 'SEO optimizacija', 'Optimizacija za tražilice', false, '🔍', false, '62.02', NOW()), ('it_005', 'Cyber sigurnost', 'Sigurnost IT sustava', false, '🛡️', false, '62.02', NOW()), ('it_006', 'Cloud servisi', 'Cloud infrastruktura, migracije', false, '☁️', false, '62.02', NOW()), ('it_007', 'IT konzulting', 'IT savjetovanje, implementacija', false, '📊', false, '62.03', NOW()), ('health_001', 'Fizioterapija', 'Fizikalna terapija, rehabilitacija', false, '🏥', true, '86.90', NOW()), ('health_002', 'Nutricionizam', 'Prehrambena savjetovanja', false, '🥗', true, '86.90', NOW()), ('health_003', 'Mentalno zdravlje', 'Psihološke usluge, savjetovanje', false, '🧘', true, '86.90', NOW()), ('health_004', 'Kućni liječnik', 'Kućni posjeti, pregledi', false, '👨‍⚕️', true, '86.21', NOW()), ('health_005', 'Stomatologija', 'Zubarske usluge', false, '🦷', true, '86.23', NOW()), ('health_006', 'Optometristi', 'Pregled vida, naočale', false, '👁️', true, '86.90', NOW()), ('edu_001', 'Jezični tečajevi', 'Strani jezici, hrvatski jezik', false, '🎓', false, '85.52', NOW()), ('edu_002', 'Poslovni trening', 'Soft skills, leadership', false, '💼', false, '85.52', NOW()), ('edu_003', 'Glazbena nastava', 'Glazbeni instrumenti, pjevanje', false, '🎵', false, '85.52', NOW()), ('edu_004', 'Sportska nastava', 'Treniranje, fitness instruktori', false, '🏃', false, '85.52', NOW()), ('edu_005', 'Umjetnička nastava', 'Slikanje, kiparstvo, dizajn', false, '🎨', false, '85.52', NOW()), ('edu_006', 'Online edukacija', 'E-learning, webinari', false, '📚', false, '85.52', NOW()), ('tourism_001', 'Turistički vodiči', 'Vodstvo turista, objašnjavanje', false, '🗺️', true, '79.90', NOW()), ('tourism_002', 'Turistički agenti', 'Organizacija putovanja', false, '✈️', false, '79.11', NOW()), ('tourism_003', 'Hotelijerske usluge', 'Smeštaj, konferencije', false, '🏨', false, '55.10', NOW()), ('tourism_004', 'Prijevoz turista', 'Autobusni prijevoz, transferi', false, '🚌', false, '49.39', NOW()), ('tourism_005', 'Event organizacija', 'Organizacija događanja, konferencija', false, '🎯', false, '82.30', NOW()), ('finance_001', 'Investicijski savjeti', 'Savjetovanje o investicijama', false, '💰', true, '66.30', NOW()), ('finance_002', 'Bankovne usluge', 'Bankovni proizvodi, krediti', false, '🏦', true, '64.19', NOW()), ('finance_003', 'Financijsko planiranje', 'Osobno financijsko planiranje', false, '📈', false, '66.30', NOW()), ('finance_004', 'Hipotekarni savjeti', 'Savjetovanje o hipotekama', false, '🏠', false, '66.30', NOW()), ('finance_005', 'Osiguranje', 'Osiguravajući proizvodi', false, '💳', true, '65.20', NOW()), ('marketing_001', 'Marketing agencije', 'Kompletni marketing servisi', false, '📢', false, '73.11', NOW()), ('marketing_002', 'Reklamne usluge', 'Kreiranje reklama, kampanje', false, '📺', false, '73.11', NOW()), ('marketing_003', 'Social media marketing', 'Upravljanje društvenim mrežama', false, '📱', false, '73.11', NOW()), ('marketing_004', 'PR usluge', 'Odnosi s javnošću, komunikacija', false, '📰', false, '73.12', NOW()), ('marketing_005', 'Branding', 'Kreiranje brenda, identiteta', false, '🎯', false, '73.11', NOW()), ('transport_001', 'Kamionski prijevoz', 'Prijevoz tereta kamionima', false, '🚛', true, '49.41', NOW()), ('transport_002', 'Kurirske usluge', 'Dostava paketa, kuriri', false, '📦', false, '53.20', NOW()), ('transport_003', 'Međunarodni transport', 'Prijevoz između zemalja', false, '🚢', true, '49.41', NOW()), ('transport_004', 'Skladišne usluge', 'Skladištenje, logistika', false, '🏭', false, '52.10', NOW()), ('transport_005', 'Specijalizirani transport', 'Prijevoz opasnih materijala', false, '🚚', true, '49.41', NOW()), ('other_001', 'Zabavne usluge', 'Animatori, DJ, zabavljači', false, '🎪', false, '90.03', NOW()), ('other_002', 'Umjetničke usluge', 'Kiparstvo, slikanje, umjetnost', false, '🎭', false, '90.03', NOW()), ('other_003', 'Trgovinske usluge', 'Prodaja, trgovina', false, '🏪', false, '47.11', NOW()), ('other_004', 'Poslovne usluge', 'Administrativne usluge', false, '🏢', false, '82.11', NOW()), ('other_005', 'Popravak opreme', 'Popravak različite opreme', false, '🔧', false, '95.11', NOW()) ON CONFLICT (id) DO NOTHING;\" > /tmp/cats.sql && apk add --no-cache postgresql-client && psql \\\$DATABASE_URL -f /tmp/cats.sql && echo SUCCESS || echo FAILED"
"@

# Prepare overrides
$overridesJson = @"
{
  "containerOverrides": [
    {
      "name": "psql",
      "command": ["sh", "-c", $createSqlCmd]
    }
  ]
}
"@ | ConvertTo-Json -Compress

# Run the task
Write-Host "Step 2: Running ECS task..." -ForegroundColor Yellow

$result = aws ecs run-task `
    --cluster $cluster `
    --launch-type FARGATE `
    --task-definition uslugar-psql-oneoff:2 `
    --network-configuration 'awsvpcConfiguration={subnets=[subnet-0a00f97768705bbcf,subnet-01b67edfd00dc288c],securityGroups=[sg-084c1e49c9c77aff1],assignPublicIp=DISABLED}' `
    --overrides $overridesJson `
    --region $region

$taskArn = ($result | ConvertFrom-Json).tasks[0].taskArn
Write-Host "Task started: $taskArn" -ForegroundColor Green

# Wait
Write-Host "Waiting for completion..." -ForegroundColor Yellow
aws ecs wait tasks-stopped --cluster $cluster --tasks $taskArn --region $region

Write-Host ""
Write-Host "✅ Done! Check CloudWatch logs for results." -ForegroundColor Green
