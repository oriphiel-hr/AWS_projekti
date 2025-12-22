# 🧪 Detaljni Test Plan - Frontend (Korisnici)

**URL:** `https://uslugar.oriph.io/#documentation`

---

## 📋 Preduvjeti

1. **Browser:** Chrome/Edge/Firefox (najnovija verzija)
2. **Clear cache:** `Ctrl + Shift + R` (Hard Refresh)
3. **Test korisnici:** 
   - USER (korisnik usluge)
   - PROVIDER (pružatelj usluga)
   - Neregistrirani korisnik

---

## 1️⃣ REGISTRACIJA I AUTENTIFIKACIJA

### Test 1.1: Registracija Korisnika Usluge

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#register-user`
2. Klikni na "Registracija korisnika"
3. Popuni formu:
   - **Ime i prezime:** `Test Korisnik`
   - **Email:** `test.korisnik@example.com`
   - **Lozinka:** `Test123!@#`
   - **Potvrdi lozinku:** `Test123!@#`
   - **Telefon:** `+385 91 123 4567`
   - **Grad:** `Zagreb`
   - **Tip korisnika:** `Firma` (odaberi iz dropdowna)
   - **Pravni status:** `D.O.O.` (odaberi iz dropdowna)
   - **OIB:** `12345678901`
   - **Naziv firme:** `Test Firma d.o.o.`
4. Klikni "Registriraj se"

**Očekivani rezultat:**
- ✅ Poruka: "Registracija uspješna! Provjerite email za verifikaciju"
- ✅ Email poslan na `test.korisnik@example.com`
- ✅ Redirect na `/#verify` stranicu

---

### Test 1.2: Email Verifikacija

**Koraci:**
1. Otvori email inbox za `test.korisnik@example.com`
2. Pronađi email od Uslugara
3. Klikni na verifikacijski link
4. Provjeri da li se otvara `/#verify?token=...`

**Očekivani rezultat:**
- ✅ Email primljen u roku od 1 minute
- ✅ Link vodi na verifikacijsku stranicu
- ✅ Poruka: "Email uspješno verificiran!"
- ✅ Automatski redirect na `/#user` (glavna stranica)

---

### Test 1.3: Prijava Korisnika

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#login`
2. Unesi:
   - **Email:** `test.korisnik@example.com`
   - **Lozinka:** `Test123!@#`
3. Klikni "Prijavi se"

**Očekivani rezultat:**
- ✅ Uspješna prijava
- ✅ Redirect na `/#user` (glavna stranica)
- ✅ Header prikazuje ime korisnika
- ✅ Vidljive su opcije: "Moji Poslovi", "Moj Profil", "Chat"

---

### Test 1.4: Registracija Pružatelja Usluga

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#register-user`
2. Klikni na "Registracija pružatelja"
3. Popuni formu:
   - **Ime i prezime:** `Test Pružatelj`
   - **Email:** `test.pruzatelj@example.com`
   - **Lozinka:** `Test123!@#`
   - **Potvrdi lozinku:** `Test123!@#`
   - **Telefon:** `+385 91 987 6543`
   - **Grad:** `Split`
   - **Tip korisnika:** `Pružatelj usluga`
   - **Pravni status:** `Obrt` (odaberi iz dropdowna)
   - **OIB:** `98765432109`
   - **Naziv firme:** `Test Obrt`
4. Klikni "Registriraj se"

**Očekivani rezultat:**
- ✅ Poruka: "Registracija uspješna! Provjerite email za verifikaciju"
- ✅ Email poslan
- ✅ Redirect na verifikacijsku stranicu

---

### Test 1.5: Zaboravljena Lozinka

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#forgot-password`
2. Unesi email: `test.korisnik@example.com`
3. Klikni "Pošalji link za reset"

**Očekivani rezultat:**
- ✅ Poruka: "Link za reset lozinke je poslan na email"
- ✅ Email primljen s reset linkom
- ✅ Link vodi na `/#reset-password?token=...`

---

### Test 1.6: Reset Lozinke

**Koraci:**
1. Otvori reset link iz emaila
2. Unesi novu lozinku: `NovaLozinka123!@#`
3. Potvrdi lozinku: `NovaLozinka123!@#`
4. Klikni "Resetiraj lozinku"

