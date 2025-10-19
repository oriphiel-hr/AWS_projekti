# 📝 Registracijske stranice - User & Provider

## ✅ Što je implementirano

### Uklonjeno:
- ❌ **"Podaci (CRUD)" tab** - Stari CRUD interface maknut

### Dodano:
- ✅ **Registracija korisnika** - Za korisnike koji traže usluge
- ✅ **Registracija providera** - Za pružatelje usluga
- ✅ **LegalStatus podrška** - I za User i za Provider
- ✅ **Conditional rendering** - Tabovi se prikazuju samo ako korisnik nije prijavljen

---

## 🎨 Nova navigacija

### **Prije:**
```
[Korisničko] [Admin] [Podaci (CRUD)]
```

### **Poslije (neprijavljen korisnik):**
```
[Poslovi] [Registracija korisnika] [Registracija providera]        [Admin Panel]
```

### **Poslije (prijavljen korisnik):**
```
[Poslovi]                                                           [Admin Panel]  [Logout]
```

---

## 👤 Registracija korisnika

### **Stranica:** `/#register-user`

### **Polja:**

#### Osnovni podaci (obavezno):
- ✅ Puno ime
- ✅ Email
- ✅ Lozinka (min 6 znakova)
- ✅ Telefon
- ✅ Grad

#### Firma (opcionalno):
- ☑️ Checkbox "Registriram se kao firma / obrt"
- Naziv firme / obrta
- OIB (11 cifara)
- Pravni status (dropdown)
  - Obrtnik
  - Paušalni obrt
  - d.o.o.
  - j.d.o.o.
  - Samostalni djelatnik

### **Use case:**
- Privatne osobe koje traže usluge
- Firme koje traže B2B usluge (građevina, hoteli, restorani...)
- Izdavanje računa (R1/R2)

---

## 🔧 Registracija providera

### **Stranica:** `/#register-provider`

### **Polja:**

#### Osnovni podaci (obavezno):
- ✅ Puno ime
- ✅ Email
- ✅ Lozinka
- ✅ Telefon
- ✅ Grad

#### Profesionalni podaci:
- Bio / Biografija (textarea)
- Specijalizacije (odvojeno zarezom)
- Godine iskustva (broj)
- Website

#### Pravni status (opcionalno):
- Dropdown sa 6 opcija:
  - Fizička osoba
  - Obrtnik
  - Paušalni obrt
  - d.o.o.
  - j.d.o.o.
  - Samostalni djelatnik
- OIB (11 cifara)
- Naziv obrta/firme

### **Use case:**
- Vodoinstalateri, električari, soboslikari...
- Freelanceri (dizajn, IT...)
- Firme koje nude usluge
- Obrte

---

## 🎯 Workflow

### **User registracija:**
```
1. Otvori /#register-user
2. Popuni ime, email, lozinku, tel, grad
3. Ako si firma → klikni checkbox → dodaj OIB i naziv
4. Submit
5. → Auto-login i redirect na Poslovi tab
```

### **Provider registracija:**
```
1. Otvori /#register-provider
2. Popuni osnovne podatke
3. Dodaj bio, specijalizacije, iskustvo
4. Odaberi pravni status (opcionalno)
5. Ako imaš OIB → dodaj OIB i naziv obrta
6. Submit
7. → Auto-login i redirect na Poslovi tab
8. → Provider profil automatski kreiran
```

---

## 🔐 Security Features

### **Validacija:**
- ✅ Email format validation
- ✅ Password min 6 znakova
- ✅ OIB max 11 cifara
- ✅ Required fields označena sa *

### **Backend:**
- ✅ Bcrypt password hashing
- ✅ Unique email constraint
- ✅ JWT token generation
- ✅ Auto-create ProviderProfile

---

## 📊 LegalStatus Integration

### **Za USER:**
Firma koja traži usluge može odabrati:
```json
{
  "legalStatusId": "cls4_doo",
  "taxId": "98765432109",
  "companyName": "Građevina Petrić d.o.o."
}
```

### **Za PROVIDER:**
Obrtnik koji nudi usluge:
```json
{
  "legalStatusId": "cls2_sole_trader",
  "taxId": "12345678901",
  "companyName": "Vodoinstalater Horvat obrt"
}
```

---

## 🎨 UI/UX Features

