# ⚖️ Pravni Status - Validacija za Pružatelje Usluga

## 📋 Zahtjev

**Pružatelj usluga NE MOŽE biti privatna osoba po zakonu!**

Svaki pružatelj mora imati:
- ✅ Pravni oblik (obrt, d.o.o., j.d.o.o., itd.)
- ✅ OIB (porezni identifikacijski broj)
- ✅ Naziv firme/obrta

---

## ✅ Što je Implementirano

### 1. **Seed Data - Hrvatski Pravni Oblici**

**Fajl:** `backend/prisma/seed.js`

Dodano 8 pravnih oblika:
- `OBRT` - Obrt
- `DOO` - d.o.o. (Društvo s ograničenom odgovornošću)
- `JDOO` - j.d.o.o. (Jednostavno društvo s ograničenom odgovornošću)
- `DD` - d.d. (Dioničko društvo)
- `ZDR` - Zadruga
- `VD` - v.d. (Javno trgovačko društvo)
- `KD` - k.d. (Komanditno društvo)
- `PAUSALAC` - Paušalno oporezivanje

### 2. **Validacija pri Registraciji**

**Fajl:** `backend/src/routes/auth.js` - `POST /api/auth/register`

```javascript
if (role === 'PROVIDER') {
  if (!legalStatusId || !taxId || !companyName) {
    return res.status(400).json({ 
      error: 'Pružatelj usluga mora imati pravni oblik',
      message: 'Za registraciju kao pružatelj usluga obavezno je navesti: pravni status (obrt, d.o.o., itd.), OIB i naziv firme/obrta.',
      requiredFields: ['legalStatusId', 'taxId', 'companyName']
    });
  }
}
```

**Obavezna polja za PROVIDER-e:**
- `legalStatusId` - ID iz LegalStatus tabele
- `taxId` - OIB broj (11 brojeva)
- `companyName` - Naziv obrta/firme

### 3. **Validacija pri Upgrade-u USER → PROVIDER**

**Fajl:** `backend/src/routes/auth.js` - `POST /api/auth/upgrade-to-provider`

```javascript
POST /api/auth/upgrade-to-provider

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "legalStatusId": "legal-status-id",  // OBAVEZNO
  "taxId": "12345678901",              // OBAVEZNO
  "companyName": "Moj Obrt d.o.o."     // OBAVEZNO
}
```

### 4. **Novi API Endpoint - Legal Statuses**

**Fajl:** `backend/src/routes/legal-statuses.js`

```javascript
GET /api/legal-statuses
```

**Response:**
```json
[
  {
    "id": "...",
    "code": "OBRT",
    "name": "Obrt",
    "description": "Obrtništvo - samostalna djelatnost fizičke osobe",
    "isActive": true,
    "createdAt": "..."
  },
  {
    "id": "...",
    "code": "DOO",
    "name": "d.o.o.",
    "description": "Društvo s ograničenom odgovornošću",
    "isActive": true,
    "createdAt": "..."
  },
  ...
]
```

---

## 🚀 Deployment - Seed Legal Statuses

### Lokalno (Development)

```bash
cd uslugar/backend

# Pokreni seed
npx prisma db seed
```

### Produkcija (AWS RDS)

**Opcija 1: Via Seed Script**

```bash
# Setuj DATABASE_URL za production
export DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"

# Pokreni seed
npx prisma db seed
```

**Opcija 2: SQL Direct Insert**

Ako seed ne radi, možete direktno insertovati u bazu:

