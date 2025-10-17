# 🚨 PROBLEM: ECS Ne Koristi Novi Docker Image

**Status:** GitHub Actions ✅ SUCCESS, ALI backend još uvijek vraća 404!

**Uzrok:** ECS service nije pokrenuo novi task sa novim Docker image-om.

---

## 🎯 RJEŠENJA:

### Opcija 1: Force ECS Service Update (NAJBRŽE)

**AWS Console:**
1. ECS → Clusters → `apps-cluster`
2. Services → `uslugar-service-2gk1f1mv`
3. Klikni **"Update service"** (gore desno)
4. **NE MIJENJAJ NIŠTA!**
5. Skroluj dolje i klikni **"Force new deployment"** checkbox ✅
6. Klikni **"Update"**

**Što će se dogoditi:**
- ECS će zaustaviti stari task
- Pokrenuti novi task sa NAJNOVIJIM Task Definition-om
- Trajanje: ~2-3 minute

---

### Opcija 2: Stop Current Task (Alternativa)

**AWS Console:**
1. ECS → Clusters → `apps-cluster`
2. Services → `uslugar-service-2gk1f1mv`
3. **Tasks** tab
4. Selektiraj running task (checkbox)
5. Klikni **"Stop"**
6. Potvrdi

**Što će se dogoditi:**
- ECS će automatski pokrenuti novi task
- Downtime: ~30 sekundi

---

### Opcija 3: AWS CLI (Ako imaš AWS CLI)

```powershell
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --force-new-deployment \
  --region eu-north-1
```

---

## 📊 Nakon Force Update-a:

### 1. Pričekaj 2-3 minute

ECS treba vrijeme da:
- Zaustavi stari task
- Pull-a najnoviji Docker image iz ECR
- Pokrene novi task
- Health check prođe

### 2. Provjeri CloudWatch Logs

**AWS Console** → CloudWatch → `/ecs/uslugar`

**NOVI log stream** (kreiran nakon force update-a)

**Trebao bi vidjeti:**
```
✅ API listening on :8080
✅ Socket.io ready for real-time chat
```

**I onda TEST API poziv:**
```
GET /api/categories → 200 OK (NE 404!)
```

### 3. Test API

```
https://uslugar.api.oriph.io/api/categories
```

**Očekuješ:**
- ✅ `[]` ili `[{...}]` = **RADI!** 🎉
- ❌ `404` = Još problem, provjeri Task Definition revision

### 4. Test Frontend

```
https://uslugar.oriph.io
```

**Hard refresh:** Ctrl+Shift+R

**F12 → Console:**
- ✅ NE bi trebao vidjeti `GET /api/categories 404`

---

## 🔍 Debug: Zašto Se To Dogodilo?

### Provjeri Task Definition Revision

**AWS Console:**
1. ECS → Task Definitions → `uslugar`
2. Najnovija revision (trebao bi biti novi broj nakon GitHub Actions)

**Provjeri:**
- Je li image URI ažuriran sa novim SHA?
- `666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:6a5dfd6...`

### Provjeri Service Task Definition

**AWS Console:**
1. ECS → Services → `uslugar-service-2gk1f1mv`
2. **Task definition** field

**Provjeri:**
- Koristi li najnoviju revision?
- Ako NE - GitHub Actions možda nije ažurirao service

---

## 🆘 Ako I Dalje Ne Radi:

Ako nakon force update-a JOŠ UVIJEK dobijaš 404:

### Mogući problemi:

1. **Docker image nije build-an sa novim kodom**
   - GitHub Actions možda nije uzeo najnoviji kod
   - Provjeri GitHub Actions logs - build step

2. **ECR ne sadrži novi image**
   - AWS Console → ECR → `uslugar` repo
   - Provjeri image sa tagom `6a5dfd6`

3. **Task Definition nije ažuriran**
   - GitHub Actions možda nije registrirao novu revision
   - Ručno kreiraj Task Definition sa novim image URI

---

## 📞 Javi Mi Rezultate:

Nakon force update-a (Opcija 1 ili 2):

1. **CloudWatch logs** - Novi log stream? Što piše?
2. **API test** - `/api/categories` → ?
3. **Frontend** - Radi? Ima kategorije?
4. **ECS Service** - Task Definition revision?

---

**Akcija: Pokreni Opciju 1 (Force new deployment) i javi rezultate!** 🚀

