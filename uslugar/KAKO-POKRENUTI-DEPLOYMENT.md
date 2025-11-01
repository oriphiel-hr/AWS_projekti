# 🚀 Kako Pokrenuti Deployment

## 📍 Problem

Ako dobiješ grešku:
```
.\deploy-manual.ps1 : The term '.\deploy-manual.ps1' is not recognized
```

**Razlog:** Pokrenuo si skriptu iz pogrešnog direktorija.

---

## ✅ Rješenje

### Backend Deployment:

```powershell
# Prijeđi u backend direktorij
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# Pokreni skriptu
.\deploy-manual.ps1
```

**Ili direktno:**
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend && .\deploy-manual.ps1
```

---

### Frontend Build:

```powershell
# Prijeđi u frontend direktorij
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend

# Pokreni skriptu
.\deploy-manual.ps1
```

**Ili direktno:**
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend && .\deploy-manual.ps1
```

---

## ⚡ Najlakši način - GitHub Actions

Umjesto ručnog deploymenta, koristi GitHub Actions:

1. **Backend:**
   - https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml
   - Klikni **"Run workflow"** → **"Run workflow"**

2. **Frontend:**
   - https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/frontend-uslugar.yml
   - Klikni **"Run workflow"** → **"Run workflow"**

**Ukupno vrijeme:** ~10-15 minuta

---

## 🔍 Provjeri da li skripte postoje:

```powershell
# Provjeri backend
Test-Path "C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend\deploy-manual.ps1"

# Provjeri frontend
Test-Path "C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend\deploy-manual.ps1"
```

---

## 💡 Execution Policy Error?

Ako dobiješ grešku o execution policy:

```powershell
# Privremeno dozvoli skripte
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Zatim pokreni skriptu
.\deploy-manual.ps1
```

**Ili pokreni direktno:**
```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-manual.ps1
```

