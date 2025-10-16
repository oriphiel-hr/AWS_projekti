# Uslugar - Transformacija u trebam.hr

## Pregled promjena

Ovaj projekt je transformiran iz osnovnog Uslugar-a u funkcionalnu trebam.hr platformu s sljedećim funkcionalnostima:

### ✅ Implementirane funkcionalnosti

1. **Poboljšana baza podataka**
   - Dodana geolokacija (latitude, longitude)
   - Dodana polja za slike i portfolio
   - Dodane specijalizacije pružatelja
   - Dodani modeli za notifikacije, chat, pretplate
   - Hijerarhijske kategorije

2. **Upload funkcionalnost**
   - Multer za upload slika
   - Podrška za više slika
   - Validacija tipova datoteka
   - Statičko serviranje datoteka

3. **Moderne UI komponente**
   - JobCard - kartica za prikaz poslova
   - JobForm - forma za objavljivanje poslova
   - ProviderCard - kartica za prikaz pružatelja
   - Responsive dizajn
   - Napredni filteri

4. **Sustav notifikacija**
   - Email notifikacije
   - In-app notifikacije
   - Notifikacije za nove poslove, ponude, prihvaćene ponude

5. **Napredne funkcionalnosti**
   - Geolokacija poslova
   - Hitnost i veličina posla
   - Rok izvršenja
   - Pregovaranje o cijeni
   - Specijalizacije pružatelja

## Postupak pokretanja

### 1. Backend setup

```bash
cd uslugar/backend

# Instaliraj dependencies
npm install

# Kopiraj env.example u .env i uredi postavke
cp env.example .env

# Uredi .env datoteku s vašim postavkama baze podataka
# DATABASE_URL="postgresql://username:password@localhost:5432/uslugar_db?schema=public"

# Generiraj Prisma client
npx prisma generate

# Pokreni migracije
npx prisma migrate dev

# Pokreni backend
npm run dev
```

### 2. Frontend setup

```bash
cd uslugar/frontend

# Instaliraj dependencies
npm install

# Pokreni development server
npm run dev
```

### 3. Baza podataka

Potrebna je PostgreSQL baza podataka. Možete koristiti:
- Lokalnu PostgreSQL instalaciju
- Docker container
- Cloud bazu (Supabase, Railway, itd.)

## Konfiguracija

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/uslugar_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:5173,https://uslugar.oriph.io"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Server
PORT="4000"
NODE_ENV="development"
```

## API Endpoints

### Osnovni endpoints
- `GET /api/health` - Health check
- `POST /api/auth/register` - Registracija
- `POST /api/auth/login` - Prijava

### Poslovi
- `GET /api/jobs` - Lista poslova s filterima
- `POST /api/jobs` - Kreiranje posla
- `POST /api/jobs/:jobId/accept/:offerId` - Prihvaćanje ponude

### Ponude
- `POST /api/offers` - Kreiranje ponude
- `GET /api/offers/job/:jobId` - Ponude za posao

### Pružatelji
- `GET /api/providers/:userId` - Profil pružatelja
- `PUT /api/providers/me` - Ažuriranje profila

### Upload
- `POST /api/upload/single` - Upload jedne slike
- `POST /api/upload/multiple` - Upload više slika
- `DELETE /api/upload/:filename` - Brisanje datoteke

### Kategorije
- `GET /api/categories` - Lista kategorija
- `POST /api/categories` - Kreiranje kategorije

### Notifikacije
- `GET /api/notifications` - Korisničke notifikacije
- `PUT /api/notifications/:id/read` - Označavanje kao pročitano
- `GET /api/notifications/count` - Broj nepročitanih

## Funkcionalnosti koje treba implementirati

### Faza 2 (Prioritet 2)
- [ ] Chat sustav (Socket.io)
- [ ] Geolokacijsko filtriranje
- [ ] Napredni search
- [ ] Real-time notifikacije

### Faza 3 (Prioritet 3)
- [ ] Freemium model
- [ ] Payment integracija
- [ ] Kalendar dostupnosti
- [ ] Mobile app

## Struktura projekta

```
uslugar/
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── auth.js
│   │   │   ├── prisma.js
│   │   │   ├── upload.js
│   │   │   └── notifications.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── jobs.js
│   │   │   ├── offers.js
│   │   │   ├── providers.js
│   │   │   ├── reviews.js
│   │   │   ├── upload.js
│   │   │   ├── categories.js
│   │   │   └── notifications.js
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── uploads/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobForm.jsx
│   │   │   └── ProviderCard.jsx
│   │   └── App.jsx
└── README-TREBAM-HR-SETUP.md
```

## Napomene

- Projekt koristi Prisma ORM za bazu podataka
- Frontend koristi React s Tailwind CSS
- Upload datoteka se čuva u `backend/uploads/` direktoriju
- Email notifikacije zahtijevaju SMTP konfiguraciju
- CORS je konfiguriran za development i production

## Sljedeći koraci

1. Postavite bazu podataka i pokrenite migracije
2. Konfigurirajte email servis za notifikacije
3. Implementirajte chat sustav
4. Dodajte geolokacijske funkcionalnosti
5. Implementirajte freemium model
