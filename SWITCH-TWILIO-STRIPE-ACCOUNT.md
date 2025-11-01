# 🔄 Prebacivanje na Drugi Twilio i Stripe Račun

## Odgovor na pitanje

**Da, ali s nekim rezervama:**

1. ✅ **Ako koristiš iste Secret ARN-ove** → dovoljno je ažurirati vrijednosti u AWS Secrets Manager i restartovati ECS service
2. ⚠️ **Ako koristiš različite Secret ARN-ove** → treba ažurirati i ECS Task Definition da koristi nove ARN-ove

---

## 📋 Pregled Trenutne Konfiguracije

### Twilio Credentials
- **Secret Name:** `uslugar-twilio-config`
- **Secret ARN:** `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-XXXXX`
- **Environment Variables:**
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`

### Stripe Credentials
- **Secret Names:**
  - `uslugar/stripe-secret-key-jKdcdD`
  - `uslugar/stripe-publishable-key-37rvJI`
- **Secret ARNs:**
  - `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD`
  - `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI`
- **Environment Variables:**
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET` (možda u drugom secret-u)

---

## 🔧 Metoda 1: Koristi Iste Secret ARN-ove (Preporučeno)

**Ovo je najbrži način** - samo ažuriraš vrijednosti u postojećim secrets.

### Korak 1: Ažuriraj Twilio Secret

```powershell
# Pokreni: uslugar/backend/update-twilio-secret-now.ps1
# Ili ručno:

$Region = "eu-north-1"
$SecretName = "uslugar-twilio-config"

# Novi podaci iz Twilio Console
$NewAccountSID = "AC_NOVI_ACCOUNT_SID"
$NewAuthToken = "NOVI_AUTH_TOKEN"
$NewPhoneNumber = "+1_NOVI_BROJ"

$secretJson = @{
    TWILIO_ACCOUNT_SID = $NewAccountSID
    TWILIO_AUTH_TOKEN = $NewAuthToken
    TWILIO_PHONE_NUMBER = $NewPhoneNumber
} | ConvertTo-Json -Compress

aws secretsmanager put-secret-value `
    --secret-id $SecretName `
    --secret-string $secretJson `
    --region $Region
```

### Korak 2: Ažuriraj Stripe Secrets

```powershell
$Region = "eu-north-1"

# Stripe Secret Key
aws secretsmanager put-secret-value `
    --secret-id "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD" `
    --secret-string "sk_live_NOVI_STRIPE_SECRET_KEY" `
    --region $Region

# Stripe Publishable Key
aws secretsmanager put-secret-value `
    --secret-id "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI" `
    --secret-string "pk_live_NOVI_STRIPE_PUBLISHABLE_KEY" `
    --region $Region

# Stripe Webhook Secret (ako postoji)
aws secretsmanager put-secret-value `
    --secret-id "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-webhook-secret-XXXXX" `
    --secret-string "whsec_NOVI_WEBHOOK_SECRET" `
    --region $Region
```

### Korak 3: Restart ECS Service

**VAŽNO:** ECS containeri učitavaju secrets pri pokretanju, pa je potreban restart.

```powershell
aws ecs update-service `
    --cluster apps-cluster `
    --service uslugar-service-2gk1f1mv `
    --force-new-deployment `
    --region eu-north-1
```

### Korak 4: Provjera

```powershell
# Provjeri Twilio
aws logs tail /ecs/uslugar --region eu-north-1 --filter-pattern "TWILIO" --since 5m

# Provjeri Stripe
aws logs tail /ecs/uslugar --region eu-north-1 --filter-pattern "STRIPE" --since 5m

# Provjeri da su novi podaci učitani
aws logs tail /ecs/uslugar --region eu-north-1 --filter-pattern "PAYMENTS" --since 5m
```

**Očekivani logovi:**
- `[SMS Service] Twilio config check: { hasAccountSID: true, hasAuthToken: true, ... }`
- `[PAYMENTS] Stripe initialized successfully`

---

## 🔧 Metoda 2: Koristi Nove Secret ARN-ove

**Koristi ovu metodu ako:**
- Želiš odvojiti secrets po okruženjima (npr. production vs staging)
- Želiš koristiti drugačije secret ime/ARN

### Korak 1: Kreiraj Nove Secrets u Secrets Manager

```powershell
$Region = "eu-north-1"

# Novi Twilio Secret
$twilioSecret = @{
    TWILIO_ACCOUNT_SID = "AC_NOVI_ACCOUNT_SID"
    TWILIO_AUTH_TOKEN = "NOVI_AUTH_TOKEN"
    TWILIO_PHONE_NUMBER = "+1_NOVI_BROJ"
} | ConvertTo-Json -Compress

aws secretsmanager create-secret `
    --name "uslugar-twilio-config-v2" `
    --secret-string $twilioSecret `
    --region $Region

