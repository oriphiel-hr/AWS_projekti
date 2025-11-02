# 🔍 Debug: 404 Error za /api/documentation

## Problem:
- ✅ Workflow je pokrenut
- ❌ Endpoint i dalje vraća 404
- ❌ Deployment možda još nije završio ili ima grešku

## Provjere:

### 1. Provjeri da li je workflow završio

**GitHub Actions:**
👉 https://github.com/oriphiel/AWS_projekti/actions

**Traži:**
- Najnoviji "Backend - Reuse existing Task Definition" run
- Provjeri da li ima **zelenu kvačicu** ✅
- Provjeri **logs** za greške

**Ako workflow još radi:**
- ⏳ Čekaj da završi (~7-10 minuta)
- Workflow može biti u fazi: Build → Push → Deploy

**Ako workflow ima grešku:**
- ❌ Provjeri logs za detalje
- Možda Docker build ne uspijeva
- Možda ECS deployment ima problema

### 2. Provjeri backend health

```powershell
curl https://uslugar.oriph.io/api/health
```

**Očekivano:**
- `{"ok":true,"ts":"..."}` → Backend radi ✅
- Error → Backend ne radi ❌

### 3. Provjeri ECS deployment

**Ako imaš AWS pristup:**

1. **AWS Console** → ECS → Clusters → `apps-cluster`
2. **Services** → `uslugar-service-2gk1f1mv`
3. **Provjeri:**
   - Task Status: Should be "RUNNING"
   - Latest Task Definition: Should be nova verzija
   - Events: Provjeri da li ima deployment success

### 4. Mogući uzroci:

#### A. Deployment još nije završio
- **Rješenje:** Čekaj ~5-10 minuta i pokušaj ponovo

#### B. Route nije deployan
- **Uzrok:** Server.js na serveru nema route
- **Rješenje:** Provjeri da li workflow uspješno builda i deploya novi kod

#### C. Backend container nije restartan
- **Uzrok:** ECS task nije restartan s novom verzijom
- **Rješenje:** Force new deployment u ECS

#### D. Route file nije u Docker image-u
- **Uzrok:** `documentation.js` nije kopiran u Docker image
- **Rješenje:** Provjeri Dockerfile da li kopira sve fajlove

### 5. Provjeri Dockerfile

**Provjeri:** `uslugar/backend/Dockerfile` ili `Dockerfile.prod`

**Trebali bi vidjeti:**
```dockerfile
COPY src/ ./src/
# ili
COPY . .
```

**Ako nema:**
- Route file neće biti u image-u
- Treba ažurirati Dockerfile

### 6. Force restart ECS service

**Ako deployment nije uspješan:**

1. **AWS Console** → ECS → Services → `uslugar-service-2gk1f1mv`
2. **Update service**
3. **Force new deployment:** ✅ Check
4. **Update**

---

## Najbrže rješenje:

### Opcija 1: Čekaj da workflow završi
- Workflow možda još radi
- Provjeri GitHub Actions za status
- Pokušaj ponovo nakon ~10 minuta

### Opcija 2: Provjeri workflow logs
- Otvori najnoviji workflow run
- Provjeri logs za greške
- Ako ima greške → popravi ih

### Opcija 3: Ručno provjeri server
- Ako backend radi na Hostinger → SSH i provjeri `server.js`
- Ako backend radi na AWS → Provjeri CloudWatch logs

---

**Prvo provjeri GitHub Actions - da li je workflow uspješno završio!** ✅

