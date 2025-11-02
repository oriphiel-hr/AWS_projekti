# 🚀 Deploy Documentation Route na Produkciju

## Problem:
- ✅ Route postoji u `server.js` (linija 286)
- ✅ Route file postoji: `src/routes/documentation.js`
- ❌ Backend nije deployan s novim kodom → 404 greška

## Rješenje: Deploy Backend

### Opcija 1: Hostinger FTP Deployment (Ako se koristi Hostinger)

**GitHub Actions Workflow:**
1. Idi na: https://github.com/oriphiel/AWS_projekti/actions
2. Pronađi workflow: **"Uslugar - Deploy to Hostinger"** ili **"Frontend - Build & Deploy"**
3. Klikni **"Run workflow"** → **"main"** → **"Run workflow"**

**Ili ručno push:**
```powershell
git add uslugar/backend/src/routes/documentation.js
git add uslugar/backend/src/server.js
git commit -m "feat: Add documentation API route"
git push origin main
```

### Opcija 2: AWS ECS Deployment (Ako se koristi AWS)

**GitHub Actions Workflow:**
1. Idi na: https://github.com/oriphiel/AWS_projekti/actions
2. Pronađi workflow: **"Backend - Reuse existing Task Definition (ECR→ECS)"**
3. Klikni **"Run workflow"** → **"main"** → **"Run workflow"**

**Ili automatski:**
```powershell
# Push promjene će automatski triggerati workflow
git add uslugar/backend/src/routes/documentation.js
git add uslugar/backend/src/server.js
git commit -m "feat: Add documentation API route"
git push origin main
```

### Opcija 3: Ručni FTP Upload (Hitno rješenje)

Ako backend radi na Hostinger:
1. Upload `uslugar/backend/src/routes/documentation.js` na server
   - Lokacija: `public_html/api/src/routes/documentation.js`
2. Provjeri da `server.js` na serveru ima:
   ```javascript
   import documentationRouter from './routes/documentation.js'
   app.use('/api/documentation', documentationRouter)
   ```
3. Restart Node.js aplikacije u Hostinger Control Panelu

## Provjera nakon deploymenta:

### 1. Provjeri backend health:
```powershell
curl https://uslugar.oriph.io/api/health
# Trebao bi vratiti: {"ok":true,"ts":"..."}
```

### 2. Provjeri documentation endpoint:
```powershell
curl https://uslugar.oriph.io/api/documentation
# Trebao bi vratiti JSON sa features i featureDescriptions
```

### 3. Test u browseru:
```
https://uslugar.oriph.io/api/documentation
```

### 4. Test na stranici:
```
https://uslugar.oriph.io/#documentation
```

## Ako i dalje ne radi:

1. **Provjeri backend logs** (Hostinger Control Panel → Node.js Apps → View Logs)
2. **Provjeri da li route file postoji** na serveru
3. **Provjeri da li `server.js` ima route** registriran
4. **Restart Node.js aplikacije**

## Troubleshooting:

### Greška: "Cannot find module './routes/documentation.js'"
- **Uzrok:** File nije uploadan na server
- **Rješenje:** Upload `documentation.js` na server

### Greška: "Route not found"
- **Uzrok:** Route nije registriran u `server.js`
- **Rješenje:** Provjeri `server.js` na serveru, dodaj route

### Greška: "Table does not exist"
- **Uzrok:** Migracije nisu primijenjene
- **Rješenje:** Pokreni Prisma workflow za migracije

