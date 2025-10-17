# DEPLOY FRONTEND - Brzi vodič

## 📦 Datoteke za FTP upload

Deploy ove datoteke iz `uslugar/frontend/dist/`:

```
uslugar/frontend/dist/
├── index.html ⭐ AŽURIRANO (sa favicon)
├── uslugar.ico
└── assets/
    ├── index-BD2def_i.css
    ├── index-C-LhMFtS.js
    ├── css/
    │   └── style.css
    └── js/
        └── crud.js
```

## 🎯 FTP Upload lokacija

**Upload na:** `/domains/uslugar.oriph.io/public_html/`

Sve datoteke iz `dist/` foldera trebaju ići u root public_html direktorij.

## ✅ Rezultat

Nakon uploada, frontend će biti dostupan na:
- https://uslugar.oriph.io

Favicon će biti vidljiv i 404 greška za favicon.ico će nestati.

## ⚠️ ALI PAŽNJA!

Frontend će raditi, ali **API pozivi će i dalje vraćati 404** jer **BACKEND NIJE DEPLOYOVAN**.

Slijedi korak 2: Deploy backend-a.

