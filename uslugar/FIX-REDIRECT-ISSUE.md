# 🔧 Rješavanje Problema s Redirectom

## ❌ Problem

Iako je lokalni `.htaccess` fajl ažuriran (bez redirect pravila), browser i dalje preusmjerava na `uslugar.oriphiel.hr`.

---

## 🔍 Mogući Uzroci

### 1. .htaccess fajl na serveru još uvijek ima redirect pravila

**Problem:** Lokalni fajl je ažuriran, ali na serveru je još uvijek stara verzija.

**Rješenje:**
1. **Upload novi .htaccess fajl na server:**
   - Spoji se na FTP (Account 1 - uslugar.oriph.io)
   - Navigiraj do `public_html/`
   - Upload `uslugar/.htaccess` fajl
   - Overwrite postojeći fajl

2. **Provjeri da li je fajl uploadan:**
   - Preko FTP provjeri sadržaj `.htaccess` fajla na serveru
   - Trebao bi sadržavati samo HTTPS redirect, bez redirecta na novu domenu

### 2. Browser Cache

**Problem:** Browser je spremio stari redirect u cache-u.

**Rješenje:**
1. **Hard Refresh:**
   - Windows: `Ctrl + Shift + R` ili `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Clear Browser Cache:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data
   - Edge: Settings → Privacy → Clear browsing data

3. **Incognito/Private Mode:**
   - Otvori stranicu u incognito/private prozoru
   - Ako radi u incognito, problem je u cache-u

### 3. Drugi .htaccess fajl

**Problem:** Postoji još jedan `.htaccess` fajl koji ima redirect pravila.

**Lokacije:**
- `public_html/.htaccess` (glavni)
- `public_html/subdirectory/.htaccess` (ako postoji)
- `frontend/public/.htaccess` (možda se deploya)

**Rješenje:**
1. Provjeri sve `.htaccess` fajlove na serveru
2. Ukloni redirect pravila iz svih fajlova

### 4. Hostinger Control Panel Redirect

**Problem:** Redirect je postavljen u Hostinger Control Panelu (ne u .htaccess).

**Rješenje:**
1. **Hostinger Control Panel** → **Websites** → **Redirects**
2. **Pronađi** redirect za `uslugar.oriph.io`
3. **Obriši** ili **deaktiviraj** redirect

### 5. DNS CNAME ili Redirect na razini DNS-a

**Problem:** DNS provider ima redirect postavljen.

**Rješenje:**
1. Provjeri DNS postavke u Hostinger Control Panelu
2. Provjeri da li postoji CNAME koji redirecta
3. Provjeri da li postoji URL redirect u DNS postavkama

---

## ✅ Koraci za Rješavanje

### Korak 1: Provjeri .htaccess na serveru

1. **Spoji se na FTP** (Account 1)
2. **Download** `.htaccess` fajl iz `public_html/`
3. **Provjeri** da li sadrži redirect pravila
4. Ako da, **upload** novi fajl (bez redirect pravila)

### Korak 2: Clear Browser Cache

1. **Hard Refresh:** `Ctrl + Shift + R`
2. **Clear Cache:** Settings → Clear browsing data
3. **Test u Incognito:** Otvori u private prozoru

### Korak 3: Provjeri Hostinger Control Panel

1. **Login** u Hostinger Control Panel (Account 1)
2. **Websites** → **Redirects**
3. **Provjeri** da li postoji redirect za `uslugar.oriph.io`
4. **Obriši** ako postoji

### Korak 4: Provjeri DNS Postavke

1. **DNS Zone Editor** → `oriph.io` domena
2. **Provjeri** da li postoji CNAME ili URL redirect
3. **Ukloni** ako postoji

---

## 🔍 Provjera

### Test 1: Provjeri .htaccess na serveru

**Preko FTP:**
1. Spoji se na FTP
2. Download `.htaccess` iz `public_html/`
3. Provjeri sadržaj - trebao bi biti samo HTTPS redirect

**Preko SSH (ako imaš pristup):**
```bash
cat public_html/.htaccess
```

### Test 2: Provjeri Redirect u Browseru

**Developer Tools:**
1. Otvori Developer Tools (F12)
2. Network tab
3. Posjeti `https://uslugar.oriph.io`
4. Provjeri Response Headers - traži `Location` header
5. Ako vidiš `Location: https://uslugar.oriphiel.hr`, redirect je aktivan

**Komandna linija:**
```powershell
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -MaximumRedirection 0 -ErrorAction SilentlyContinue
$response.Headers.Location
# Ako vrati: https://uslugar.oriphiel.hr, redirect je aktivan
```

### Test 3: Provjeri u Incognito

1. Otvori Incognito/Private prozor
2. Posjeti `https://uslugar.oriph.io`
3. Ako i dalje redirecta, problem nije u cache-u

---

## 📋 Checklist

- [ ] **.htaccess na serveru** - Provjeren i ažuriran
- [ ] **Browser cache** - Očišćen
- [ ] **Hostinger Control Panel** - Provjeren za redirect
- [ ] **DNS postavke** - Provjerene
- [ ] **Test u Incognito** - Proveden
- [ ] **Developer Tools** - Provjeren Location header

---

## 🎯 Najvjerojatniji Uzrok

**Problem:** `.htaccess` fajl na serveru još uvijek ima redirect pravila.

**Rješenje:**
1. Upload novi `.htaccess` fajl na server (Account 1)
2. Overwrite postojeći fajl
3. Clear browser cache
4. Test u incognito prozoru

---

## 📞 Ako Problem Persistira

Ako i dalje imaš problem:
1. **Provjeri** sve `.htaccess` fajlove na serveru
2. **Provjeri** Hostinger Control Panel za redirect
3. **Kontaktiraj** Hostinger podršku
4. **Provjeri** DNS postavke u domain provideru

---

## ✅ Očekivani Rezultat

Nakon rješavanja:
- ✅ `https://uslugar.oriph.io` trebao bi raditi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Stranica se učitava na `uslugar.oriph.io`

