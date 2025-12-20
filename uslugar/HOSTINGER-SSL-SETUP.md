# 🔒 Postavljanje SSL Certifikata na Hostingeru

## 📋 Pregled

Ovaj vodič objašnjava kako postaviti SSL certifikat na Hostinger hosting servisu za domenu `oriphiel.hr` (ili `uslugar.oriph.io`).

---

## 🌐 SSL za Web Hosting (Domena)

### Metoda 1: Besplatni SSL preko Hostinger Control Panela (Preporučeno)

#### Korak 1: Prijava u Hostinger Control Panel

1. Idite na: https://www.hostinger.com/cpanel
2. Prijavite se s Hostinger računom
3. Odaberite domenu (`oriphiel.hr`)

#### Korak 2: Aktivacija SSL Certifikata

1. U Control Panelu, pronađite sekciju **"SSL"** ili **"Security"**
2. Kliknite na **"SSL/TLS Status"** ili **"Manage SSL"**
3. Pronađite svoju domenu u listi
4. Kliknite na **"Install SSL"** ili **"Activate SSL"**
5. Odaberite **"Let's Encrypt"** (besplatni SSL certifikat)
6. Kliknite **"Install"** ili **"Activate"**

#### Korak 3: Provjera

- SSL će se automatski instalirati (obično traje 5-15 minuta)
- Provjerite status: https://www.ssllabs.com/ssltest/analyze.html?d=oriphiel.hr
- Provjerite da li se stranica učitava s `https://` umjesto `http://`

---

### Metoda 2: Ručna instalacija SSL certifikata

Ako besplatni SSL ne radi automatski:

1. **Generirajte CSR (Certificate Signing Request)**
   - U Control Panelu → SSL → Generate CSR
   - Unesite podatke o domeni
   - Spremite CSR i privatni ključ

2. **Naručite SSL certifikat**
   - Hostinger nudi besplatne Let's Encrypt certifikate
   - Ili možete koristiti komercijalni SSL

3. **Instalirajte certifikat**
   - Control Panel → SSL → Install SSL
   - Zalijepite certifikat, privatni ključ i CA bundle
   - Kliknite "Install"

---

## 📧 SSL za Email (SMTP)

### Postavljanje SSL za SMTP (Već konfigurirano)

Vaša SMTP konfiguracija već koristi SSL:

```json
{
  "SMTP_HOST": "smtp.hostinger.com",
  "SMTP_PORT": "465",
  "SMTP_USER": "uslugar@oriphiel.hr",
  "SMTP_PASS": "c|1TYK4YqbF"
}
```

**Port 465 koristi SSL/TLS** - to je već ispravno konfigurirano!

### Provjera SMTP SSL veze

Ako želite provjeriti da li SMTP SSL radi:

```bash
# Test SSL veze na SMTP portu
openssl s_client -connect smtp.hostinger.com:465 -starttls smtp
```

---

## 🔧 Postavljanje SSL za Custom Domain

### Ako imate custom domenu (npr. uslugar.oriph.io)

#### Korak 1: DNS Postavke

1. Idite u Hostinger Control Panel → **DNS Zone Editor**
2. Dodajte A record:
   ```
   Type: A
   Name: uslugar (ili @ za root domenu)
   Points to: [IP adresa servera]
   TTL: 3600
   ```

#### Korak 2: SSL Aktivacija

1. Control Panel → SSL → SSL/TLS Status
2. Pronađite `uslugar.oriph.io` u listi
3. Kliknite **"Install SSL"**
4. Odaberite **"Let's Encrypt"**
5. Kliknite **"Install"**

---

## 🛠️ Troubleshooting

### Problem: SSL se ne aktivira automatski

**Rješenja:**
1. Provjerite da li je domena pravilno povezana s Hostinger hostingom
2. Provjerite DNS postavke - A record mora pokazivati na Hostinger IP
3. Pričekajte 24-48 sati za DNS propagaciju
4. Kontaktirajte Hostinger podršku

### Problem: Mixed Content Warnings

**Rješenje:**
- Provjerite da li svi resursi (slike, skripte, CSS) koriste `https://`
- Ažurirajte hardcoded `http://` linkove u `https://`

### Problem: SSL Certificate Expired

**Rješenje:**
- Let's Encrypt certifikati traju 90 dana
- Hostinger automatski obnavlja certifikate
- Ako ne radi automatski, ručno reinstallirajte SSL

---

## 📝 Provjera SSL Statusa

### Online Alati

1. **SSL Labs SSL Test:**
   - https://www.ssllabs.com/ssltest/
   - Unesite domenu i provjerite ocjenu

2. **SSL Checker:**
   - https://www.sslshopper.com/ssl-checker.html
   - Provjerite detalje certifikata

### Komandna linija

```bash
# Provjeri SSL certifikat
openssl s_client -connect oriphiel.hr:443 -servername oriphiel.hr

# Provjeri SMTP SSL
openssl s_client -connect smtp.hostinger.com:465
```

---

## 🔐 Best Practices

1. **Koristite HTTPS svugdje**
   - Ažurirajte sve linkove na `https://`
   - Omogućite HTTPS redirect u `.htaccess`

2. **HSTS (HTTP Strict Transport Security)**
   - Dodajte HSTS header u web server konfiguraciju
   - Osigurava da se stranica uvijek učitava preko HTTPS

3. **Automatsko obnavljanje**
   - Let's Encrypt certifikati se automatski obnavljaju
   - Provjerite da li je auto-renewal aktiviran

---

## 📞 Hostinger Podrška

Ako imate problema:

1. **Live Chat:** Dostupan 24/7 u Control Panelu
2. **Email:** support@hostinger.com
3. **Knowledge Base:** https://support.hostinger.com/

---

## ✅ Checklist

- [ ] SSL certifikat instaliran za domenu
- [ ] HTTPS radi (provjerite u browseru)
- [ ] SMTP SSL konfiguriran (port 465)
- [ ] Svi linkovi koriste HTTPS
- [ ] SSL Labs test prolazi
- [ ] Auto-renewal aktiviran

---

## 🔗 Korisni Linkovi

- **Hostinger Control Panel:** https://www.hostinger.com/cpanel
- **SSL Labs Test:** https://www.ssllabs.com/ssltest/
- **Let's Encrypt:** https://letsencrypt.org/
- **Hostinger SSL Guide:** https://support.hostinger.com/en/articles/4426391-how-to-install-an-ssl-certificate

