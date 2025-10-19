# 🔐 Admin Panel - Upute za autentikaciju

## 📋 Pregled

Implementirana je kompletna JWT autentikacija za admin panel sa:
- ✅ Login stranicom
- ✅ JWT token validacijom
- ✅ Automatskim slanjem tokena sa svakim requestom
- ✅ Logout funkcionalošću
- ✅ Zaštitom svih admin ruta

---

## 🚀 Koraci za postavljanje

### 1️⃣ Kreiraj ADMIN korisnika u bazi

```bash
cd uslugar/backend
node prisma/create-admin.js
```

**Output:**
```
✅ Admin korisnik kreiran uspješno!
   Email: admin@uslugar.hr
   Password: Admin123!
   ID: xxxxx
   
⚠️  VAŽNO: Promijeni lozinku nakon prvog logina!
```

**Ako želiš custom kredencijale**, uredi `prisma/create-admin.js` prije pokretanja:
```javascript
const email = 'tvoj@email.com';
const password = 'TvojaSigurnaLozinka!';
```

---

### 2️⃣ Build i deploy frontend

```bash
cd uslugar/frontend

# Install dependencies (ako već nisi)
npm install

# Build za production
npm run build

# Deploy na server (FTP ili na host)
```

---

### 3️⃣ Prijava na admin panel

1. Otvori admin panel: `https://uslugar.api.oriph.io/admin` (ili gdje god hostaš frontend)
2. Unesi kredencijale:
   - **Email:** `admin@uslugar.hr`
   - **Password:** `Admin123!`
3. Klikni "Prijavi se"

**Token se automatski sprema i koristi za sve admin API pozive!**

---

## 🔒 Kako radi autentikacija

### Backend (već implementirano ✅)

#### Login endpoint: `POST /api/auth/login`
```javascript
// Request
{
  "email": "admin@uslugar.hr",
  "password": "Admin123!"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "xxx",
    "email": "admin@uslugar.hr",
    "role": "ADMIN",
    "fullName": "Administrator"
  }
}
```

#### Admin rute zaštićene middleware-om:
```javascript
// src/routes/admin.js
r.use(auth(true, ['ADMIN']));  // Zahtijeva ADMIN rolu
```

#### Auth middleware provjerava:
1. Da li postoji `Authorization: Bearer <token>` header
2. Da li je token validan
3. Da li korisnik ima ADMIN rolu

---

### Frontend (novo implementirano ✅)

#### 1. Login komponenta (`src/admin/Login.jsx`)
- Prikazuje login formu
- Šalje kredencijale na `/api/auth/login`
- Sprema token i user info u `localStorage`

#### 2. Router sa autentikacijom (`src/admin/router.jsx`)
- Provjerava da li korisnik ima token
- Ako nema → prikaže Login stranicu
- Ako ima → prikaže Admin panel

#### 3. Automatsko slanje tokena
```javascript
// Token se dodaje u axios default headers
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Sad SVE admin API pozive automatski šalju token
```

#### 4. Logout funkcija
- Briše token iz `localStorage`
- Uklanja Authorization header
- Vraća na login stranicu

---

## 📁 Novi fajlovi

### Backend
```
uslugar/backend/
├── prisma/
│   └── create-admin.js        # Script za kreiranje admin korisnika
└── src/
    ├── lib/
    │   └── auth.js            # ✅ Već postoji (JWT middleware)
    └── routes/
        ├── auth.js            # ✅ Već postoji (login/register)
        └── admin.js           # ✅ Već postoji (CRUD endpoints)
```

### Frontend
```
uslugar/frontend/src/
└── admin/
    ├── Login.jsx              # ✅ NOVO - Login forma
    ├── router.jsx             # ✅ AŽURIRANO - Auth logika
    └── Layout.jsx             # ✅ AŽURIRANO - Header sa logout
```

---

## 🧪 Testiranje

### 1. Test login preko terminala
```bash
curl -X POST https://uslugar.api.oriph.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uslugar.hr","password":"Admin123!"}'
```

**Očekivani odgovor:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "xxx",
    "email": "admin@uslugar.hr",
    "role": "ADMIN",
    "fullName": "Administrator"
  }
}
```

### 2. Test admin endpoint SA tokenom
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl https://uslugar.api.oriph.io/api/admin/User \
  -H "Authorization: Bearer $TOKEN"
```

**Očekivani odgovor:** ✅ 200 OK sa listom korisnika

### 3. Test admin endpoint BEZ tokena
```bash
curl https://uslugar.api.oriph.io/api/admin/User
```

