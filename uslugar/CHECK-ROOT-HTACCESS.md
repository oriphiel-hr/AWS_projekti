# 🔍 Provjera Root .htaccess Fajla

## 📋 Situacija

`.htaccess` fajl u `public_html/uslugar/.htaccess` je ispravan (bez redirect pravila), ali i dalje se dešava redirect na `uslugar.oriphiel.hr`.

---

## 🔍 Mogući Uzroci

### 1. Drugi .htaccess fajl u root direktoriju

**Problem:** Postoji još jedan `.htaccess` fajl u `public_html/` (root) koji ima redirect pravila.

**Provjera:**
1. **FTP/File Manager:**
   - Navigiraj do `public_html/` (root, ne `uslugar/`)
   - Provjeri da li postoji `.htaccess` fajl
   - Ako postoji, provjeri sadržaj

2. **Ako postoji root .htaccess:**
   - Download fajl
   - Provjeri da li sadrži redirect pravila
   - Ako da, ukloni redirect pravila ili obriši fajl

### 2. Browser Cache

**Problem:** Browser je spremio stari redirect u cache-u.

**Rješenje:**
1. **Hard Refresh:** `Ctrl + Shift + R` ili `Ctrl + F5`
2. **Clear Cache:** Settings → Clear browsing data
3. **Incognito Mode:** Test u private prozoru

### 3. Hostinger Control Panel Redirect

**Problem:** Redirect je postavljen u Hostinger Control Panelu.

**Provjera:**
1. **Hostinger Control Panel** → **Websites** → **Redirects**
2. **Pronađi** redirect za `uslugar.oriph.io`
3. **Obriši** ili **deaktiviraj** ako postoji

### 4. Frontend JavaScript Redirect

**Problem:** Frontend kod možda ima redirect logiku.

**Provjera:**
1. Otvori Developer Tools (F12)
2. Console tab
3. Provjeri da li postoje greške ili redirect poruke
4. Network tab → Provjeri da li postoji redirect request

### 5. DNS Redirect

**Problem:** DNS provider ima redirect postavljen.

**Provjera:**
1. **DNS Zone Editor** → `oriph.io` domena
2. Provjeri da li postoji CNAME ili URL redirect
3. Provjeri A Record postavke

---

## ✅ Koraci za Provjeru

### Korak 1: Provjeri Root .htaccess

**Preko FTP:**
1. Spoji se na FTP
2. Navigiraj do `public_html/` (root, ne `uslugar/`)
3. Provjeri da li postoji `.htaccess` fajl
4. Ako postoji, download i provjeri sadržaj

**Preko File Manager:**
1. Hostinger Control Panel → File Manager
2. Otvori `public_html/` direktorij
3. Provjeri da li postoji `.htaccess` fajl
4. Ako postoji, otvori i provjeri sadržaj

### Korak 2: Provjeri Browser

**Developer Tools:**
1. Otvori Developer Tools (F12)
2. Network tab
3. Posjeti `https://uslugar.oriph.io`
4. Provjeri Response Headers:
   - Traži `Location` header
   - Ako vidiš `Location: https://uslugar.oriphiel.hr`, redirect je aktivan

**Console Tab:**
1. Provjeri da li postoje greške
2. Provjeri da li postoje redirect poruke

### Korak 3: Provjeri Hostinger Control Panel

1. **Login** u Hostinger Control Panel
2. **Websites** → **Redirects**
3. **Provjeri** da li postoji redirect za `uslugar.oriph.io`
4. **Obriši** ako postoji

### Korak 4: Test u Incognito

1. Otvori Incognito/Private prozor
2. Posjeti `https://uslugar.oriph.io`
3. Ako i dalje redirecta, problem nije u cache-u

---

## 🔍 Komandna Linija Provjera

### Provjeri Redirect Header:

```powershell
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -MaximumRedirection 0 -ErrorAction SilentlyContinue
$response.Headers.Location
# Ako vrati: https://uslugar.oriphiel.hr, redirect je aktivan
```

### Provjeri DNS:

```powershell
Resolve-DnsName -Name "uslugar.oriph.io" -Type A
# Provjeri da li pokazuje na ispravnu IP adresu
```

---

## 📋 Checklist

- [ ] **Root .htaccess** - Provjeren (`public_html/.htaccess`)
- [ ] **Subdirectory .htaccess** - Provjeren (`public_html/uslugar/.htaccess`)
- [ ] **Browser cache** - Očišćen
- [ ] **Hostinger Control Panel** - Provjeren za redirect
- [ ] **DNS postavke** - Provjerene
- [ ] **Test u Incognito** - Proveden
- [ ] **Developer Tools** - Provjeren Location header

---

## 🎯 Najvjerojatniji Uzrok

**Problem:** Postoji još jedan `.htaccess` fajl u `public_html/` (root) koji ima redirect pravila.

**Rješenje:**
1. Provjeri `public_html/.htaccess` (root)
2. Ako postoji i ima redirect pravila, ukloni ih
3. Ili obriši root `.htaccess` ako nije potreban

---

## ✅ Očekivani Rezultat

Nakon rješavanja:
- ✅ `https://uslugar.oriph.io` trebao bi raditi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Stranica se učitava na `uslugar.oriph.io`

