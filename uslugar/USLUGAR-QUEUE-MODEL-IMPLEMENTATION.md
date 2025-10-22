# USLUGAR QUEUE MODEL - Implementacija prema uvida iz analize

## 📋 Pregled

Implementirane su ključne izmjene u `schema.prisma` na osnovu analize konkurentske platforme Trebam.hr i identificiranih problema.

---

## 🔑 Ključne Izmjene

### 1. **NKD Kodovi i Licencirane Djelatnosti** ✅

#### Problem iz analize:
> "Ti možeš provjeriti NKD i znati da li tvrtka zadovoljava uvjete"
> "Kako se zaštititi kad se radi o licenciranim"

#### Rješenje - Category Model:
```prisma
model Category {
  // ... postojeća polja
  
  // USLUGAR EXCLUSIVE - NKD i licence
  nkdCode           String? // NKD kod djelatnosti (npr. "43.21" za električne instalacije)
  requiresLicense   Boolean @default(false) // Zahtijeva li djelatnost licencu
  licenseType       String? // Tip licence (npr. "Elektrotehnička licenca")
  licenseAuthority  String? // Tijelo koje izdaje dozvolu (npr. "Hrvatska komora inženjera")
}
```

**Prednosti:**
- ✅ Automatska provjera NKD kodova
- ✅ Znamo koje djelatnosti zahtijevaju licence
- ✅ Transparentno za providere i klijente

---

### 2. **Limit Kategorija za Providere** ✅

#### Problem iz analize:
> "Koliko smijem dopustiti da izvođač radova unese kategorija"

#### Rješenje - ProviderProfile Model:
```prisma
model ProviderProfile {
  // ... postojeća polja
  
  // USLUGAR EXCLUSIVE - Licence i limiti kategorija
  maxCategories  Int           @default(5) // Max broj kategorija koje smije odabrati
  licenses       ProviderLicense[] // Licence koje posjeduje
  nkdCodes       String[]      // NKD kodovi koje firma pokriva
}
```

**Preporuka:**
- **Početni limit: 5 kategorija** (može se prilagoditi po pretplati)
- **Premium korisnici:** do 10 kategorija
- **Pravilo:** Ako kategorija zahtijeva licencu, provider mora uploadati dokaz

---

### 3. **Provider License Model** ✅

#### Novi model za praćenje licenci:
```prisma
model ProviderLicense {
  id              String          @id @default(cuid())
  provider        ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)
  providerId      String
  licenseType     String          // Tip licence (npr. "Elektrotehnička licenca")
  licenseNumber   String          // Broj dozvole
  issuingAuthority String         // Tijelo koje je izdalo
  issuedAt        DateTime        // Datum izdavanja
  expiresAt       DateTime?       // Datum isteka (ako vrijedi)
  documentUrl     String?         // URL skeniranog dokumenta
  isVerified      Boolean         @default(false) // Verificirana od strane admina
  verifiedAt      DateTime?
  verifiedBy      String?         // Admin koji je verificirao
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([providerId])
  @@index([isVerified])
}
```

**Workflow:**
1. Provider uploada sliku/PDF licence
2. Admin verificira dokument
3. Sistem automatski prati istek licenci
4. Notifikacije 30 dana prije isteka

---

### 4. **QUEUE MODEL za Leadove** 🚀

#### Problem iz analize:
> "Ali jedan lead na 6 izvođača nije pošteno"
> "Trebao bi biti neki queue. Ako se ne dogovori s prvim ide sljedeći"
> "Ako ne uspije se dogovoriti s tri izvođača nešto ne valja s klijentom"

