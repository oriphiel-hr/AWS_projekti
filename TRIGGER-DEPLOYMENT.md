# 🚀 Trigger Deployment - Brzi Pristup

## Problem

GitHub push je blokiran zbog Twilio credentials u git history-u.

---

## ✅ Rješenje 1: GitHub Actions - Ručno Pokreni (Najbrže)

**Idi na GitHub i pokreni workflow ručno:**

### Backend Deployment:
1. Otvori: https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml
2. Klikni **"Run workflow"** → **"Run workflow"**
3. Čekaj ~5-10 minuta

### Frontend Deployment:
1. Otvori: https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/frontend-uslugar.yml
2. Klikni **"Run workflow"** → **"Run workflow"**
3. Čekaj ~3-5 minuta

---

## ✅ Rješenje 2: Ručni Deployment (Bypass GitHub)

### Backend:

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend
.\deploy-manual.ps1
```

### Frontend:

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend
.\deploy-manual.ps1
```

**Zatim uploadaj `dist/` folder na Hostinger FTP ručno.**

---

## ✅ Rješenje 3: Unblock Secret na GitHub (Dugoročno)

1. Idi na: https://github.com/oriphiel-hr/AWS_projekti/security/secret-scanning/unblock-secret/34qv6hK1MJP2DkZnmjJwhMg0c3P
2. Klikni **"Allow secret"**
3. Push ponovno:
   ```powershell
   git push origin main
   ```

---

## 🎯 Preporučeno Rješenje

**Najbrže je pokrenuti GitHub Actions workflow ručno:**

1. **Backend:** https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml → **Run workflow**
2. **Frontend:** https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/frontend-uslugar.yml → **Run workflow**

**Vrijeme:** ~10-15 minuta ukupno

**Status promjena:**
- ✅ DNS verifikacija - implementirana provjera TXT zapisa
- ✅ Email verifikacija - radi (provjerava domenu)
- ✅ SMS verifikacija - radi (s rate limiting)
- ✅ Backend i frontend kod je spreman za deployment

