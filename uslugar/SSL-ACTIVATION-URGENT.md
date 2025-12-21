# 🔒 SSL Aktivacija - HITNO

## ❌ Problem

```
ERR_SSL_PROTOCOL_ERROR
uslugar.oriphiel.hr je odgovor koji nije valjan.
```

**Razlog:** SSL certifikat **NIJE instaliran/aktivan** za `uslugar.oriphiel.hr`.

---

## ✅ Rješenje: Aktiviraj SSL na Account 2

### Korak 1: Prijava u Hostinger Control Panel (Account 2)

1. **Idite na:** https://www.hostinger.com/cpanel
2. **Prijavite se** s Account 2 credentials
3. **Odaberite** `oriphiel.hr` domenu

### Korak 2: Aktiviraj SSL za uslugar.oriphiel.hr

1. **Idite u:** Websites → SSL (ili Security → SSL)
2. **Pronađite** `uslugar.oriphiel.hr` u listi domena
3. **Kliknite** "Manage" ili "SSL" pored domene
4. **Odaberite** "Lifetime SSL" (besplatni SSL certifikat)
5. **Kliknite** "Activate" ili "Install"

### Korak 3: Čekaj aktivaciju

- SSL aktivacija može potrajati **5-30 minuta**
- Provjerite status u Control Panelu
- Status trebao bi biti **"Active"** (ne "Pending")

### Korak 4: Provjeri SSL

**Browser:**
1. Otvorite: `https://uslugar.oriphiel.hr`
2. Provjerite da li vidite 🔒 ikonu u adresnoj traci
3. Provjerite da li nema greške

**Komandna linija:**
```powershell
Invoke-WebRequest -Uri "https://uslugar.oriphiel.hr" -Method Head
```

---

## 🔍 Ako uslugar.oriphiel.hr Nije u SSL Listi

### Problem: Domena nije vidljiva u SSL listi

**Rješenja:**

#### Opcija 1: Provjeri da li je domena dodana u Hostinger

1. **Hostinger Control Panel** → **Domains**
2. **Provjeri** da li postoji `uslugar.oriphiel.hr`
3. Ako ne postoji:
   - **Add Domain** ili **Add Subdomain**
   - **Unesite:** `uslugar.oriphiel.hr`
   - **Povežite** s Account 2 hosting accountom

#### Opcija 2: Provjeri DNS Postavke

**DNS A Record mora biti postavljen:**
```
Name: uslugar
Points to: 194.5.156.10
TTL: 3600
```

**Provjeri DNS:**
```powershell
Resolve-DnsName -Name "uslugar.oriphiel.hr" -Type A
# Trebao bi vratiti: 194.5.156.10
```

**Ako DNS ne pokazuje na 194.5.156.10:**
1. **DNS Zone Editor** → `oriphiel.hr` domena
2. **Add A Record:**
   - Name: `uslugar`
   - Points to: `194.5.156.10`
   - TTL: `3600`
3. **Pričekaj** DNS propagation (5-30 minuta)

#### Opcija 3: Kontaktiraj Hostinger Podršku

Ako domena ne postoji ili SSL se ne može aktivirati:
- **Hostinger Live Chat:** Dostupan 24/7 u Control Panelu
- **Email:** support@hostinger.com
- **Objašnjenje:** "Trebam aktivirati SSL za subdomenu uslugar.oriphiel.hr"

---

## ⚠️ Važno

### Dok SSL Nije Aktivan:

- ❌ `https://uslugar.oriphiel.hr` **NEĆE raditi**
- ❌ `https://uslugar.oriphiel.hr/admin/User` **NEĆE raditi**
- ❌ Browser će prikazati `ERR_SSL_PROTOCOL_ERROR`
- ✅ `http://uslugar.oriphiel.hr` **MOŽE raditi** (ali nije siguran)

### Nakon Aktivacije SSL:

- ✅ `https://uslugar.oriphiel.hr` **ĆE raditi**
- ✅ `https://uslugar.oriphiel.hr/admin/User` **ĆE raditi**
- ✅ Browser će prikazati 🔒 ikonu
- ✅ Nema SSL grešaka

---

## 📋 Checklist

- [ ] **DNS A Record** postavljen → `uslugar.oriphiel.hr` → `194.5.156.10`
- [ ] **Domena dodana** u Hostinger (Account 2)
- [ ] **SSL aktiviran** za `uslugar.oriphiel.hr`
- [ ] **SSL status** je "Active" (ne "Pending")
- [ ] **HTTPS radi** u browseru (`https://uslugar.oriphiel.hr`)
- [ ] **🔒 ikona** vidljiva u adresnoj traci
- [ ] **Admin stranica radi** (`https://uslugar.oriphiel.hr/admin/User`)

---

## 🔍 Provjera Nakon Aktivacije

### Browser Test:
1. Otvorite: `https://uslugar.oriphiel.hr`
2. Provjerite da li vidite 🔒 ikonu
3. Provjerite da li nema greške
4. Testirajte: `https://uslugar.oriphiel.hr/admin/User`

### SSL Labs Test:
- https://www.ssllabs.com/ssltest/analyze.html?d=uslugar.oriphiel.hr
- Provjerite ocjenu (trebala bi biti A ili A+)

### Komandna linija:
```powershell
# Provjeri SSL
Invoke-WebRequest -Uri "https://uslugar.oriphiel.hr" -Method Head

# Provjeri admin stranicu
Invoke-WebRequest -Uri "https://uslugar.oriphiel.hr/admin/User" -Method Head
```

---

## 🐛 Troubleshooting

### Problem: SSL se ne aktivira

**Rješenja:**
1. Provjerite da li je domena pravilno povezana s Account 2
2. Provjerite DNS postavke (A Record → 194.5.156.10)
3. Pričekajte 30 minuta (DNS propagation)
4. Kontaktirajte Hostinger podršku

### Problem: SSL je aktivan ali i dalje dobivate grešku

**Rješenja:**
1. **Clear browser cache** (Ctrl + Shift + R)
2. **Provjerite** da li SSL certifikat pokriva `uslugar.oriphiel.hr`
3. **Provjerite** da li nema mixed content warnings
4. **Pričekajte** 5-10 minuta (SSL propagation)

### Problem: DNS ne pokazuje na ispravnu IP

**Rješenje:**
1. Provjerite DNS postavke u Hostinger Control Panelu
2. A Record trebao bi biti: `uslugar.oriphiel.hr` → `194.5.156.10`
3. Pričekajte DNS propagation (može potrajati do 48 sati)

---

## 📞 Podrška

Ako imate problema:
- **Hostinger Live Chat:** Dostupan 24/7 u Control Panelu
- **Email:** support@hostinger.com
- **Knowledge Base:** https://support.hostinger.com/

---

## 🎯 Sljedeći Koraci

1. **Aktiviraj SSL** za `uslugar.oriphiel.hr` (Account 2)
2. **Pričekaj** 5-30 minuta za aktivaciju
3. **Provjeri** `https://uslugar.oriphiel.hr` u browseru
4. **Testiraj** admin stranicu: `https://uslugar.oriphiel.hr/admin/User`

---

## ✅ Sažetak

**Problem:** SSL certifikat nije instaliran/aktivan za `uslugar.oriphiel.hr`

**Rješenje:**
1. Hostinger Control Panel (Account 2) → Websites → SSL
2. Aktiviraj "Lifetime SSL" za `uslugar.oriphiel.hr`
3. Pričekaj 5-30 minuta
4. Provjeri u browseru

**Nakon aktivacije:** `https://uslugar.oriphiel.hr/admin/User` će raditi!

