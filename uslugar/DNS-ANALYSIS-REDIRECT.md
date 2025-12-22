# 🔍 DNS Analiza - Redirect Problem

## DNS Rezultati

### A Records za `uslugar.oriph.io`:
```
92.113.16.14
92.113.23.39
```

**Napomena:** Ove IP adrese nisu `194.5.156.10` (koja je bila spomenuta ranije). To znači da DNS možda nije ispravno postavljen ili je promijenjen.

---

## 🔍 Provjera

### 1. Provjeri HTTP Headers

**Redirect se može dešavati na nekoliko načina:**

#### A. Server-side redirect (HTTP 301/302)
```powershell
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -Method Head -MaximumRedirection 0
$response.Headers.Location  # Ako postoji, redirect je na serveru
```

#### B. HTML meta refresh
```html
<meta http-equiv="refresh" content="0; url=https://uslugar.oriphiel.hr">
```

#### C. JavaScript redirect
```javascript
window.location.href = 'https://uslugar.oriphiel.hr';
```

---

## 🔧 Mogući Uzroci

### 1. Hostinger Control Panel Redirect

**Najvjerojatniji uzrok:**

1. **Login:** https://hpanel.hostinger.com
2. **Websites** → **uslugar.oriph.io**
3. **Redirects** ili **Domain Redirects**
4. **Provjeri** da li postoji redirect na `uslugar.oriphiel.hr`
5. **Obriši** ako postoji

### 2. DNS CNAME (ali nije pronađen)

DNS pokazuje samo A records, nema CNAME. To je dobro.

### 3. Stari Build Fajlovi na Serveru

**Ako novi build nije uploadan:**
- Stari `index.html` ili JavaScript fajlovi mogu sadržavati redirect
- **Rješenje:** Upload novi build preko FileZilla

### 4. CDN/Proxy Cache

**Ako koristiš CDN:**
- CloudFlare
- Hostinger CDN
- Proxy server

**Rješenje:**
- Clear CDN cache
- Provjeri CDN redirect pravila

---

## 📋 Koraci za Rješavanje

### Korak 1: Provjeri Hostinger Control Panel

1. **Login:** https://hpanel.hostinger.com
2. **Websites** → **uslugar.oriph.io**
3. **Redirects** ili **Domain Settings**
4. **Provjeri** redirect pravila
5. **Obriši** ako postoji redirect na `oriphiel.hr`

### Korak 2: Provjeri HTTP Response

```powershell
# Provjeri headers
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -Method Head -MaximumRedirection 0
$response.Headers.Location

# Provjeri HTML content
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -UseBasicParsing
$response.Content | Select-String -Pattern "oriphiel\.hr"
```

### Korak 3: Upload Novi Build

**Ako stari build još uvijek postoji na serveru:**

1. **FileZilla:**
   - Connect: `92.113.16.14` ili `92.113.23.39` (ili FTP hostname)
   - Upload sve iz `uslugar/frontend/dist/`
   - Overwrite postojeće fajlove

2. **Provjeri** da li novi build sadrži `oriphiel.hr`:
   ```powershell
   # Lokalno
   Get-Content "uslugar/frontend/dist/index.html" | Select-String -Pattern "oriphiel"
   ```

### Korak 4: Clear Cache

1. **Browser cache:** `Ctrl + Shift + R`
2. **CDN cache:** CloudFlare/Hostinger Control Panel
3. **DNS cache:** `ipconfig /flushdns` (Windows)

---

## 🎯 Očekivani Rezultat

Nakon rješavanja:
- ✅ `https://uslugar.oriph.io` radi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ HTTP headers ne sadrže `Location` header
- ✅ HTML ne sadrži `oriphiel.hr` ili redirect kod

---

## 🔍 Debugging Commands

### Provjeri DNS:
```powershell
Resolve-DnsName -Name "uslugar.oriph.io" -Type A
Resolve-DnsName -Name "uslugar.oriph.io" -Type CNAME
```

### Provjeri HTTP Response:
```powershell
# Head request (bez redirecta)
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -Method Head -MaximumRedirection 0

# Full request (sa redirectom)
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -UseBasicParsing
$response.BaseResponse.ResponseUri  # Gdje je završio
```

### Provjeri HTML Content:
```powershell
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -UseBasicParsing
$response.Content | Select-String -Pattern "oriphiel|window\.location|meta.*refresh"
```

---

## ✅ Checklist

- [ ] **DNS A Records** - Provjeren (92.113.16.14, 92.113.23.39)
- [ ] **DNS CNAME** - Provjeren (nema)
- [ ] **HTTP Headers** - Provjeren (nema Location header)
- [ ] **HTML Content** - Provjeren (nema oriphiel.hr)
- [ ] **Hostinger Control Panel** - Provjeren redirect
- [ ] **Build Fajlovi** - Uploadani novi build
- [ ] **Browser Cache** - Očišćen
- [ ] **CDN Cache** - Očišćen

