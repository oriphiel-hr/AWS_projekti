# 🚀 FRONTEND DEPLOYMENT - Brze Instrukcije

## ✅ BACKEND JE VEĆ DEPLOYOVAN
```
✓ Backend deployment završen
✓ Task Definition: uslugar:91
✓ Novi kod sa cascade delete fix-om je aktivan
```

## ⚠️ FRONTEND NIJE JOŠ DEPLOYOVAN

**To je razlog zašto dugmad ne rade** - gledate staru verziju na uslugar.oriph.io!

---

## 📦 NOVI FRONTEND BUILD JE SPREMAN

Lokacija: `C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend\dist\`

**Fajlovi za upload:**
```
dist/
├── index.html (NOVI - sa navigation fix-om)
├── uslugar.ico
└── assets/
    ├── index-CxMYklVb.css
    └── index-lRHqu7uy.js (NOVI - 567 KB)
```

---

## 🔧 OPCIJA 1: FTP Upload (FileZilla ili WinSCP)

### **FileZilla:**
1. **Otvorite FileZilla**
2. **Connect:**
   - Host: `ftp.oriph.io`
   - Username: vaš FTP username
   - Password: vaša FTP lozinka
3. **Navigate:**
   - Remote: `/domains/uslugar.oriph.io/public_html/`
   - Local: `C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend\dist\`
4. **Upload:**
   - Selektujte SVE fajlove iz `dist/`
   - Drag & drop u `public_html/`
   - Overwrite sve postojeće fajlove

### **WinSCP:**
1. **Otvorite WinSCP**
2. **New Session:**
   - File protocol: FTP
   - Host: `ftp.oriph.io`
   - Username/Password
3. **Navigate** i upload sve iz `dist/` u `public_html/`

---

## 🔧 OPCIJA 2: PowerShell FTP Skripta

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend
.\deploy-frontend-ftp.ps1
```

---

## 🔧 OPCIJA 3: AWS S3 (ako koristite CloudFront)

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend

# Upload na S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## ✅ NAKON UPLOAD-A

1. **Clear browser cache** (Ctrl + Shift + R)
2. **Idite na:** https://uslugar.oriph.io
3. **Testirajte:**
   - Registracija → Email verifikacija
   - Kliknite "Nastavite na platformu"
   - ✅ Trebalo bi da vas vodi na glavnu stranicu!

---

## 🎯 NAJBRŽI NAČIN

**Ako imate FileZilla ili WinSCP već instaliran:**

1. Otvorite FTP klijent
2. Connect na `ftp.oriph.io`
3. Upload cijeli sadržaj `dist/` foldera
4. **GOTOVO!**

---

## 📊 ŠTA ĆE RADITI NAKON DEPLOY-A

✅ **Navigacija:**
- "Nastavite na platformu" → Vodi na glavnu stranicu
- "Povratak na početnu" → Vodi na glavnu stranicu
- Sve stranice: VerifyEmail, ForgotPassword, ResetPassword

✅ **Backend:**
- Delete korisnika bez foreign key errors
- Cascade delete radi automatski
- Admin panel funkcionalan

---

**Trebate li FTP kredencijale ili pomoć sa upload-om?**


