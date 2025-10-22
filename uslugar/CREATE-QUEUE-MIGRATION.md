# Kreiranje Queue Model Migracije

## 🚀 Koraci za Kreiranje Migracije

### 1. Instaliraj Node-cron (ako već nije)
```powershell
cd backend
npm install node-cron
```

### 2. Kreiraj Migraciju
```powershell
cd backend
npx prisma migrate dev --name add_queue_model_and_licenses --schema=prisma/schema.prisma
```

### 3. Seed Kategorije s NKD kodovima
```powershell
cd backend
node prisma/seeds/seed-categories.js
```

## 📝 Što Migracija Dodaje?

### Nove Tabele:
1. **ProviderLicense** - Licence pružatelja usluga
2. **LeadQueue** - Queue sistem za distribuciju leadova

### Novi Stupci u Postojećim Tabelama:

#### Category
- `nkdCode` (String?) - NKD kod djelatnosti
- `requiresLicense` (Boolean) - Zahtijeva li licencu
- `licenseType` (String?) - Tip licence
- `licenseAuthority` (String?) - Tijelo koje izdaje licencu

#### ProviderProfile
- `maxCategories` (Int) - Max broj kategorija (default 5)
- `nkdCodes` (String[]) - Lista NKD kodova koje pokriva

#### Job
- `leadQueue` - Relacija na LeadQueue[]

### Novi Enumovi:
- `LeadQueueStatus` (WAITING, OFFERED, ACCEPTED, DECLINED, EXPIRED, SKIPPED)
- `QueueResponse` (INTERESTED, NOT_INTERESTED, NO_RESPONSE)

## ✅ Provjera Migracije

Nakon migracije, provjeri:

```powershell
# Provjeri status
npx prisma migrate status --schema=prisma/schema.prisma

# Generiraj Prisma Client
npx prisma generate --schema=prisma/schema.prisma
```

## 🧪 Testiranje Novih Endpointa

### 1. Kreiraj Queue za Job
```http
POST http://localhost:4000/api/lead-queue/create-for-job/JOB_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "providerLimit": 5
}
```

### 2. Dohvati Aktivne Ponude (Provider)
```http
GET http://localhost:4000/api/lead-queue/my-offers
Authorization: Bearer PROVIDER_TOKEN
```

### 3. Odgovori na Ponudu
```http
POST http://localhost:4000/api/lead-queue/QUEUE_ID/respond
Authorization: Bearer PROVIDER_TOKEN
Content-Type: application/json

{
  "response": "INTERESTED"
}
```

### 4. Dohvati Queue Statistiku
```http
GET http://localhost:4000/api/lead-queue/stats
Authorization: Bearer PROVIDER_TOKEN
```

## 🔧 Ako Migracija Zakaže

### Reset Database (⚠️ SAMO ZA DEV!)
```powershell
npx prisma migrate reset --schema=prisma/schema.prisma
```

### Ili Primijeni Manualnu Migraciju
```powershell
npx prisma db push --schema=prisma/schema.prisma
```

## 📊 Provjera Queue Schedulera

Nakon pokretanja servera, trebali biste vidjeti:

```
⏰ Starting Queue Scheduler...
✅ Queue Scheduler started successfully
   - Expired offers check: Every hour at :00
   - Monitor heartbeat: Every 15 minutes
```

Svaki sat će se pokrenuti:
```
==================================================
⏰ Scheduled Check: 2025-10-21T...
==================================================
⏰ Provjeravam istekle ponude...
   Pronađeno X isteklih ponuda
✅ Provjera isteklih ponuda završena
==================================================
```

## 🚨 Troubleshooting

### Problem: Migracija pada zbog postojećih podataka
**Rješenje:** Dodaj default vrijednosti ili učini polja nullable

### Problem: node-cron nije instaliran
**Rješenje:**
```powershell
npm install node-cron
```

### Problem: Prisma Client nije generiran
**Rješenje:**
```powershell
npx prisma generate --schema=prisma/schema.prisma
```

### Problem: Server ne pokreće scheduler
**Rješenje:** Provjeri import u `src/server.js`:
```javascript
import { startQueueScheduler } from '../lib/queueScheduler.js'
```

## ✅ Finalna Provjera

1. ✅ Migracija uspješno primijenjena
2. ✅ Kategorije seedane s NKD kodovima
3. ✅ Server pokrenut s Queue Schedulerom
4. ✅ API endpoints odgovaraju
5. ✅ Cron job radi svaki sat

---

**Status:** ✅ READY FOR MIGRATION  
**Datum:** 21.10.2025  
**Verzija:** Queue Model v1.0

