# ✅ Status: API Endpointi Premješteni u TechnicalDetails

## Što je napravljeno:

### ✅ 1. API endpointi pomaknuti iz `details` u `technicalDetails`
   - "Upravljanje korisnicima" ✅
   - "Upravljanje pružateljima" ✅
   - "Statistike platforme" ✅
   - "Upravljanje kategorijama" ✅
   - "Upravljanje pretplatama" ✅

### ✅ 2. TechnicalDetails dodano za:
   - "Upravljanje korisnicima" ✅
   - "Upravljanje pružateljima" ✅
   - "Statistike platforme" ✅
   - "Grafički prikaz statistika" ✅
   - "Upravljanje kategorijama" ✅
   - "Upravljanje pravnim statusima" ✅
   - "Upravljanje poslovima" ✅
   - "Upravljanje ponudama" ✅

### ⏳ Preostalo za dodati technicalDetails:
   - "Admin upravljanje recenzijama"
   - "Upravljanje notifikacijama"
   - "Upravljanje chat sobama"
   - "Moderacija sadržaja"
   - "Upravljanje transakcijama kredita"
   - "Admin odobravanje refund-a"
   - "Admin upravljanje queue sustavom"
   - "Upravljanje ROI statistikama"
   - "Upravljanje licencama"
   - "Verificiranje licenci od strane admina"
   - "Upravljanje verifikacijama klijenata"
   - "Dokumenti za verifikaciju"
   - "Admin reset SMS pokušaja"
   - "KYC Metrike"
   - "Provider Approvals"
   
   + sve javne funkcionalnosti

## Format za dodavanje:

```javascript
technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/[Name].jsx\`
- **Route:** \`/admin/[route]\`
- **State management:** useState, useEffect hooks

### Backend:
- **Route:** \`uslugar/backend/src/routes/[file].js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za [Model] model

### Baza podataka:
- **Tablice:** \`[Table1]\`, \`[Table2]\`
- **Relacije:** [Relations]
- **Indeksi:** \`@@index([field])\`

### API pozivi:
- \`GET /api/[endpoint]\` - [Description]
- \`POST /api/[endpoint]\` - Body: \`{ [fields] }\`
`
```

---

**Napomena:** Sve funkcionalnosti trebaju imati `technicalDetails` - to je vidljivo samo u admin dokumentaciji.

