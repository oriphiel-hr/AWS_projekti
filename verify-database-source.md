# 🔍 Kako provjeriti da li se dokumentacija vuče iz baze

## 1. Provjera API endpointa direktno

### U browseru:
```
https://uslugar.oriph.io/api/documentation
```

**Očekivano:**
- JSON odgovor sa `features` i `featureDescriptions`
- Ako vidiš podatke → vuče se iz baze ✅
- Ako vidiš error ili prazan array → provjeri bazu ❌

### U terminalu:
```powershell
# PowerShell
Invoke-RestMethod -Uri "https://uslugar.oriph.io/api/documentation" | ConvertTo-Json -Depth 3

# ili curl
curl https://uslugar.oriph.io/api/documentation
```

## 2. Browser Dev Tools (najbolji način)

1. **Otvori stranicu:** https://uslugar.oriph.io/#documentation
2. **Otvori Dev Tools:** F12 ili Desni klik → Inspect
3. **Idi na Network tab**
4. **Refresh stranicu** (F5)
5. **Traži request:** `documentation`

**Provjeri:**
- Request URL: `https://uslugar.oriph.io/api/documentation`
- Status: `200 OK` ✅
- Response: Trebao bi biti JSON sa podacima iz baze

**Ako vidiš:**
- ✅ `200 OK` sa JSON podacima → Vuče se iz baze!
- ❌ `404 Not Found` → Backend route ne postoji
- ❌ `500 Internal Server Error` → Greška u backendu
- ❌ `200 OK` ali prazan `{}` → Nema podataka u bazi

## 3. Provjera da li postoje hardkodirani podaci

### U kodu:
```bash
# Provjeri da li postoje hardkodirani podatci u Documentation.jsx
grep -i "hardcoded\|fallbackFeatureDescriptions\|_hardcodedFeatures" uslugar/frontend/src/pages/Documentation.jsx
```

**Očekivano:**
- ❌ Nema rezultata → Hardkodirani podaci su uklonjeni ✅
- ✅ Ima rezultata → Još uvijek postoje hardkodirani podaci

## 4. Provjera da li komponenta koristi API

### U browseru Dev Tools → Console tab:

```javascript
// Provjeri da li se poziva API
fetch('/api/documentation')
  .then(r => r.json())
  .then(data => {
    console.log('API Response:', data);
    console.log('Broj kategorija:', data.features?.length || 0);
    console.log('Broj opisa:', Object.keys(data.featureDescriptions || {}).length);
  })
  .catch(err => console.error('API Error:', err));
```

## 5. Provjera direktno u bazi (ako imaš pristup)

```sql
-- Provjeri da li tablice postoje
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('DocumentationCategory', 'DocumentationFeature');

-- Provjeri broj zapisa
SELECT 
  (SELECT COUNT(*) FROM "DocumentationCategory") as categories,
  (SELECT COUNT(*) FROM "DocumentationFeature") as features;

-- Provjeri jedan zapis
SELECT * FROM "DocumentationCategory" LIMIT 1;
SELECT * FROM "DocumentationFeature" LIMIT 1;
```

## 6. Provjera kroz frontend kod

### Provjeri Documentation.jsx:

1. **Trebali bi vidjeti:**
```javascript
useEffect(() => {
  const loadDocumentation = async () => {
    const response = await api.get('/documentation');
    setFeatures(response.data.features);
    setFeatureDescriptions(response.data.featureDescriptions);
  };
  loadDocumentation();
}, []);
```

2. **NEMOJ vidjeti:**
```javascript
const hardcodedFeatures = [...]; // ❌
const fallbackFeatureDescriptions = {...}; // ❌
```

## 7. Najbrža provjera

**Otvori browser console na stranici:**
```
https://uslugar.oriph.io/#documentation
```

**U console upiši:**
```javascript
// Provjeri network request
fetch('/api/documentation').then(r => r.json()).then(d => {
  console.log('✅ API vraća podatke:', d.features.length, 'kategorija');
  console.log('✅ Opisi:', Object.keys(d.featureDescriptions).length);
}).catch(e => console.error('❌ Greška:', e));
```

## ✅ Konačni znakovi da se vuče iz baze:

1. ✅ Network tab pokazuje request na `/api/documentation`
2. ✅ API vraća JSON sa podacima
3. ✅ U kodu nema hardkodiranih podataka
4. ✅ Tablice postoje u bazi sa podacima
5. ✅ Promjene u bazi se reflektiraju na stranici

## ❌ Znakovi da se NE vuče iz baze:

1. ❌ Nema network requesta na `/api/documentation`
2. ❌ API vraća grešku ili prazan odgovor
3. ❌ U kodu postoje hardkodirani podaci
4. ❌ Promjene u bazi se NE reflektiraju na stranici

