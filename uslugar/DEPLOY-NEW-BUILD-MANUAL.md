# 🚀 Upload Novog Frontend Builda - Ručni Vodič

## ✅ Build Status

- ✅ **Frontend build završen**
- ✅ **Lokacija:** `uslugar/frontend/dist/`
- ✅ **Provjeren:** Nema `oriphiel.hr` u build fajlovima
- ⚠️ **FTP upload ne radi** (autentifikacija problem)

---

## 📋 Ručni Upload - FileZilla

### Korak 1: Otvori FileZilla

1. **Otvori FileZilla**
2. **Connect:**
   - **Host:** `194.5.156.10`
   - **Username:** `u208993221`
   - **Password:** `G73S3ebakh6O!`
   - **Port:** `21`

### Korak 2: Navigiraj do Direktorija

**Desna strana (Remote site):**
- Navigiraj do: `public_html/uslugar/`
- (Ili `public_html/` ako je root)

**Lijeva strana (Local site):**
- Navigiraj do: `C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend\dist\`

### Korak 3: Upload Fajlova

**Fajlovi za upload (iz `dist/` direktorija):**
```
dist/
├── index.html          ✅ Upload
├── uslugar.ico         ✅ Upload
├── sw.js               ✅ Upload
├── .htaccess           ✅ Upload (ako postoji)
└── assets/             ✅ Upload CIJELI direktorij
    ├── index-BoZZd6o1.css
    ├── index-Dkb1Bl1j.js
    ├── css/
    │   └── style.css
    └── js/
        └── crud.js
```

**Upload:**
1. **Selektuj SVE fajlove** iz `dist/` direktorija
2. **Drag & drop** u `public_html/uslugar/` (desna strana)
3. **Overwrite** kada pita (sve postojeće fajlove)

---

## ✅ Nakon Uploada

1. **Clear browser cache:**
   - Hard Refresh: `Ctrl + Shift + R`
   - Ili Clear browsing data

2. **Test:**
   - Otvori: `https://uslugar.oriph.io`
   - Provjeri da li se učitava normalno
   - Provjeri da li NEMA redirecta na `uslugar.oriphiel.hr`

3. **Test u Incognito:**
   - Otvori u private prozoru
   - Provjeri da li radi bez redirecta

---

## 🔍 Provjera

### Developer Tools:
1. **F12** → **Sources** tab
2. **Pronađi** JavaScript fajlove
3. **Search** (Ctrl+F) → Traži: `oriphiel.hr`
4. **Ako ne nađeš**, build je ispravan!

### Network Tab:
1. **F12** → **Network** tab
2. **Posjeti** `https://uslugar.oriph.io`
3. **Provjeri** Response Headers
4. **Nema Location header** = nema redirecta

---

## 📁 Lokacija Build Fajlova

**Lokalno:**
```
C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend\dist\
```

**Na serveru (nakon uploada):**
```
public_html/uslugar/
```

---

## ✅ Checklist

- [ ] **Build završen** (`npm run build`)
- [ ] **Build provjeren** (nema `oriphiel.hr`)
- [ ] **Fajlovi uploadani** na server
- [ ] **Overwrite** postojeće fajlove
- [ ] **Clear browser cache**
- [ ] **Test u browseru** (`https://uslugar.oriph.io`)
- [ ] **Test u Incognito** (nema redirecta)

---

## 🎯 Očekivani Rezultat

Nakon uploada:
- ✅ `https://uslugar.oriph.io` radi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Stranica se učitava na `uslugar.oriph.io`
- ✅ Radi i u Incognito prozoru

