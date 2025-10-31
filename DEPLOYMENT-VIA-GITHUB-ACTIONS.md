# 🚀 Deployment kroz GitHub Actions - SMS Verification Fix

## ✅ Što je napravljeno

Promjene su commit-ane i push-ane na `main` branch, što će automatski pokrenuti GitHub Actions workflow-ove.

---

## 🔄 Automatski Deployment

### Backend (AWS ECS)
- **Workflow:** `.github/workflows/backend-uslugar-ecs.yml`
- **Trigger:** Push na `main` s promjenama u `uslugar/backend/**`
- **Proces:**
  1. Build Docker image
  2. Push na AWS ECR
  3. Update ECS task definition
  4. Deploy na ECS service (`uslugar-service-2gk1f1mv`)

### Frontend (Hostinger FTP)
- **Workflow:** `.github/workflows/frontend-uslugar.yml`
- **Trigger:** Push na `main` s promjenama u `uslugar/frontend/**`
- **Proces:**
  1. Detect framework (Vite)
  2. Build frontend (`npm ci && npm run build`)
  3. Deploy na Hostinger FTP (`public_html/`)

---

## 📊 Monitor Deployment

### Provjeri Status Workflow-ova:

1. **Idite na GitHub repo:**
   ```
   https://github.com/oriphiel-hr/AWS_projekti/actions
   ```

2. **Provjerite workflow run-ove:**
   - ✅ **Backend - Reuse existing Task Definition (ECR→ECS)**
   - ✅ **Frontend - Build & Deploy (Hostinger)**

3. **Kliknite na workflow run da vidite detalje:**
   - Build status
   - Deploy status
   - Eventualne greške

---

## 🔑 Potrebni GitHub Secrets

### Backend (AWS ECS):
```
AWS_OIDC_ROLE_ARN=arn:aws:iam::666203386231:role/GitHubActionsRole
```

### Frontend (Hostinger FTP):
```
HOSTINGER_HOST=ftp.uslugar.oriph.io
HOSTINGER_USERNAME=vaš_ftp_username
HOSTINGER_PASSWORD=vaš_ftp_password
HOSTINGER_SERVER_DIR=public_html/  # Optional
```

**Provjeri da su secrets postavljeni:**
- GitHub repo → Settings → Secrets and variables → Actions

---

## ⏱️ Vrijeme Deploymenta

- **Backend (AWS ECS):** ~5-10 minuta
  - Docker build: ~3-5 min
  - ECR push: ~1 min
  - ECS update: ~2-5 min

- **Frontend (Hostinger FTP):** ~2-3 minuta
  - Build: ~1-2 min
  - FTP upload: ~1 min

---

## ✅ Testiranje nakon Deploymenta

### 1. Backend Test:
```bash
# Provjeri ECS service status
aws ecs describe-services \
  --cluster apps-cluster \
  --services uslugar-service-2gk1f1mv \
  --region eu-north-1 \
  --query 'services[0].deployments'

# Provjeri logove
aws logs tail /ecs/uslugar-backend --follow --region eu-north-1
```

### 2. Frontend Test:
1. Hard refresh stranice (Ctrl + Shift + R)
2. Idite na Identity Badge verifikaciju
3. Odaberite "📱 Telefon"
4. ✅ **Trebali biste vidjeti SMS workflow** (ne automatska verifikacija)
5. Unesite telefonski broj i verificirajte SMS kodom

### 3. Navigacija Test:
1. Idite na email verifikaciju
2. Kliknite "Nastavi na platformu"
3. ✅ **Trebali biste biti preusmjereni na `#user` tab**

---

## 🔄 Ručno Pokretanje Workflow-ova

Ako želite ručno pokrenuti workflow:

1. **GitHub repo** → **Actions** tab
2. Odaberite workflow (Backend ili Frontend)
3. Kliknite **Run workflow** → **Run workflow**

---

## 📝 Promjene u kodu

### Backend:
- `uslugar/backend/src/routes/kyc.js`:
  - `/kyc/verify-identity` endpoint provjerava `User.phoneVerified`
  - Tek ako je telefon verificiran SMS kodom, postavlja se `identityPhoneVerified`

### Frontend:
- `uslugar/frontend/src/components/IdentityBadgeVerification.jsx`:
  - Integrirana `PhoneVerification` komponenta
  - SMS workflow umjesto automatske verifikacije
  
- `uslugar/frontend/src/App.jsx`:
  - Dodan `'user'` u `validTabs` array

---

## 🆘 Troubleshooting

**Workflow ne starta?**
- Provjerite da su promjene u pravim pathovima:
  - Backend: `uslugar/backend/**`
  - Frontend: `uslugar/frontend/**`

**Workflow fails?**
- Provjerite GitHub Secrets (Settings → Secrets)
- Provjerite workflow logs (Actions → Workflow run → Job → Step)

**Backend deployment fails?**
- Provjerite AWS credentials (OIDC Role ARN)
- Provjerite ECR repository permissions
- Provjerite ECS service name

**Frontend deployment fails?**
- Provjerite FTP credentials
- Provjerite da `dist/` folder postoji nakon builda
- Provjerite Hostinger FTP server status

---

**Status:** ✅ Promjene su push-ane i workflow-ovi su pokrenuti! Provjerite GitHub Actions tab za status deploymenta.

