# 🔍 Twilio SMS Troubleshooting Guide

## Problem: SMS ne dolazi

### Mogući uzroci:

1. **Twilio Trial Account** - može slati samo na verificirane brojeve
2. **Twilio credentials nisu postavljeni** u AWS ECS environment variables
3. **Broj telefona nije verificiran** u Twilio konzoli (trial account)
4. **Twilio greška** - provjeri backend logove

---

## ✅ Provjera Twilio Konfiguracije

### 1. Provjeri AWS ECS Environment Variables

Twilio credentials moraju biti postavljeni u ECS Task Definition ili AWS Secrets Manager:

```bash
# Provjeri ECS task definition
aws ecs describe-task-definition \
  --task-definition uslugar \
  --region eu-north-1 \
  --query 'taskDefinition.containerDefinitions[0].environment'

# Ili provjeri Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id uslugar-twilio-secret \
  --region eu-north-1
```

**Potrebne varijable:**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

### 2. Verificiraj Broj u Twilio

**Trial Account Restrikcije:**
- Može slati SMS samo na **verificirane brojeve**
- Maksimalno **10 verificiranih brojeva**

**Kako verificirati broj:**
1. Idite na Twilio Console: https://console.twilio.com
2. Navigate: **Phone Numbers** → **Verified Caller IDs**
3. Kliknite **Add a new number**
4. Unesite broj telefona koji želite verificirati
5. Unesite verifikacijski kod koji ste primili

**Alternativa:** Upgrade Twilio account sa kreditnom karticom (može slati na bilo koji broj)

---

## 🔍 Debug Backend Logovi

### Provjeri CloudWatch Logove:

```bash
# Provjeri zadnje logove
aws logs tail /ecs/uslugar-backend --since 10m --region eu-north-1 | Select-String "SMS|Twilio"
```

**Traži ove poruke:**
- `✅ SMS poslan via Twilio` - SMS je uspješno poslan
- `📱 [SMS SIMULATION]` - Twilio nije konfigurisan, koristi se simulation mode
- `❌ Twilio SMS error` - Twilio greška
- `Error code: 21608` - Broj nije verificiran (trial account)

---

## 🧪 Testiranje Lokalno

### Development Mode (sa kodom u response):

Backend će vratiti kod u response ako:
- `NODE_ENV === 'development'`
- Twilio nije konfigurisan
- Twilio je u simulation mode

**Frontend će prikazati kod:**
```
SMS kod je poslan! Kod za testiranje: 123456
```

### Production Mode (stvarni SMS):

1. **Provjeri Twilio credentials** u AWS Secrets Manager
2. **Verificiraj broj** u Twilio konzoli
3. **Provjeri backend logove** za Twilio greške

---

## 🔧 Popravke

### 1. Dodati Twilio credentials u AWS Secrets Manager

```bash
aws secretsmanager create-secret \
  --name uslugar-twilio-config \
  --secret-string '{
    "TWILIO_ACCOUNT_SID": "AC5616e4c456d9f0354ef1f5a61c7734e6",
    "TWILIO_AUTH_TOKEN": "a9731cee5a2547cd1e9cbc461721b3a4",
    "TWILIO_PHONE_NUMBER": "+18027276987"
  }' \
  --region eu-north-1
```

### 2. Ažurirati ECS Task Definition

Dodati environment variables iz Secrets Manager u ECS Task Definition.

### 3. Verificirati Broj u Twilio

1. Idite na Twilio Console
2. Verificirajte broj telefona koji testirate
3. Pokušajte ponovno poslati SMS

---

## 📝 Backend Logovi - Što Tražiti

**Uspješno slanje:**
```
[SMS Service] Twilio config check: { hasAccountSID: true, ... }
[SMS Service] Sending SMS via Twilio to +385... from +18027276987
✅ SMS poslan via Twilio: SM...
```

**Greška - broj nije verificiran:**
```
❌ Twilio SMS error: ...
Error code: 21608
⚠️ Twilio trial: Broj mora biti verificiran u Twilio konzoli
```

**Greška - credentials nisu postavljeni:**
```
[SMS Service] Twilio config check: { hasAccountSID: false, ... }
📱 [SMS SIMULATION - No Twilio config]
```

---

## ✅ Testiranje SMS-a

### Opcija 1: Verificiraj broj u Twilio (preporučeno)

1. Twilio Console → Verified Caller IDs
2. Dodaj broj koji testirate
3. Verificiraj kodom
4. Pokušaj ponovno

### Opcija 2: Upgrade Twilio Account

1. Dodaj kreditnu karticu
2. Upgrade account (ne trial)
3. Može slati na bilo koji broj

### Opcija 3: Development Mode

- Backend vraća kod u response
- Frontend prikazuje kod direktno
- Koristi za lokalno testiranje

---

**Status:** ✅ Backend je ažuriran s boljim error handling-om i debug logovima. Provjerite backend logove da vidite što se događa s SMS slanjem.