**Očekivani rezultat:**
- ✅ Poruka: "Lozinka uspješno resetirana!"
- ✅ Redirect na `/#login`
- ✅ Možeš se prijaviti s novom lozinkom

---

## 2️⃣ UPRAVLJANJE POSLOVIMA

### Test 2.1: Objavljivanje Novog Posla

**Koraci:**
1. Prijavi se kao USER
2. Otvori: `https://uslugar.oriph.io/#user`
3. Klikni "Objavi posao" ili "Novi posao"
4. Popuni formu:
   - **Naslov:** `Potrebna renovacija kupaonice`
   - **Opis:** `Tražim majstora za kompletnu renovaciju kupaonice. Površina 8m². Potrebno: pločice, sanitarije, instalacije.`
   - **Kategorija:** `Vodoinstalater` (odaberi iz dropdowna)
   - **Grad:** `Zagreb`
   - **Minimalni budžet:** `5000`
   - **Maksimalni budžet:** `10000`
   - **Rok izvršenja:** Odaberi datum (npr. za 2 tjedna)
   - **Hitnost:** `HITNA`
   - **Veličina:** `SREDNJA`
   - **Slike:** Upload 2-3 slike (opcionalno)
5. Klikni "Objavi posao"

**Očekivani rezultat:**
- ✅ Poruka: "Posao uspješno objavljen!"
- ✅ Posao se pojavljuje u listi poslova
- ✅ Status: `OTVOREN`
- ✅ Vidljiv je pružateljima

---

### Test 2.2: Pretraživanje Poslova

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#user`
2. U tražilici unesi: `kupaonica`
3. Klikni "Pretraži" ili pritisni Enter

**Očekivani rezultat:**
- ✅ Prikazuju se poslovi koji sadrže "kupaonica"
- ✅ Broj pronađenih poslova prikazan
- ✅ Poslovi se prikazuju u grid ili list view-u

---

### Test 2.3: Filtriranje Poslova

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#user`
2. Klikni na "Filteri" ili ikonu filtera
3. Postavi filtere:
   - **Kategorija:** `Vodoinstalater`
   - **Grad:** `Zagreb`
   - **Budžet:** `5000 - 10000`
   - **Status:** `OTVOREN`
4. Klikni "Primijeni filtere"

**Očekivani rezultat:**
- ✅ Prikazuju se samo poslovi koji odgovaraju filterima
- ✅ Broj pronađenih poslova ažuriran
- ✅ Filteri su vidljivi (možeš ih očistiti)

---

### Test 2.4: Sortiranje Poslova

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#user`
2. Klikni na dropdown "Sortiraj po"
3. Odaberi: `Budžet: Visok → Nizak`

**Očekivani rezultat:**
- ✅ Poslovi sortirani po budžetu (od najvećeg prema najmanjem)
- ✅ Sortiranje se primjenjuje odmah

---

### Test 2.5: Spremljene Pretrage

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#user`
2. Postavi filtere (kategorija, grad, budžet)
3. Klikni "Spremi pretragu"
4. Unesi naziv: `Vodoinstalateri Zagreb`
5. Klikni "Spremi"

**Očekivani rezultat:**
- ✅ Poruka: "Pretraga spremljena!"
- ✅ Pretraga se pojavljuje u dropdownu "Spremljene pretrage"
- ✅ Možeš kliknuti na spremljenu pretragu da se primijene filteri

---

### Test 2.6: Job Alerts

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#user-profile`
2. Pronađi sekciju "Job Alerts"
3. Klikni "Kreiraj novi alert"
4. Popuni:
   - **Naziv:** `Vodoinstalateri Zagreb`
   - **Kategorija:** `Vodoinstalater`
   - **Grad:** `Zagreb`
   - **Frekvencija:** `INSTANT`
5. Klikni "Spremi"

**Očekivani rezultat:**
- ✅ Alert kreiran
- ✅ Email notifikacija će stići kada se objavi novi posao koji odgovara kriterijima

---

## 3️⃣ SUSTAV PONUDA

### Test 3.1: Slanje Ponude (PROVIDER)

