# Twilio Setup Guide - Besplatni Trial Account

## 🎁 Besplatni Twilio Trial Account

Da, Twilio nudi **besplatni trial account** s početnim kreditom za testiranje!

### Što dobivate:
- **$15 USD besplatnih kredita** za testiranje
- Mogućnost slanja SMS-a na verificirane brojeve
- Full API pristup
- Nema potrebe za kreditnom karticom (za početak)

### Ograničenja trial accounta:
- SMS se može slati **samo na verificirane brojeve telefona**
- Ne može slati SMS na proizvoljne brojeve (osim ako ih verificirate u Twilio konzoli)
- Trial broj ima ograničenja (dodatni text u poruci)

## 📝 Setup Koraci

### 1. Registracija
1. Idite na: https://www.twilio.com/try-twilio
2. Registrirajte se (email ili Google/GitHub)
3. Potvrdite email
4. Odgovorite na nekoliko pitanja o projektu

### 2. Verificacija broja telefona
- Twilio će tražiti da verificirate vaš broj telefona
- Unesite svoj broj, primite SMS kod
- Unesite kod

### 3. Dobivanje Credentials

Nakon registracije, idite u **Twilio Console** → **Dashboard**:

```
Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Auth Token: your_auth_token (kliknite "view" da ga vidite)
Phone Number: +1234567890 (Twilio vam dodijeli trial broj)
```

### 4. Verificacija testnih brojeva

Za testiranje, morate verificirati brojeve na koje želite slati SMS:

1. Twilio Console → **Phone Numbers** → **Verified Caller IDs**
2. Kliknite **+** ili **Add a new number**
3. Unesite broj telefona (npr. +385912345678)
4. Twilio će poslati SMS s kodom
5. Unesite kod → broj je verificiran

**Napomena**: Možete verificirati više brojeva za testiranje, ali samo verificirani brojevi mogu primati SMS s trial accounta.

## 🔧 Konfiguracija u Uslugara

### Option 1: Environment Variables (Production)

Dodajte u `.env` ili AWS ECS Task Definition:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Twilio trial broj
```

### Option 2: Local Development

Kreirajte `.env` u `uslugar/backend/`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## 🧪 Testiranje

### 1. Verificirajte svoj broj telefona u Twilio Console
- Možete verificirati i brojeve na koje testirate (npr. korisnici)

### 2. Pokrenite aplikaciju
- Kod će automatski koristiti Twilio ako su credentials postavljeni
- Inače će koristiti simulation mode

### 3. Test SMS verifikacije
- U ProviderProfile, unesite verificirani broj
- Kliknite "Pošalji SMS kod"
- Provjerite da SMS stiže

## 💰 Upgrade na Paid Account

Kada ste spremni za production:

1. **Dodajte Payment Method** u Twilio Console
2. **Upgrade Trial Account** → Paid Account
3. **Provjerite cijene**:
   - SMS u Hrvatsku: ~$0.05-0.10 po SMS-u (ovisno o državi)
   - Twilio nudi volume discounts

### Cijene (približno):
- **SMS u HR**: ~$0.05-0.08 po poruci
- **SMS u US**: ~$0.0075 po poruci
- Nema monthly fee, samo pay-per-use

## 🔒 Sigurnost

### Ne commitajte credentials!
- Dodajte `.env` u `.gitignore`
- Koristite AWS Secrets Manager ili ECS Task Environment Variables
- Za GitHub Actions, koristite GitHub Secrets

### Best Practices:
```bash
# .gitignore
.env
.env.local
*.env
```

## 🐛 Troubleshooting

### Problem: "SMS not sent to unverified number"
- **Rješenje**: Verificirajte broj u Twilio Console → Verified Caller IDs

### Problem: "Invalid phone number format"
- **Rješenje**: Koristite format `+385912345678` (s + i country code)

### Problem: "Insufficient credits"
- **Rješenje**: Upgrade na paid account ili provjerite balance u Console

### Problem: "Simulation mode active"
- **Rješenje**: Provjerite da su TWILIO_* environment variables postavljeni

## ➕ Dodavanje Notifications Proizvoda

Ako želite koristiti Twilio Notifications (za kampanje, bulk messaging, itd.):

### Opcija 1: Preko Twilio Console
1. Idite na https://console.twilio.com
2. U lijevom meniju kliknite **Products** ili **Explore Products**
3. Pronađite **Notifications** i kliknite **Get Started** ili **Enable**
4. Slijedite setup wizard

### Opcija 2: Kroz Dashboard
1. Twilio Console → **Dashboard**
2. U sekciji "Products" ili "Add a product" kliknite **Notifications**
3. Kliknite **Enable** ili **Get Started**

### Opcija 3: Direktno preko linka
- https://console.twilio.com/us1/develop/sms/notifications

**Napomena**: Za osnovne SMS poruke (kao što su naše notifikacije o leadovima), možete koristiti standardni **Messages API** koji već imate. Notifications proizvod je koristan za napredne slučajeve (bulk messaging, kampanje, segmentaciju).

## 📚 Dodatni Resursi

- **Twilio Docs**: https://www.twilio.com/docs/sms
- **Notifications Docs**: https://www.twilio.com/docs/notify
- **Pricing**: https://www.twilio.com/sms/pricing
- **Console**: https://console.twilio.com/
- **Support**: support@twilio.com

## ✅ Checklist za Setup

- [ ] Registriran Twilio trial account
- [ ] Verificiran vlastiti broj telefona
- [ ] Dobiven Account SID i Auth Token
- [ ] Dodan TWILIO_PHONE_NUMBER (trial broj)
- [ ] Postavljeni environment variables
- [ ] Testiran SMS slanje na verificirani broj
- [ ] Verificirani testni brojevi (ako treba)
- [ ] Dodano u `.gitignore` (ne commit credentials!)

## 🚀 Za Production

Kada ste spremni:

1. **Upgrade na Paid Account**
2. **Kupite dedicated phone number** (opcionalno, može se koristiti trial broj)
3. **Provjerite rate limits** i volume
4. **Setup monitoring** u Twilio Console
5. **Dodajte backup SMS provider** (opcionalno, za redundancy)

