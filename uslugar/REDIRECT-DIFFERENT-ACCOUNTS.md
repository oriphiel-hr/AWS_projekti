# 🔄 Redirect između Različitih Hostinger Računa

## 📋 Situacija

- **Stara domena:** `uslugar.oriph.io` → Hostinger Account 1
- **Nova domena:** `uslugar.oriphiel.hr` → Hostinger Account 2
- **Različiti računi = različite IP adrese**

---

## ✅ Kako Redirect Radi s Različitim Accountima

### 1. DNS Postavke (Različite IP adrese)

**Stara domena (uslugar.oriph.io):**
```
A Record → IP adresa Account 1 (npr. 147.79.119.46)
```

**Nova domena (uslugar.oriphiel.hr):**
```
A Record → IP adresa Account 2 (194.5.156.10)
```

**OBAJE domene imaju RAZLIČITE IP adrese!**

### 2. Redirect preko .htaccess (na STAROJ domeni)

**Lokacija:** `public_html/.htaccess` na **Account 1** (stara domena)

**Sadržaj:**
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

**Kako radi:**
1. Korisnik posjećuje `https://uslugar.oriph.io`
2. Request ide na **Account 1** (stara domena)
3. `.htaccess` na **Account 1** prepoznaje domenu
4. Preusmjerava korisnika na `https://uslugar.oriphiel.hr`
5. Korisnik završava na **Account 2** (nova domena)

---

## 📋 Što Trebate Napraviti

### Na Account 1 (uslugar.oriph.io - stara domena):

1. **Upload .htaccess fajl:**
   - Lokacija: `public_html/.htaccess`
   - Sadržaj: Redirect pravila (gore)
   - FTP: Spoji se na Account 1 FTP

2. **Provjeri SSL:**
   - SSL treba biti aktivan za `uslugar.oriph.io`
   - (Za HTTPS redirect)

### Na Account 2 (uslugar.oriphiel.hr - nova domena):

1. **DNS A Record:**
   - Name: `uslugar` (ili `@` za root)
   - Points to: IP adresa Account 2 (194.5.156.10)
   - TTL: 3600

2. **SSL Certifikat:**
   - Aktiviraj SSL za `uslugar.oriphiel.hr`
   - Lifetime SSL (besplatni)

3. **Frontend Deployment:**
   - Upload frontend fajlove u `public_html/`
   - (Normalni deployment)

---

## 🔍 Kako Provjeriti

### Provjeri DNS (različite IP adrese):

```powershell
# Stara domena
Resolve-DnsName -Name "uslugar.oriph.io" -Type A
# Trebao bi vratiti: IP adresa Account 1

# Nova domena
Resolve-DnsName -Name "uslugar.oriphiel.hr" -Type A
# Trebao bi vratiti: 194.5.156.10 (Account 2)
```

### Provjeri Redirect:

1. Otvorite: `https://uslugar.oriph.io`
2. Provjerite da li se preusmjerava na `https://uslugar.oriphiel.hr`
3. Provjerite da li URL u browseru pokazuje novu domenu

---

## ⚠️ Važno

### .htaccess mora biti na STAROJ domeni!

**Lokacija:**
- ✅ `public_html/.htaccess` na **Account 1** (uslugar.oriph.io)
- ❌ NE na Account 2 (uslugar.oriphiel.hr)

**Razlog:**
- Redirect se radi PRIJE nego što request dođe do nove domene
- `.htaccess` na staroj domeni "presreće" request i preusmjerava ga

---

## 📊 Flow Diagram

```
Korisnik → https://uslugar.oriph.io
    ↓
DNS → Account 1 IP (stara domena)
    ↓
Apache na Account 1 → čita .htaccess
    ↓
.htaccess → prepoznaje domenu → redirect
    ↓
Browser → https://uslugar.oriphiel.hr
    ↓
DNS → Account 2 IP (194.5.156.10)
    ↓
Apache na Account 2 → servira stranicu
```

---

## ✅ Checklist

### Account 1 (uslugar.oriph.io):
- [ ] `.htaccess` fajl uploadan u `public_html/`
- [ ] `.htaccess` sadrži redirect pravila
- [ ] SSL aktivan za `uslugar.oriph.io`
- [ ] Redirect testiran (`https://uslugar.oriph.io` → `https://uslugar.oriphiel.hr`)

### Account 2 (uslugar.oriphiel.hr):
- [ ] DNS A Record postavljen → `194.5.156.10`
- [ ] SSL aktivan za `uslugar.oriphiel.hr`
- [ ] Frontend deploymentan u `public_html/`
- [ ] Stranica radi na `https://uslugar.oriphiel.hr`

---

## 🔧 Troubleshooting

### Problem: Redirect ne radi

**Provjeri:**
1. ✅ `.htaccess` je na **Account 1** (stara domena), ne na Account 2
2. ✅ `.htaccess` sadrži ispravna redirect pravila
3. ✅ SSL je aktivan za obje domene
4. ✅ DNS zapisi su ispravni (različite IP adrese)

### Problem: SSL Error na novoj domeni

**Rješenje:**
- Aktiviraj SSL za `uslugar.oriphiel.hr` na Account 2
- Lifetime SSL (besplatni)

---

## 🎯 Sažetak

**Kada su domene na različitim accountima:**

1. **DNS:** Različite IP adrese (svaka domena na svom accountu)
2. **Redirect:** `.htaccess` na **STAROJ domeni** (Account 1)
3. **Nova domena:** Normalno funkcionira (Account 2)

**Ključna stvar:** `.htaccess` fajl mora biti uploadan na **Account 1** (stara domena), ne na Account 2!

