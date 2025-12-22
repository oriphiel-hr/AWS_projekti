# 🔧 Rješavanje Server-Side Redirect Problema

## 🔍 Problem

**HTTP Head request pokazuje:**
- **Status:** 301 (Moved Permanently)
- **Location:** `https://uslugar.oriphiel.hr/`

**Zaključak:** Redirect je **SERVER-SIDE**, ne u JavaScriptu!

---

## ✅ Analiza

**Ako server šalje Location header:**
- ❌ Problem **NIJE** u JavaScript fajlu
- ❌ Problem **NIJE** u React kodu
- ✅ Problem **JE** u server-side redirectu

**Mogući uzroci:**
1. `.htaccess` fajl na serveru sadrži redirect pravilo
2. Hostinger Control Panel ima redirect postavljen
3. Root `.htaccess` fajl (`public_html/.htaccess`) sadrži redirect

---

## 🔧 Rješenje

### Korak 1: Provjeri `.htaccess` na Serveru

**Preko FileZilla:**
1. **Connect** na server
2. **Navigiraj** do `public_html/uslugar/`
3. **Download** `.htaccess` fajl
4. **Provjeri** da li sadrži:
   ```apache
   RewriteRule ^(.*)$ https://uslugar.oriphiel.hr/$1 [L,R=301]
   ```
5. **Ako sadrži redirect:**
   - Obriši redirect pravilo
   - Upload novi `.htaccess` bez redirecta

### Korak 2: Provjeri Root `.htaccess`

**Preko FileZilla:**
1. **Navigiraj** do `public_html/` (root)
2. **Provjeri** da li postoji `.htaccess`
3. **Ako postoji:**
   - Download i provjeri
   - Obriši redirect pravilo ako postoji

### Korak 3: Provjeri Hostinger Control Panel

1. **Login:** https://hpanel.hostinger.com
2. **Websites** → **uslugar.oriph.io**
3. **Redirects** ili **Domain Redirects**
4. **Provjeri** da li postoji redirect:
   - **From:** `/` ili `https://uslugar.oriph.io/`
   - **To:** `https://uslugar.oriphiel.hr/`
5. **Obriši** ako postoji

---

## 📋 Ispravan `.htaccess` Fajl

**`public_html/uslugar/.htaccess` trebao bi biti:**

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

**Ili za SPA routing:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API calls
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Don't rewrite assets (CSS, JS, images, etc.)
  RewriteCond %{REQUEST_URI} !^/assets/
  
  # Rewrite everything else to index.html (for SPA routing)
  RewriteRule ^ index.html [L]
</IfModule>
```

**⚠️  NEMA redirecta na `oriphiel.hr`!**

---

## 📋 Checklist

- [ ] **`.htaccess` na serveru provjeren** - Nema redirect pravila
- [ ] **Root `.htaccess` provjeren** - Nema redirect pravila
- [ ] **Hostinger Control Panel provjeren** - Nema redirecta
- [ ] **Novi `.htaccess` uploadan** - Bez redirect pravila
- [ ] **Test HTTP Head** - Nema Location header
- [ ] **Test root URL** - `https://uslugar.oriph.io/` radi bez redirecta

---

## 🎯 Očekivani Rezultat

Nakon rješavanja:
- ✅ HTTP Head request vraća Status 200 (bez Location header)
- ✅ `https://uslugar.oriph.io/` radi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`

---

## 🔍 Debugging Commands

### Provjeri HTTP Headers:
```powershell
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -Method Head -MaximumRedirection 0
$response.Headers.Location  # Trebao bi biti prazan
```

### Provjeri Finalni URL:
```powershell
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -UseBasicParsing
$response.BaseResponse.ResponseUri  # Trebao bi biti uslugar.oriph.io
```

---

## ✅ Finalni Korak

**Upload ispravan `.htaccess` na server:**

1. **FileZilla:**
   - Upload `.htaccess` iz `uslugar/.htaccess` (ili `uslugar/frontend/public/.htaccess`)
   - Remote: `public_html/uslugar/.htaccess`
   - **Overwrite** postojeći fajl

2. **Test:**
   - Provjeri HTTP Head: `Invoke-WebRequest -Uri "https://uslugar.oriph.io" -Method Head -MaximumRedirection 0`
   - Trebao bi vratiti Status 200 bez Location header

