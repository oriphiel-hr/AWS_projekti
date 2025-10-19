# 🔍 Admin Panel - WHERE & INCLUDE Guide

## 📋 Pregled

U **Napredna pretraga** sekciji možeš koristiti:
- **WHERE** - za filtriranje zapisa (SQL WHERE klauzula)
- **INCLUDE** - za učitavanje povezanih relacija (JOIN)

---

## 🎯 WHERE - Filtriranje zapisa

### Osnovno filtriranje

#### Točna vrijednost
```json
{
  "role": "PROVIDER"
}
```
Vraća: Sve korisnike gdje je `role = PROVIDER`

#### Više polja (AND)
```json
{
  "role": "PROVIDER",
  "city": "Zagreb"
}
```
Vraća: Sve providere iz Zagreba

---

### Napredni operatori

#### `contains` - Traži substring
```json
{
  "email": {
    "contains": "@gmail.com"
  }
}
```
Vraća: Sve korisnike sa Gmail email-om

#### `startsWith` / `endsWith`
```json
{
  "fullName": {
    "startsWith": "Marko"
  }
}
```

#### `gt`, `gte`, `lt`, `lte` - Brojevi/datumi
```json
{
  "budgetMin": {
    "gte": 500
  }
}
```
Vraća: Poslovi sa budgetom ≥ 500

#### `in` - Jedna od vrijednosti
```json
{
  "status": {
    "in": ["OPEN", "IN_PROGRESS"]
  }
}
```
Vraća: Poslovi koji su OPEN ili IN_PROGRESS

#### `not` - Negacija
```json
{
  "status": {
    "not": "CANCELLED"
  }
}
```
Vraća: Svi poslovi osim CANCELLED

#### `isSet` - NULL/NOT NULL provjera
```json
{
  "parentId": {
    "not": null
  }
}
```
Vraća: Samo sub-kategorije (koje imaju parent)

---

## 🔗 INCLUDE - Učitavanje relacija

### Osnovno include

#### Jedan-prema-jedan (1:1)
```json
{
  "providerProfile": true
}
```
Na User modelu: Učitava provider profil ako postoji

#### Jedan-prema-mnogo (1:N)
```json
{
  "jobs": true
}
```
Na User modelu: Učitava sve poslove korisnika

#### Mnogo-prema-jedan (N:1)
```json
{
  "user": true,
  "category": true
}
```
Na Job modelu: Učitava korisnika i kategoriju

---

### Napredni include (nested)

#### Include sa nested relacijama
```json
{
  "user": true,
  "offers": {
    "include": {
      "user": true
    }
  }
}
```
Na Job modelu: Učitava user-a i sve ponude (sa njihovim user-ima)

#### Include sa filterom
```json
{
  "offers": {
    "where": {
      "status": "PENDING"
    }
  }
}
```
Na Job modelu: Učitava samo pending ponude

---

## 📊 Primjeri po modelima

### User

**WHERE primjeri:**
```json
// Svi provideri
{"role": "PROVIDER"}

// Verificirani korisnici
{"isVerified": true}

// Iz određenog grada
{"city": "Zagreb"}

// Gmail korisnici
{"email": {"contains": "@gmail.com"}}
```

**INCLUDE primjeri:**
```json
// Sa provider profilom
{"providerProfile": true}

// Sa svim poslovima
{"jobs": true}

// Sa ponudama
{"offers": true}

// Kompletan pregled
{
  "providerProfile": true,
  "jobs": true,
  "offers": true,
  "reviewsGiven": true
}
```

---

### Job

**WHERE primjeri:**
```json
// Otvoreni poslovi
{"status": "OPEN"}

// Hitni poslovi
{"urgency": "HIGH"}

// Poslovi u Zagrebu
{"city": "Zagreb"}

// Budget preko 500
{"budgetMin": {"gte": 500}}

// Poslovi sa sljedećih 7 dana
{
  "deadline": {
    "gte": "2025-10-19T00:00:00.000Z",
    "lte": "2025-10-26T23:59:59.999Z"
  }
}

// Mali hitni poslovi
{
  "jobSize": "SMALL",
  "urgency": {"in": ["HIGH", "URGENT"]}
}
```

**INCLUDE primjeri:**
```json
// Sa korisnikom i kategorijom
{
  "user": true,
  "category": true
}

// Sa svim ponudama
{"offers": true}

// Sa ponudama i njihovim providerima
{
  "offers": {
    "include": {
      "user": true
    }
  }
}

// Kompletan pregled
{
  "user": true,
  "category": true,
  "offers": {
    "include": {
      "user": {
        "include": {
          "providerProfile": true
        }
      }
    }
  }
}
```

---

### Offer

**WHERE primjeri:**
```json
// Pending ponude
{"status": "PENDING"}

// Ponude preko 300 EUR
{"amount": {"gte": 300}}

// Ponude koje se mogu pregovarati
{"isNegotiable": true}

// Brzi poslovi (≤ 2 dana)
{"estimatedDays": {"lte": 2}}
```

