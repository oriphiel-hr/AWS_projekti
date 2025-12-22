# 🔧 Clear Cache - Svi Browseri

## 🌐 Chrome / Edge (Chromium)

### Opcija 1: Application Tab (ako postoji)
1. **F12** → **Application** tab
2. **Service Workers** → **Unregister**
3. **Storage** → **Clear site data**

### Opcija 2: Settings (ako nema Application tab)
1. **Klikni** tri točkice (⋮) → **Settings**
2. **Privacy and security** → **Clear browsing data**
3. **Advanced** tab
4. **Time range:** "All time"
5. **Provjeri:**
   - ✅ Cached images and files
   - ✅ Cookies and other site data
   - ✅ Hosted app data
6. **Clear data**

### Opcija 3: Developer Tools (Console)
1. **F12** → **Console** tab
2. **Kopiraj i zalijepi:**
```javascript
// Unregister service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
  console.log('Service Workers unregistered');
});

// Clear cache storage
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
  console.log('Cache cleared');
});

// Clear localStorage
localStorage.clear();
sessionStorage.clear();
console.log('Storage cleared');
```
3. **Pritisni Enter**
4. **Hard Refresh:** `Ctrl + Shift + R`

---

## 🦊 Firefox

### Opcija 1: Storage Tab
1. **F12** → **Storage** tab
2. **Service Workers** → **Right-click** → **Unregister**
3. **Cache Storage** → **Right-click** → **Delete All**
4. **Local Storage** → **Right-click** → **Delete All**
5. **Cookies** → **Right-click** → **Delete All**

### Opcija 2: Settings
1. **Klikni** tri linije (☰) → **Settings**
2. **Privacy & Security** → **Cookies and Site Data**
3. **Clear Data** → **Clear**

### Opcija 3: Developer Tools (Console)
1. **F12** → **Console** tab
2. **Kopiraj i zalijepi:**
```javascript
// Unregister service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
  console.log('Service Workers unregistered');
});

// Clear cache storage
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
  console.log('Cache cleared');
});

// Clear localStorage
localStorage.clear();
sessionStorage.clear();
console.log('Storage cleared');
```
3. **Pritisni Enter**
4. **Hard Refresh:** `Ctrl + Shift + R`

---

## 🍎 Safari

### Opcija 1: Develop Menu (ako je omogućen)
1. **Safari** → **Preferences** → **Advanced**
2. **Provjeri** "Show Develop menu in menu bar"
3. **Develop** → **Empty Caches**
4. **Safari** → **Clear History** → **All History**

### Opcija 2: Settings
1. **Safari** → **Preferences**
2. **Privacy** tab
3. **Manage Website Data** → **Remove All**

---

## 🔧 Brzo Rješenje: Console Command (Svi Browseri)

**Otvori Console (F12) i zalijepi:**

```javascript
// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => {
    console.log('Unregistering:', reg.scope);
    reg.unregister();
  });
  console.log('✅ Service Workers unregistered');
});

// Clear all cache storage
caches.keys().then(keys => {
  keys.forEach(key => {
    console.log('Deleting cache:', key);
    caches.delete(key);
  });
  console.log('✅ Cache cleared');
});

// Clear localStorage and sessionStorage
localStorage.clear();
sessionStorage.clear();
console.log('✅ Storage cleared');

// Reload page
setTimeout(() => {
  location.reload(true);
}, 1000);
```

**Nakon što zalijepiš, pritisni Enter i čekaj 1 sekundu - stranica će se automatski reloadati.**

---

## 🎯 Alternativno: Incognito Mode

**Ako ništa ne radi, testiraj u Incognito/Private prozoru:**

1. **Chrome/Edge:** `Ctrl + Shift + N`
2. **Firefox:** `Ctrl + Shift + P`
3. **Safari:** `Cmd + Shift + N`
4. **Otvori** `https://uslugar.oriph.io`

**Ako radi u Incognito, problem je definitivno u cache-u!**

---

## 📋 Checklist

- [ ] **Console command izvršen** - Service Workers unregistered
- [ ] **Cache cleared** - Cache storage cleared
- [ ] **Storage cleared** - localStorage/sessionStorage cleared
- [ ] **Hard Refresh** - Ctrl + Shift + R
- [ ] **Test u normalnom prozoru** - Radi bez redirecta
- [ ] **Test u Incognito** - Radi bez redirecta

---

## ✅ Očekivani Rezultat

Nakon čišćenja cache-a:
- ✅ `https://uslugar.oriph.io` radi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Console pokazuje "Service Workers unregistered" i "Cache cleared"

