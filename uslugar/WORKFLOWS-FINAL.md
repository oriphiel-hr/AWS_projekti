# ✅ GitHub Actions Workflows - Finalna Konfiguracija

**Datum:** 17. listopada 2025.

---

## 📋 Aktivni Workflow-i za Uslugar

### **1. `frontend-uslugar.yml`** ⭐ GLAVNI WORKFLOW

**Svrha:** Automatski build i deploy frontend-a na Hostinger

**Kada se pokreće:**
- Push na `main` branch (promjene u `uslugar/frontend/**`)
- Ručno (workflow_dispatch)

**Što radi:**
1. ✅ Detektira framework (Vite)
2. ✅ Pokreće `npm ci && npm run build`
3. ✅ Kreira `dist/` direktorij
4. ✅ FTP upload na `public_html/`
5. ✅ `dangerous-clean-slate: true` (briše stare fajlove)

**FTP Config:**
```yaml
server: ftp.uslugar.oriph.io
local-dir: uslugar/frontend/dist/
server-dir: public_html/
```

**Output:** `https://uslugar.oriph.io/` ✅

---

### **2. `backend-uslugar-ecs.yml`**

**Svrha:** Deploy backend-a na AWS ECS (Docker containers)

**Kada se pokreće:**
- Push na `main` branch (promjene u `uslugar/backend/**`)

**Što radi:**
1. Build Docker image
2. Push na AWS ECR
3. Deploy na AWS ECS cluster

**Koristi:** Ako želiš backend na AWS umjesto Hostingera

---

### **3. `prisma-uslugar.yml`**

**Svrha:** Prisma migrations i setup

**Koristi:** Za database schema promjene

---

## ❌ Uklonjeni Workflow-i

### **`uslugar-hostinger-ftp.yml`** ❌ IZBRISAN

**Razlog:** Duplikat `frontend-uslugar.yml` workflow-a

**Zašto izbrisan:**
- `frontend-uslugar.yml` je robusniji
- Automatska framework detekcija
- Bolje error handling
- Debug output
- `dangerous-clean-slate: true` za čistu instalaciju

---

## 🔑 GitHub Secrets potrebni

Za `frontend-uslugar.yml`:
```
HOSTINGER_HOST=ftp.uslugar.oriph.io
HOSTINGER_USERNAME=vaš_ftp_username
HOSTINGER_PASSWORD=vaš_ftp_password
```

Za `backend-uslugar-ecs.yml` (opcionalno):
```
AWS_OIDC_ROLE_ARN=arn:aws:iam::123456:role/GitHubActions
```

---

## 🚀 Kako koristiti

### Frontend Deployment:

```bash
# 1. Napravi promjene
cd uslugar/frontend/src
# ... edit fajlove ...

# 2. Test lokalno
npm run dev

# 3. Commit i push
git add .
git commit -m "Update frontend: [opis]"
git push origin main

# 4. Automatski se pokreće frontend-uslugar.yml
# Prati na: GitHub > Actions tab

# 5. Rezultat: https://uslugar.oriph.io/
```

### Ručni Trigger:
```
GitHub > Actions > "Frontend - Build & Deploy (Hostinger)" > Run workflow
```

---

## 📊 Deployment Flow

```
Push na main
    ↓
GitHub Actions detektira promjene u uslugar/frontend/**
    ↓
Pokreće frontend-uslugar.yml
    ↓
1. Checkout code
2. Setup Node.js 20
3. Detektira Vite framework
4. npm ci && npm run build
5. Kreira dist/ direktorij
6. FTP upload na public_html/
7. ✅ Done!
    ↓
https://uslugar.oriph.io/ je live!
```

---

## ✅ Prednosti trenutne konfiguracije

1. **Jedan workflow za frontend** - bez duplikata
2. **Automatski deployment** - push i zaboravi
3. **Robusno** - automatska framework detekcija
4. **Debug-friendly** - lista build artifakata
5. **Clean deploys** - `dangerous-clean-slate: true`

---

## 🐛 Troubleshooting

### Workflow se ne pokreće:
```bash
# Provjeri path triggere:
git log -1 --stat | grep "uslugar/frontend"
```

### Build fails:
```bash
# Test lokalno:
cd uslugar/frontend
npm ci
npm run build
```

### FTP fails:
- Provjeri GitHub Secrets
- Provjeri Hostinger FTP status

---

## 📚 Dokumentacija

- **`README-WORKFLOWS.md`** - Brzi pregled
- **`WORKFLOWS-ANALYSIS.md`** - Detaljna analiza
- **`GITHUB-ACTIONS-DEPLOYMENT.md`** - Deployment guide

---

## ✅ Finalni Status

| Workflow | Status | Svrha |
|----------|--------|-------|
| `frontend-uslugar.yml` | ✅ **AKTIVAN** | Frontend → Hostinger |
| `backend-uslugar-ecs.yml` | ✅ Opcionalno | Backend → AWS ECS |
| `prisma-uslugar.yml` | ✅ Utility | Database migrations |
| `uslugar-hostinger-ftp.yml` | ❌ **IZBRISAN** | Duplikat |

---

**Sve je spremno! Jedan workflow, automatski deployment! 🚀**

