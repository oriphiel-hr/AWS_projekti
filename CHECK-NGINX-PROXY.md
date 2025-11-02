# 🔍 Provjera: Nginx Proxy Konfiguracija

## Problem:
- ✅ Route postoji u kodu
- ✅ Backend server možda radi
- ❌ Endpoint vraća 404

## Mogući uzrok: Nginx proxy

Ako se koristi Nginx reverse proxy, možda nije konfiguriran da prosljeđuje `/api/documentation` zahtjeve na backend.

### Provjeri:

#### 1. Backend health check:
```powershell
curl https://uslugar.oriph.io/api/health
```

**Ako ne radi:**
- Backend server nije pokrenut
- Nginx nije konfiguriran da prosljeđuje `/api/*` zahtjeve

**Ako radi:**
- Backend radi
- Problem je specifično sa `/api/documentation` route-om
- Možda Nginx blokira specifičan route

#### 2. Provjeri Nginx konfiguraciju

Ako backend radi na AWS ECS s Nginx proxy-em, provjeri:
- Da li Nginx prosljeđuje sve `/api/*` zahtjeve na backend
- Da li postoji neki whitelist koji blokira `/api/documentation`
- Da li Nginx cache blokira route

#### 3. Direktno provjeri backend (bez Nginx)

Ako backend ima direktan URL (npr. ALB endpoint), pokušaj:
```powershell
# Provjeri backend direktno (ako znaš URL)
curl http://[BACKEND-IP]:4000/api/documentation
```

### Rješenje:

#### Opcija 1: Provjeri Nginx konfiguraciju
- Ako imaš pristup Nginx konfigu, provjeri da li prosljeđuje sve `/api/*` route-ove

#### Opcija 2: Force restart backend
- Restart ECS task da se osigura da pokreće najnoviju verziju

#### Opcija 3: Provjeri da li route file postoji u containeru
- Možda Docker build ne kopira route file
- Provjeri workflow logs

---

**Prvo provjeri backend health - to će reći da li problem je u backendu ili Nginx-u!**

