# 🔄 KYC Auto-Verification API Status

## ⏸️ TRENUTNO STANJE: DISABLED (Temporary)

**Status:** API integration je komentiran dok se ne potvrdi da credentials rade.

**Što to znači:**
- ✅ Backend code je spreman
- ✅ GitHub Actions workflow ima credentials
- ⏸️ API poziv je privremeno onemogućen
- 📄 Sve DOO tvrtke moraju uploadati dokument

---

## 🎯 Kako Omogućiti API

### Fajl: `uslugar/backend/src/routes/kyc.js`

**Trenutno (linija 211-302):**
```javascript
/*
// REAL API LOGIC - Sudski registar
try {
  // ... API code ...
}
*/
```

**Da omogućiš:**
1. Odkomentiraj linije 211-302
2. Commit i push: `git commit -m "enable: Sudreg API verification" && git push`

---

## ✅ Što je Već Postavljeno

### 1. GitHub Actions Workflow
**Fajl:** `.github/workflows/backend-uslugar-ecs.yml` (linije 122-128)

```yaml
{
  "name": "SUDREG_CLIENT_ID",
  "value": "UcfrGwvRv3uGkqvYnUMxIA.."
},
{
  "name": "SUDREG_CLIENT_SECRET", 
  "value": "-TX-7q_UfffSEaRmGIP4bA.."
}
```

### 2. Backend Code
- ✅ OAuth 2.0 token request
- ✅ API call za provjeru OIB-a
- ✅ Error handling
- ✅ Fallback logika
- ✅ Detailed logging

### 3. Frontend UI
- ✅ Auto-verification trigger
- ✅ Loading states
- ✅ Success/Failure display
- ✅ Document upload fallback

---

## 🧪 Kako Testirati Kad API Bude Omogućen

### 1. CloudWatch Logs
Provjeri:
```
[Auto-Verify] ✅ Credentials found
[Auto-Verify] Requesting OAuth token...
[Auto-Verify] ✅ OAuth token received
[Auto-Verify] Checking OIB in Sudski registar: 88070789896
[Auto-Verify] ✅ VERIFIED via Sudski registar
```

### 2. Browser Console
**Success scenario:**
```javascript
{
  verified: true,
  needsDocument: false,
  badges: [{ type: 'SUDSKI', verified: true }]
}
```

**Failure scenario:**
```javascript
{
  verified: false,
  needsDocument: true,
  errors: ['Sudski registar provjera nije dostupna...']
}
```

---

## 🔧 Next Steps

**Da omogućiš API:**

1. **Provjeri da li credentials postoje u ECS:**
   - AWS Console → ECS → Task Definitions → Latest
   - Environment variables → Provjeri SUDREG_*

2. **Omogući API poziv:**
   - Odkomentiraj kod u `kyc.js` (linija 211-302)
   - Commit i push
   - Čekaj deployment (~10 min)

3. **Testiraj:**
   - Registracija s OIB: 88070789896
   - Provjeri CloudWatch logs
   - Vidjeti da li API poziv radi

---

## 📝 Zašto je Disabled

Ne mogu direktno pristupiti AWS Console i CloudWatch logs iz ovog okruženja da provjerim da li credentials rade. API je spreman, samo treba:

1. Potvrditi da credentials postoje u runtime-u
2. Omogućiti API poziv
3. Testirati i vidjeti rezultate

**Kad budeš spreman testirati API - samo odkomentiraj kod i push!**

