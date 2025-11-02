# 🚨 URGENT: Backend Deployment za /api/documentation

## Problem:
- Route `/api/documentation` vraća **404**
- Nginx prosljeđuje na `https://uslugar.api.oriph.io/api/documentation`
- Backend na `uslugar.api.oriph.io` vjerojatno nije deployan s novim kodom

## ✅ Rješenje:

### 1. Provjeri da li direktni backend API radi:

```powershell
curl https://uslugar.api.oriph.io/api/health
curl https://uslugar.api.oriph.io/api/documentation
```

**Ako NE radi:**
- Backend nije deployan → Pokreni backend deployment workflow

**Ako radi:**
- Problem je u Nginx proxy konfiguraciji ili cache-u

### 2. Pokreni Backend Deployment Workflow:

**GitHub Actions:**
👉 https://github.com/oriphiel/AWS_projekti/actions

**Traži:**
- "Backend - Reuse existing Task Definition (ECR→ECS)"
- Klikni **"Run workflow"** → **"Run workflow"** button

**Ili triggeri automatski:**
```powershell
# Napravi malu promjenu u backend-u
git add uslugar/backend/src/routes/documentation.js
git commit -m "fix: Force redeploy documentation route"
git push origin main
```

### 3. Čekaj deployment:

**Timeline:**
- Workflow start → ~1 minuta
- Docker build → ~3-5 minuta
- ECR push → ~1 minuta
- ECS update → ~2-3 minuta

**Ukupno: ~7-10 minuta**

### 4. Provjeri nakon deploymenta:

```powershell
# Test direktno
curl https://uslugar.api.oriph.io/api/documentation

# Test kroz proxy
curl https://uslugar.oriph.io/api/documentation
```

**Očekivano:**
- ✅ JSON odgovor (ne 404)
- ✅ `{ features: [...], featureDescriptions: {...} }`

---

## 🔍 Debug:

Ako i dalje ne radi nakon deploymenta:

1. **Provjeri CloudWatch logs:**
   - AWS Console → CloudWatch → Log groups → `/ecs/uslugar`
   - Traži greške u backend log stream-ovima

2. **Provjeri ECS task status:**
   - AWS Console → ECS → Clusters → `apps-cluster`
   - Services → `uslugar-service-*`
   - Provjeri da li task radi i da li koristi najnoviju task definition

3. **Provjeri da li route file postoji:**
   - U CloudWatch logs traži: `GET /api/documentation`
   - Ako ne postoji u logovima → route nije registriran u serveru

---

**Hitno: Pokreni backend deployment workflow!** 🚀