#### Rješenje - LeadQueue Model:
```prisma
model LeadQueue {
  id              String    @id @default(cuid())
  job             Job       @relation("JobQueue", fields: [jobId], references: [id], onDelete: Cascade)
  jobId           String
  providerId      String    // Provider u queueu
  position        Int       // Pozicija u queueu (1, 2, 3...)
  status          LeadQueueStatus @default(WAITING)
  offeredAt       DateTime? // Kada je lead ponuđen provideru
  respondedAt     DateTime? // Kada je provider odgovorio
  expiresAt       DateTime? // Rok za odgovor (npr. 24h)
  response        QueueResponse? // Odgovor providera
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([jobId, providerId])
  @@index([jobId, position])
  @@index([providerId, status])
  @@index([status])
}

enum LeadQueueStatus {
  WAITING     // Čeka svoj red
  OFFERED     // Ponuđen provideru (trenutni u redu)
  ACCEPTED    // Provider prihvatio
  DECLINED    // Provider odbio
  EXPIRED     // Isteklo vrijeme za odgovor
  SKIPPED     // Preskočen (išli na sljedećeg)
}

enum QueueResponse {
  INTERESTED      // Zainteresiran za lead
  NOT_INTERESTED  // Nije zainteresiran
  NO_RESPONSE     // Nije odgovorio
}
```

---

## 🎯 Kako Queue Model Radi?

### **Scenario: Klijent objavljuje posao**

1. **Kreiranje Queue**
   ```javascript
   // Pronađi najbolje providere (matching kategorija, ocjena, lokacija)
   const topProviders = await findMatchingProviders(job, { limit: 5 })
   
   // Kreiraj queue za svakog providera
   for (let i = 0; i < topProviders.length; i++) {
     await prisma.leadQueue.create({
       data: {
         jobId: job.id,
         providerId: topProviders[i].id,
         position: i + 1,
         status: i === 0 ? 'OFFERED' : 'WAITING'
       }
     })
   }
   ```

2. **Ponuda prvom provideru**
   - Provider #1 dobiva notifikaciju
   - Ima 24h da odgovori
   - Može platiti kredit i prihvatiti lead

3. **Provider odbije ili istekne vrijeme**
   ```javascript
   // Označimo trenutnog kao EXPIRED/DECLINED
   await prisma.leadQueue.update({
     where: { id: currentQueue.id },
     data: { status: 'DECLINED' }
   })
   
   // Ponudimo sljedećem u redu
   const nextInQueue = await prisma.leadQueue.findFirst({
     where: { jobId, status: 'WAITING' },
     orderBy: { position: 'asc' }
   })
   
   if (nextInQueue) {
     await prisma.leadQueue.update({
       where: { id: nextInQueue.id },
       data: { 
         status: 'OFFERED',
         offeredAt: new Date(),
         expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // +24h
       }
     })
   }
   ```

4. **Limit od 3 providera**
   - Ako 3 providera odbije, lead se označava kao problematičan
   - Klijent dobiva notifikaciju da revidira zahtjev

---

## 📊 Usporedba: Trebam.hr vs Uslugar

| Aspekt | Trebam.hr | Uslugar (EXCLUSIVE) |
|--------|-----------|---------------------|
| **Distribucija leadova** | 1 → 6+ providera | 1 → 1 (queue) |
| **Cijena po leadu** | Fiksna | Dinamička (10-20 kredita) |
| **Kvaliteta leadova** | Upitna (fantomski klijenti) | Verificirani klijenti |
| **ROI za providere** | Nizak | Visok |
| **Provjera licenci** | ❌ | ✅ |
| **NKD validacija** | ❌ | ✅ |
| **Limit kategorija** | ❌ | ✅ (5-10) |

---

## 🔧 Sljedeći Koraci - Implementacija

### 1. **Migracija Baze** ✅
```bash
cd backend
npx prisma migrate dev --name add-queue-model-and-licenses
```

### 2. **Backend API Endpoints**

#### Kreiraj Queue za Job
```javascript
// POST /api/jobs/:id/queue
router.post('/jobs/:id/queue', async (req, res) => {
  const { id } = req.params
  const job = await prisma.job.findUnique({ where: { id } })
  
  // Pronađi top 5 providera
  const providers = await findTopProviders(job)
  
  // Kreiraj queue
  const queue = await createLeadQueue(job.id, providers)
  
  // Ponudi prvom provideru
  await offerToNextProvider(queue[0])
  
  res.json({ success: true, queue })
})
```

