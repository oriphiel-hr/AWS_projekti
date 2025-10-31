# 🔍 SMS Verifikacija - Debug Guide

## Problemi koje sam popravio:

### 1. Format telefona
**Problem:** Placeholder je imao razmake (`+385 98 123 4567`), ali validacija traži format bez razmaka (`+385XXXXXXXXX`).

**Rješenje:**
- Automatska normalizacija telefonskog broja pri unosu
- Uklanjanje razmaka i posebnih znakova
- Automatsko dodavanje `+385` prefixa ako nedostaje
- Ograničenje na 8-9 znamenki nakon `+385`

### 2. Validacija prije prikaza PhoneVerification
**Problem:** PhoneVerification se prikazivao čim postoji `value`, bez provjere formata.

**Rješenje:**
- PhoneVerification se prikazuje samo ako:
  - `value` postoji
  - Počinje s `+385`
  - Ima minimalno 12 znakova (`+385` + 8-9 znamenki)

---

## ✅ Kako sada radi:

1. **Korisnik odabere "📱 Telefon"**
2. **Unese telefonski broj:**
   - Automatski se normalizira (uklanjaju razmaci)
   - Ako unese bez `+385`, automatski se dodaje
   - Format se validira u real-time

3. **Kada je format ispravan:**
   - Prikazuje se `PhoneVerification` komponenta
   - Korisnik klikne "Pošalji SMS kod"
   - SMS se šalje na normalizirani broj

4. **Korisnik unese SMS kod:**
   - Kod se verificira
   - Tek nakon uspješne verifikacije se poziva `/kyc/verify-identity`

---

## 🧪 Testiranje:

### Lokalno (development):
1. Pokrenite frontend: `npm run dev`
2. Idite na Identity Badge verifikaciju
3. Odaberite "📱 Telefon"
4. Unesite broj u bilo kojem formatu:
   - `+385912345678` ✅
   - `0912345678` → automatski postaje `+385912345678` ✅
   - `385912345678` → automatski postaje `+385912345678` ✅
   - `+385 91 234 5678` → automatski postaje `+385912345678` ✅

### Produkcija:
- Provjerite da je frontend buildan i deployan
- Provjerite da je backend deployan na AWS ECS
- Testirajte na `https://uslugar.oriph.io`

---

## 🆘 Ako još uvijek ne radi:

### Provjerite:
1. **Browser konzola** - ima li JavaScript grešaka?
2. **Network tab** - šalje li se API zahtjev na `/api/sms-verification/send`?
3. **Backend logovi** - CloudWatch logovi za `/ecs/uslugar-backend`
4. **Twilio credentials** - jesu li postavljeni u backend `.env`?

### Mogući problemi:
- **SMS se ne šalje?** → Provjerite Twilio credentials
- **Kod se ne verificira?** → Provjerite da li je kod ispravan (6 znamenki)
- **Automatska verifikacija i dalje radi?** → Provjerite da li je frontend stvarno deployan

---

## 📝 Promjene u kodu:

**File:** `uslugar/frontend/src/components/IdentityBadgeVerification.jsx`

**Promjene:**
- Dodana automatska normalizacija telefonskog broja pri unosu
- Dodana provjera formata prije prikaza `PhoneVerification` komponente
- Poboljšan placeholder i pomoćni tekst

**Backend:** Nema promjena - endpoint `/api/sms-verification/send` već validira format

---

**Status:** ✅ Popravke su commit-ane i push-ane. GitHub Actions će automatski deployati promjene.

