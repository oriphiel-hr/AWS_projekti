# 🔄 Hybrid Role Implementation - PROVIDER može I tražiti I nuditi usluge

## 📋 Implementirane Izmjene

### ✅ Backend Izmjene

#### 1. **Job Creation** (`src/routes/jobs.js`)
```javascript
// PRIJE: Samo USER može kreirati Job-ove
r.post('/', auth(true, ['USER']), ...)

// SADA: I USER i PROVIDER mogu kreirati Job-ove
r.post('/', auth(true, ['USER', 'PROVIDER']), ...)
```

**Rezultat:**
- ✅ PROVIDER može objavljivati oglase za traženje usluga
- ✅ PROVIDER može tražiti druge pružatelje za specifične poslove

#### 2. **Accept Offers** (`src/routes/jobs.js`)
```javascript
// PRIJE: Samo USER može prihvatiti ponude
r.post('/:jobId/accept/:offerId', auth(true, ['USER']), ...)

// SADA: I USER i PROVIDER mogu prihvatiti ponude
r.post('/:jobId/accept/:offerId', auth(true, ['USER', 'PROVIDER']), ...)
```

**Rezultat:**
- ✅ PROVIDER može prihvatiti ponudu na svoj Job
- ✅ PROVIDER koji traži uslugu može zaposliti drugog PROVIDER-a

#### 3. **Upgrade to Provider** (`src/routes/auth.js`)
```javascript
POST /api/auth/upgrade-to-provider
```

**Novi API Endpoint za nadogradnju USER -> PROVIDER**

**Request:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response:**
```json
{
  "message": "Successfully upgraded to provider!",
  "token": "new-jwt-token-with-PROVIDER-role",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "PROVIDER",
    "fullName": "User Name",
    "isVerified": true
  }
}
```

**Šta radi:**
1. Verificira user kredencijale (email + password)
2. Provjerava da li je već PROVIDER
3. Ažurira `role` iz `USER` na `PROVIDER`
4. Kreira `ProviderProfile` ako ne postoji
5. Vraća novi JWT token sa ažuriranom rolom

---

## 🎯 Kako Sistem Sada Radi

### Scenario 1: USER (Samo traži usluge)
```
Email: marko@example.com
Role: USER
ProviderProfile: ❌ Nema

Može:
✅ Kreirati Job-ove (oglase za traženje usluga)
✅ Prihvatiti ponude na svoje Job-ove
❌ Slati ponude drugima (NEMA PROVIDER profil)
```

### Scenario 2: PROVIDER (Nudi i traži usluge) - **HYBRID**
```
Email: ivan@example.com
Role: PROVIDER
ProviderProfile: ✅ Ima

Može:
✅ Kreirati Job-ove (traži usluge od drugih)
✅ Prihvatiti ponude na svoje Job-ove
✅ Slati ponude na tuđe Job-ove
✅ Imati ProviderProfile (bio, kategorije, portfolio)
```

### Scenario 3: ADMIN
```
Email: admin@example.com
Role: ADMIN
ProviderProfile: ❌ Nema

Može:
✅ Sve admin funkcionalnosti
✅ Kreirati/brisati korisnike, Job-ove, Offer-e
```

---

## 🔄 Upgrade Workflow

### Korisnik se registruje kao USER:
1. Registracija → `role: USER`
2. Koristi platformu za traženje usluga
3. Odluči da postane i pružatelj usluga
4. Klikne "Postani pružatelj usluga" (frontend button)
5. Backend poziv: `POST /api/auth/upgrade-to-provider`
6. System:
   - Ažurira `role` → `PROVIDER`
   - Kreira `ProviderProfile`
   - Vraća novi token
7. Frontend:
   - Update localStorage sa novim tokenom
   - Redirect na ProviderProfile setup stranicu
   - Omogući sve PROVIDER funkcionalnosti

---

## 📊 Role Permissions Matrix

