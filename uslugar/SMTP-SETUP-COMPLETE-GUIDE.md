# 📧 SMTP Setup - Kompletni Vodič

## ✅ Što je implementirano

### Backend Features:
- ✅ **Email Verification** - Verifikacija email-a nakon registracije (24h token)
- ✅ **Forgot Password** - Resetiranje lozinke preko email-a (1h token)
- ✅ **Resend Verification** - Ponovno slanje verifikacijskog email-a
- ✅ **Email Templates** - Profesionalni HTML email templati
- ✅ **Security** - Token expiration, unique tokens, cryptographically secure

### Frontend Features:
- ✅ **Email Verification Page** (`/#verify?token=...`)
- ✅ **Forgot Password Page** (`/#forgot-password`)
- ✅ **Reset Password Page** (`/#reset-password?token=...`)
- ✅ **Success/Error States** - User-friendly feedback
- ✅ **Resend Functionality** - Mogućnost ponovnog slanja

---

## 🗂️ Database Schema

### Nova polja u User model-u:

```prisma
model User {
  // Email verification
  isVerified            Boolean   @default(false)
  verificationToken     String?   @unique
  tokenExpiresAt        DateTime?
  
  // Password reset
  resetPasswordToken    String?   @unique
  resetPasswordExpires  DateTime?
}
```

### Migration:
```sql
-- Migration: 20251019142000_add_email_verification
ALTER TABLE "User" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "verificationToken" TEXT;
ALTER TABLE "User" ADD COLUMN "tokenExpiresAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- Migration: 20251019160000_add_password_reset_fields
ALTER TABLE "User" ADD COLUMN "resetPasswordToken" TEXT;
ALTER TABLE "User" ADD COLUMN "resetPasswordExpires" TIMESTAMP(3);
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
```

---

## 📋 API Endpoints

### 1. **POST /api/auth/register**
Registracija korisnika + automatsko slanje verification email-a

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Ime Prezime",
  "role": "USER"
}
```

**Response:**
```json
{
  "token": "jwt_token...",
  "user": {
    "id": "cm123...",
    "email": "user@example.com",
    "fullName": "Ime Prezime",
    "isVerified": false
  },
  "message": "Registracija uspješna! Provjerite email za aktivacijski link."
}
```

---

### 2. **GET /api/auth/verify?token={token}**
Verifikacija email-a preko tokena iz email-a

**Response (Success):**
```json
{
  "message": "Email successfully verified!",
  "user": {
    "email": "user@example.com",
    "fullName": "Ime Prezime",
    "isVerified": true
  }
}
```

**Errors:**
- `404` - Invalid or expired token
- `410` - Verification link has expired

---

### 3. **POST /api/auth/resend-verification**
Ponovno slanje verifikacijskog email-a

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email resent"
}
```

---

### 4. **POST /api/auth/forgot-password**
Slanje email-a za resetiranje lozinke

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If that email exists, a password reset link has been sent."
}
```

**Napomena:** Uvijek vraća success (security best practice - ne otkriva da li email postoji)

---

### 5. **POST /api/auth/reset-password**
Resetiranje lozinke sa tokenom iz email-a

**Request:**
```json
{
  "token": "abc123def456...",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password successfully reset! You can now login with your new password.",
  "user": {
    "email": "user@example.com",
    "fullName": "Ime Prezime"
  }
}
```

**Errors:**
- `400` - Token and new password required / Password must be at least 6 characters
- `404` - Invalid or expired reset token
- `410` - Reset link has expired. Please request a new one.

---

## 🎨 Email Templates

### 1. Verification Email
**Subject:** Potvrdite vašu email adresu - Uslugar

**Link:** `https://uslugar.com/#verify?token=abc123...`

**Expiration:** 24 sata

**Button:** Zeleni "Potvrdi email adresu"

---

### 2. Password Reset Email
**Subject:** Resetirajte vašu lozinku - Uslugar

**Link:** `https://uslugar.com/#reset-password?token=abc123...`

**Expiration:** 1 sat

**Button:** Plavi "Resetiraj lozinku"

**Upozorenje:** Žuta box sa "Link istječe za 1 sat"

---

## ⚙️ SMTP Konfiguracija

### Opcija 1: Gmail (za development/testing)

#### Korak 1: Kreiraj Gmail App Password

1. Idi na Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification (mora biti uključena)
3. Scroll dolje → App Passwords
4. Generiraj novi App Password za "Mail"
5. Kopiraj generirani password (16 karaktera)

#### Korak 2: Postavi Environment Variables