**Koraci:**
1. Prijavi se kao PROVIDER
2. Otvori: `https://uslugar.oriph.io/#user`
3. Pronađi posao (npr. "Potrebna renovacija kupaonice")
4. Klikni "Pošalji ponudu" ili "Otvori posao"
5. Popuni formu:
   - **Iznos:** `7500`
   - **Poruka:** `Pozdrav! Imam 10+ godina iskustva u renovacijama kupaonica. Mogu započeti sljedeći tjedan.`
   - **Pregovorno:** ✅ (check)
   - **Procijenjeni dani:** `14`
6. Klikni "Pošalji ponudu"

**Očekivani rezultat:**
- ✅ Poruka: "Ponuda uspješno poslana!"
- ✅ Provjeri da li imaš dovoljno kredita (ako je potrebno)
- ✅ Korisnik prima notifikaciju o novoj ponudi

---

### Test 3.2: Prihvaćanje Ponude (USER)

**Koraci:**
1. Prijavi se kao USER (vlasnik posla)
2. Otvori: `https://uslugar.oriph.io/#my-jobs`
3. Pronađi posao s ponudama
4. Klikni na ponudu
5. Klikni "Prihvati ponudu"

**Očekivani rezultat:**
- ✅ Poruka: "Ponuda prihvaćena!"
- ✅ Status posla: `U TIJEKU`
- ✅ Status ponude: `PRIHVAĆENA`
- ✅ Automatski se kreira chat soba
- ✅ Pružatelj prima notifikaciju

---

### Test 3.3: Odbijanje Ponude (USER)

**Koraci:**
1. Prijavi se kao USER
2. Otvori: `https://uslugar.oriph.io/#my-jobs`
3. Pronađi posao s ponudama
4. Klikni na ponudu
5. Klikni "Odbij ponudu"

**Očekivani rezultat:**
- ✅ Poruka: "Ponuda odbijena"
- ✅ Status ponude: `ODBIJENA`
- ✅ Pružatelj prima notifikaciju

---

## 4️⃣ CHAT I KOMUNIKACIJA

### Test 4.1: Otvaranje Chat Sobe

**Koraci:**
1. Prijavi se kao USER ili PROVIDER
2. Otvori: `https://uslugar.oriph.io/#my-jobs`
3. Pronađi posao s prihvaćenom ponudom
4. Klikni "Otvori Chat"

**Očekivani rezultat:**
- ✅ Chat soba se otvara
- ✅ Prikazuje se povijest poruka (ako postoje)
- ✅ Možeš slati nove poruke

---

### Test 4.2: Slanje Poruke

**Koraci:**
1. Otvori chat sobu (Test 4.1)
2. U polje za poruku unesi: `Pozdrav! Kada možemo započeti?`
3. Klikni "Pošalji" ili pritisni Enter

**Očekivani rezultat:**
- ✅ Poruka se pojavljuje u chatu
- ✅ Poruka je vidljiva obje strane
- ✅ Status: `Poslano` ili `Pročitano`
- ✅ Real-time update (ako je druga strana online)

---

### Test 4.3: Slanje Slike u Chatu

**Koraci:**
1. Otvori chat sobu
2. Klikni na ikonu za upload slike
3. Odaberi sliku (JPEG/PNG, max 5MB)
4. Klikni "Pošalji"

**Očekivani rezultat:**
- ✅ Slika se uploada
- ✅ Slika se prikazuje u chatu
- ✅ Možeš kliknuti na sliku da se proširi

---

## 5️⃣ RECENZIJE I OCJENJIVANJE

### Test 5.1: Ostavljanje Recenzije (USER)

**Koraci:**
1. Prijavi se kao USER
2. Otvori: `https://uslugar.oriph.io/#my-jobs`
3. Pronađi završen posao (status: `ZAVRŠEN`)
4. Klikni "Ocijeni pružatelja"
5. Popuni:
   - **Ocjena:** `5` (zvjezdice)
   - **Komentar:** `Odličan posao! Profesionalan pristup, sve završeno na vrijeme.`
6. Klikni "Pošalji recenziju"

**Očekivani rezultat:**
- ✅ Poruka: "Recenzija uspješno poslana!"
- ✅ Recenzija se prikazuje na profilu pružatelja
- ✅ Prosječna ocjena pružatelja ažurirana

---

