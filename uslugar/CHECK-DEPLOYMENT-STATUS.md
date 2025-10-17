# 🔍 Provjera Deployment Statusa

## 1️⃣ Provjeri GitHub Actions

**Link:** https://github.com/oriphiel-hr/AWS_projekti/actions

Trebao bi vidjeti najnoviji workflow run:
- **Naziv:** "Backend - Reuse existing Task Definition (ECR→ECS)"
- **Commit:** "Fix: Force backend redeploy + Add favicon to frontend + Deployment docs"
- **SHA:** d636350

### Mogući statusi:

#### 🟡 **In Progress (Žuto):**
- **Što znači:** Deployment još traje
- **Akcija:** Pričekaj još 2-5 minuta, zatim refresh stranicu

#### ✅ **Success (Zeleno):**
- **Što znači:** Deployment je uspješno završio
- **Akcija:** Pričekaj još 1-2 minute da ECS pokrene novi task, zatim testiraj API

#### ❌ **Failed (Crveno):**
- **Što znači:** Deployment nije uspio
- **Akcija:** Klikni na workflow → pregledaj logs → javi mi grešku

---

## 2️⃣ Test API-ja (samo ako je deployment ✅ Success)

Otvori u browseru:

```
https://uslugar.api.oriph.io/api/health
```

**Očekivano:** `{"ok":true,"ts":"..."}`

Zatim:

```
https://uslugar.api.oriph.io/api/categories
```

**Očekivano:** 
- `[]` (prazan array ako nemaš kategorije u bazi)
- ili `[{id, name, ...}]` (array kategorija)

**NE OČEKIVANO:** `404` ili `Cannot GET /api/categories`

---

## 3️⃣ Provjeri CloudWatch Logs

**AWS Console:**
1. CloudWatch → Log groups → `/ecs/uslugar`
2. Klikni na **najnoviji log stream** (trebao bi biti kreiran u posljednjih 10 min)
3. Traži:

### ✅ Dobri znakovi:
```
✅ API listening on :8080
✅ Socket.io ready for real-time chat
✅ New features enabled: Upload, Notifications, Chat...
```

### ❌ Loši znakovi:
```
❌ Error: Cannot find module './routes/categories.js'
❌ DATABASE_URL environment variable is not set
❌ Error connecting to database
❌ ECONNREFUSED
```

Ako vidiš grešku → **kopiraj cijeli error log i javi mi**

---

## 4️⃣ Provjeri ECS Service

**AWS Console:**
1. ECS → Clusters → `apps-cluster`
2. Services → `uslugar-service-2gk1f1mv`
3. Tasks tab

Provjeri:
- **Running tasks:** Trebao bi biti **1**
- **Last deployment:** Trebao bi biti **RECENT** (prije par minuta)
- **Task definition revision:** Novi broj (veći od prethodnog)

Ako je **Running tasks = 0**:
- Task je crash-ao
- Provjeri **Stopped tasks** tab
- Klikni na stopped task → **Logs** → Vidi zašto je crash-ao

---

## 🚨 Brzi Dijagnostički Testovi

### Test 1: Basic Health
```
curl https://uslugar.api.oriph.io/health
```
Očekivano: `ok`

### Test 2: API Health
```
curl https://uslugar.api.oriph.io/api/health
```
Očekivano: `{"ok":true,"ts":"2025-10-17T..."}`

### Test 3: Categories (KLJUČNI TEST)
```
curl https://uslugar.api.oriph.io/api/categories
```
Očekivano: `[]` ili `[...]` (NE 404!)

### Test 4: Jobs
```
curl https://uslugar.api.oriph.io/api/jobs
```
Očekivano: `[]` ili `[...]`

---

## ⚠️ Napomena o Admin Endpointima

Admin endpointi (`/api/admin/*`) zahtijevaju **autentifikaciju**!

Zato su 404 greške za:
```
/api/admin/jobs?page=1&limit=10
```

To je **očekivano** ako nemaš:
1. JWT token u Authorization header
2. Korisnika sa ADMIN rolom

**Ali**, `/api/categories` i `/api/jobs` su **javni** i trebaju raditi bez auth!

---

## 🎯 Što Javi Nazad

Molim te javi:

1. **GitHub Actions status** - In Progress / Success / Failed?
2. **Ako Failed** - Screenshot ili copy/paste error log
3. **Ako Success** - Test rezultate:
   - `/api/health` → ?
   - `/api/categories` → ?
   - `/api/jobs` → ?
4. **CloudWatch logs** - Najnoviji log stream (zadnjih 20 linija)

---

**Hvala!** 🙏