```sql
INSERT INTO "LegalStatus" (id, code, name, description, "isActive", "createdAt")
VALUES
  (gen_random_uuid(), 'OBRT', 'Obrt', 'Obrtništvo - samostalna djelatnost fizičke osobe', true, NOW()),
  (gen_random_uuid(), 'DOO', 'd.o.o.', 'Društvo s ograničenom odgovornošću', true, NOW()),
  (gen_random_uuid(), 'JDOO', 'j.d.o.o.', 'Jednostavno društvo s ograničenom odgovornošću', true, NOW()),
  (gen_random_uuid(), 'DD', 'd.d.', 'Dioničko društvo', true, NOW()),
  (gen_random_uuid(), 'ZDR', 'Zadruga', 'Zadruga - gospodarski subjekt', true, NOW()),
  (gen_random_uuid(), 'VD', 'v.d.', 'Javno trgovačko društvo (vl. društvo)', true, NOW()),
  (gen_random_uuid(), 'KD', 'k.d.', 'Komanditno društvo', true, NOW()),
  (gen_random_uuid(), 'PAUSALAC', 'Paušalno oporezivanje', 'Samostalna djelatnost - paušalno oporezivanje', true, NOW())
ON CONFLICT (code) DO NOTHING;
```

---

## 🧪 Testiranje

### Test 1: Registracija PROVIDER-a bez pravnog statusa (FAIL)

```bash
curl -X POST https://uslugar.api.oriph.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test Provider",
    "role": "PROVIDER"
  }'
```

**Expected Response:** `400 Bad Request`
```json
{
  "error": "Pružatelj usluga mora imati pravni oblik",
  "message": "Za registraciju kao pružatelj usluga obavezno je navesti: pravni status (obrt, d.o.o., itd.), OIB i naziv firme/obrta.",
  "requiredFields": ["legalStatusId", "taxId", "companyName"]
}
```

### Test 2: Registracija PROVIDER-a SA pravnim statusom (SUCCESS)

```bash
# Prvo dohvati legal statuses
curl https://uslugar.api.oriph.io/api/legal-statuses

# Uzmi ID za "Obrt"
LEGAL_STATUS_ID="..."

# Registriraj se sa pravnim statusom
curl -X POST https://uslugar.api.oriph.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "obrt@example.com",
    "password": "password123",
    "fullName": "Ivan Horvat",
    "role": "PROVIDER",
    "legalStatusId": "'$LEGAL_STATUS_ID'",
    "taxId": "12345678901",
    "companyName": "Obrt Horvat"
  }'
```

**Expected Response:** `200 OK`
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "email": "obrt@example.com",
    "role": "PROVIDER",
    "fullName": "Ivan Horvat",
    "isVerified": false
  },
  "message": "Registracija uspješna! Provjerite email za aktivacijski link."
}
```

### Test 3: Upgrade USER → PROVIDER sa pravnim statusom

```bash
# Login kao USER
curl -X POST https://uslugar.api.oriph.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Upgrade na PROVIDER
curl -X POST https://uslugar.api.oriph.io/api/auth/upgrade-to-provider \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "legalStatusId": "'$LEGAL_STATUS_ID'",
    "taxId": "98765432101",
    "companyName": "Obrt Marić"
  }'
```

**Expected Response:** `200 OK`
```json
{
  "message": "Successfully upgraded to provider!",
  "token": "...",  // Novi token sa role=PROVIDER
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "PROVIDER",  // Promijenjena rola
    "fullName": "...",
    "isVerified": true
  }
}
```

---

## 📊 Database Schema

### LegalStatus Model

```prisma
model LegalStatus {
  id          String   @id @default(cuid())
  code        String   @unique // INDIVIDUAL, SOLE_TRADER, COMPANY, etc.
  name        String   // Naziv na hrvatskom
  description String?  // Detaljan opis
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  users       User[]   @relation("UserLegalStatus")
  providers   ProviderProfile[]
}
```

### User Model (Povezano)

```prisma
model User {
  // ...
  legalStatus      LegalStatus?  @relation("UserLegalStatus", fields: [legalStatusId], references: [id])
  legalStatusId    String?       // Pravni status
  taxId            String?       // OIB
  companyName      String?       // Naziv firme
  // ...
}
```

### ProviderProfile Model (Povezano)

```prisma
model ProviderProfile {
  // ...
  legalStatus    LegalStatus?  @relation(fields: [legalStatusId], references: [id])
  legalStatusId  String?       // Pravni status (obrt, d.o.o., itd.)
  taxId          String?       // OIB (porezni broj)
  companyName    String?       // Naziv obrta/firme
  // ...
}
```

---

## 🎯 Frontend Integration

### 1. Dohvaćanje Pravnih Statusa

```javascript
// Fetch legal statuses za dropdown
const response = await fetch('https://uslugar.api.oriph.io/api/legal-statuses');
const legalStatuses = await response.json();

