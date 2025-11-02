# 🔧 Rješavanje 404 greške za /api/documentation

## Problem:
- Route postoji u kodu (`server.js` linija 286)
- Ali vraća 404 Not Found na produkciji

## Mogući uzroci:

### 1. Backend nije deployan s novim kodom
**Rješenje:** Deploy backend sa novim kodom

### 2. Backend server nije pokrenut
**Rješenje:** Provjeri da li je backend server pokrenut na produkciji

### 3. Route nije registriran u deployanoj verziji
**Rješenje:** Provjeri da li je `server.js` s novim route-om deployan

## Kako provjeriti:

### Provjeri backend deployment:
```bash
# Provjeri da li backend API radi
curl https://uslugar.oriph.io/api/health

# Ako vraća {"ok":true} → backend radi
# Ako vraća grešku → backend ne radi
```

### Provjeri da li route postoji u deployanoj verziji:
1. Poveži se na produkcijski server (SSH)
2. Provjeri `server.js` file
3. Traži `app.use('/api/documentation', documentationRouter)`

## Rješenja:

### Opcija 1: Deploy backend (Hostinger)
Ako se backend deploya na Hostinger:
1. Upload `src/routes/documentation.js` na server
2. Provjeri da `server.js` ima route
3. Restart Node.js aplikacije

### Opcija 2: Deploy backend (AWS ECS)
Ako se backend deploya na AWS ECS:
1. Push promjene na GitHub
2. Pokreni backend deployment workflow
3. Čekaj da se container restartuje

### Opcija 3: Ručno dodaj route (hitno rješenje)
Ako backend radi na Hostinger, možda treba ručno dodati route u `server.js` na serveru.

## Provjeri status deploymenta:

**GitHub Actions:**
- Provjeri da li je backend deployment workflow pokrenut
- Provjeri da li je uspješno završio

**Hostinger Control Panel:**
- Idi u Node.js Apps
- Provjeri da li je aplikacija pokrenuta
- Provjeri logs za greške

## Sljedeći koraci:

1. Provjeri backend health: `curl https://uslugar.oriph.io/api/health`
2. Ako health radi → route nije deployan
3. Ako health ne radi → backend nije pokrenut
4. Deploy backend sa novim kodom
5. Test: `curl https://uslugar.oriph.io/api/documentation`

