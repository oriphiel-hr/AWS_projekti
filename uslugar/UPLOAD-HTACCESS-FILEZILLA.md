# 📤 Upload .htaccess Fajla - FileZilla Upute

## ✅ Brzi Vodič

### Korak 1: Preuzmi FileZilla
- Ako nemate FileZilla: https://filezilla-project.org/download.php?type=client
- Instaliraj FileZilla Client

### Korak 2: Spoji se na FTP

1. **Otvorite FileZilla**
2. **U gornjem dijelu unesite:**
   - **Host:** `194.5.156.10`
   - **Username:** `u208993221`
   - **Password:** `G73S3ebakh6O!`
   - **Port:** `21`
3. **Kliknite "Quickconnect"**

### Korak 3: Navigiraj do public_html/

**Desna strana (Remote site):**
- Navigiraj do: `/public_html/`
- Ili: `/domains/uslugar.oriph.io/public_html/`
- (Ovisno o Hostinger strukturi)

### Korak 4: Upload .htaccess

**Lijeva strana (Local site):**
- Navigiraj do: `C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\`
- Pronađi fajl: `.htaccess`

**Upload:**
- **Drag & drop** `.htaccess` fajl iz lijeve strane u desnu stranu (`public_html/`)
- Ili: **Desni klik** na `.htaccess` → **Upload**

### Korak 5: Provjeri

1. **Provjeri da li je fajl uploadan:**
   - U desnoj strani (Remote site) trebao bi se pojaviti `.htaccess`
   
2. **Test redirect:**
   - Otvorite: `https://uslugar.oriph.io`
   - Provjerite da li se preusmjerava na `https://uslugar.oriphiel.hr`

---

## 🔍 Troubleshooting

### Problem: Ne mogu se spojiti na FTP

**Rješenja:**
1. Provjerite da li je Hostinger FTP omogućen
2. Provjerite firewall postavke
3. Pokušajte s **Passive mode** (FileZilla → Edit → Settings → Connection → FTP → Passive mode)
4. Provjerite credentials u Hostinger Control Panelu

### Problem: Ne vidim public_html/ direktorij

**Rješenja:**
1. Možda ste već u `public_html/` direktoriju
2. Provjerite root direktorij FTP accounta
3. Pokušajte navigirati: `/` pa tražite `public_html` ili `domains`

### Problem: Upload ne radi

**Rješenja:**
1. Provjerite dozvole (permissions) na serveru
2. Provjerite da li `.htaccess` fajl već postoji (možda treba overwrite)
3. Provjerite da li imate write dozvole u `public_html/`

---

## ✅ Alternativni Načini

### WinSCP

1. **Otvorite WinSCP**
2. **New Session:**
   - File protocol: **FTP**
   - Host name: `194.5.156.10`
   - User name: `u208993221`
   - Password: `G73S3ebakh6O!`
   - Port: `21`
3. **Login**
4. **Upload** `.htaccess` u `public_html/`

### Hostinger File Manager

1. **Idite u Hostinger Control Panel**
2. **File Manager**
3. **Otvorite** `public_html/` direktorij
4. **Upload** → Select File → `C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\.htaccess`
5. **Rename** ako je potrebno (trebao bi biti `.htaccess`)

---

## 📋 FTP Credentials (za referencu)

```
Host: 194.5.156.10
Username: u208993221
Password: G73S3ebakh6O!
Port: 21
Protocol: FTP
```

---

## ✅ Provjera Nakon Uploada

### Browser Test:
1. Otvorite: `https://uslugar.oriph.io`
2. Provjerite da li se automatski preusmjerava na `https://uslugar.oriphiel.hr`
3. Provjerite da li URL u browseru pokazuje novu domenu

### Komandna linija:
```powershell
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -MaximumRedirection 0 -ErrorAction SilentlyContinue
$response.Headers.Location  # Trebao bi biti: https://uslugar.oriphiel.hr/
```

### Online Tool:
- https://www.redirectchecker.com/
- Unesite: `https://uslugar.oriph.io`

---

## 🎯 Sljedeći Koraci

Nakon uspješnog uploada:
1. ✅ Testirajte redirect u browseru
2. ✅ Provjerite SSL za novu domenu (`uslugar.oriphiel.hr`)
3. ✅ Ažurirajte sve bookmarkove i linkove

