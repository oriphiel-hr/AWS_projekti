# 🧪 Detaljni Test Plan - Admin Panel

**URL:** `https://uslugar.oriph.io/admin/documentation`

---

## 📋 Preduvjeti

1. **Browser:** Chrome/Edge/Firefox (najnovija verzija)
2. **Admin pristup:** Prijavi se kao ADMIN korisnik
3. **URL:** `https://uslugar.oriph.io/admin/documentation` (ili `#adm` + `Ctrl+Shift+A`)
4. **Clear cache:** `Ctrl + Shift + R` (Hard Refresh)

---

## 1️⃣ ADMIN PRETPLATA I KORISNICI

### Test 1.1: Pregled Korisnika

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/User`
2. Provjeri prikaz:
   - Lista svih korisnika
   - Filteri (role, email, status)
   - Paginacija
   - Search funkcionalnost

**Očekivani rezultat:**
- ✅ Svi korisnici se prikazuju
- ✅ Filteri rade
- ✅ Search radi
- ✅ Paginacija radi

---

### Test 1.2: Kreiranje Novog Korisnika

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/User`
2. Klikni "Novi korisnik" ili "Create"
3. Popuni formu:
   - **Email:** `admin.test@example.com`
   - **Ime i prezime:** `Admin Test`
   - **Lozinka:** `Admin123!@#`
   - **Role:** `ADMIN` (odaberi iz dropdowna)
   - **Telefon:** `+385 91 555 6666`
   - **Grad:** `Zagreb`
4. Klikni "Spremi" ili "Create"

**Očekivani rezultat:**
- ✅ Poruka: "Korisnik uspješno kreiran!"
- ✅ Korisnik se pojavljuje u listi
- ✅ Email poslan (ako je konfigurirano)

---

### Test 1.3: Uređivanje Korisnika

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/User`
2. Pronađi korisnika (npr. `admin.test@example.com`)
3. Klikni "Uredi" ili "Edit"
4. Promijeni:
   - **Grad:** `Split`
   - **Telefon:** `+385 91 777 8888`
5. Klikni "Spremi promjene"

**Očekivani rezultat:**
- ✅ Poruka: "Korisnik uspješno ažuriran!"
- ✅ Promjene vidljive u listi

---

### Test 1.4: Brisanje Korisnika

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/User`
2. Pronađi test korisnika (ne ADMIN korisnika!)
3. Klikni "Obriši" ili "Delete"
4. Potvrdi brisanje

**Očekivani rezultat:**
- ✅ Poruka: "Korisnik uspješno obrisan!"
- ✅ Korisnik uklonjen iz liste
- ✅ Cascade delete radi (svi povezani podaci obrisani)

---

## 2️⃣ UPRAVLJANJE POSLOVIMA

### Test 2.1: Pregled Poslova

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/Job`
2. Provjeri prikaz:
   - Lista svih poslova
   - Filteri (status, kategorija, korisnik)
   - Detalji posla

**Očekivani rezultat:**
- ✅ Svi poslovi se prikazuju
- ✅ Filteri rade
- ✅ Detalji se prikazuju

---

### Test 2.2: Moderacija Posla

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/Job`
2. Pronađi posao s statusom `PENDING` (moderacija)
3. Klikni "Pregledaj" ili "Moderate"
4. Odaberi akciju:
   - **Odobri** ili **Odbij**
   - Ako odbijaš, unesi razlog: `Nedovoljno informacija`
5. Klikni "Potvrdi"

**Očekivani rezultat:**
- ✅ Status posla ažuriran (`APPROVED` ili `REJECTED`)
- ✅ Korisnik prima notifikaciju
- ✅ Razlog odbijanja vidljiv

---

### Test 2.3: Brisanje Posla

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/Job`
2. Pronađi test posao
3. Klikni "Obriši" ili "Delete"
4. Potvrdi brisanje

**Očekivani rezultat:**
- ✅ Poruka: "Posao uspješno obrisan!"
- ✅ Posao uklonjen
- ✅ Cascade delete radi (ponude, chat sobe obrisane)

---

## 3️⃣ UPRAVLJANJE PRUŽATELJIMA

### Test 3.1: Pregled Pružatelja

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/ProviderProfile`
2. Provjeri prikaz:
   - Lista svih pružatelja
   - Filteri (kategorija, status verifikacije)
   - Detalji profila

**Očekivani rezultat:**
- ✅ Svi pružatelji se prikazuju
- ✅ Filteri rade
- ✅ Detalji se prikazuju

