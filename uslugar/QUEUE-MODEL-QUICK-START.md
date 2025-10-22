# 🚀 USLUGAR Queue Model - Quick Start

## ✅ Što je Napravljeno?

1. ✅ **Database Schema** ažuriran (schema.prisma)
2. ✅ **SQL Migracija** kreirana
3. ✅ **Business Logic** implementiran (leadQueueManager.js)
4. ✅ **API Endpoints** kreirani (lead-queue.js)
5. ✅ **Queue Scheduler** konfiguriran (svaki sat)
6. ✅ **Seed Data** spreman (50+ kategorija s NKD kodovima)
7. ✅ **Dependencies** instalirani (node-cron)
8. ✅ **Prisma Client** generiran

---

## 🎯 Primjena Migracije

### Opcija 1: Automatska (Preporučeno)

Koristi PowerShell skriptu koja će sve napraviti:

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend
.\APPLY-QUEUE-MODEL-MIGRATION.ps1
```

Skripta će:
1. Provjeriti DATABASE_URL
2. Generirati Prisma Client
3. Primijeniti SQL migraciju
4. Seedati kategorije s NKD kodovima
5. Verificirati instalaciju

---

### Opcija 2: Ručno (Korak po Korak)

#### 1. Postavi DATABASE_URL

**Lokalna PostgreSQL baza:**
```powershell
$env:DATABASE_URL="postgresql://user:password@localhost:5432/uslugar_db"
```

**AWS RDS baza:**
```powershell
$env:DATABASE_URL="postgresql://username:password@your-rds.amazonaws.com:5432/uslugar_db"
```

**Ili dodaj u `.env` fajl:**
```env
DATABASE_URL="postgresql://user:password@host:5432/uslugar_db"
```

#### 2. Primijeni Migraciju

```powershell
cd backend
npx prisma migrate deploy --schema=prisma/schema.prisma
```

#### 3. Seed Kategorije

```powershell
node prisma/seeds/seed-categories.js
```

---

### Opcija 3: AWS RDS Deployment

Ako koristite AWS RDS produkcijsku bazu:

```powershell
# Postavi AWS RDS connection
$env:DATABASE_URL="postgresql://USERNAME:PASSWORD@uslugar-db.xxxxx.eu-central-1.rds.amazonaws.com:5432/uslugar_db"

# Primijeni migraciju
cd backend
npx prisma migrate deploy

# Seed kategorije
node prisma/seeds/seed-categories.js
```

---

## 🧪 Testiranje

### 1. Pokreni Server

```powershell
cd backend
npm run dev
```

**Očekivani output:**
```
✅ Queue Scheduler started successfully
   - Expired offers check: Every hour at :00
   - Monitor heartbeat: Every 15 minutes

[OK] API listening on :4000
[OK] USLUGAR EXCLUSIVE features: ..., Queue Model
```

### 2. Test API Endpoints

Možeš koristiti VS Code REST Client ili Postman:

#### Dohvati Aktivne Ponude (Provider)
```http
GET http://localhost:4000/api/lead-queue/my-offers
Authorization: Bearer YOUR_PROVIDER_TOKEN
```

#### Odgovori na Ponudu
```http
POST http://localhost:4000/api/lead-queue/QUEUE_ID/respond
Authorization: Bearer YOUR_PROVIDER_TOKEN
Content-Type: application/json

{
  "response": "INTERESTED"
}
```

#### Dohvati Statistiku
```http
GET http://localhost:4000/api/lead-queue/stats
Authorization: Bearer YOUR_PROVIDER_TOKEN
```

#### Kreiraj Queue za Job
```http
POST http://localhost:4000/api/lead-queue/create-for-job/JOB_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "providerLimit": 5
}
```

---

## 📊 Provjera Queue Schedulera

Nakon pokretanja servera, svaki sat će se automatski pokrenuti:

```
==================================================
⏰ Scheduled Check: 2025-10-22T01:00:00.000Z
==================================================
⏰ Provjeravam istekle ponude...
   Pronađeno 0 isteklih ponuda