**Lokalno (.env):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
FRONTEND_URL=http://localhost:5173
```

---

### Opcija 2: AWS SES (za production)

#### Prednosti:
- ✅ $0.10 per 1000 emails
- ✅ Visoka deliverability
- ✅ Scalable
- ✅ AWS integration

#### Korak 1: Verify Email/Domain u SES

```bash
aws ses verify-email-identity --email-address noreply@uslugar.com --region eu-north-1
```

Otvori email i klikni verification link.

#### Korak 2: Generiraj SMTP Credentials

1. Idi na AWS SES Console → SMTP Settings
2. Create SMTP Credentials
3. Spremi Username i Password

#### Korak 3: Environment Variables

```env
SMTP_HOST=email-smtp.eu-north-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIAXXXXXXXXXXXXXXXX
SMTP_PASS=generated-smtp-password
FRONTEND_URL=https://uslugar.com
```

---

### Opcija 3: SendGrid (alternativa)

#### Prednosti:
- ✅ 100 free emails/dan
- ✅ Jednostavno postavljanje
- ✅ Email analytics

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

---

## 🔐 AWS Secrets Manager Setup

### Korak 1: Kreiraj Secret

**Opcija A: Preko AWS Console**

1. Idi na AWS Secrets Manager Console
2. Store a new secret
3. Secret type: Other type of secret
4. Key/value pairs:
   ```json
   {
     "SMTP_HOST": "smtp.gmail.com",
     "SMTP_PORT": "587",
     "SMTP_USER": "your-email@gmail.com",
     "SMTP_PASS": "your-app-password"
   }
   ```
5. Secret name: `uslugar-smtp-secret`
6. Store

**Opcija B: Preko AWS CLI**

```bash
# Kreiraj secret JSON fajl
cat > smtp-secret.json << EOF
{
  "SMTP_HOST": "smtp.gmail.com",
  "SMTP_PORT": "587",
  "SMTP_USER": "your-email@gmail.com",
  "SMTP_PASS": "your-app-password"
}
EOF

# Kreiraj secret
aws secretsmanager create-secret \
  --name uslugar-smtp-secret \
  --description "SMTP credentials for Uslugar email notifications" \
  --secret-string file://smtp-secret.json \
  --region eu-north-1

# Očisti temporary file
rm smtp-secret.json
```

---

### Korak 2: Update Task Definition

Task definition već ima reference na secret:

```json
{
  "environment": [
    {
      "name": "SMTP_HOST",
      "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-secret-GYEwrb:SMTP_HOST::"
    },
    {
      "name": "SMTP_PORT",
      "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-secret-GYEwrb:SMTP_PORT::"
    },
    {
      "name": "SMTP_USER",
      "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-secret-GYEwrb:SMTP_USER::"
    },
    {
      "name": "SMTP_PASS",
      "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-secret-GYEwrb:SMTP_PASS::"
    }
  ]
}
```

**Napomena:** ARN `secret:uslugar-smtp-secret-GYEwrb` mora odgovarati stvarnom ARN-u nakon kreiranja.

Provjeri ARN:
```bash
aws secretsmanager describe-secret --secret-id uslugar-smtp-secret --region eu-north-1 --query ARN --output text
```

Update taskdef-new.json sa pravim ARN-om ako je potrebno.

---

### Korak 3: IAM Permissions

ECS Task Execution Role mora imati pristup Secrets Manager-u.

**Policy (već postoji u task definition):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar-smtp-secret-*"
    }
  ]
}
```

---

## 🚀 Deployment

### Korak 1: Run Migrations

Migracije se automatski pokreću na startup-u (Dockerfile.prod već ima):

```dockerfile
CMD sh -c "npx prisma migrate deploy && node src/server.js"
```

### Korak 2: Build & Push Docker Image

```bash
cd uslugar/backend

# Get latest commit hash
$COMMIT_HASH = git rev-parse HEAD

# Build
docker build -f Dockerfile.prod -t 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:$COMMIT_HASH .

# Login to ECR
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 666203386231.dkr.ecr.eu-north-1.amazonaws.com

# Push
docker push 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:$COMMIT_HASH
```

### Korak 3: Update taskdef-new.json

Update image sa novim commit hash-om:

```json
{
  "image": "666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:COMMIT_HASH"
}
```

### Korak 4: Register & Deploy

```bash
# Register task definition
aws ecs register-task-definition --region eu-north-1 --cli-input-json file://taskdef-new.json

# Note the revision number (npr. 78)

# Update service
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --task-definition uslugar:78 \
  --force-new-deployment \
  --region eu-north-1
```

### Korak 5: Monitor Logs

```bash
aws logs tail /ecs/uslugar --since 5m --region eu-north-1 --follow
```

