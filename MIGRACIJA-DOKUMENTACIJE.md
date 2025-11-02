# 📚 Migracija Dokumentacije u Bazu Podataka

## Pregled

Dokumentacija je sada prebačena iz hardkodiranih podataka u bazu podataka. Svi podaci se učitavaju dinamički preko API-ja.

## ✅ Što je napravljeno:

1. **Dodani Prisma modeli:**
   - `DocumentationCategory` - kategorije funkcionalnosti
   - `DocumentationFeature` - pojedinačne funkcionalnosti s opisima

2. **Kreiran backend route:**
   - `GET /api/documentation` - dohvaća sve kategorije i feature opise
   - `GET /api/documentation/stats` - statistike implementacije
   - `POST /api/documentation/migrate` - migracija postojećih podataka

3. **Refaktoriran frontend:**
   - `Documentation.jsx` sada učitava podatke iz API-ja
   - Dodano loading i error handling
   - Fallback na hardkodirane podatke ako API ne radi

## 🚀 Koraci za migraciju:

### 1. Primijeni Prisma migraciju

```bash
cd uslugar/backend
npx prisma migrate dev --name add_documentation_models
```

Ili ako koristiš produkcijsku bazu:

```bash
npx prisma migrate deploy
```

### 2. Generiraj Prisma Client

```bash
npx prisma generate
```

### 3. Ekstraktiraj podatke iz Documentation.jsx i generiraj seed fajl

```bash
npm run extract:documentation
```

Ova skripta će automatski ekstraktirati `_hardcodedFeatures` i `fallbackFeatureDescriptions` iz `Documentation.jsx` i generirati kompletan seed fajl u `prisma/seeds/seed-documentation.js`.

### 4. Pokreni seed dokumentacije

```bash
npm run seed:documentation
```

Ovo će migrirati sve kategorije, feature opise i descriptions u bazu podataka.

### 5. Testiraj

Nakon migracije, provjeri:
- Otvori `/documentation` stranicu
- Podaci bi se trebali učitati iz baze
- Provjeri da li svi opisi postoje
- Provjeri da li su sve kategorije prisutne

### Alternativno: Ručno kroz API endpoint

Ako želiš koristiti API endpoint umjesto seed skripte:

```javascript
// migrate-docs.js
import api from './api.js';

// Učitaj features i featureDescriptions iz Documentation.jsx
const features = [/* kopiraj iz _hardcodedFeatures */];
const featureDescriptions = {/* kopiraj iz fallbackFeatureDescriptions */};

api.post('/documentation/migrate', {
  features,
  featureDescriptions
}).then(response => {
  console.log('✅ Migracija uspješna:', response.data);
}).catch(error => {
  console.error('❌ Greška:', error);
});
```

## 📝 Napomene:

- Hardkodirani podaci (`_hardcodedFeatures` i `fallbackFeatureDescriptions`) mogu se obrisati nakon uspješne migracije
- Ako API ne radi, frontend će koristiti fallback podatke
- Podaci se mogu ažurirati direktno u bazi ili kroz admin panel

## 🔧 Ažuriranje dokumentacije:

Nakon migracije, dokumentaciju možeš ažurirati:
- Direktno u bazi podataka
- Kroz admin API endpoint (treba dodati)
- Ili ručno ažuriranjem baze

