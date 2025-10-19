# 📧 Email Verifikacija - Kompletni Vodič

## ✅ Što je implementirano

### Backend:
- ✅ **Verification token** u User modelu (32-byte hex, unique)
- ✅ **Token expiration** (24 sata)
- ✅ **Email sending** (nodemailer template)
- ✅ **Verify endpoint** (GET /api/auth/verify?token=...)
- ✅ **Resend endpoint** (POST /api/auth/resend-verification)

### Frontend:
- ✅ **Success screen** nakon registracije
- ✅ **Verification page** (/#verify?token=...)
- ✅ **Success/Error states**
- ✅ **Resend functionality**

---

## 🔄 Kako radi workflow

### **1. Korisnik se registrira**
```
User → Popuni formu → Submit
```

### **2. Backend kreira user-a**
```javascript
// Generiraj token
const verificationToken = randomBytes(32).toString('hex');
const tokenExpiresAt = Date.now() + 24h;

// Kreiraj user-a (isVerified = false)
await prisma.user.create({
  email, passwordHash, fullName,
  verificationToken,
  tokenExpiresAt,
  isVerified: false
});
```

### **3. Backend šalje email**
```
Subject: Potvrdite vašu email adresu - Uslugar

Dobrodošli na Uslugar!

Poštovani/a Ime Prezime,

Hvala što ste se registrirali...

[Potvrdi email adresu]  ← Button sa linkom

Link: https://uslugar.com/#verify?token=abc123...
Link istječe za 24 sata.
```

### **4. Korisnik vidi success screen**
```
┌──────────────────────────────────┐
│         ✓ (zelena ikona)         │
│                                  │
│   Registracija uspješna!         │
│                                  │
│ Poslali smo vam email na adresu: │
│      user@example.com            │
│                                  │
│ 📧 Provjerite svoj email inbox   │
│ Kliknite na link da aktivirate   │
│ račun. Link vrijedi 24 sata.     │
│                                  │
│   [Povratak na početnu]          │
└──────────────────────────────────┘
```

### **5. Korisnik klikne link u emailu**
```
Email link: https://uslugar.com/#verify?token=abc123...
                                          ↓
                            Frontend: VerifyEmail.jsx
                                          ↓
                  API: GET /auth/verify?token=abc123...
                                          ↓
                    Backend: Provjeri token
                                          ↓
              Update: isVerified = true, token = null
                                          ↓
                      Frontend: Success screen
```

### **6. Verifikacija uspješna**
```
┌──────────────────────────────────┐
│         ✓ (zelena ikona)         │
│                                  │
│     Email verificiran!           │
│                                  │
│   Email: user@example.com        │
│                                  │
│   [Nastavite na platformu]       │
└──────────────────────────────────┘
```

---

## 📋 API Endpoints

### **POST /api/auth/register**
```javascript
// Request
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Ime Prezime",
  "role": "USER"
}

// Response
{
  "token": "jwt_token...",
  "user": {
    "id": "cm123...",
    "email": "user@example.com",
    "fullName": "Ime Prezime",
    "isVerified": false  // ← Još nije verificiran
  },
  "message": "Registracija uspješna! Provjerite email za aktivacijski link."
}
```

**Akcija:** Šalje verification email automatski

---

### **GET /api/auth/verify?token={token}**
```javascript
// Request
GET /api/auth/verify?token=abc123def456...

// Response (uspjeh)
{
  "message": "Email successfully verified!",
  "user": {
    "email": "user@example.com",
    "fullName": "Ime Prezime",
    "isVerified": true
  }
}

// Response (greška - token istekao)
{
  "error": "Verification link has expired"
}

// Response (već verificiran)
{
  "message": "Email already verified",
  "user": { ... }
}
```

---

### **POST /api/auth/resend-verification**
```javascript
// Request
{
  "email": "user@example.com"
}

// Response
{
  "message": "Verification email resent"
}

// Errors
{
  "error": "User not found"
}
{
  "error": "Email already verified"
}
```

---

## 📧 Email Template

### **Izgled email-a:**
```html
┌────────────────────────────────────────┐
│ Dobrodošli na Uslugar!                 │
├────────────────────────────────────────┤
│                                        │
│ Poštovani/a Ime Prezime,               │
│                                        │
│ Hvala što ste se registrirali...      │
│                                        │
│      [Potvrdi email adresu]           │
│         (zeleni button)                │
│                                        │
│ Ako button ne radi, kopirajte link:   │
│ https://uslugar.com/#verify?token=...  │
│                                        │
│ ⏰ Link istječe za 24 sata.            │
│                                        │
│ Ako niste zatražili registraciju,     │
│ ignorirajte ovu poruku.                │
├────────────────────────────────────────┤
│ Uslugar - Platforma za pronalaženje   │
│ lokalnih pružatelja usluga             │
└────────────────────────────────────────┘
```

---

## 🔐 Security Features

### **Token sigurnost:**
- ✅ **32-byte random** hex (64 karaktera)
- ✅ **Unique constraint** - ne može postojati dupli token
- ✅ **Expiration** - istječe za 24h
- ✅ **One-time use** - briše se nakon verifikacije
- ✅ **Cryptographically secure** - randomBytes()

### **Email sigurnost:**
- ✅ **Ne blokira registraciju** - ako email ne uspije, user je kreiran
- ✅ **Graceful degradation** - log greške, nastavi dalje
- ✅ **Resend opcija** - može zatražiti novi link

---

## ⚙️ Konfiguracija SMTP

### **Environment varijable (.env):**
```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (za verification link)
FRONTEND_URL=https://uslugar.com
```

### **Gmail App Password:**
1. Idi na Google Account Settings
2. Security → 2-Step Verification
3. App Passwords → Generate
4. Koristi generirani password u SMTP_PASS

### **Alternative SMTP providers:**
- **SendGrid** - 100 free emails/dan
- **AWS SES** - $0.10 per 1000 emails
- **Mailgun** - 5000 free emails/mjesec
- **Postmark** - 100 free emails/mjesec

---

## 🧪 Testiranje

### **Test registraciju:**
```bash
# Register user
curl -X POST https://uslugar.api.oriph.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User","role":"USER"}'
```

**Očekivano:**
- ✅ User kreiran
- ✅ Email poslan (provjeri inbox)
- ✅ isVerified = false

### **Test verifikaciju:**
```bash
# Kopiraj token iz email-a
curl https://uslugar.api.oriph.io/api/auth/verify?token=ABC123...
```

**Očekivano:**
- ✅ isVerified = true
- ✅ Token cleared

### **Test resend:**
```bash
curl -X POST https://uslugar.api.oriph.io/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Očekivano:**
- ✅ Novi email poslan
- ✅ Novi token generiran

---

## 🎯 User Experience Flow

### **Registracija → Email → Verifikacija**

```
┌─────────────────┐
│ Registration    │
│ Form            │
└────────┬────────┘
         │ Submit
         ↓
┌─────────────────┐
│ Success Screen  │
│ "Check email"   │
└────────┬────────┘
         │
         ↓  (user checks email)
┌─────────────────┐
│ 📧 Email Inbox  │
│ Subject:        │
│ Potvrdite       │
│ email...        │
└────────┬────────┘
         │ Click link
         ↓
┌─────────────────┐
│ Verify Page     │
│ (Loading...)    │
└────────┬────────┘
         │ API call
         ↓
┌─────────────────┐
│ ✓ Verified!     │
│ [Continue]      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Main Platform   │
│ (Jobs/Providers)│
└─────────────────┘
```

---

## ❌ Error Handling

### **Invalid token:**
```
┌─────────────────────────────┐
│ ✕ Verifikacija neuspješna  │
│                             │
│ Invalid or expired token    │
│                             │
│ Zatražite novi link:        │
│ [email input] [Pošalji]    │
│                             │
│ [Povratak na početnu]       │
└─────────────────────────────┘
```

### **Expired token:**
```
┌─────────────────────────────┐
│ ✕ Verifikacija neuspješna  │
│                             │
│ Verification link expired   │
│ (preko 24h)                 │
│                             │
│ [Zatražite novi link]       │
└─────────────────────────────┘
```

### **Already verified:**
```
┌─────────────────────────────┐
│ ✓ Email already verified    │
│                             │
│ Vaš račun je već aktivan    │
│                             │
│ [Nastavite na platformu]    │
└─────────────────────────────┘
```

---

## 🛡️ Best Practices

### **Trenutno:**
- ✅ Token istječe za 24h
- ✅ Korisnik može tražiti resend
- ✅ Email ne blokira registraciju (graceful fail)
- ✅ isVerified polje dostupno u JWT

### **Dodatno (buduće):**
- [ ] Blokiraj neprovjerene korisnike za određene akcije
- [ ] Reminder email nakon 23h (prije isteka)
- [ ] Rate limiting na resend (max 3x/sat)
- [ ] Email bounce handling

---

## 🎨 Frontend Pages

### **1. UserRegister** (`/#register-user`)
- Form → Success screen → "Provjerite email"

### **2. ProviderRegister** (`/#register-provider`)
- Form → Success screen → "Provjerite email"

### **3. VerifyEmail** (`/#verify?token=...`)
- Loading → Success/Error → "Nastavite" ili "Pošalji ponovo"

---

## 📊 Database Fields

### **User model:**
```prisma
model User {
  //...
  isVerified         Boolean   @default(false)
  verificationToken  String?   @unique
  tokenExpiresAt     DateTime?
  //...
}
```

### **Migration:**
```sql
ALTER TABLE "User" ADD COLUMN "verificationToken" TEXT;
ALTER TABLE "User" ADD COLUMN "tokenExpiresAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "User_verificationToken_key" 
  ON "User"("verificationToken");
```

---

## 🚀 Deployment

### **Backend - Task Definition 83**
```
✅ Email verification endpoints
✅ Token generation
✅ SMTP configuration support
```

### **Frontend - Build Ready**
```
dist/index.html                   0.46 kB
dist/assets/index-B__gGuby.css   22.45 kB (+1.5 KB)
dist/assets/index-D-m_v1_d.js   291.99 kB (+21 KB)
```

---

## ⚙️ Konfiguracija

### **Za development (bez email-a):**
Email se **neće slati**, ali user će biti kreiran.

Logovi:
```
SMTP not configured, skipping verification email: user@example.com
```

Korisnik može koristiti platformu, ali isVerified ostaje false.

### **Za production (sa email-om):**

**1. Postavi environment varijable:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@uslugar.com
SMTP_PASS=app-password-here
FRONTEND_URL=https://uslugar.com
```

**2. Provjeri CloudWatch logs:**
```bash
aws logs tail /ecs/uslugar --region eu-north-1 | grep "Verification email"
```

Očekivano:
```
[OK] Verification email sent to: user@example.com
```

---

## 💡 Napredne funkcionalnosti

### **Blokiraj akcije za neprovjerene:**

U route handlers:
```javascript
if (!req.user.isVerified) {
  return res.status(403).json({ 
    error: 'Email nije verificiran. Provjerite inbox.' 
  });
}
```

### **Badge u UI:**
```jsx
{user.isVerified ? (
  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
    ✓ Verificiran
  </span>
) : (
  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
    ⚠ Neverificiran
  </span>
)}
```

### **Reminder feature:**
```javascript
// Cron job - pošalji reminder nakon 23h
if (!user.isVerified && tokenExpiresIn < 1h) {
  sendReminderEmail(user.email, user.verificationToken);
}
```

---

## 🐛 Troubleshooting

### Problem: Email se ne šalje

**Provjeri:**
1. SMTP environment varijable postavljene?
2. Gmail App Password (ne obična lozinka)?
3. CloudWatch logs - "SMTP not configured"?

**Rješenje:**
```bash
# Provjeri env vars u container-u
aws ecs describe-task-definition --task-definition uslugar:83 \
  --query 'taskDefinition.containerDefinitions[0].environment'
```

### Problem: Link istekao

**Rješenje:**
1. Korisnik klikne "Pošalji ponovo"
2. Unese email
3. Dobije novi link (24h)

### Problem: Email u spam

**Rješenje:**
1. Koristi profesionalni SMTP (SendGrid, SES)
2. Dodaj SPF/DKIM/DMARC zapise
3. Provjerite sender reputation

---

## ✅ Checklist za produkciju

- [ ] SMTP kredencijali konfigurirani
- [ ] FRONTEND_URL postavljen
- [ ] Test email poslan uspješno
- [ ] Verification link radi
- [ ] Resend funkcionalnost radi
- [ ] Email template prikazan ispravno
- [ ] Error handling testiran
- [ ] CloudWatch logs provjereni

---

## 📈 Statistike

### **U Admin Panelu:**

**Neverificirani korisnici:**
```json
// WHERE filter
{"isVerified": false}
```

**Tokeni koji istječu uskoro:**
```json
{
  "isVerified": false,
  "tokenExpiresAt": {
    "lte": "2025-10-20T12:00:00.000Z"
  }
}
```

---

**Email verification sistem kompletno implementiran!** 📧✨

**Deploy backend (TD 83) i frontend, konfiguriraj SMTP, i testiraj!** 🚀

