# 🚀 Brzi Vodič - Preusmjeravanje Domene

## ✅ Što je već napravljeno:

1. ✅ **AWS Secrets Manager** - `FRONTEND_URL` ažuriran na `https://uslugar.oriphiel.hr`
2. ✅ **Backend kod** - sve default vrijednosti ažurirane
3. ✅ **Backend konfiguracija** - `ENV_EXAMPLE.txt` i `env.example` ažurirani
4. ✅ **.htaccess fajl** - kreiran i spreman za upload

---

## 📋 Sljedeći Koraci (Ručno):

### 1. Upload .htaccess na Hostinger

**Preko FTP:**
1. Spojite se na Hostinger FTP
2. Idite u `public_html/` direktorij
3. Uploadajte `.htaccess` fajl iz `uslugar/.htaccess`

**Preko File Manager:**
1. Hostinger Control Panel → File Manager
2. Otvorite `public_html/` direktorij
3. Kliknite "New File" → Nazovite `.htaccess`
4. Zalijepite sadržaj iz `uslugar/.htaccess`
5. Spremite

---

### 2. Provjeri SSL za novu domenu

Provjerite da li je SSL certifikat instaliran za `uslugar.oriphiel.hr`:
1. Hostinger Control Panel → Websites → SSL
2. Provjerite da li postoji SSL za `uslugar.oriphiel.hr`
3. Ako ne, aktivirajte SSL (vidi `HOSTINGER-SSL-SETUP.md`)

---

### 3. Test Redirect

**Browser:**
1. Otvorite: `https://uslugar.oriph.io`
2. Provjerite da li se automatski preusmjerava na `https://uslugar.oriphiel.hr`
3. Provjerite da li URL u browseru pokazuje novu domenu

**Komandna linija:**
```powershell
# Provjeri redirect
$response = Invoke-WebRequest -Uri "https://uslugar.oriph.io" -MaximumRedirection 0 -ErrorAction SilentlyContinue
$response.Headers.Location  # Trebao bi biti: https://uslugar.oriphiel.hr/
```

---

## ✅ Checklist

- [x] AWS Secrets Manager ažuriran
- [x] Backend kod ažuriran
- [x] .htaccess fajl kreiran
- [ ] .htaccess uploadan na Hostinger
- [ ] SSL provjeren za novu domenu
- [ ] Redirect testiran u browseru
- [ ] Redirect testiran preko komandne linije

---

## 🔍 Troubleshooting

### Problem: Redirect ne radi

**Rješenja:**
1. Provjerite da li je `.htaccess` fajl u `public_html/` direktoriju
2. Provjerite da li Hostinger podržava `.htaccess` (obično je po defaultu)
3. Provjerite da li je `mod_rewrite` omogućen

### Problem: SSL Error na novoj domeni

**Rješenje:**
- Instalirajte SSL certifikat za `uslugar.oriphiel.hr` (vidi `HOSTINGER-SSL-SETUP.md`)

---

## 📞 Podrška

Ako imate problema:
- **Hostinger Live Chat:** Dostupan 24/7 u Control Panelu
- **Email:** support@hostinger.com

