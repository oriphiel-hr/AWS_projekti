# 🔍 Debug KYC Auto-Verification Issues

## Problem
Svi OIB-ovi vraćaju FAILURE umjesto provjere u Sudskom registru.

---

## ✅ Uklonjeno
- ❌ Mock fallback za hardcodirane OIB-ove
- ✅ Detaljniji error logging dodan

## 🎯 Sada Treba Debugirati

### 1. Provjeri CloudWatch Logs

Idi u AWS Console → CloudWatch → Log groups → `/ecs/uslugar`

Najnoviji log stream → Traži:
- `"Missing SUDREG credentials"`
- `"Token request failed"`
- `"API request failed"`

### 2. Mogući problemi:

#### Problem A: Credentials nisu dostupni
**Symptom:** U logu vidiš `"Missing SUDREG credentials"`

**Uzrok:** Environment variables nisu dostupni u runtime-u

**Rješenje:**
```bash
# Provjeri task definition environment variables
aws ecs describe-task-definition \
  --task-definition uslugar:LATEST \
  --region eu-north-1 \
  --query 'taskDefinition.containerDefinitions[0].environment' \
  --output table
```

#### Problem B: API credentials su pogrešni
**Symptom:** U logu vidiš `"Token request failed: 401"`

**Uzrok:** Client ID ili Client Secret su pogrešni

**Rješenje:** Provjeri credentials sa Sudskog registra portala

#### Problem C: API endpoint je pogrešan
**Symptom:** U logu vidiš `"API request failed: 404"` ili `"Connection refused"`

**Uzrok:** API endpoint ili format zahtjeva je pogrešan

**Rješenje:** Provjeri dokumentaciju Sudskog registra API-ja

---

## 🧪 Lokalno Testiranje

Ako želiš testirati API lokalno:

1. **Idi na:** https://sudreg-data.gov.hr/ords/srn_rep/
2. **Prijavi se** sa credentials
3. **Testiraj API call:**
```bash
# 1. Get OAuth token
curl -u 'UcfrGwvRv3uGkqvYnUMxIA..:-TX-7q_UfffSEaRmGIP4bA..' \
  -X POST https://sudreg-data.gov.hr/ords/srn_rep/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded"
  
# 2. Use token to check OIB
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://sudreg-data.gov.hr/ords/srn_rep/1.0/Surad/88070789896
```

---

## 📊 Sljedeći Koraci

### 1. Čekaj Deployment
Deployment će završiti za ~10 minuta.

### 2. Testiraj Registraciju
Idi na: https://uslugar.oriph.io/#register-provider
- Unesi OIB: `88070789896`
- **Očekivano:** FAILURE (traži dokument) - TO JE NORMALNO ako API ne radi

### 3. Provjeri CloudWatch Logs
- Ako vidiš grešku → copy-paste log here
- Ili screenshot CloudWatch logova

### 4. Pošalji Log Output
Kad testiraš, provjeri browser Network tab (F12):
- Request: `POST /api/kyc/auto-verify`
- Response body
- Status code

---

## 🔧 Alternativni Pristup

Ako Sudreg API ne radi, možemo:
1. Koristiti drugi API ili servis za provjeru OIB-a
2. Buildovati cache sa već verificiranim OIB-ovima
3. Jednostavno uvijek tražiti dokument (fallback)

**Što želiš dalje?**