#### Provider odgovara na ponudu
```javascript
// POST /api/lead-queue/:id/respond
router.post('/lead-queue/:id/respond', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { response } = req.body // 'INTERESTED' | 'NOT_INTERESTED'
  
  const queueItem = await prisma.leadQueue.findUnique({ where: { id } })
  
  if (response === 'INTERESTED') {
    // Provider kupuje lead
    await purchaseLead(queueItem.jobId, req.user.id)
    await prisma.leadQueue.update({
      where: { id },
      data: { status: 'ACCEPTED', respondedAt: new Date() }
    })
  } else {
    // Provider odbija, idi na sljedećeg
    await prisma.leadQueue.update({
      where: { id },
      data: { status: 'DECLINED', respondedAt: new Date() }
    })
    await offerToNextInQueue(queueItem.jobId)
  }
  
  res.json({ success: true })
})
```

### 3. **Frontend Components**

#### Provider Dashboard - Queue Notifikacije
```jsx
// LeadQueueNotification.jsx
function LeadQueueNotification({ queueItem }) {
  const { job, expiresAt } = queueItem
  const timeLeft = calculateTimeLeft(expiresAt)
  
  return (
    <div className="lead-queue-card">
      <h3>{job.title}</h3>
      <p>Cijena: {job.leadPrice} kredita</p>
      <p>Vrijeme za odgovor: {timeLeft}</p>
      
      <button onClick={() => respondToLead(queueItem.id, 'INTERESTED')}>
        Prihvati Lead (Plati {job.leadPrice} kredita)
      </button>
      
      <button onClick={() => respondToLead(queueItem.id, 'NOT_INTERESTED')}>
        Odbij
      </button>
    </div>
  )
}
```

