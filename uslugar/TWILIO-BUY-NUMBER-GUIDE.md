# Kako Kupiti US Phone Number s Trial Kreditom

## 📋 Korak-po-Korak Upute

### Korak 1: Otvorite Twilio Console
1. Idite na: **https://console.twilio.com**
2. Ulogirajte se u vaš account

### Korak 2: Idite na "Buy a number"
1. U lijevom meniju kliknite: **Phone Numbers**
2. Kliknite: **Buy a number** (gumb na vrhu stranice)

### Korak 3: Odaberite Country
1. U padajućem meniju **Country**, odaberite: **United States**
2. (Ostavite defaultne postavke)

### Korak 4: Odaberite Capabilities
Provjerite da su odabrane:
- ✅ **SMS** (obavezno!)
- ✅ **Voice** (opcionalno, ali preporučeno)
- ❌ **MMS** (nije potrebno)

### Korak 5: Search
1. Kliknite gumb **Search** (ili **Buy a Number**)
2. Twilio će prikazati dostupne brojeve

### Korak 6: Odaberite Broj
1. Vidjet ćete listu dostupnih brojeva
2. **Odaberite bilo koji broj** (svi su slični)
3. Primjer formata: `+1 (415) 523-8886` ili `+1 415 523 8886`

### Korak 7: Buy
1. Kliknite na broj koji želite
2. Kliknite gumb **Buy** ili **Purchase**
3. Potvrdite kupnju

### Korak 8: Potvrda
- Twilio će naplatiti **$1** iz vašeg trial kredita
- Broj će se pojaviti u **Active numbers**
- **Preostalo**: $15.31 - $1 = **$14.31** za SMS

### Korak 9: Kopirajte Broj
1. Idite na **Phone Numbers** → **Active numbers**
2. Vidjet ćete vaš novi broj
3. **Format**: `+14155238886` (bez razmaka, zagrada)
4. Kopirajte ga

### Korak 10: Ažurirajte .env
Otvorite `uslugar/backend/.env` i ažurirajte:
```env
TWILIO_PHONE_NUMBER=+14155238886
```
(Zamijenite s vašim stvarnim brojem)

## ✅ Provjera

Nakon kupnje, provjerite:
1. ✅ Broj se pojavljuje u **Active numbers**
2. ✅ Trial kredit se smanjio za $1
3. ✅ Broj je ažuriran u `.env`

## 🧪 Testiranje

1. **Verificirajte broj telefona** (na koji želite slati SMS):
   - Twilio Console → **Phone Numbers** → **Verified Caller IDs**
   - Kliknite **+ Add a new number**
   - Unesite broj (npr. +385912345678)
   - Twilio će poslati SMS s kodom
   - Unesite kod → broj je verificiran

2. **Pokrenite backend**:
   ```bash
   cd uslugar/backend
   npm start
   ```

3. **Testirajte SMS verifikaciju**:
   - Otvorite aplikaciju → ProviderProfile
   - Kliknite "Pošalji SMS kod"
   - Provjerite da SMS stiže na verificirani broj

## 💰 Budget Tracking

Nakon kupnje:
- **Trial kredit**: $14.31 preostalo
- **Phone Number**: $1/mjesec (već plaćeno iz kredita)
- **SMS capacity**: ~230 SMS po $0.062 (Croatia avg)

## ⚠️ Napomene

1. **Trial broj je US** - može slati SMS globalno, ali je cijena ovisna o destinaciji
2. **SMS u Croatia**: ~$0.05-0.08 po SMS-u
3. **Nakon trial perioda**: Morate dodati payment method za nastavak

## 🎯 Sljedeći koraci

1. ✅ Kupite US Phone Number (slijedite korake iznad)
2. ✅ Kopirajte broj u `.env`
3. ✅ Verificirajte testni broj telefona
4. ✅ Testirajte SMS verifikaciju

## 📞 Troubleshooting

### Problem: "Insufficient funds"
- **Rješenje**: Provjerite da imate $1+ u trial kreditu (imate $15.31, treba biti OK)

### Problem: "No numbers available"
- **Rješenje**: Pokušajte ponovno search, ili promijenite area code filter

### Problem: "Payment required"
- **Rješenje**: Trial account ne treba payment method za prvi broj - provjerite da ste u trial periodu

### Problem: Broj nije vidljiv nakon kupnje
- **Rješenje**: Refresh stranicu, provjerite **Active numbers** sekciju