**INCLUDE primjeri:**
```json
// Sa poslom
{"job": true}

// Sa providerom
{"user": true}

// Kompletan pregled
{
  "job": {
    "include": {
      "user": true,
      "category": true
    }
  },
  "user": {
    "include": {
      "providerProfile": true
    }
  }
}
```

---

### Notification

**WHERE primjeri:**
```json
// Nepročitane notifikacije
{"isRead": false}

// Samo system notifikacije
{"type": "SYSTEM"}

// Notifikacije za određeni job
{"jobId": "cm2hs8kw70000w..."}

// Novije od 7 dana
{
  "createdAt": {
    "gte": "2025-10-12T00:00:00.000Z"
  }
}
```

**INCLUDE primjeri:**
```json
// Sa korisnikom
{"user": true}
```

---

### ChatRoom

**WHERE primjeri:**
```json
// Chat sobe sa job-om
{"jobId": {"not": null}}

// Sobe bez job-a
{"jobId": null}

// Po imenu
{"name": {"contains": "Vodoinstalater"}}
```

**INCLUDE primjeri:**
```json
// Sa participantima
{"participants": true}

// Sa porukama
{"messages": true}

// Sa job-om
{"job": true}

// Kompletan pregled
{
  "participants": true,
  "messages": {
    "take": 10,
    "orderBy": {"createdAt": "desc"}
  },
  "job": true
}
```

---

### Subscription

**WHERE primjeri:**
```json
// Aktivne pretplate
{"status": "ACTIVE"}

// Premium korisnici
{"plan": "PREMIUM"}

// Sa kreditima
{"credits": {"gt": 0}}

// Istječe sljedećih 30 dana
{
  "expiresAt": {
    "gte": "2025-10-19T00:00:00.000Z",
    "lte": "2025-11-19T00:00:00.000Z"
  }
}
```

**INCLUDE primjeri:**
```json
// Nema povezanih relacija
{}
```

---

## 🎓 Napredne WHERE tehnike

### Kombiniranje (AND)
```json
{
  "status": "OPEN",
  "urgency": "HIGH",
  "city": "Zagreb"
}
```

### OR operator
```json
{
  "OR": [
    {"city": "Zagreb"},
    {"city": "Split"}
  ]
}
```

### NOT operator
```json
{
  "NOT": {
    "status": "CANCELLED"
  }
}
```

### Nested filteri
```json
{
  "user": {
    "role": "PROVIDER",
    "isVerified": true
  }
}
```

### Text search (case-insensitive)
```json
{
  "title": {
    "contains": "vodoinstalater",
    "mode": "insensitive"
  }
}
```

### Range filteri
```json
{
  "budgetMin": {"gte": 200},
  "budgetMax": {"lte": 1000},
  "urgency": {"in": ["HIGH", "URGENT"]}
}
```

---

## 💡 Pro Tips

### 1. Kombiniraj WHERE i INCLUDE
```json
// WHERE
{"status": "OPEN", "city": "Zagreb"}

// INCLUDE
{"user": true, "offers": true}
```
Rezultat: Otvoreni poslovi u Zagrebu sa user-ima i ponudama

### 2. Pagination sa filterima
- Postavi WHERE filter
- Koristi `skip` i `take` za stranice
- Pogledaj `total` za broj rezultata

### 3. Sortiraj rezultate (Napredna pretraga)
```json
// WHERE
{"status": "OPEN"}

// Dodaj orderBy u include (za nested)
{
  "offers": {
    "orderBy": {"createdAt": "desc"}
  }
}
```

### 4. Count agregacije
```json
// WHERE za brojanje
{
  "user": {
    "providerProfile": {
      "isNot": null
    }
  }
}
```
Vraća: Samo Job-ove od providera

---

## ⚠️ Česte greške

### Greška: Invalid JSON
```json
// ❌ Pogrešno - zaboravljen navodnik
{role: "PROVIDER"}

// ✅ Točno
{"role": "PROVIDER"}
```

### Greška: Unknown field
```json
// ❌ Polje ne postoji u modelu
{"nonExistentField": "value"}

// ✅ Provjeri schema.prisma za točna polja
{"role": "PROVIDER"}
```

### Greška: Invalid relation
```json
// ❌ Relacija ne postoji
{"invalidRelation": true}

// ✅ Provjeri schema.prisma za relacije
{"providerProfile": true}
```

---

## 🚀 Kako koristiti u admin panelu

### Korak 1: Otvori "Napredna pretraga"
Klikni na dropdown (ispod Create buttona)

### Korak 2: Klikni "Where primjer" ili "Include primjer"
Automatski se učita primjer za model

### Korak 3: Prilagodi JSON
Zamijeni vrijednosti sa onima koje trebaš

### Korak 4: Klikni "🔍 Primijeni pretragu"
Rezultati se filtriraju!

### Korak 5: Resetuj ako treba
Klikni "🔄 Resetuj filtere" za čistu tablicu

---

## 📚 Dodatni resursi

### Prisma WHERE dokumentacija:
https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting

### Prisma INCLUDE dokumentacija:
https://www.prisma.io/docs/concepts/components/prisma-client/select-fields#include-relations-and-select-relation-fields

---

**Sretno sa naprednim pretragama!** 🔍✨

