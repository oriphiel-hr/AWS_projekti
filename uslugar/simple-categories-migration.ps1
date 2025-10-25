# USLUGAR - Jednostavan pristup za dodavanje kategorija
# =====================================================

Write-Host "🌱 USLUGAR - Jednostavan pristup za kategorije" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Kreiraj novi task definition bez secrets-a
Write-Host "📋 Kreiranje jednostavnog task definition-a..." -ForegroundColor Yellow

$simpleTaskDef = @{
    containerDefinitions = @(
        @{
            name = "uslugar-simple"
            image = "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:72331f9b839866642ad06c959bc194e4e9bf07fb"
            essential = $true
            environment = @(
                @{
                    name = "PORT"
                    value = "8080"
                },
                @{
                    name = "JWT_SECRET"
                    value = "dev-super-secret"
                },
                @{
                    name = "DATABASE_URL"
                    value = "postgresql://uslugar_user:uslugar_password@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar_db"
                }
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
    family = "uslugar-simple"
    executionRoleArn = "arn:aws:iam::666203386231:role/ecsTaskExecutionRole"
    networkMode = "awsvpc"
    requiresCompatibilities = @("FARGATE")
    cpu = "256"
    memory = "512"
}

# Spremi task definition
$simpleTaskDef | ConvertTo-Json -Depth 10 | Out-File -FilePath "simple-task-def.json" -Encoding UTF8

# Registriraj novi task definition
Write-Host "📝 Registriranje jednostavnog task definition-a..." -ForegroundColor Yellow
$newTaskDefArn = aws ecs register-task-definition --cli-input-json file://simple-task-def.json --query 'taskDefinition.taskDefinitionArn' --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Greška pri registriranju task definition-a" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Jednostavan task definition registriran: $newTaskDefArn" -ForegroundColor Green

# Pronađi subnet i security group
$subnetId = "subnet-0a00f97768705bbcf"
$securityGroupId = aws ec2 describe-security-groups --filters "Name=group-name,Values=*ecs*" --query 'SecurityGroups[0].GroupId' --output text

Write-Host "🌐 Subnet: $subnetId" -ForegroundColor Cyan
Write-Host "🔒 Security Group: $securityGroupId" -ForegroundColor Cyan

# Pokreni task za migraciju
Write-Host "🌱 Pokretanje migracije task-a..." -ForegroundColor Yellow
$taskArn = aws ecs run-task `
    --cluster apps-cluster `
    --task-definition uslugar-simple `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$subnetId],securityGroups=[$securityGroupId]}" `
    --overrides '{
        "containerOverrides": [{
            "name": "uslugar-simple",
            "command": ["node", "-e", "const { PrismaClient } = require(`@prisma/client`); const prisma = new PrismaClient(); const categories = [{ name: `Građevina`, description: `Opći građevinski radovi, renovacije, adaptacije`, icon: `🏗️`, nkdCode: `41.20`, requiresLicense: true, licenseType: `Građevinska licenca`, licenseAuthority: `Hrvatska komora inženjera građevinarstva` }, { name: `Građevinski nadzor`, description: `Nadzor nad izvođenjem građevinskih radova`, icon: `👷`, nkdCode: `71.12`, requiresLicense: true, licenseType: `Licenca građevinskog nadzora`, licenseAuthority: `Hrvatska komora inženjera građevinarstva` }, { name: `Geodetske usluge`, description: `Mjerenja, izrada geodetskih elaborata`, icon: `📐`, nkdCode: `71.12`, requiresLicense: true, licenseType: `Geodetska licenca`, licenseAuthority: `Hrvatska komora inženjera geodezije` }, { name: `Energetski certifikati`, description: `Izdavanje energetskih certifikata za zgrade`, icon: `⚡`, nkdCode: `71.12`, requiresLicense: true, licenseType: `Licenca energetskog certifikata`, licenseAuthority: `Hrvatska energetska agencija` }, { name: `Legalizacija objekata`, description: `Pomoć pri legalizaciji bespravno sagrađenih objekata`, icon: `📋`, nkdCode: `71.12`, requiresLicense: false }, { name: `Dizajn interijera`, description: `Uređenje i dizajn unutarnjih prostora`, icon: `🎨`, nkdCode: `74.10`, requiresLicense: false }, { name: `Arhitektonske usluge`, description: `Projektiranje, izrada arhitektonskih planova`, icon: `🏛️`, nkdCode: `71.11`, requiresLicense: true, licenseType: `Arhitektonska licenca`, licenseAuthority: `Hrvatska komora arhitekata` }, { name: `Landscape dizajn`, description: `Uređenje vanjskih prostora, vrtovi`, icon: `🌳`, nkdCode: `71.12`, requiresLicense: false }, { name: `Solarni sustavi`, description: `Ugradnja solarnih panela i sustava`, icon: `☀️`, nkdCode: `43.21`, requiresLicense: true, licenseType: `Elektrotehnička licenca`, licenseAuthority: `Hrvatska komora inženjera elektrotehnike` }, { name: `Web dizajn`, description: `Izrada i dizajn web stranica`, icon: `🌐`, nkdCode: `62.01`, requiresLicense: false }, { name: `SEO usluge`, description: `Optimizacija web stranica za pretraživače`, icon: `🔍`, nkdCode: `62.01`, requiresLicense: false }, { name: `Digitalni marketing`, description: `Online marketing, društvene mreže`, icon: `📱`, nkdCode: `73.11`, requiresLicense: false }, { name: `E-commerce`, description: `Izrada online trgovina`, icon: `🛒`, nkdCode: `62.01`, requiresLicense: false }, { name: `Fotografija`, description: `Profesionalno fotografiranje za različite potrebe`, icon: `📸`, nkdCode: `74.20`, requiresLicense: false }, { name: `Drone snimanje`, description: `Zračno snimanje dronovima`, icon: `🚁`, nkdCode: `74.20`, requiresLicense: false }, { name: `3D vizualizacija`, description: `3D modeli, renderi, vizualizacije`, icon: `🎬`, nkdCode: `74.20`, requiresLicense: false }, { name: `Dostava`, description: `Dostava paketa, hrane, pošiljki`, icon: `📦`, nkdCode: `53.20`, requiresLicense: false }, { name: `Prijevoz putnika`, description: `Taxi, prijevoz putnika`, icon: `🚕`, nkdCode: `49.32`, requiresLicense: true, licenseType: `Licenca za prijevoz putnika`, licenseAuthority: `Ministarstvo mora, prometa i infrastrukture` }, { name: `Čišćenje kućanstva`, description: `Čišćenje domova, stanova`, icon: `🏠`, nkdCode: `81.21`, requiresLicense: false }, { name: `Čišćenje ureda`, description: `Čišćenje poslovnih prostora`, icon: `🏢`, nkdCode: `81.21`, requiresLicense: false }, { name: `Čišćenje nakon gradnje`, description: `Čišćenje nakon građevinskih radova`, icon: `🏗️`, nkdCode: `81.21`, requiresLicense: false }, { name: `Fizioterapija`, description: `Fizioterapijske usluge, rehabilitacija`, icon: `🏥`, nkdCode: `86.90`, requiresLicense: true, licenseType: `Licenca fizioterapeuta`, licenseAuthority: `Hrvatska komora fizioterapeuta` }, { name: `Masage`, description: `Opuštajuće i terapeutske masaže`, icon: `💆`, nkdCode: `96.09`, requiresLicense: false }, { name: `Kozmetika`, description: `Kozmetičke usluge, njega lica`, icon: `💄`, nkdCode: `96.02`, requiresLicense: false }, { name: `Manikura/Pedikura`, description: `Njega noktiju ruku i nogu`, icon: `💅`, nkdCode: `96.02`, requiresLicense: false }, { name: `Instrukcije`, description: `Poduka učenika, instrukcije`, icon: `📚`, nkdCode: `85.59`, requiresLicense: false }, { name: `Jezici`, description: `Učenje stranih jezika`, icon: `🗣️`, nkdCode: `85.59`, requiresLicense: false }, { name: `Muzika`, description: `Glazbena nastava, poduka`, icon: `🎵`, nkdCode: `85.59`, requiresLicense: false }, { name: `Računovodstvo`, description: `Knjigovodstvo, računovodstvene usluge`, icon: `📊`, nkdCode: `69.20`, requiresLicense: false }, { name: `Osiguranje`, description: `Osiguravajuće usluge`, icon: `🛡️`, nkdCode: `65.20`, requiresLicense: true, licenseType: `Licenca osiguravajućeg agenta`, licenseAuthority: `Hrvatska agencija za nadzor financijskih usluga` }, { name: `Energetska učinkovitost`, description: `Energetski pregledi, optimizacija potrošnje`, icon: `🌱`, nkdCode: `71.12`, requiresLicense: true, licenseType: `Licenca energetskog savjetnika`, licenseAuthority: `Hrvatska energetska agencija` }, { name: `Recikliranje`, description: `Usluge recikliranja, odvoz otpada`, icon: `♻️`, nkdCode: `38.11`, requiresLicense: false }, { name: `Popravak kućanskih aparata`, description: `Popravak perilica, sušilica, frižidera`, icon: `🔧`, nkdCode: `95.21`, requiresLicense: false }, { name: `Montaža namještaja`, description: `Montaža namještaja, sklapanje`, icon: `🪑`, nkdCode: `43.30`, requiresLicense: false }, { name: `Montaža klima uređaja`, description: `Ugradnja i servis klima uređaja`, icon: `❄️`, nkdCode: `43.22`, requiresLicense: true, licenseType: `Licenca za klimatizaciju`, licenseAuthority: `Hrvatska komora inženjera građevinarstva` }]; let addedCount = 0; let updatedCount = 0; categories.forEach(async (cat) => { try { const existing = await prisma.category.findUnique({ where: { name: cat.name } }); if (existing) { await prisma.category.update({ where: { name: cat.name }, data: { description: cat.description, icon: cat.icon, nkdCode: cat.nkdCode, requiresLicense: cat.requiresLicense, licenseType: cat.licenseType, licenseAuthority: cat.licenseAuthority, isActive: true } }); updatedCount++; console.log(`✅ Ažurirana: ${cat.name}`); } else { await prisma.category.create({ data: { name: cat.name, description: cat.description, icon: cat.icon, nkdCode: cat.nkdCode, requiresLicense: cat.requiresLicense, licenseType: cat.licenseType, licenseAuthority: cat.licenseAuthority, isActive: true } }); addedCount++; console.log(`➕ Dodana: ${cat.name}`); } } catch (error) { console.error(`❌ Greška za ${cat.name}:`, error.message); } }); setTimeout(() => { console.log(`📊 REZULTAT: Dodano ${addedCount}, Ažurirano ${updatedCount}`); process.exit(0); }, 5000);"]
        }]
    }' `
    --query 'tasks[0].taskArn' `
    --output text

Write-Host "✅ Migracija task pokrenut: $taskArn" -ForegroundColor Green

# Čekaj da se task završi
Write-Host "⏳ Čekam da se task završi..." -ForegroundColor Yellow
aws ecs wait tasks-stopped --cluster apps-cluster --tasks $taskArn

# Provjeri status
$taskStatus = aws ecs describe-tasks --cluster apps-cluster --tasks $taskArn --query 'tasks[0].lastStatus' --output text
Write-Host "📊 Task status: $taskStatus" -ForegroundColor Cyan

if ($taskStatus -eq "STOPPED") {
    $exitCode = aws ecs describe-tasks --cluster apps-cluster --tasks $taskArn --query 'tasks[0].containers[0].exitCode' --output text
    if ($exitCode -eq "0") {
        Write-Host "✅ Migracija uspješno završena!" -ForegroundColor Green
        Write-Host "🎉 Kategorije su dodane u bazu podataka!" -ForegroundColor Green
    } else {
        Write-Host "❌ Migracija završila s greškom (exit code: $exitCode)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Task nije završio uspješno" -ForegroundColor Red
}

# Očisti privremene datoteke
Remove-Item "simple-task-def.json" -ErrorAction SilentlyContinue

Write-Host "🏁 Gotovo!" -ForegroundColor Green