---

### Test 3.2: Verifikacija Pružatelja

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/ProviderProfile`
2. Pronađi pružatelja s statusom `WAITING_FOR_APPROVAL`
3. Klikni "Pregledaj" ili "Review"
4. Provjeri:
   - Licence
   - Dokumente
   - KYC verifikaciju
5. Odaberi akciju:
   - **Odobri** ili **Odbij**
   - Ako odbijaš, unesi razlog: `Nedostaju dokumenti`
6. Klikni "Potvrdi"

**Očekivani rezultat:**
- ✅ Status ažuriran (`APPROVED` ili `REJECTED`)
- ✅ Pružatelj prima notifikaciju
- ✅ Badge-evi ažurirani

---

### Test 3.3: Provider Approvals Dashboard

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/provider-approvals`
2. Provjeri prikaz:
   - Lista pružatelja koji čekaju odobrenje
   - Filteri (kategorija, datum)
   - Statistike

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Filteri rade
- ✅ Statistike su točne

---

## 4️⃣ PLATFORMA STATISTIKE

### Test 4.1: Platform Stats

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/platform-stats`
2. Provjeri prikaz:
   - Ukupni korisnici
   - Ukupni poslovi
   - Ukupni pružatelji
   - Aktivne pretplate
   - Ukupni prihod

**Očekivani rezultat:**
- ✅ Statistike se prikazuju
- ✅ Podaci su točni
- ✅ Grafovi su vidljivi (ako postoje)

---

### Test 4.2: Monthly Trends

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/platform-trends`
2. Provjeri prikaz:
   - Mjesečni trendovi korisnika
   - Mjesečni trendovi poslova
   - Mjesečni trendovi prihoda
3. Promijeni period (npr. zadnjih 6 mjeseci)

**Očekivani rezultat:**
- ✅ Trendovi se prikazuju
- ✅ Filteri rade
- ✅ Grafovi su vidljivi

---

## 5️⃣ MODERACIJA SADRŽAJA

### Test 5.1: Pending Moderation

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/moderation/pending`
2. Provjeri prikaz:
   - Lista sadržaja koji čeka moderaciju
   - Filteri (tip: job, review, offer, message)
   - Detalji sadržaja

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Filteri rade
- ✅ Detalji se prikazuju

---

### Test 5.2: Moderacija Recenzije

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/moderation/pending?type=review`
2. Pronađi recenziju koja čeka moderaciju
3. Klikni "Pregledaj"
4. Odaberi akciju:
   - **Odobri** ili **Odbij**
   - Ako odbijaš, unesi razlog: `Neprimjeren sadržaj`
5. Klikni "Potvrdi"

**Očekivani rezultat:**
- ✅ Status ažuriran
- ✅ Recenzija objavljena ili skrivena
- ✅ Korisnik prima notifikaciju

---

### Test 5.3: Moderation Stats

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/moderation/stats`
2. Provjeri prikaz:
   - Broj pending sadržaja
   - Broj odobrenih
   - Broj odbijenih
   - Prosječno vrijeme moderacije

**Očekivani rezultat:**
- ✅ Statistike se prikazuju
- ✅ Podaci su točni

---

## 6️⃣ AUDIT LOGOVI

### Test 6.1: Audit Logs

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/audit-logs`
2. Provjeri prikaz:
   - Lista audit logova
   - Filteri (akcija, korisnik, datum)
   - Detalji akcije

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Filteri rade
- ✅ Detalji se prikazuju

---

### Test 6.2: Filtriranje Audit Logova

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/audit-logs`
2. Postavi filtere:
   - **Akcija:** `MESSAGE_CREATED`
   - **Korisnik:** Odaberi korisnika
   - **Datum:** Zadnjih 7 dana
3. Klikni "Primijeni filtere"

**Očekivani rezultat:**
- ✅ Filtrirani rezultati se prikazuju
- ✅ Broj rezultata ažuriran

---

## 7️⃣ API REQUEST LOGOVI

### Test 7.1: API Request Logs

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/api-request-logs`
2. Provjeri prikaz:
   - Lista API zahtjeva
   - Filteri (metoda, path, status, korisnik)
   - Detalji zahtjeva (response time, IP)

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Filteri rade
- ✅ Detalji se prikazuju

---

