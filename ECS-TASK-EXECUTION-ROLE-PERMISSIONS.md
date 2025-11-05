# 🔐 ECS Task Execution Role - Secrets Manager Permissions

## ✅ Provjera Permisija

ECS Task Execution Role (`ecsTaskExecutionRole`) mora imati dozvolu za čitanje iz AWS Secrets Manager.

### Standardne Permisije

ECS Task Execution Role obično ima managed policy `AmazonECSTaskExecutionRolePolicy` koja automatski uključuje:
- ✅ `secretsmanager:GetSecretValue` - za čitanje secrets
- ✅ `kms:Decrypt` - za dekriptiranje encrypted secrets (ako se koristi KMS)

### Provjera da li Role ima Potrebne Permisije

```bash
# Provjeri attached policies
aws iam list-attached-role-policies \
  --role-name ecsTaskExecutionRole \
  --region eu-north-1

# Provjeri inline policies
aws iam list-role-policies \
  --role-name ecsTaskExecutionRole \
  --region eu-north-1

# Provjeri effective permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::666203386231:role/ecsTaskExecutionRole \
  --action-names secretsmanager:GetSecretValue \
  --resource-arns "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-*" \
  --region eu-north-1
```

## ⚠️ Ako Permisije Nedostaju

### Opcija 1: Dodaj Managed Policy (Preporučeno)

Ako role nema `AmazonECSTaskExecutionRolePolicy`, dodaj je:

```bash
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy \
  --region eu-north-1
```

### Opcija 2: Dodaj Custom Policy za Twilio Secret

Ako treba specifična dozvola samo za Twilio secret:

```bash
# Kreiraj policy JSON
cat > twilio-secret-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": [
        "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-twilio-config-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "secretsmanager.eu-north-1.amazonaws.com"
        }
      }
    }
  ]
}
EOF

# Kreiraj policy
aws iam create-policy \
  --policy-name ECS-Twilio-Secret-Access \
  --policy-document file://twilio-secret-policy.json \
  --region eu-north-1

# Attach policy to role
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::666203386231:policy/ECS-Twilio-Secret-Access \
  --region eu-north-1
```

## 🔍 Provjera da li Task Može Pristupiti Secret-u

### Test kroz ECS Task

Nakon što dodate permisije, pokrenite novi task i provjerite CloudWatch logs:

```bash
# Provjeri logove za greške o pristupu secret-u
aws logs tail /ecs/uslugar \
  --region eu-north-1 \
  --since 5m \
  | grep -i "secret\|permission\|access"
```

### Moguće Greške

**1. Access Denied:**
```
AccessDeniedException: User: arn:aws:sts::666203386231:assumed-role/ecsTaskExecutionRole/... is not authorized to perform: secretsmanager:GetSecretValue
```

**Rješenje:** Dodaj permisije prema Opciji 1 ili 2 iznad.

**2. Secret Not Found:**
```
ResourceNotFoundException: Secrets Manager can't find the specified secret.
```

**Rješenje:** Provjeri da li secret ARN u Task Definition odgovara stvarnom ARN-u.

## ✅ Preporučena Konfiguracija

**ECS Task Execution Role** treba imati:
- ✅ `AmazonECSTaskExecutionRolePolicy` (managed policy)
- ✅ Dozvolu za sve secrets koji se koriste:
  - `uslugar-db-secret-*`
  - `uslugar-smtp-config-*`
  - `uslugar-twilio-config-*`
  - `uslugar/stripe-keys-*`

## 📝 Napomene

- **Wildcard ARN:** AWS automatski generira suffiks (npr. `-xv1Y6q`), pa koristi `*` u policy
- **KMS:** Ako se secret koristi s KMS encryption, treba i `kms:Decrypt` dozvola
- **Region:** Permisije su region-specific, provjeri da je `eu-north-1`

