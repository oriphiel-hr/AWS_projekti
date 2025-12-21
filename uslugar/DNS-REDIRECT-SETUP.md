# 🌐 DNS Postavke za Redirect - Vodič

## ❓ Pitanje: Trebaju li CNAME zapisi za redirect?

**Odgovor: NE, CNAME zapisi NISU potrebni za redirect.**

Redirect se radi preko **.htaccess** fajla, ne preko DNS-a.

---

## ✅ Što je potrebno: A Record zapisi

### Za uslugar.oriph.io (stara domena)
**A Record:**
```
Type: A
Name: uslugar (ili @ ako je root)
Points to: 194.5.156.10
TTL: 3600
```

### Za uslugar.oriphiel.hr (nova domena)
**A Record:**
```
Type: A
Name: uslugar (ili @ ako je root)
Points to: 194.5.156.10
TTL: 3600
```

**OBAJE domene trebaju pokazivati na ISTU IP adresu (194.5.156.10)**

---

## 🔄 Kako Redirect Radi

### 1. DNS (A Record)
- **Svrha:** Pokazuje domenu na IP adresu servera
- **uslugar.oriph.io** → `194.5.156.10`
- **uslugar.oriphiel.hr** → `194.5.156.10`
- **Oba pokazuju na isti server**

### 2. .htaccess (Redirect)
- **Svrha:** Preusmjerava korisnike s jedne domene na drugu
- **uslugar.oriph.io** → preusmjerava na → **uslugar.oriphiel.hr**
- **Lokacija:** `public_html/.htaccess`

---

## 📋 Provjera DNS Postavki

### Provjeri A Record za uslugar.oriph.io:
```powershell
Resolve-DnsName -Name "uslugar.oriph.io" -Type A
# Trebao bi vratiti: 194.5.156.10
```

### Provjeri A Record za uslugar.oriphiel.hr:
```powershell
Resolve-DnsName -Name "uslugar.oriphiel.hr" -Type A
# Trebao bi vratiti: 194.5.156.10
```

### Online provjera:
- https://www.whatsmydns.net/#A/uslugar.oriph.io
- https://www.whatsmydns.net/#A/uslugar.oriphiel.hr

---

## 🔧 Ako DNS Nije Ispravno Postavljen

### Problem: uslugar.oriph.io ne pokazuje na 194.5.156.10

**Rješenje:**
1. **Idite u Hostinger Control Panel**
2. **DNS Zone Editor** (ili **DNS Management**)
3. **Pronađite** `uslugar.oriph.io` A record
4. **Ažurirajte** da pokazuje na `194.5.156.10`
5. **Pričekajte** DNS propagation (5-30 minuta)

### Problem: uslugar.oriphiel.hr ne pokazuje na 194.5.156.10

**Rješenje:**
1. **Idite u Hostinger Control Panel**
2. **DNS Zone Editor** (ili **DNS Management**)
3. **Dodajte** A record za `uslugar.oriphiel.hr`:
   - Type: A
   - Name: uslugar
   - Points to: 194.5.156.10
   - TTL: 3600
4. **Pričekajte** DNS propagation (5-30 minuta)

---

## ❌ CNAME vs A Record

### CNAME (Canonical Name)
- **Svrha:** Alias za drugu domenu
- **Primjer:** `www.uslugar.oriph.io` → CNAME → `uslugar.oriph.io`
- **NE koristi se za redirect!**

### A Record
- **Svrha:** Pokazuje domenu na IP adresu
- **Primjer:** `uslugar.oriph.io` → A Record → `194.5.156.10`
- **Koristi se za pokazivanje domene na server**

---

## ✅ Checklist

- [ ] **uslugar.oriph.io** ima A record → `194.5.156.10`
- [ ] **uslugar.oriphiel.hr** ima A record → `194.5.156.10`
- [ ] **.htaccess** fajl je uploadan u `public_html/`
- [ ] **SSL** je aktiviran za `uslugar.oriphiel.hr`
- [ ] **Redirect** radi (`https://uslugar.oriph.io` → `https://uslugar.oriphiel.hr`)

---

## 🔍 Troubleshooting

### Problem: Redirect ne radi

**Provjeri:**
1. ✅ DNS A record za obje domene pokazuje na `194.5.156.10`
2. ✅ `.htaccess` fajl je u `public_html/` direktoriju
3. ✅ `.htaccess` sadrži redirect pravila
4. ✅ SSL je aktiviran za novu domenu

### Problem: DNS ne propagira

**Rješenja:**
1. Pričekajte 5-30 minuta (DNS propagation)
2. Provjerite DNS postavke u Hostinger Control Panelu
3. Provjerite DNS postavke u domain provideru (ako nije Hostinger)
4. Očistite DNS cache: `ipconfig /flushdns` (Windows)

---

## 📞 Podrška

Ako imate problema:
- **Hostinger Live Chat:** Dostupan 24/7 u Control Panelu
- **Email:** support@hostinger.com

---

## 🎯 Sažetak

**NE trebaju CNAME zapisi za redirect.**

**Trebaju:**
- ✅ A Record za `uslugar.oriph.io` → `194.5.156.10`
- ✅ A Record za `uslugar.oriphiel.hr` → `194.5.156.10`
- ✅ `.htaccess` fajl za redirect (već kreiran)
- ✅ SSL za `uslugar.oriphiel.hr` (treba aktivirati)

