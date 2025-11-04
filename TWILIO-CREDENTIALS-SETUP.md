# 🔐 Twilio Credentials Setup u AWS

## Problem

SMS sinkronizacija vraća 400 grešku jer Twilio credentials nisu konfigurirani u production environmentu.

## ✅ Rješenje

### 1. Provjeri postoji li Twilio secret u AWS Secrets Manager

```bash
aws secretsmanager list-secrets --region eu-north-1 | grep -i twilio
```

### 2. Ako ne postoji, kreiraj Twilio secret

**Opcija A: Preko AWS Console**
1. Idi na AWS Secrets Manager Console: https://eu-north-1.console.aws.amazon.com/secretsmanager/
2. Klikni "Store a new secret"
3. Secret type: "Other type of secret"
4. Key/value pairs:
   ```json
   {
     "TWILIO_ACCOUNT_SID": "AC5616e4c456d9f0354ef1f5a61c7734e6",
     "TWILIO_AUTH_TOKEN": "your_auth_token_here",
     "TWILIO_PHONE_NUMBER": "+18027276987"
   }
   ```
5. Secret name: `uslugar-twilio-config`
6. Store

**Opcija B: Preko AWS CLI**

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

### 3. Dobij ARN secreta

```bash
aws secretsmanager describe-secret \
  --secret-id uslugar-twilio-config \
  --region eu-north-1 \
  --query 'ARN' \
  --output text
```

ARN će biti nešto poput: `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-XXXXXX`

### 4. Ažuriraj ECS Task Definition

1. Idi na ECS Console: https://eu-north-1.console.aws.amazon.com/ecs/v2/clusters/apps-cluster/services/uslugar-service-2gk1f1mv/details
2. Klikni na **"Task Definition"** link
3. Klikni **"Create new revision"**
4. U **"Container definitions"** → prvi kontejner **"uslugar"**
5. U **"Environment variables and secrets"** → **"Add additional configuration"** → **"Secrets"**
6. Dodaj 3 nova secret-a:

**Secret 1:**
- **Name**: `TWILIO_ACCOUNT_SID`
- **Value from**: `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-XXXXXX:TWILIO_ACCOUNT_SID::`

**Secret 2:**
- **Name**: `TWILIO_AUTH_TOKEN`
- **Value from**: `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-XXXXXX:TWILIO_AUTH_TOKEN::`

**Secret 3:**
- **Name**: `TWILIO_PHONE_NUMBER`
- **Value from**: `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-XXXXXX:TWILIO_PHONE_NUMBER::`

7. Klikni **"Create"** (novi revision)
8. Vrati se na Service page i klikni **"Update"**
9. Odaberi novi revision iz dropdowna
10. Klikni **"Update service"**

### 5. Provjeri deployment

- Čekaj 2-3 minute da se service redeployira
- Provjeri da li su credentials dostupni:
  - Idi na SMS Logs stranicu
  - Klikni "🔄 Sinkroniziraj iz Twilio"
  - Trebalo bi sada raditi! ✅

## 🔍 Debug

Ako i dalje ne radi, provjeri:

1. **CloudWatch Logs**:
   ```
   /ecs/uslugar
   ```
   Traži poruke kao što su:
   - `❌ Twilio credentials missing`
   - `🔄 Syncing SMS logs from Twilio`

2. **Provjeri environment variables u running tasku**:
   - Idi na ECS Task → Running task → Container details
   - Provjeri da li se vide `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

3. **Test endpoint direktno**:
   ```bash
   curl -X POST "https://uslugar.api.oriph.io/api/admin/sms-logs/sync-from-twilio?limit=10&days=7" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

## 📝 Napomene

- Secret ARN (`-XXXXXX`) se automatski generira od AWS-a
- Zameni `XXXXXX` s pravim sufiksom iz ARN-a
- Twilio credentials su osjetljivi podaci - nikad ih ne commitaj u git!
- Ako se auth token promijeni, samo ažuriraj secret, ne moraš kreirati novi

