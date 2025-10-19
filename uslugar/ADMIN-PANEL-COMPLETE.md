# 🎉 Admin Panel - Potpuno Funkcionalan!

## ✅ Što je deploy-ano

### Backend (Task Definition 79) ✅
**Commit:** `f2266347bd7b6c74cfb2e5144de08419c05f6538`  
**Status:** DEPLOYED na AWS ECS  

**Admin modeli dostupni:**
- ✅ **User** - Svi korisnici
- ✅ **ProviderProfile** - Profili pružatelja usluga
- ✅ **Category** - Kategorije (hijerarhijske)
- ✅ **Job** - Poslovi (sa geolokacijom, slikama)
- ✅ **Offer** - Ponude (sa pregovaranjem)
- ✅ **Review** - Recenzije
- ✅ **Notification** - Notifikacije ✨ NOVO
- ✅ **ChatRoom** - Chat sobe ✨ NOVO
- ✅ **ChatMessage** - Chat poruke ✨ NOVO
- ✅ **Subscription** - Pretplate/Krediti ✨ NOVO

### Frontend ✅
**Build:** Gotov (`dist/` folder)  
**Models:** Svi admin modeli vidljivi u navigaciji

---

## 🔑 Admin kredencijali

```
Email: admin@uslugar.hr
Password: Admin123!
```

---

## 🚀 Kako koristiti admin panel

### Opcija 1: Production (nakon deploy-a frontend-a)

1. Deploy `dist/` folder na tvoj hosting
2. Otvori admin panel u browseru
3. Unesi kredencijale gore
4. Upravljaj svim modelima!

### Opcija 2: Lokalno testiranje

```bash
cd uslugar/frontend
npm run dev
```

Otvori: `http://localhost:5173/admin`

---

## 📊 Svi modeli i njihove funkcije

### 1. **User** - Upravljanje korisnicima
**Polja:**
- Email, lozinka, ime
- Rola (USER, PROVIDER, ADMIN)
- Telefon, grad
- **Geolokacija** (latitude, longitude)
- Verifikacija statusa

**Akcije:**
- Dodaj novog korisnika
- Uredi postojećeg
- Izbriši korisnika
- Pretraživanje po email-u

---

### 2. **ProviderProfile** - Profili pružatelja
**Polja:**
- Bio, portfolio (JSON)
- Rating prosijek i broj ocjena
- **Specijalizacije** (array)
- **Godine iskustva**
- **Website**
- **Dostupnost** (isAvailable)
- Područje usluga

**Akcije:**
- Uredi profil pružatelja
- Dodaj/ukloni kategorije
- Postavi dostupnost
- Uredi specijalizacije

---

### 3. **Category** - Hijerarhijske kategorije
**Polja:**
- Naziv, opis
- **Parent kategorija** (hijerarhija)
- **Sub-kategorije**
- Status (aktivan/neaktivan)

**Akcije:**
- Kreiraj kategoriju/podkategoriju
- Organiziraj hijerarhiju
- Aktiviraj/deaktiviraj

---

