# 🚀 BRZE UPUTE - Admin Panel Autentikacija

## 📝 Što si napravio

✅ **Backend** - Bio je već gotov! Samo se koristio postojeći auth sistem  
✅ **Frontend** - Dodao si:
- Login stranicu
- Automatsko slanje JWT tokena
- Logout funkcionalnost

---

## 🔥 Što trebaš napraviti (3 koraka)

### KORAK 1: Kreiraj admin korisnika

```bash
cd uslugar/backend
node prisma/create-admin.js
```

**Dobit ćeš:**
```
✅ Admin korisnik kreiran uspješno!
   Email: admin@uslugar.hr
   Password: Admin123!
```

---

### KORAK 2: Build frontend

```bash
cd uslugar/frontend
npm install
npm run build
```

Ovo kreira `dist/` folder koji trebaš deploy-ati.

---

### KORAK 3: Deploy frontend

Deploy `dist/` folder na tvoj hosting (FTP, Vercel, Netlify, itd.)

---

## 🎯 Gotovo! Sad testiraj:

1. Otvori admin panel u browseru
2. Vidjet ćeš **login stranicu** 🔐
3. Unesi:
   - Email: `admin@uslugar.hr`
   - Password: `Admin123!`
4. Klikni **"Prijavi se"**
5. Ulazi u admin panel! ✅

---

## 💡 Dodatne info

### Promijeni admin kredencijale

Uredi `uslugar/backend/prisma/create-admin.js`:
```javascript
const email = 'tvoj@email.com';
const password = 'TvojaSigurnaLozinka!';
```

Onda ponovo pokreni script.

---

### Ako nešto ne radi

1. **Provjeri CloudWatch logs** - da li ima grešaka?
2. **Browser console** - da li token postoji?
   ```javascript
   localStorage.getItem('adminToken')
   ```
3. **Network tab** - da li se šalje Authorization header?

---

### Test login preko API-ja

```bash
curl -X POST https://uslugar.api.oriph.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uslugar.hr","password":"Admin123!"}'
```

Mora vratiti token! ✅

---

## 📊 Kako to sve radi?

```
Login forma
    │
    ├─── Šalje email/password na /api/auth/login
    │
    ├─── Backend vraća JWT token
    │
    ├─── Token se sprema u localStorage
    │
    └─── Svaki admin API poziv šalje: Authorization: Bearer <token>
```

---

## ✅ Checklist

- [ ] `create-admin.js` pokrenut
- [ ] Frontend build napravljen
- [ ] `dist/` folder deploy-an
- [ ] Login forma se prikazuje
- [ ] Login uspješan (vidim admin panel)
- [ ] Mogu pristupiti User/Job/Category tablicama
- [ ] Logout button radi

**Sve radi? Čestitam! 🎉 Admin panel je spreman!**

---

Za detaljnije upute vidi: `ADMIN-AUTH-SETUP.md`

