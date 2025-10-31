# Kako dobiti Twilio Phone Number

## Situacija: Nemate Phone Number

Ako vidite "You don't have any Twilio phone numbers", trebate ga kupiti ili dobiti trial broj.

## 📱 Opcije

### Opcija 1: Buy a Number (Preporučeno za Trial)

1. **Kliknite "Buy a number"** u Twilio Console
2. Odaberite **Country**: `Croatia` (Hrvatska) ili `United States` (za testiranje)
3. Odaberite **Capabilities**:
   - ✅ **SMS** (obavezno)
   - ✅ **Voice** (opcionalno)
4. Kliknite **Search**
5. Odaberite broj s liste i kliknite **Buy**
6. **Price**: Trial account dobiva besplatni broj (ili veoma jeftin, npr. $1/mjesec)

**Napomena**: Trial account može kupiti broj bez kreditne kartice (ako je u trial periodu).

### Opcija 2: Verify Service (Za OTP/2FA - Preporučeno)

Twilio nudi **Verify** servis koji:
- ✅ Automatski rješava compliance
- ✅ Ne zahtijeva vlastiti phone number
- ✅ Radi odmah, bez čekanja
- ✅ Besplatno za trial

#### Setup Verify:

1. Twilio Console → **Verify** → **Services**
2. Kliknite **Create new Verify Service**
3. Nazovite ga (npr. "Uslugar SMS Verification")
4. **Enable SMS** → Save
5. Dobijete **Service SID** (ne phone number)

**Napomena**: Za Verify, ne trebate phone number - Twilio koristi svoj broj automatski.

### Opcija 3: Koristi Trial Number (ako postoji)

Provjerite **Dashboard** - možda postoji trial number koji nije vidljiv u Active numbers.

## 🎯 Preporuka za Uslugara

Za **SMS verifikaciju**, najbolje je koristiti **Twilio Verify**:

### Zašto Verify?
- ✅ Ne treba kupovati phone number
- ✅ Automatski compliance (GDPR, TCPA)
- ✅ Brz setup
- ✅ Besplatno za trial ($15 kredita pokriva mnogo verifikacija)

### Ako ipak želite svoj Phone Number:
- Kupite **Hrvatski broj** ako planirate slati SMS u HR
- Ili **US broj** za testiranje (jeftiniji, ~$1/mjesec)

## 💰 Cijene (približno)

- **US Phone Number**: $1/mjesec
- **Croatian Phone Number**: ~$5-10/mjesec (provjerite u Twilio)
- **Verify Service**: Besplatno (plaćate samo SMS pošiljke ~$0.05-0.08)

## 🔧 Ažuriranje koda za Verify (opcionalno)

Ako odlučite koristiti Verify umjesto Messages API, trebate ažurirati `sms-service.js`:

```javascript
// Umjesto:
await client.messages.create({...})

// Koristi:
await client.verify.v2.services('VA_SERVICE_SID')
  .verifications
  .create({ to: phone, channel: 'sms' })
```

Ali za sada, **standardni Messages API s phone number** radi dobro za naše potrebe.

## ✅ Sljedeći koraci

1. **Odaberite opciju** (Buy Number ili Verify)
2. **Ako kupujete broj**: Kopirajte broj i ažurirajte `.env`
3. **Testirajte** SMS slanje

