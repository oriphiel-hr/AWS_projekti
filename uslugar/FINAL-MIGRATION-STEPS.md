# 🚀 Finalni Koraci za Queue Model Migration

Problem: Lokalni pristup AWS RDS-u je blokiran (Security Group), što je normalno za produkciju.

**Rješenje:** Pokreni migraciju iz ECS Task-a koji već ima pristup bazi! ✅

---

## Metoda 1: ECS Execute Command (NAJLAKŠE) ⭐

### Korak 1: Pronađi Running Task

```powershell
aws ecs list-tasks --cluster uslugar-cluster --region eu-north-1
```

Kopiraj Task ID (npr: `arn:aws:ecs:eu-north-1:xxx:task/uslugar-cluster/abc123`)

### Korak 2: Kreiraj Migration Script na Task-u

Već imam pripremljen `apply-migration-direct.cjs` koji će raditi u ECS-u!

Ali najlakše je koristiti Prisma direktno:

```powershell
# Connect to running task
aws ecs execute-command `
  --cluster uslugar-cluster `
  --task <TASK_ID_OVDJE> `
  --container uslugar-backend `
  --interactive `
  --command "/bin/sh" `
  --region eu-north-1
```

### Korak 3: U Container-u, pokreni:

```bash
# Prvo generiraj Prisma Client (ako nije već)
npx prisma generate --schema=prisma/schema.prisma

# Primijeni migraciju
npx prisma migrate deploy --schema=prisma/schema.prisma

# Seed kategorije
node prisma/seeds/seed-categories.js

# Exit
exit
```

✅ **GOTOVO!**

---

## Metoda 2: Privremeno Update Security Group

**⚠️ Samo za testing! Ne preporučujem za produkciju!**

### Korak 1: Dodaj svoju IP u Security Group

```powershell
# Dohvati svoju public IP
$myIP = (Invoke-WebRequest -Uri "https://api.ipify.org").Content
Write-Host "Your IP: $myIP"

# Dodaj u Security Group (zamijeni SG ID)
aws ec2 authorize-security-group-ingress `
  --group-id sg-XXXXX `
  --protocol tcp `
  --port 5432 `
  --cidr "$myIP/32" `
  --region eu-north-1
```

### Korak 2: Pokreni Migration Script

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend
node apply-migration-direct.cjs
```

### Korak 3: Ukloni svoju IP iz Security Group-a

```powershell
aws ec2 revoke-security-group-ingress `
  --group-id sg-XXXXX `
  --protocol tcp `
  --port 5432 `
  --cidr "$myIP/32" `
  --region eu-north-1
```

---

## Metoda 3: Deploy novi Image (NAJBOLJE za budućnost)

Pošto sam već updateirao Dockerfile da automatski pokrene migraciju pri startu, najčistije rješenje je:

### Kad pokreneš Docker Desktop:

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# Build
docker build -t uslugar-backend:latest .

# Login to ECR
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 339713096106.dkr.ecr.eu-north-1.amazonaws.com

# Tag & Push
docker tag uslugar-backend:latest 339713096106.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend:latest
docker push 339713096106.dkr.ecr.eu-north-1.amazonaws.com/uslugar-backend:latest

# Force new deployment
aws ecs update-service --cluster uslugar-cluster --service uslugar-backend-service --force-new-deployment --region eu-north-1
```

Novi container će automatski:
1. ✅ Primijeniti migraciju
2. ✅ Seedati kategorije
3. ✅ Pokrenuti Queue Scheduler
4. ✅ Pokrenuti server

---

## 🎯 Preporučeni Plan

**ODMAH (bez Docker-a):**
```powershell
# 1. List running tasks
aws ecs list-tasks --cluster uslugar-cluster --region eu-north-1

# 2. Execute command (zamijeni TASK_ID)
aws ecs execute-command `
  --cluster uslugar-cluster `
  --task <TASK_ID> `
  --container uslugar-backend `
  --interactive `
  --command "/bin/sh" `
  --region eu-north-1

# 3. U container-u:
npx prisma migrate deploy
node prisma/seeds/seed-categories.js
exit
```

**KASNIJE (sa Docker-om):**
- Build i deploy novi image
- Sve će se automatski ažurirati

---

## ✅ Provjera da li je Uspjelo

```sql
-- U bilo kojem SQL tool-u koji ima pristup (ili u container-u):
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('ProviderLicense', 'LeadQueue');

-- Trebao bi vidjeti:
-- LeadQueue
-- ProviderLicense
```

Ili test API:
```powershell
curl https://uslugar-api.oriph.io/api/health
```

---

## 📝 Sažetak

**Spremno:**
- ✅ Kod pushovan na GitHub
- ✅ Migration SQL spreman
- ✅ Seed script spreman
- ✅ Dockerfile konfiguriran

**Trebaš pokrenuti:**
1. `aws ecs list-tasks` (pronađi task)
2. `aws ecs execute-command` (spoji se)
3. `npx prisma migrate deploy` (primijeni)
4. `node prisma/seeds/seed-categories.js` (seedaj)

**Ili pričekaj da pokreneš Docker i deployaš novi image!**

---

**Koja metoda ti odgovara?** 🚀