### Test 5.2: Uređivanje Recenzije

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#my-jobs`
2. Pronađi posao s recenzijom
3. Klikni "Uredi recenziju"
4. Promijeni komentar: `Odličan posao! Profesionalan pristup, sve završeno na vrijeme. Preporučujem!`
5. Klikni "Spremi promjene"

**Očekivani rezultat:**
- ✅ Recenzija ažurirana
- ✅ Promjene vidljive na profilu pružatelja

---

## 6️⃣ PROFIL PRUŽATELJA

### Test 6.1: Pregled Profila Pružatelja

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#providers`
2. Klikni na profil pružatelja
3. Provjeri prikaz:
   - Biografija
   - Kategorije
   - Portfolio
   - Recenzije
   - Prosječna ocjena

**Očekivani rezultat:**
- ✅ Svi podaci se prikazuju
- ✅ Portfolio slike se učitavaju
- ✅ Recenzije su vidljive

---

### Test 6.2: Uređivanje Profila (PROVIDER)

**Koraci:**
1. Prijavi se kao PROVIDER
2. Otvori: `https://uslugar.oriph.io/#provider-profile`
3. Klikni "Uredi profil"
4. Ažuriraj:
   - **Biografija:** `Profesionalni vodoinstalater s 15+ godina iskustva.`
   - **Godine iskustva:** `15`
   - **Web stranica:** `https://test-vodoinstalater.hr`
   - **Područje rada:** `Zagreb i okolica`
5. Klikni "Spremi promjene"

**Očekivani rezultat:**
- ✅ Poruka: "Profil uspješno ažuriran!"
- ✅ Promjene vidljive na profilu

---

## 7️⃣ USLUGAR EXCLUSIVE

### Test 7.1: Pregled Lead Marketplace

**Koraci:**
1. Prijavi se kao PROVIDER
2. Otvori: `https://uslugar.oriph.io/#leads`
3. Provjeri prikaz:
   - Lista dostupnih leadova
   - AI Score (0-100)
   - Cijena (krediti)
   - Kategorija
   - Lokacija

**Očekivani rezultat:**
- ✅ Leadovi se prikazuju
- ✅ AI Score vidljiv
- ✅ Cijena vidljiva
- ✅ Možeš filtrirati po kategoriji

---

### Test 7.2: Kupnja Leada

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#leads`
2. Pronađi lead (npr. AI Score 85, cijena 15 kredita)
3. Provjeri da li imaš dovoljno kredita
4. Klikni "Kupi lead"
5. Potvrdi kupnju

**Očekivani rezultat:**
- ✅ Poruka: "Lead uspješno kupljen!"
- ✅ Krediti oduzeti
- ✅ Lead se pojavljuje u "Moji leadovi"
- ✅ Status: `ACTIVE`

---

### Test 7.3: ROI Dashboard

**Koraci:**
1. Prijavi se kao PROVIDER
2. Otvori: `https://uslugar.oriph.io/#roi`
3. Provjeri prikaz:
   - Ukupni ROI
   - Statistike po leadovima
   - Conversion rate
   - Povijest transakcija

**Očekivani rezultat:**
- ✅ Statistike se prikazuju
- ✅ Grafovi su vidljivi
- ✅ Možeš filtrirati po datumu

---

### Test 7.4: Moji Leadovi

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#my-leads`
2. Provjeri prikaz:
   - Lista kupljenih leadova
   - Status (ACTIVE, CONTACTED, CONVERTED, REFUNDED)
   - AI Score
   - Datum kupnje

**Očekivani rezultat:**
- ✅ Leadovi se prikazuju
- ✅ Statusi su vidljivi
- ✅ Možeš označiti lead kao "Kontaktiran" ili "Konvertiran"

---

## 8️⃣ PRETPLATA I KREDITI

### Test 8.1: Pregled Pretplata

**Koraci:**
1. Prijavi se kao PROVIDER
2. Otvori: `https://uslugar.oriph.io/#subscription`
3. Provjeri prikaz:
   - Trenutni plan (BASIC/PREMIUM/PRO)
   - Dostupne funkcionalnosti
   - Cijena
   - Comparison table

**Očekivani rezultat:**
- ✅ Planovi se prikazuju
- ✅ Trenutni plan označen
- ✅ Funkcionalnosti vidljive

---

