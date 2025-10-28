# 🔍 Manual Check Instructions

## Problem
KYC auto-verification ne radi - vraća FAILURE za sve OIB-ove.

---

## ✅ Provjeri GitHub Actions Deployment

**Link:** https://github.com/oriphiel-hr/AWS_projekti/actions

1. Klikni na najnoviji workflow run
2. Da li je **COMPLETED** (zeleno ✅)?
3. Ako je **FAILED** (crveno ❌), klikni i vidi error

**Traži u logovima:**
```
Registered: arn:aws:ecs:eu-north-1:666203386231:task-definition/uslugar:XXX
```

---

## ✅ Provjeri ECS Task Definition

**AWS Console:**
https://eu-north-1.console.aws.amazon.com/ecs/v2/task-definitions/uslugar

1. Klikni na najnoviju revision (npr. `uslugar:258`)
2. Skrolaj dolje do "Environment variables"
3. **Provjeri postoje li:**
   - `SUDREG_CLIENT_ID` = `UcfrGwvRv3uGkqvYnUMxIA..`
   - `SUDREG_CLIENT_SECRET` = `-TX-7q_UfffSEaRmGIP4bA..`
   - `CORS_ORIGINS` = `https://uslugar.oriph.io,...`

**Ako NE POSTOJE:** GitHub Actions nije deployao novi kod.

---

## ✅ Provjeri Running Task

**AWS Console:**
https://eu-north-1.console.aws.amazon.com/ecs/v2/clusters/apps-cluster/services/uslugar-service-2gk1f1mv

1. Klikni na running task
2. Klikni "Logs" tab
3. Traži najnovije log entrije
4. **Traži ove poruke:**
   - `"clientId exists: true/false"`
   - `"Credentials found"`
   - `"Token request failed"`
   - `"Error details:"`

**Copy-paste logove ovdje!**

---

## 🧪 Test API Direktno

**Browser Console (F12) ili Postman:**

```javascript
fetch('https://uslugar.api.oriph.io/api/kyc/auto-verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    taxId: '88070789896',
    legalStatusId: 'cls4_doo',
    companyName: 'Test'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Očekivani rezultat:**
- Ako credentials postoje: `{ verified: true, ... }` ili specific error
- Ako credentials NE postoje: `{ verified: false, errors: ["..."] } }`

---

## 🎯 Moguća Rješenja

### Problem 1: GitHub Actions nije deployao

**Rješenje:**
- Pričekaj deployment (10 min)
- ILI force redeploy: `git commit --allow-empty -m "force deploy" && git push`

### Problem 2: Credentials nisu u task definition

**Rješenje:**
- Ručno ažuriraj task definition (vidjeti SETUP-SUDREG-SECRETS.md)
- ILI pošalji screenshot task definition-a pa ću pomoći

### Problem 3: API endpoint je pogrešan

**Rješenje:**
- Pošalji error details iz CloudWatch logs
- Provjerit ću endpoint i credentials

---

## 📊 Što Mi Treba

**Najvažnije informacije:**

1. **Screenshot CloudWatch logs** (obaobljatno "Error details" ili credential checks)
2. **Browser console output** (error details iz fetch poziva)
3. **AWS Console screenshot** task definition environment variables

**S tim informacijama mogu točno vidjeti problem i riješiti ga!**

