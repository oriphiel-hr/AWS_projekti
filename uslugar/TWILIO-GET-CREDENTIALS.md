# Kako doći do Twilio API Podataka

## 📍 Kako pronaći Twilio Credentials

### 1. Account SID i Auth Token

#### Način 1: Dashboard (najbrži)
1. Ulogirajte se u **Twilio Console**: https://console.twilio.com
2. Na **Dashboard** stranici (glavna stranica) vidjet ćete:

```
Account SID
ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Auth Token
[View] [Copy] [Regenerate]
```

3. Kliknite **View** da vidite Auth Token (ili **Copy** da ga kopirate)
4. Kliknite ikonu kopiranja 📋 pored Account SID da ga kopirate

#### Način 2: Account Settings
1. Twilio Console → **Account** (gornji desni kut, gdje je vaše ime)
2. Kliknite **Account** ili **General**
3. Vidjet ćete:
   - **Account SID** (uvijek vidljiv)
   - **Auth Token** (kliknite "View" da ga vidite)

### 2. Phone Number (Twilio Trial Number)

1. Twilio Console → **Phone Numbers** (u lijevom meniju)
2. Kliknite **Manage** → **Active numbers**
3. Vidjet ćete listu vaših brojeva
4. Kliknite na broj koji želite koristiti
5. Vidjet ćete puni broj u formatu: `+1234567890`
6. Ili direktno s liste vidite broj (format: `+1 (234) 567-8900`)

**Napomena**: Trial account dobije **1 besplatni broj** automatski.

### 3. Sve na jednom mjestu

**Account Info** stranica (preko Dashboard linka ili Account menu):
- Account SID ✓
- Auth Token ✓ (mora kliknuti "View")
- Phone Numbers → link do brojeva ✓

## 🔐 Sigurnost Auth Tokena

- **Auth Token je osjetljiv!** Nemojte ga dijeliti ili commitati u git
- Ako slučajno izložite token, kliknite **Regenerate** u Console
- Stari token će prestati raditi nakon regeneracije

## 📋 Format Podataka

### Account SID
```
ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Uvijek počinje s `AC`
- 34 karaktera ukupno
- Primjer: `ACa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5`

### Auth Token
```
xxxxx_xxxxxxxxxxxxxxxxxxxxx
```
- 32 karaktera
- Primjer: `abc123def456ghi789jkl012mno345pq`

### Phone Number
```
+1234567890
```
- Format: `+` + country code + number
- Primjer: `+14155238886` (Twilio trial broj je obično US)
- Za Hrvatsku: `+385912345678`

## 🔧 Kako dodati u Projekat

### Opcija 1: Local Development (.env)

Kreirajte `uslugar/backend/.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+14155238886
```

### Opcija 2: AWS ECS Task Definition

U ECS Console:
1. ECS → **Task Definitions** → Vaša task definition
2. **Edit** → **Container Definitions**
3. **Environment Variables** → **Add environment variable**
4. Dodajte:
   - `TWILIO_ACCOUNT_SID` = `AC...`
   - `TWILIO_AUTH_TOKEN` = `...`
   - `TWILIO_PHONE_NUMBER` = `+...`

### Opcija 3: AWS Secrets Manager (Preporučeno za Production)

1. AWS Console → **Secrets Manager**
2. **Store a new secret**
3. Odaberite **Other type of secret**
4. Dodajte key-value parove:
   ```
   TWILIO_ACCOUNT_SID: AC...
   TWILIO_AUTH_TOKEN: ...
   TWILIO_PHONE_NUMBER: +...
   ```
5. U ECS Task Definition, reference secret:
   ```json
   "secrets": [
     {
       "name": "TWILIO_ACCOUNT_SID",
       "valueFrom": "arn:aws:secretsmanager:...:secret:twilio-credentials"
     }
   ]
   ```

## ✅ Quick Checklist

- [ ] Twilio Console otvoren (https://console.twilio.com)
- [ ] Account SID kopiran (Dashboard ili Account → General)
- [ ] Auth Token kopiran (kliknuo "View")
- [ ] Phone Number zapisan (Phone Numbers → Active numbers)
- [ ] Credentials dodani u `.env` (dev) ili ECS (production)
- [ ] Testirao SMS slanje

## 🧪 Testiranje

Nakon što dodate credentials, testirajte:

1. Pokrenite backend
2. Otvorite ProviderProfile
3. Kliknite "Pošalji SMS kod"
4. Provjerite da SMS stiže na verificirani broj

Ako ne radi, provjerite:
- Da su environment variables postavljeni
- Da je broj telefona verificiran u Twilio Console
- Da imate kredita ($15 trial)
- Console logs za error poruke

## 📸 Screenshot Lokacije (opisno)

**Dashboard:**
```
┌─────────────────────────────────┐
│ Twilio Console                   │
├─────────────────────────────────┤
│ Dashboard                        │
│                                  │
│ Account SID                      │
│ ACxxxxxxxxxxxxxxxxxxxxxxxxxx     │
│ [Copy]                           │
│                                  │
│ Auth Token                       │
│ [View] [Copy] [Regenerate]       │
└─────────────────────────────────┘
```

**Phone Numbers:**
```
┌─────────────────────────────────┐
│ Phone Numbers → Manage          │
├─────────────────────────────────┤
│ Active numbers                  │
│                                  │
│ +1 (415) 523-8886               │
│ [View] [Edit]                    │
└─────────────────────────────────┘
```

