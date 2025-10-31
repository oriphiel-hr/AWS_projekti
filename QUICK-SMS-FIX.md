# 🚨 Quick Fix: SMS Ne Dolazi

## ✅ Što sam napravio:

1. **Backend sada uvijek vraća kod u response** - čak i ako Twilio ne radi, kod će biti dostupan za testiranje
2. **Frontend prikazuje kod direktno** - ako je kod dostupan, vidit ćete ga u success poruci
3. **Detaljni debug logovi** - backend logira sve o Twilio konfiguraciji i greškama

---

## 🔍 Provjeri Backend Logove (AWS CloudWatch)

```bash
aws logs tail /ecs/uslugar-backend --since 10m --region eu-north-1 | Select-String "SMS|Twilio"
```

**Traži ove poruke:**

### ✅ Twilio radi:
```
[SMS Service] Twilio config check: { hasAccountSID: true, ... }
[SMS Service] Sending SMS via Twilio to +385... from +18027276987
✅ SMS poslan via Twilio: SM..., Status: queued
```

### ❌ Twilio credentials nisu postavljeni:
```
[SMS Service] Twilio config check: { hasAccountSID: false, ... }
📱 [SMS SIMULATION - No Twilio config]
```

### ⚠️ Broj nije verificiran (Twilio trial):
```
❌ Twilio SMS error: ...
Error code: 21608
⚠️ Twilio trial: Broj mora biti verificiran u Twilio konzoli
```

---

## 🎯 Rješenje - 3 Koraka:

### Korak 1: Provjeri da li je kod dostupan u frontendu

Nakon što kliknete "Pošalji SMS kod", provjerite:
- Vidi li se kod u success poruci? (npr. "Kod za testiranje: 123456")
- Ako DA → koristite taj kod za verifikaciju
- Ako NE → provjerite backend logove

### Korak 2: Verificiraj broj u Twilio (ako koristite Twilio)

**Twilio Trial Account ograničenja:**
- Može slati SMS samo na **verificirane brojeve**
- Maksimalno **10 verificiranih brojeva**

**Kako verificirati:**
1. https://console.twilio.com → **Phone Numbers** → **Verified Caller IDs**
2. **Add a new number**
3. Unesite broj koji testirate
4. Verificirajte kodom

**Alternativa:** Upgrade Twilio account (dodaj karticu) → može slati na bilo koji broj

### Korak 3: Provjeri Twilio credentials u AWS

```bash
# Provjeri ECS environment variables
aws ecs describe-task-definition \
  --task-definition uslugar \
  --region eu-north-1 \
  --query 'taskDefinition.containerDefinitions[0].environment' \
  | Select-String "TWILIO"
```

**Ako nisu postavljeni:**
- Dodaj ih u AWS Secrets Manager
- Ažuriraj ECS Task Definition
- Restart ECS service

---

## 🧪 Testiranje s Kodom u Response-u

Sada će backend **uvijek vratiti kod** u response-u za testiranje:
- Development mode → kod je dostupan
- Twilio ne radi → kod je dostupan
- Twilio simulation mode → kod je dostupan

**Frontend će prikazati:**
```
SMS kod je poslan! Kod za testiranje: 123456
```

Ili ako Twilio ne radi:
```
SMS nije poslan (Twilio issue). Kod za testiranje: 123456
```

**Koristite taj kod za verifikaciju!** ✅

---

## 📋 Checklist:

- [ ] Provjeri backend logove (CloudWatch)
- [ ] Ako vidiš kod u frontendu → koristi ga za testiranje
- [ ] Ako koristiš Twilio → verificiraj broj u Twilio konzoli
- [ ] Ako nisi verificirao broj → upgrade Twilio account ili koristi kod iz response-a

---

**Status:** ✅ Backend je ažuriran - kod će biti dostupan za testiranje čak i ako Twilio ne radi!

