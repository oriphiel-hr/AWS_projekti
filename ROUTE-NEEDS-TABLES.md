# ⚠️ VAŽNO: Route zahtijeva tablice u bazi!

## Problem:
Route `/api/documentation` koristi Prisma query:

```javascript
const categories = await prisma.documentationCategory.findMany({
  where: { isActive: true },
  include: { features: { ... } }
});
```

**Ako tablice ne postoje:**
- Route će baciti error
- Možda vraća 404 ili 500 grešku
- Prisma ne može naći tablice

## Provjera:

### 1. Provjeri da li su migracije primijenjene

**Prisma workflow:**
👉 https://github.com/oriphiel/AWS_projekti/actions

**Traži:**
- "Prisma - Build/Push & Migrate (ECR→ECS)" workflow
- Provjeri da li je završio sa zelenom kvačicom
- Provjeri logs da li su migracije primijenjene

**Provjeri da li postoji migracija:**
```powershell
ls uslugar/backend/prisma/migrations/*documentation*
```

### 2. Provjeri da li je seed pokrenut

**Seed dokumentacije:**
- `prisma/seed.js` poziva `seed-documentation.js`
- Seed dodaje kategorije i features u bazu
- Ako seed nije pokrenut → tablice postoje ali su prazne

### 3. Moguće greške:

#### A. Tablice ne postoje
- **Uzrok:** Migracije nisu primijenjene
- **Rješenje:** Pokreni Prisma workflow

#### B. Tablice postoje ali su prazne
- **Uzrok:** Seed nije pokrenut
- **Rješenje:** Pokreni Prisma seed

#### C. Prisma client nije generiran
- **Uzrok:** `npx prisma generate` nije pokrenut
- **Rješenje:** Workflow trebao bi to raditi automatski

### 4. Rješenje:

**Korak 1: Pokreni Prisma workflow**
- Migracije će kreirati tablice
- Seed će dodati podatke

**Korak 2: Provjeri CloudWatch logs**
- Log group: `/ecs/uslugar/prisma`
- Provjeri da li su migracije uspješne

**Korak 3: Test endpoint**
- Nakon što su migracije i seed završeni
- Pokušaj ponovo: `curl https://uslugar.oriph.io/api/documentation`

---

## Preporuka:

**Najvjerojatniji uzrok:** Tablice ne postoje u bazi!

**Rješenje:** Pokreni Prisma workflow (migracije + seed) PRIJE nego što testiraš backend route!