// Prikaži kao dropdown
<select name="legalStatusId">
  {legalStatuses.map(status => (
    <option key={status.id} value={status.id}>
      {status.name} - {status.description}
    </option>
  ))}
</select>
```

### 2. Registracijska Forma za PROVIDER-a

```javascript
<form onSubmit={handleRegister}>
  <input name="email" required />
  <input name="password" required />
  <input name="fullName" required />
  
  {/* OBAVEZNO za PROVIDER-e */}
  <select name="legalStatusId" required>
    <option value="">Odaberite pravni oblik...</option>
    {legalStatuses.map(status => (
      <option key={status.id} value={status.id}>
        {status.name}
      </option>
    ))}
  </select>
  
  <input name="taxId" placeholder="OIB (11 brojeva)" required />
  <input name="companyName" placeholder="Naziv firme/obrta" required />
  
  <button type="submit">Registriraj se kao pružatelj</button>
</form>
```

### 3. Upgrade na PROVIDER Forma

```javascript
<form onSubmit={handleUpgrade}>
  <h3>Postani Pružatelj Usluga</h3>
  <p>Za pružanje usluga potreban je pravni oblik (obrt, d.o.o., itd.)</p>
  
  <input name="password" type="password" placeholder="Potvrdi lozinku" required />
  
  <select name="legalStatusId" required>
    <option value="">Odaberite pravni oblik...</option>
    {legalStatuses.map(status => (
      <option key={status.id} value={status.id}>
        {status.name} - {status.description}
      </option>
    ))}
  </select>
  
  <input name="taxId" placeholder="OIB" required />
  <input name="companyName" placeholder="Naziv firme/obrta" required />
  
  <button type="submit">Postani pružatelj</button>
</form>
```

---

## ✅ Benefits

### Pravna Usklađenost:
- ✅ Pružatelji moraju imati pravni oblik (zakon)
- ✅ Evidentiran OIB za porezne svrhe
- ✅ Evidentirani podaci o firmi/obrtu

### Transparentnost:
- ✅ Korisnici vide pravni oblik pružatelja
- ✅ Veća sigurnost i povjerenje
- ✅ Lakše rješavanje sporova

### Kontrola:
- ✅ Admin može vidjeti pravni status svih pružatelja
- ✅ Filtriranje po pravnom obliku
- ✅ Izvještaji za porezne organe

---

## 📋 Deployment Checklist

### Backend:
- [x] ✅ Seed data dodani (legal statuses)
- [x] ✅ Validacija u auth.js (register + upgrade)
- [x] ✅ Novi endpoint `/api/legal-statuses`
- [x] ✅ Router registrovan u server.js
- [ ] 🔄 Seed pokrenut na production bazi
- [ ] 🔄 Deploy backend na AWS

### Frontend:
- [ ] 🔄 Fetch legal statuses API
- [ ] 🔄 Dropdown za pravni status u registraciji
- [ ] 🔄 Forma za upgrade sa pravnim statusom
- [ ] 🔄 Prikazati pravni status u provider profilu

### Database:
- [x] ✅ Schema OK (LegalStatus model već postoji)
- [ ] 🔄 Seed data insert-ovani

---

## 🚀 Next Steps

1. **Seed Legal Statuses na Production:**
   ```bash
   # Connect to production DB and run seed
   DATABASE_URL="..." npx prisma db seed
   ```

2. **Deploy Backend na AWS:**
   ```bash
   cd uslugar/backend
   .\deploy-legal-status-validation.ps1
   ```

3. **Frontend UI:**
   - Dodati legal statuses dropdown
   - Update registracijsku formu
   - Update upgrade-to-provider formu

---

**Datum implementacije:** 20. oktobar 2025  
**Status:** ✅ Backend Ready for Deployment  
**Pravni zahtjev:** ✅ Ispunjen (PROVIDER mora biti pravno lice)

