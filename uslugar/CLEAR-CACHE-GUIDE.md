# 🔄 Kako Očistiti Cache - Hostinger

## Problem: Stara stranica se prikazuje iako si izbrisao fajlove

### Razlozi:
1. **Browser cache** - najčešći uzrok
2. **Hostinger server cache** - LiteSpeed/CloudFlare cache
3. **CDN cache** - ako koristiš CDN
4. **DNS cache** - rijetko

---

## ✅ Rješenja (po prioritetu)

### 1. Browser Cache (Klijentska strana)

#### Chrome/Edge:
```
1. Ctrl + Shift + Delete
2. Odaberi "Cached images and files"
3. Time range: "All time"
4. Clear data

Ili brži način:
Ctrl + Shift + R (hard refresh)
Ctrl + F5
```

#### Firefox:
```
Ctrl + Shift + Delete
Odaberi "Cache"
Clear Now

Ili:
Ctrl + F5
```

#### Incognito/Private mode:
```
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)

Otvori: https://uslugar.oriph.io
Ako ovdje radi = problem je browser cache
```

---

### 2. Hostinger Server Cache

#### A) Control Panel Method:
```
1. Login na Hostinger
2. Hosting > Advanced > Cache Manager
3. Klikni "Clear All Cache" ili "Purge Cache"
4. Čekaj 30-60 sekundi
5. Refresh stranicu (Ctrl+Shift+R)
```

#### B) .htaccess Method:
Dodaj u `/public_html/.htaccess`:
```apache
# Disable caching for development
<IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</IfModule>

# For production, use versioned assets instead
```

⚠️ **Za produkciju makni ovo** - koristi versioned fajlove umjesto disabling cache-a

---

### 3. LiteSpeed Cache (ako je aktivan)

Hostinger često koristi LiteSpeed server:

```bash
# SSH na server:
ssh user@uslugar.oriph.io

# Očisti LiteSpeed cache:
cd /domains/uslugar.oriph.io/public_html
touch .lscache/clear

# Ili preko .htaccess:
# Dodaj na vrh .htaccess fajla:
<IfModule LiteSpeed>
    CacheLookup off
</IfModule>
```

---

### 4. CloudFlare (ako koristiš)

Ako imaš CloudFlare:
```
1. Login na CloudFlare dashboard
2. Odaberi uslugar.oriph.io domain
3. Caching > Configuration
4. Klikni "Purge Everything"
5. Confirm
6. Čekaj 30 sekundi
7. Refresh
```

---

### 5. Provjera - Što se zapravo servira

#### Test sa curl (bez cachea):
```bash
# Provjeri headers
curl -I https://uslugar.oriph.io

# Dobiti ćeš header kao:
# HTTP/2 200 
# cache-control: max-age=3600  <-- ovo znači cache 1h
# age: 1234  <-- koliko je star cache
```

#### Provjeri Last-Modified:
```bash
curl -I https://uslugar.oriph.io | grep -i "last-modified\|date\|age\|cache"
```

#### Forsiraj no-cache request:
```bash
curl -H "Cache-Control: no-cache" -H "Pragma: no-cache" https://uslugar.oriph.io
```

---

## 🎯 Brzo rješenje ZA SADA:

### Opcija 1: Upload prazan index.html
```bash
# SSH na server:
ssh user@uslugar.oriph.io

cd /domains/uslugar.oriph.io/public_html

# Kreiraj minimalan index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Uslugar - U pripremi</title>
</head>
<body>
    <h1>Uslugar.hr - U pripremi</h1>
    <p>Stranica je trenutno u development fazi.</p>
</body>
</html>
EOF

# Briši stare fajlove
rm -rf assets/
```

### Opcija 2: .htaccess redirect
```bash
# Ako želiš redirect na drugu stranicu privremeno:
cat > .htaccess << 'EOF'
# Temporary maintenance redirect
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/maintenance.html$
RewriteRule ^(.*)$ /maintenance.html [R=302,L]
EOF

# Kreiraj maintenance stranicu
cat > maintenance.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Uslugar - Održavanje</title>
</head>
<body>
    <h1>Stranica u izradi</h1>
    <p>Uslugar će uskoro biti dostupan!</p>
</body>
</html>
EOF
```

---

## 🔍 Debugging - Provjeri što se zapravo servira

### 1. Provjeri fajlove na serveru:
```bash
ssh user@uslugar.oriph.io
cd /domains/uslugar.oriph.io/public_html
ls -la

# Trebao bi biti prazan ili samo sa .htaccess
```

### 2. Provjeri cache status:
```bash
# Na lokalnom računalu:
curl -I https://uslugar.oriph.io

# Provjeri headers:
# - Cache-Control
# - Age (koliko je star cache)
# - X-Cache (HIT ili MISS)
# - Server (LiteSpeed, nginx, Apache?)
```

### 3. Test sa drugim deviceom:
```
- Otvori mobitel (mobilni internet, ne WiFi)
- Idi na https://uslugar.oriph.io
- Ako i dalje prikazuje staru verziju = server cache
- Ako prikazuje novu = browser cache na računalu
```

---

## 💡 Prevencija za budućnost

### 1. Koristi Versioned Assets:
Umjesto:
```html
<link rel="stylesheet" href="/assets/style.css">
```

Koristi:
```html
<link rel="stylesheet" href="/assets/style.css?v=2025-10-17">
<!-- ili -->
<link rel="stylesheet" href="/assets/style-abc123.css">
```

Vite automatski kreira hash-ovane fajlove:
```
assets/index-BD2def_i.css  ← hash u imenu
```

### 2. Postavi Cache Headers za development:
```apache
# .htaccess za development
<FilesMatch "\.(html|htm|js|css)$">
    FileETag None
    Header unset ETag
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
</FilesMatch>
```

### 3. Za Production - Dugi cache za assets, kratki za HTML:
```apache
# HTML - kratki cache (može se često mijenjati)
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "max-age=300"
</FilesMatch>

# CSS/JS/Slike - dugi cache (hash u imenu = nema promjena)
<FilesMatch "\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>
```

---

## ✅ Quick Fix - 3 koraka:

```bash
# 1. Browser
Ctrl + Shift + Delete → Clear cache

# 2. Hostinger Panel
Cache Manager → Clear All Cache

# 3. Test
Ctrl + Shift + N (incognito)
https://uslugar.oriph.io
```

---

## 📞 Ako ništa ne radi:

### Last Resort:
```bash
# SSH na server
ssh user@uslugar.oriph.io

# Kompletno očisti public_html
cd /domains/uslugar.oriph.io
rm -rf public_html/*
rm -rf public_html/.*  # briše i hidden fajlove

# Kreiraj jednostavan test fajl
cat > public_html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>TEST</title></head>
<body>
    <h1>TEST - <?php echo date('Y-m-d H:i:s'); ?></h1>
    <p>Ako vidiš ovo, cache je očišćen!</p>
</body>
</html>
EOF

# Provjeri
curl https://uslugar.oriph.io
```

---

**Probaj redom ove korake i javi što vidiš!**

