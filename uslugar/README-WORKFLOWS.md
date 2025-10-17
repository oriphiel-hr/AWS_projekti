# 🚀 GitHub Actions - Brzi Pregled

## ✅ Frontend Deployment Workflow

**Fajl:** `.github/workflows/frontend-uslugar.yml`

### Automatski deploya kada:
```bash
git push origin main  # (promjene u uslugar/frontend/**)
```

### Ili ručno:
GitHub → Actions → "Frontend - Build & Deploy" → Run workflow

### Potrebni GitHub Secrets:
```
HOSTINGER_HOST=ftp.uslugar.oriph.io
HOSTINGER_USERNAME=tvoj_ftp_username
HOSTINGER_PASSWORD=tvoj_ftp_password
```

### Što workflow radi:
1. ✅ Detektira Vite framework
2. ✅ Pokreće `npm ci && npm run build`
3. ✅ Kreira `dist/` direktorij
4. ✅ Deploya na FTP: `public_html/`
5. ✅ Site live na: `https://uslugar.oriph.io/`

---

## 📋 Deployment Checklist

### Prije push-a:
```bash
cd uslugar/frontend
npm run build  # Test da build radi
```

### Push:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

### Nakon deploymenta:
1. Idi na GitHub → Actions
2. Provjeri status workflow-a (zelena kvačica ✅)
3. Otvori `https://uslugar.oriph.io/`
4. Ctrl+Shift+R (hard refresh)

---

## 🐛 Ako nešto ne radi:

### Build fails:
```bash
# Test lokalno
cd uslugar/frontend
npm ci
npm run build
```

### FTP fails:
- Provjeri GitHub Secrets (Settings > Secrets)
- Provjeri FTP credentials u Hostingeru

### Stara verzija se prikazuje:
- Ctrl+Shift+R (hard refresh browser)
- Provjeri FTP da su novi fajlovi uploadani

---

## 📚 Detaljnija Dokumentacija:

- **`WORKFLOWS-ANALYSIS.md`** - Kompletan pregled svih workflow-a
- **`GITHUB-ACTIONS-DEPLOYMENT.md`** - Detaljne upute za GitHub Actions
- **`FINAL-DEPLOYMENT-GUIDE.md`** - Glavni deployment guide

---

**Sve radi! Samo push na main i frontend se automatski deploya! 🎉**

