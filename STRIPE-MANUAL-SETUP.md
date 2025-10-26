# 🎯 Stripe Keys - Ručna Konfiguracija AWS Console

## KORAK PO KORAK - DODAJ STRIPE KEYS U ECS

### 1️⃣ OT-VORI AWS CONSOLE
```
https://eu-north-1.console.aws.amazon.com/ecs/v2/clusters/apps-cluster/services/uslugar-service-2gk1f1mv/details
```

### 2️⃣ IDE NA TASK DEFINITION
1. Klikni na **"Task Definition"** link u sekciji "Task definition"
2. Ili idi na: **ECS → Task definitions → uslugar**

### 3️⃣ KREIRAJ NOVU REVIZIJU
1. Klikni na **"Create new revision"** button
2. Scrollaj do **"Container definitions"** → prvi kontejner **"uslugar"**

### 4️⃣ DODAJ SECRETS
U **"Environment variables and secrets"** sekciji:

**Trenutno imaš:**
```json
{
  "name": "DATABASE_URL",
  "valueFrom": "arn:aws:secretsmanager:..."
},
{
  "name": "SMTP_HOST",
  "valueFrom": "arn:aws:secretsmanager:..."
},
// itd...
```

**DODAJ ova 2 (KLIKNI "Add additional configuration → Secrets"):**

**Secret 1:**
- **Name**: `STRIPE_SECRET_KEY`
- **Value from**: `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD`

**Secret 2:**
- **Name**: `STRIPE_PUBLISHABLE_KEY`  
- **Value from**: `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI`

### 5️⃣ KREIRAJ NOVU REVIZIJU
1. Scroll do dna
2. Klikni **"Create"**
3. Bit će kreiran novi revision (npr. 204 ili 205)

### 6️⃣ AKTIVIRAJ NOVI REVISION
1. Vrati se na **Service page** (`uslugar-service-2gk1f1mv`)
2. Klikni **"Update"** button
3. U "Task definition" dropdownu odaberi **novi revision**
4. Klikni **"Update service"** 
5. Provjeri "Deployment type" → "Rolling update"
6. Klikni **"Update"**

### 7️⃣ ČEKAJ DEPLOYMENT (2-3 minute)
- Status će biti "Running (pending)" → "Running"
- Deployment complete kada vidiš "1 Running task"

### 8️⃣ TESTIRAJ
1. Idi na: https://uslugar.oriph.io/#pricing
2. Klikni "Odaberite PRO"
3. Trebalo bi ići na Stripe checkout stranicu! ✅

---

## 🚨 AKO NEŠTO NE RADI

### Provjeri Logs:
```bash
aws logs tail /ecs/uslugar --follow --region eu-north-1 --filter-pattern "STRIPE"
```

### Trebalo bi vidjeti:
```
[PAYMENTS] Stripe initialized successfully
```

### Ako još uvijek vidiš:
```
[PAYMENTS] Stripe not configured
```
→ Provjeri da je novi revision aktiviran u service-u!

---

## 📞 PODRŠKA

Ako imaš problema, provjeri:
1. Da li Task Definition revision je kreiran (npr. uslugar:204)
2. Da li je Service ažuriran da koristi novu reviziju
3. Da li deployment je completed (1 Running task)

**Trenutno aktivno**: Task definition uslugar:200 (stara revizija bez Stripe keys)

