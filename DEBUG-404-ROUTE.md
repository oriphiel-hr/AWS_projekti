# 🔍 Debug: 404 za /api/documentation - Workflow završio

## Problem:
- ✅ Workflow je završio
- ❌ Endpoint i dalje vraća 404
- ❌ Route možda nije pravilno registriran ili deployan

## Provjere:

### 1. Provjeri da li je route file commitan PRIJE workflow-a

**Provjeri commit history:**
```powershell
git log --oneline --all -- "uslugar/backend/src/routes/documentation.js"
```

**Ako nema commit-a:**
- Route nije bio commitan kada se workflow pokrenuo
- Workflow je buildao staru verziju bez route-a
- **Rješenje:** Commit route file i pokreni workflow ponovo

### 2. Provjeri da li backend server radi

```powershell
curl https://uslugar.oriph.io/api/health
```

**Ako ne radi:**
- Backend server nije pokrenut
- Provjeri ECS service status

**Ako radi:**
- Backend radi, ali route ne postoji
- Problem je specifično sa route registracijom

### 3. Provjeri workflow logs

**GitHub Actions:**
👉 https://github.com/oriphiel/AWS_projekti/actions

**Provjeri:**
- Da li je Docker build uspješan?
- Da li se pojavljuje `documentation.js` u build output-u?
- Ima li grešaka u deploymentu?

### 4. Provjeri da li route postoji u server.js

**U kodu:**
- `import documentationRouter from './routes/documentation.js'` (linija 40)
- `app.use('/api/documentation', documentationRouter)` (linija 286)

**Provjeri da li je ovo commitano PRIJE workflow-a:**
```powershell
git log --oneline --all --since="3 hours ago" -- "uslugar/backend/src/server.js" | Select-String "documentation"
```

### 5. Mogući uzroci:

#### A. Route file nije bio commitan
- **Uzrok:** Workflow buildao staru verziju bez route-a
- **Rješenje:** 
  1. Commit route file i server.js
  2. Push
  3. Pokreni workflow ponovo

#### B. Import greška u server.js
- **Uzrok:** Route file ne može biti importan
- **Rješenje:** Provjeri da li file postoji i ima `export default`

#### C. ECS task nije restartan
- **Uzrok:** Staru verziju container-a još uvijek radi
- **Rješenje:** Force restart ECS service

#### D. Route je deployan ali ne radi
- **Uzrok:** Možda ima grešku u route kodu
- **Rješenje:** Provjeri CloudWatch logs za backend

### 6. Hitno rješenje:

#### Opcija 1: Commit i redeploy
```powershell
# Provjeri da li je route commitan
git log --oneline -- "uslugar/backend/src/routes/documentation.js"

# Ako nije, commit:
git add uslugar/backend/src/routes/documentation.js
git add uslugar/backend/src/server.js
git commit -m "fix: Add documentation route - ensure it's committed"
git push origin main

# Pokreni workflow ponovo
```

#### Opcija 2: Provjeri ECS logs
- AWS Console → CloudWatch Logs
- Log group: `/ecs/uslugar`
- Stream: `backend`
- Traži greške pri startup-u

#### Opcija 3: Force restart ECS
- AWS Console → ECS → Services
- Update service → Force new deployment

---

## Preporuka:

**Provjeri prvo:** Da li je route file commitan PRIJE workflow-a?

Ako nije → to je problem! Commit i redeploy.

Ako jest → provjeri workflow logs za greške.

