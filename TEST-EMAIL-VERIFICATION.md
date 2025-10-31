# 🧪 Test Email Verifikacije - Identity Badge

## ⚠️ Trenutno Stanje

**Email verifikacija u Identity Badge NE šalje email!**

Trenutno se samo provjerava:
1. ✅ Da li se email domena podudara s domenom korisnika
2. ❌ Ako se podudara → automatski postavlja `identityEmailVerified: true`

**Problem:** Nema stvarnog email verifikacijskog workflow-a (šalje email → korisnik klikne link → verificira se).

---

## 🔍 Kako Testirati Trenutnu Funkcionalnost

### Korak 1: Priprema
1. Prijavite se kao **PROVIDER**
2. Idite na **Provider Profile** stranicu
3. U sekciji **Identity Badge** kliknite **📧 Email**

### Korak 2: Testiranje

**Scenario 1: Email domena se podudara**
- Unesite email na istoj domeni kao vaš korisnički email
- Primjer: Ako ste registrirani s `mario@oriphiel.hr`, unesite `info@oriphiel.hr`
- Kliknite **✓ Verificiraj**
- **Očekivano:** ✅ Email je verificiran! (bez slanja emaila)

**Scenario 2: Email domena se NE podudara**
- Unesite email na drugoj domeni
- Primjer: Ako ste registrirani s `mario@oriphiel.hr`, unesite `info@example.com`
- Kliknite **✓ Verificiraj**
- **Očekivano:** ❌ Error: "Email domena se ne podudara s domenom tvrtke"

---

## 📝 Backend Logovi

**Ako funkcionira, trebao bi vidjeti u backend logovima:**
```
[KYC] Verifying identity email for user: cmhfft7tu0001i751n7ilu3lj
[KYC] Email domain check: companyEmailDomain = oriphiel.hr, userEmailDomain = oriphiel.hr
[KYC] ✅ Identity email verified
```

---

## ✅ Provjera Statusa

**Provjerite u frontendu (Provider Profile):**
- `identityEmailVerified: true` → Email je verificiran
- Badge status: **IDENTITY** badge bi trebao biti aktiviran

**Provjerite u backend (Database):**
```sql
SELECT "identityEmailVerified" FROM "ProviderProfile" WHERE "userId" = 'cmhfft7tu0001i751n7ilu3lj';
```

---

## 🔧 Što Treba Popraviti

**Za pravu email verifikaciju trebamo:**

1. ✅ Dodati `identityEmailVerificationToken` i `identityEmailVerificationExpires` u ProviderProfile
2. ✅ Generirati verifikacijski token
3. ✅ Poslati email s verifikacijskim linkom
4. ✅ Kreirati endpoint `/api/kyc/verify-identity-email?token=...`
5. ✅ Ažurirati frontend da čeka email umjesto automatske verifikacije

---

## 🎯 Test Sad

**Pokreni test:**
1. Otvori `https://uslugar.oriph.io/#profile` (ili gdje god je Provider Profile)
2. U Identity Badge sekciji klikni **📧 Email**
3. Unesi email na istoj domeni (npr. `info@oriphiel.hr` ako si registriran s `mario@oriphiel.hr`)
4. Klikni **✓ Verificiraj**
5. Provjeri da li se status ažurirao

**Ako radi:** Trebao bi vidjeti "✓ Email je verificiran!" poruku.

