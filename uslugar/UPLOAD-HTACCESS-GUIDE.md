# 📤 Upload .htaccess Fajla - Vodič

## ✅ Automatski Načini

### 1. GitHub Actions (Preporučeno)

GitHub Actions workflow automatski uploada `.htaccess` fajl kada se pusha promjena u frontend:

```bash
# Samo commit i push bilo koje promjene u frontend
git add uslugar/frontend/
git commit -m "Trigger .htaccess upload"
git push origin main
```

Workflow će automatski:
1. Buildati frontend
2. Uploadati frontend fajlove
3. Uploadati `.htaccess` fajl

---

### 2. PowerShell Skripta (Lokalno)

**Opcija A: S parametrima**
```powershell
cd uslugar
.\upload-htaccess-simple.ps1 -FtpHost "ftp.oriph.io" -FtpUser "username" -FtpPass "password"
```

**Opcija B: S environment varijablama**
```powershell
$env:HOSTINGER_HOST = "ftp.oriph.io"
$env:HOSTINGER_USERNAME = "username"
$env:HOSTINGER_PASSWORD = "password"
cd uslugar
.\upload-htaccess-simple.ps1
```

---

## 📋 Ručni Načini

### 3. FileZilla

1. **Otvorite FileZilla**
2. **Connect:**
   - Host: `ftp.oriph.io` (ili IP adresa)
   - Username: vaš FTP username
   - Password: vaša FTP lozinka
   - Port: 21
3. **Navigate:**
   - Remote: `/domains/uslugar.oriph.io/public_html/`
   - Local: `C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\`
4. **Upload:**
   - Drag & drop `.htaccess` fajl
   - Overwrite postojeći fajl (ako postoji)

---

### 4. WinSCP

1. **Otvorite WinSCP**
2. **New Session:**
   - File protocol: FTP
   - Host: `ftp.oriph.io`
   - Username/Password
3. **Navigate** i upload `.htaccess` u `public_html/`

---

### 5. Hostinger File Manager

1. **Idite u Hostinger Control Panel**
2. **File Manager**
3. **Otvorite** `public_html/` direktorij
4. **Upload** → Select File → `uslugar/.htaccess`
5. **Rename** ako je potrebno (trebao bi biti `.htaccess`)

---

## ✅ Provjera

Nakon uploada, provjerite:

1. **Browser test:**
   - Otvorite: `https://uslugar.oriph.io`
   - Provjerite da li se preusmjerava na `https://uslugar.oriphiel.hr`

2. **Komandna linija:**
   ```powershell
   $response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -MaximumRedirection 0 -ErrorAction SilentlyContinue
   $response.Headers.Location  # Trebao bi biti: https://uslugar.oriphiel.hr/
   ```

3. **Online tool:**
   - https://www.redirectchecker.com/
   - Unesite: `https://uslugar.oriph.io`

---

## 🔍 Troubleshooting

### Problem: FTP connection fails

**Rješenja:**
- Provjerite FTP credentials u Hostinger Control Panelu
- Provjerite da li je FTP omogućen za vaš account
- Pokušajte s IP adresom umjesto hostname-a
- Provjerite firewall postavke

### Problem: Upload succeeds but redirect doesn't work

**Rješenja:**
- Provjerite da li je `.htaccess` fajl u `public_html/` direktoriju
- Provjerite da li Hostinger podržava `.htaccess` (većina shared hostinga da)
- Provjerite da li je `mod_rewrite` omogućen
- Provjerite da li nema drugih `.htaccess` fajlova koji overrideaju redirect

### Problem: SSL Error na novoj domeni

**Rješenje:**
- Instalirajte SSL certifikat za `uslugar.oriphiel.hr` (vidi `HOSTINGER-SSL-SETUP.md`)

---

## 📞 Podrška

Ako imate problema:
- **Hostinger Live Chat:** Dostupan 24/7 u Control Panelu
- **Email:** support@hostinger.com