### **User registracija:**
- 🔵 Plavi theme (korisnik)
- ✅ Conditional firma sekcija
- ✅ Validacija OIB-a (11 cifara)
- ✅ Responsive dizajn

### **Provider registracija:**
- 🟢 Zeleni theme (provider)
- ✅ Profesionalni podaci sekcija
- ✅ Specijalizacije (comma-separated)
- ✅ LegalStatus dropdown sa svim opcijama
- ✅ Conditional OIB/companyName polja

### **Obje stranice:**
- ✅ Real-time validation
- ✅ Loading states
- ✅ Error messages
- ✅ Auto-login nakon registracije
- ✅ Link za "Već imate račun?"

---

## 🔗 API Endpoints korišteni

### **POST /api/auth/register**
```javascript
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Ime Prezime",
  "role": "USER" | "PROVIDER",
  "phone": "+385 91 234 5678",
  "city": "Zagreb",
  "legalStatusId": "cls2_sole_trader" (optional),
  "taxId": "12345678901" (optional),
  "companyName": "Obrt Horvat" (optional)
}
```

### **PUT /api/providers/me**
```javascript
{
  "bio": "Profesionalni opis...",
  "specialties": ["Spec1", "Spec2"],
  "experience": 10,
  "website": "https://example.com",
  "legalStatusId": "cls2_sole_trader",
  "taxId": "12345678901",
  "companyName": "Obrt Horvat"
}
```

---

## 📱 Primjeri

### Privatni korisnik:
```
Ime: Marko Marković
Email: marko@gmail.com
Password: ••••••
Telefon: +385 91 123 4567
Grad: Zagreb

[ ] Registriram se kao firma
```

### Firma koja traži usluge:
```
Ime: Petar Petrić
Email: nabava@firma.hr
Password: ••••••
Telefon: +385 91 999 8888
Grad: Zagreb

[✓] Registriram se kao firma

Naziv firme: Građevina Petrić d.o.o.
OIB: 98765432109
Pravni status: [d.o.o. ▼]
```

### Provider - Obrtnik:
```
Osnovni podaci:
  Ime: Ivan Horvat
  Email: ivan@horvat.hr
  Password: ••••••
  Telefon: +385 91 555 4444
  Grad: Zagreb

Profesionalni podaci:
  Bio: Certificirani vodoinstalater sa 15 godina iskustva
  Specijalizacije: Popravak cijevi, Bojleri, Održavanje
  Godine iskustva: 15
  Website: https://horvat-vodoinstalater.hr

Pravni status:
  Status: [Obrtnik ▼]
  OIB: 12345678901
  Naziv: Vodoinstalater Horvat obrt
```

---

## 🚀 Kako testirati

### Lokalno:
```bash
cd uslugar/frontend
npm run dev
```

### Otvori:
```
http://localhost:5173/#register-user
http://localhost:5173/#register-provider
```

### Registriraj se:
1. Popuni formu
2. Submit
3. Auto-login
4. Redirect na Poslovi tab

---

## ✅ Features

### User Registration:
✅ Basic info (ime, email, password, tel, grad)  
✅ Firma checkbox (conditional fields)  
✅ LegalStatus dropdown  
✅ OIB validation (11 digits)  
✅ Auto-login after registration  
✅ Redirect to jobs  

### Provider Registration:
✅ Basic info + Professional info  
✅ Bio textarea  
✅ Specialties (comma-separated → array)  
✅ Experience (years)  
✅ Website  
✅ Full LegalStatus integration  
✅ Auto-create ProviderProfile  

---

## 📁 Novi fajlovi

```
uslugar/frontend/src/
├── pages/                     ← NOVO
│   ├── UserRegister.jsx      ← NOVO
│   └── ProviderRegister.jsx  ← NOVO
├── components/
│   └── CrudTab.jsx           ← IZBRISANO
└── App.jsx                    ← AŽURIRANO
```

---

## 🎯 Sažetak

**Maknutno:**
- ❌ Stari "Podaci (CRUD)" tab

**Dodano:**
- ✅ Moderna User registracija
- ✅ Moderna Provider registracija
- ✅ LegalStatus integration
- ✅ Firma/obrt support
- ✅ Auto-login functionality
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

**Rezultat:**
Profesionalne registracijske stranice sa punom podrškom za pravne statuse! 🎉

---

**Deploy `dist/` folder i testiraj registraciju!** 🚀

