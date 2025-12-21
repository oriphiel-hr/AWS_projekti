# 🔍 Debug Redirect Problema

## 📋 Situacija

- ✅ `.htaccess` u `public_html/uslugar/.htaccess` je ispravan (bez redirect pravila)
- ✅ Ne postoji `public_html/.htaccess` (root)
- ❌ I dalje se dešava redirect na `uslugar.oriphiel.hr`

---

## 🔍 Mogući Uzroci

### 1. Browser Cache ⭐ (Najvjerojatnije)

**Problem:** Browser je spremio stari redirect u cache-u.

**Rješenje:**
1. **Hard Refresh:**
   - Windows: `Ctrl + Shift + R` ili `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Clear Browser Cache:**
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Firefox: Settings → Privacy → Clear Data → Cached Web Content
   - Edge: Settings → Privacy → Clear browsing data → Cached images and files

3. **Incognito/Private Mode:**
   - Otvori `https://uslugar.oriph.io` u incognito/private prozoru
   - Ako radi u incognito, problem je definitivno u cache-u

### 2. Hostinger Control Panel Redirect

**Problem:** Redirect je postavljen u Hostinger Control Panelu (ne u .htaccess).

**Provjera:**
1. **Hostinger Control Panel** → **Websites** → **Redirects**
2. **Pronađi** redirect za `uslugar.oriph.io`
3. **Obriši** ili **deaktiviraj** ako postoji

**Alternativno:**
- **Websites** → **Manage** → **Redirects**
- Provjeri da li postoji redirect postavljen

### 3. DNS Redirect

**Problem:** DNS provider ima redirect postavljen.

**Provjera:**
1. **DNS Zone Editor** → `oriph.io` domena
2. Provjeri da li postoji:
   - CNAME record koji redirecta
   - URL redirect u DNS postavkama
   - A Record koji pokazuje na redirect server

### 4. Backend Redirect Header

**Problem:** Backend API možda šalje redirect header.

**Provjera:**
1. Otvori Developer Tools (F12)
2. Network tab
3. Posjeti `https://uslugar.oriph.io`
4. Provjeri Response Headers:
   - Traži `Location` header
   - Ako vidiš `Location: https://uslugar.oriphiel.hr`, backend šalje redirect

### 5. Frontend JavaScript Redirect

**Problem:** Frontend kod možda ima redirect logiku.

**Provjera:**
1. Developer Tools (F12) → Console tab
2. Provjeri da li postoje greške ili redirect poruke
3. Provjeri da li postoji JavaScript kod koji radi redirect

### 6. CDN/Proxy Cache

**Problem:** Ako koristiš CDN ili proxy, možda ima stari cache.

**Rješenje:**
- Clear CDN cache (ako koristiš CloudFlare ili slično)
- Provjeri proxy postavke

---

## ✅ Koraci za Debug

### Korak 1: Provjeri Browser Cache

**Test u Incognito:**
1. Otvori Incognito/Private prozor
2. Posjeti `https://uslugar.oriph.io`
3. Ako radi u incognito, problem je u cache-u

**Hard Refresh:**
- `Ctrl + Shift + R` ili `Ctrl + F5`

### Korak 2: Provjeri Developer Tools

**Network Tab:**
1. Otvori Developer Tools (F12)
2. Network tab
3. Posjeti `https://uslugar.oriph.io`
4. Klikni na prvi request
5. Provjeri Response Headers:
   - Traži `Location` header
   - Provjeri `Status Code` (301 ili 302 = redirect)

**Console Tab:**
1. Provjeri da li postoje greške
2. Provjeri da li postoje redirect poruke

### Korak 3: Provjeri Hostinger Control Panel

1. **Login** u Hostinger Control Panel
2. **Websites** → **Redirects**
3. **Provjeri** da li postoji redirect za `uslugar.oriph.io`
4. **Obriši** ako postoji

### Korak 4: Provjeri DNS

**Komandna linija:**
```powershell
Resolve-DnsName -Name "uslugar.oriph.io" -Type A
# Provjeri da li pokazuje na ispravnu IP adresu
```

**DNS Zone Editor:**
1. Hostinger Control Panel → DNS Zone Editor
2. Provjeri A Record za `uslugar.oriph.io`
3. Provjeri da li postoji CNAME ili URL redirect

### Korak 5: Provjeri HTTP Response

**Komandna linija:**
```powershell
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -MaximumRedirection 0 -ErrorAction SilentlyContinue
$response.Headers.Location
# Ako vrati: https://uslugar.oriphiel.hr, redirect je aktivan
```

---

## 🎯 Najvjerojatniji Uzrok

**Browser Cache** - Stari redirect je spremljen u browser cache-u.

**Rješenje:**
1. **Hard Refresh:** `Ctrl + Shift + R`
2. **Clear Cache:** Settings → Clear browsing data
3. **Incognito Test:** Otvori u private prozoru

---

## 📋 Checklist

- [ ] **Browser cache** - Očišćen (hard refresh + clear cache)
- [ ] **Incognito test** - Proveden (radi u incognito?)
- [ ] **Hostinger Control Panel** - Provjeren za redirect
- [ ] **DNS postavke** - Provjerene
- [ ] **Developer Tools** - Provjeren Location header
- [ ] **HTTP Response** - Provjeren preko komandne linije

---

## 🔧 Ako Problem Persistira

Ako i dalje imaš problem nakon svih provjera:

1. **Kontaktiraj Hostinger podršku:**
   - Live Chat: Dostupan 24/7 u Control Panelu
   - Email: support@hostinger.com
   - Objašnjenje: "Stranica se i dalje preusmjerava na drugu domenu unatoč tome što .htaccess fajl ne sadrži redirect pravila"

2. **Provjeri sve .htaccess fajlove:**
   - `public_html/.htaccess` (root) - ne postoji ✅
   - `public_html/uslugar/.htaccess` - ispravan ✅
   - `public_html/uslugar/subdirectory/.htaccess` - provjeri ako postoji

3. **Provjeri Apache konfiguraciju:**
   - Možda postoji redirect u Apache virtual host konfiguraciji
   - Provjeri `httpd.conf` ili `.htaccess` u parent direktorijima

---

## ✅ Očekivani Rezultat

Nakon rješavanja:
- ✅ `https://uslugar.oriph.io` trebao bi raditi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Stranica se učitava na `uslugar.oriph.io`