**Očekivani odgovor:** ❌ 401 Unauthorized
```json
{"error": "Missing token"}
```

---

## 🔐 Sigurnost

### Proizvodnja (production)

**1. Promijeni JWT secret:**
```bash
# U .env fajlu ili AWS Secrets Manager
JWT_SECRET=tvoj-super-dugi-i-siguran-secret-key-123456789
```

**2. Koristi jaku lozinku za admin račun**

**3. HTTPS je obavezan** (već imaš via ALB)

**4. Token expiration:**
- Trenutno: 7 dana
- Možeš promijeniti u `src/lib/auth.js`:
```javascript
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' }); // 24 sata
}
```

---

## 🛠️ Troubleshooting

### Problem: "401 Unauthorized" nakon logina

**Provjeri:**
1. Da li se token sprema u localStorage?
   ```javascript
   // U browser console
   localStorage.getItem('adminToken')
   ```

2. Da li axios šalje token?
   ```javascript
   // U browser console
   console.log(api.defaults.headers.common['Authorization'])
   ```

3. Da li backend vidi token?
   - Provjeri CloudWatch logs za "Missing token" ili "Invalid token"

---

### Problem: Login forma se ne prikazuje

**Provjeri:**
1. Da li je build napravljen?
   ```bash
   cd uslugar/frontend
   npm run build
   ```

2. Da li su novi fajlovi deployan na server?
   - Provjeri da `Login.jsx` postoji na serveru

---

### Problem: "Invalid token" greška

**Mogući uzroci:**
1. Token je expired (prošlo je 7 dana)
   - **Rješenje:** Odjavi se i ponovo se prijavi
   
2. JWT_SECRET je promijenjen na serveru
   - **Rješenje:** Sve postojeće tokene izbriši i stvori nove

3. Token je korumpiran
   - **Rješenje:** Odjavi se (clear localStorage) i ponovo se prijavi

---

## 📊 Flow dijagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─── 1. User otvori admin panel
       │
       v
┌──────────────┐
│  router.jsx  │◄─── Provjeri localStorage
└──────┬───────┘
       │
       ├─── Token postoji? ──NO──► Prikaži Login.jsx
       │                              │
       └─── Token postoji? ──YES─┐   │
                                  │   │
                                  v   v
                        ┌─────────────────┐
                        │  Login.jsx      │
                        │  (unos email/pw)│
                        └────────┬────────┘
                                 │
                        POST /api/auth/login
                                 │
                                 v
                        ┌─────────────────┐
                        │  Backend Auth   │
                        │  - Verify user  │
                        │  - Generate JWT │
                        └────────┬────────┘
                                 │
                        Return token + user
                                 │
                                 v
                        ┌─────────────────────┐
                        │ Save to localStorage│
                        │ Set axios header    │
                        └─────────┬───────────┘
                                  │
                                  v
                        ┌──────────────────┐
                        │  Admin Panel     │
                        │  (Layout + CRUD) │
                        └────────┬─────────┘
                                 │
                All admin API calls include:
                Authorization: Bearer <token>
                                 │
                                 v
                        ┌──────────────────┐
                        │ Backend validates│
                        │ token + ADMIN    │
                        │ role             │
                        └──────────────────┘
```

---

## ✅ Checklist za deployment

- [ ] Pokrenut `create-admin.js` script
- [ ] Admin korisnik kreiran u bazi
- [ ] Frontend build napravljen (`npm run build`)
- [ ] Novi fajlovi deploy-ani na server
- [ ] Login forma se prikazuje
- [ ] Login uspješno vraća token
- [ ] Token se sprema u localStorage
- [ ] Admin panel se prikazuje nakon login-a
- [ ] Admin API pozive vraćaju podatke (ne 401)
- [ ] Logout button radi
- [ ] Nakon logout-a vraća na login stranicu

---

## 🎯 Sažetak

### Što se ažuriralo:

1. **Backend** - Bez promjena (sve već postoji! ✅)
2. **Frontend** - Dodano:
   - Login stranica (`Login.jsx`)
   - Auth logika u router-u
   - Token handling
   - Logout funkcionalnost

### Što sad radi:

✅ Admin panel zaštićen autentikacijom  
✅ Samo ADMIN korisnici mogu pristupiti  
✅ Token automatski se šalje sa svakim requestom  
✅ Session persistence (token u localStorage)  
✅ Logout funkcionalnost  

**Admin panel je sad potpuno funkcionalan i siguran!** 🚀🔒

