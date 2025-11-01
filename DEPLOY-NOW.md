# 🚀 Deployment - Pokreni Sada

## ✅ Rješenje 1: GitHub Actions (Najbrže - Preporučeno)

### Backend Deployment:

1. **Otvori GitHub:**
   - https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml

2. **Klikni "Run workflow" → "Run workflow"**
   - Workflow će automatski:
     - Buildati Docker image
     - Pushati na AWS ECR
     - Deployati na ECS
   
3. **Čekaj 5-10 minuta**

---

### Frontend Deployment:

1. **Otvori GitHub:**
   - https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/frontend-uslugar.yml

2. **Klikni "Run workflow" → "Run workflow"**
   - Workflow će automatski:
     - Buildati React frontend
     - Deployati na Hostinger FTP
   
3. **Čekaj 3-5 minuta**

---

## ✅ Rješenje 2: Ručni Deployment (PowerShell)

### Backend:

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend
.\deploy-manual.ps1
```

### Frontend:

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend
npm ci
npm run build
# Zatim uploadaj dist/ folder na Hostinger FTP
```

---

## 📊 Provjera Deploymenta

### Backend:
```bash
curl https://uslugar.api.oriph.io/api/health
```

### Frontend:
```bash
curl https://uslugar.oriph.io
```

---

## 🔍 Status Promjena za Deployment:

✅ **DNS verifikacija** - Implementirana provjera TXT zapisa  
✅ **Email verifikacija** - Radi (provjerava domenu)  
✅ **SMS verifikacija** - Radi (s rate limiting i simulation mode fallback)  
✅ **Rate limiting fix** - Vraća postojeći kod umjesto 429 error  
✅ **Backend kod** - Spreman  
✅ **Frontend kod** - Spreman  

---

## ⚡ Najbrži Način:

**Idi na GitHub i pokreni workflow-e ručno:**
- Backend: https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml
- Frontend: https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/frontend-uslugar.yml

**Vrijeme:** ~10-15 minuta ukupno
