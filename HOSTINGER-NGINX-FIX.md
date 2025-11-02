# ✅ FIX: Nginx Proxy na Hostinger Frontend

## 🔍 Status:

✅ **Backend API radi:**
```
https://uslugar.api.oriph.io/api/documentation → 200 OK ✅
Content-Length: 324363 (podaci su tu!)
```

❌ **Frontend Nginx proxy:**
```
https://uslugar.oriph.io/api/documentation → 404 ❌
```

## 🎯 Problem:

Nginx na **Hostinger serveru** (`uslugar.oriph.io`) ne prosljeđuje `/api/documentation` zahtjeve na backend API.

## ✅ Rješenje - SSH na Hostinger:

### 1. Poveži se na Hostinger server

**Opcija A: SSH kroz Hostinger panel**
- Idi u Hostinger hPanel
- Otvori **Advanced → SSH Access**
- Kopiraj SSH detalje

**Opcija B: Direktno SSH**
```bash
ssh username@uslugar.oriph.io
# ili
ssh username@IP_ADRESA
```

### 2. Pronađi Nginx konfiguraciju

```bash
# Provjeri gdje je Nginx konfiguracija
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
ls -la /etc/nginx/conf.d/

# Ili provjeri default lokaciju
cat /etc/nginx/sites-available/uslugar.oriph.io
# ili
cat /etc/nginx/conf.d/uslugar.conf
```

### 3. Ažuriraj Nginx konfiguraciju

Dodaj ili ažuriraj `location /api/` blok:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name uslugar.oriph.io;
    
    root /home/username/domains/uslugar.oriph.io/public_html;
    index index.html index.htm;
    
    # API proxy - prosljeđuje sve /api/* zahtjeve na backend
    location /api/ {
        proxy_pass https://uslugar.api.oriph.io$request_uri;
        proxy_ssl_server_name on;
        proxy_set_header Host uslugar.api.oriph.io;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_read_timeout 75s;
        
        # CORS headers (ako treba)
        add_header 'Access-Control-Allow-Origin' 'https://uslugar.oriph.io' always;
        add_header 'Vary' 'Origin' always;
    }
    
    # Frontend static files
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Test Nginx konfiguracije

```bash
sudo nginx -t
```

**Očekivano output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5. Reload Nginx

```bash
sudo systemctl reload nginx
# ili
sudo service nginx reload
# ili ako nemate sudo
/etc/init.d/nginx reload
```

## 🔍 Alternative: Provjeri postojeću konfiguraciju

Možda Nginx već ima `/api/` blok, ali možda:
- ❌ Blokira specifičan route (`/api/documentation`)
- ❌ Ima cache koji blokira novi route
- ❌ Path matching ne radi ispravno (npr. `location /api` umjesto `location /api/`)

**Provjeri:**
```bash
grep -r "location.*api" /etc/nginx/
```

## ✅ Test nakon fixa:

```powershell
curl https://uslugar.oriph.io/api/documentation
# Trebalo bi vratiti 200 OK sa JSON podacima
```

**Očekivano:**
- StatusCode: 200
- Content: JSON sa `features` i `featureDescriptions`

## 📝 Napomena:

**Hostinger možda koristi Apache umjesto Nginx!**

Ako je Apache, treba ažurirati `.htaccess` ili Apache virtual host konfiguraciju:

```apache
# .htaccess u public_html/
RewriteEngine On

# API proxy - prosljeđuje /api/* na backend
RewriteRule ^api/(.*)$ https://uslugar.api.oriph.io/api/$1 [P,L]
```

**Provjeri:**
```bash
which nginx
which apache2
# ili
systemctl status nginx
systemctl status apache2
```

---

**Status:** 🔧 Treba ažurirati Nginx/Apache konfiguraciju na Hostinger serveru preko SSH!

