# 🔐 Dodaj Sudski Registar API Credentials

## Podaci koje si dobio:

**Client ID:** `UcfrGwvRv3uGkqvYnUMxIA..`  
**Client Secret:** `-TX-7q_UfffSEaRmGIP4bA..`  
**Email:** mario.vitt@oriphiel.hr

---

## 🚀 Kako Dodati u AWS Secrets Manager

### 1️⃣ Idi u AWS Console

**Cloud Shell:**
```bash
aws secretsmanager list-secrets --region eu-north-1 | grep uslugar
```

### 2️⃣ Update Postojeći Secret

**Secret name:** `uslugar-backend-secrets` (ili slično)

```bash
# Kreiraj temp JSON file
cat > /tmp/uslugar-backend-secrets.json << 'EOF'
{
  "SUDREG_CLIENT_ID": "UcfrGwvRv3uGkqvYnUMxIA..",
  "SUDREG_CLIENT_SECRET": "-TX-7q_UfffSEaRmGIP4bA.."
}
EOF

# Update AWS Secret
aws secretsmanager update-secret \
  --secret-id uslugar-backend-secrets \
  --secret-string file:///tmp/uslugar-backend-secrets.json \
  --region eu-north-1

# Obriši temp file
rm /tmp/uslugar-backend-secrets.json
```

### 3️⃣ ILI Dodaj u Task Definition

Ako secret name nije `uslugar-backend-secrets`, dodaj environment variables u ECS Task Definition:

```bash
aws ecs describe-task-definition \
  --task-definition uslugar-backend-task \
  --region eu-north-1
```

Zatim update task definition sa novim secrets:

```json
"secrets": [
  {
    "name": "SUDREG_CLIENT_ID",
    "valueFrom": "arn:aws:secretsmanager:eu-north-1:ACCOUNT_ID:secret:uslugar-sudreg-creds-CLIENT_ID"
  },
  {
    "name": "SUDREG_CLIENT_SECRET",
    "valueFrom": "arn:aws:secretsmanager:eu-north-1:ACCOUNT_ID:secret:uslugar-sudreg-creds-CLIENT_SECRET"
  }
]
```

---

## 🧪 Kako Testirati

### 1. Provjeri da li su credentials dostupni

**Cloud Shell:**
```bash
aws ecs describe-tasks \
  --cluster apps-cluster \
  --tasks $(aws ecs list-tasks --cluster apps-cluster --service uslugar-service-2gk1f1mv --query 'taskArns[0]' --output text) \
  --region eu-north-1 | grep -A 2 SUDREG
```

### 2. Test API poziv

```bash
curl -X POST https://uslugar.api.oriph.io/api/kyc/auto-verify \
  -H "Content-Type: application/json" \
  -d '{
    "taxId": "88070789896",
    "legalStatusId": "cls4_doo",
    "companyName": "ORIPHIEL"
  }'
```

**Očekivani response:**
```json
{
  "verified": true,
  "needsDocument": false,
  "badges": [{
    "type": "SUDSKI",
    "verified": true,
    "companyName": "Oriphiel d.o.o."
  }]
}
```

---

## ⚠️ Sigurnost

**NIKADA** nemoj commit-ati credentials u Git!  

Već sam implementirao provjeru:
- Ako NEMA credentials → traži dokument (fallback)
- Ako IMA credentials → provjeri API
- Neće crash-ati ako credentials nisu postavljeni

---

## ✅ Upute za Produkciju

### Opcija 1: Koristi Postojeći Secret

Ako već imaš `uslugar-backend-secrets`:

```bash
# Update samo Sudreg credentials
aws secretsmanager update-secret \
  --secret-id uslugar-backend-secrets \
  --secret-string '{"SUDREG_CLIENT_ID":"UcfrGwvRv3...","SUDREG_CLIENT_SECRET":"-TX-7q_..."}' \
  --region eu-north-1
```

### Opcija 2: Kreiraj Novi Secret

```bash
# Kreiraj novi secret samo za Sudreg
aws secretsmanager create-secret \
  --name uslugar-sudreg-creds \
  --secret-string '{"clientId":"UcfrGwvRv3...","clientSecret":"-TX-7q_..."}' \
  --region eu-north-1

# Zatim update ECS task definition da koristi ovaj secret
```

---

## 🔄 Restart ECS Task Nakon Dodavanja Credentials

```bash
# Force novi deployment
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --force-new-deployment \
  --region eu-north-1
```

**Trajanje:** ~3-5 minuta

---

## 📝 Next Steps

1. ✅ Code je pushan sa stvarnom API integracijom
2. ⏳ Dodaj credentials u AWS Secrets Manager
3. ⏳ Restart ECS service
4. ⏳ Test registraciju s ORIPHIEL d.o.o.

**Nakon toga:** Auto-verification će raditi sa stvarnim Sudskim registrom! 🎉