**Očekivano:**
```
Running database migrations...
2 migrations found in prisma/migrations
Applying migration `20251019160000_add_password_reset_fields`
Migration complete. Starting server...
[OK] API listening on :8080
[OK] Socket.io ready for real-time chat
```

---

## 🧪 Testiranje

### Test 1: Registracija + Email Verification

```bash
# 1. Register user
curl -X POST https://uslugar.api.oriph.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User",
    "role": "USER"
  }'

# Provjeri email inbox za verification link

# 2. Verify email (copy token from email)
curl https://uslugar.api.oriph.io/api/auth/verify?token=TOKEN_FROM_EMAIL

# Expected: {"message":"Email successfully verified!","user":{...}}
```

---

### Test 2: Forgot Password Flow

```bash
# 1. Request password reset
curl -X POST https://uslugar.api.oriph.io/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Provjeri email inbox za reset link

# 2. Reset password (copy token from email)
curl -X POST https://uslugar.api.oriph.io/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_EMAIL",
    "newPassword": "newpassword123"
  }'

# Expected: {"message":"Password successfully reset!","user":{...}}
```

---

### Test 3: Provjeri CloudWatch Logs

```bash
aws logs tail /ecs/uslugar --since 10m --region eu-north-1 | grep -i "email"
```

**Očekivano (success):**
```
[OK] Verification email sent to: test@example.com
[OK] Password reset email sent to: test@example.com
```

**Ako SMTP nije konfiguriran:**
```
SMTP not configured - email notifications disabled
```

---

## 🎯 User Flow Diagrams

### Email Verification Flow

```
┌─────────────────┐
│ User registers  │
│ (Frontend form) │
└────────┬────────┘
         │
         ↓
┌────────────────────────┐
│ Backend creates user   │
│ + generates token      │
│ + sends email          │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ Success screen shows   │
│ "Check your email"     │
└────────┬───────────────┘
         │
         ↓  (user opens email)
┌────────────────────────┐
│ User clicks link       │
│ /#verify?token=...     │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ Backend verifies token │
│ + sets isVerified=true │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ Frontend shows success │
│ "Email verified!"      │
└────────────────────────┘
```

---

### Password Reset Flow

```
┌─────────────────────┐
│ User clicks         │
│ "Forgot password?"  │
└────────┬────────────┘
         │
         ↓
┌────────────────────────┐
│ ForgotPassword page    │
│ Enter email + Submit   │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ Backend generates      │
│ reset token (1h)       │
│ + sends email          │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ Success: "Check email" │
└────────┬───────────────┘
         │
         ↓  (user opens email)
┌────────────────────────┐
│ User clicks link       │
│ /#reset-password?token=│
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ ResetPassword page     │
│ Enter new password     │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ Backend validates      │
│ token + updates pass   │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ Success: "Password     │
│ reset! Login now"      │
└────────────────────────┘
```

---

## 🛡️ Security Features

### Token Security
- ✅ **Cryptographically secure** - `randomBytes(32).toString('hex')` (64 chars)
- ✅ **Unique constraint** - Database ensures no duplicate tokens
- ✅ **Expiration** - Verification: 24h, Reset: 1h
- ✅ **One-time use** - Token deleted after successful use
- ✅ **No token reuse** - New token generated on resend

### Email Security
- ✅ **No email enumeration** - Forgot password always returns success
- ✅ **Graceful degradation** - App works even if SMTP not configured
- ✅ **HTTPS links** - All email links use HTTPS in production
- ✅ **No password in logs** - Passwords never logged

### Best Practices
- ✅ Password minimum 6 characters
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ HTTPS only in production
- ✅ Environment variables for secrets

---

## 📊 Monitoring & Logging

### CloudWatch Logs - Što pratiti

**Success logs:**
```
[OK] Verification email sent to: user@example.com
[OK] Password reset email sent to: user@example.com
[OK] Password reset successful for: user@example.com
```

**Warning logs:**
```
SMTP not configured - email notifications disabled
SMTP not configured, skipping email: user@example.com
```

**Error logs:**
```
Error sending verification email: <error details>
Failed to send password reset email: <error details>
```

### Metrics to Track
- Email delivery rate
- Verification completion rate
- Password reset success rate
- Token expiration rate
- Failed login attempts after reset

---

## 🐛 Troubleshooting

### Problem: Email se ne šalje

**Simptomi:**
- Logs: "SMTP not configured"
- User ne prima email

**Rješenja:**

1. **Provjeri Secret postoji:**
```bash
aws secretsmanager get-secret-value --secret-id uslugar-smtp-secret --region eu-north-1
```

2. **Provjeri IAM permissions:**
```bash
aws iam get-role-policy --role-name ecsTaskExecutionRole --policy-name SecretsManagerPolicy
```

