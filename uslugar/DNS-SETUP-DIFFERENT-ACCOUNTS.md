# 🌐 DNS Postavke - Različiti Hostinger Računi

## 📋 Pregled

Kada su domene na **različitim Hostinger računima**, svaka domena ima **svoju IP adresu** i **svoje DNS postavke**.

---

## 🔧 Account 1: uslugar.oriph.io (Stara Domena)

### DNS Postavke

**A Record:**
```
Type: A
Name: uslugar (ili @ za root)
Points to: [IP adresa Account 1]
TTL: 3600
```

**Gdje provjeriti:**
- Hostinger Control Panel → Account 1
- DNS Zone Editor → `oriph.io` domena
- Provjeri postojeći A Record

**Trenutno stanje:**
- DNS pokazuje na IP adresu Account 1 (npr. 147.79.119.46 ili 193.58.105.184)
- **NE mijenjaj ovaj A Record!** (već je ispravno postavljen)

### Što Treba Napraviti

1. **Upload .htaccess fajl:**
   - Lokacija: `public_html/.htaccess`
   - Sadržaj: Redirect pravila (već kreiran fajl)
   - FTP: Spoji se na Account 1 FTP

2. **Provjeri SSL:**
   - SSL treba biti aktivan za `uslugar.oriph.io`
   - (Za HTTPS redirect)

3. **Provjeri DNS:**
   - A Record već postoji i pokazuje na Account 1 IP
   - **Nema potrebe za promjenama!**

---

## 🔧 Account 2: uslugar.oriphiel.hr (Nova Domena)

### DNS Postavke

**A Record:**
```
Type: A
Name: uslugar (ili @ za root)
Points to: 194.5.156.10
TTL: 3600
```

**Gdje postaviti:**
- Hostinger Control Panel → Account 2
- DNS Zone Editor → `oriphiel.hr` domena
- Add A Record

**Kako dodati:**
1. **Idite u:** DNS Zone Editor (Account 2)
2. **Pronađite:** `oriphiel.hr` domenu
3. **Add A Record:**
   - **Name:** `uslugar`
   - **Points to:** `194.5.156.10`
   - **TTL:** `3600`
4. **Save**

### Što Treba Napraviti

1. **DNS A Record:**
   - ✅ Dodaj A Record za `uslugar` → `194.5.156.10`
   - (Ako već ne postoji)

2. **SSL Certifikat:**
   - Aktiviraj SSL za `uslugar.oriphiel.hr`
   - Lifetime SSL (besplatni)
   - Lokacija: Websites → SSL

3. **Frontend Deployment:**
   - Upload frontend fajlove u `public_html/`
   - (Normalni deployment proces)

4. **.htaccess:**
   - ❌ **NE treba redirect .htaccess ovdje!**
   - (Redirect je na Account 1)

---

## 📊 DNS Postavke - Pregled

### Account 1 (uslugar.oriph.io):
```
DNS Zone: oriph.io
A Record:
  Name: uslugar
  Points to: [IP Account 1] (npr. 147.79.119.46)
  TTL: 3600
Status: ✅ Već postavljen (ne mijenjaj)
```

### Account 2 (uslugar.oriphiel.hr):
```
DNS Zone: oriphiel.hr
A Record:
  Name: uslugar
  Points to: 194.5.156.10
  TTL: 3600
Status: ⚠️ Treba dodati (ako ne postoji)
```

---

## ✅ Checklist

### Account 1 (uslugar.oriph.io):
- [x] **DNS A Record** → Već postavljen (Account 1 IP)
- [ ] **.htaccess fajl** → Upload u `public_html/`
- [ ] **SSL aktivan** → Provjeri status
- [ ] **Redirect testiran** → `https://uslugar.oriph.io` → `https://uslugar.oriphiel.hr`

### Account 2 (uslugar.oriphiel.hr):
- [ ] **DNS A Record** → Dodaj `uslugar` → `194.5.156.10`
- [ ] **SSL aktivan** → Aktiviraj Lifetime SSL
- [ ] **Frontend deploymentan** → Upload u `public_html/`
- [ ] **Stranica radi** → `https://uslugar.oriphiel.hr`

---

## 🔍 Provjera DNS Postavki

### Provjeri Account 1 DNS:
```powershell
Resolve-DnsName -Name "uslugar.oriph.io" -Type A
# Trebao bi vratiti: IP adresa Account 1
```

### Provjeri Account 2 DNS:
```powershell
Resolve-DnsName -Name "uslugar.oriphiel.hr" -Type A
# Trebao bi vratiti: 194.5.156.10
```

**OBAJE trebaju vratiti RAZLIČITE IP adrese!**

---

## 🎯 Kako Redirect Radi

### Flow:
```
1. Korisnik → https://uslugar.oriph.io
   ↓
2. DNS → Account 1 IP (stara domena)
   ↓
3. Apache na Account 1 → čita .htaccess
   ↓
4. .htaccess → redirect na uslugar.oriphiel.hr
   ↓
5. Browser → https://uslugar.oriphiel.hr
   ↓
6. DNS → Account 2 IP (194.5.156.10)
   ↓
7. Apache na Account 2 → servira stranicu
```

---

## ⚠️ Važne Napomene

### 1. Različite IP Adrese
- **Account 1:** Svoja IP adresa (npr. 147.79.119.46)
- **Account 2:** Svoja IP adresa (194.5.156.10)
- **To je normalno i ispravno!**

### 2. .htaccess Lokacija
- ✅ **Account 1:** `.htaccess` s redirect pravilima
- ❌ **Account 2:** NE treba redirect .htaccess

### 3. DNS Ne Mijenja IP
- **Account 1:** A Record pokazuje na Account 1 IP (ne mijenjaj!)
- **Account 2:** A Record pokazuje na Account 2 IP (194.5.156.10)

---

## 🔧 Troubleshooting

### Problem: uslugar.oriphiel.hr ne radi

**Provjeri:**
1. ✅ DNS A Record postavljen → `194.5.156.10`
2. ✅ SSL aktivan za `uslugar.oriphiel.hr`
3. ✅ Frontend deploymentan u `public_html/`
4. ✅ DNS propagation (pričekaj 5-30 minuta)

### Problem: Redirect ne radi

**Provjeri:**
1. ✅ `.htaccess` je na **Account 1** (stara domena)
2. ✅ `.htaccess` sadrži ispravna redirect pravila
3. ✅ SSL aktivan za obje domene
4. ✅ DNS zapisi su ispravni (različite IP adrese)

---

## 📞 Podrška

Ako imate problema:
- **Hostinger Live Chat:** Dostupan 24/7 u Control Panelu
- **Email:** support@hostinger.com

---

## 🎯 Sažetak

**Account 1 (uslugar.oriph.io):**
- ✅ DNS A Record → Već postavljen (ne mijenjaj)
- ⚠️ `.htaccess` → Upload redirect pravila
- ⚠️ SSL → Provjeri status

**Account 2 (uslugar.oriphiel.hr):**
- ⚠️ DNS A Record → Dodaj `uslugar` → `194.5.156.10`
- ⚠️ SSL → Aktiviraj Lifetime SSL
- ⚠️ Frontend → Normalni deployment

**Ključna stvar:** Svaka domena ima svoju IP adresu i svoje DNS postavke!