### Test 7.2: API Request Stats

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/api-request-logs`
2. Klikni na "Statistike" ili "Stats"
3. Provjeri prikaz:
   - Statistike po status kodovima
   - Statistike po metodama
   - Top path-ovi
   - Prosječni response time

**Očekivani rezultat:**
- ✅ Statistike se prikazuju
- ✅ Podaci su točni

---

## 8️⃣ ERROR LOGOVI

### Test 8.1: Error Logs

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/error-logs`
2. Provjeri prikaz:
   - Lista grešaka
   - Filteri (level, status, endpoint, korisnik)
   - Detalji greške (stack trace, kontekst)

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Filteri rade
- ✅ Detalji se prikazuju

---

### Test 8.2: Ažuriranje Statusa Greške

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/error-logs`
2. Pronađi grešku s statusom `NEW`
3. Klikni "Pregledaj"
4. Promijeni status:
   - **IN_PROGRESS** ili **RESOLVED** ili **IGNORED**
   - Dodaj napomenu: `Riješeno u verziji 1.2.3`
5. Klikni "Spremi"

**Očekivani rezultat:**
- ✅ Status ažuriran
- ✅ Napomena dodana
- ✅ Automatski se bilježi tko je riješio i kada

---

## 9️⃣ SMS LOGOVI

### Test 9.1: SMS Logs

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/sms-logs`
2. Provjeri prikaz:
   - Lista SMS poruka
   - Filteri (telefon, tip, status, datum)
   - Detalji (Twilio SID, status, cijena)

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Filteri rade
- ✅ Detalji se prikazuju

---

### Test 9.2: SMS Stats

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/sms-logs`
2. Klikni na "Statistike" ili "Stats"
3. Provjeri prikaz:
   - Statistike po statusu
   - Statistike po tipu
   - Statistike po modu (test/production)

**Očekivani rezultat:**
- ✅ Statistike se prikazuju
- ✅ Podaci su točni

---

### Test 9.3: Sync SMS Logs from Twilio

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/sms-logs`
2. Klikni "Sync from Twilio" ili "Osvježi"
3. Čekaj da se sinkronizacija završi

**Očekivani rezultat:**
- ✅ Poruka: "Sinkronizacija završena!"
- ✅ Novi logovi se pojavljuju (ako postoje)

---

## 🔟 ADDON EVENT LOGOVI

### Test 10.1: Addon Event Logs

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/addon-event-logs`
2. Provjeri prikaz:
   - Lista event logova
   - Filteri (addon ID, event tip, datum)
   - Detalji eventa

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Filteri rade
- ✅ Detalji se prikazuju

---

## 1️⃣1️⃣ ČIŠĆENJE PODATAKA

### Test 11.1: Cleanup Preview

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/cleanup`
2. Klikni "Preview" ili "Pregled"
3. Provjeri prikaz:
   - Broj korisnika koji će biti obrisani
   - Broj poslova
   - Broj ponuda
   - Broj chat poruka
   - Itd.

**Očekivani rezultat:**
- ✅ Statistike se prikazuju
- ✅ Možeš odabrati koje email adrese sačuvati

---

### Test 11.2: Cleanup Execution

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/cleanup`
2. (Opcionalno) Unesi email adrese za sačuvati: `admin@example.com,test@example.com`
3. Klikni "Obriši sve" ili "Execute Cleanup"
4. Potvrdi akciju

**Očekivani rezultat:**
- ✅ Poruka: "Cleanup uspješno završen!"
- ✅ Statistike obrisanih podataka
- ✅ ADMIN korisnici sačuvani
- ✅ Master data sačuvana (kategorije, planovi)

---

### Test 11.3: Testing Cleanup

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/testing`
2. Klikni "Obriši test podatke" ili "Cleanup Test Data"
3. Potvrdi akciju

**Očekivani rezultat:**
- ✅ Poruka: "Svi test podaci su uspješno obrisani!"
- ✅ TestPlan, TestItem, TestRun, TestRunItem obrisani
- ✅ Nema foreign key constraint grešaka

---

## 1️⃣2️⃣ PLATFORMA UPRAVLJANJE

### Test 12.1: Kategorije

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/Category`
2. Provjeri prikaz:
   - Lista kategorija
   - Filteri
   - Detalji kategorije

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Filteri rade

---

### Test 12.2: Kreiranje Kategorije

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/Category`
2. Klikni "Nova kategorija" ili "Create"
3. Popuni formu:
   - **Naziv:** `Test Kategorija`
   - **Opis:** `Test opis kategorije`
   - **Ikona:** `🔧`
   - **NKD kod:** `43.21`
   - **Zahtijeva licencu:** ✅ (check)
   - **Tip licence:** `Elektrotehnička licenca`
   - **Tijelo koje izdaje:** `Hrvatska komora inženjera elektrotehnike`