#### Admin Panel - License Verification
```jsx
// LicenseVerification.jsx
function LicenseVerification() {
  const [pendingLicenses, setPendingLicenses] = useState([])
  
  useEffect(() => {
    fetchPendingLicenses()
  }, [])
  
  const verifyLicense = async (licenseId, approved) => {
    await api.post(`/admin/licenses/${licenseId}/verify`, { approved })
    fetchPendingLicenses()
  }
  
  return (
    <div className="license-verification">
      {pendingLicenses.map(license => (
        <div key={license.id} className="license-card">
          <h4>{license.licenseType}</h4>
          <p>Broj: {license.licenseNumber}</p>
          <img src={license.documentUrl} alt="Licenca" />
          
          <button onClick={() => verifyLicense(license.id, true)}>
            Odobri
          </button>
          <button onClick={() => verifyLicense(license.id, false)}>
            Odbij
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 🎨 Business Logika - Pravila

### **Cijena Leada (Dinamička)**
```javascript
function calculateLeadPrice(job) {
  let basePrice = 10 // kredita
  
  // Urgentnost
  if (job.urgency === 'URGENT') basePrice += 5
  if (job.urgency === 'HIGH') basePrice += 3
  
  // Veličina posla
  if (job.jobSize === 'LARGE') basePrice += 3
  if (job.jobSize === 'EXTRA_LARGE') basePrice += 5
  
  // Verificiran klijent
  if (job.clientVerified) basePrice += 2
  
  // AI kvaliteta score
  if (job.qualityScore > 80) basePrice += 3
  
  return Math.min(basePrice, 20) // Max 20 kredita
}
```

### **Matching Providera**
```javascript
async function findTopProviders(job, limit = 5) {
  const providers = await prisma.providerProfile.findMany({
    where: {
      categories: {
        some: { id: job.categoryId }
      },
      isAvailable: true,
      user: {
        city: job.city // Ista lokacija
      }
    },
    include: {
      user: true,
      licenses: true
    }
  })
  
  // Filtriraj po licencama ako je potrebno
  const category = await prisma.category.findUnique({ 
    where: { id: job.categoryId } 
  })
  
  let validProviders = providers
  
  if (category.requiresLicense) {
    validProviders = providers.filter(p => 
      p.licenses.some(l => 
        l.licenseType === category.licenseType && 
        l.isVerified &&
        (!l.expiresAt || l.expiresAt > new Date())
      )
    )
  }
  
  // Sortiraj po ocjeni
  validProviders.sort((a, b) => b.ratingAvg - a.ratingAvg)
  
  return validProviders.slice(0, limit)
}
```

---

## 📈 Očekivani Rezultati

### **Za Providere:**
- ✅ **Više kvalitetnih leadova** - nema konkurencije sa 6+ drugih providera
- ✅ **Transparentnost** - znaju svoju poziciju u queueu
- ✅ **Bolji ROI** - krediti se troše samo na ekskluzivne leadove
- ✅ **Fer sistem** - najbolji provideri dobivaju prioritet

### **Za Klijente:**
- ✅ **Brži odgovori** - provider zna da je ekskluzivan lead
- ✅ **Kvalitetniji provideri** - samo oni s licencama (ako je potrebno)
- ✅ **Manje spam poziva** - samo 1 provider kontaktira

### **Za Platformu:**
- ✅ **Diferencijacija** - jedinstveni model u Hrvatskoj
- ✅ **Veće zadovoljstvo** - i providera i klijenata
- ✅ **Manje pritužbi** - nema "fantomskih klijenata"

---

## 🚀 Deployment

### 1. **Migracija Produkcijske Baze**
```bash
# Backup postojeće baze
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Primijeni migraciju
cd backend
npx prisma migrate deploy
```

### 2. **Seed Početne Kategorije s NKD**
```javascript
// prisma/seeds/categories-nkd.js
const categoriesWithNKD = [
  {
    name: 'Električar',
    nkdCode: '43.21',
    requiresLicense: true,
    licenseType: 'Elektrotehnička licenca',
    licenseAuthority: 'Hrvatska komora inženjera elektrotehnike'
  },
  {
    name: 'Vodoinstalater',
    nkdCode: '43.22',
    requiresLicense: true,
    licenseType: 'Ovlaštenje za vodoinstalatere',
    licenseAuthority: 'Hrvatska komora obrtnika'
  },
  {
    name: 'Stolar',
    nkdCode: '16.23',
    requiresLicense: false
  },
  {
    name: 'Keramičar',
    nkdCode: '43.33',
    requiresLicense: false
  },
  // ... ostale kategorije iz Trebam.hr
]
```

---

## 📝 TODO Lista

- [ ] Implementirati queue API endpoints
- [ ] Kreirati cron job za expiry check (svaki sat)
- [ ] Frontend komponente za queue notifikacije
- [ ] Admin panel za verifikaciju licenci
- [ ] Email notifikacije za queue ponude
- [ ] SMS notifikacije (opciono, za hitne poslove)
- [ ] Analytics dashboard za queue performance
- [ ] A/B testiranje: 24h vs 12h timeout
- [ ] Mobile app push notifikacije

---

## 🎯 Konkurentska Prednost

> **"Zapravo je najbolje da za početak kopiram djelatnost koje nudi Trebam hr. To se ne može znati kopiranjem?"**

**Odgovor:** DA, možemo kopirati kategorije, ali **sa boljim modelom**:

1. ✅ **NKD validacija** - Trebam.hr nema
2. ✅ **Queue sistem** - Trebam.hr broadcast na 6+
3. ✅ **Provjera licenci** - Trebam.hr ne provjerava
4. ✅ **Verificirani klijenti** - Trebam.hr ima problema s fantomskim klijentima
5. ✅ **Transparentne cijene** - Trebam.hr skriva pricing

---

## 📞 Kontakt za Pitanja

Za tehničke detalje i implementaciju, kontaktirajte development tim.

**Verzija:** 1.0  
**Datum:** 21.10.2025  
**Status:** ✅ Schema Ready - Čeka Backend Implementation

---

*USLUGAR EXCLUSIVE - Jedinstveni Queue Model u Hrvatskoj* 🇭🇷

