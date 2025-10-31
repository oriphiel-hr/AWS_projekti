# 💰 Pay-Per-Contact Model - Implementacija

## 📋 Pregled

Implementiran **Pay-per-contact** model gdje provideri plaćaju lead u dva koraka:
1. **Kupovina leada** - plaćanje za ekskluzivni pristup (vidljivo: naslov, opis, lokacija, AI score)
2. **Otključavanje kontakta** - dodatno plaćanje (1 kredit) za email i telefon klijenta

---

## ✅ Što je implementirano

### **Backend:**

1. **Prisma Schema**
   - ✅ Dodano `contactUnlocked: Boolean` u `LeadPurchase` model
   - ✅ Dodano `contactUnlockedAt: DateTime?` za tracking

2. **Migration**
   - ✅ Kreirana migration: `20250131000000_add_contact_unlocked`
   - ✅ Backward compatibility: postojeći leadovi automatski dobivaju `contactUnlocked = true`

3. **Lead Service (`lead-service.js`)**
   - ✅ `purchaseLead()` - NIJE otključava kontakt automatski
   - ✅ `unlockContact()` - Nova funkcija za otključavanje kontakta (1 kredit)
   - ✅ `getAvailableLeads()` - Skrije kontakt osim ako je otključan
   - ✅ `getMyLeads()` - Skrije kontakt ako nije otključan

4. **API Routes (`exclusive-leads.js`)**
   - ✅ `POST /exclusive/leads/:jobId/purchase` - Kupovina leada (bez kontakta)
   - ✅ `POST /exclusive/leads/:jobId/unlock-contact` - Otključavanje kontakta (1 kredit)

### **Frontend:**

5. **API Client (`api/exclusive.js`)**
   - ✅ Dodana `unlockContact(jobId)` funkcija

6. **Lead Marketplace (`LeadMarketplace.jsx`)**
   - ✅ Ažurirana poruka u purchase konfirmaciji
   - ✅ Info box objašnjava pay-per-contact model
   - ✅ Disclaimer o otključavanju kontakta

7. **My Leads (`MyLeads.jsx`)**
   - ✅ Prikazuje status kontakta (otključan/neotključan)
   - ✅ Gumb "🔓 Otključaj kontakt (1 kredit)" ako kontakt nije otključan
   - ✅ Prikazuje kontakt informacije samo ako je otključan
   - ✅ Vizualna razlika (žuta vs zelena pozadina)

---

## 🔄 Flow

### **Prije kupovine:**
1. Provider vidi lead u marketplace-u
2. **Kontakt je skriven** (email, phoneNumber su `undefined`)
3. Provider vidi: naslov, opis, lokacija, budget, AI score

### **Nakon kupovine (prije unlock-a):**
1. Provider kupuje lead → `LeadPurchase` kreiran s `contactUnlocked: false`
2. Lead se prikazuje u "Moji Leadovi"
3. **Kontakt je još uvijek skriven**
4. Prikazuje se gumb "🔓 Otključaj kontakt (1 kredit)"

### **Nakon unlock-a:**
1. Provider klikne "Otključaj kontakt"
2. Sistem naplaćuje 1 kredit
3. `LeadPurchase.contactUnlocked = true`
4. **Kontakt je sada vidljiv** (email, phoneNumber)
5. Gumb nestaje, prikazuje se puni kontakt

---

## 💰 Cijene

| Akcija | Cijena | Opis |
|--------|--------|------|
| **Kupovina leada** | X kredita | Ekskluzivni pristup leadu (vidljivo: naslov, opis, lokacija) |
| **Otključavanje kontakta** | 1 kredit | Email i telefon klijenta |

**Primjer:**
- Lead cijena: 10 kredita
- Unlock kontakt: +1 kredit
- **Ukupno: 11 kredita** za puni pristup

---

## 📊 Database Schema

```prisma
model LeadPurchase {
  // ... existing fields
  contactUnlocked  Boolean   @default(false) // Pay-per-contact: je li kontakt otključan
  contactUnlockedAt DateTime? // Kada je kontakt otključan
}
```

---

## 🎯 API Endpoints

### **Otključaj kontakt**
```http
POST /api/exclusive/leads/:jobId/unlock-contact
Authorization: Bearer <token>

Response:
{
  "success": true,
  "purchase": { ... },
  "job": {
    "id": "...",
    "title": "...",
    "user": {
      "fullName": "...",
      "email": "...",      // ✅ Sada vidljivo
      "phoneNumber": "..." // ✅ Sada vidljivo
    }
  },
  "creditsRemaining": 5,
  "message": "Contact unlocked successfully!"
}
```

---

## 🔒 Sigurnost

- ✅ Provider mora prvo kupiti lead prije unlock-a
- ✅ Provjera autorizacije (samo vlasnik LeadPurchase može unlock-ati)
- ✅ Provjera kredita prije unlock-a
- ✅ Idempotentnost: ako je kontakt već otključan, vraća postojeći lead

---

## ✅ Verifikacija

### **Test Scenariji:**

1. **Kupovina leada:**
   - [ ] Kontakt je skriven nakon kupovine
   - [ ] Poruka objašnjava da treba otključati kontakt

2. **Otključavanje kontakta:**
   - [ ] Gumb se prikazuje u MyLeads ako kontakt nije otključan
   - [ ] Naplaćuje se 1 kredit
   - [ ] Kontakt postaje vidljiv nakon unlock-a
   - [ ] Gumb nestaje nakon unlock-a

3. **Edge Cases:**
   - [ ] Ne može unlock-ati lead koji nije kupljen
   - [ ] Ne može unlock-ati ako nema kredita
   - [ ] Dupli unlock vraća postojeći lead (bez naplate)

---

**Status:** ✅ Implementirano i spremno za testiranje!

