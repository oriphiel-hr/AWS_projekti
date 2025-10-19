# 📝 Admin Panel - JSON Primjeri za CREATE

## Kako koristiti

### CREATE (novi zapis)
Unesi **SVA** required polja u JSON formatu.

### UPDATE (izmjena zapisa)
Možeš poslati **SAMO** polja koja želiš promijeniti.  
Primjer: `{"fullName":"Novo Ime"}`

---

## 1️⃣ User

### CREATE - Minimalan primjer
```json
{
  "email": "korisnik@example.com",
  "passwordHash": "$2a$10$...",
  "fullName": "Ime Prezime",
  "role": "USER"
}
```

### CREATE - Kompletan primjer
```json
{
  "email": "korisnik@example.com",
  "passwordHash": "$2a$10$abc123...",
  "fullName": "Marko Marković",
  "role": "PROVIDER",
  "phone": "+385 91 234 5678",
  "city": "Zagreb",
  "latitude": 45.8150,
  "longitude": 15.9819,
  "isVerified": true
}
```

**Role opcije:** `"USER"` | `"PROVIDER"` | `"ADMIN"`

**Napomena za lozinku:**
- `passwordHash` mora biti bcrypt hash
- Za kreiranje kroz admin, koristi register endpoint ili generiraj hash:
```javascript
// U Node.js konzoli
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('MojaLozinka123', 10);
console.log(hash);
```

### UPDATE - Primjer
```json
{
  "fullName": "Novo Ime",
  "city": "Split",
  "isVerified": true
}
```

---

## 2️⃣ ProviderProfile

### CREATE - Minimalan
```json
{
  "userId": "cm2hs8kw70000w..."
}
```

### CREATE - Kompletan
```json
{
  "userId": "cm2hs8kw70000w...",
  "bio": "Profesionalni vodoinstalater sa 15 godina iskustva",
  "portfolio": {
    "images": ["/uploads/work1.jpg", "/uploads/work2.jpg"],
    "videos": [],
    "certifications": ["Licenca A", "ISO 9001"]
  },
  "ratingAvg": 4.8,
  "ratingCount": 25,
  "serviceArea": "Zagreb i okolica",
  "specialties": ["Popravak cijevi", "Instalacija bojlera", "Održavanje"],
  "experience": 15,
  "website": "https://moj-servis.hr",
  "isAvailable": true
}
```

**Napomena:**
- `userId` mora biti postojeći User ID
- `portfolio` je JSON objekt (može biti bilo što)
- `specialties` je array stringova

### UPDATE - Primjer
```json
{
  "bio": "Ažurirani opis",
  "isAvailable": false,
  "experience": 16
}
```

---

## 3️⃣ Category

### CREATE - Root kategorija
```json
{
  "name": "Vodoinstalateri",
  "description": "Vodoinstalaterske usluge i popravci",
  "isActive": true
}
```

### CREATE - Sub-kategorija (sa parentom)
```json
{
  "name": "Popravak bojlera",
  "description": "Specijalizirani servis za bojlere",
  "parentId": "cm2hs8kw70000w...",
  "isActive": true
}
```

**Napomena:**
- `parentId` je **opcionalan** - ostavi prazan za root kategoriju
- Za sub-kategoriju, stavi ID parent kategorije

### UPDATE - Primjer
```json
{
  "description": "Nova opisna vrijednost",
  "isActive": false
}
```

---

## 4️⃣ Job

### CREATE - Minimalan
```json
{
  "title": "Popravak slavine",
  "description": "Potreban vodoinstalater za popravak slavine u kupatilu",
  "userId": "cm2hs8kw70000w...",
  "categoryId": "cm2ht9kw70001x...",
  "status": "OPEN"
}
```

### CREATE - Kompletan
```json
{
  "title": "Hitno: Popravak slavine u kupatilu",
  "description": "Slavina curi već 2 dana, potreban brz odaziv. Stan je u centru grada.",
  "budgetMin": 200,
  "budgetMax": 500,
  "city": "Zagreb",
  "latitude": 45.8150,
  "longitude": 15.9819,
  "status": "OPEN",
  "urgency": "HIGH",
  "jobSize": "SMALL",
  "deadline": "2025-10-25T18:00:00.000Z",
  "images": ["/uploads/job1.jpg", "/uploads/job2.jpg"],
  "userId": "cm2hs8kw70000w...",
  "categoryId": "cm2ht9kw70001x..."
}
```

**Status opcije:** `"OPEN"` | `"IN_PROGRESS"` | `"COMPLETED"` | `"CANCELLED"`

**Urgency opcije:** `"LOW"` | `"NORMAL"` | `"HIGH"` | `"URGENT"`

