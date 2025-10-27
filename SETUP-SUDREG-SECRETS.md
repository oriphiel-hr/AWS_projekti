# 🔐 Setup Sudreg Credentials u AWS Secrets Manager

## Način 1: Preko AWS Console (Najlakše)

### 1. Idi u AWS Console → Secrets Manager

**Link:** https://eu-north-1.console.aws.amazon.com/secretsmanager/

### 2. Provjeri postoji li `uslugar-sudreg-creds`

Ako **POSTOJI:**
- Klikni na secret
- Klikni "Edit"
- Update "Plaintext" vrijednost sa:
```json
{
  "clientId": "UcfrGwvRv3uGkqvYnUMxIA..",
  "clientSecret": "-TX-7q_UfffSEaRmGIP4bA.."
}
```
- Klikni "Save changes"

Ako **NE POSTOJI:**
- Klikni "Store a new secret"
- "Secret type": **Other type of secret**
- Klikni "Plaintext" tab
- Unesi:
```json
{
  "clientId": "UcfrGwvRv3uGkqvYnUMxIA..",
  "clientSecret": "-TX-7q_UfffSEaRmGIP4bA.."
}
```
- "Encryption key": **aws/secretsmanager** (default)
- Klikni "Next"
- "Secret name": `uslugar-sudreg-creds`
- Klikni "Next" → "Next" → "Store"

### 3. Dodaj IAM Permission za ECS Task Execution Role

**AWS Console → IAM → Roles:**
1. Traži: `ecsTaskExecutionRole`
2. Klikni na role
3. U "Permissions" tab → "Add permissions" → "Create inline policy"
4. JSON:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-sudreg-creds-*"
      ]
    }
  ]
}
```
5. "Policy name": `AllowSudregSecrets`
6. Klikni "Create policy"

---

## Način 2: Preko AWS CLI (PowerShell)

### Napraviti secret:
```powershell
aws secretsmanager create-secret `
  --name uslugar-sudreg-creds `
  --secret-string '{"clientId":"UcfrGwvRv3uGkqvYnUMxIA..","clientSecret":"-TX-7q_UfffSEaRmGIP4bA.."}' `
  --region eu-north-1
```

### Ažurirati secret:
```powershell
aws secretsmanager update-secret `
  --secret-id uslugar-sudreg-creds `
  --secret-string '{"clientId":"UcfrGwvRv3uGkqvYnUMxIA..","clientSecret":"-TX-7q_UfffSEaRmGIP4bA.."}' `
  --region eu-north-1
```

---

## Način 3: Ažurirati ECS Task Definition

**Problem:** Task definition koristi environment variables `SUDREG_CLIENT_ID` i `SUDREG_CLIENT_SECRET`.

**Rješenje:** Moramo dodati secret references u task definition.

### Opcija A: Kroz AWS Console

1. **ECS Console** → Task Definitions → `uslugar`
2. Klikni "Create new revision"
3. U "Container Definitions" → Klikni "Edit" na backend container
4. U "Environment variables" sekciji:
   - **Obriši** postojeće `SUDREG_CLIENT_ID` i `SUDREG_CLIENT_SECRET`
5. U "Secrets" sekciji → "Add secret":
   - **Name:** `SUDREG_CLIENT_ID`
   - **Value from:** `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-sudreg-creds-dccouu`
   - **JSON key:** `clientId`
6. Ponovo "Add secret":
   - **Name:** `SUDREG_CLIENT_SECRET`
   - **Value from:** `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-sudreg-creds-dccouu`
   - **JSON key:** `clientSecret`
7. "Update" → "Create"

### Opcija B: Preko AWS CLI (Komplicirano)

```bash
# 1. Get current task definition
aws ecs describe-task-definition \
  --task-definition uslugar:255 \
  --region eu-north-1 \
  --query 'taskDefinition' > task-def.json

# 2. Edit task-def.json - replace environment variables with secrets
# 3. Remove unwanted fields (taskDefinitionArn, revision, status, etc.)
# 4. Register new task definition
aws ecs register-task-definition \
  --cli-input-json file://task-def.json \
  --region eu-north-1

# 5. Update service
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --task-definition uslugar:256 \
  --force-new-deployment \
  --region eu-north-1
```

---

## 🧪 Kako Provjeriti da Radi

### 1. Provjeri Secret u Secrets Manager

**AWS Console** → Secrets Manager → `uslugar-sudreg-creds`
- Trebao bi vidjeti JSON s `clientId` i `clientSecret`

### 2. Provjeri Task Definition

**AWS Console** → ECS → Task Definitions → `uslugar:latest`
- U "Secrets" sekciji trebao bi vidjeti:
  - `SUDREG_CLIENT_ID` → `uslugar-sudreg-creds:clientId`
  - `SUDREG_CLIENT_SECRET` → `uslugar-sudreg-creds:clientSecret`

### 3. Provjeri Running Task

**AWS Console** → ECS → Clusters → `apps-cluster` → Tasks
- Klikni na running task
- U "Environment" sekciji provjeri da li postoje:
  - `SUDREG_CLIENT_ID` = `UcfrGwvRv3uGkqvYnUMxIA..`
  - `SUDREG_CLIENT_SECRET` = `-TX-7q_UfffSEaRmGIP4bA..`

### 4. Provjeri CloudWatch Logs

**AWS Console** → CloudWatch → Log groups → `/ecs/uslugar`
- Traži: `"Credentials found"`
- Ako vidiš: `"Missing SUDREG credentials"` → Secret nije dostupan u task-u

---

## ✅ Nakon Setup-a

1. **Restart ECS Service:**
```bash
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --force-new-deployment \
  --region eu-north-1
```

2. **Testiraj Registraciju:**
   - Idi na: https://uslugar.oriph.io/#register-provider
   - Unesi OIB: `88070789896`
   - Trebao bi vidjeti: ✓ **Verificiran – SUDSKI** (stvarna provjera kroz API!)

---

## 🎯 Trenutno Stanje

| Component | Status | Notes |
|-----------|--------|-------|
| Secret kreiran | ✅ `uslugar-sudreg-creds` | Has credentials |
| IAM Permission | ❓ Need to add | ECS role needs access |
| Task Definition | ❌ Uses env vars | Treba ažurirati na secrets |
| Runtime Access | ❌ Not available | Task ne vidi credentials |

**Next Step:** Ažurirati task definition da koristi secrets umjesto env vars!

