# 🚀 Depoljujte Fix na Produkciju

## ✅ Opcija 1: GitHub Actions (Najlakše)

1. **Otiđite na GitHub:**
   - https://github.com/oriphiel-hr/AWS_projekti/actions
   
2. **Manually Trigger Backend Deployment:**
   - Kliknite "Backend - Reuse existing Task Definition (ECR→ECS)"
   - Kliknite "Run workflow" → "main" → "Run workflow"
   - Workflow će automatski:
     - Build Docker image
     - Push na ECR
     - Deploy na ECS
     - **Server.js auto-fix će dodati kolone!**

## ✅ Opcija 2: Tijek Migracije

1. **Manually Trigger Prisma Workflow:**
   - Kliknite "Prisma - Build/Push & Migrate"
   - Kliknite "Run workflow" → "main"
   - Workflow će pokrenuti migracije u Fargate task

## ✅ Opcija 3: Git Push (automatski)

```bash
# Napravi prazan commit da triggeri backend workflow
git commit --allow-empty -m "chore: Trigger backend deployment with auto-fix"
git push origin main
```

## 🔍 Što se događa:

**Server.js auto-fix** (linija 282-300):
```javascript
async function ensureProjectTypeColumn() {
  try {
    await prisma.$queryRaw`SELECT "projectType" FROM "Job" LIMIT 1`
    console.log('✅ projectType column exists')
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('🔧 Adding missing projectType and customFields columns...')
      await prisma.$executeRaw`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "projectType" TEXT`
      await prisma.$executeRaw`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "customFields" JSONB`
      console.log('✅ Columns added successfully')
    }
  }
}
```

**Pri svakom restartu servera:**
1. Server se pokrene
2. Auto-fix provjerava postoje li kolone
3. Ako NE postoje → doda ih
4. API radi normalno!

## 📊 Status

- ✅ Auto-fix kod commit-iran
- ✅ Migracija commit-irana  
- ⏳ Čeka deployment

## 🧪 Nakon Deploymenta:

Test: https://uslugar.oriph.io/#leads

Error više ne bi trebao biti prisutan!

