# 🔍 Provjera Twilio Secrets u AWS Secrets Manager

## Brza Provjera

### 1. Lista svih secrets

```bash
aws secretsmanager list-secrets --region eu-north-1 --query 'SecretList[].Name' --output table
```

### 2. Provjeri postoji li Twilio secret

```bash
aws secretsmanager describe-secret \
  --secret-id uslugar-twilio-config \
  --region eu-north-1
```

### 3. Dohvati vrijednosti Twilio secret-a

```bash
aws secretsmanager get-secret-value \
  --secret-id uslugar-twilio-config \
  --region eu-north-1 \
  --query 'SecretString' \
  --output text | python3 -m json.tool
```

**Ili u PowerShell:**

```powershell
aws secretsmanager get-secret-value `
  --secret-id uslugar-twilio-config `
  --region eu-north-1 `
  --query 'SecretString' `
  --output text | ConvertFrom-Json
```

## Očekivani Rezultat

Ako secret postoji i ima sve podatke, trebao bi vidjeti:

```json
{
  "TWILIO_ACCOUNT_SID": "AC5616e4c456d9f0354ef1f5a61c7734e6",
  "TWILIO_AUTH_TOKEN": "your_auth_token_here",
  "TWILIO_PHONE_NUMBER": "+18027276987"
}
```

## Mogući Problemi

### 1. Secret ne postoji

**Error:**
```
An error occurred (ResourceNotFoundException) when calling the DescribeSecret operation: Secrets Manager can't find the specified secret.
```

**Rješenje:**
Kreiraj secret pomoću:
```bash
aws secretsmanager create-secret \
  --name uslugar-twilio-config \
  --description "Twilio credentials for Uslugar SMS service" \
  --secret-string '{
    "TWILIO_ACCOUNT_SID": "AC5616e4c456d9f0354ef1f5a61c7734e6",
    "TWILIO_AUTH_TOKEN": "your_auth_token_here",
    "TWILIO_PHONE_NUMBER": "+18027276987"
  }' \
  --region eu-north-1
```

### 2. Secret postoji ali nema sve podatke

**Rješenje:**
Ažuriraj secret:
```bash
aws secretsmanager put-secret-value \
  --secret-id uslugar-twilio-config \
  --secret-string '{
    "TWILIO_ACCOUNT_SID": "AC5616e4c456d9f0354ef1f5a61c7734e6",
    "TWILIO_AUTH_TOKEN": "your_auth_token_here",
    "TWILIO_PHONE_NUMBER": "+18027276987"
  }' \
  --region eu-north-1
```

**Ili koristi PowerShell skriptu:**
```powershell
.\uslugar\backend\update-twilio-secret-now.ps1
```

### 3. Secret postoji ali nije dodan u ECS Task Definition

**Provjeri ECS Task Definition:**
1. Idi na: https://eu-north-1.console.aws.amazon.com/ecs/v2/clusters/apps-cluster/services/uslugar-service-2gk1f1mv/details
2. Klikni na "Task Definition" link
3. Provjeri da li u "Container definitions" → "uslugar" → "Secrets" postoje:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

Ako ne postoje, dodaj ih prema uputama u `TWILIO-CREDENTIALS-SETUP.md`.

## PowerShell Skripta

Za automatsku provjeru, pokreni:

```powershell
.\check-twilio-secrets.ps1
```

Skripta će:
- ✅ Listati sve secrets
- ✅ Provjeriti postoji li `uslugar-twilio-config`
- ✅ Prikazati vrijednosti (bez prikazivanja auth token-a u punom formatu)
- ✅ Reći što nedostaje

## Direktni Link u AWS Console

**AWS Secrets Manager:**
https://eu-north-1.console.aws.amazon.com/secretsmanager/listsecrets?region=eu-north-1

**Filtriraj po:** `uslugar-twilio-config`