| Akcija | USER | PROVIDER | ADMIN |
|--------|------|----------|-------|
| **Kreirati Job** (tražiti usluge) | ✅ | ✅ | ✅ |
| **Prihvatiti ponude na svoj Job** | ✅ | ✅ | ✅ |
| **Slati ponude na tuđe Job-ove** | ❌ | ✅ | ❌ |
| **Imati ProviderProfile** | ❌ | ✅ | ❌ |
| **Upgrade na PROVIDER** | ✅ | ❌ | ❌ |
| **Admin panel** | ❌ | ❌ | ✅ |

---

## 🧪 Testing

### Test 1: PROVIDER kreira Job
```bash
curl -X POST https://uslugar.api.oriph.io/api/jobs \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Trebam električara",
    "description": "Instalacija rasvjete",
    "categoryId": "category-id",
    "city": "Zagreb",
    "budgetMax": 500
  }'
```

**Expected:** ✅ 201 Created

### Test 2: Upgrade USER → PROVIDER
```bash
curl -X POST https://uslugar.api.oriph.io/api/auth/upgrade-to-provider \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Expected:** ✅ 200 OK + novi token sa `role: PROVIDER`

### Test 3: PROVIDER prihvati ponudu
```bash
curl -X POST https://uslugar.api.oriph.io/api/jobs/JOB_ID/accept/OFFER_ID \
  -H "Authorization: Bearer PROVIDER_TOKEN"
```

**Expected:** ✅ 200 OK

---

## 🚀 Deployment

### Lokalno testiranje:
```powershell
cd uslugar/backend
npm install
node src/server.js
```

### Deployment na AWS:
```powershell
cd uslugar/backend

# Build Docker image
docker build -t uslugar-api:latest .

# Tag za ECR
docker tag uslugar-api:latest 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-api:latest

# Push na ECR
docker push 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar-api:latest

# Update ECS Service (force new deployment)
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --force-new-deployment \
  --region eu-north-1
```

---

## 📝 Database Schema

**Nema potrebe za DB migracijama!** 

Sve radi sa postojećom schema:
- ✅ `User.role` može biti `USER` ili `PROVIDER`
- ✅ `ProviderProfile` se kreira automatski pri upgrade-u
- ✅ `Job.userId` pokazuje vlasnika (USER ili PROVIDER)
- ✅ `Offer.userId` pokazuje pružatelja (samo PROVIDER)

---

## ✅ Benefits

### Za Korisnike:
- 🎯 **Jedna registracija** - jedan email, jedan nalog
- 🔄 **Fleksibilnost** - traži ili nudi usluge (ili oba)
- 📊 **Unified Dashboard** - sve na jednom mjestu

### Za Pružatelje:
- 💼 **Nudi usluge** - prima poslove kao pružatelj
- 🔍 **Traži usluge** - zaposli druge za specifične zadatke
- 🤝 **B2B Networking** - pružatelji surađuju međusobno

### Za Sistem:
- ✅ **Jednostavnija arhitektura** - jedan User model
- 🔒 **Sigurnost** - email ostaje unique
- 📈 **Skalabilnost** - lako dodati nove role (PREMIUM, PRO)

---

## 🎉 Status

**✅ IMPLEMENTIRANO I SPREMNO ZA DEPLOYMENT**

**Izmjene:**
- ✅ `jobs.js` - PROVIDER može kreirati Job-ove
- ✅ `jobs.js` - PROVIDER može prihvatiti ponude
- ✅ `auth.js` - Novi endpoint `/upgrade-to-provider`
- ✅ Dokumentacija (ovaj fajl)

**Sledeće:**
- 🔄 Frontend - dodati "Postani pružatelj" dugme
- 🔄 Frontend - ProviderProfile setup page
- 🔄 Deploy na AWS

---

**Datum implementacije:** 20. oktobar 2025  
**Autor:** AI Assistant  
**Status:** ✅ Ready for Production