3. **Provjeri Task Definition:**
```bash
aws ecs describe-task-definition --task-definition uslugar:78 --query 'taskDefinition.containerDefinitions[0].secrets'
```

4. **Provjeri container logs:**
```bash
aws logs tail /ecs/uslugar --since 5m --region eu-north-1 | grep SMTP
```

---

### Problem: Gmail blokira email slanje

**Simptomi:**
- Error: "Invalid login" ili "Username and Password not accepted"

**Rješenja:**

1. **2-Step Verification MUST be enabled**
2. **Use App Password, not regular password**
3. **Check "Less secure app access" (legacy)**
4. **Try different port (465 for SSL, 587 for TLS)**

---

### Problem: Email u spam folder-u

**Simptomi:**
- Email stigne ali u spam

**Rješenja:**

1. **Use professional SMTP** (AWS SES, SendGrid)
2. **Setup SPF record:**
```
v=spf1 include:_spf.google.com ~all
```

3. **Setup DKIM** (via Gmail/SES)
4. **Setup DMARC:**
```
v=DMARC1; p=none; rua=mailto:postmaster@uslugar.com
```

5. **Verify sender domain**

---

### Problem: Token expired

**Simptomi:**
- "Verification link has expired"
- "Reset link has expired"

**Rješenja:**

**Za email verification:**
- Klikni "Pošalji ponovo" na error screen
- Ili: Request new verification email via `/api/auth/resend-verification`

**Za password reset:**
- Klikni "Zatražite novi link"
- Ili: Start flow again at `/#forgot-password`

---

## ✅ Production Checklist

Pre-deployment:
- [ ] SMTP credentials kreirani (Gmail/SES/SendGrid)
- [ ] AWS Secret kreiran i testiran
- [ ] Task definition updatean sa secret ARN-om
- [ ] IAM permissions postavljeni
- [ ] FRONTEND_URL postavljen na production URL
- [ ] Migrations ready (`20251019160000_add_password_reset_fields`)
- [ ] Docker image build sa najnovijim kodom
- [ ] Linter errors fixed

Post-deployment:
- [ ] Test registraciju + verification flow
- [ ] Test forgot password flow
- [ ] Provjeri CloudWatch logs za email sending
- [ ] Test email u spam folder-u
- [ ] Test token expiration
- [ ] Test resend functionality
- [ ] Document SMTP provider (Gmail/SES/etc)

---

## 📈 Future Enhancements

### Rate Limiting
- [ ] Max 3 resend verification emails per hour
- [ ] Max 5 forgot password requests per hour
- [ ] Implement Redis for rate limiting

### Email Analytics
- [ ] Track email open rates
- [ ] Track link click rates
- [ ] Monitor bounce rates
- [ ] Setup SendGrid/SES webhooks

### Additional Features
- [ ] Email change with verification
- [ ] Welcome email after verification
- [ ] Reminder email before token expires (23h for verification)
- [ ] Account deletion confirmation email
- [ ] Security alerts (new login, password changed)

### UI Enhancements
- [ ] Progress bar for email sending
- [ ] Countdown timer for token expiration
- [ ] Inline password strength meter
- [ ] Social login (Google, Facebook)

---

## 📚 Dodatni Resursi

### Email Service Providers

| Provider | Free Tier | Pricing | Best For |
|----------|-----------|---------|----------|
| **AWS SES** | 62,000/mj (free tier) | $0.10/1000 | Production, AWS stack |
| **SendGrid** | 100/dan | $14.95/mj (40k) | Easy setup, analytics |
| **Mailgun** | 5,000/mj | $35/mj (50k) | European servers |
| **Postmark** | 100/mj | $10/mj (10k) | Transactional emails |
| **Gmail** | Limited | Free | Development only |

### Documentation Links
- [Nodemailer Docs](https://nodemailer.com/)
- [AWS SES Developer Guide](https://docs.aws.amazon.com/ses/)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---

## 🎉 Summary

**Što je napravljeno:**
- ✅ Email verification flow (backend + frontend)
- ✅ Forgot/reset password flow (backend + frontend)
- ✅ Database migrations za nova polja
- ✅ Email templates (HTML, responsive)
- ✅ AWS Secrets Manager integration
- ✅ Security best practices
- ✅ Error handling & user feedback
- ✅ Documentation i deployment guide

**Što treba napraviti:**
1. Kreirati AWS Secret sa SMTP credentials
2. Deploy backend sa novom kodom
3. Deploy frontend sa novim stranicama
4. Testirati sve flow-ove
5. Monitor logs za errors

**API ready for production use!** 🚀📧