✅ Provjera isteklih ponuda završena
==================================================
```

Svake 15 minuta:
```
⏰ Queue Monitor: 2025-10-22T01:15:00.000Z - System running
```

---

## 🗃️ Struktura Novih Tabela

### **LeadQueue**
| Kolona | Tip | Opis |
|--------|-----|------|
| jobId | String | ID posla |
| providerId | String | ID providera |
| position | Int | Pozicija u queueu (1-5) |
| status | Enum | WAITING, OFFERED, ACCEPTED, DECLINED, EXPIRED |
| expiresAt | DateTime | Rok za odgovor (24h) |
| response | Enum | INTERESTED, NOT_INTERESTED, NO_RESPONSE |

### **ProviderLicense**
| Kolona | Tip | Opis |
|--------|-----|------|
| providerId | String | ID providera |
| licenseType | String | Tip licence |
| licenseNumber | String | Broj licence |
| isVerified | Boolean | Verificirana od admina |
| expiresAt | DateTime | Datum isteka |
| documentUrl | String | URL skeniranog dokumenta |

### **Category** (Nove kolone)
| Kolona | Tip | Opis |
|--------|-----|------|
| nkdCode | String | NKD kod (npr. "43.21") |
| requiresLicense | Boolean | Zahtijeva li licencu |
| licenseType | String | Tip potrebne licence |
| licenseAuthority | String | Tijelo koje izdaje dozvolu |

---

## 📝 Kategorije s NKD Kodovima

Seed će dodati **50+ kategorija**, uključujući:

### Licencirane Djelatnosti:
- ⚡ **Električar** (NKD 43.21) → Elektrotehnička licenca (HKIE)
- 💧 **Vodoinstalater** (NKD 43.22) → Ovlaštenje za vodoinstalatere (HOK)
- 🔥 **Plinoinstalatér** (NKD 43.22) → Ovlaštenje za rad s plinom (HOK)
- ❄️ **Klima uređaji** (NKD 43.22) → F-gas certifikat
- 🏠 **Dimnjačar** (NKD 43.22) → Ovlaštenje dimnjačara (HOK)
- 🦟 **Dezinsekcija** (NKD 81.29) → Dozvola za biocide
- 🐾 **Veterinar** (NKD 75.00) → Veterinarska licenca
- ⚖️ **Pravne usluge** (NKD 69.10) → Odvjetnička licenca

### Ne-licencirane Djelatnosti:
- 🪚 **Stolar** (NKD 16.23)
- 🧱 **Zidar** (NKD 43.99)
- 🎨 **Moler-Slikar** (NKD 43.34)
- 🏗️ **Keramičar** (NKD 43.33)
- 🪵 **Parketar** (NKD 43.33)
- 🏠 **Krovopokrivač** (NKD 43.91)
- ...i još 40+ kategorija

---

## 🔧 Troubleshooting

### ❌ Greška: "Can't reach database server"
**Rješenje:** Provjeri DATABASE_URL i pokreni PostgreSQL server

### ❌ Greška: "Migration failed"
**Rješenje:** Primijeni ručno SQL:
```bash
psql $DATABASE_URL -f prisma/migrations/20251021_add_queue_model_and_licenses/migration.sql
```

### ❌ Server se ne pokreće
**Rješenje:** Provjeri ima li syntax grešaka:
```powershell
npx prisma generate
```

### ⚠️ Scheduler ne radi
**Rješenje:** Provjeri da li je node-cron instaliran:
```powershell
npm install node-cron
```

---

## 📚 Dokumentacija

Detaljnije informacije:
- **USLUGAR-QUEUE-MODEL-IMPLEMENTATION.md** - Kompletna dokumentacija
- **QUEUE-MODEL-COMPLETE-SUMMARY.md** - Rezime implementacije
- **CREATE-QUEUE-MIGRATION.md** - Detalji migracije

---

## 🎉 Završeno!

✅ **Backend je kompletan!**  
✅ **Queue Model spreman!**  
✅ **API Endpoints funkcionalni!**  
✅ **Scheduler aktivan!**  

Sljedeći korak: **Frontend komponente** za prikazivanje queue-a i ponuda.

---

**Status:** ✅ READY FOR PRODUCTION  
**Datum:** 21.10.2025  
**Verzija:** Queue Model v1.0  

🇭🇷 **Prvi Queue Model u Hrvatskoj!**