**JobSize opcije:** `"SMALL"` | `"MEDIUM"` | `"LARGE"` | `"EXTRA_LARGE"`

**Napomena:**
- `deadline` mora biti u ISO 8601 formatu
- `images` je array stringova (putanje do slika)
- `userId` i `categoryId` moraju postojati u bazi

### UPDATE - Primjer
```json
{
  "status": "IN_PROGRESS",
  "urgency": "URGENT"
}
```

---

## 5️⃣ Offer

### CREATE - Minimalan
```json
{
  "amount": 350,
  "jobId": "cm2hs8kw70000w...",
  "userId": "cm2ht9kw70001x...",
  "status": "PENDING"
}
```

### CREATE - Kompletan
```json
{
  "amount": 350,
  "message": "Mogu doći sutra ujutro. Imam sve potrebne alate i rezervne dijelove.",
  "status": "PENDING",
  "isNegotiable": true,
  "estimatedDays": 1,
  "jobId": "cm2hs8kw70000w...",
  "userId": "cm2ht9kw70001x..."
}
```

**Status opcije:** `"PENDING"` | `"ACCEPTED"` | `"REJECTED"`

**Napomena:**
- `amount` je u kunama/eurima (cijeli broj)
- `estimatedDays` je broj dana za završetak
- `jobId` mora biti postojeći Job
- `userId` je ID providera koji nudi uslugu

### UPDATE - Primjer
```json
{
  "status": "ACCEPTED",
  "amount": 300
}
```

---

## 6️⃣ Review

### CREATE
```json
{
  "rating": 5,
  "comment": "Odličan servis! Brzo i profesionalno obavljen posao.",
  "fromUserId": "cm2hs8kw70000w...",
  "toUserId": "cm2ht9kw70001x..."
}
```

**Napomena:**
- `rating` mora biti broj između 1 i 5
- `fromUserId` - ko daje recenziju
- `toUserId` - ko prima recenziju (obično provider)
- `comment` je opcionalan

### UPDATE - Primjer
```json
{
  "rating": 4,
  "comment": "Ipak malo sporo, ali kvalitetno."
}
```

---

## 7️⃣ Notification

### CREATE - Minimalan
```json
{
  "title": "Novi posao",
  "message": "Novi posao u vašoj kategoriji",
  "type": "NEW_JOB",
  "userId": "cm2hs8kw70000w..."
}
```

### CREATE - Kompletan
```json
{
  "title": "Nova ponuda za vaš posao",
  "message": "Korisnik Marko Marković vam je ponudio 350 EUR za posao 'Popravak slavine'",
  "type": "NEW_OFFER",
  "isRead": false,
  "userId": "cm2hs8kw70000w...",
  "jobId": "cm2ht9kw70001x...",
  "offerId": "cm2hu0kw70002y..."
}
```

**Type opcije:**
- `"NEW_JOB"` - Novi posao objavljen
- `"NEW_OFFER"` - Nova ponuda primljena
- `"OFFER_ACCEPTED"` - Ponuda prihvaćena
- `"OFFER_REJECTED"` - Ponuda odbijena
- `"JOB_COMPLETED"` - Posao završen
- `"REVIEW_RECEIVED"` - Primljena recenzija
- `"SYSTEM"` - System notifikacija

**Napomena:**
- `jobId` i `offerId` su opcionalni (za povezane notifikacije)
- `isRead` defaultno je `false`

### UPDATE - Primjer
```json
{
  "isRead": true
}
```

---

## 8️⃣ ChatRoom

### CREATE - Minimalan
```json
{
  "name": "Chat za posao #123"
}
```

### CREATE - Sa povezanim poslom
```json
{
  "name": "Chat: Popravak slavine",
  "jobId": "cm2hs8kw70000w..."
}
```

**Napomena:**
- `name` je opcionalan
- `jobId` je opcionalan - poveži sa poslom ako je relevantno
- Participanti se dodaju posebno (many-to-many relacija)

### Kako dodati participante?
```json
{
  "participants": {
    "connect": [
      {"id": "cm2hs8kw70000w..."},
      {"id": "cm2ht9kw70001x..."}
    ]
  }
}
```

### UPDATE - Primjer
```json
{
  "name": "Ažuriran naziv chata"
}
```

---

## 9️⃣ ChatMessage

### CREATE
```json
{
  "content": "Dobar dan, kada možete doći na posao?",
  "senderId": "cm2hs8kw70000w...",
  "roomId": "cm2ht9kw70001x..."
}
```

**Napomena:**
- `senderId` - User koji šalje poruku
- `roomId` - ChatRoom u kojem je poruka
- `content` ne može biti prazan

### UPDATE - Primjer
```json
{
  "content": "Ispravljena poruka..."
}
```

---

## 🔟 Subscription