# Novi Stripe Secrets
aws secretsmanager create-secret `
    --name "uslugar/stripe-secret-key-v2" `
    --secret-string "sk_live_NOVI_STRIPE_SECRET_KEY" `
    --region $Region

aws secretsmanager create-secret `
    --name "uslugar/stripe-publishable-key-v2" `
    --secret-string "pk_live_NOVI_STRIPE_PUBLISHABLE_KEY" `
    --region $Region
```

### Korak 2: Ažuriraj ECS Task Definition

**Opcija A: PowerShell Script (Preporučeno)**

```powershell
# 1. Preuzmi trenutnu Task Definition
aws ecs describe-task-definition `
    --task-definition uslugar:LATEST `
    --region eu-north-1 `
    --output json > task-def-current.json

# 2. Kreiraj Python script za ažuriranje
@"
import json

with open('task-def-current.json', 'r') as f:
    data = json.load(f)

task_def = data['taskDefinition']

# Ukloni read-only polja
read_only = ['taskDefinitionArn', 'revision', 'status', 'registeredAt', 'registeredBy', 'requiresAttributes', 'compatibilities']
for field in read_only:
    task_def.pop(field, None)

# Ažuriraj secrets u containeru
container = task_def['containerDefinitions'][0]

# Pronađi postojeće secrets i zamijeni ARN-ove
for secret in container.get('secrets', []):
    if secret['name'] == 'TWILIO_ACCOUNT_SID':
        secret['valueFrom'] = 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-v2-XXXXX:TWILIO_ACCOUNT_SID::'
    elif secret['name'] == 'TWILIO_AUTH_TOKEN':
        secret['valueFrom'] = 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-v2-XXXXX:TWILIO_AUTH_TOKEN::'
    elif secret['name'] == 'TWILIO_PHONE_NUMBER':
        secret['valueFrom'] = 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-v2-XXXXX:TWILIO_PHONE_NUMBER::'
    elif secret['name'] == 'STRIPE_SECRET_KEY':
        secret['valueFrom'] = 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-v2-XXXXX'
    elif secret['name'] == 'STRIPE_PUBLISHABLE_KEY':
        secret['valueFrom'] = 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-v2-XXXXX'

with open('task-def-updated.json', 'w') as f:
    json.dump(task_def, f, indent=2)

print("✅ Task Definition updated")
"@ | Out-File -FilePath update-task-def.py -Encoding UTF8

# 3. Pokreni Python script
python update-task-def.py

# 4. Registriraj novu Task Definition
$newRevision = aws ecs register-task-definition `
    --cli-input-json file://task-def-updated.json `
    --region eu-north-1 `
    --query 'taskDefinition.revision' `
    --output text

# 5. Ažuriraj ECS Service
aws ecs update-service `
    --cluster apps-cluster `
    --service uslugar-service-2gk1f1mv `
    --task-definition "uslugar:$newRevision" `
    --force-new-deployment `
    --region eu-north-1
```

**Opcija B: Ručno preko AWS Console**

1. Idi na **ECS Console** → **Task Definitions** → `uslugar`
2. Klikni na najnoviju reviziju → **Create new revision**
3. U **Container Definitions** → prvi container → **Environment variables**
4. Za svaki secret, ažuriraj `valueFrom` ARN na novi ARN
5. Klikni **Create**
6. Idi na **Services** → `uslugar-service-2gk1f1mv` → **Update** → odaberi novu reviziju → **Update**

### Korak 3: Provjera

```powershell
# Provjeri da li su novi secrets učitani
aws logs tail /ecs/uslugar --region eu-north-1 --filter-pattern "TWILIO|STRIPE|PAYMENTS" --since 5m
```

---

## ⚠️ Važne Napomene

### 1. **Stripe Webhook Secret**
Ako koristiš Stripe webhooke, moraš ažurirati i webhook secret:
- Ažuriraj `STRIPE_WEBHOOK_SECRET` u Secrets Manager
- Ažuriraj webhook endpoint URL u Stripe Dashboard da koristi novi secret

### 2. **Twilio Phone Number**
Kada promijeniš Twilio Account SID i Auth Token, **moraš kupiti novi phone number** u novom Twilio računu (osim ako ne koristiš porting).

### 3. **Verificirani Brojevi (Twilio Trial)**
Ako koristiš Twilio trial account, sve brojeve **moraš verificirati** prije slanja SMS-a:
- https://console.twilio.com/us1/develop/phone-numbers/manage/verified

### 4. **Stripe Webhook Events**
Ako promijeniš Stripe račun, **svi postojeći webhook eventi se neće prebaciti**. Morat ćeš:
- Kreirati nove webhooke u novom Stripe Dashboard-u
- Ažurirati webhook URL i secret u aplikaciji

### 5. **Database Records**
Ako promijeniš Stripe račun, postojeći **Subscription records u bazi podataka** će koristiti stari `stripeSubscriptionId`. Razmotri:
- Ručno ažuriranje postojećih subscriptions
- Migracija podataka iz starog Stripe računa

---

## 🔍 Troubleshooting

### Problem: ECS Service ne učitava nove secrets

