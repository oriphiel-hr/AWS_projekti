# 🔄 Admin SMS Reset Funkcionalnost

## ✅ Implementirano

Dodana je admin funkcionalnost za resetiranje broja pokušaja SMS verifikacije za korisnike.

---

## 📋 Što je dodano

### Backend:
- **Endpoint:** `POST /admin/users/:userId/reset-sms-attempts`
- **Autentifikacija:** Zahtijeva ADMIN ulogu
- **Funkcionalnost:** Resetira `phoneVerificationAttempts` na 0 za određenog korisnika

### Frontend:
- **Gumb:** `🔄 SMS` u User model tablici
- **Prikaz:** Pojavljuje se samo za korisnike koji imaju telefon ili `phoneVerificationAttempts > 0`
- **Tooltip:** Prikazuje trenutne pokušaje (npr. "Resetiraj SMS pokušaje (trenutno: 5/5)")

---

## 🚀 Kako koristiti

1. **Prijavi se u Admin Panel:**
   - Otvori: https://uslugar.oriph.io/admin
   - Login: `admin@uslugar.hr` / `Admin123!`

2. **Idi na User model:**
   - Klikni "Korisnici" u navigaciji
   - Ili direktno: https://uslugar.oriph.io/admin/User

3. **Pronađi korisnika:**
   - Pretraži po email-u ili imenu
   - Korisnici s telefonom će imati gumb `🔄 SMS` u koloni "Akcije"

4. **Resetiraj SMS pokušaje:**
   - Klikni gumb `🔄 SMS`
   - Potvrdi akciju u dijalogu
   - Pojavit će se poruka o uspjehu
   - Tablica će se automatski osvježiti

---

## 📊 Primjer korištenja

**Scenario:** Korisnik je pokušao verificirati telefon 5 puta i dobio poruku "Previše pokušaja slanja SMS koda (5/5)".

**Rješenje:**
1. Admin ide u User model
2. Pronađe korisnika po email-u
3. Klikne `🔄 SMS` gumb
4. Potvrdi reset
5. Korisnik sada može ponovno pokušati verificirati telefon

---

## 🔧 Tehnički detalji

### Backend endpoint:
```javascript
POST /admin/users/:userId/reset-sms-attempts
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "SMS pokušaji resetirani za korisnika user@example.com",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "fullName": "Ime Prezime",
    "phone": "+385912345678",
    "phoneVerificationAttempts": 0,
    "phoneVerified": false
  }
}
```

### Frontend funkcija:
```javascript
async function resetSmsAttempts(userId, userEmail) {
  // Poziva POST /admin/users/:userId/reset-sms-attempts
  // Resetira phoneVerificationAttempts na 0
  // Osvježava tablicu nakon uspjeha
}
```

---

## ⚠️ Napomene

- **Samo ADMIN:** Samo korisnici s ADMIN ulogom mogu resetirati SMS pokušaje
- **Automatski reload:** Tablica se automatski osvježava nakon uspješnog reset-a
- **Bez sigurnosnog provjera:** Admin može resetirati pokušaje za bilo kojeg korisnika
- **Ne resetira verification kod:** Samo resetira broj pokušaja, ne briše aktivni SMS kod

---

## 📝 Fajlovi

**Backend:**
- `uslugar/backend/src/routes/admin.js` - Linija 663-708

**Frontend:**
- `uslugar/frontend/src/admin/ModelPage.jsx` - Linija 370-381 (funkcija), 665-673 (gumb)

---

**Status:** ✅ Implementirano i spreman za deployment

