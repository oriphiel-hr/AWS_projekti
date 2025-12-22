# 🔍 Provjera Fajlova na Serveru

## ✅ Situacija

- ✅ InPrivate prozor ne radi redirect → Problem NIJE u browser cache-u
- ✅ `.htaccess` fajl je ispravan (bez redirect pravila)
- ✅ Kod je provjeren i ispravljen

**Problem je vjerojatno u fajlovima na serveru!**

---

## 🔍 Što Provjeriti na Serveru

### 1. Frontend Build Fajlovi (NAJVAŽNIJE)

**Problem:** Stari build fajlovi na serveru možda imaju redirect logiku.

**Provjera:**
1. **FTP/File Manager:**
   - Navigiraj do `public_html/uslugar/` (ili `public_html/`)
   - Provjeri `index.html` fajl
   - Provjeri JavaScript fajlove u `assets/` direktoriju

2. **Provjeri index.html:**
   - Otvori `index.html` na serveru
   - Traži: `oriphiel.hr`, `window.location`, `meta refresh`
   - Ako nađeš, to je problem!

3. **Provjeri JavaScript fajlove:**
   - Otvori JavaScript fajlove u `assets/` direktoriju
   - Traži: `oriphiel.hr`, `window.location.href`, `redirect`
   - Ako nađeš, to je problem!

**Rješenje:**
- **Rebuild frontend:**
  ```powershell
  cd uslugar/frontend
  npm run build
  ```
- **Upload novi build na server:**
  - Upload sve iz `dist/` direktorija
  - Overwrite postojeće fajlove

### 2. Hostinger Control Panel Redirect

**Problem:** Redirect je postavljen u Hostinger Control Panelu.

**Provjera:**
1. **Hostinger Control Panel** → **Websites** → **Redirects**
2. **Pronađi** redirect za `uslugar.oriph.io`
3. **Obriši** ili **deaktiviraj** ako postoji

**Alternativno:**
- **Websites** → **Manage** → **Redirects**
- Provjeri da li postoji redirect postavljen

### 3. Drugi .htaccess Fajl

**Problem:** Postoji još jedan `.htaccess` fajl koji ima redirect pravila.

**Provjera:**
1. **FTP/File Manager:**
   - Provjeri sve `.htaccess` fajlove:
     - `public_html/.htaccess` (root) ✅ Ne postoji
     - `public_html/uslugar/.htaccess` ✅ Ispravan
     - `public_html/uslugar/subdirectory/.htaccess` (ako postoji)

2. **Ako nađeš drugi .htaccess:**
   - Provjeri sadržaj
   - Ukloni redirect pravila

### 4. index.html na Serveru

**Problem:** `index.html` na serveru možda ima redirect logiku.

**Provjera:**
1. **Download** `index.html` sa servera
2. **Provjeri** da li sadrži:
   - `<meta http-equiv="refresh" content="0; url=https://uslugar.oriphiel.hr">`
   - JavaScript redirect: `window.location.href = 'https://uslugar.oriphiel.hr'`
   - Drugi redirect kod

3. **Ako nađeš redirect:**
   - Rebuild frontend
   - Upload novi `index.html`

---

## ✅ Koraci za Rješavanje

### Korak 1: Provjeri index.html na Serveru

**Preko FTP:**
1. Spoji se na FTP
2. Download `index.html` iz `public_html/uslugar/` (ili `public_html/`)
3. Otvori u text editoru
4. Provjeri da li sadrži `oriphiel.hr` ili redirect kod

**Preko File Manager:**
1. Hostinger Control Panel → File Manager
2. Otvori `index.html`
3. Provjeri sadržaj

### Korak 2: Provjeri JavaScript Fajlove

**Preko FTP:**
1. Navigiraj do `assets/` direktorija
2. Download JavaScript fajlove
3. Provjeri da li sadrže `oriphiel.hr`

**Brza provjera:**
- Otvori Developer Tools (F12)
- Sources tab
- Provjeri JavaScript fajlove
- Traži `oriphiel.hr`

### Korak 3: Rebuild i Upload Frontend

**Ako nađeš problem u fajlovima:**

1. **Rebuild frontend:**
   ```powershell
   cd uslugar/frontend
   npm run build
   ```

2. **Upload novi build:**
   - Upload sve iz `dist/` direktorija
   - Overwrite postojeće fajlove na serveru

### Korak 4: Provjeri Hostinger Control Panel

1. **Hostinger Control Panel** → **Websites** → **Redirects**
2. **Provjeri** da li postoji redirect za `uslugar.oriph.io`
3. **Obriši** ako postoji

---

## 🔍 Developer Tools Provjera

### Provjeri JavaScript Fajlove u Browseru:

1. **Developer Tools (F12)** → **Sources** tab
2. **Pronađi** JavaScript fajlove (obično u `assets/` folderu)
3. **Search** (Ctrl+F) → Traži: `oriphiel.hr`
4. **Ako nađeš**, to je problem!

### Provjeri Network Request:

1. **Developer Tools (F12)** → **Network** tab
2. **Posjeti** `https://uslugar.oriph.io`
3. **Klikni** na `index.html` request
4. **Response** tab → Provjeri da li sadrži `oriphiel.hr`

---

## 🎯 Najvjerojatniji Uzrok

**Stari frontend build fajlovi na serveru** - JavaScript fajlovi možda imaju redirect logiku.

**Rješenje:**
1. **Rebuild frontend:**
   ```powershell
   cd uslugar/frontend
   npm run build
   ```

2. **Upload novi build na server:**
   - Upload sve iz `dist/` direktorija
   - Overwrite postojeće fajlove

---

## 📋 Checklist

- [ ] **index.html na serveru** - Provjeren (sadrži redirect?)
- [ ] **JavaScript fajlovi na serveru** - Provjereni (sadrže redirect?)
- [ ] **Hostinger Control Panel** - Provjeren za redirect
- [ ] **Frontend rebuild** - Napravljen (ako je potrebno)
- [ ] **Novi build uploadan** - Uploadan na server
- [ ] **Test u InPrivate** - Proveden (radi?)

---

## ✅ Očekivani Rezultat

Nakon rješavanja:
- ✅ `https://uslugar.oriph.io` trebao bi raditi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Stranica se učitava na `uslugar.oriph.io`
- ✅ Radi i u InPrivate prozoru

