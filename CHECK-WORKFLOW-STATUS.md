# ⏳ Provjera Statusa Backend Deployment-a

## Mogući uzroci 404 greške:

### 1. Workflow još nije završio ⏳
- **Deployment traje ~7-10 minuta**
- Provjeri GitHub Actions - da li workflow još radi?
- Ako još radi → čekaj da završi

### 2. Provjeri GitHub Actions

**Otvori:** https://github.com/oriphiel/AWS_projekti/actions

**Provjeri najnoviji workflow run:**
- "Backend - Reuse existing Task Definition (ECR→ECS)"
- Status: Running / Completed / Failed

**Ako je "Running":**
- ⏳ Čekaj da završi (~5-10 minuta)
- Refresh stranicu nakon nekoliko minuta

**Ako je "Failed":**
- ❌ Provjeri logs za greške
- Možda Docker build ne uspijeva
- Možda deployment ima problema

**Ako je "Completed" sa zelenom kvačicom:**
- ✅ Deployment je uspješan
- Možda treba malo vremena da ECS restartuje task
- Pokušaj ponovo za ~2 minute

### 3. Provjeri da li je route commitan

```powershell
git log --oneline -- "uslugar/backend/src/routes/documentation.js"
```

**Ako nema rezultata:**
- Route nije commitan
- Treba commitati prije deploymenta

### 4. Provjeri da li backend server radi

```powershell
curl https://uslugar.oriph.io/api/health
```

**Ako vraća grešku:**
- Backend server nije pokrenut
- Provjeri ECS service status

**Ako vraća `{"ok":true}`:**
- Backend radi
- Problem je specifično sa `/api/documentation` route-om

### 5. Force restart ECS task

Ako deployment je završio ali route i dalje ne radi:

1. **AWS Console** → ECS
2. **Clusters** → `apps-cluster`
3. **Services** → `uslugar-service-2gk1f1mv`
4. **Tasks tab** → Pronađi running task
5. **Stop task** → Čekaj da se restartuje

---

## Preporuka:

**Prvo provjeri GitHub Actions:**
1. Otvori: https://github.com/oriphiel/AWS_projekti/actions
2. Pronađi najnoviji backend workflow run
3. Provjeri status (Running/Completed/Failed)
4. Ako je Completed → provjeri da li je deployment uspješan
5. Ako još radi → čekaj

**Zatim testiraj:**
```powershell
# Čekaj ~5 minuta nakon što workflow završi
curl https://uslugar.oriph.io/api/documentation
```

---

**Najvjerojatniji uzrok: Workflow još nije završio ili je tek završio i ECS task se još restartuje!** ⏳

