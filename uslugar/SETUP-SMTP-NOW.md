# 🚀 Quick SMTP Setup (2 minute)

## Problem
Registracija ne šalje email jer SMTP nije konfiguriran.

## Rješenje - Sada radi i bez email-a! ✅

**Promjena:** Registracija sada **uspijeva čak i ako email ne uspije**.

- ✅ U **development**: User se kreira, samo bez email-a
- ⚠️ U **production**: Opcionalno možeš strogo zahtijevati email (setaj `REQUIRE_EMAIL_VERIFICATION=true`)

## Ako želiš email funkcionalnost

### Brzi setup (Gmail):

**1. Generiraj Gmail App Password**
```
1. Idi na: https://myaccount.google.com/apppasswords
2. Generiraj App Password za "Mail"
3. Kopiraj (16 karaktera)
```

**2. Kreiraj AWS Secret**
```powershell
# PowerShell
aws secretsmanager create-secret `
  --name uslugar-smtp-secret `
  --description "SMTP credentials" `
  --secret-string '{"SMTP_HOST":"smtp.gmail.com","SMTP_PORT":"587","SMTP_USER":"your-email@gmail.com","SMTP_PASS":"your-app-password"}' `
  --region eu-north-1
```

**3. Restart backend**
```powershell
cd uslugar/backend
npm run dev
```

Email će sada raditi! ✅

## Za production deployment

- Vidi: `SMTP-SETUP-COMPLETE-GUIDE.md`
- AWS SES preporuka umjesto Gmail-a

## Testiraj sada

```bash
# Registracija sada radi i bez SMTP-a
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User","role":"USER"}'
```

✅ **User će biti kreiran**
⚠️ **Email neće biti poslan** (ako SMTP nije konfiguriran)
📧 **Za manual verification:** Admin može direktno updateati `isVerified=true` u bazi


