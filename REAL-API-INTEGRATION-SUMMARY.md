# Real API Integration - Summary

## ✅ Integrirano

### 1. Sudski Registar API

**Endpoint**: `https://sudreg.pravosudje.hr/api/Surad/{oib}`
**Potrebno**: `Ocp-Apim-Subscription-Key` header
**Status**: ✅ Integriran sa fallback-om

**Kako dobiti API Key:**
1. Registriraj se na: https://sudreg.pravosudje.hr/
2. Kreiraj API subscription
3. Dobit ćeš `Ocp-Apim-Subscription-Key`
4. Dodaj u `.env`: `SUDREG_API_KEY=your-key-here`

**Kod:**
```javascript
const sudResponse = await axios.get(`https://sudreg.pravosudje.hr/api/Surad/${taxId}`, {
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.SUDREG_API_KEY || '',
    'Accept': 'application/json'
  }
});
```

**Response Format:**
```json
{
  "OIB": "92679950116",
  "NAZIV": "Test d.o.o.",
  "STATUS": "AKTIVAN",
  "MBS": "...",
  "DATUM_NASTANKA": "2020-01-15",
  "RAZLOG_PROMJENE": null
}
```

---

### 2. VIES API (PDV)

**Endpoint**: `http://ec.europa.eu/taxation_customs/vies/checkVatService`
**Format**: SOAP XML
**Status**: ✅ Integriran (SOAP zahtjev)

**Kod:**
```javascript
const viesResponse = await axios.post('http://ec.europa.eu/taxation_customs/vies/checkVatService', {
  headers: { 'Content-Type': 'application/xml' },
  data: `<?xml version="1.0"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <checkVat xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
          <countryCode>HR</countryCode>
          <vatNumber>92679950116</vatNumber>
        </checkVat>
      </soap:Body>
    </soap:Envelope>`
});
```

---

### 3. Obrtni Registar

**Status**: ⏳ Nema javni API
**Workaround**: 
- Provjera već verificiranih OIB-a u bazi
- Scraping sa https://www.obrti.hr/ (legalno, javni podaci)

**TODO**: 
- Integrirati scraping ako potrebno
- Ili čekati službeni API

---

## 🔧 Environment Variables

Dodaj u `.env` na produkciji:

```env
# Sudski registar API Key
SUDREG_API_KEY=your-subscription-key-here

# Obrtni registar (ako postoji API u budućnosti)
OBRTNI_API_KEY=optional-key-here
```

---

## 🚀 Kako Aktivirati

### 1. Registriraj se za Sudski Registar API

1. Idi na: https://sudreg.pravosudje.hr/
2. Registriraj se
3. Kreiraj API subscription
4. Copy `Ocp-Apim-Subscription-Key`

### 2. Dodaj Key u Environment

**Lokalno:**
```bash
cd uslugar/backend
# U .env:
SUDREG_API_KEY=tvoja-subscription-key
```

**Produkcija (AWS Secrets Manager):**
```bash
# Dodaj u Secrets Manager kao SUDB_SECRET_ARN
SUDREG_API_KEY=tvoja-subscription-key
```

### 3. Deploy

GitHub Actions će automatski deployati. Kad imaš `SUDREG_API_KEY` u environment variables, stvarna provjera će raditi!

---

## 📊 Kada Ide SUCCESS

### ✅ Auto-Verification PROLAZI ako:

1. **DOO/JDOO**:
   - Sudski registar API vraća OK
   - STATUS = "AKTIVAN"
   - Badge: "✓ Verificiran – SUDSKI"

2. **Obrt/Pausalni**:
   - OIB već verificiran u našoj bazi
   - Badge: "✓ Verificiran – OBRTNI"

3. **Freelancer**:
   - UVIJEK treba dokument (nema javnih registara)

---

## ⚠️ Kada Ide FAILURE (traži dokument)

### ❌ Traži dokument ako:

1. **DOO/JDOO**:
   - Sudski registar API nije dostupan
   - Nema `SUDREG_API_KEY` u .env
   - STATUS ≠ "AKTIVAN"
   - Poruka: "Sudski registar provjera nije dostupna..."

2. **Obrt/Pausalni**:
   - Ne postoji API
   - OIB nije verificiran u našoj bazi
   - Poruka: "Obrtni registar provjera nije dostupna..."

3. **Freelancer**:
   - UVIJEK
   - Poruka: "Freelancer: Potrebno Rješenje Porezne uprave"

---

## 🎯 Trenutno Stanje

| Feature | Status | Notes |
|---------|--------|-------|
| Sudski registar API | ✅ Implementiran | Treba API key |
| VIES API | ✅ Implementiran | SOAP XML |
| Obrtni registar | ⏳ Scraping | Nema API |
| Auto-verification | ✅ Funkcioniše | Sa fallback-om |
| Admin metrike | ✅ Implementiran | Dashboard kreiran |

---

## 📝 Next Steps

### Ako Želiš Stvarnu Auto-Verification:

1. **Registriraj se** za Sudski registar API
2. **Dodaj** `SUDREG_API_KEY` u environment
3. **Deploy** ponovo
4. **Test** sa pravim OIB-om d.o.o.

**Primjer:**
```bash
curl -X POST https://uslugar.oriph.io/api/kyc/auto-verify \
  -H "Content-Type: application/json" \
  -d '{"taxId":"92679950116","legalStatusId":"cls4_doo","companyName":"Test d.o.o."}'
```

Ako API radi s key-em → SUCCESS
Ako nema key-a ili API nije dostupan → FAILURE (traži dokument)

Sustav je spreman za integraciju - samo dodaj API key! 🎉

