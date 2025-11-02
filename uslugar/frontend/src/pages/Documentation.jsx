import React, { useState } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext.jsx';

const Documentation = () => {
  const { isDarkMode } = useDarkMode();
  const [expandedItem, setExpandedItem] = useState(null); // Track which item is expanded

  // Detaljni opisi funkcionalnosti
  const featureDescriptions = {
    "Grafički prikaz statistika": {
      implemented: true,
      summary: "Grafički prikaz statistika je implementiran.",
      details: `## Implementirano:

### 1. **Instalirane biblioteke**
   - \`chart.js\` - glavna biblioteka za grafove
   - \`react-chartjs-2\` - React wrapper za Chart.js

### 2. **Grafičke komponente u ROI dashboardu**
   
   **Status Breakdown - Doughnut Chart:**
   - Vizualni prikaz statusa leadova (Konvertirani, Kontaktirani, Aktivni, Refundirani)
   - Krugovni graf s bojama za svaki status
   
   **Monthly Revenue & ROI - Line Chart:**
   - Prikaz prihoda i ROI-a kroz mjesece
   - Dvostruki Y-os (lijevo: EUR, desno: %)
   - Kombinirani trend prihoda i ROI-a
   
   **Monthly Leads - Bar Chart:**
   - Grupirani stupčasti graf
   - Kupljeno, Kontaktirano, Konvertirano po mjesecima
   - Boje za razlikovanje metrika
   
   **Conversion Rate - Line Chart:**
   - Trend stope konverzije kroz godinu
   - Linijski graf s ispunom
   
   **Category Revenue - Bar Chart:**
   - Prihod po kategorijama
   - Top 8 kategorija po prihodu
   - Boje za svaku kategoriju

### 3. **Funkcionalnosti**
   - Godišnji seletor: pregled trenutne, prošle ili prethodne godine
   - Dark mode: grafovi prilagođeni dark modu
   - Responzivni dizajn: prilagođeno različitim veličinama ekrana
   - Interaktivni tooltips: detalji pri hoveru
   - Tematske boje: konzistentne boje kroz grafove

### 4. **API integracija**
   - Dodan \`getYearlyReport()\` u \`exclusive.js\`
   - Automatsko učitavanje godišnjeg izvještaja
   - Dinamičko ažuriranje grafova pri promjeni godine

### 5. **Dizajn**
   - Grafovi prilagođeni dashboard temi
   - Spacing i layout optimizirani
   - Dark mode podrška za sve grafove
   - Profesionalni stil s legendama i osima

### 6. **Chart.js konfiguracija**
   - Registrirane sve potrebne komponente (Line, Bar, Doughnut)
   - Custom opcije za tooltips i legende
   - Multiple Y-axes za kombinirane metrike
   - Theme-aware boje (light/dark mode)

### 7. **Dokumentacija**
   - Ažuriran \`Documentation.jsx\` - "Grafički prikaz statistika" označeno kao implementirano

## Korisničko iskustvo:

- Interaktivni grafovi: hover za detalje
- Pregled trendova: linijski grafovi za trendove
- Usporedbe: bar chartovi za usporedbu
- Vizualna razgradnja: doughnut chart za status breakdown
- Dinamički prikaz: seletor godine za pregled različitih perioda

Sve promjene su commitane i pushane. Pružatelji usluga sada imaju grafički prikaz ROI statistika s interaktivnim grafovima koji olakšavaju analizu i donošenje odluka.
`
    },
    "Hijerarhijska struktura kategorija": {
      implemented: true,
      summary: "Hijerarhijska struktura kategorija je implementirana.",
      details: `## Implementirano:

### 1. **Struktura podataka**
   - Parent-child odnos kategorija u bazi podataka
   - \`parentId\` polje u Category modelu
   - Rekurzivni upiti za dohvat hijerarhije
   
### 2. **Backend implementacija**
   - Prisma schema: \`parent Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])\`
   - Dohvat kategorija s hijerarhijom
   - Filtering po roditeljskim kategorijama
   
### 3. **Frontend prikaz**
   - Nested prikaz kategorija u dropdown-ima
   - Rekurzivna render funkcija za kategorije
   - Indentacija za podkategorije
   - Filtering poslova po glavnim i podkategorijama
   
### 4. **Funkcionalnosti**
   - Pregled glavnih kategorija i njihovih podkategorija
   - Kreiranje novih podkategorija
   - Promjena parent kategorije
   - Rekurzivno brisanje (cascade)
`
    },
    "Portfolio radova": {
      implemented: true,
      summary: "Portfolio radova je implementirano.",
      details: `## Implementirano:

### 1. **Model podataka**
   - \`PortfolioItem\` model u Prisma schema
   - Povezivanje s ProviderProfile-om
   - Polja: naslov, opis, slike, kategorija, datum
   
### 2. **Backend API**
   - \`POST /api/providers/portfolio\` - dodavanje portfolija
   - \`GET /api/providers/:id/portfolio\` - dohvat portfolija
   - \`PUT /api/providers/portfolio/:id\` - ažuriranje
   - \`DELETE /api/providers/portfolio/:id\` - brisanje
   
### 3. **Frontend komponente**
   - Portfolio galerija na profilu pružatelja
   - Upload slika za portfolio
   - Lightbox za pregled slika
   - Grid layout za prikaz portfolija
   
### 4. **Funkcionalnosti**
   - Dodavanje više slika u portfolio
   - Organizacija po projektima
   - Kategorizacija portfolija
   - Pregled portfolija korisnicima
`
    },
    "Certifikati i licence": {
      implemented: true,
      summary: "Certifikati i licence su implementirani.",
      details: `## Implementirano:

### 1. **Model podataka**
   - \`ProviderLicense\` model u Prisma schema
   - Polja: tip licence, broj, izdavatelj, datum izdavanja, istek, dokument
   
### 2. **Upload i verifikacija**
   - Upload PDF dokumenata licenci
   - Admin verifikacija licenci
   - Automatska provjera isteka
   - Notifikacije o isteku licenci
   
### 3. **Integracija s kategorijama**
   - Povezivanje licenci s kategorijama koje ih zahtijevaju
   - Prikaz licenci po kategorijama
   - Validacija pri odabiru kategorija
   
### 4. **Funkcionalnosti**
   - Upload dokumenata licenci
   - Pregled svih licenci pružatelja
   - Verifikacija od strane admina
   - Prikaz na profilu pružatelja
   - Notifikacije o isteku licenci (30, 14, 7, 1 dan)
`
    },
    "Dark mode": {
      implemented: true,
      summary: "Dark mode je implementiran.",
      details: `## Implementirano:

### 1. **Context i State Management**
   - \`DarkModeContext\` za globalno upravljanje dark modom
   - Spremanje preference u localStorage
   - Automatsko učitavanje preference pri učitavanju stranice
   
### 2. **UI komponente**
   - Toggle button za prebacivanje dark/light mode
   - Dark mode klasa primijenjena na sve komponente
   - Tailwind dark: varijante za sve boje
   
### 3. **Konfiguracija**
   - Tailwind CSS dark mode konfiguracija
   - System preference detection
   - Manual override opcija
   
### 4. **Funkcionalnosti**
   - Smooth transition između modova
   - Persistence preference
   - Kontrast i čitljivost osigurana u oba moda
   - Svi grafovi i komponente prilagođeni dark modu
`
    },
    "Pristupačnost (accessibility)": {
      implemented: true,
      summary: "Pristupačnost je implementirana.",
      details: `## Implementirano:

### 1. **WCAG 2.1 Compliance**
   - ARIA atribute za screen readere
   - Semantic HTML elementi
   - Proper heading hierarchy (h1, h2, h3)
   
### 2. **Keyboard Navigation**
   - Tab navigacija kroz sve interaktive elemente
   - Skip links za glavni sadržaj
   - Keyboard shortcuts za akcije
   - Focus management
   
### 3. **Screen Reader Support**
   - Alt tekst za sve slike
   - ARIA labels za ikone i button-e
   - Live regions za dinamički sadržaj
   - Descriptive link tekstovi
   
### 4. **Funkcionalnosti**
   - Kontrast omjeri (4.5:1 za tekst)
   - Resizable tekst
   - Color blind friendly paleta boja
   - Keyboard accessible modali i dropdown-ovi
`
    }
  };

  const features = [
    {
      category: "Registracija i Autentifikacija",
      items: [
        { name: "Registracija korisnika usluge", implemented: true },
        { name: "Registracija pružatelja usluga", implemented: true },
        { name: "Prijava korisnika", implemented: true },
        { name: "Email verifikacija", implemented: true },
        { name: "Resetiranje lozinke", implemented: true },
        { name: "Zaboravljena lozinka", implemented: true },
        { name: "JWT token autentifikacija", implemented: true },
        { name: "Različite uloge korisnika (USER, PROVIDER, ADMIN)", implemented: true }
      ]
    },
    {
      category: "Upravljanje Kategorijama",
      items: [
        { name: "51 kategorija usluga iz 'Trebam hr' baze", implemented: true },
        { name: "Dinamičko učitavanje kategorija iz baze", implemented: true },
        { name: "Emoji ikone za kategorije", implemented: true },
        { name: "Opisi kategorija", implemented: true },
        { name: "NKD kodovi djelatnosti", implemented: true },
        { name: "Oznake za licencirane djelatnosti", implemented: true },
        { name: "Tipovi licenci (Elektrotehnička, Građevinska, itd.)", implemented: true },
        { name: "Tijela koja izdaju licence", implemented: true },
        { name: "Hijerarhijska struktura kategorija", implemented: true },
        { name: "Filtriranje poslova po kategorijama", implemented: true }
      ]
    },
    {
      category: "Upravljanje Poslovima",
      items: [
        { name: "Objavljivanje novih poslova", implemented: true },
        { name: "Detaljni opis posla", implemented: true },
        { name: "Postavljanje budžeta (min-max)", implemented: true },
        { name: "Lokacija posla (grad)", implemented: true },
        { name: "Geolokacija (latitude/longitude)", implemented: true },
        { name: "Slike posla", implemented: true },
        { name: "Status posla (OTVOREN, U TIJEKU, ZAVRŠEN, OTKAZAN)", implemented: true },
        { name: "Hitnost posla (NORMALNA, HITNA)", implemented: true },
        { name: "Veličina posla (MALA, SREDNJA, VELIKA)", implemented: true },
        { name: "Rok izvršenja", implemented: true },
        { name: "Pretraživanje poslova", implemented: true },
        { name: "Filtriranje po kategoriji, lokaciji, budžetu", implemented: true },
        { name: "Pregled detalja posla", implemented: true }
      ]
    },
    {
      category: "Sustav Ponuda",
      items: [
        { name: "Slanje ponuda za poslove", implemented: true },
        { name: "Iznos ponude", implemented: true },
        { name: "Poruka uz ponudu", implemented: true },
        { name: "Status ponude (NA ČEKANJU, PRIHVAĆENA, ODBIJENA)", implemented: true },
        { name: "Mogućnost pregovaranja o cijeni", implemented: true },
        { name: "Označavanje ponuda kao pregovorno", implemented: true },
        { name: "Procijenjeni broj dana za izvršenje", implemented: true },
        { name: "Pregled svih ponuda za posao", implemented: true },
        { name: "Prihvaćanje/odbijanje ponuda", implemented: true }
      ]
    },
    {
      category: "Sustav Bodovanja i Recenzija",
      items: [
        { name: "Ocjenjivanje pružatelja usluga (1-5 zvjezdica)", implemented: true },
        { name: "Komentiranje iskustva s pružateljem", implemented: true },
        { name: "Bilateralno ocjenjivanje (korisnik ↔ pružatelj)", implemented: true },
        { name: "Sprečavanje duplikata recenzija", implemented: true },
        { name: "Uređivanje postojećih recenzija", implemented: true },
        { name: "Brisanje recenzija", implemented: true },
        { name: "Automatsko izračunavanje prosječne ocjene", implemented: true },
        { name: "Brojanje ukupnog broja recenzija", implemented: true },
        { name: "Prikaz recenzija na profilu pružatelja", implemented: true },
      ]
    },
    {
      category: "Profili Pružatelja",
      items: [
        { name: "Detaljni profil pružatelja", implemented: true },
        { name: "Biografija pružatelja", implemented: true },
        { name: "Specijalizacije", implemented: true },
        { name: "Godine iskustva", implemented: true },
        { name: "Web stranica", implemented: true },
        { name: "Područje rada", implemented: true },
        { name: "Status dostupnosti", implemented: true },
        { name: "Kategorije u kojima radi", implemented: true },
        { name: "Odabir kategorija za primanje leadova", implemented: true },
        { name: "Filtriranje leadova po kategorijama", implemented: true },
        { name: "Portfolio radova", implemented: true },
        { name: "Certifikati i licence", implemented: true },
        { name: "Pregled svih pružatelja", implemented: true },
        { name: "Filtriranje pružatelja", implemented: true },
        { name: "Team Locations - geo-dinamičke lokacije", implemented: true },
        { name: "Upravljanje tim lokacijama", implemented: true },
        { name: "Radius checking za lokacije", implemented: true },
        { name: "Haversine formula za udaljenost", implemented: true }
      ]
    },
    {
      category: "Chat i Komunikacija",
      items: [
        { name: "Real-time chat između korisnika i pružatelja", implemented: true },
        { name: "Chat sobe za svaki posao", implemented: true },
        { name: "Povijest poruka", implemented: true },
        { name: "Slanje slika u chatu", implemented: true },
        { name: "Notifikacije za nove poruke", implemented: true },
        { name: "Status poruke (poslana, pročitana)", implemented: true }
      ]
    },
    {
      category: "Notifikacije",
      items: [
        { name: "Notifikacije za nove ponude", implemented: true },
        { name: "Notifikacije za prihvaćene ponude", implemented: true },
        { name: "Notifikacije za nove poruke", implemented: true },
        { name: "Notifikacije za nove poslove (providere)", implemented: true },
        { name: "Email notifikacije", implemented: true },
        { name: "In-app notifikacije", implemented: true },
        { name: "Brojač nepročitanih notifikacija", implemented: true }
      ]
    },
    {
      category: "USLUGAR EXCLUSIVE Funkcionalnosti",
      items: [
        { name: "Ekskluzivni lead sustav", implemented: true },
        { name: "Tržište leadova", implemented: true },
        { name: "Kreditni sustav", implemented: true },
        { name: "Cijene leadova (10-20 kredita)", implemented: true },
        { name: "Kupnja leadova", implemented: true },
        { name: "ROI dashboard", implemented: true },
        { name: "Moji leadovi", implemented: true },
        { name: "Red čekanja za leadove", implemented: true },
        { name: "AI score kvalitete leadova", implemented: true },
        { name: "Verifikacija klijenata", implemented: true },
        { name: "Pretplata na leadove", implemented: true },
        { name: "Statistike uspješnosti", implemented: true }
      ]
    },
    {
      category: "Queue Sustav za Distribuciju Leadova",
      items: [
        { name: "Red čekanja za leadove (LeadQueue)", implemented: true },
        { name: "Pozicija u redu čekanja", implemented: true },
        { name: "Statusi u redu (WAITING, OFFERED, ACCEPTED, DECLINED, EXPIRED, SKIPPED)", implemented: true },
        { name: "Automatska distribucija leadova", implemented: true },
        { name: "Rok za odgovor (24h)", implemented: true },
        { name: "Odgovori providera (INTERESTED, NOT_INTERESTED, NO_RESPONSE)", implemented: true },
        { name: "Preskakanje neaktivnih providera", implemented: true },
        { name: "Queue scheduler (provjera svakih sat vremena)", implemented: true },
        { name: "Notifikacije za nove leadove u redu", implemented: true },
        { name: "Pregled mojih leadova u redu", implemented: true },
        { name: "Statistike queue sustava", implemented: true },
      ]
    },
    {
      category: "Refund i Povrat Kredita",
      items: [
        { name: "Refund kredita (vraćanje internih kredita)", implemented: true },
        { name: "Stripe Payment Intent refund API (PSD2 compliant)", implemented: true },
        { name: "Automatski odabir refund metode (Stripe API ili interni krediti)", implemented: true },
        { name: "Refund ako klijent ne odgovori u roku", implemented: true },
        { name: "Razlozi za refund (klijent ne odgovori, itd.)", implemented: true },
        { name: "Ručno zatraživanje refund-a", implemented: true },
        { name: "Povijest refund transakcija (CreditTransaction tip REFUND)", implemented: true },
        { name: "Status refund-a (REFUNDED)", implemented: true },
        { name: "Oslobađanje leada nakon refund-a (lead se vraća na tržište)", implemented: true },
        { name: "Stripe refund ID tracking (stripeRefundId)", implemented: true },
        { name: "Fallback na interne kredite ako Stripe refund ne uspije", implemented: true },
        { name: "Povrat novca za pretplate (refund subscription payment)", implemented: true },
        { name: "Automatski refund nakon 48h neaktivnosti", implemented: true }
      ]
    },
    {
      category: "Upravljanje Pretplatama",
      items: [
        { name: "Pregled trenutne pretplate", implemented: true },
        { name: "Dostupni planovi (BASIC, PREMIUM, PRO)", implemented: true },
        { name: "Nadogradnja pretplate", implemented: true },
        { name: "Otkazivanje pretplate", implemented: true },
        { name: "Status pretplate (ACTIVE, CANCELLED, EXPIRED)", implemented: true },
        { name: "Automatsko isteka pretplate", implemented: true },
        { name: "Notifikacije o isteku pretplate", implemented: true },
        { name: "Povijest pretplata", implemented: true },
        { name: "Trial period (7 dana)", implemented: true },
        { name: "Besplatni krediti za trial (5 leadova)", implemented: true },
        { name: "Automatsko vraćanje na BASIC plan", implemented: true }
      ]
    },
    {
      category: "Pravni Status i Verifikacija",
      items: [
        { name: "Različiti pravni statusi (Fizička osoba, Obrt, d.o.o., j.d.o.o., itd.)", implemented: true },
        { name: "OIB validacija", implemented: true },
        { name: "Naziv tvrtke/obrta", implemented: true },
        { name: "Auto-verifikacija naziva tvrtke (Sudski registar, Obrtni registar)", implemented: true },
        { name: "Porezni broj", implemented: true },
        { name: "Email verifikacija", implemented: true },
        { name: "SMS verifikacija telefonskog broja (Twilio)", implemented: true },
        { name: "DNS TXT record verifikacija domena", implemented: true },
        { name: "Email verifikacija na domeni tvrtke", implemented: true },
        { name: "Identity Badge sustav (Email, Phone, DNS, Business značke)", implemented: true },
        { name: "Datum verifikacije za svaku značku", implemented: true },
        { name: "Prikaz znački na profilu pružatelja", implemented: true },
        { name: "Dokumenti za verifikaciju", implemented: true }
      ]
    },
    {
      category: "Identity Badge Sustav i Verifikacije",
      items: [
        { name: "Email Identity Badge (značka)", implemented: true },
        { name: "Phone Identity Badge (SMS verifikacija)", implemented: true },
        { name: "DNS Identity Badge (TXT record)", implemented: true },
        { name: "Business Badge (tvrtka/obrt verifikacija)", implemented: true },
        { name: "Prikaz datuma verifikacije", implemented: true },
        { name: "Status verifikacije na profilu", implemented: true },
        { name: "Identity Badge Verifikacija komponenta", implemented: true },
        { name: "Rate limiting za SMS verifikaciju", implemented: true },
        { name: "Verifikacijski kod expiration (10 minuta)", implemented: true }
      ]
    },
    {
      category: "Reputacijski Sustav",
      items: [
        { name: "Prosječno vrijeme odgovora (avgResponseTimeMinutes)", implemented: true },
        { name: "Stopa konverzije leadova (conversionRate)", implemented: true },
        { name: "Praćenje vremena odgovora na leadove", implemented: true },
        { name: "Automatsko izračunavanje reputacije", implemented: true },
        { name: "Prikaz reputacije na profilu", implemented: true },
        { name: "Integracija s lead matching algoritmom", implemented: true }
      ]
    },
    {
      category: "Korisnici Usluge (Service Users)",
      items: [
        { name: "Registracija kao korisnik usluge", implemented: true },
        { name: "Odabir tipa korisnika (Korisnik usluge / Pružatelj usluge)", implemented: true },
        { name: "Fizička osoba vs Pravna osoba za korisnike", implemented: true },
        { name: "Profil korisnika usluge (UserProfile)", implemented: true },
        { name: "Objavljivanje poslova od strane korisnika", implemented: true },
        { name: "Pregled vlastitih poslova (MyJobs)", implemented: true },
        { name: "Primanje ponuda za poslove", implemented: true },
        { name: "Prihvaćanje ponuda", implemented: true },
        { name: "Navigacija specifična za korisnike usluge", implemented: true },
        { name: "Sakrivanje provider-specifičnih linkova za korisnike", implemented: true }
      ]
    },
    {
      category: "Plaćanja i Stripe Integracija",
      items: [
        { name: "Stripe Checkout integracija", implemented: true },
        { name: "Plaćanje pretplata preko Stripe", implemented: true },
        { name: "Stripe Payment Intent za kupovinu leadova", implemented: true },
        { name: "Kreiranje Payment Intent-a za pojedinačnu kupovinu leada", implemented: true },
        { name: "Plaćanje leadova kroz Stripe (opcionalno, umjesto internih kredita)", implemented: true },
        { name: "Stripe webhook handling", implemented: true },
        { name: "Automatsko ažuriranje pretplate nakon plaćanja", implemented: true },
        { name: "Payment success/failure handling", implemented: true },
        { name: "Povrat na platformu nakon plaćanja", implemented: true },
        { name: "Sigurnosno skladištenje Stripe secret key u AWS Secrets Manager", implemented: true },
        { name: "Fakturiranje (PDF fakture za pretplate i kupovine)", implemented: true },
        { name: "Povrat novca za pretplate (refund subscription payment)", implemented: true }
      ]
    },
    {
      category: "Upravljanje Licencama",
      items: [
        { name: "Upload dokumenata licenci", implemented: true },
        { name: "Praćenje isteka licenci", implemented: true },
        { name: "Različiti tipovi licenci po kategorijama", implemented: true },
        { name: "Tijela koja izdaju licence", implemented: true },
        { name: "Broj licence i datum izdavanja", implemented: true },
        { name: "Notifikacije o isteku licenci", implemented: true },
        { name: "Automatska provjera valjanosti licenci", implemented: true },
        { name: "Skener dokumenata za licence", implemented: true }
      ]
    },
    {
      category: "Verifikacija Klijenata i Trust Score",
      items: [
        { name: "Trust score sustav (0-100)", implemented: true },
        { name: "Verificiranje telefona", implemented: true },
        { name: "Verificiranje emaila", implemented: true },
        { name: "Verificiranje OIB-a", implemented: true },
        { name: "Verificiranje firme (sudski registar)", implemented: true },
        { name: "Kvaliteta leadova na osnovu verifikacije", implemented: true },
        { name: "Automatska verifikacija", implemented: true },
        { name: "Dokument upload za verifikaciju", implemented: true },
        { name: "Notifikacije o verifikaciji", implemented: true }
      ]
    },
    {
      category: "ROI Analitika i Statistike",
      items: [
        { name: "ROI dashboard za providere", implemented: true },
        { name: "Konverzija leadova", implemented: true },
        { name: "Ukupan prihod od leadova", implemented: true },
        { name: "Prosječna vrijednost leada", implemented: true },
        { name: "Ukupno potrošenih kredita", implemented: true },
        { name: "Ukupno konvertiranih leadova", implemented: true },
        { name: "Napredne analitike", implemented: true },
        { name: "Mesečni/godišnji izvještaji", implemented: true },
        { name: "Grafički prikaz statistika", implemented: true },
        { name: "Usporedba s drugim providerima", implemented: true },
        { name: "Predviđanje budućih performansi", implemented: true }
      ]
    },
    {
      category: "Povijest Transakcija i Krediti",
      items: [
        { name: "Detaljno praćenje kredita", implemented: true },
        { name: "Različiti tipovi transakcija", implemented: true },
        { name: "Povezivanje s poslovima", implemented: true },
        { name: "Povezivanje s kupnjama leadova", implemented: true },
        { name: "Stanje nakon svake transakcije", implemented: true },
        { name: "Opisi transakcija", implemented: true },
        { name: "Filtriranje transakcija po tipu", implemented: true },
        { name: "Izvoz povijesti transakcija", implemented: true },
        { name: "Notifikacije o transakcijama", implemented: true }
      ]
    },
    {
      category: "Cjenik i Plaćanja",
      items: [
        { name: "Pregled cjenika", implemented: true },
        { name: "Različiti paketi pretplate (BASIC, PREMIUM, PRO)", implemented: true },
        { name: "Kreditni sustav", implemented: true },
        { name: "Povijest transakcija", implemented: true },
        { name: "Refund kredita (vraćanje internih kredita)", implemented: true },
        { name: "Stripe Payment Intent refund API (PSD2)", implemented: true },
        { name: "Automatski odabir refund metode ovisno o načinu plaćanja", implemented: true },
        { name: "Refund ako klijent ne odgovori u roku", implemented: true },
        { name: "Razlozi za refund (klijent ne odgovori, itd.)", implemented: true },
        { name: "Otkazivanje pretplate", implemented: true },
        { name: "Status pretplate (ACTIVE, CANCELLED, EXPIRED)", implemented: true },
        { name: "Automatsko isteka pretplate", implemented: true },
        { name: "Notifikacije o isteku pretplate", implemented: true },
        { name: "Online plaćanje (Stripe Checkout)", implemented: true },
        { name: "Fakturiranje (PDF fakture za pretplate i kupovine)", implemented: true },
        { name: "Povrat novca za pretplate (refund subscription payment)", implemented: true }
      ]
    },
    {
      category: "Korisničko Iskustvo",
      items: [
        { name: "Responsive dizajn (mobilni, tablet, desktop)", implemented: true },
        { name: "Intuitivno korisničko sučelje", implemented: true },
        { name: "Brzo učitavanje stranica", implemented: true },
        { name: "Pretraživanje u realnom vremenu", implemented: true },
        { name: "Filtriranje i sortiranje", implemented: true },
        { name: "Dark mode", implemented: true },
        { name: "Lokalizacija (hrvatski jezik)", implemented: true },
        { name: "Pristupačnost (accessibility)", implemented: true }
      ]
    }
  ];

  const getStatusColor = (implemented, deprecated) => {
    if (deprecated) return 'text-orange-600 bg-orange-100';
    return implemented ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getStatusText = (implemented, deprecated) => {
    if (deprecated) return '⚠️ NE KORISTI SE';
    return implemented ? '✓ Implementirano' : '✗ Nije implementirano';
  };

  const getImplementationStats = () => {
    const totalItems = features.reduce((sum, category) => sum + category.items.length, 0);
    const implementedItems = features.reduce((sum, category) => 
      sum + category.items.filter(item => item.implemented).length, 0
    );
    const percentage = Math.round((implementedItems / totalItems) * 100);
    
    return { totalItems, implementedItems, percentage };
  };

  const stats = getImplementationStats();

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isDarkMode ? 'dark' : ''}`}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          📚 Uslugar - Dokumentacija Funkcionalnosti
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Kompletna lista svih funkcionalnosti platforme za povezivanje korisnika i pružatelja usluga
        </p>
        
        {/* Statistike implementacije */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Status Implementacije</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.implementedItems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Implementirane funkcionalnosti</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.totalItems - stats.implementedItems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Nije implementirano</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.percentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Završeno</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Kategorije funkcionalnosti */}
      <div className="space-y-8">
        {features.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.category}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((item, itemIndex) => {
                  const itemKey = `${categoryIndex}-${itemIndex}`;
                  const isExpanded = expandedItem === itemKey;
                  const description = featureDescriptions[item.name] || {
                    implemented: item.implemented,
                    summary: item.implemented ? `${item.name} je implementirano.` : `${item.name} nije implementirano.`,
                    details: item.implemented 
                      ? `## Implementirano:\n\n${item.name} je funkcionalnost koja je implementirana i dostupna na platformi.` 
                      : `## Nije implementirano:\n\n${item.name} je funkcionalnost koja trenutno nije implementirana.`
                  };

                  return (
                    <div
                      key={itemIndex}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        item.implemented 
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      } ${item.deprecated ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' : ''}`}
                    >
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => setExpandedItem(isExpanded ? null : itemKey)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${item.deprecated ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-300'}`}>
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          </div>
                          {description.summary && !isExpanded && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {description.summary}
                            </p>
                          )}
                        </div>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.implemented, item.deprecated)}`}>
                          {getStatusText(item.implemented, item.deprecated)}
                        </span>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <div className="prose dark:prose-invert max-w-none text-sm">
                            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                              {description.details.split('\n').map((line, idx) => {
                                // Format markdown-style headers
                                if (line.startsWith('## ')) {
                                  return (
                                    <h4 key={idx} className="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-white">
                                      {line.replace('## ', '')}
                                    </h4>
                                  );
                                }
                                if (line.startsWith('### ')) {
                                  return (
                                    <h5 key={idx} className="text-base font-semibold mt-3 mb-2 text-gray-800 dark:text-gray-200">
                                      {line.replace('### ', '')}
                                    </h5>
                                  );
                                }
                                // Format bullet points
                                if (line.trim().startsWith('- ')) {
                                  return (
                                    <div key={idx} className="ml-4 mb-1 text-gray-700 dark:text-gray-300">
                                      • {line.trim().substring(2)}
                                    </div>
                                  );
                                }
                                // Format code blocks (inline)
                                if (line.includes('`')) {
                                  const parts = line.split('`');
                                  return (
                                    <div key={idx} className="mb-2">
                                      {parts.map((part, partIdx) => 
                                        partIdx % 2 === 0 ? (
                                          <span key={partIdx}>{part}</span>
                                        ) : (
                                          <code key={partIdx} className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">
                                            {part}
                                          </code>
                                        )
                                      )}
                                    </div>
                                  );
                                }
                                // Format bold text (**text**)
                                if (line.includes('**')) {
                                  const parts = line.split('**');
                                  return (
                                    <div key={idx} className="mb-2">
                                      {parts.map((part, partIdx) => 
                                        partIdx % 2 === 0 ? (
                                          <span key={partIdx}>{part}</span>
                                        ) : (
                                          <strong key={partIdx} className="font-semibold">{part}</strong>
                                        )
                                      )}
                                    </div>
                                  );
                                }
                                // Regular paragraphs
                                if (line.trim()) {
                                  return (
                                    <p key={idx} className="mb-2 text-gray-700 dark:text-gray-300">
                                      {line}
                                    </p>
                                  );
                                }
                                return <br key={idx} />;
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer informacije */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">O Uslugar Platformi</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Uslugar je sveobuhvatna platforma za povezivanje korisnika koji traže usluge s kvalificiranim pružateljima usluga. 
          Platforma omogućuje jednostavno objavljivanje poslova, slanje ponuda, komunikaciju i ocjenjivanje usluga.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Posljednje ažuriranje: {new Date().toLocaleDateString('hr-HR')}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
