# Uslugar - Development Guide

## 🚀 Kako pokrenuti aplikaciju lokalno

### Preduvjeti
- Node.js 20+ instaliran
- PostgreSQL baza (ili AWS RDS)
- npm ili yarn

---

## ⚡ Brzo pokretanje (Windows)

### Opcija 1: PowerShell script (PREPORUČENO)
```powershell
cd uslugar
.\START-USLUGAR-DEV.ps1
```

Ova skripta će automatski pokrenuti:
- ✅ Backend server na `http://localhost:4000`
- ✅ Frontend server na `http://localhost:5173`

### Opcija 2: Ručno pokretanje

**Backend:**
```powershell
cd uslugar/backend
npm install
npm run dev
```

**Frontend (novi terminal):**
```powershell
cd uslugar/frontend
npm install
npm run dev
```

---

## 🌐 URL-ovi nakon pokretanja

| Servis | URL | Opis |
|--------|-----|------|
| Frontend | http://localhost:5173 | React aplikacija (Vite) |
| Backend API | http://localhost:4000 | Express REST API |
| Health Check | http://localhost:4000/api/health | API status |

---

## 🗄️ Database Setup

### 1. Kreiraj `.env` file u `uslugar/backend/`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/uslugar"
PORT=4000
JWT_SECRET="your-secret-key-here"
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
```

### 2. Run migrations

```powershell
cd uslugar/backend
npm run migrate:dev
```

### 3. Seed podataka (opcionalno)

```powershell
cd uslugar/backend
node prisma/seed.js
```

---

## 📋 Dostupne NPM skripte

### Backend (`uslugar/backend`)

```powershell
npm run dev          # Pokreni development server
npm run dev:win      # Pokreni sa NODE_ENV=development (Windows)
npm run dev:unix     # Pokreni sa NODE_ENV=development (Linux/Mac)
npm start            # Pokreni production server
npm run prisma:generate    # Generiraj Prisma Client
npm run migrate:dev        # Pokreni migracije (dev)
npm run migrate:deploy     # Pokreni migracije (production)
npm run db:push             # Push schema promjene
```

### Frontend (`uslugar/frontend`)

```powershell
npm run dev      # Pokreni development server (Vite)
npm run build    # Build za production
npm run preview  # Preview production build-a
```

---

## 🧪 Testiranje

### Provjera da li Backend radi

```powershell
# Health check
curl http://localhost:4000/api/health

# Expected: {"ok":true,"ts":"..."}
```

### Testiranje CRUD funkcionalnosti

1. Otvori browser: http://localhost:5173
2. Klikni na **"Admin"** tab
3. Klikni na **"Podaci (CRUD)"** tab
4. Trebali biste vidjeti:
   - ✅ Popis korisnika
   - ✅ Popis kategorija
   - ✅ Mogućnost dodavanja/uređivanja/brisanja

---

## 🐛 Troubleshooting

### Problem: "NODE_ENV is not recognized"
**Rješenje:** Koristite `npm run dev:win` umjesto `npm run dev` na Windows-u

### Problem: "Port 4000 already in use"
**Rješenje:** 
```powershell
# Pronađi proces
netstat -ano | findstr :4000

# Ubij proces (zamijenite PID sa brojem iz prethodne naredbe)
taskkill /PID <PID> /F
```

### Problem: "Cannot connect to database"
**Rješenje:** 
- Provjerite da li je PostgreSQL pokrenut
- Provjerite `DATABASE_URL` u `.env` file-u
- Provjerite da li baza postoji

### Problem: Frontend ne može spojiti na Backend (CORS greška)
**Rješenje:** 
- Provjerite `CORS_ORIGINS` u backend `.env` file-u
- Dodajte frontend URL: `CORS_ORIGINS="http://localhost:5173"`
- Restartujte backend server

---

## 🔧 Development tips

### Hot reload
- **Frontend:** Automatski (Vite)
- **Backend:** Ručno restart nakon promjena

### Preporučene VS Code ekstenzije
- Prisma
- ESLint
- Prettier
- Thunder Client (za testiranje API-ja)

### Database GUI
- Prisma Studio: `npx prisma studio`
- pgAdmin: Desktop aplikacija za PostgreSQL

---

## 📦 Docker Development (Opcionalno)

```powershell
cd uslugar
docker-compose -f docker-compose.prisma.yml up
```

---

## 🚀 Deploy na AWS ECS

Pogledajte: [README-DEPLOY-ECS.md](README-DEPLOY-ECS.md)

---

## 📞 Support

Za probleme i pitanja:
- Kreirajte Issue na GitHub-u
- Kontaktirajte razvojni tim

---

**Happy Coding! 🎉**

