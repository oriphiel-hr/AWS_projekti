# ✅ Problem: Nginx Proxy na Frontend Hostinger

## 🔍 Status:

✅ **Backend API radi:**
```
https://uslugar.api.oriph.io/api/documentation → 200 OK ✅
Content-Length: 324363 (podaci su tu!)
```

❌ **Frontend Nginx proxy ne radi:**
```
https://uslugar.oriph.io/api/documentation → 404 ❌
```

## 🎯 Problem:

Nginx na **Hostinger frontend serveru** (`uslugar.oriph.io`) ne prosljeđuje `/api/documentation` zahtjeve na backend API.

## ✅ Rješenje:

### Nginx konfiguracija na Hostinger serveru treba:

```nginx
location /api/ {
    proxy_pass https://uslugar.api.oriph.io$request_uri;
    proxy_ssl_server_name on;
    proxy_set_header Host uslugar.api.oriph.io;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
}
```

## 📋 Koraci:

### 1. Provjeri Nginx konfiguraciju na Hostinger

SSH na Hostinger server i provjeri:
```bash
# Provjeri konfiguraciju
cat /etc/nginx/sites-available/uslugar.oriph.io
# ili
cat /etc/nginx/conf.d/uslugar.conf
```

### 2. Ažuriraj Nginx konfiguraciju

Dodaj ili ažuriraj `location /api/` blok:
```nginx
server {
    server_name uslugar.oriph.io;
    
    # ... ostale lokacije ...
    
    # API proxy
    location /api/ {
        proxy_pass https://uslugar.api.oriph.io$request_uri;
        proxy_ssl_server_name on;
        proxy_set_header Host uslugar.api.oriph.io;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_read_timeout 75s;
    }
    
    # ... ostale lokacije ...
}
```

### 3. Test Nginx konfiguracije

```bash
nginx -t
```

### 4. Reload Nginx

```bash
sudo systemctl reload nginx
# ili
sudo service nginx reload
```

## 🔍 Alternative: Provjeri postojeću konfiguraciju

Možda Nginx već ima `/api/` blok, ali:
- Možda blokira specifičan route
- Možda ima cache koji blokira novi route
- Možda path matching ne radi ispravno

## ✅ Test nakon fixa:

```powershell
curl https://uslugar.oriph.io/api/documentation
# Trebalo bi vratiti 200 OK sa JSON podacima
```

---

**Status:** 🔧 Treba ažurirati Nginx konfiguraciju na Hostinger serveru!

