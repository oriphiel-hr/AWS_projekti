# 🔧 Rješavanje Root Redirect Problema

## 🔍 Problem

- ✅ `https://uslugar.oriph.io/admin/User#admin` - **RADI** (ne redirecta)
- ❌ `https://uslugar.oriph.io/` - **REDIRECTA** na `uslugar.oriphiel.hr`

**Zaključak:** Problem je specifičan za root URL (`/`), ne za sve URL-ove.

---

## ✅ Analiza

**Ako admin stranica radi:**
- ❌ Problem **NIJE** u browser cache-u (jer bi i admin redirectala)
- ❌ Problem **NIJE** u Service Worker cache-u (jer bi i admin redirectala)
- ✅ Problem **JE** specifičan za root URL (`/`)

---

## 🔍 Mogući Uzroci

### 1. Root `.htaccess` na Serveru

**Možda postoji `.htaccess` u `public_html/` (root) koji redirecta samo root:**

```apache
# Redirect samo root
RewriteRule ^$ https://uslugar.oriphiel.hr/ [R=301,L]
```

**Provjera:**
1. **FileZilla:**
   - Connect na server
   - Navigiraj do `public_html/` (root)
   - Provjeri da li postoji `.htaccess`
   - Download i provjeri sadržaj

### 2. `index.html` na Serveru Sadrži Redirect

**Možda `index.html` na serveru ima redirect kod:**

```html
<script>
  if (window.location.pathname === '/') {
    window.location.href = 'https://uslugar.oriphiel.hr';
  }
</script>
```

**Provjera:**
1. **FileZilla:**
   - Download `index.html` sa servera
   - Provjeri da li sadrži `oriphiel.hr` ili redirect kod

### 3. Hostinger Control Panel Redirect

**Možda postoji redirect u Hostinger Control Panelu samo za root:**

1. **Login:** https://hpanel.hostinger.com
2. **Websites** → **uslugar.oriph.io**
3. **Redirects** ili **Domain Redirects**
4. **Provjeri** da li postoji redirect samo za `/` (root)

---

## 🔧 Rješenje

### Korak 1: Provjeri Root `.htaccess`

**Preko FileZilla:**
1. **Connect:**
   - Host: `92.113.16.14` (ili FTP hostname)
   - Username: `u208993221`
   - Password: `G73S3ebakh6O!`

2. **Navigiraj:**
   - Do `public_html/` (root direktorij)
   - **Provjeri** da li postoji `.htaccess`

3. **Ako postoji:**
   - **Download** `.htaccess`
   - **Provjeri** da li sadrži redirect na `oriphiel.hr`
   - **Obriši** redirect pravilo ili cijeli fajl ako nije potreban

### Korak 2: Provjeri `index.html` na Serveru

**Preko FileZilla:**
1. **Navigiraj** do `public_html/uslugar/` (ili `public_html/`)
2. **Download** `index.html`
3. **Provjeri** da li sadrži:
   - `oriphiel.hr`
   - `window.location.href`
   - `meta refresh`
   - Redirect kod

4. **Ako sadrži redirect:**
   - **Upload** novi `index.html` iz `uslugar/frontend/dist/index.html`
   - **Overwrite** postojeći fajl

### Korak 3: Provjeri Hostinger Control Panel

1. **Login:** https://hpanel.hostinger.com
2. **Websites** → **uslugar.oriph.io**
3. **Redirects** ili **Domain Redirects**
4. **Provjeri** da li postoji redirect:
   - **From:** `/` ili `https://uslugar.oriph.io/`
   - **To:** `https://uslugar.oriphiel.hr`
5. **Obriši** ako postoji

---

## 📋 Checklist

- [ ] **Root `.htaccess` provjeren** - Nema redirect pravila
- [ ] **`index.html` na serveru provjeren** - Nema redirect koda
- [ ] **Hostinger Control Panel provjeren** - Nema redirecta
- [ ] **Novi build uploadan** - Overwrite postojeće fajlove
- [ ] **Test root URL** - `https://uslugar.oriph.io/` radi bez redirecta

---

## 🎯 Očekivani Rezultat

Nakon rješavanja:
- ✅ `https://uslugar.oriph.io/` radi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ Admin stranica i dalje radi
- ✅ Sve stranice rade normalno

---

## 🔍 Debugging Commands

### Provjeri root `.htaccess` preko curl:
```powershell
# Provjeri da li postoji redirect
curl.exe -I -L "https://uslugar.oriph.io/" 2>&1 | Select-String -Pattern "Location|HTTP"
```

### Provjeri `index.html` na serveru:
```powershell
# Download preko FileZilla i provjeri lokalno
Get-Content "downloaded-index.html" | Select-String -Pattern "oriphiel|window\.location|meta.*refresh"
```

---

## ✅ Finalni Korak

**Upload novi build na server:**

1. **FileZilla:**
   - Upload sve iz `uslugar/frontend/dist/`
   - **Overwrite** postojeće fajlove
   - **Posebno paziti** na `index.html`

2. **Provjeri root `.htaccess`:**
   - Ako postoji, obriši redirect pravilo

3. **Test:**
   - `https://uslugar.oriph.io/` - Trebao bi raditi bez redirecta

