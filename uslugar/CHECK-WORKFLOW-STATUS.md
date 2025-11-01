# ✅ Workflow Pokrenut - Provjera Statusa

## 🚀 Status

**Commit:** `ce6db14`  
**Branch:** `main`  
**Workflow:** `Prisma - Build/Push & Migrate (ECR→ECS)`

## 📊 Kako Pratiti Workflow

### 1. GitHub Actions (Preporučeno)

1. Otvori: `https://github.com/oriphiel-hr/AWS_projekti/actions`
2. Pronađi workflow: **"Prisma - Build/Push & Migrate (ECR→ECS)"**
3. Klikni na najnoviji run (commit `ce6db14`)
4. Pratite:
   - **prisma** job - Build & deploy migracija
   - **seed** job - Pokreće se automatski nakon uspješne migracije

### 2. CloudWatch Logs (Za detalje)

**Log Group:** `/ecs/uslugar/prisma`

**Streams:**
- `oneoff/prisma/<task-id>` - Migracije
- `seed/prisma-seed/<task-id>` - Seed podaci

### 3. AWS ECS Console

1. Idi na: AWS Console → ECS → Clusters → `apps-cluster`
2. Klikni na **Tasks** tab
3. Filtriraj po **Task definition**: `uslugar-prisma-oneoff`
4. Provjeri **Last status** i **Exit code**

## ⏱️ Vrijeme Izvršavanja

- **Build Docker image:** ~2-3 min
- **ECS Task (migracija):** ~1-2 min
- **Seed (ako se pokreće):** ~30 sek

**Ukupno:** ~4-6 minuta

## ✅ Očekivani Output

Nakon uspješnog izvršavanja:

```
✅ Prisma migrations OK
✅ Prisma seed OK
```

## 🔍 Ručno Pokretanje (Ako Treba)

Ako workflow ne starta automatski:

1. GitHub → Actions
2. Odaberi **"Prisma - Build/Push & Migrate (ECR→ECS)"**
3. Klikni **"Run workflow"** → **"Run workflow"**

## 📝 Provjera Migracije Nakon Pokretanja

Kada se workflow završi, provjeri da je Invoice tabela kreirana:

```sql
-- Provjeri enum-ove
SELECT typname FROM pg_type WHERE typname IN ('InvoiceType', 'InvoiceStatus');

-- Provjeri tabelu
SELECT tablename FROM pg_tables WHERE tablename = 'Invoice';

-- Provjeri strukturu
\d "Invoice"
```

## 🐛 Troubleshooting

**Problem: Workflow ne starta**
- Provjeri da li je workflow enabled u GitHub Settings → Actions
- Provjeri da li su fajlovi u `uslugar/backend/prisma/**` u commit-u

**Problem: Migracija fails**
- Provjeri CloudWatch logs: `/ecs/uslugar/prisma`
- Provjeri DATABASE_URL u Secrets Manager
- Provjeri ECS task execution role permissions

**Problem: "Can't reach database"**
- Provjeri security groups (allow 5432 iz ECS subnets)
- Provjeri da je DB u istoj VPC

---

**Workflow je pokrenut! Pratite status na GitHub Actions.** 🚀

