# 🔍 Analiza API Poziva

## ⚠️ Problem:

Frontend `api.js` koristi **direktni backend URL** umjesto relativnog path-a!

```javascript
// api.js linija 8
const API_BASE = import.meta.env.VITE_API_URL || 'https://uslugar.api.oriph.io';
//                                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                                                   DIREKTNO na backend API!
```

## 📊 Kako frontend poziva API:

### Frontend kod:
```javascript
// Documentation.jsx linija 18
const response = await api.get('/documentation');
//                             ^^^^^^^^^^^^^^^^^
//                             Relativan path
```

### Stvarni HTTP zahtjev:
```javascript
// api.js dodaje baseURL
baseURL = 'https://uslugar.api.oriph.io/api'
//         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//         DIREKTNO na AWS backend!

// Konačni URL:
https://uslugar.api.oriph.io/api/documentation ✅ RADI
```

## ✅ ZAKLJUČAK:

**Frontend NE koristi Nginx proxy na Hostingeru!**

Svi API pozivi idu **direktno** na `uslugar.api.oriph.io`, ne kroz `uslugar.oriph.io/api/`.

Zato:
- ✅ `https://uslugar.api.oriph.io/api/documentation` → RADI (direktno backend)
- ❌ `https://uslugar.oriph.io/api/documentation` → 404 (Nginx proxy nije koristi)

## 🎯 Rješenje:

**Ne treba mijenjati Nginx konfiguraciju!**

Frontend već koristi direktni backend URL. Problem je što možda Nginx proxy postojeći endpointi (npr. `/api/categories`, `/api/jobs`) možda rade kroz cache ili staru konfiguraciju.

Ali `Documentation.jsx` poziva direktno backend API, tako da bi trebao raditi!

## 🔍 Provjeri u browseru:

Otvori Developer Tools → Network tab → Idi na `#documentation` stranicu.

Provjeri:
1. Koji URL se poziva za `/documentation`?
2. Da li je `https://uslugar.api.oriph.io/api/documentation`?
3. Da li vraća 200 OK ili neki error?

---

**Zaključak:** Frontend NE mora koristiti Nginx proxy - već koristi direktni backend API URL!