### CREATE - Minimalan
```json
{
  "userId": "cm2hs8kw70000w...",
  "plan": "BASIC",
  "status": "ACTIVE"
}
```

### CREATE - Kompletan
```json
{
  "userId": "cm2hs8kw70000w...",
  "plan": "PREMIUM",
  "status": "ACTIVE",
  "credits": 10,
  "expiresAt": "2026-01-01T00:00:00.000Z"
}
```

**Plan opcije:** `"BASIC"` | `"PREMIUM"` | `"PRO"`

**Status opcije:** `"ACTIVE"` | `"CANCELLED"` | `"EXPIRED"`

**Napomena:**
- `userId` mora biti unique (jedan user = jedna pretplata)
- `credits` - broj kredita za odgovaranje na poslove
- `expiresAt` - datum isteka pretplate (ISO 8601 format)

### UPDATE - Primjer
```json
{
  "credits": 15,
  "status": "ACTIVE",
  "expiresAt": "2026-06-01T00:00:00.000Z"
}
```

---

## 🔗 Relacije (Foreign Keys)

### Kako pronaći ID-eve?

1. **User ID:**
   - Idi na User model
   - Klikni na korisnika
   - Kopiraj `id` polje

2. **Category ID:**
   - Idi na Category model
   - Klikni na kategoriju
   - Kopiraj `id`

3. **Job ID:**
   - Idi na Job model
   - Klikni na posao
   - Kopiraj `id`

### Primjer workflow-a:

```
1. Kreiraj User → dobij userId
2. Kreiraj Category → dobij categoryId
3. Kreiraj Job → koristi userId i categoryId
4. Kreiraj Offer → koristi jobId i userId (providera)
```

---

## 📅 Datumi (ISO 8601 format)

### Primjeri:
```json
"2025-10-25T18:00:00.000Z"        // Određeno vrijeme
"2025-12-31T23:59:59.999Z"        // Kraj godine
"2025-01-01T00:00:00.000Z"        // Početak godine
```

### Generator (JavaScript):
```javascript
new Date('2025-10-25').toISOString()
// Rezultat: "2025-10-25T00:00:00.000Z"
```

---

## 🖼️ Slike i Files

### Upload workflow:

1. **Upload sliku:**
   ```bash
   POST /api/upload/single
   Form-data: file=[slika.jpg]
   ```

2. **Dobij putanju:**
   ```json
   {"url": "/uploads/1234567890.jpg"}
   ```

3. **Koristi u Job/Portfolio:**
   ```json
   {
     "images": ["/uploads/1234567890.jpg"]
   }
   ```

---

## ⚠️ Česte greške

### 1. Foreign Key greška
```
Error: Foreign key constraint failed
```
**Rješenje:** ID koji koristiš ne postoji. Provjeri da li User/Job/Category postoji.

### 2. Unique constraint greška
```
Error: Unique constraint failed on email
```
**Rješenje:** Email (ili userId u Subscription) već postoji. Koristi drugačiji.

### 3. Invalid JSON
```
Error: Unexpected token
```
**Rješenje:** Provjeri JSON sintaksu - zaboravljena/viška zareza, navodnici.

### 4. Invalid enum value
```
Error: Invalid value for enum
```
**Rješenje:** Koristi **točan** enum iz dokumentacije (case-sensitive!).

---

## 🎯 Quick Reference

| Model | Required Fields |
|-------|----------------|
| **User** | email, passwordHash, fullName, role |
| **ProviderProfile** | userId |
| **Category** | name |
| **Job** | title, description, userId, categoryId, status |
| **Offer** | amount, jobId, userId, status |
| **Review** | rating, fromUserId, toUserId |
| **Notification** | title, message, type, userId |
| **ChatRoom** | *(nema required)* |
| **ChatMessage** | content, senderId, roomId |
| **Subscription** | userId, plan, status |

---

## 💡 Pro Tips

1. **Kopiraj postojeći zapis:**
   - Klikni na zapis → kopiraj JSON
   - Promijeni ID-eve i required polja
   - Paste u CREATE

2. **Test sa Postman:**
   ```
   POST https://uslugar.api.oriph.io/api/admin/User
   Headers: Authorization: Bearer YOUR_TOKEN
   Body: {JSON iz primjera}
   ```

3. **Increment kredite:**
   ```json
   // Umjesto: "credits": 15
   // Samo dodaj novi broj
   {"credits": 20}
   ```

4. **Batch CREATE:**
   - Admin panel trenutno ne podržava batch
   - Koristi API direktno ili kreiraj skriptu

---

**Sretno s admin panelom!** 🚀

Ako ne radiš nešto, provjeri JSON sintaksu na [jsonlint.com](https://jsonlint.com/)

