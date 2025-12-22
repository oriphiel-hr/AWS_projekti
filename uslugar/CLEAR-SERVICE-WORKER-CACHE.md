# 🔧 Clear Service Worker Cache - Rješavanje Redirect Problema

## 🔍 Problem

Ako se redirect i dalje dešava iako:
- ✅ DNS je ispravno postavljen
- ✅ HTTP headers ne sadrže redirect
- ✅ HTML ne sadrži `oriphiel.hr`
- ✅ Novi build je uploadan

**Uzrok je vjerojatno Service Worker cache!**

---

## 🔧 Rješenje: Clear Service Worker Cache

### Korak 1: Otvori Browser DevTools

1. **Otvori** `https://uslugar.oriph.io` u browseru
2. **F12** → Otvori Developer Tools
3. **Application** tab (Chrome/Edge) ili **Storage** tab (Firefox)

### Korak 2: Unregister Service Worker

**Chrome/Edge:**
1. **Application** tab → **Service Workers** (lijevo)
2. **Pronađi** service worker za `uslugar.oriph.io`
3. **Klikni** "Unregister"
4. **Potvrdi** ako pita

**Firefox:**
1. **Storage** tab → **Service Workers**
2. **Pronađi** service worker
3. **Klikni** "Unregister"

### Korak 3: Clear Site Data

**Chrome/Edge:**
1. **Application** tab → **Storage** (lijevo)
2. **Klikni** "Clear site data" (gore desno)
3. **Provjeri** sve checkboxe:
   - ✅ Cookies
   - ✅ Cache storage
   - ✅ Local storage
   - ✅ Session storage
   - ✅ Service workers
4. **Klikni** "Clear site data"

**Firefox:**
1. **Storage** tab → **Cookies**
2. **Right-click** → **Delete All**
3. **Storage** tab → **Cache Storage**
4. **Right-click** → **Delete All**
5. **Storage** tab → **Local Storage**
6. **Right-click** → **Delete All**

### Korak 4: Hard Refresh

1. **Zatvori** Developer Tools
2. **Hard Refresh:** `Ctrl + Shift + R` (Windows) ili `Cmd + Shift + R` (Mac)
3. **Ili:** `Ctrl + F5`

### Korak 5: Test

1. **Otvori** `https://uslugar.oriph.io`
2. **Provjeri** da li se učitava normalno
3. **Provjeri** da li NEMA redirecta na `uslugar.oriphiel.hr`

---

## 🔍 Alternativno: Incognito Mode

**Ako ne možeš obrisati cache:**

1. **Otvori** Incognito/Private prozor
2. **Otvori** `https://uslugar.oriph.io`
3. **Provjeri** da li radi bez redirecta

**Ako radi u Incognito, problem je u cache-u!**

---

## 📋 Checklist

- [ ] **Service Worker unregistered** - Provjeren u DevTools
- [ ] **Site data cleared** - Cookies, Cache, Local Storage
- [ ] **Hard Refresh** - Ctrl + Shift + R
- [ ] **Test u normalnom prozoru** - Radi bez redirecta
- [ ] **Test u Incognito** - Radi bez redirecta

---

## 🎯 Očekivani Rezultat

Nakon čišćenja cache-a:
- ✅ `https://uslugar.oriph.io` radi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Service Worker je unregistered
- ✅ Cache je očišćen

---

## 🔍 Debugging

### Provjeri Service Worker Status:

**Browser Console (F12 → Console):**
```javascript
// Provjeri da li postoji service worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations.length);
  registrations.forEach(reg => {
    console.log('SW:', reg.scope);
    reg.unregister(); // Unregister
  });
});
```

### Provjeri Cache Storage:

**Browser Console:**
```javascript
// Provjeri cache storage
caches.keys().then(keys => {
  console.log('Cache keys:', keys);
  keys.forEach(key => {
    caches.delete(key); // Delete cache
  });
});
```

---

## ✅ Ako Problem Persistira

**Ako i dalje vidiš redirect nakon čišćenja cache-a:**

1. **Provjeri** da li je novi build uploadan na server
2. **Provjeri** da li HTML na serveru sadrži `oriphiel.hr`
3. **Provjeri** Hostinger Control Panel → Redirects
4. **Kontaktiraj** Hostinger Support

