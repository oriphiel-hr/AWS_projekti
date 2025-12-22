# 📤 Upload JavaScript Fajlova - FileZilla Vodič

## 🎯 Cilj

Upload novog JavaScript builda na server da se riješi redirect problem.

---

## 📋 Koraci

### Korak 1: Otvori FileZilla

1. **Otvori FileZilla**
2. **File** → **Site Manager** (ili `Ctrl+S`)

### Korak 2: Connect na Server

**Kreiraj novi site:**
- **Host:** `194.5.156.10`
- **Port:** `21`
- **Protocol:** `FTP - File Transfer Protocol`
- **Logon Type:** `Normal`
- **User:** `u208993221`
- **Password:** `G73S3ebakh6O!`

**Ili direktno connect:**
- **Quickconnect** → Unesi credentials

### Korak 3: Navigiraj do Direktorija

**Lijeva strana (Local site):**
```
C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend\dist\assets\
```

**Desna strana (Remote site):**
```
public_html/uslugar/assets/
```

### Korak 4: Upload Fajlova

**Fajlovi za upload:**
- `index-Dkb1Bl1j.js` (JavaScript build)
- `index-BoZZd6o1.css` (CSS build)

**Upload:**
1. **Selektuj** oba fajla u lijevom prozoru
2. **Drag & drop** u desni prozor (`assets/` direktorij)
3. **Overwrite** kada pita (sve postojeće fajlove)

### Korak 5: Provjeri Upload

**Desna strana (Remote):**
- Provjeri da li su fajlovi uploadani
- Provjeri da li su datumi ažurirani

### Korak 6: Test

1. **Otvori browser**
2. **Hard Refresh:** `Ctrl + Shift + R`
3. **Otvori:** `https://uslugar.oriph.io/`
4. **Provjeri** da li NEMA redirecta na `uslugar.oriphiel.hr`

---

## 🔍 Alternativno: Upload Cijelog Builda

**Ako želiš uploadati cijeli build:**

**Lijevo (Local):**
```
C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\frontend\dist\
```

**Desno (Remote):**
```
public_html/uslugar/
```

**Upload:**
- Selektuj **SVE** fajlove iz `dist/` direktorija
- Drag & drop u `public_html/uslugar/`
- Overwrite sve postojeće fajlove

---

## ✅ Checklist

- [ ] **FileZilla connect** - Uspješno spojen na server
- [ ] **Navigirao** do ispravnih direktorija
- [ ] **Uploadao** JavaScript fajlove (index-*.js)
- [ ] **Uploadao** CSS fajlove (index-*.css)
- [ ] **Overwrite** postojeće fajlove
- [ ] **Provjereno** da su fajlovi uploadani
- [ ] **Hard Refresh** u browseru
- [ ] **Test** - `https://uslugar.oriph.io/` radi bez redirecta

---

## 🎯 Očekivani Rezultat

Nakon uploada:
- ✅ `https://uslugar.oriph.io/` radi normalno
- ✅ Nema redirecta na `uslugar.oriphiel.hr`
- ✅ JavaScript fajl je ažuriran na serveru

---

## 🔧 Troubleshooting

### Problem: "530 Not logged in"

**Rješenje:**
- Provjeri credentials
- Provjeri da li je FTP omogućen na Hostingeru
- Pokušaj s drugim FTP hostname-om (npr. `ftp.oriph.io`)

### Problem: "Connection timeout"

**Rješenje:**
- Provjeri firewall postavke
- Provjeri da li je FTP port 21 otvoren
- Pokušaj s pasivnim FTP modom

### Problem: Fajlovi se ne uploadaju

**Rješenje:**
- Provjeri dozvole na serveru
- Provjeri da li imaš write pristup
- Kontaktiraj Hostinger support

