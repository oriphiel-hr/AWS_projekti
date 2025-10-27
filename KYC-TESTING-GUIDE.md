# KYC Verifikacija - Testiranje i Provjera

## 🔍 Problem: "Ne vidim promjene"

### 1. Provjeri: Lokalno Testiranje

#### A. Startuj Frontend DEV Server

```bash
cd uslugar/frontend
npm install  # Ako nije instaliran
npm run dev
```

#### B. Startuj Backend Server

```bash
cd uslugar/backend
npm install  # Ako nije instaliran
npm start
```

#### C. Provjeri Backend API

```bash
# Provjeri da li KYC endpoint radi
curl http://localhost:4000/api/kyc/status

# Rezultat bi trebao biti:
# {
#   "kycVerified": false,
#   "kycDocumentUploaded": false
# }
```

---

## 2. Provjeri: Jesi li freelancer?

KYC sekcija se prikazuje **samo** ako si registrirao kao:

- **"Samostalni djelatnik" (FREELANCER)** ✅
- **"Obrtnik" (SOLE_TRADER)** ✅

**Ne prikazuje se** za:
- Fizička osoba ❌
- d.o.o. ❌
- j.d.o.o. ❌
- Paušalni obrt ❌

### Kako provjeriti svoj legal status:

1. Idi na Provider Profile stranicu
2. Otvori **Developer Tools** (F12)
3. **Console** tab → upišite:
```javascript
console.log(window.profileData)
// ili
await fetch('/api/providers/me').then(r => r.json()).then(console.log)
```

4. Provjeri `user.legalStatus.code`:
   - Trebalo bi biti `"FREELANCER"` ili `"SOLE_TRADER"`

---

## 3. GitHub Actions - Migration Status

### Provjeri da li je migracija završila:

```
https://github.com/oriphiel-hr/AWS_projekti/actions
```

**Workflow**: `prisma-uslugar.yml`
- Traje: ~5-10 minuta
- Zeleno = ✅ Success
- Crveno = ❌ Failed

### Ako je Failed:

1. Pogledaj logs
2. Provjeri da li `DATABASE_URL` secret postoji
3. Provjeri da li je baza dostupna

---

## 4. Produkcija Deploy

### KYC funkcija će biti dostupna nakon:

1. ✅ **GitHub Actions Migracija** (prisma-uslugar.yml) - ~10 min
2. ✅ **Backend Deploy** (backend-uslugar-ecs.yml) - ~10 min  
3. ✅ **Frontend Deploy** (frontend-uslugar.yml) - ~5 min

**Total**: ~25 minuta od push-a

---

## 5. Test Scenarios

### Scenario 1: Novi Freelancer

1. **Registriraj se** kao Provider
2. **Odaberi**: "Samostalni djelatnik" (FREELANCER)
3. **Unesi**: OIB
4. **Sačuvaj**: Profil
5. **Idi**: Provider Profile
6. **Vidi**: 🔒 KYC-lite Verifikacija sekcija

### Scenario 2: Postojeći Freelancer

1. **Login** sa postojećim freelancer računom
2. **Idi**: Provider Profile
3. **Provjeri**: `user.legalStatus.code === 'FREELANCER'`
4. **Ako jest**: Vidi KYC sekciju
5. **Ako nije**: KYC sekcija se ne prikazuje

### Scenario 3: Non-Freelancer

1. **Login** kao d.o.o. provider
2. **Idi**: Provider Profile
3. **Ne vidi**: KYC sekciju (correct behavior)
4. **Razlog**: KYC je samo za freelancere

---

## 6. Debug Checklist

- [ ] Frontend build: `npm run build`
- [ ] Backend migracija: Check GitHub Actions
- [ ] Legal status correct: `profile.user.legalStatus.code`
- [ ] KYCVerification komponenta postoji: `uslugar/frontend/src/components/KYCVerification.jsx`
- [ ] KYC routes registrirane: Check `server.js`
- [ ] Database schema updated: Check migracija

---

## 7. Immediate Test

### A. Ručno Test KYC Upload API:

```bash
# 1. Login kao PROVIDER
# 2. Copy bearer token
# 3. Test upload:

curl -X POST http://localhost:4000/api/kyc/upload-document \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "document=@sample-rpo.pdf" \
  -F "publicConsent=true"
```

### B. Provjeri DB Schema:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'ProviderProfile' 
AND column_name LIKE 'kyc%';
```

**Expected**: 12 novih kolona

---

## 8. Ako još uvijek ne radi

### Provjeri:

1. **Browser cache** - Hard refresh (Ctrl+Shift+R)
2. **Frontend build** - Da li je novi build deployed?
3. **Backend restart** - Da li je backend restarted nakon deploya?
4. **Legal status** - Jesu li u bazi postavljene FREELANCER?

### Quick Fix:

```bash
# Lokalno: Restart sve
cd uslugar/backend && npm start
cd uslugar/frontend && npm run dev

# Cloud: Provjeri logs
# AWS ECS → Task Definitions → Check logs
```

