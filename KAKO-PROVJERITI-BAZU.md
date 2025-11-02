# ✅ Kako Provjeriti da Podaci Se Vade iz Baze

## 🔍 Metode Provjere:

### 1️⃣ Browser Developer Tools (Najlakše)

**Korak 1:** Otvori stranicu
```
https://uslugar.oriph.io/#documentation
```

**Korak 2:** Otvori Developer Tools
- **Chrome/Edge:** `F12` ili `Ctrl+Shift+I`
- **Firefox:** `F12` ili `Ctrl+Shift+I`

**Korak 3:** Network Tab
1. Klikni na **Network** tab
2. Refresh stranicu (`F5`)
3. Traži zahtjev: `/api/documentation`
4. Klikni na zahtjev

**Korak 4:** Provjeri Response
- Klikni na **Response** tab
- Trebao bi vidjeti JSON sa podacima
- Provjeri da li postoje podaci (features array, featureDescriptions object)

**Korak 5:** Provjeri Headers
- **Request URL:** `https://uslugar.api.oriph.io/api/documentation`
- **Status:** `200 OK`
- **Content-Type:** `application/json`

### 2️⃣ Browser Console (Direktan Test)

Otvori **Console** tab i pokreni:

```javascript
// Test API poziva
fetch('https://uslugar.api.oriph.io/api/documentation')
  .then(r => r.json())
  .then(data => {
    console.log('✅ API vraća:', data.features.length, 'kategorija');
    console.log('✅ Opisi:', Object.keys(data.featureDescriptions).length);
    console.log('✅ PODACI SE VUČU IZ BAZE!');
    console.log('📊 Prva kategorija:', data.features[0]);
  })
  .catch(err => {
    console.error('❌ Greška:', err);
  });
```

**Očekivano output:**
```
✅ API vraća: 50 kategorija
✅ Opisi: 238 opisa
✅ PODACI SE VUČU IZ BAZE!
📊 Prva kategorija: {category: "Registracija i Autentifikacija", items: [...]}
```

### 3️⃣ Direktan API Test (PowerShell/curl)

```powershell
# Test direktnog backend API-ja
$response = Invoke-RestMethod -Uri "https://uslugar.api.oriph.io/api/documentation"
Write-Host "Kategorija: $($response.features.Count)"
Write-Host "Opisi: $($response.featureDescriptions.Count)"
Write-Host "✅ Podaci se vade iz baze!"
```

**Očekivano:**
```
Kategorija: 50
Opisi: 238
✅ Podaci se vade iz baze!
```

### 4️⃣ Provjeri u Kodu (Izvorni Kod)

**Provjeri `Documentation.jsx`:**
```javascript
// Linija 14-34: useEffect poziva API
useEffect(() => {
  const loadDocumentation = async () => {
    const response = await api.get('/documentation'); // ← API poziv!
    setFeatures(response.data.features);
    setFeatureDescriptions(response.data.featureDescriptions);
  };
  loadDocumentation();
}, []);
```

**Ako vidiš ovo:**
- ✅ `api.get('/documentation')` → Podaci se vade iz baze
- ❌ `_hardcodedFeatures` → Hardkodirani podaci (STARA VERZIJA)

### 5️⃣ Provjeri Backend Route

**Provjeri da route vraća podatke iz baze:**
```javascript
// uslugar/backend/src/routes/documentation.js
r.get('/', async (req, res, next) => {
  try {
    categories = await prisma.documentationCategory.findMany({ // ← Prisma query!
      // ...
    });
    // Transformira podatke i vraća JSON
  }
});
```

**Ako route koristi `prisma.documentationCategory` → Podaci se vade iz baze! ✅**

### 6️⃣ Provjeri Database (Direktno)

**Ako imaš pristup bazi:**
```sql
-- Provjeri da tablice postoje
SELECT COUNT(*) FROM "DocumentationCategory";
SELECT COUNT(*) FROM "DocumentationFeature";

-- Provjeri podatke
SELECT name FROM "DocumentationCategory" LIMIT 5;
SELECT name, summary FROM "DocumentationFeature" LIMIT 5;
```

### 7️⃣ Promijeni Podatke u Bazi (Test)

**Ako možeš promijeniti podatke u bazi:**
1. Promijeni neki opis u bazi
2. Refresh frontend stranicu
3. Provjeri da li se nova vrijednost prikazuje

**Ako se prikaže nova vrijednost → Podaci se vade iz baze! ✅**

---

## ✅ Znakovi da Podaci Se Vade iz Baze:

1. ✅ **Network tab** pokazuje HTTP zahtjev na `/api/documentation`
2. ✅ **Response** sadrži JSON podatke (ne hardkodirane konstante)
3. ✅ **Promjene u bazi** se odražavaju na frontendu (nakon refresh-a)
4. ✅ **Kod** ne sadrži `_hardcodedFeatures` ili `fallbackFeatureDescriptions`
5. ✅ **Backend route** koristi `prisma.documentationCategory.findMany()`

---

## ❌ Znakovi da Podaci NISU iz Baze:

1. ❌ **Network tab** ne pokazuje API zahtjev
2. ❌ **Kod** sadrži `_hardcodedFeatures` array
3. ❌ **Promjene u bazi** se NE odražavaju na frontendu
4. ❌ **Error** u console: "Error loading documentation"

---

**Najbrži način:** Otvori Developer Tools → Network tab → Provjeri `/api/documentation` zahtjev! 🔍

