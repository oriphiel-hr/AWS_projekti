## Cjenik u bazi - Implementirano

### 📊 Što je napravljeno:
1. ✅ Novi Prisma model `SubscriptionPlan`
2. ✅ Migracija subscriptions.js - čita iz baze
3. ✅ Admin CRUD endpointi za SubscriptionPlan
4. ✅ Seed podaci za 3 plana

### 🎯 Kako mijenjati cjenik:
Admin panel → SubscriptionPlan model → Edit plan

### 📝 Registracija za poslove:
- Korisnik MORA biti prijavljen (kao na Trebam.hr)
- Backend endpoint: auth(true, ['USER', 'PROVIDER'])
- Frontend: check token prije prikazivanja forme

---

## Anonimno objavljivanje poslova - Implementirano ✅

### 📧 Što je napravljeno:
1. ✅ Anonimni korisnici mogu objavljivati poslove bez registracije
2. ✅ Email notifikacija s pozivom na registraciju
3. ✅ Povezanje posla s korisničkim računom nakon registracije
4. ✅ Token za verifikaciju (7 dana valjanost)

### 🔄 Kako radi:
1. Korisnik objavi posao anonimno (bez prijave)
2. Unese kontakt podatke (email, telefon, ime)
3. Posao se kreira s `userId: null`
4. Backend generira `linkingToken` (7 dana valjan)
5. Email se šalje s linkom za registraciju i povezivanje posla
6. Korisnik klikne link i registrira se
7. Frontend automatski poziva `/api/auth/link-job` s tokenom
8. Posao se povezuje s korisničkim računom

### 📝 Baza podataka:
```sql
ALTER TABLE "Job" 
ADD COLUMN "linkingToken" TEXT,
ADD COLUMN "linkingTokenExpiresAt" TIMESTAMP,
MODIFY COLUMN "userId" TEXT NULL;
```

### 🔗 Endpointi:
- `POST /api/jobs` - Kreira posao (autorizacija opcionalna)
- `POST /api/auth/link-job` - Povezuje posao s računom

### 📧 Email Template:
- Pozdrav i potvrda kreiranja posla
- Informacije o tome što će se dogoditi
- Button "Registriraj se i poveži upit"
- Link ističe za 7 dana

### ⚠️ Važno:
- Linking token se briše nakon povezivanja
- Poslovi s isteklim tokenima ostaju kao "orphaned"
- Admin može vidjeti anonimne poslove (userId: null)
