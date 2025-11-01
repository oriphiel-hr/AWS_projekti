# 📋 Invoice Migration - GitHub Actions Workflow

## ✅ Automatsko Pokretanje Migracije

Migracija za Invoice model će se **automatski pokrenuti** kroz GitHub Actions workflow kada pushaš promjene.

### 📝 Workflow Detalji

**Workflow:** `.github/workflows/prisma-uslugar.yml`

**Kada se pokreće:**
- ✅ Push na `main` branch sa promjenama u:
  - `uslugar/backend/prisma/**` (migracije)
  - `uslugar/backend/src/services/invoice-service.js`
  - `uslugar/backend/src/routes/invoices.js`
  - `.github/workflows/prisma-uslugar.yml`
- ✅ Ručno (workflow_dispatch) - Actions tab > Run workflow

### 🚀 Kako Pokrenuti

#### Opcija 1: Automatski (preporučeno)

```bash
# 1. Commit promjene
git add uslugar/backend/prisma/migrations/20250204000000_add_invoice_model/
git add uslugar/backend/src/services/invoice-service.js
git add uslugar/backend/src/routes/invoices.js
git add uslugar/backend/src/server.js
git add .github/workflows/prisma-uslugar.yml

git commit -m "feat: add invoice system with PDF generation and email"
git push origin main
```

**GitHub Actions će automatski:**
1. ✅ Detektirati promjene u `prisma/**`
2. ✅ Pokrenuti `prisma-uslugar.yml` workflow
3. ✅ Buildati Docker image s Prisma
4. ✅ Pokrenuti `prisma migrate deploy` na AWS ECS Fargate task
5. ✅ Pokrenuti `prisma migrate status` za provjeru

#### Opcija 2: Ručno Pokretanje

1. Idi na GitHub repo: `https://github.com/<repo>/actions`
2. Odaberi **"Prisma - Build/Push & Migrate (ECR→ECS)"**
3. Klikni **"Run workflow"** > **"Run workflow"**

### 📊 Workflow Proces

```
┌─────────────────────────────────────┐
│ 1. Push na main                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. GitHub Actions detektira promjene│
│    u uslugar/backend/prisma/**      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. Build Prisma Docker image        │
│    - Dockerfile.prisma               │
│    - Push na AWS ECR                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 4. Run ECS Fargate Task             │
│    - One-off task na AWS             │
│    - npx prisma migrate deploy       │
│    - Primijeni sve pending migracije│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 5. Run Seed (opcionalno)            │
│    - npm run seed                    │
└─────────────────────────────────────┘
```

### 🔍 Provjera Statusa

**GitHub Actions:**
- Idi na `Actions` tab u GitHub repo-u
- Provjeri status `prisma` i `seed` job-a
- Klikni na job za detaljne logove

**CloudWatch Logs:**
- Log group: `/ecs/uslugar/prisma`
- Stream: `oneoff/prisma/<task-id>`
- Stream (seed): `seed/prisma-seed/<task-id>`

### ⚙️ Konfiguracija

Workflow koristi:

**AWS Secrets (postaviti u GitHub Secrets):**
```
AWS_OIDC_ROLE_ARN=arn:aws:iam::XXX:role/GitHubActions
DB_SECRET_ARN=arn:aws:secretsmanager:eu-north-1:XXX:secret:uslugar-db-XXX
AWS_ECS_TASK_EXEC_ROLE_ARN=arn:aws:iam::XXX:role/ecsTaskExecutionRole
AWS_ECS_TASK_ROLE_ARN=arn:aws:iam::XXX:role/ecsTaskRole
```

**AWS Env Variables:**
```yaml
AWS_REGION: eu-north-1
ECR_REPO_PRISMA: uslugar-prisma-tasks
ECS_CLUSTER: apps-cluster
MIGRATE_SUBNETS: subnet-0a00f97768705bbcf,subnet-0546fb6cc0ad2cc37
MIGRATE_SG: sg-084c1e49c9c77aff1
```

### 🐛 Troubleshooting

**Problem: Migracija se ne pokreće**
- ✅ Provjeri da li su fajlovi u `uslugar/backend/prisma/**` u commit-u
- ✅ Provjeri GitHub Actions da li je workflow enabled
- ✅ Provjeri da li postoji Dockerfile.prisma

**Problem: Migracija fails na ECS**
- ✅ Provjeri CloudWatch logs: `/ecs/uslugar/prisma`
- ✅ Provjeri DATABASE_URL u Secrets Manager
- ✅ Provjeri ECS task execution role permissions

**Problem: "Can't reach database server"**
- ✅ Provjeri da je DB u istoj VPC kao ECS subnets
- ✅ Provjeri security group rules (allow 5432 iz subnets)

### ✅ Success Indicators

Nakon uspješnog pokretanja migracije, trebali bi vidjeti:

```bash
✅ Prisma migrations OK
✅ Prisma seed OK
```

U Invoice tabeli:
```sql
SELECT * FROM "Invoice" LIMIT 1;
-- Trebala bi postojati tabela bez greške
```

### 📌 Napomene

- ⚠️ Migracija je **idempotentna** - može se pokrenuti više puta
- ⚠️ Uvijek provjeri CloudWatch logs nakon migracije
- ⚠️ Backup baze prije produkcijske migracije (best practice)

---

**Migracija je spremna za pokretanje!** 🚀