### 4. **Job** - Poslovi
**Polja:**
- Naziv, opis
- Budžet (min/max)
- Grad + **geolokacija**
- **Status** (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
- **Hitnost** (LOW, NORMAL, HIGH, URGENT)
- **Veličina** (SMALL, MEDIUM, LARGE, EXTRA_LARGE)
- **Rok izvršenja**
- **Slike** (array)

**Akcije:**
- Pregled svih poslova
- Filtriranje po statusu/hitnosti
- Ažuriranje statusa
- Prihvaćanje ponuda

---

### 5. **Offer** - Ponude
**Polja:**
- Iznos
- Poruka
- Status (PENDING, ACCEPTED, REJECTED)
- **Može se pregovarati** (isNegotiable)
- **Procijenjeni dani** izvršenja

**Akcije:**
- Pregled svih ponuda
- Prihvaćanje/odbijanje ponuda
- Filtriranje po statusu

---

### 6. **Review** - Recenzije
**Polja:**
- Ocjena (rating)
- Komentar
- Od korisnika / Za korisnika

**Akcije:**
- Moderacija recenzija
- Brisanje neprihvatljivih
- Pregled prosječnih ocjena

---

### 7. **Notification** ✨ - Notifikacije
**Polja:**
- Naslov, poruka
- **Tip** (NEW_JOB, NEW_OFFER, OFFER_ACCEPTED, OFFER_REJECTED, JOB_COMPLETED, REVIEW_RECEIVED, SYSTEM)
- Status (pročitano/nepročitano)
- Povezani job/offer ID

**Akcije:**
- Pregled svih notifikacija
- Slanje system notifikacija
- Brisanje starih notifikacija

---

### 8. **ChatRoom** ✨ - Chat sobe
**Polja:**
- Naziv sobe
- Povezani posao (job)
- Participanti (many-to-many)
- Datum kreiranja

**Akcije:**
- Pregled aktivnih chat soba
- Dodavanje/uklanjanje participanata
- Arhiviranje starih soba

---

### 9. **ChatMessage** ✨ - Chat poruke
**Polja:**
- Sadržaj poruke
- Pošiljatelj (sender)
- Chat soba
- Timestamp

**Akcije:**
- Pregled svih poruka
- Moderacija sadržaja
- Brisanje neprikladnih poruka

---

### 10. **Subscription** ✨ - Pretplate
**Polja:**
- Korisnik
- **Plan** (BASIC, PREMIUM, PRO)
- **Status** (ACTIVE, CANCELLED, EXPIRED)
- **Krediti** (za odgovaranje na poslove)
- Datum isteka

**Akcije:**
- Upravljanje pretplatama
- Dodavanje/oduzimanje kredita
- Produžavanje pretplata
- Deaktivacija pretplata

---

## 🎯 Primjeri korištenja

### Scenario 1: Dodavanje nove kategorije

1. Klikni na **Category**
2. Klikni **"Create New"**
3. Unesi:
   - Name: "Vodoinstalater"
   - Description: "Vodoinstalaterske usluge"
   - Parent: (ostavi prazno za root kategoriju)
   - isActive: true
4. Spremi

### Scenario 2: Provjera novih poslova

1. Klikni na **Job**
2. Filtriraj: `status = OPEN`
3. Sortiraj po: `createdAt DESC`
4. Vidi najnovije poslove

### Scenario 3: Dodavanje kredita korisniku

1. Klikni na **Subscription**
2. Pronađi korisnika
3. Klikni **Edit**
4. Povećaj `credits`
5. Spremi

### Scenario 4: Moderacija chat-a

1. Klikni na **ChatMessage**
2. Pregledaj poruke
3. Izbriši neprikladne poruke
4. Ban korisnika ako je potrebno (preko User modela)

---

## 🔧 Napredne funkcije

### JSON polja

Neki modeli imaju JSON polja (npr. `portfolio` u ProviderProfile). Unosi se kao JSON:

```json
{
  "images": [
    "/uploads/work1.jpg",
    "/uploads/work2.jpg"
  ],
  "description": "Moji radovi"
}
```

### Relacije

Admin panel automatski učitava relacije (npr. Job → User, Offer → Job).

Za kreiranje entiteta s relacijama, unesi samo ID:

```json
{
  "userId": "cmgy1vtpy0000wsce2tt50wle",
  "categoryId": "cm2hs..."
}
```

---

## 📈 Statistike i izvještaji

### Način dobivanja statistika:

1. **User Count:**
   - Idi na User → vidi `total` broj

2. **Active Jobs:**
   - Idi na Job → filtriraj `status=OPEN`

3. **Providers Count:**
   - Idi na ProviderProfile → vidi total

4. **Recent Notifications:**
   - Idi na Notification → sortiraj po `createdAt DESC`

---

## 🛡️ Sigurnosne napomene

### Zaštita

1. **Samo ADMIN rola** može pristupiti admin panelu
2. **JWT token** s 7-dana trajanjem
3. **HTTPS** obavezan (već postavljen via ALB)

### Best practices

- ❌ Nemoj dijeliti admin kredencijale
- ✅ Promijeni default lozinku (`Admin123!`)
- ✅ Kreiraj dodatne admin račune za tim
- ✅ Redovito provjeri logove

---

## 🚨 Troubleshooting

### Problem: Ne mogu se prijaviti

**Provjeri:**
1. Da li korisnik ima `role: ADMIN`?
2. Da li je lozinka ispravna?
3. Provjeri CloudWatch logs za greške

### Problem: Model se ne prikazuje

**Rješenje:**
1. Provjeri da je backend deploy-an
2. Refresh browser (Ctrl + F5)
3. Provjeri browser console za greške

### Problem: Ne mogu kreirati entitet

**Mogući uzroci:**
1. Nedostaju required polja
2. Invalid JSON format
3. Foreign key constraint greška

**Rješenje:**
- Provjeri Prisma schema za required polja
- Validiraj JSON prije spremanja
- Prvo kreiraj povezane entitete

---

## 📚 Dodatni resursi

### API dokumentacija
Vidi: `uslugar/README-TREBAM-HR-SETUP.md`

### Prisma schema
Vidi: `uslugar/backend/prisma/schema.prisma`

### Deployment
Vidi: `uslugar/DEPLOYMENT-COMPLETE-FINAL.md`

---

## 🎊 Sažetak

✅ **10 modela** potpuno funkcionalno  
✅ **CRUD operacije** za sve modele  
✅ **JWT autentikacija** implementirana  
✅ **Backend deployed** na AWS ECS  
✅ **Frontend built** i spreman  
✅ **Database migrations** primijenjene  

**Admin panel je potpuno spreman za produkciju!** 🚀

---

## 📞 Support

Za dodatna pitanja ili probleme:
1. Provjeri dokumentaciju
2. Pregledaj CloudWatch logs
3. Testiraj API endpointe direktno (Postman/curl)

**Sretan rad s admin panelom!** 🎉

