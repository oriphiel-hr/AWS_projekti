# 🚀 Quick Debug - Provjeri Credentials u ECS

## ⚡ Brza Provjera

### 1. Provjeri GitHub Actions

Idi na: https://github.com/oriphiel-hr/AWS_projekti/actions

**Traži:**
- Workflow: "Backend - Reuse existing Task Definition"
- Status: 🟢 COMPLETED?
- Commit: Da li je bio deploy sa credentials?

### 2. Provjeri ECS Task Definition

**AWS Console:**
https://eu-north-1.console.aws.amazon.com/ecs/v2/task-definitions/uslugar

Klikni na najnoviju revision (npr. `uslugar:256`)

**Provjeri "Environment variables" sekciju:**
- Da li postoje `SUDREG_CLIENT_ID` i `SUDREG_CLIENT_SECRET`?
- Da li imaju prave vrijednosti?

### 3. Provjeri Running Task

**AWS Console:**
https://eu-north-1.console.aws.amazon.com/ecs/v2/clusters/apps-cluster/services/uslugar-service-2gk1f1mv

Klikni na running task → Provjeri "Environment variables"

**Da li vidiš:**
- `SUDREG_CLIENT_ID` = `UcfrGwvRv3u...`
- `SUDREG_CLIENT_SECRET` = `-TX-7q_U...`

---

## 🎯 Očekivani Scenario

### Scenario A: Credentials SUU ENERGY

**CloudWatch logs (nakon testa):**
```
[Auto-Verify] ✅ Credentials found - attempting OAuth...
[Auto-Verify] Requesting OAuth token...
```

### Scenario B: Credentials NISU dostupni (trenutno)

**CloudWatch logs:**
```
[Auto-Verify] ❌ Missing SUDREG credentials
[Auto-Verify] clientId length: 0
[Auto-Verify] clientSecret length: 0
```

**Rješenje:** GitHub Actions deployment nije završio ili credentials nisu postavljeni.

---

## 🔧 Što Napraviti

### Ako GitHub Actions nije deployao:
1. Čekaj deployment završiti
2. Provjeri da li workflow uspješno završio
3. Ako je failed, vidi error u Actions logovima

### Ako credentials nisu u task definition:
```bash
# Ručno dodaj credentials
# Vidjeti: SETUP-SUDREG-SECRETS.md
```

### Ako credentials SU u task definition ali NISU u runtime:
```bash
# Force restart ECS service
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --force-new-deployment \
  --region eu-north-1
```

---

## 📊 Trenutni Status Prema Logu

Iz browser console loga vidim:
```
verified: false
needsDocument: true
errors: ["Sudski registar provjera nije dostupna..."]
```

**Znači:** Fallback se izvršava → **Credentials NISU dostupni u runtime-u**

**Uzrok:** GitHub Actions deployment ili nije završio, ili credentials nisu stvarno dodani u task definition.

---

## ✅ Sljedeći Korak

**Što mi treba:**
1. Screenshot AWS Console → ECS → Task Definition → Environment variables
2. ILI screenshot GitHub Actions → Najnoviji workflow run
3. ILI provjeri manualno "Da li credentials postoje u running task?"

**Napravi screenshot i pošalji, onda ću znati točan problem!**

