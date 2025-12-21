# 🔒 SSL Setup za uslugar.oriphiel.hr

## ❌ Problem

Dobivate grešku:
```
ERR_SSL_PROTOCOL_ERROR
uslugar.oriphiel.hr je odgovor koji nije valjan.
```

**Razlog:** SSL certifikat nije instaliran za novu domenu `uslugar.oriphiel.hr`.

---

## ✅ Rješenje: Instaliraj SSL na Hostingeru

### Korak 1: Idite u Hostinger Control Panel

1. **Login:** https://www.hostinger.com/cpanel
2. **Idite u:** Websites → SSL

### Korak 2: Aktiviraj SSL za uslugar.oriphiel.hr

1. **Pronađite** `uslugar.oriphiel.hr` u listi domena
2. **Kliknite** na "Manage" ili "SSL"
3. **Odaberite** "Lifetime SSL" (besplatni SSL)
4. **Kliknite** "Activate" ili "Install"

### Korak 3: Čekaj aktivaciju

- SSL aktivacija može potrajati **5-30 minuta**
- Provjerite status u Control Panelu

### Korak 4: Provjeri SSL

**Browser:**
1. Otvorite: `https://uslugar.oriphiel.hr`
2. Provjerite da li vidite 🔒 ikonu
3. Provjerite da li nema greške

**Komandna linija:**
```powershell
Invoke-WebRequest -Uri "https://uslugar.oriphiel.hr" -Method Head
```

**SSL Labs Test:**
- https://www.ssllabs.com/ssltest/analyze.html?d=uslugar.oriphiel.hr

---

## 🔧 Alternativno: Ako SSL ne postoji u listi

### Opcija 1: Dodaj domenu u Hostinger

Ako `uslugar.oriphiel.hr` nije dodana kao domena:

1. **Hostinger Control Panel** → **Domains**
2. **Add Domain** ili **Add Subdomain**
3. **Unesite:** `uslugar.oriphiel.hr`
4. **Povežite** s postojećim hosting accountom
5. **Aktiviraj SSL** (Korak 2 gore)

### Opcija 2: DNS Postavke

Provjerite DNS postavke za `uslugar.oriphiel.hr`:

1. **DNS A Record** trebao bi pokazivati na: `194.5.156.10`
2. **DNS CNAME** (ako koristite subdomenu)

**Provjeri DNS:**
```powershell
nslookup uslugar.oriphiel.hr
# ili
Resolve-DnsName uslugar.oriphiel.hr
```

---

## 📋 Checklist

- [ ] `uslugar.oriphiel.hr` je dodana kao domena u Hostingeru
- [ ] DNS postavke su ispravne (A record → 194.5.156.10)
- [ ] SSL certifikat je aktiviran u Hostinger Control Panelu
- [ ] SSL status je "Active" (ne "Pending")
- [ ] HTTPS radi u browseru (`https://uslugar.oriphiel.hr`)
- [ ] 🔒 ikona vidljiva u adresnoj traci
- [ ] Redirect radi (`https://uslugar.oriph.io` → `https://uslugar.oriphiel.hr`)

---

## 🐛 Troubleshooting

### Problem: SSL se ne aktivira

**Rješenja:**
1. Provjerite da li je domena pravilno povezana s hostingom
2. Provjerite DNS postavke (A record)
3. Pričekajte 30 minuta (DNS propagation)
4. Kontaktirajte Hostinger podršku

### Problem: SSL je aktivan ali i dalje dobivate grešku

**Rješenja:**
1. **Clear browser cache** (Ctrl + Shift + R)
2. **Provjerite** da li SSL certifikat pokriva `uslugar.oriphiel.hr`
3. **Provjerite** da li nema mixed content warnings
4. **Provjerite** `.htaccess` redirect (možda blokira SSL)

### Problem: DNS ne pokazuje na ispravnu IP

**Rješenje:**
1. Provjerite DNS postavke u vašem domain provideru
2. A record trebao bi biti: `uslugar.oriphiel.hr` → `194.5.156.10`
3. Pričekajte DNS propagation (može potrajati do 48 sati)

---

## 📞 Podrška

Ako imate problema:
- **Hostinger Live Chat:** Dostupan 24/7 u Control Panelu
- **Email:** support@hostinger.com
- **Knowledge Base:** https://support.hostinger.com/

---

## ⚠️ Važno

**Dok SSL nije aktiviran:**
- ❌ `https://uslugar.oriphiel.hr` neće raditi
- ✅ `http://uslugar.oriphiel.hr` može raditi (ali nije siguran)
- ✅ Redirect s `https://uslugar.oriph.io` će raditi, ali će browser prikazati upozorenje

**Nakon aktivacije SSL:**
- ✅ `https://uslugar.oriphiel.hr` će raditi
- ✅ Redirect će raditi bez upozorenja
- ✅ SSL Labs test će proći