**Rješenje:**
```powershell
# Provjeri da li je ECS Task Execution Role ima dozvole za Secrets Manager
aws iam get-role-policy \
    --role-name uslugar-EcsTaskExecutionRole \
    --policy-name SecretsManagerAccess

# Ako nema, dodaj dozvole:
aws iam attach-role-policy \
    --role-name uslugar-EcsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
```

### Problem: Twilio vraća error 20003 "Authenticate"

**Rješenje:**
- Provjeri da li je `TWILIO_AUTH_TOKEN` ispravno ažuriran u Secrets Manager
- Provjeri da li je ECS service restartovan nakon ažuriranja secret-a
- Provjeri CloudWatch logove: `aws logs tail /ecs/uslugar --filter-pattern "TWILIO"`

### Problem: Stripe ne radi nakon promjene

**Rješenje:**
```powershell
# Provjeri da li su svi Stripe secrets postavljeni
aws logs tail /ecs/uslugar --filter-pattern "STRIPE" --since 5m

# Provjeri da li je Stripe initialized
# Trebao bi vidjeti: "[PAYMENTS] Stripe initialized successfully"
```

---

## 📝 Checklist za Prebacivanje

- [ ] **Twilio:**
  - [ ] Ažurirao `TWILIO_ACCOUNT_SID` u Secrets Manager
  - [ ] Ažurirao `TWILIO_AUTH_TOKEN` u Secrets Manager
  - [ ] Ažurirao `TWILIO_PHONE_NUMBER` u Secrets Manager
  - [ ] Kupio novi phone number u novom Twilio računu (ako je potrebno)
  - [ ] Verificirao phone number u Twilio Console (ako je trial)

- [ ] **Stripe:**
  - [ ] Ažurirao `STRIPE_SECRET_KEY` u Secrets Manager
  - [ ] Ažurirao `STRIPE_PUBLISHABLE_KEY` u Secrets Manager
  - [ ] Ažurirao `STRIPE_WEBHOOK_SECRET` u Secrets Manager (ako se koristi)
  - [ ] Kreirao nove webhooke u Stripe Dashboard-u
  - [ ] Ažurirao webhook URL i secret u aplikaciji

- [ ] **ECS:**
  - [ ] Ažurirao Task Definition s novim Secret ARN-ovima (ako koristiš Metodu 2)
  - [ ] Restartovao ECS Service (`force-new-deployment`)
  - [ ] Provjerio CloudWatch logove da su novi secrets učitani

- [ ] **Testiranje:**
  - [ ] Testirao SMS slanje (Twilio)
  - [ ] Testirao Stripe checkout
  - [ ] Testirao Stripe webhook handling
  - [ ] Provjerio da aplikacija radi bez grešaka

---

## 🎯 Preporučeni Način

**Za većinu slučajeva, koristi Metodu 1:**
1. Ažuriraj vrijednosti u postojećim secrets (brzo, jednostavno)
2. Restartuj ECS service (automatski učita nove vrijednosti)
3. Provjeri logove

**Vrijeme:** ~5 minuta

**Koristi Metodu 2 samo ako:**
- Želiš odvojiti production i staging secrets
- Koristiš kompleksniju secret strukturu

---

## 🚀 Automatske Skripte

### PowerShell (Windows/Local)

```powershell
.\update-twilio-stripe-credentials.ps1
```

**Što radi:**
- Interaktivno traži nove Twilio credentials
- Interaktivno traži nove Stripe credentials
- Ažurira secrets u AWS Secrets Manager
- Automatski restartuje ECS service
- Nudi provjeru statusa

### CloudShell (Bash/Linux)

```bash
# Preuzmi skriptu u CloudShell
wget https://raw.githubusercontent.com/oriphiel-hr/AWS_projekti/main/update-twilio-stripe-credentials-cloudshell.sh

# Dodaj execute dozvole
chmod +x update-twilio-stripe-credentials-cloudshell.sh

# Pokreni
./update-twilio-stripe-credentials-cloudshell.sh
```

**Ili direktno kopiraj i pokreni:**
```bash
curl -sSL https://raw.githubusercontent.com/oriphiel-hr/AWS_projekti/main/update-twilio-stripe-credentials-cloudshell.sh | bash
```

**Što radi:**
- Isto kao PowerShell verzija, ali optimizirana za CloudShell
- Koristi bash sintaksu
- Automatski prilagođava AWS CLI naredbe za CloudShell okruženje

---

## 📚 Povezani Dokumenti

- `update-twilio-stripe-credentials.ps1` - **PowerShell skripta** za automatsko ažuriranje (Windows/Local)
- `update-twilio-stripe-credentials-cloudshell.sh` - **Bash skripta** za automatsko ažuriranje (CloudShell/Linux)
- `uslugar/backend/update-twilio-secret-now.ps1` - Skripta za ažuriranje samo Twilio secret-a
- `STRIPE-SETUP.ps1` - Skripta za postavljanje Stripe secrets-a
- `uslugar/backend/setup-twilio-secrets.ps1` - Kompletan setup Twilio secrets-a

