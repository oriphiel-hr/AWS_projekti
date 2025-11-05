# 🔄 Twilio SMS Sync - Implementacija

## ✅ Implementirano

### 1. Backend Endpoint (`uslugar/backend/src/routes/admin.js`)
- ✅ **POST `/api/admin/sms-logs/sync-from-twilio`**
  - Dohvaća SMS-ove iz Twilio API-ja
  - Popunjava `SmsLog` tabelu u bazi
  - Automatski mapira Twilio podatke na naš format
  - Query params:
    - `limit` (default: 100) - Koliko SMS-ova dohvatiti
    - `days` (default: 30) - Koliko dana unazad

### 2. Frontend UI (`uslugar/frontend/src/pages/AdminSmsLogs.jsx`)
- ✅ Gumb "🔄 Sinkroniziraj iz Twilio" u headeru
- ✅ Loading state tijekom sinkronizacije
- ✅ Poruka o rezultatu sinkronizacije
- ✅ Automatsko osvježavanje podataka nakon sinkronizacije

### 3. Funkcionalnosti
- ✅ Dohvaća SMS-ove iz Twilio za zadnje 30/90 dana
- ✅ Provjerava duplikate (po `twilioSid`)
- ✅ Automatski mapira Twilio status na naš status:
  - `delivered`/`sent` → `SUCCESS`
  - `failed`/`undelivered` → `FAILED`
  - ostalo → `PENDING`
- ✅ Automatski određuje tip poruke iz sadržaja:
  - `VERIFICATION` - ako sadrži "kod" ili "verifikacij"
  - `LEAD_NOTIFICATION` - ako sadrži "lead" ili "ekskluzivni"
  - `REFUND` - ako sadrži "refund" ili "vraćen"
  - `URGENT` - ako sadrži "urgent" ili "hitno"
  - `OTHER` - ostalo
- ✅ Povezuje SMS-ove s korisnicima (po broju telefona)
- ✅ Pohranjuje Twilio metadata (direction, price, uri, itd.)

## 📋 Kako koristiti

1. **Prijavi se kao admin**: `https://uslugar.oriph.io/admin`
2. **Idi na "📱 SMS Logs"**
3. **Klikni "🔄 Sinkroniziraj iz Twilio"**
4. **Čekaj da se sinkronizacija završi** (može potrajati nekoliko sekundi)
5. **Vidi rezultat**: koliko SMS-ova je kreirano, preskočeno, grešaka

## 🔧 Tehnički detalji

### Twilio API
- Koristi `client.messages.list()` Twilio SDK
- Dohvaća poruke s `dateSentAfter` filterom
- Limit: 100-500 poruka po sinkronizaciji

### Baza podataka
- Kreira novi zapis u `SmsLog` tabeli za svaki SMS
- Provjerava duplikate po `twilioSid` (unique)
- Povezuje s korisnicima po `phone` polju

### Error handling
- Ako Twilio credentials nisu konfigurirani → vraća 400 error
- Ako Twilio API vrati grešku → vraća 500 error s detaljima
- Ako se pojavi greška pri spremanju → logira grešku i nastavlja

## 🚀 Deployment

Nakon commit-a, automatski će se deployati:
- Backend workflow pokreće se zbog promjena u `uslugar/backend/src/routes/admin.js`
- Frontend workflow pokreće se zbog promjena u `uslugar/frontend/src/pages/AdminSmsLogs.jsx`

## 📝 Napomene

- Twilio credentials se dohvaćaju iz `process.env.TWILIO_ACCOUNT_SID` i `process.env.TWILIO_AUTH_TOKEN`
- Ovi credentials se postavljaju preko AWS Secrets Manager u ECS Task Definition
- Sinkronizacija može potrajati nekoliko sekundi ako ima puno SMS-ova
- Duplikati se automatski preskaču (poruke koje već postoje u bazi)

