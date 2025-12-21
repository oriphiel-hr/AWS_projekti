# 🌐 Više Domena na Istoј IP Adresi - Objašnjenje

## ✅ Da, to je potpuno normalno!

**Više domena/subdomena MOŽE pokazivati na istu IP adresu.**

To je standardna praksa u web hosting-u i zove se **"Virtual Hosting"** ili **"Shared IP"**.

---

## 🔍 Kako to radi?

### 1. DNS (A Record)
```
ftp.oriph.io        → A Record → 194.5.156.10
uslugar.oriph.io    → A Record → 194.5.156.10
uslugar.oriphiel.hr → A Record → 194.5.156.10
```

**Sve tri domene pokazuju na istu IP adresu!**

### 2. Web Server (Apache/Nginx)

Kada korisnik posjeti domenu, browser šalje **HTTP Host header**:

```
GET / HTTP/1.1
Host: uslugar.oriph.io
```

Web server (Apache/Nginx) koristi ovaj **Host header** da odluči:
- Koju domenu servirati
- Koji `public_html/` direktorij koristiti
- Koji SSL certifikat koristiti

---

## 📋 Vaš Slučaj

### Postojeći A Record:
```
Name: ftp
Content: 194.5.156.10
TTL: 1800
```
**Ovo je za:** `ftp.oriph.io` → FTP server

### Novi A Record (koji trebate dodati):
```
Name: uslugar
Content: 194.5.156.10
TTL: 3600
```
**Ovo će biti za:** `uslugar.oriph.io` → Web stranica

---

## ✅ Što trebate napraviti:

### 1. Dodaj A Record za uslugar.oriph.io

U Hostinger Control Panelu:
1. **DNS Zone Editor** → **Add Additional A Record**
2. **Name:** `uslugar`
3. **Content:** `194.5.156.10`
4. **TTL:** `3600`
5. **Confirm**

**Rezultat:**
- `ftp.oriph.io` → `194.5.156.10` (FTP)
- `uslugar.oriph.io` → `194.5.156.10` (Web stranica)

### 2. Dodaj A Record za uslugar.oriphiel.hr

Ako `uslugar.oriphiel.hr` koristi isti Hostinger account:
1. **DNS Zone Editor** (za `oriphiel.hr` domenu)
2. **Add A Record:**
   - **Name:** `uslugar`
   - **Content:** `194.5.156.10`
   - **TTL:** `3600`

**Rezultat:**
- `uslugar.oriphiel.hr` → `194.5.156.10` (Web stranica)

---

## 🔧 Kako Web Server Rukuje s Više Domena

### Apache (Hostinger koristi Apache)

Apache koristi **Virtual Hosts** u konfiguraciji:

```apache
<VirtualHost *:80>
    ServerName uslugar.oriph.io
    DocumentRoot /domains/uslugar.oriph.io/public_html/
</VirtualHost>

<VirtualHost *:80>
    ServerName uslugar.oriphiel.hr
    DocumentRoot /domains/uslugar.oriphiel.hr/public_html/
</VirtualHost>
```

**Apache automatski:**
1. Prima request s `Host: uslugar.oriph.io`
2. Pronalazi odgovarajući VirtualHost
3. Servira fajlove iz odgovarajućeg `public_html/` direktorija

### .htaccess Redirect

Vaš `.htaccess` fajl u `public_html/` preusmjerava:

```apache
RewriteCond %{HTTP_HOST} ^uslugar\.oriph\.io$ [NC]
RewriteRule ^(.*)$ https://uslugar.oriphiel.hr/$1 [L,R=301]
```

**Kako radi:**
1. Korisnik posjećuje `uslugar.oriph.io`
2. Apache servira `.htaccess` iz `public_html/`
3. `.htaccess` prepoznaje `HTTP_HOST = uslugar.oriph.io`
4. Preusmjerava na `https://uslugar.oriphiel.hr`

---

## 📊 Primjer: Više Domena na Istoј IP

### Scenario:
```
IP Adresa: 194.5.156.10

Domene:
├── ftp.oriph.io          → FTP server
├── uslugar.oriph.io      → Web stranica (stara domena)
├── uslugar.oriphiel.hr   → Web stranica (nova domena)
└── mail.oriph.io         → Email server
```

**Sve pokazuju na istu IP, ali server servira različite servise!**

---

## ✅ Checklist

- [ ] **A Record za `uslugar.oriph.io`** → `194.5.156.10` (dodaj)
- [ ] **A Record za `uslugar.oriphiel.hr`** → `194.5.156.10` (dodaj)
- [ ] **.htaccess fajl** uploadan u `public_html/` (već kreiran)
- [ ] **SSL za `uslugar.oriphiel.hr`** aktiviran (treba aktivirati)
- [ ] **DNS propagation** (pričekaj 5-30 minuta)

---

## 🔍 Provjera Nakon Postavke

### Provjeri DNS:
```powershell
Resolve-DnsName -Name "uslugar.oriph.io" -Type A
# Trebao bi vratiti: 194.5.156.10

Resolve-DnsName -Name "uslugar.oriphiel.hr" -Type A
# Trebao bi vratiti: 194.5.156.10
```

### Provjeri Redirect:
1. Otvorite: `https://uslugar.oriph.io`
2. Provjerite da li se preusmjerava na `https://uslugar.oriphiel.hr`

---

## 🎯 Sažetak

**✅ DA, možeš imati više domena na istoј IP adresi!**

**Kako:**
1. **DNS (A Record)** - pokazuje domenu na IP
2. **Web Server (Apache)** - koristi HTTP Host header da odluči koju domenu servirati
3. **.htaccess** - preusmjerava s jedne domene na drugu

**Tvoj slučaj:**
- `ftp.oriph.io` → `194.5.156.10` (FTP) ✅ Već postoji
- `uslugar.oriph.io` → `194.5.156.10` (Web) ⚠️ Treba dodati
- `uslugar.oriphiel.hr` → `194.5.156.10` (Web) ⚠️ Treba dodati

**Samo dodaj A Record za "uslugar" i sve će raditi!**

