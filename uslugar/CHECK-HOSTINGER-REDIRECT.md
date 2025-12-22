# 🔍 Provjera Hostinger Redirect-a

## Problem

Stranica se još uvijek preusmjerava na `https://uslugar.oriphiel.hr/` iako su svi kod i `.htaccess` promjene revertane.

---

## ✅ Što je provjereno

1. ✅ **Build fajlovi** - Nema `oriphiel.hr` u novom buildu
2. ✅ **Source kod** - Nema redirect logike u kodu
3. ✅ **`.htaccess`** - Bez redirect pravila
4. ✅ **HTTP Headers** - Provjeri da li server šalje redirect

---

## 🔍 Mogući uzroci

### 1. Hostinger Control Panel Redirect

**Hostinger možda ima redirect postavljen u Control Panelu:**

1. **Login na Hostinger Control Panel**
2. **Websites** → **uslugar.oriph.io**
3. **Redirects** ili **Domain Redirects**
4. **Provjeri** da li postoji redirect na `uslugar.oriphiel.hr`
5. **Obriši** ako postoji

### 2. DNS CNAME Redirect

**Provjeri DNS postavke:**

```powershell
# Provjeri DNS za uslugar.oriph.io
Resolve-DnsName -Name "uslugar.oriph.io" -Type A
Resolve-DnsName -Name "uslugar.oriph.io" -Type CNAME
```

**Ako postoji CNAME na `uslugar.oriphiel.hr`, to može uzrokovati redirect.**

### 3. CDN/Proxy Cache

**Ako koristiš CDN ili proxy:**
- CloudFlare
- Hostinger CDN
- Proxy server

**Rješenje:**
- Clear CDN cache
- Provjeri CDN redirect pravila

### 4. Browser Extension

**Neki browser extensioni mogu redirectati:**
- Ad blockers
- Privacy extensions
- Security extensions

**Rješenje:**
- Testiraj u Incognito (bez extensions)
- Disable extensions

---

## 🔧 Rješenja

### Korak 1: Provjeri Hostinger Control Panel

1. **Login:** https://hpanel.hostinger.com
2. **Websites** → **uslugar.oriph.io**
3. **Redirects** ili **Domain Settings**
4. **Provjeri** redirect pravila
5. **Obriši** ako postoji redirect na `oriphiel.hr`

### Korak 2: Provjeri DNS

```powershell
# Provjeri A Record
Resolve-DnsName -Name "uslugar.oriph.io" -Type A

# Provjeri CNAME
Resolve-DnsName -Name "uslugar.oriph.io" -Type CNAME

# Očekivano:
# A Record: 194.5.156.10
# CNAME: Nema (ili ne pokazuje na oriphiel.hr)
```

### Korak 3: Provjeri HTTP Headers

```powershell
# Provjeri da li server šalje redirect
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -Method Head -MaximumRedirection 0
$response.Headers.Location  # Trebao bi biti prazan
```

### Korak 4: Clear CDN Cache

**Ako koristiš CloudFlare:**
1. Login na CloudFlare
2. **Caching** → **Configuration**
3. **Purge Everything**

**Ako koristiš Hostinger CDN:**
1. Hostinger Control Panel
2. **CDN** ili **Performance**
3. **Clear Cache**

---

## 📋 Checklist

- [ ] **Hostinger Control Panel** - Provjeren redirect
- [ ] **DNS A Record** - Provjeren (194.5.156.10)
- [ ] **DNS CNAME** - Provjeren (nema)
- [ ] **HTTP Headers** - Provjeren (nema Location header)
- [ ] **CDN Cache** - Očišćen
- [ ] **Browser Cache** - Očišćen (Ctrl + Shift + R)
- [ ] **Incognito Test** - Testiran (bez extensions)

---

## 🎯 Ako Problem Persistira

### Kontaktiraj Hostinger Support

**Ako redirect postoji u Control Panelu ali ga ne možeš obrisati:**

1. **Support Ticket** na Hostingeru
2. **Zahtjev:** "Ukloni redirect sa `uslugar.oriph.io` na `uslugar.oriphiel.hr`"
3. **Obrazloženje:** "Redirect nije potreban, želim da `uslugar.oriph.io` radi normalno"

---

## ✅ Očekivani Rezultat

Nakon rješavanja:
- ✅ `https://uslugar.oriph.io` radi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Stranica se učitava na `uslugar.oriph.io`

