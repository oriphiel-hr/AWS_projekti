# USLUGAR - Pokreni SQL migraciju direktno na AWS RDS
# ====================================================

Write-Host "🌱 USLUGAR - Pokreni SQL migraciju direktno na AWS RDS" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Write-Host "💡 KORAK 1: Kreiraj ECS task za SQL migraciju" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow

# Kreiraj task definition za SQL migraciju
$sqlTaskDef = @{
    containerDefinitions = @(
        @{
            name = "sql-migration"
            image = "postgres:15"
            essential = $true
            environment = @(
                @{
                    name = "PGHOST"
                    value = "uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com"
                },
                @{
                    name = "PGPORT"
                    value = "5432"
                },
                @{
                    name = "PGDATABASE"
                    value = "uslugar"
                },
                @{
                    name = "PGUSER"
                    value = "uslugar_user"
                },
                @{
                    name = "PGPASSWORD"
                    value = "Pastor123"
                }
            )
            command = @(
                "psql",
                "-h", "uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com",
                "-p", "5432",
                "-U", "uslugar_user",
                "-d", "uslugar",
                "-f", "/sql/add-missing-categories.sql"
            )
            logConfiguration = @{
                logDriver = "awslogs"
                options = @{
                    "awslogs-group" = "/ecs/uslugar"
                    "awslogs-create-group" = "true"
                    "awslogs-region" = "eu-north-1"
                    "awslogs-stream-prefix" = "ecs"
                }
            }
        }
    )
    family = "uslugar-sql-migration"
    executionRoleArn = "arn:aws:iam::666203386231:role/ecsTaskExecutionRole"
    networkMode = "awsvpc"
    requiresCompatibilities = @("FARGATE")
    cpu = "256"
    memory = "512"
}

# Spremi task definition
$sqlTaskDef | ConvertTo-Json -Depth 10 | Out-File -FilePath "sql-migration-task-def.json" -Encoding UTF8

# Registriraj task definition
Write-Host "📝 Registriranje SQL migration task definition-a..." -ForegroundColor Yellow
$sqlTaskDefArn = aws ecs register-task-definition --cli-input-json file://sql-migration-task-def.json --query 'taskDefinition.taskDefinitionArn' --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Greška pri registriranju task definition-a" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Task definition registriran: $sqlTaskDefArn" -ForegroundColor Green

Write-Host "💡 KORAK 2: Pokreni SQL migraciju" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow

# Pronađi subnet i security group
$subnetId = "subnet-0a00f97768705bbcf"
$securityGroupId = aws ec2 describe-security-groups --filters "Name=group-name,Values=*ecs*" --query 'SecurityGroups[0].GroupId' --output text

Write-Host "🌐 Subnet: $subnetId" -ForegroundColor Cyan
Write-Host "🔒 Security Group: $securityGroupId" -ForegroundColor Cyan