4. Klikni "Spremi"

**Očekivani rezultat:**
- ✅ Poruka: "Kategorija uspješno kreirana!"
- ✅ Kategorija se pojavljuje u listi

---

### Test 12.3: Subscription Plans

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/SubscriptionPlan`
2. Provjeri prikaz:
   - Lista planova (BASIC, PREMIUM, PRO)
   - Detalji plana (cijena, funkcionalnosti)

**Očekivani rezultat:**
- ✅ Lista se prikazuje
- ✅ Detalji se prikazuju

---

## 1️⃣3️⃣ IZVJEŠTAJI

### Test 13.1: Monthly Reports

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/reports/send-monthly-reports`
2. Provjeri prikaz:
   - Broj korisnika koji će primiti izvještaj
   - Preview izvještaja
3. Klikni "Pošalji izvještaje"

**Očekivani rezultat:**
- ✅ Poruka: "Izvještaji uspješno poslani!"
- ✅ Email izvještaji poslani svim aktivnim korisnicima

---

## 1️⃣4️⃣ PLATFORMA DOKUMENTACIJA

### Test 14.1: Admin Documentation

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/documentation`
2. Provjeri prikaz:
   - Admin-only funkcionalnosti
   - Javne funkcionalnosti
   - Tehnički detalji
   - Status implementacije

**Očekivani rezultat:**
- ✅ Dokumentacija se prikazuje
- ✅ Admin funkcionalnosti vidljive
- ✅ Tehnički detalji vidljivi

---

### Test 14.2: API Reference

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/api-reference`
2. Provjeri prikaz:
   - Lista API endpointa
   - Detalji endpointa (metoda, path, opis)
   - Trigger informacije

**Očekivani rezultat:**
- ✅ API endpointi se prikazuju
- ✅ Detalji se prikazuju
- ✅ Filteri rade

---

## 1️⃣5️⃣ DATABASE EDITOR

### Test 15.1: Database Editor

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/admin/database`
2. Provjeri prikaz:
   - Lista tablica
   - Pregled podataka
   - CRUD operacije

**Očekivani rezultat:**
- ✅ Tablice se prikazuju
- ✅ Podaci se prikazuju
- ✅ CRUD operacije rade (oprezno!)

---

## ✅ Checklist Testiranja

- [ ] Pregled korisnika
- [ ] Kreiranje korisnika
- [ ] Uređivanje korisnika
- [ ] Brisanje korisnika
- [ ] Pregled poslova
- [ ] Moderacija posla
- [ ] Brisanje posla
- [ ] Pregled pružatelja
- [ ] Verifikacija pružatelja
- [ ] Provider Approvals Dashboard
- [ ] Platform Stats
- [ ] Monthly Trends
- [ ] Pending Moderation
- [ ] Moderacija recenzije
- [ ] Moderation Stats
- [ ] Audit Logs
- [ ] Filtriranje audit logova
- [ ] API Request Logs
- [ ] API Request Stats
- [ ] Error Logs
- [ ] Ažuriranje statusa greške
- [ ] SMS Logs
- [ ] SMS Stats
- [ ] Sync SMS Logs from Twilio
- [ ] Addon Event Logs
- [ ] Cleanup Preview
- [ ] Cleanup Execution
- [ ] Testing Cleanup
- [ ] Kategorije
- [ ] Kreiranje kategorije
- [ ] Subscription Plans
- [ ] Monthly Reports
- [ ] Admin Documentation
- [ ] API Reference
- [ ] Database Editor

---

## 🎯 Očekivani Rezultat

Nakon testiranja svih funkcionalnosti:
- ✅ Sve admin funkcionalnosti rade kako je dokumentirano
- ✅ Nema JavaScript grešaka u konzoli
- ✅ Nema 404 grešaka
- ✅ UI je responzivan i funkcionalan
- ✅ Filteri i search rade
- ✅ CRUD operacije rade
- ✅ Cascade delete radi bez grešaka
- ✅ Statistike su točne

---

## ⚠️ VAŽNO

- **Cleanup operacije su TRAJNE** - budite sigurni prije izvršavanja
- **Database Editor** - koristite oprezno, direktan pristup bazi
- **Brisanje korisnika** - cascade delete briše sve povezane podatke
- **Testing Cleanup** - briše samo test podatke (TestPlan, TestItem, TestRun, TestRunItem)