### Test 8.2: Upgrade na Premium

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#subscription`
2. Klikni "Upgrade na Premium"
3. Provjeri Stripe checkout
4. (Test mode) Unesi test kartice:
   - **Broj kartice:** `4242 4242 4242 4242`
   - **Datum:** `12/25`
   - **CVC:** `123`
5. Klikni "Plati"

**Očekivani rezultat:**
- ✅ Redirect na Stripe checkout
- ✅ Nakon plaćanja: redirect na `/#subscription-success`
- ✅ Plan ažuriran na PREMIUM
- ✅ Krediti dodani

---

### Test 8.3: Pregled Kredita

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#user`
2. Provjeri widget kredita u headeru
3. Klikni na widget (ako je klikabilan)

**Očekivani rezultat:**
- ✅ Trenutni balans kredita vidljiv
- ✅ Ako je nizak (< 10), alert se prikazuje
- ✅ Link na subscription stranicu

---

## 9️⃣ NOTIFIKACIJE

### Test 9.1: In-App Notifikacije

**Koraci:**
1. Prijavi se kao USER
2. Objavi novi posao
3. Prijavi se kao PROVIDER (drugi browser/Incognito)
4. Pošalji ponudu na posao
5. Vrati se na USER account
6. Provjeri notifikacije (ikonu zvona u headeru)

**Očekivani rezultat:**
- ✅ Notifikacija se pojavljuje
- ✅ Brojač nepročitanih se ažurira
- ✅ Možeš kliknuti na notifikaciju da otvoriš detalje

---

### Test 9.2: Email Notifikacije

**Koraci:**
1. Objavi novi posao kao USER
2. Provjeri email inbox

**Očekivani rezultat:**
- ✅ Email primljen: "Novi posao objavljen"
- ✅ Email sadrži link na posao

---

## 🔟 PROFIL KORISNIKA

### Test 10.1: Pregled Profila

**Koraci:**
1. Prijavi se
2. Klikni na ime u headeru → "Moj Profil"
3. Provjeri prikaz:
   - Osnovni podaci
   - Spremljene pretrage
   - Job alerts
   - Moji poslovi
   - Moji leadovi (ako je PROVIDER)

**Očekivani rezultat:**
- ✅ Svi podaci se prikazuju
- ✅ Možeš uređivati profil

---

### Test 10.2: Uređivanje Profila

**Koraci:**
1. Otvori: `https://uslugar.oriph.io/#user-profile`
2. Klikni "Uredi profil"
3. Ažuriraj:
   - **Telefon:** `+385 91 111 2222`
   - **Grad:** `Rijeka`
4. Klikni "Spremi promjene"

**Očekivani rezultat:**
- ✅ Poruka: "Profil uspješno ažuriran!"
- ✅ Promjene vidljive

---

## ✅ Checklist Testiranja

- [ ] Registracija korisnika
- [ ] Email verifikacija
- [ ] Prijava
- [ ] Registracija pružatelja
- [ ] Zaboravljena lozinka
- [ ] Reset lozinke
- [ ] Objavljivanje posla
- [ ] Pretraživanje poslova
- [ ] Filtriranje poslova
- [ ] Sortiranje poslova
- [ ] Spremljene pretrage
- [ ] Job alerts
- [ ] Slanje ponude
- [ ] Prihvaćanje ponude
- [ ] Odbijanje ponude
- [ ] Chat - slanje poruke
- [ ] Chat - slanje slike
- [ ] Ostavljanje recenzije
- [ ] Uređivanje recenzije
- [ ] Pregled profila pružatelja
- [ ] Uređivanje profila pružatelja
- [ ] Lead Marketplace
- [ ] Kupnja leada
- [ ] ROI Dashboard
- [ ] Moji leadovi
- [ ] Pregled pretplata
- [ ] Upgrade na Premium
- [ ] Pregled kredita
- [ ] In-app notifikacije
- [ ] Email notifikacije
- [ ] Pregled profila
- [ ] Uređivanje profila

---

## 🎯 Očekivani Rezultat

Nakon testiranja svih funkcionalnosti:
- ✅ Sve funkcionalnosti rade kako je dokumentirano
- ✅ Nema JavaScript grešaka u konzoli
- ✅ Nema 404 grešaka
- ✅ UI je responzivan i funkcionalan
- ✅ Notifikacije rade
- ✅ Email notifikacije stižu

