# 🔄 Preusmjeravanje Domene - uslugar.oriph.io → uslugar.oriphiel.hr

## 📋 Pregled

Preusmjeravanje `https://uslugar.oriph.io/` na `https://uslugar.oriphiel.hr/` tako da korisnici više ne vide staru domenu.

**Stara domena:** `uslugar.oriph.io`  
**Nova domena:** `uslugar.oriphiel.hr`  
**Tip redirecta:** 301 Permanent Redirect

---

## 🚀 Postavljanje Redirecta na Hostingeru

### Metoda 1: .htaccess fajl (Preporučeno)

#### Korak 1: Kreiraj .htaccess fajl

Kreirajte fajl `.htaccess` u `public_html/` direktoriju na Hostingeru:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirect uslugar.oriph.io to uslugar.oriphiel.hr
RewriteCond %{HTTP_HOST} ^uslugar\.oriph\.io$ [NC]
RewriteRule ^(.*)$ https://uslugar.oriphiel.hr/$1 [L,R=301]

# Redirect www.uslugar.oriph.io to uslugar.oriphiel.hr
RewriteCond %{HTTP_HOST} ^www\.uslugar\.oriph\.io$ [NC]
RewriteRule ^(.*)$ https://uslugar.oriphiel.hr/$1 [L,R=301]
```

#### Korak 2: Upload .htaccess fajla

**Preko FTP:**
1. Spojite se na Hostinger FTP
2. Idite u `public_html/` direktorij
3. Uploadajte `.htaccess` fajl

**Preko File Manager u Control Panelu:**
1. Hostinger Control Panel → File Manager
2. Otvorite `public_html/` direktorij
3. Kliknite "New File"
4. Nazovite `.htaccess`
5. Zalijepite gornji kod
6. Spremite

---

### Metoda 2: Hostinger Control Panel Redirect

1. **Idite u Hostinger Control Panel**
   - https://www.hostinger.com/cpanel

2. **Pronađite "Redirects" ili "Domain Redirects"**
   - U meniju tražite "Redirects" ili "Domain Management"

3. **Kreirajte redirect:**
   - **From:** `uslugar.oriph.io`
   - **To:** `https://uslugar.oriphiel.hr`
   - **Type:** 301 Permanent Redirect
   - **Include path:** Yes (ako želite preusmjeriti i putanje)

4. **Spremite**

---

## 🔧 Ažuriranje Konfiguracije u Kodu

### 1. Backend - FRONTEND_URL

Ažurirajte `FRONTEND_URL` u svim konfiguracijama:

**AWS Secrets Manager:**
```json
{
  "FRONTEND_URL": "https://uslugar.oriphiel.hr"
}
```

**Backend .env:**
```env
FRONTEND_URL=https://uslugar.oriphiel.hr
```

### 2. Backend - CORS Origins

Ažurirajte `CORS_ORIGINS` u backend konfiguraciji:

```env
CORS_ORIGINS=http://localhost:5173,https://uslugar.oriphiel.hr
```

### 3. Frontend - API URL

Ažurirajte `VITE_API_URL` ako je potrebno:

```env
VITE_API_URL=https://uslugar.oriphiel.hr
```

### 4. Email Templates

Email linkovi će automatski koristiti novu domenu ako je `FRONTEND_URL` ažuriran.

---

## 📝 Koraci za Implementaciju

### Korak 1: Postavi .htaccess redirect

1. Kreiraj `.htaccess` fajl (vidi gore)
2. Uploadaj na Hostinger u `public_html/` direktorij

### Korak 2: Ažuriraj AWS Secrets Manager

```powershell
# Ažuriraj FRONTEND_URL u SMTP secret
aws secretsmanager put-secret-value `
    --secret-id uslugar-smtp-config `
    --secret-string '{"SMTP_HOST":"smtp.hostinger.com","SMTP_PORT":"465","SMTP_USER":"uslugar@oriphiel.hr","SMTP_PASS":"c|1TYK4YqbF","FRONTEND_URL":"https://uslugar.oriphiel.hr"}' `
    --region eu-north-1
```

### Korak 3: Ažuriraj Backend Konfiguraciju

Ako koristite lokalni `.env`:
```env
FRONTEND_URL=https://uslugar.oriphiel.hr
CORS_ORIGINS=http://localhost:5173,https://uslugar.oriphiel.hr
```

### Korak 4: Provjeri Redirect

1. Otvorite: `https://uslugar.oriph.io`
2. Provjerite da li se automatski preusmjerava na `https://uslugar.oriphiel.hr`
3. Provjerite da li URL u browseru pokazuje novu domenu

---

## ✅ Provjera

### Browser Test:
1. Otvorite: `https://uslugar.oriph.io`
2. Provjerite da li se automatski preusmjerava na `https://uslugar.oriphiel.hr`
3. Provjerite da li URL u browseru pokazuje `uslugar.oriphiel.hr`

### Komandna linija:
```powershell
# Provjeri redirect
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -MaximumRedirection 0 -ErrorAction SilentlyContinue
$response.Headers.Location  # Trebao bi biti: https://uslugar.oriphiel.hr/
```

### Online Tools:
- **Redirect Checker:** https://www.redirectchecker.com/
- Unesite: `https://uslugar.oriph.io`
- Provjerite da li redirect ide na `https://uslugar.oriphiel.hr`

---

## 🔍 Troubleshooting

### Problem: Redirect ne radi

**Rješenja:**
1. Provjerite da li je `.htaccess` fajl u `public_html/` direktoriju
2. Provjerite da li Hostinger podržava `.htaccess` (većina shared hostinga da)
3. Provjerite da li je `mod_rewrite` omogućen (obično je po defaultu)
4. Provjerite da li nema drugih `.htaccess` fajlova koji overrideaju redirect

### Problem: Infinite Redirect Loop

**Rješenje:**
- Provjerite da li obje domene pokazuju na isti `public_html/` direktorij
- Ako da, koristite samo `.htaccess` redirect
- Ako ne, koristite Hostinger Control Panel redirect

### Problem: SSL Error na novoj domeni

**Rješenje:**
- Provjerite da li je SSL certifikat instaliran za `uslugar.oriphiel.hr`
- Ako ne, instalirajte SSL certifikat (vidi `HOSTINGER-SSL-SETUP.md`)

---

## 📊 SEO Implikacije

### 301 Redirect Benefits:
- ✅ Google prenosi SEO ranking s stare na novu domenu
- ✅ Korisnici automatski idu na novu domenu
- ✅ Stara domena se postupno "zaboravi"

### Best Practices:
1. **Ažuriraj sitemap.xml** s novom domenom
2. **Ažuriraj Google Search Console** s novom domenom
3. **Ažuriraj sve vanjske linkove** (ako je moguće)
4. **Provjeri da li redirect radi za sve putanje** (npr. `/api/`, `/admin/`, itd.)

---

## 🔗 Korisni Linkovi

- **Hostinger Control Panel:** https://www.hostinger.com/cpanel
- **Redirect Checker:** https://www.redirectchecker.com/
- **SSL Labs Test:** https://www.ssllabs.com/ssltest/