# Pokreni task za SQL migraciju
Write-Host "🌱 Pokretanje SQL migracije..." -ForegroundColor Yellow
$sqlTaskArn = aws ecs run-task `
    --cluster apps-cluster `
    --task-definition uslugar-sql-migration `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$subnetId],securityGroups=[$securityGroupId]}" `
    --overrides '{
        "containerOverrides": [{
            "name": "sql-migration",
            "command": ["psql", "-h", "uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com", "-p", "5432", "-U", "uslugar_user", "-d", "uslugar", "-c", "INSERT INTO \"Category\" (id, name, description, icon, \"nkdCode\", \"requiresLicense\", \"licenseType\", \"licenseAuthority\", \"isActive\", \"createdAt\", \"updatedAt\") VALUES ('"'"'cat_gradevina'"'"', '"'"'Građevina'"'"', '"'"'Opći građevinski radovi, renovacije, adaptacije'"'"', '"'"'🏗️'"'"', '"'"'41.20'"'"', true, '"'"'Građevinska licenca'"'"', '"'"'Hrvatska komora inženjera građevinarstva'"'"', true, NOW(), NOW()), ('"'"'cat_gradevinski_nadzor'"'"', '"'"'Građevinski nadzor'"'"', '"'"'Nadzor nad izvođenjem građevinskih radova'"'"', '"'"'👷'"'"', '"'"'71.12'"'"', true, '"'"'Licenca građevinskog nadzora'"'"', '"'"'Hrvatska komora inženjera građevinarstva'"'"', true, NOW(), NOW()), ('"'"'cat_geodetske_usluge'"'"', '"'"'Geodetske usluge'"'"', '"'"'Mjerenja, izrada geodetskih elaborata'"'"', '"'"'📐'"'"', '"'"'71.12'"'"', true, '"'"'Geodetska licenca'"'"', '"'"'Hrvatska komora inženjera geodezije'"'"', true, NOW(), NOW()), ('"'"'cat_energetski_certifikati'"'"', '"'"'Energetski certifikati'"'"', '"'"'Izdavanje energetskih certifikata za zgrade'"'"', '"'"'⚡'"'"', '"'"'71.12'"'"', true, '"'"'Licenca energetskog certifikata'"'"', '"'"'Hrvatska energetska agencija'"'"', true, NOW(), NOW()), ('"'"'cat_legalizacija_objekata'"'"', '"'"'Legalizacija objekata'"'"', '"'"'Pomoć pri legalizaciji bespravno sagrađenih objekata'"'"', '"'"'📋'"'"', '"'"'71.12'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_dizajn_interijera'"'"', '"'"'Dizajn interijera'"'"', '"'"'Uređenje i dizajn unutarnjih prostora'"'"', '"'"'🎨'"'"', '"'"'74.10'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_arhitektonske_usluge'"'"', '"'"'Arhitektonske usluge'"'"', '"'"'Projektiranje, izrada arhitektonskih planova'"'"', '"'"'🏛️'"'"', '"'"'71.11'"'"', true, '"'"'Arhitektonska licenca'"'"', '"'"'Hrvatska komora arhitekata'"'"', true, NOW(), NOW()), ('"'"'cat_landscape_dizajn'"'"', '"'"'Landscape dizajn'"'"', '"'"'Uređenje vanjskih prostora, vrtovi'"'"', '"'"'🌳'"'"', '"'"'71.12'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_solarni_sustavi'"'"', '"'"'Solarni sustavi'"'"', '"'"'Ugradnja solarnih panela i sustava'"'"', '"'"'☀️'"'"', '"'"'43.21'"'"', true, '"'"'Elektrotehnička licenca'"'"', '"'"'Hrvatska komora inženjera elektrotehnike'"'"', true, NOW(), NOW()), ('"'"'cat_web_dizajn'"'"', '"'"'Web dizajn'"'"', '"'"'Izrada i dizajn web stranica'"'"', '"'"'🌐'"'"', '"'"'62.01'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_seo_usluge'"'"', '"'"'SEO usluge'"'"', '"'"'Optimizacija web stranica za pretraživače'"'"', '"'"'🔍'"'"', '"'"'62.01'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_digitalni_marketing'"'"', '"'"'Digitalni marketing'"'"', '"'"'Online marketing, društvene mreže'"'"', '"'"'📱'"'"', '"'"'73.11'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_ecommerce'"'"', '"'"'E-commerce'"'"', '"'"'Izrada online trgovina'"'"', '"'"'🛒'"'"', '"'"'62.01'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_fotografija'"'"', '"'"'Fotografija'"'"', '"'"'Profesionalno fotografiranje za različite potrebe'"'"', '"'"'📸'"'"', '"'"'74.20'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_drone_snimanje'"'"', '"'"'Drone snimanje'"'"', '"'"'Zračno snimanje dronovima'"'"', '"'"'🚁'"'"', '"'"'74.20'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_3d_vizualizacija'"'"', '"'"'3D vizualizacija'"'"', '"'"'3D modeli, renderi, vizualizacije'"'"', '"'"'🎬'"'"', '"'"'74.20'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_dostava'"'"', '"'"'Dostava'"'"', '"'"'Dostava paketa, hrane, pošiljki'"'"', '"'"'📦'"'"', '"'"'53.20'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_prijevoz_putnika'"'"', '"'"'Prijevoz putnika'"'"', '"'"'Taxi, prijevoz putnika'"'"', '"'"'🚕'"'"', '"'"'49.32'"'"', true, '"'"'Licenca za prijevoz putnika'"'"', '"'"'Ministarstvo mora, prometa i infrastrukture'"'"', true, NOW(), NOW()), ('"'"'cat_ciscenje_kucanstva'"'"', '"'"'Čišćenje kućanstva'"'"', '"'"'Čišćenje domova, stanova'"'"', '"'"'🏠'"'"', '"'"'81.21'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_ciscenje_ureda'"'"', '"'"'Čišćenje ureda'"'"', '"'"'Čišćenje poslovnih prostora'"'"', '"'"'🏢'"'"', '"'"'81.21'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_ciscenje_nakon_gradnje'"'"', '"'"'Čišćenje nakon gradnje'"'"', '"'"'Čišćenje nakon građevinskih radova'"'"', '"'"'🏗️'"'"', '"'"'81.21'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_fizioterapija'"'"', '"'"'Fizioterapija'"'"', '"'"'Fizioterapijske usluge, rehabilitacija'"'"', '"'"'🏥'"'"', '"'"'86.90'"'"', true, '"'"'Licenca fizioterapeuta'"'"', '"'"'Hrvatska komora fizioterapeuta'"'"', true, NOW(), NOW()), ('"'"'cat_masage'"'"', '"'"'Masage'"'"', '"'"'Opuštajuće i terapeutske masaže'"'"', '"'"'💆'"'"', '"'"'96.09'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_kozmetika'"'"', '"'"'Kozmetika'"'"', '"'"'Kozmetičke usluge, njega lica'"'"', '"'"'💄'"'"', '"'"'96.02'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_manikura_pedikura'"'"', '"'"'Manikura/Pedikura'"'"', '"'"'Njega noktiju ruku i nogu'"'"', '"'"'💅'"'"', '"'"'96.02'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_instrukcije'"'"', '"'"'Instrukcije'"'"', '"'"'Poduka učenika, instrukcije'"'"', '"'"'📚'"'"', '"'"'85.59'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_jezici'"'"', '"'"'Jezici'"'"', '"'"'Učenje stranih jezika'"'"', '"'"'🗣️'"'"', '"'"'85.59'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_muzika'"'"', '"'"'Muzika'"'"', '"'"'Glazbena nastava, poduka'"'"', '"'"'🎵'"'"', '"'"'85.59'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_racunovodstvo'"'"', '"'"'Računovodstvo'"'"', '"'"'Knjigovodstvo, računovodstvene usluge'"'"', '"'"'📊'"'"', '"'"'69.20'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_osiguranje'"'"', '"'"'Osiguranje'"'"', '"'"'Osiguravajuće usluge'"'"', '"'"'🛡️'"'"', '"'"'65.20'"'"', true, '"'"'Licenca osiguravajućeg agenta'"'"', '"'"'Hrvatska agencija za nadzor financijskih usluga'"'"', true, NOW(), NOW()), ('"'"'cat_energetska_ucinkovitost'"'"', '"'"'Energetska učinkovitost'"'"', '"'"'Energetski pregledi, optimizacija potrošnje'"'"', '"'"'🌱'"'"', '"'"'71.12'"'"', true, '"'"'Licenca energetskog savjetnika'"'"', '"'"'Hrvatska energetska agencija'"'"', true, NOW(), NOW()), ('"'"'cat_recikliranje'"'"', '"'"'Recikliranje'"'"', '"'"'Usluge recikliranja, odvoz otpada'"'"', '"'"'♻️'"'"', '"'"'38.11'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_popravak_kucanskih_aparata'"'"', '"'"'Popravak kućanskih aparata'"'"', '"'"'Popravak perilica, sušilica, frižidera'"'"', '"'"'🔧'"'"', '"'"'95.21'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_montaza_namjestaja'"'"', '"'"'Montaža namještaja'"'"', '"'"'Montaža namještaja, sklapanje'"'"', '"'"'🪑'"'"', '"'"'43.30'"'"', false, NULL, NULL, true, NOW(), NOW()), ('"'"'cat_montaza_klima_uredaja'"'"', '"'"'Montaža klima uređaja'"'"', '"'"'Ugradnja i servis klima uređaja'"'"', '"'"'❄️'"'"', '"'"'43.22'"'"', true, '"'"'Licenca za klimatizaciju'"'"', '"'"'Hrvatska komora inženjera građevinarstva'"'"', true, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon, \"nkdCode\" = EXCLUDED.\"nkdCode\", \"requiresLicense\" = EXCLUDED.\"requiresLicense\", \"licenseType\" = EXCLUDED.\"licenseType\", \"licenseAuthority\" = EXCLUDED.\"licenseAuthority\", \"isActive\" = EXCLUDED.\"isActive\", \"updatedAt\" = NOW();"]
        }]
    }' `
    --query 'tasks[0].taskArn' `
    --output text

Write-Host "✅ SQL migration task pokrenut: $sqlTaskArn" -ForegroundColor Green

# Čekaj da se task završi
Write-Host "⏳ Čekam da se SQL migration task završi..." -ForegroundColor Yellow
aws ecs wait tasks-stopped --cluster apps-cluster --tasks $sqlTaskArn

# Provjeri status
$sqlStatus = aws ecs describe-tasks --cluster apps-cluster --tasks $sqlTaskArn --query 'tasks[0].lastStatus' --output text
Write-Host "📊 SQL migration task status: $sqlStatus" -ForegroundColor Cyan

if ($sqlStatus -eq "STOPPED") {
    $exitCode = aws ecs describe-tasks --cluster apps-cluster --tasks $sqlTaskArn --query 'tasks[0].containers[0].exitCode' --output text
    if ($exitCode -eq "0") {
        Write-Host "✅ SQL migracija uspješno završena!" -ForegroundColor Green
        Write-Host "🎉 Kategorije su dodane u bazu podataka!" -ForegroundColor Green
        Write-Host "🌐 Provjerite rezultate na https://uslugar.oriph.io" -ForegroundColor Cyan
    } else {
        Write-Host "❌ SQL migracija završila s greškom (exit code: $exitCode)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ SQL migration task nije završio uspješno" -ForegroundColor Red
}

# Očisti privremene datoteke
Remove-Item "sql-migration-task-def.json" -ErrorAction SilentlyContinue

Write-Host "🏁 Gotovo!" -ForegroundColor Green