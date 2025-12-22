# 🔧 Rješavanje 404 Greške na API

## ❌ Problem

```
Failed to load resource: the server responded with a status of 404
https://uslugar.api.oriph.io/
```

---

## ✅ Provjera

### Backend API Status:
- ✅ `https://uslugar.api.oriph.io/api/health` → **Status 200** (radi)
- ❌ `https://uslugar.api.oriph.io/` → **Status 404** (normalno - nema root endpoint)

**Backend API radi ispravno!**

---

## 🔍 Uzrok Problema

Frontend možda pokušava pristupiti root URL-u (`https://uslugar.api.oriph.io/`) umjesto API endpointa (`https://uslugar.api.oriph.io/api/`).

**Mogući uzroci:**
1. **Stari build fajlovi na serveru** - imaju staru API konfiguraciju
2. **Nedostaje `/api` u URL-u** - frontend ne dodaje `/api` automatski
3. **Pogrešna `VITE_API_URL` vrijednost** u build procesu

---

## ✅ Rješenje

### 1. Rebuild Frontend s Ispravnom Konfiguracijom

**Build s ispravnom API URL:**
```powershell
cd uslugar/frontend
$env:VITE_API_URL = "https://uslugar.api.oriph.io"
npm run build
```

**Ili:**
```powershell
cd uslugar/frontend
VITE_API_URL=https://uslugar.api.oriph.io npm run build
```

### 2. Provjeri API Konfiguraciju u Kodu

**`src/api.js`** automatski dodaje `/api`:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'https://uslugar.api.oriph.io';
// Automatski postaje: https://uslugar.api.oriph.io/api
```

**Ako `VITE_API_URL` nije postavljen u build procesu:**
- Default vrijednost je: `https://uslugar.api.oriph.io`
- Automatski se dodaje `/api` → `https://uslugar.api.oriph.io/api`

### 3. Upload Novi Build na Server

**Preko FileZilla:**
1. Upload sve iz `dist/` direktorija
2. Overwrite postojeće fajlove
3. Provjeri da li API pozivi sada rade

---

## 🔍 Provjera u Browseru

### Developer Tools:
1. **F12** → **Network** tab
2. **Posjeti** `https://uslugar.oriph.io`
3. **Provjeri** API pozive:
   - Trebaju ići na: `https://uslugar.api.oriph.io/api/...`
   - NE na: `https://uslugar.api.oriph.io/...` (bez `/api`)

### Console:
```javascript
// Provjeri API URL u build fajlu
console.log(import.meta.env.VITE_API_URL)
// Trebao bi biti: https://uslugar.api.oriph.io
```

---

## 📋 Checklist

- [ ] **Backend API radi** (`/api/health` → Status 200)
- [ ] **Frontend rebuildan** s ispravnom `VITE_API_URL`
- [ ] **Build provjeren** (sadrži ispravan API URL)
- [ ] **Novi build uploadan** na server
- [ ] **Browser cache očišćen** (Ctrl + Shift + R)
- [ ] **API pozivi rade** (Network tab)

---

## 🎯 Očekivani Rezultat

Nakon rješavanja:
- ✅ API pozivi idu na: `https://uslugar.api.oriph.io/api/...`
- ✅ Nema 404 grešaka
- ✅ Frontend uspješno komunicira s backendom

---

## 🔧 Ako Problem Persistira

### Provjeri CORS:
- Backend mora dozvoljavati `https://uslugar.oriph.io` origin
- Provjeri `CORS_ORIGINS` u backend konfiguraciji

### Provjeri Network Tab:
- Koji točno URL frontend pokušava pristupiti?
- Da li ima `/api` u URL-u?
- Koji je status code (404, 500, CORS error)?

