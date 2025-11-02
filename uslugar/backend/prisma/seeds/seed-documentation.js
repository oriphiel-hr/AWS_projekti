// Seed skripta za dokumentaciju funkcionalnosti
// Automatski generirano iz Documentation.jsx

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Features struktura - ekstraktirano iz Documentation.jsx
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
        { name: "51 kategorija usluga", implemented: true },
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

// Feature descriptions - ekstraktirano iz fallbackFeatureDescriptions
const featureDescriptions = {
    "Grafički prikaz statistika": {
      implemented: true,
      summary: "Interaktivni grafički prikazi vaših poslovnih rezultata kroz različite period.",
      details: `## Kako funkcionira:

Na ROI dashboardu možete vidjeti svoje poslovne rezultate u obliku različitih grafova:

**Krugovni graf (Status Breakdown):**
- Prikazuje koliko leadova imate u svakom statusu
- Jednostavno vidite koliko je konvertirano, kontaktirano, aktivno ili refundirano
- Svaki status ima svoju boju za brzo prepoznavanje

**Linijski graf (Mjesečni prihod i ROI):**
- Vidite kako se vaš prihod i ROI mijenjaju kroz mjesece
- Lako prepoznajete trendove - rast li ili pad?
- Dvije linije na istom grafu za usporedbu prihoda i profitabilnosti

**Stupčasti graf (Mjesečni leadovi):**
- Pregled koliko leadova ste kupili, kontaktirali i konvertirali svakog mjeseca
- Usporedba između mjeseci kako biste vidjeli napredak
- Tri različite boje za kupljene, kontaktirane i konvertirane leadove

**Graf konverzije:**
- Trend vaše stope konverzije kroz godinu
- Vidite je li se vaša sposobnost konverzije poboljšala ili pogoršala
- Linijski graf s ispunjenim područjem za jasniji vizualni dojam

**Graf prihoda po kategorijama:**
- Koje kategorije vam donose najviše prihoda
- Top 8 kategorija prikazano u stupčastom grafu
- Lako identifikacija najprofitabilnijih područja rada

**Godišnji seletor:**
- Odaberite godinu za koju želite vidjeti statistike
- Možete pregledavati trenutnu, prošlu ili prethodne godine
- Grafovi se automatski ažuriraju pri odabiru nove godine

**Interaktivnost:**
- Pređite mišem preko bilo kojeg grafa da vidite točne brojke
- Sve grafove možete pregledavati na mobilnom, tabletu ili desktopu
- Grafovi se prilagođavaju dark mode-u ako ga koristite

Ovi grafi vam pomažu da brzo i jednostavno analizirate svoje poslovne rezultate i donosite informirane odluke o tome gdje usmjeriti svoje resurse.
`
    },
    "Hijerarhijska struktura kategorija": {
      implemented: true,
      summary: "Kategorije su organizirane u glavne kategorije i podkategorije za lakšu navigaciju.",
      details: `## Kako funkcionira:

Kategorije usluga su organizirane u logičku hijerarhiju gdje postoje glavne kategorije i podkategorije.

**Glavne kategorije:**
- Osnovne kategorije usluga kao što su "Građevinarstvo", "Elektrotehnika", "Vodoinstalacija"
- Svaka glavna kategorija može imati više podkategorija

**Podkategorije:**
- Detaljnije podjele unutar glavnih kategorija
- Primjerice, pod "Građevinarstvo" možete naći "Keramičarski radovi", "Zidarski radovi", "Fasade"
- Podkategorije su vidljive kao uvučene opcije u izborniku

**Kada koristite:**
- Prilikom objavljivanja posla - odabirete glavnu kategoriju, a zatim možete odabrati i specifičnu podkategoriju ako je dostupna
- Prilikom pretraživanja - možete pretraživati po glavnim kategorijama ili filtrirati samo po specifičnim podkategorijama
- Pri odabiru kategorija za primanje leadova - kao pružatelj možete odabrati u kojim kategorijama želite raditi

**Prednosti:**
- Lakše pronalaženje točno onoga što tražite
- Organiziraniji pregled svih dostupnih usluga
- Mogućnost filtriranja na različitim razinama detaljnosti
- Povećanje preciznosti pri uparivanju korisnika s pružateljima

Hijerarhijska struktura pomaže vam da brže i preciznije pronađete ono što tražite, bilo da tražite uslugu ili nudite svoje usluge.
`
    },
    "Portfolio radova": {
      implemented: true,
      summary: "Prikažite svoje najbolje radove kroz galeriju slika na vašem profilu.",
      details: `## Kako funkcionira:

Kao pružatelj usluga možete izgraditi profesionalni portfolio svojih radova koji će privući više klijenata.

**Dodavanje radova u portfolio:**
- Uploadajte slike svojih završenih projekata
- Svaki rad može imati naslov i opis što je urađeno
- Organizirajte radove po projektima ili kategorijama
- Dodajte više slika za svaki projekt kako biste pokazali različite faze rada

**Prikaz portfolija:**
- Svi vaši najbolji radovi se prikazuju na vašem javnom profilu
- Korisnici mogu pregledavati vaš portfolio prije odabira pružatelja
- Slike se prikazuju u elegantnoj galeriji s mogućnošću uvećanja
- Portfolio je vidljiv svim korisnicima koji pregledavaju vaš profil

**Upravljanje portfoliom:**
- Lako dodajte nove radove kada završite projekt
- Uređujte ili brišite stare radove kako biste održavali portfolio aktualnim
- Organizirajte radove po kategorijama kako biste korisnicima olakšali pronalaženje relevantnih primjera

**Prednosti:**
- Korisnici vide dokaze vašeg rada i kvalitete
- Povećava povjerenje i profesionalnost vašeg profila
- Olakšava odluku korisnicima koji traže pružatelja usluga
- Prikazuje vašu stručnost u određenim područjima

Portfolio je vaša virtualna izložba radova koja predstavlja vašu stručnost i iskustvo na najbolji način.
`
    },
    "Certifikati i licence": {
      implemented: true,
      summary: "Uploadajte i upravljajte svojim profesionalnim certifikatima i licencama koje su potrebne za određene kategorije.",
      details: `## Kako funkcionira:

Kao pružatelj usluga možete priložiti sve svoje profesionalne licence i certifikate koji dokazuju vašu kvalifikaciju.

**Upload dokumenata:**
- Učitajte dokumente svojih licenci i certifikata (PDF format)
- Navedite tip licence (npr. Elektrotehnička, Građevinska, Vodoinstalaterska)
- Unesite broj licence i datum izdavanja
- Odredite tijelo koje je izdalo licencu (npr. Hrvatski zavod za norme)
- Naznačite datum isteka licence

**Verifikacija:**
- Nakon upload-a, dokumenti se šalju administratorima na verifikaciju
- Admin provjerava valjanost dokumenata i odobrava ih
- Tek nakon verifikacije, licence se prikazuju na vašem javnom profilu
- Korisnici vide da imate potrebne dozvole za određene djelatnosti

**Praćenje isteka:**
- Sustav automatski prati datume isteka vaših licenci
- Primite notifikacije kada se licence približavaju isteku:
  - 30 dana prije isteka
  - 14 dana prije isteka
  - 7 dana prije isteka
  - 1 dan prije isteka
  - Na dan isteka
- To vam omogućava da na vrijeme obnovite licence i održite aktualan profil

**Povezivanje s kategorijama:**
- Neke kategorije usluga zahtijevaju specifične licence
- Kada odaberete kategorije za koje radite, platforma može provjeriti imate li potrebne licence
- Ako nemate potrebnu licencu, možete je lako dodati kroz sustav

**Prikaz na profilu:**
- Svi vaši verificirani certifikati i licence se prikazuju na vašem profilu
- Korisnici mogu vidjeti da ste kvalificirani za određene vrste radova
- To povećava vašu kredibilitet i vjerojatnost da će vas korisnici odabrati

**Prednosti:**
- Dokazujete svoju kvalifikaciju i profesionalnost
- Korisnici imaju veće povjerenje u vaše usluge
- Lako pratite istek licenci i držite ih aktualnima
- Automatske podsjetnike vam pomažu da ne propustite obnavljanje

Certifikati i licence su vaš dokaz stručnosti koji razlikuje vas od drugih pružatelja usluga.
`
    },
    "Dark mode": {
      implemented: true,
      summary: "Prebacite se između svijetlog i tamnog načina rada prema vašoj preferenciji.",
      details: `## Kako funkcionira:

Platforma podržava tamni način rada (dark mode) koji je lakši za oči, posebno pri radu navečer ili u slabije osvijetljenim prostorima.

**Prebacivanje načina rada:**
- Gumb za prebacivanje se nalazi u navigaciji
- Jedan klik prebacuje između svijetlog i tamnog načina
- Vaša preferencija se pamti automatski - sljedeći put kada otvorite platformu, zadržat će se vaš odabrani način rada

**Automatska detekcija:**
- Platforma može automatski detektirati preferenciju vašeg uređaja
- Ako vaš računalo ili telefon ima podešen dark mode, platforma se može automatski prilagoditi
- Možete također ručno prebaciti način rada bez obzira na postavke uređaja

**Prilagođavanje:**
- Svi elementi platforme su prilagođeni za oba načina rada
- Grafovi, kartice, forme i sve ostale komponente imaju odgovarajuće boje za dark mode
- Kontrast i čitljivost su osigurani u oba načina rada
- Glatak prijelaz između načina rada bez blještavila

**Kada koristiti:**
- Dark mode je idealan za rad navečer ili u mraku
- Mnogima je lakši za oči i smanjuje umor očiju
- Neki korisnici jednostavno preferiraju tamniji izgled
- Možete koristiti onaj način koji vam više odgovara

**Prednosti:**
- Očuvanje vida pri duljem radu
- Niža potrošnja baterije na OLED ekranima
- Moderniji i profesionalniji izgled za neke korisnike
- Mogućnost prilagođavanja platforme svojim preferencijama

Dark mode daje vam kontrolu nad izgledom platforme kako biste je koristili na najudobniji način za vas.
`
    },
    "Pristupačnost (accessibility)": {
      implemented: true,
      summary: "Platforma je prilagođena za sve korisnike, uključujući one s posebnim potrebama.",
      details: `## Kako funkcionira:

Platforma je dizajnirana tako da bude dostupna i lako upotrebljiva za sve korisnike, bez obzira na njihove sposobnosti ili način pristupa.

**Navigacija tipkovnicom:**
- Možete koristiti tipkovnicu za navigaciju kroz cijelu platformu
- Tipka Tab vam omogućava kretanje kroz sve gumbove, linkove i forme
- Enter ili Space za aktivaciju gumbova
- Escape za zatvaranje prozora i menija
- Nema potrebe za mišem - sve je dostupno preko tipkovnice

**Povećanje teksta:**
- Tekst na platformi se može povećati korištenjem funkcija preglednika
- Zadržava se čitljivost i funkcionalnost bez obzira na veličinu teksta
- Kontrast između teksta i pozadine je dovoljno visok za lako čitanje

**Opisi slika:**
- Sve slike na platformi imaju tekstualne opise
- Ako koristite čitač ekrana ili imate problema s vidom, čujete opis slike
- To vam omogućava da razumijete sadržaj bez vizualnog pregleda

**Čitač ekrana:**
- Platforma je potpuno kompatibilna sa čitačima ekrana
- Svi elementi imaju jasne nazive i opise
- Navigacija kroz platformu je logična i predvidljiva
- Informacije se čitaju na način koji ima smisla

**Kontrast boja:**
- Svi tekstovi imaju dovoljno visok kontrast za lako čitanje
- Boje su odabrane tako da su vidljive i osobama s različitim vrstama sljepoće na boje
- Važne informacije se ne oslanjaju samo na boju - uvijek postoje i druge indikatore

**Preskakanje ponavljanog sadržaja:**
- Na svakoj stranici možete preskočiti navigaciju i otići direktno na glavni sadržaj
- To štedi vrijeme i olakšava navigaciju korisnicima s tipkovnicom

**Prednosti:**
- Platforma je dostupna svima, bez obzira na fizičke ili kognitivne sposobnosti
- Veća korisnost za sve - ono što je dobro za pristupačnost je dobro za sve
- Poštovanje raznolikosti korisnika i njihovih potreba
- Platforma se može koristiti na različite načine ovisno o vašim preferencijama

Pristupačnost znači da platforma radi za sve - bez obzira kako pristupate sadržaju ili koji su vam potrebni alati za navigaciju.
`
    },
    "Ekskluzivni lead sustav": {
      implemented: true,
      summary: "Kupite ekskluzivni pristup leadu - samo vi kontaktirate klijenta, bez konkurencije.",
      details: `## Kako funkcionira:

Ekskluzivni lead sustav znači da kada kupite lead, vi ste jedini pružatelj koji ima pristup tom klijentu. To je velika razlika u odnosu na druge platforme gdje se isti lead dijeli između 5-10 pružatelja.

**Proces kupovine leada:**
- Pregledate dostupne ekskluzivne leadove na tržištu
- Svaki lead ima oznaku kvalitete (VRHUNSKI, DOBAR, PROSJEČAN) koja pokazuje koliko je lead vrijedan
- Odaberete lead koji vas zanima i kliknete "Kupi lead"
- Plaćanje se vrši kreditima koje imate na računu (ili direktno kroz Stripe)
- Nakon kupovine, kontakt informacije klijenta postaju dostupne samo vama

**Ekskluzivnost:**
- Nakon što kupite lead, on se automatski skida s tržišta
- Niti jedan drugi pružatelj ne može više kupiti isti lead
- Imate ekskluzivni pristup telefonu i email adresi klijenta
- Nema konkurencije - samo vi kontaktirate klijenta

**Upravljanje kupljenim leadovima:**
- Svi vaši kupljeni leadovi se prikazuju u "Moji leadovi"
- Vidite status svakog leada: Aktivno, Kontaktirano, Konvertirano, Refundirano
- Kada kontaktirate klijenta, označite lead kao "Kontaktiran"
- Kada dobijete posao, označite lead kao "Konvertiran"

**Statusi leadova:**
- **Aktivno** - Kupili ste lead, ali ga još niste kontaktirali
- **Kontaktirano** - Već ste se javili klijentu
- **Konvertirano** - Uslijedila je uspješna prodaja/usluga
- **Refundirano** - Lead je vraćen (npr. klijent nije odgovorio ili ste zatražili refund)
- **Isteklo** - Lead je istekao zbog neaktivnosti

**Razlike od drugih platformi:**
- Na Trebam.hr ili Emajstor.hr, 1 lead se dijeli između 5-10 pružatelja
- Na Uslugar EXCLUSIVE, 1 lead = samo vi (bez konkurencije)
- Statistički, ekskluzivni leadovi imaju 40% stopu konverzije vs 10% na dijeljenim leadovima
- Veća šansa za uspjeh jer nema konkurencije

**Zašto je bolje:**
- Nema natjecanja s drugim pružateljima za istog klijenta
- Više vremena za kvalitetan pristup klijentu bez pritiska
- Veća stopa konverzije - klijenti lakše odlučuju kada imate ekskluzivni pristup
- Profesionalniji dojam - klijent vidi da ste ozbiljni ako ste platili za ekskluzivni pristup

Ekskluzivni lead sustav vam daje pravu prednost - vi ste jedini koji kontaktira klijenta, što značajno povećava vaše šanse za uspjeh.
`
    },
    "ROI dashboard": {
      implemented: true,
      summary: "Vidite detaljne statistike vašeg poslovanja - koliko zaradujete, koliko trošite i koliki je vaš ROI.",
      details: `## Kako funkcionira:

ROI (Return on Investment) dashboard je vaš centar za praćenje poslovnih rezultata. Vidite sve važne metrike na jednom mjestu.

**Glavne metrike:**
- **Stopa konverzije** - Koliki postotak vaših kupljenih leadova se konvertira u stvarne poslove (npr. ako kupite 10 leadova i 4 konvertirate, imate 40% stopu konverzije)
- **ROI (Return on Investment)** - Koliki profit ostvarujete na svaku kunu uloženu u leadove (npr. ako uložite 1000 kn i zaradite 3000 kn, vaš ROI je 200%)
- **Prosječna vrijednost leada** - Koliko u prosjeku zaradite po konvertiranom leadu
- **Ukupan prihod** - Ukupna svota novca koju ste zaradili od leadova
- **Potrošeno kredita** - Ukupna svota kredita koju ste potrošili na kupovinu leadova

**Mjesečna statistika:**
- Vidite kako se vaše metrike mijenjaju kroz mjesece
- Pratite trendove - poboljšavate li se ili je potrebna promjena pristupa
- Usporedba između mjeseci vam pomaže razumjeti što radi, a što ne

**Top leadovi:**
- Pregled najprofitabilnijih leadova koje ste konvertirali
- Vidite koji tipovi leadova vam najviše odgovaraju
- Analiza uspješnih konverzija vam pomaže fokusirati se na slične leadove

**AI Insights:**
- Platforma analizira vaše rezultate i daje vam personalizirane preporuke
- Primjerice: "Vaša stopa konverzije je iznad prosjeka u kategoriji Elektrotehnika"
- Ili: "Najbolje vam idu leadovi s budžetom između 5000-10000 kn"

**Pretplata:**
- Vidite koje plan pretplate imate aktivan
- Koliko kredita vam je preostalo
- Kada istječe vaša pretplata

**Prednosti:**
- Brzo vidite jesmo li profitabilni
- Razumijete koje kategorije ili tipovi leadova vam odgovaraju
- Donosite informirane odluke o tome gdje uložiti novac
- Pratite napredak i vidite rast vašeg poslovanja

ROI dashboard vam daje potpunu sliku vašeg poslovanja kako biste mogli optimizirati strategiju i povećati profit.
`
    },
    "Kreditni sustav": {
      implemented: true,
      summary: "Koristite kredite kao valutu za kupovinu leadova - fleksibilno i jednostavno.",
      details: `## Kako funkcionira:

Kreditni sustav omogućava vam da kupujete leadove koristeći kredite umjesto direktnog plaćanja za svaki lead. To je kao virtualni novac za platformu.

**Što su krediti:**
- Krediti su virtualna valuta platforme
- 1 kredit = određena vrijednost (ovisno o vašem pretplati)
- Koristite kredite za kupovinu ekskluzivnih leadova
- Krediti se troše automatski kada kupite lead

**Kako dobijete kredite:**
- Pretplatom na plan (BASIC, PREMIUM, PRO) - svaki plan daje određeni broj kredita mjesečno
- Pri registraciji kao pružatelj - dobivate besplatni TRIAL period s 5 kredita za testiranje
- Kupnjom dodatnih kredita ako vam zatreba više
- Refundom - ako vam se lead vrati, krediti se automatski vraćaju na vaš račun

**Praćenje kredita:**
- Vidite trenutni balans kredita u gornjem desnom kutu ekrana
- Balans se ažurira u stvarnom vremenu - kada kupite lead, krediti se oduzimaju odmah
- Ako vam kredita padne ispod određenog iznosa, dobivate upozorenje
- Uvijek znate koliko kredita imate dostupno

**Povijest transakcija:**
- Sve vaše transakcije s kreditima su zabilježene
- Vidite kada ste dobili kredite (pretplata, refund, bonus)
- Vidite kada ste potrošili kredite (kupovina leadova)
- Svaka transakcija ima opis što se dogodilo

**Tipovi transakcija:**
- **Kupovina leada** - potrošili ste kredite na kupovinu leada
- **Refund** - vratio se kredit jer ste zatražili refund ili je došlo do automatskog refunda
- **Pretplata** - dobili ste kredite kroz vašu mjesečnu pretplatu
- **Bonus** - dobili ste dodatne kredite (npr. kao poklon)
- **Ručna prilagodba** - administrator vam je ručno dodao ili oduzeo kredite (rijetko)

**Prednosti:**
- Ne morate plaćati za svaki lead zasebno - krediti su prethodno plaćeni
- Lako planirate budžet - vidite koliko kredita imate i možete ih potrošiti
- Automatska naplata - nema potrebe za ponovnim unosom podataka o plaćanju
- Refund je jednostavan - krediti se vraćaju automatski na vaš račun

Kreditni sustav čini kupovinu leadova jednostavnom i brzom - jednom kada imate kredite, kupovina leada je samo jedan klik.
`
    },
    "AI score kvalitete leadova": {
      implemented: true,
      summary: "Svaki lead dobiva AI ocjenu kvalitete od 0-100 koja pokazuje koliko je lead vrijedan.",
      details: `## Kako funkcionira:

Sustav automatski analizira svaki lead i daje mu ocjenu kvalitete od 0 do 100. Viša ocjena znači bolji lead s većom šansom za konverziju.

**Što AI analizira:**
- **Verifikacija klijenta** - Je li klijent verifikiran (email, telefon, OIB, tvrtka)? Verificirani klijenti dobivaju najviše bodova jer su ozbiljniji
- **Budžet** - Je li budžet definiran? Klijenti koji znaju koliko žele potrošiti su ozbiljniji
- **Kvaliteta opisa** - Je li opis detaljan? Detaljniji opisi znače da klijent zna što želi
- **Slike** - Ima li posao priložene slike? Slike pomažu razumjeti što je potrebno
- **Hitnost** - Je li posao hitan? Hitni poslovi su često brže konvertiraju
- **Rok** - Je li definiran rok? Rok pokazuje ozbiljnost klijenta
- **Lokacija** - Je li lokacija navedena? Lokacija omogućava precizno uparivanje
- **Veličina posla** - Veliki poslovi su obično profitabilniji
- **Starost računa** - Stariji korisnici su obično pouzdaniji

**Kategorije kvalitete:**
- **🟢 VRHUNSKI (80-100 bodova)** - Najkvalitetniji leadovi, cijena: 20 kredita
  - Verificirani klijenti s detaljnim opisom i budžetom
  - Najveća šansa za konverziju (obično 50%+)
  - Idealno za pružatelje koji žele maksimizirati ROI

- **🔵 DOBAR (60-79 bodova)** - Kvalitetni leadovi, cijena: 15 kredita
  - Dobro opisan posao s većinom podataka
  - Dobre šanse za konverziju (obično 30-40%)
  - Dobar omjer cijene i kvalitete

- **🟡 PROSJEČAN (40-59 bodova)** - Standardni leadovi, cijena: 10 kredita
  - Osnovni podaci dostupni, neki detalji mogu nedostajati
  - Prosječna šansa za konverziju (obično 15-25%)
  - Jeftiniji, ali i rizičniji

- **⚪ SLAB (0-39 bodova)** - Niža kvaliteta, cijena: 5 kredita
  - Nedostaju važni podaci, klijent možda nije verificiran
  - Niža šansa za konverziju (obično <15%)
  - Jeftini, ali mogu biti manje profitabilni

**Kako koristiti AI score:**
- Pregledajte ocjenu prije kupovine leada
- Visoki score leadovi su obično sigurniji, ali i skuplji
- Niski score leadovi su jeftiniji, ali rizičniji
- Odaberite strategiju koja vam odgovara - konzervativno (samo visoki score) ili agresivno (različiti score-ovi)

**Filtering po kvaliteti:**
- Ako imate PRO plan, možete filtrirati i vidjeti samo leadove s ocjenom 80+
- To vam omogućava fokus samo na najkvalitetnije leadove
- PREMIUM plan vam omogućava sortiranje po kvaliteti

**Prednosti:**
- Znate unaprijed koliko je lead vrijedan prije kupovine
- Možete planirati strategiju kupovine ovisno o kvaliteti leadova
- Smanjujete rizik kupujući kvalitetnije leadove
- Povećavate ROI fokusiranjem na leadove s višim score-om

AI score vam pomaže donositi informirane odluke o tome koji leadovi su vrijedni vaših kredita.
`
    },
    "SMS verifikacija telefonskog broja (Twilio)": {
      implemented: true,
      summary: "Potvrdite svoj telefon putem SMS poruke s verifikacijskim kodom.",
      details: `## Kako funkcionira:

SMS verifikacija omogućava vam da dokazate da telefon koji ste naveli u profilu stvarno pripada vama.

**Proces verifikacije:**
- Unesite svoj telefonski broj u formatu +385XXXXXXXXX (npr. +385981234567)
- Kliknite "Pošalji SMS kod" - primit ćete SMS poruku s 6-znamenkastim verifikacijskim kodom
- Unesite kod koji ste primili u polje za verifikaciju
- Kliknite "Potvrdi" - vaš telefon je sada verificiran

**Sigurnost:**
- Kod vrijedi 10 minuta - ako ne unesete kod u tom vremenu, morate zatražiti novi
- Možete pokušati unijeti kod najviše 5 puta - nakon toga morate zatražiti novi SMS
- Svaki kod je jedinstven i može se koristiti samo jednom
- Ako ne primite SMS, možete zatražiti novi kod nakon 60 sekundi

**Zašto je važno:**
- Verificirani telefon dokazuje da ste stvarni pružatelj usluga
- Povećava povjerenje korisnika u vaš profil
- Omogućava vam dobivanje Identity Badge za telefon koji se prikazuje na vašem profilu
- Pomaže u verifikaciji klijenata - verificirani pružatelji imaju bolji trust score

**Kada koristite:**
- Pri registraciji kao pružatelj - preporučuje se verifikacija telefona
- Pri ažuriranju profila - možete verificirati telefon u bilo kojem trenutku
- Kao dio procesa dobivanja Identity Badge-a za telefon

SMS verifikacija je jednostavan i brz način da dokažete svoj identitet i povećate kredibilitet svog profila.
`
    },
    "Prosječno vrijeme odgovora (avgResponseTimeMinutes)": {
      implemented: true,
      summary: "Platforma prati koliko brzo odgovarate na leadove - brži odgovori znače bolju reputaciju.",
      details: `## Kako funkcionira:

Prosječno vrijeme odgovora mjeri koliko vremena vam treba da kontaktirate klijenta nakon što kupite lead. Brži odgovori znače bolju reputaciju i veću šansu da budete upareni s novim leadovima.

**Kako se mjeri:**
- Kada kupite lead, počinje mjerenje vremena
- Kada označite lead kao "Kontaktiran", sustav izračunava koliko vremena je prošlo
- Prosjek se ažurira automatski na temelju svih vaših odgovora
- Prikazuje se u formatu minuta, sati ili dana (npr. "45 minuta" ili "2 sata")

**Zašto je važno:**
- Klijenti vole brze odgovore - ako odgovorite u roku od sat vremena, imate veliku prednost
- Brži odgovori pokazuju profesionalnost i ozbiljnost
- Sustav uparivanja leadova favorizira providere s brzim odgovorima
- Dobivate badge "✓ Brz odgovor" ako je vaš prosjek manji od 60 minuta

**Kako poboljšati:**
- Odgovarajte na leadove što brže možete - idealno unutar sat vremena
- Pratite "Moji leadovi" sekciju kako biste vidjeli aktivne leadove
- Postavite notifikacije kako biste brzo saznali kada kupite novi lead

**Kako se koristi:**
- Vaš prosječni odgovor je vidljiv na vašem profilu
- Koristi se za izračun reputacije zajedno s ocjenom i stopom konverzije
- Pružatelji s bržim odgovorima imaju veću šansu biti odabrani za nove leadove
- Korisnici mogu vidjeti koliko brzo obično odgovarate prije odabira pružatelja

Brži odgovori znače bolju reputaciju i više poslova - odgovarajte što brže možete!
`
    },
    "Online plaćanje (Stripe Checkout)": {
      implemented: true,
      summary: "Sigurno i jednostavno plaćanje pretplata i leadova preko kreditne kartice.",
      details: `## Kako funkcionira:

Platforma koristi Stripe, sigurni servis za online plaćanja, za obradu svih vaših plaćanja.

**Plaćanje pretplata:**
- Odaberete plan pretplate koji vam odgovara (BASIC, PREMIUM ili PRO)
- Kliknete "Pretplati se" - otvara se sigurna Stripe stranica za plaćanje
- Unesete podatke svoje kreditne ili debitne kartice
- Nakon uspješnog plaćanja, vaša pretplata se automatski aktivira
- Vraćate se na platformu gdje vidite ažuriran status pretplate

**Plaćanje leadova (opcionalno):**
- Umjesto korištenja kredita, možete direktno platiti za lead kreditnom karticom
- Korisno ako vam je ponestalo kredita, a želite kupiti važan lead
- Plaćanje se obavlja istim sigurnim procesom kao pretplata

**Sigurnost:**
- Sva plaćanja se obrađuju preko Stripe-a - mi nikada ne vidimo podatke vaše kartice
- Komunikacija je šifrirana (HTTPS)
- Stripe je certifikirani PCI DSS Level 1 procesor - najviši standard sigurnosti
- Podržani su svi glavni proizvođači kartica (Visa, Mastercard, American Express)

**Nakon plaćanja:**
- Vaša pretplata se aktivira automatski
- Primite potvrdni email s detaljima pretplate
- Krediti se dodaju na vaš račun ako su uključeni u plan
- Vidite fakturu za svako plaćanje

**Rješavanje problema:**
- Ako plaćanje ne prođe, provjerite podatke kartice
- U slučaju problema, kontaktirajte podršku
- Ako slučajno platite dva puta, automatski će vam se vratiti novac

Online plaćanje je sigurno, brzo i jednostavno - samo nekoliko klikova i vaša pretplata je aktiva!
`
    },
    "Automatski refund nakon 48h neaktivnosti": {
      implemented: true,
      summary: "Ako ne kontaktirate klijenta unutar 48 sati nakon kupovine leada, krediti vam se automatski vraćaju.",
      details: `## Kako funkcionira:

Sustav automatski vrati vaše kredite ako ne kontaktirate klijenta unutar 48 sati nakon što ste kupili lead.

**Proces:**
- Kupite lead i otključite kontakt informacije
- Imate 48 sati da kontaktirate klijenta
- Ako ne kontaktirate klijenta u tom roku, sustav automatski:
  - Vraća vam kredite na vaš račun
  - Vraća lead na tržište kako bi ga drugi pružatelji mogli kupiti
  - Šalje vam obavijest o refundu

**Zašto postoji:**
- Osigurava da klijenti dobiju brz odgovor od pružatelja
- Sprječava gubitak kredita ako zaboravite kontaktirati klijenta
- Daje lead ponovnu priliku - ako vi ne kontaktirate, netko drugi može
- Čuva kvalitetu usluge - samo aktivni pružatelji zadržavaju leadove

**Kako izbjeći automatski refund:**
- Kontaktirajte klijenta što prije nakon kupovine leada
- Označite lead kao "Kontaktiran" kada se javite klijentu
- Provjeravajte "Moji leadovi" sekciju redovito kako biste vidjeli aktualne leadove

**Što se događa nakon refunda:**
- Krediti se vraćaju na vaš račun automatski
- Lead se vraća na tržište i postaje dostupan drugim pružateljima
- Primite email i in-app notifikaciju s razlogom refunda
- U povijesti transakcija vidite refund s opisom "Automatski refund - neaktivnost 48h"

**Prednosti:**
- Ne gubite kredite ako zaboravite kontaktirati - vraćaju se automatski
- Klijenti dobivaju brz odgovor - samo aktivni pružatelji zadržavaju leadove
- Leadovi se ne "gube" - vraćaju se na tržište za druge pružatelje

Automatski refund osigurava fer sustav gdje aktivni pružatelji imaju prednost, a vi ne gubite kredite ako slučajno zaboravite kontaktirati klijenta.
`
    },
    "Registracija korisnika usluge": {
      implemented: true,
      summary: "Stvorite račun kao korisnik usluge da biste mogli objavljivati poslove i tražiti pružatelje usluga.",
      details: `## Kako funkcionira:

Registracija kao korisnik usluge omogućava vam da koristite platformu za objavljivanje poslova i pronalaženje pružatelja usluga.

**Proces registracije:**
- Unesite svoje ime i prezime
- Unesite email adresu i lozinku
- Odaberite tip korisnika: "Korisnik usluge"
- Ako ste pravna osoba (firma), odaberite opciju i unesite OIB i naziv tvrtke
- Kliknite "Registriraj se"
- Primite email s linkom za verifikaciju - kliknite na link da potvrdite svoj račun

**Nakon registracije:**
- Vaš račun je kreiran i možete se prijaviti
- Možete objavljivati poslove koje tražite
- Možete pregledavati ponude koje vam pružatelji šalju
- Možete prihvaćati ili odbijati ponude
- Možete komunicirati s pružateljima preko chata
- Možete ocjenjivati pružatelje nakon završenog posla

**Ista email adresa:**
- Možete koristiti istu email adresu i za korisnički i za pružateljski račun
- To omogućava da istovremeno tražite usluge i nudite svoje usluge
- Jednostavno se prebacujete između korisničkog i pružateljskog profila

**Prednosti:**
- Besplatna registracija - nema troškova za objavljivanje poslova
- Jednostavno pronalaženje pružatelja usluga
- Mogućnost pregovaranja o cijenama
- Sigurna komunikacija s pružateljima
- Mogućnost ocjenjivanja i recenziranja pružatelja

Registracija kao korisnik usluge je besplatna i jednostavna - za nekoliko minuta možete početi tražiti pružatelje za svoje potrebe!
`
    },
    "Registracija pružatelja usluga": {
      implemented: true,
      summary: "Registrirajte se kao pružatelj usluga i počnite primati ekskluzivne leadove.",
      details: `## Kako funkcionira:

Registracija kao pružatelj usluga omogućava vam pristup ekskluzivnim leadovima i svim alatima za upravljanje poslovanjem.

**Proces registracije:**
- Unesite svoje osobne podatke (ime, prezime, email, telefon)
- Odaberite pravni status: Fizička osoba, Obrt, d.o.o., j.d.o.o., itd.
- Unesite OIB (obavezno za sve pravne statuse)
- Ako imate firmu, unesite naziv tvrtke/obrta
- Kreirajte lozinku
- Kliknite "Registriraj se kao pružatelj"
- Potvrdite email adresu klikom na link u email poruci

**Obavezni podaci:**
- Pravni status - morate odabrati kako vam je posao registriran
- OIB - 11-znamenkasti identifikacijski broj (obavezan)
- Naziv tvrtke - ako ste registrirani kao tvrtka/obrt (osim ako ste fizička osoba)

**Što dobivate pri registraciji:**
- Besplatni TRIAL period od 7 dana
- 5 besplatnih kredita za testiranje platforme (dovoljno za 2-3 leada)
- Pristup EXCLUSIVE leadovima
- ROI dashboard za praćenje rezultata
- Mogućnost upravljanja profilom, licencama i portfolio-om

**Nakon registracije:**
- Možete pregledavati dostupne ekskluzivne leadove
- Možete kupovati leadove i kontaktirati klijente
- Možete pratiti svoje poslovne rezultate na ROI dashboardu
- Možete nadograditi pretplatu na PREMIUM ili PRO plan za više kredita i funkcionalnosti

**Ista email adresa:**
- Možete koristiti istu email adresu i za korisnički i za pružateljski račun
- To omogućava da istovremeno tražite usluge i nudite svoje usluge

Registracija kao pružatelj usluga je jednostavna - za nekoliko minuta možete početi primati ekskluzivne leadove i rasti svoj posao!
`
    },
    "Email verifikacija": {
      implemented: true,
      summary: "Potvrdite svoju email adresu klikom na link koji primite u email poruci.",
      details: `## Kako funkcionira:

Email verifikacija osigurava da email adresa koju ste naveli pri registraciji stvarno pripada vama.

**Proces verifikacije:**
- Nakon registracije, primit ćete email na adresu koju ste naveli
- Email sadrži link za verifikaciju - kliknite na taj link
- Otvara se stranica koja potvrđuje da je vaš email verificiran
- Automatski se preusmjeravate na stranicu za prijavu

**Ako ne primite email:**
- Provjerite spam/junk folder - ponekad verifikacijski email završi tamo
- Provjerite jeste li unijeli točnu email adresu
- Možete zatražiti ponovno slanje verifikacijskog emaila

**Važno:**
- Verifikacijski link vrijedi 24 sata - ako ga ne kliknete u tom roku, morate zatražiti novi
- Link možete koristiti samo jednom - nakon verifikacije, više nije aktivan
- Ako zatražite novi link, stari link više ne vrijedi

**Zašto je važno:**
- Osigurava da možete primati obavijesti i važne informacije
- Omogućava resetiranje lozinke ako je zaboravite
- Potrebno za potpunu funkcionalnost platforme
- Pomaže u sigurnosti vašeg računa

Email verifikacija je brz i jednostavan proces - samo kliknite na link u email poruci i vaš račun je spreman!
`,
      technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/VerifyEmail.jsx\`
- **Route:** \`/verify-email/:token\`
- **State management:** useState, useEffect hooks

### Backend:
- **Route:** \`uslugar/backend/src/routes/auth.js\`
- **Endpoint:** \`GET /api/auth/verify-email/:token\`
- **Prisma:** Update User zapisa (\`isVerified = true\`, \`verificationToken = null\`)
- **Validacija:** Provjera \`tokenExpiresAt\` (24h expiry)

### Baza podataka:
- **Tablice:** \`User\`
- **Polja:** \`verificationToken\`, \`tokenExpiresAt\`, \`isVerified\`
- **Indeksi:** \`@@unique([verificationToken])\`

### API pozivi:
- \`GET /api/auth/verify-email/:token\` - Verificira email
- Query \`User\` gdje \`verificationToken = token\` i \`tokenExpiresAt > now()\`
- Update: \`isVerified = true\`, \`verificationToken = null\`, \`tokenExpiresAt = null\`
      `
    },
    "Objavljivanje novih poslova": {
      implemented: true,
      summary: "Objavite posao koji tražite i primite ponude od pružatelja usluga.",
      details: `## Kako funkcionira:

Kao korisnik usluge, možete objaviti posao koji tražite, a pružatelji će vam moći poslati ponude.

**Proces objavljivanja:**
- Kliknite "Objavi posao" ili "Novi posao"
- Unesite naslov posla (npr. "Potrebno postavljanje keramike u kupaonici")
- Napišite detaljan opis što treba napraviti
- Odaberite kategoriju usluge (npr. "Keramičarski radovi")
- Odaberite lokaciju (grad) gdje se posao obavlja
- Postavite budžet - minimalnu i maksimalnu cijenu koju ste spremni platiti
- Uploadajte slike ako imate primjere ili situaciju koju treba riješiti (opcionalno)
- Odaberite hitnost (Normalna ili Hitna)
- Odaberite veličinu posla (Mala, Srednja, Velika)
- Postavite željeni rok izvršenja (opcionalno)
- Kliknite "Objavi posao"

**Što se događa nakon objave:**
- Posao se prikazuje na platformi i pružatelji ga mogu vidjeti
- Pružatelji koji rade u vašoj kategoriji i lokaciji dobivaju obavijest
- Pružatelji vam mogu poslati ponude s cijenom i porukom
- Vi možete pregledati sve ponude i odabrati najbolju

**Savjeti za bolji odgovor:**
- Što detaljniji opis, to bolje - pružatelji će točno znati što tražite
- Dodajte slike - slike pomažu pružateljima razumjeti situaciju
- Postavite realan budžet - preniske cijene mogu odbiti kvalitetne pružatelje
- Odredite hitnost ako je posao hitan - pružatelji koji rade brzo će odgovoriti

**Upravljanje poslom:**
- Možete ažurirati opis ili detalje posla
- Možete označiti posao kao "Završen" kada je gotov
- Možete otkazati posao ako više nije potreban
- Vidite sve ponude i možete prihvatiti ili odbiti svaku

Objavljivanje poslova je besplatno i jednostavno - za nekoliko minuta možete započeti traženje pružatelja za svoj posao!
`
    },
    "Slanje ponuda za poslove": {
      implemented: true,
      summary: "Kao pružatelj, pošaljite ponudu korisniku s cijenom i porukom u kojoj objašnjavate svoj pristup.",
      details: `## Kako funkcionira:

Kada vidite posao koji vas zanima, možete korisniku poslati ponudu s cijenom i porukom.

**Kako poslati ponudu:**
- Pronađite posao koji vas zanima na platformi
- Kliknite "Pošalji ponudu" ili "Nudi uslugu"
- Unesite iznos ponude (u kunama)
- Napišite poruku u kojoj objašnjavate:
  - Vaš pristup poslu
  - Što sve uključuje cijena
  - Zašto ste pravi izbor
  - Vaša iskustva s sličnim poslovima
- Odaberite procijenjeni broj dana za izvršenje posla
- Označite "Pregovorno" ako je cijena fleksibilna
- Kliknite "Pošalji ponudu"

**Nakon slanja ponude:**
- Korisnik dobiva obavijest o vašoj ponudi
- Korisnik može pregledati sve ponude za posao
- Korisnik može prihvatiti vašu ponudu, odbiti je ili pregovarati o cijeni
- Status ponude možete pratiti u "Moje ponude" sekciji

**Savjeti za uspješnu ponudu:**
- Napišite detaljnu poruku - pokažite profesionalnost i znanje
- Postavite konkurentnu cijenu - previsoke cijene mogu odbiti korisnike
- Budite iskreni o vremenu izvršenja - ne obećavajte nešto što ne možete ispuniti
- Označite ponudu kao "Pregovorno" ako ste spremni na kompromis

**Statusi ponuda:**
- **Na čekanju** - Korisnik još nije odgovorio na vašu ponudu
- **Prihvaćena** - Korisnik je prihvatio vašu ponudu - možete započeti rad
- **Odbijena** - Korisnik je odbio vašu ponudu (može biti iz različitih razloga)

Slanje ponuda je besplatno i jednostavno - pošaljite konkurentnu ponudu i povećajte svoje šanse za dobivanje posla!
`
    },
    "Ocjenjivanje pružatelja usluga (1-5 zvjezdica)": {
      implemented: true,
      summary: "Ocijenite pružatelja nakon završenog posla i pomozite drugim korisnicima odabrati kvalitetnog pružatelja.",
      details: `## Kako funkcionira:

Nakon što pružatelj završi posao, možete ga ocijeniti od 1 do 5 zvjezdica i napisati recenziju o vašem iskustvu.

**Kako ocijeniti pružatelja:**
- Nakon završenog posla, otvara se opcija za ocjenjivanje
- Odaberite broj zvjezdica (1-5):
  - ⭐⭐⭐⭐⭐ (5) - Izvrsno - premašio očekivanja
  - ⭐⭐⭐⭐ (4) - Vrlo dobro - zadovoljio očekivanja
  - ⭐⭐⭐ (3) - Dobro - osnovne očekivanja ispunjena
  - ⭐⭐ (2) - Slabo - nije zadovoljio očekivanja
  - ⭐ (1) - Vrlo slabo - nezadovoljavajuće
- Napišite komentar o vašem iskustvu:
  - Što vam se svidjelo
  - Što bi se moglo poboljšati
  - Vaša preporuka drugim korisnicima
- Kliknite "Pošalji recenziju"

**Bilateralno ocjenjivanje:**
- I vi možete ocijeniti pružatelja, i pružatelj može ocijeniti vas
- To osigurava fer i objektivno ocjenjivanje
- Oba korisnika vide ocjene koje su dobili

**Uređivanje i brisanje:**
- Možete uređivati svoju recenziju ako se vaša mišljenja promijene
- Možete obrisati svoju recenziju ako smatrate da više nije relevantna
- Možete ocjeniti samo jednom po poslu - sprečava se zloupotreba

**Kako se koristi:**
- Recenzije se prikazuju na profilu pružatelja
- Prosječna ocjena se automatski izračunava i prikazuje
- Korisnici mogu pregledati sve recenzije prije odabira pružatelja
- Recenzije mogu biti filtrirane po ocjeni i sortirane po datumu

**Zašto je važno:**
- Pomaže drugim korisnicima odabrati kvalitetnog pružatelja
- Pružatelji s boljim ocjenama dobivaju više poslova
- Potiče pružatelje da pružaju najbolju moguću uslugu
- Gradi povjerenje u platformu

Ocjenjivanje pružatelja je važan dio sustava - vaša ocjena pomaže drugim korisnicima i potiče kvalitetu usluga!
`
    },
    "Real-time chat između korisnika i pružatelja": {
      implemented: true,
      summary: "Komunicirajte s korisnicima ili pružateljima u realnom vremenu preko chata na platformi.",
      details: `## Kako funkcionira:

Chat sustav omogućava direktnu komunikaciju između korisnika i pružatelja oko poslova, bez potrebe za vanjskim aplikacijama.

**Kako koristiti chat:**
- Svaki posao ima svoju chat sobu
- Kliknite na posao da otvorite chat
- Unesite poruku i kliknite "Pošalji" ili pritisnite Enter
- Poruka se šalje odmah i primatelj je vidi u stvarnom vremenu
- Primljene poruke se prikazuju u chat prozoru

**Slanje slika:**
- Možete priložiti slike u chatu
- Korisno za pokazivanje detalja posla ili stanja rada
- Kliknite na ikonu za prilaganje slike i odaberite datoteku
- Slika se uploada i automatski se šalje u chat

**Status poruka:**
- **Poslana** - Vaša poruka je poslana
- **Dostavljena** - Poruka je dostavljena primatelju
- **Pročitana** - Primatelj je pročitao vašu poruku (vidite "✓✓" ili "Pročitano")

**Povijest poruka:**
- Sve poruke su spremljene i vidljive uvijek
- Možete se vratiti na bilo koji chat i vidjeti povijest razgovora
- Korisno za pregled dogovora ili detalja posla

**Notifikacije:**
- Dobivate obavijest kada vam netko pošalje poruku
- Vidite brojač nepročitanih poruka
- Možete otvoriti chat direktno iz notifikacije

**Zašto je korisno:**
- Brza komunikacija bez prebacivanja na druge aplikacije
- Sve poruke su na jednom mjestu - lako za pregled
- Mogućnost slanja slika za bolje objašnjavanje
- Povijest razgovora pomaže u slučaju sporova

Real-time chat čini komunikaciju brzom i jednostavnom - možete razgovarati s korisnicima ili pružateljima direktno na platformi!
`
    },
    "Prijava korisnika": {
      implemented: true,
      summary: "Prijavite se na svoj račun koristeći email i lozinku.",
      details: `## Kako funkcionira:

Prijava omogućava vam pristup vašem računu i svim funkcionalnostima platforme.

**Proces prijave:**
- Unesite svoju email adresu
- Unesite lozinku
- Kliknite "Prijavi se"
- Ako su podaci točni, prijavljujete se i preusmjeravate na glavnu stranicu

**Sigurnost:**
- Vaša lozinka je šifrirana i sigurna
- Ako zaboravite lozinku, možete je resetirati putem emaila
- Možete se prijaviti samo jednom s istog računa - ako se prijavite negdje drugdje, prva sesija se zatvara

**Različite uloge:**
- Ako imate korisnički račun, vidite opcije za korisnike usluga
- Ako imate pružateljski račun, vidite opcije za pružatelje
- Ako imate admin račun, vidite administrativne opcije
- Iste email adrese mogu biti korištene za različite uloge

**Zapamti me:**
- Možete odabrati opciju "Zapamti me" pri prijavi
- To vam omogućava da ostanete prijavljeni između sesija
- Nemate potrebe za ponovnom prijavom svaki put kada otvorite platformu

Prijava je jednostavna i brza - za nekoliko sekundi imate pristup svojem računu!
`
    },
    "Resetiranje lozinke": {
      implemented: true,
      summary: "Resetirajte svoju lozinku ako je zaboravite ili želite promijeniti.",
      details: `## Kako funkcionira:

Ako zaboravite lozinku ili želite promijeniti postojeću, možete je resetirati putem emaila.

**Proces resetiranja:**
- Kliknite "Zaboravljena lozinka?" na stranici za prijavu
- Unesite svoju email adresu
- Kliknite "Pošalji link za resetiranje"
- Primite email s linkom za resetiranje lozinke
- Kliknite na link u emailu
- Unesite novu lozinku (potrebno je potvrditi dva puta)
- Kliknite "Spremi novu lozinku"

**Sigurnost:**
- Link za resetiranje vrijedi ograničeno vrijeme (obično 1 sat)
- Link možete koristiti samo jednom - nakon korištenja više nije aktivan
- Ako ne koristite link na vrijeme, morate zatražiti novi

**Zašto je korisno:**
- Ne morate kontaktirati podršku ako zaboravite lozinku
- Možete promijeniti lozinku u bilo kojem trenutku
- Osigurava da samo vi imate pristup vašem računu

Resetiranje lozinke je sigurno i jednostavno - samo slijedite upute u emailu!
`
    },
    "Zaboravljena lozinka": {
      implemented: true,
      summary: "Vratite pristup svom računu ako ste zaboravili lozinku.",
      details: `## Kako funkcionira:

Ako ste zaboravili lozinku, ne morate izgubiti pristup svom računu - možete kreirati novu lozinku.

**Kako zatražiti resetiranje:**
- Kliknite "Zaboravljena lozinka?" na stranici za prijavu
- Unesite email adresu vašeg računa
- Kliknite "Pošalji zahtjev"
- Provjerite svoj email - primit ćete poruku s uputama

**Što slijedi:**
- Email sadrži siguran link za resetiranje lozinke
- Kliknite na link u emailu - otvara se stranica za novu lozinku
- Unesite novu lozinku (morate je unijeti dva puta za potvrdu)
- Kliknite "Spremi"
- Sada možete se prijaviti s novom lozinkom

**Sigurnost:**
- Link za resetiranje je siguran i vrijedi ograničeno vrijeme
- Samo vi možete vidjeti email, tako da je proces siguran
- Nakon što resetirate lozinku, možete se prijaviti odmah

Ako zaboravite lozinku, resetirajte je putem emaila - jednostavno i sigurno!
`
    },
    "51 kategorija usluga": {
      implemented: true,
      summary: "Platforma nudi 51 različitu kategoriju usluga iz raznih područja.",
      details: `## Kako funkcionira:

Platforma pokriva širok spektar usluga kroz 51 različitu kategoriju koje se protežu kroz različita područja rada.

**Širok spektar usluga:**
- Građevinarstvo (keramičarski radovi, zidarski radovi, fasade, itd.)
- Elektrotehnika (električni radovi, instalacije, servisi)
- Vodoinstalacija (postavljanje, popravci, odvodnja)
- Stolarija (namještaj, ugradnje, prozori i vrata)
- Krovopokrivački radovi
- Slikanje i lakiranje
- Vrtlarstvo i uređenje okoliša
- Čišćenje i održavanje
- I još mnogo drugih kategorija

**Organizacija kategorija:**
- Svaka kategorija ima svoj naziv i opis
- Kategorije mogu imati emoji ikone za lakše prepoznavanje
- Neke kategorije su organizirane u hijerarhiju (glavne kategorije i podkategorije)

**Za korisnike:**
- Možete odabrati točno kategoriju koja odgovara vašem poslu
- Detaljan opis kategorije vam pomaže da odaberete pravu
- To osigurava da vaš posao dospije do pravih pružatelja

**Za pružatelje:**
- Možete odabrati u kojim kategorijama želite raditi
- To određuje koje leadove primate
- Možete biti aktivni u više kategorija odjednom

51 kategorija usluga osigurava da možete pronaći ili ponuditi gotovo svaku vrstu usluge!
`
    },
    "ROI dashboard": {
      implemented: true,
      summary: "Vidite detaljne statistike vašeg poslovanja - koliko zaradujete, koliko trošite i koliki je vaš ROI.",
      details: `## Kako funkcionira:

ROI (Return on Investment) dashboard je vaš centar za praćenje poslovnih rezultata. Vidite sve važne metrike na jednom mjestu.

**Glavne metrike:**
- **Stopa konverzije** - Koliki postotak vaših kupljenih leadova se konvertira u stvarne poslove (npr. ako kupite 10 leadova i 4 konvertirate, imate 40% stopu konverzije)
- **ROI (Return on Investment)** - Koliki profit ostvarujete na svaku kunu uloženu u leadove (npr. ako uložite 1000 kn i zaradite 3000 kn, vaš ROI je 200%)
- **Prosječna vrijednost leada** - Koliko u prosjeku zaradite po konvertiranom leadu
- **Ukupan prihod** - Ukupna svota novca koju ste zaradili od leadova
- **Potrošeno kredita** - Ukupna svota kredita koju ste potrošili na kupovinu leadova

**Mjesečna statistika:**
- Vidite kako se vaše metrike mijenjaju kroz mjesece
- Pratite trendove - poboljšavate li se ili je potrebna promjena pristupa
- Usporedba između mjeseci vam pomaže razumjeti što radi, a što ne

**Top leadovi:**
- Pregled najprofitabilnijih leadova koje ste konvertirali
- Vidite koji tipovi leadova vam najviše odgovaraju
- Analiza uspješnih konverzija vam pomaže fokusirati se na slične leadove

**AI Insights:**
- Platforma analizira vaše rezultate i daje vam personalizirane preporuke
- Primjerice: "Vaša stopa konverzije je iznad prosjeka u kategoriji Elektrotehnika"
- Ili: "Najbolje vam idu leadovi s budžetom između 5000-10000 kn"

**Pretplata:**
- Vidite koje plan pretplate imate aktivan
- Koliko kredita vam je preostalo
- Kada istječe vaša pretplata

**Prednosti:**
- Brzo vidite jesmo li profitabilni
- Razumijete koje kategorije ili tipovi leadova vam odgovaraju
- Donosite informirane odluke o tome gdje uložiti novac
- Pratite napredak i vidite rast vašeg poslovanja

ROI dashboard vam daje potpunu sliku vašeg poslovanja kako biste mogli optimizirati strategiju i povećati profit.
`
    },
    "Kreditni sustav": {
      implemented: true,
      summary: "Koristite kredite kao valutu za kupovinu leadova - fleksibilno i jednostavno.",
      details: `## Kako funkcionira:

Kreditni sustav omogućava vam da kupujete leadove koristeći kredite umjesto direktnog plaćanja za svaki lead. To je kao virtualni novac za platformu.

**Što su krediti:**
- Krediti su virtualna valuta platforme
- 1 kredit = određena vrijednost (ovisno o vašem pretplati)
- Koristite kredite za kupovinu ekskluzivnih leadova
- Krediti se troše automatski kada kupite lead

**Kako dobijete kredite:**
- Pretplatom na plan (BASIC, PREMIUM, PRO) - svaki plan daje određeni broj kredita mjesečno
- Pri registraciji kao pružatelj - dobivate besplatni TRIAL period s 5 kredita za testiranje
- Kupnjom dodatnih kredita ako vam zatreba više
- Refundom - ako vam se lead vrati, krediti se automatski vraćaju na vaš račun

**Praćenje kredita:**
- Vidite trenutni balans kredita u gornjem desnom kutu ekrana
- Balans se ažurira u stvarnom vremenu - kada kupite lead, krediti se oduzimaju odmah
- Ako vam kredita padne ispod određenog iznosa, dobivate upozorenje
- Uvijek znate koliko kredita imate dostupno

**Povijest transakcija:**
- Sve vaše transakcije s kreditima su zabilježene
- Vidite kada ste dobili kredite (pretplata, refund, bonus)
- Vidite kada ste potrošili kredite (kupovina leadova)
- Svaka transakcija ima opis što se dogodilo

**Tipovi transakcija:**
- **Kupovina leada** - potrošili ste kredite na kupovinu leada
- **Refund** - vratio se kredit jer ste zatražili refund ili je došlo do automatskog refunda
- **Pretplata** - dobili ste kredite kroz vašu mjesečnu pretplatu
- **Bonus** - dobili ste dodatne kredite (npr. kao poklon)
- **Ručna prilagodba** - administrator vam je ručno dodao ili oduzeo kredite (rijetko)

**Prednosti:**
- Ne morate plaćati za svaki lead zasebno - krediti su prethodno plaćeni
- Lako planirate budžet - vidite koliko kredita imate i možete ih potrošiti
- Automatska naplata - nema potrebe za ponovnim unosom podataka o plaćanju
- Refund je jednostavan - krediti se vraćaju automatski na vaš račun

Kreditni sustav čini kupovinu leadova jednostavnom i brzom - jednom kada imate kredite, kupovina leada je samo jedan klik.
`
    },
    "AI score kvalitete leadova": {
      implemented: true,
      summary: "Svaki lead dobiva AI ocjenu kvalitete od 0-100 koja pokazuje koliko je lead vrijedan.",
      details: `## Kako funkcionira:

Sustav automatski analizira svaki lead i daje mu ocjenu kvalitete od 0 do 100. Viša ocjena znači bolji lead s većom šansom za konverziju.

**Što AI analizira:**
- **Verifikacija klijenta** - Je li klijent verificiran (email, telefon, OIB, tvrtka)? Verificirani klijenti dobivaju najviše bodova jer su ozbiljniji
- **Budžet** - Je li budžet definiran? Klijenti koji znaju koliko žele potrošiti su ozbiljniji
- **Kvaliteta opisa** - Je li opis detaljan? Detaljniji opisi znače da klijent zna što želi
- **Slike** - Ima li posao priložene slike? Slike pomažu razumjeti što je potrebno
- **Hitnost** - Je li posao hitan? Hitni poslovi su često brže konvertiraju
- **Rok** - Je li definiran rok? Rok pokazuje ozbiljnost klijenta
- **Lokacija** - Je li lokacija navedena? Lokacija omogućava precizno uparivanje
- **Veličina posla** - Veliki poslovi su obično profitabilniji
- **Starost računa** - Stariji korisnici su obično pouzdaniji

**Kategorije kvalitete:**
- **🟢 VRHUNSKI (80-100 bodova)** - Najkvalitetniji leadovi, cijena: 20 kredita
  - Verificirani klijenti s detaljnim opisom i budžetom
  - Najveća šansa za konverziju (obično 50%+)
  - Idealno za pružatelje koji žele maksimizirati ROI

- **🔵 DOBAR (60-79 bodova)** - Kvalitetni leadovi, cijena: 15 kredita
  - Dobro opisan posao s većinom podataka
  - Dobre šanse za konverziju (obično 30-40%)
  - Dobar omjer cijene i kvalitete

- **🟡 PROSJEČAN (40-59 bodova)** - Standardni leadovi, cijena: 10 kredita
  - Osnovni podaci dostupni, neki detalji mogu nedostajati
  - Prosječna šansa za konverziju (obično 15-25%)
  - Jeftiniji, ali i rizičniji

- **⚪ SLAB (0-39 bodova)** - Niža kvaliteta, cijena: 5 kredita
  - Nedostaju važni podaci, klijent možda nije verificiran
  - Niža šansa za konverziju (obično <15%)
  - Jeftini, ali mogu biti manje profitabilni

**Kako koristiti AI score:**
- Pregledajte ocjenu prije kupovine leada
- Visoki score leadovi su obično sigurniji, ali i skuplji
- Niski score leadovi su jeftiniji, ali rizičniji
- Odaberite strategiju koja vam odgovara - konzervativno (samo visoki score) ili agresivno (različiti score-ovi)

**Filtering po kvaliteti:**
- Ako imate PRO plan, možete filtrirati i vidjeti samo leadove s ocjenom 80+
- To vam omogućava fokus samo na najkvalitetnije leadove
- PREMIUM plan vam omogućava sortiranje po kvaliteti

**Prednosti:**
- Znate unaprijed koliko je lead vrijedan prije kupovine
- Možete planirati strategiju kupovine ovisno o kvaliteti leadova
- Smanjujete rizik kupujući kvalitetnije leadove
- Povećavate ROI fokusiranjem na leadove s višim score-om

AI score vam pomaže donositi informirane odluke o tome koji leadovi su vrijedni vaših kredita.
`
    },
    "SMS verifikacija telefonskog broja (Twilio)": {
      implemented: true,
      summary: "Potvrdite svoj telefon putem SMS poruke s verifikacijskim kodom.",
      details: `## Kako funkcionira:

SMS verifikacija omogućava vam da dokazete da telefon koji ste naveli u profilu stvarno pripada vama.

**Proces verifikacije:**
- Unesite svoj telefonski broj u formatu +385XXXXXXXXX (npr. +385981234567)
- Kliknite "Pošalji SMS kod" - primit ćete SMS poruku s 6-znamenkastim verifikacijskim kodom
- Unesite kod koji ste primili u polje za verifikaciju
- Kliknite "Potvrdi" - vaš telefon je sada verificiran

**Sigurnost:**
- Kod vrijedi 10 minuta - ako ne unesete kod u tom vremenu, morate zatražiti novi
- Možete pokušati unijeti kod najviše 5 puta - nakon toga morate zatražiti novi SMS
- Svaki kod je jedinstven i može se koristiti samo jednom
- Ako ne primite SMS, možete zatražiti novi kod nakon 60 sekundi

**Zašto je važno:**
- Verificirani telefon dokazuje da ste stvarni pružatelj usluga
- Povećava povjerenje korisnika u vaš profil
- Omogućava vam dobivanje Identity Badge za telefon koji se prikazuje na vašem profilu
- Pomaže u verifikaciji klijenata - verificirani pružatelji imaju bolji trust score

**Kada koristite:**
- Pri registraciji kao pružatelj - preporučuje se verifikacija telefona
- Pri ažuriranju profila - možete verificirati telefon u bilo kojem trenutku
- Kao dio procesa dobivanja Identity Badge-a za telefon

SMS verifikacija je jednostavan i brz način da dokažete svoj identitet i povećate kredibilitet svog profila.
`
    },
    "Prosječno vrijeme odgovora (avgResponseTimeMinutes)": {
      implemented: true,
      summary: "Platforma prati koliko brzo odgovarate na leadove - brži odgovori znače bolju reputaciju.",
      details: `## Kako funkcionira:

Prosječno vrijeme odgovora mjeri koliko vremena vam treba da kontaktirate klijenta nakon što kupite lead. Brži odgovori znače bolju reputaciju i veću šansu da budete upareni s novim leadovima.

**Kako se mjeri:**
- Kada kupite lead, počinje mjerenje vremena
- Kada označite lead kao "Kontaktiran", sustav izračunava koliko vremena je prošlo
- Prosjek se ažurira automatski na temelju svih vaših odgovora
- Prikazuje se u formatu minuta, sati ili dana (npr. "45 minuta" ili "2 sata")

**Zašto je važno:**
- Klijenti vole brze odgovore - ako odgovorite u roku od sat vremena, imate veliku prednost
- Brži odgovori pokazuju profesionalnost i ozbiljnost
- Sustav uparivanja leadova favorizira providere s brzim odgovorima
- Dobivate badge "✓ Brz odgovor" ako je vaš prosjek manji od 60 minuta

**Kako poboljšati:**
- Odgovarajte na leadove što brže možete - idealno unutar sat vremena
- Pratite "Moji leadovi" sekciju kako biste vidjeli aktivne leadove
- Postavite notifikacije kako biste brzo saznali kada kupite novi lead

**Kako se koristi:**
- Vaš prosječni odgovor je vidljiv na vašem profilu
- Koristi se za izračun reputacije zajedno s ocjenom i stopom konverzije
- Pružatelji s bržim odgovorima imaju veću šansu biti odabrani za nove leadove
- Korisnici mogu vidjeti koliko brzo obično odgovarate prije odabira pružatelja

Brži odgovori znače bolju reputaciju i više poslova - odgovarajte što brže možete!
`
    },
    "Online plaćanje (Stripe Checkout)": {
      implemented: true,
      summary: "Sigurno i jednostavno plaćanje pretplata i leadova preko kreditne kartice.",
      details: `## Kako funkcionira:

Platforma koristi Stripe, sigurni servis za online plaćanja, za obradu svih vaših plaćanja.

**Plaćanje pretplata:**
- Odaberete plan pretplate koji vam odgovara (BASIC, PREMIUM ili PRO)
- Kliknete "Pretplati se" - otvara se sigurna Stripe stranica za plaćanje
- Unesete podatke svoje kreditne ili debitne kartice
- Nakon uspješnog plaćanja, vaša pretplata se automatski aktivira
- Vraćate se na platformu gdje vidite ažuriran status pretplate

**Plaćanje leadova (opcionalno):**
- Umjesto korištenja kredita, možete direktno platiti za lead kreditnom karticom
- Korisno ako vam je ponestalo kredita, a želite kupiti važan lead
- Plaćanje se obavlja istim sigurnim procesom kao pretplata

**Sigurnost:**
- Sva plaćanja se obrađuju preko Stripe-a - mi nikada ne vidimo podatke vaše kartice
- Komunikacija je šifrirana (HTTPS)
- Stripe je certificirani PCI DSS Level 1 procesor - najviši standard sigurnosti
- Podržani su svi glavni proizvođači kartica (Visa, Mastercard, American Express)

**Nakon plaćanja:**
- Vaša pretplata se aktivira automatski
- Primite potvrdni email s detaljima pretplate
- Krediti se dodaju na vaš račun ako su uključeni u plan
- Vidite fakturu za svako plaćanje

**Rješavanje problema:**
- Ako plaćanje ne prođe, provjerite podatke kartice
- U slučaju problema, kontaktirajte podršku
- Ako slučajno platite dva puta, automatski će vam se vratiti novac

Online plaćanje je sigurno, brzo i jednostavno - samo nekoliko klikova i vaša pretplata je aktiva!
`
    },
    "Automatski refund nakon 48h neaktivnosti": {
      implemented: true,
      summary: "Ako ne kontaktirate klijenta unutar 48 sati nakon kupovine leada, krediti vam se automatski vraćaju.",
      details: `## Kako funkcionira:

Sustav automatski vrati vaše kredite ako ne kontaktirate klijenta unutar 48 sati nakon što ste kupili lead.

**Proces:**
- Kupite lead i otključajte kontakt informacije
- Imate 48 sati da kontaktirate klijenta
- Ako ne kontaktirate klijenta u tom roku, sustav automatski:
  - Vraća vam kredite na vaš račun
  - Vraća lead na tržište kako bi ga drugi pružatelji mogli kupiti
  - Šalje vam obavijest o refundu

**Zašto postoji:**
- Osigurava da klijenti dobiju brz odgovor od pružatelja
- Sprječava gubitak kredita ako zaboravite kontaktirati klijenta
- Daje lead ponovnu priliku - ako vi ne kontaktirate, netko drugi može
- Čuva kvalitetu usluge - samo aktivni pružatelji zadržavaju leadove

**Kako izbjeći automatski refund:**
- Kontaktirajte klijenta što prije nakon kupovine leada
- Označite lead kao "Kontaktiran" kada se javite klijentu
- Provjeravajte "Moji leadovi" sekciju redovito kako biste vidjeli aktualne leadove

**Što se događa nakon refunda:**
- Krediti se vraćaju na vaš račun automatski
- Lead se vraća na tržište i postaje dostupan drugim pružateljima
- Primite email i in-app notifikaciju s razlogom refunda
- U povijesti transakcija vidite refund s opisom "Automatski refund - neaktivnost 48h"

**Prednosti:**
- Ne gubite kredite ako zaboravite kontaktirati - vraćaju se automatski
- Klijenti dobivaju brz odgovor - samo aktivni pružatelji zadržavaju leadove
- Leadovi se ne "gube" - vraćaju se na tržište za druge pružatelje

Automatski refund osigurava fer sustav gdje aktivni pružatelji imaju prednost, a vi ne gubite kredite ako slučajno zaboravite kontaktirati klijenta.
`
    },
    "JWT token autentifikacija": {
      implemented: true,
      summary: "Sigurna autentifikacija koja vam omogućava pristup platformi bez stalnog ponovnog prijavljivanja.",
      details: `## Kako funkcionira:

JWT (JSON Web Token) autentifikacija osigurava siguran i učinkovit način pristupa vašem računu bez potrebe za konstantnim unosom lozinke.

**Kako funkcionira:**
- Nakon prijave, platforma vam izdaje sigurni token
- Token se koristi za automatsku provjeru vašeg identiteta pri svakom zahtjevu
- Ne morate se ponovno prijavljivati pri svakom osvježavanju stranice
- Token automatski istječe nakon određenog vremena (obično 24 sata) radi sigurnosti

**Sigurnost:**
- Token je šifriran i siguran
- Ako se prijavite s drugog uređaja, stari token se poništava
- Možete se ručno odjaviti što trenutno poništava vaš token
- Token se automatski obnavlja ako ste aktívni na platformi

**Prednosti:**
- Nema potrebe za ponovnom prijavom svaki put
- Brži pristup funkcionalnostima platforme
- Sigurno i moderno rješenje za pristup računu

JWT autentifikacija čini vaše iskustvo bržim i sigurnijim - prijavite se jednom i uživajte u platformi!
`
    },
    "Različite uloge korisnika (USER, PROVIDER, ADMIN)": {
      implemented: true,
      summary: "Platforma podržava tri različite uloge korisnika s različitim dozvolama i funkcionalnostima.",
      details: `## Kako funkcionira:

Platforma je dizajnirana za tri glavne tipove korisnika, svaki s vlastitim pristupom i mogućnostima.

**USER (Korisnik usluge):**
- Korisnici koji traže usluge i objavljuju poslove
- Mogu objavljivati poslove, primati ponude, odabirati pružatelje
- Mogu komunicirati s pružateljima preko chata
- Mogu ocjenjivati pružatelje nakon završenog posla
- Ne vide provider-specifične opcije kao što su leadovi ili ROI dashboard

**PROVIDER (Pružatelj usluga):**
- Korisnici koji nude usluge i traže poslove
- Mogu pregledavati poslove i slati ponude
- Imaju pristup ekskluzivnim leadovima i ROI dashboardu
- Mogu upravljati svojim profilom, portfolio-om i licencama
- Mogu kupovati leadove i pratiti statistike

**ADMIN (Administrator):**
- Korisnici koji upravljaju platformom
- Imaju pristup svim funkcionalnostima
- Mogu upravljati korisnicima, pružateljima, kategorijama
- Mogu moderirati sadržaj, odobravati refundove, pregledavati statistike
- Mogu verifikirati licence i dokumente

**Iste email adrese:**
- Možete koristiti istu email adresu za različite uloge
- Primjerice, možete biti USER i PROVIDER s istom email adresom
- Jednostavno se prebacujete između uloga pri prijavi

**Prednosti:**
- Svaka uloga ima prilagođeno korisničko iskustvo
- Ne vidite opcije koje nisu relevantne za vašu ulogu
- Sigurnost - svaka uloga ima samo pristup onome što joj je potrebno

Različite uloge osiguravaju da svaki korisnik vidi točno ono što mu treba za uspješno korištenje platforme!
`
    },
    "Filtriranje pružatelja": {
      implemented: true,
      summary: "Pronađite točno onog pružatelja koji vam treba koristeći napredne filtere.",
      details: `## Kako funkcionira:

Filtriranje pružatelja omogućava vam da brzo i precizno pronađete pružatelja usluga koji najbolje odgovara vašim potrebama.

**Filteri po kategoriji:**
- Filtrirate pružatelje prema kategorijama u kojima rade
- Vidite samo pružatelje koji rade u odabranoj kategoriji
- Možete odabrati više kategorija odjednom

**Filteri po lokaciji:**
- Filtrirate pružatelje prema gradovima ili područjima rada
- Vidite samo pružatelje koji rade u vašem području
- Geolokacija vam pokazuje i udaljenost od pružatelja

**Filteri po ocjeni:**
- Filtrirate pružatelje prema prosječnoj ocjeni (npr. samo 4+ zvjezdice)
- Vidite samo najbolje ocijenjene pružatelje
- Lako pronalaženje visokokvalitetnih pružatelja

**Filteri po verifikaciji:**
- Filtrirate samo verificirane pružatelje (Email, Phone, DNS, Business badge)
- Vidite samo pružatelje s potrebnim verifikacijama
- Veće povjerenje u odabranog pružatelja

**Filteri po licencama:**
- Filtrirate pružatelje prema tipu licence (npr. Elektrotehnička, Građevinska)
- Vidite samo pružatelje s potrebnim licencama za vaš posao
- Važno za poslove koji zahtijevaju licencirane stručnjake

**Filteri po dostupnosti:**
- Filtrirate pružatelje prema statusu dostupnosti (Dostupan, Zauzet, Neaktivan)
- Vidite samo pružatelje koji su trenutno dostupni
- Osigurava da možete kontaktirati pružatelja odmah

**Pretraživanje:**
- Upišite naziv tvrtke, ime ili pojam u polje za pretraživanje
- Platforma pretražuje profile pružatelja i prikazuje relevantne rezultate
- Kombinirate pretraživanje s filterima za još preciznije rezultate

**Sortiranje:**
- Sortirate pružatelje po ocjeni (najbolje najprije)
- Sortirate po broju recenzija (najpopularniji najprije)
- Sortirate po udaljenosti (najbliži najprije)
- Sortirate po cijeni (najjeftiniji ili najskuplji)

**Prednosti:**
- Brzo pronalaženje točno onog pružatelja koji vam treba
- Ušteda vremena - ne morate pregledavati sve pružatelje
- Veća šansa da ćete pronaći idealnog pružatelja
- Fokus na relevantne opcije

Filtriranje pružatelja vam pomaže da brzo i jednostavno pronađete najboljeg pružatelja za vaš posao!
`
    },
    "Slanje slika u chatu": {
      implemented: true,
      summary: "Dijelite slike direktno u chat razgovoru s korisnicima ili pružateljima.",
      details: `## Kako funkcionira:

Slanje slika u chatu omogućava vam da vizualno pokažete detalje posla, stanje rada ili bilo što drugo relevantno za razgovor.

**Kako poslati sliku:**
- Otvorite chat s korisnikom ili pružateljem
- Kliknite na ikonu za prilaganje slike (obično ikona foto kamere)
- Odaberite sliku s vašeg računala ili mobitela
- Slika se automatski uploada i šalje u chat
- Primatelj vidi sliku odmah

**Što možete slati:**
- Slike situacije koju treba riješiti
- Slike tijeka rada ili završenog posla
- Screenshotove ili dokumente kao slike
- Bilo koje slike relevantne za razgovor

**Kada koristiti:**
- Kada trebate pokazati detalje posla koji se teško opisuje tekstom
- Kada želite pokazati stanje rada klijentu
- Kada želite objasniti nešto vizualno

**Prednosti:**
- Jasnija komunikacija - slika vrijedi više od riječi
- Brže objašnjavanje detalja
- Smanjenje nesporazuma
- Profesionalniji pristup komunikaciji

Slanje slika čini komunikaciju jasnijom i efikasnijom - pokažite umjesto da samo opisujete!
`
    },
    "Status poruke (poslana, pročitana)": {
      implemented: true,
      summary: "Vidite status svake poruke koju pošaljete - je li poslana, dostavljena ili pročitana.",
      details: `## Kako funkcionira:

Status poruke pokazuje vam je li vaša poruka uspješno poslana, dostavljena primatelju i je li je pročitao.

**Statusi poruka:**
- **Poslana** (✓) - Vaša poruka je uspješno poslana na platformu
- **Dostavljena** (✓✓) - Poruka je dostavljena primatelju (primatelj je online ili je primio notifikaciju)
- **Pročitana** (✓✓) - Primatelj je otvorio chat i pročitao vašu poruku

**Kako vidite status:**
- Status se prikazuje ispod svake poruke koju pošaljete
- Vidite ikone kako napreduje dostava vaše poruke
- Status se ažurira automatski kada primatelj primi ili pročita poruku

**Zašto je korisno:**
- Znate je li primatelj primio vašu poruku
- Znate je li primatelj pročitao vašu poruku
- Možete pratiti komunikaciju i vidjeti tko je aktivan
- Ako poruka nije dostavljena, znate da možda trebate kontaktirati primatelja na drugi način

**Privatnost:**
- Status se prikazuje samo vama za poruke koje šaljete
- Primatelj također vidi status svojih poruka koje šalje vama
- Nema invazije privatnosti - samo informacije o dostavi poruke

Status poruke vam daje uvid u komunikaciju i pomaže vam znati kada možete očekivati odgovor!
`
    },
    "Tržište leadova": {
      implemented: true,
      summary: "Pregledajte sve dostupne ekskluzivne leadove na jednom mjestu i odaberite najbolje za vas.",
      details: `## Kako funkcionira:

Tržište leadova je centralno mjesto gdje možete pregledavati sve dostupne ekskluzivne leadove koji su trenutno dostupni za kupovinu.

**Pregled leadova:**
- Vidite sve dostupne ekskluzivne leadove na jednom mjestu
- Svaki lead prikazuje osnovne informacije: naslov posla, kategoriju, lokaciju, budžet
- Vidite AI score kvalitete leada (VRHUNSKI, DOBAR, PROSJEČAN)
- Vidite cijenu leada u kreditima (10-20 kredita ovisno o kvaliteti)

**Informacije o leadu:**
- Naslov i kratak opis posla
- Kategorija usluge
- Lokacija (grad)
- Budžet (minimalna i maksimalna cijena)
- Hitnost posla
- Veličina posla
- AI score kvalitete

**Filtriranje i sortiranje:**
- Filtrirate leadove po kategoriji, lokaciji, budžetu
- Sortirate po kvaliteti (najkvalitetniji najprije)
- Sortirate po cijeni (najjeftiniji ili najskuplji)
- Sortirate po datumu objave (najnoviji najprije)

**Kupovina leada:**
- Kliknite na lead da vidite detaljne informacije
- Odaberete "Kupi lead" ako vas zanima
- Plaćanje se vrši kreditima ili direktno kreditnom karticom
- Nakon kupovine, kontakt informacije postaju dostupne samo vama

**Prednosti:**
- Brz pregled svih dostupnih leadova
- Lako pronalaženje leadova koji odgovaraju vašim kategorijama
- Transparentne cijene i kvaliteta svakog leada
- Mogućnost filtriranja i sortiranja za brže pronalaženje idealnih leadova

Tržište leadova je vaš izvor kvalitetnih ekskluzivnih leadova - pregledajte i odaberite najbolje!
`
    },
    "Moji leadovi": {
      implemented: true,
      summary: "Upravljajte svim leadovima koje ste kupili - pratite status, kontaktirajte klijente i označite rezultate.",
      details: `## Kako funkcionira:

"Moji leadovi" je sekcija gdje možete vidjeti i upravljati svim leadovima koje ste kupili.

**Pregled leadova:**
- Vidite sve leadove koje ste kupili
- Svaki lead prikazuje status (Aktivno, Kontaktirano, Konvertirano, Refundirano)
- Vidite datum kupovine i koliko vremena je prošlo
- Vidite osnovne informacije o poslu

**Statusi leadova:**
- **Aktivno** - Kupili ste lead, ali ga još niste kontaktirali
- **Kontaktirano** - Već ste kontaktirali klijenta
- **Konvertirano** - Uspješno ste dobili posao/uslugu
- **Refundirano** - Lead je vraćen (automatski ili ručno)
- **Isteklo** - Lead je istekao zbog neaktivnosti

**Upravljanje leadovima:**
- Kliknite na lead da vidite sve detalje i kontakt informacije
- Označite lead kao "Kontaktiran" kada se javite klijentu
- Označite lead kao "Konvertiran" kada dobijete posao
- Zatražite refund ako je potrebno

**Kontakt informacije:**
- Nakon kupovine leada, kontakt informacije su dostupne samo vama
- Vidite email i telefon klijenta
- Možete direktno kontaktirati klijenta

**Praćenje vremena:**
- Vidite kada ste kupili lead
- Vidite koliko vremena je prošlo od kupovine
- Vidite upozorenja ako se približavate 48h granici za automatski refund

**Prednosti:**
- Centralizirani pregled svih vaših leadova
- Lako upravljanje i praćenje statusa
- Jasna organizacija vaših aktivnih i završenih leadova
- Mogućnost brzog pristupa kontakt informacijama

"Moji leadovi" je vaša radna prostorija gdje upravljate svim kupljenim leadovima!
`
    },
    "Fakturiranje (PDF fakture za pretplate i kupovine)": {
      implemented: true,
      summary: "Automatski generirane PDF fakture za sve vaše plaćanja pretplata i kupovine leadova.",
      details: `## Kako funkcionira:

Platforma automatski generira profesionalne PDF fakture za sva vaša plaćanja.

**Kada se generiraju fakture:**
- Automatski za svaku pretplatu na plan (BASIC, PREMIUM, PRO)
- Automatski za svaku kupovinu leada (ako plaćate direktno kreditnom karticom)
- Automatski za sve transakcije kroz Stripe

**Sadržaj fakture:**
- Podaci tvrtke koja izdaje fakturu (ORIPHIEL d.o.o.)
- OIB, adresa i naziv tvrtke
- Broj fakture (u formatu YYYY-XXXX, gdje se brojevi resetiraju svake godine)
- Datum izdavanja
- Vaši podaci (ime, email, adresa)
- Opis usluge (npr. "Pretplata PREMIUM plan - Siječanj 2025" ili "Kupovina ekskluzivnog leada")
- Iznos (s PDV-om ako je primjenjivo)
- ZKI (Zaštitni Kod Izdavatelja) i JIR (Jedinstveni Identifikacijski Registar)
- QR kod za brzu provjeru fakture

**Pristup fakturi:**
- Faktura se automatski šalje na vaš email
- Možete preuzeti PDF fakturu s platforme u bilo kojem trenutku
- Sve fakture su pohranjene na vašem računu

**Povijest faktura:**
- Vidite sve svoje fakture na jednom mjestu
- Možete filtrirati fakture po datumu, tipu, iznosu
- Svaka faktura ima svoj jedinstveni broj

**Storno fakture:**
- Ako otkazujete pretplatu ili se dogodi refund, može se generirati storno faktura
- Storno faktura ima negativne iznose i označava poništenje originalne fakture
- Sve storno fakture su također dostupne na vašem računu

**Prednosti:**
- Profesionalne i pravilne fakture za sve transakcije
- Lako čuvanje dokumenata za knjigovodstvo
- Automatsko slanje na email
- Mogućnost preuzimanja u bilo kojem trenutku

Fakturiranje je automatski i jednostavno - primite profesionalnu fakturu za svako plaćanje!
`
    },
    "Povrat novca za pretplate (refund subscription payment)": {
      implemented: true,
      summary: "Vratite novac za pretplatu ako je otkazujete unutar određenog vremenskog perioda.",
      details: `## Kako funkcionira:

Ako otkazujete pretplatu ili želite vratiti novac za pretplatu, možete zatražiti refund.

**Kada možete zatražiti refund:**
- Ako otkazujete pretplatu u roku od 14 dana od početka pretplate
- Ako imate tehničkih problema koje nismo mogli riješiti
- Ako vam pretplata ne odgovara iz razloga koji su prihvatljivi

**Proces refund-a:**
- Otkazujete pretplatu kroz postavke
- Odaberete opciju za refund ako je dostupna
- Unesete razlog za refund
- Administrator pregleda zahtjev i odlučuje o refund-u
- Ako je odobren, novac se vraća na istu karticu kojom ste platili

**Načini refund-a:**
- Automatski refund kroz Stripe ako je plaćanje bilo preko Stripe-a
- Refund kroz interni kreditni sustav ako je primjenjivo
- Novac se vraća u roku od 5-10 radnih dana

**Što se događa nakon refunda:**
- Pretplata se otkazuje
- Pristup funkcionalnostima plana se gasi
- Krediti koji nisu iskorišteni mogu biti vraćeni ili poništeni
- Primite potvrdu refund-a na email

**Status refund-a:**
- Možete pratiti status svog refund zahtjeva
- Primite obavijest kada je refund odobren ili odbijen
- Vidite detalje refund-a u povijesti transakcija

**Prednosti:**
- Mogućnost vraćanja novca ako pretplata ne odgovara
- Fer i transparentan proces refund-a
- Vraćanje novca na istu karticu
- Mogućnost praćenja statusa refund-a

Povrat novca za pretplate osigurava da možete sigurno probati platformu bez rizika!
`
    },
    "Detaljni opis posla": {
      implemented: true,
      summary: "Dajte što detaljniji opis posla kako bi pružatelji znali točno što trebate.",
      details: `## Kako funkcionira:

Detaljni opis posla je važan dio objavljivanja posla - što bolje opišete što tražite, to bolje pružatelji mogu odgovoriti.

**Što uključiti u opis:**
- Što točno treba napraviti (npr. "Postavljanje keramike u kupaonici")
- Gdje se posao obavlja (npr. "U stanu na 2. katu")
- Trenutno stanje (npr. "Stara keramika je uklonjena, potrebno je postaviti novu")
- Specifične zahtjeve (npr. "Keramika je već kupljena, potrebno je samo postavljanje")
- Posebne napomene (npr. "Potrebno je paziti na vodoinstalaciju")

**Savjeti za dobar opis:**
- Budite što specifičniji - umjesto "Popravak", napišite "Zamjena pokvarenog prekidača u dnevnom boravku"
- Navedite dimenzije ako su relevantne
- Dodajte informacije o pristupu (npr. "Stan je u prizemlju, lako je pristup")
- Naveite ako imate materijale ili ako treba pružatelj donijeti

**Slika vrijedi tisuću riječi:**
- Uploadajte slike situacije koju treba riješiti
- Slike pomažu pružateljima razumjeti posao bez posjeta
- Više slika = bolje razumijevanje = bolje ponude

**Pregled opisa:**
- Pružatelji vide vaš opis prije nego što pošalju ponudu
- Detaljniji opis privlači ozbiljnije pružatelje
- Dobre opise pružatelji cijene jer znaju točno što trebaju ponuditi

**Prednosti:**
- Pružatelji mogu dati precizniju ponudu
- Manje pitanja i bolja komunikacija
- Veća šansa da ćete dobiti kvalitetne ponude
- Brže pronalaženje pravog pružatelja

Detaljni opis posla je vaš najbolji način da privučete prave pružatelje i dobijete kvalitetne ponude!
`
    },
    "Pretraživanje poslova": {
      implemented: true,
      summary: "Pronađite poslove koji vas zanimaju pomoću napredne pretrage po ključnim riječima, kategorijama i lokaciji.",
      details: `## Kako funkcionira:

Pretraživanje poslova omogućava vam da brzo pronađete poslove koji odgovaraju vašim kriterijima.

**Pretraživanje po ključnim riječima:**
- Upišite riječ ili frazu u polje za pretraživanje (npr. "keramika", "električni radovi")
- Platforma pretražuje naslove i opise poslova
- Vidite sve poslove koji sadrže vašu traženu riječ

**Filteri:**
- **Po kategoriji** - Filtrirate samo poslove u odabranoj kategoriji
- **Po lokaciji** - Filtrirate samo poslove u određenom gradu ili području
- **Po budžetu** - Filtrirate poslove prema vašem budžetnom rasponu
- **Po statusu** - Filtrirate samo otvorene poslove, poslove u tijeku, itd.
- **Po hitnosti** - Filtrirate samo hitne poslove ili samo normalne

**Sortiranje rezultata:**
- Sortirate po datumu objave (najnoviji najprije)
- Sortirate po budžetu (najskuplji ili najjeftiniji najprije)
- Sortirate po lokaciji (najbliži najprije)

**Napredna pretraga:**
- Kombinirajte više filtera za preciznije rezultate
- Primjerice: "Keramičarski radovi" + "Zagreb" + "Budžet 5000-10000 kn"
- Rezultati se ažuriraju automatski pri promjeni filtera

**Spremanje pretraživanja:**
- Možete spremiti često korištene pretrage
- Dobivate obavijesti kada se objavi novi posao koji odgovara vašoj pretrazi
- Lako vraćanje na često korištene pretrage

**Prednosti:**
- Brzo pronalaženje relevantnih poslova
- Ušteda vremena - ne morate pregledavati sve poslove
- Preciznije rezultate korištenjem filtera
- Mogućnost spremanja često korištenih pretraga

Pretraživanje poslova vam pomaže da brzo i jednostavno pronađete poslove koji vas zanimaju!
`
    },
    "Notifikacije za nove ponude": {
      implemented: true,
      summary: "Primajte obavijesti kada vam pružatelj pošalje ponudu za vaš posao.",
      details: `## Kako funkcionira:

Kada pružatelj pošalje ponudu za vaš posao, automatski primite obavijest.

**Kada primite notifikaciju:**
- Čim pružatelj pošalje ponudu za vaš objavljeni posao
- Notifikacija se pojavljuje u realnom vremenu
- Primite i email notifikaciju ako je omogućeno

**Što notifikacija sadrži:**
- Ime pružatelja koji je poslao ponudu
- Naslov posla za koji je ponuda
- Iznos ponude
- Poruka koju je pružatelj priložio (ako je duga, vidite prvi dio)

**Kako reagirati:**
- Kliknite na notifikaciju da otvorite detalje ponude
- Pregledajte sve ponude za taj posao
- Prihvatite ili odbijte ponudu
- Možete i odgovoriti pružatelju preko chata

**Gdje vidite notifikacije:**
- U gornjem desnom kutu ekrana (ikonica zvona)
- Vidite brojač nepročitanih notifikacija
- Kliknete na ikonicu da vidite sve notifikacije
- Notifikacije možete označiti kao pročitane ili obrisati

**Prednosti:**
- Ne propustite nijednu ponudu
- Brz odgovor pružateljima znači brži početak rada
- Mogućnost pregleda svih ponuda na jednom mjestu
- Email notifikacije osiguravaju da vidite ponudu i ako niste na platformi

Notifikacije za nove ponude osiguravaju da ne propustite nijednu priliku!
`
    },
    "Dinamičko učitavanje kategorija iz baze": {
      implemented: true,
      summary: "Kategorije se automatski učitavaju i ažuriraju s platforme bez potrebe za restartom.",
      details: `## Kako funkcionira:

Kategorije usluga se automatski učitavaju s platforme i uvijek su ažurne i točne.

**Automatsko učitavanje:**
- Kategorije se učitavaju automatski kada otvorite platformu
- Nema potrebe za ručnim ažuriranjem ili osvježavanjem stranice
- Sve promjene u kategorijama se odmah vide

**Ažuriranje:**
- Ako administrator doda novu kategoriju, vidite je odmah
- Ako se promijene opisi ili ikone kategorija, promjene su vidljive odmah
- Ne morate čekati ažuriranja aplikacije

**Prednosti:**
- Uvijek imate najnovije kategorije
- Automatsko ažuriranje bez vaše intervencije
- Brže i jednostavnije korisničko iskustvo

Dinamičko učitavanje osigurava da uvijek vidite najnovije kategorije bez dodatnog rada!
`
    },
    "Emoji ikone za kategorije": {
      implemented: true,
      summary: "Svaka kategorija ima emoji ikonu koja olakšava prepoznavanje i navigaciju.",
      details: `## Kako funkcionira:

Svaka kategorija usluga ima svoju emoji ikonu koja vizualno predstavlja vrstu usluge.

**Vizualna identifikacija:**
- Emoji ikone olakšavaju brzo prepoznavanje kategorija
- Primjerice: 🔨 za građevinarstvo, ⚡ za elektrotehniku, 💧 za vodoinstalaciju
- Lako pronalaženje kategorije koja vas zanima

**Kako se koristi:**
- Emoji se prikazuje uz naziv kategorije u izborniku
- Vidite emoji i na kartici posla kada je kategorija navedena
- Emoji pomaže u brzom skeniranju lista kategorija

**Prednosti:**
- Brže prepoznavanje kategorija
- Vizualno privlačnije i modernije sučelje
- Lakša navigacija kroz kategorije
- Univerzalno razumljivo - emoji se razumiju u svim jezicima

Emoji ikone čine navigaciju kroz kategorije bržom i intuitivnijom!
`
    },
    "Opisi kategorija": {
      implemented: true,
      summary: "Svaka kategorija ima detaljan opis koji objašnjava koje usluge spadaju u tu kategoriju.",
      details: `## Kako funkcionira:

Svaka kategorija usluga ima svoj opis koji jasno objašnjava što sve spada u tu kategoriju.

**Što opis sadrži:**
- Objašnjenje koje usluge spadaju u kategoriju
- Primjere radova ili usluga
- Posebne napomene o kategoriji (npr. potrebne licence)

**Kako se koristi:**
- Kada odabirate kategoriju, vidite opis kako biste bili sigurni da je to prava kategorija
- Pomaže vam razumjeti što točno nudi kategorija
- Uspoređujete kategorije prije odabira

**Za korisnike:**
- Jasnije razumijevanje gdje objaviti svoj posao
- Lakše pronalaženje prave kategorije za svoj posao
- Manje grešaka pri odabiru kategorije

**Za pružatelje:**
- Razumijevanje u kojim kategorijama možete raditi
- Jasnije definirane vaše usluge
- Bolje uparivanje s poslovima

Opisi kategorija osiguravaju da uvijek znate što točno nudi svaka kategorija!
`
    },
    "NKD kodovi djelatnosti": {
      implemented: true,
      summary: "Svaka kategorija ima pridruženi NKD (Nacionalna klasifikacija djelatnosti) kod za točnu klasifikaciju.",
      details: `## Kako funkcionira:

NKD kodovi su službena klasifikacija djelatnosti koja se koristi u Hrvatskoj za statistiku i poslovne svrhe.

**Što je NKD kod:**
- Nacionalna klasifikacija djelatnosti (NKD) je službena klasifikacija
- Svaka djelatnost ima svoj jedinstveni NKD kod
- Koristi se za statistiku, registraciju tvrtki i poslovne svrhe

**Kako se koristi:**
- Svaka kategorija na platformi ima pridruženi NKD kod
- Kod pomaže u točnoj klasifikaciji vaših usluga
- Možete vidjeti NKD kod za kategoriju u njenim detaljima

**Zašto je važno:**
- Točna klasifikacija vaših usluga
- Kompatibilnost s službenim dokumentima
- Mogućnost korištenja kod registracije ili izvještavanja

NKD kodovi osiguravaju točnu i službenu klasifikaciju vaših usluga!
`
    },
    "Oznake za licencirane djelatnosti": {
      implemented: true,
      summary: "Kategorije koje zahtijevaju licence imaju posebnu oznaku koja to jasno označava.",
      details: `## Kako funkcionira:

Neke kategorije usluga zahtijevaju posebne licence ili certifikate za legalno obavljanje djelatnosti.

**Oznake licence:**
- Kategorije koje zahtijevaju licence imaju posebnu oznaku (npr. 🏛️ ikona)
- Jasno vidite koje kategorije zahtijevaju licence
- Označene kategorije upozoravaju da možda trebate licencu

**Primjeri licenciranih djelatnosti:**
- Elektrotehnički radovi - potrebna elektrotehnička licenca
- Građevinski radovi - potrebna građevinska licenca
- Vodoinstalaterski radovi - potrebna vodoinstalaterska licenca

**Za korisnike:**
- Znate da pružatelji u tim kategorijama moraju imati licence
- Možete tražiti samo licencirane pružatelje
- Veće povjerenje u kvalitetu i sigurnost usluge

**Za pružatelje:**
- Znate koje kategorije zahtijevaju licence
- Možete priložiti svoje licence kako biste radili u tim kategorijama
- Vaše licence se prikazuju uz kategorije gdje radite

Oznake za licencirane djelatnosti osiguravaju transparentnost i zakonitost usluga!
`
    },
    "Tipovi licenci (Elektrotehnička, Građevinska, itd.)": {
      implemented: true,
      summary: "Sustav podržava različite tipove profesionalnih licenci potrebnih za određene djelatnosti.",
      details: `## Kako funkcionira:

Platforma prepoznaje i upravlja različitim tipovima profesionalnih licenci koje su potrebne za određene kategorije usluga.

**Tipovi licenci:**
- **Elektrotehnička licenca** - za električne radove i instalacije
- **Građevinska licenca** - za građevinske radove i konstrukcije
- **Vodoinstalaterska licenca** - za vodoinstalaterske radove
- **Klimatizacijska licenca** - za klima uređaje i ventilaciju
- **Plinski servis licenca** - za plinske instalacije
- I još mnogo drugih tipova licenci

**Kako funkcionira:**
- Kada uploadujete licencu, odabirete tip licence
- Svaki tip licence ima svoj opis i zahtjeve
- Licence se povezuju s kategorijama usluga koje zahtijevaju te licence

**Za pružatelje:**
- Lako dodajete sve svoje licence na profil
- Svaka licenca se povezuje s relevantnim kategorijama
- Korisnici vide koje licence imate za koje kategorije

**Za korisnike:**
- Vidite koje licence pružatelj ima
- Možete filtrirati pružatelje prema tipu licence
- Osigurava da radite s licenciranim stručnjacima

Tipovi licenci osiguravaju da svaka djelatnost ima pravog licenciranog stručnjaka!
`
    },
    "Tijela koja izdaju licence": {
      implemented: true,
      summary: "Svaka licenca ima informaciju o tijelu koje ju je izdalo (npr. Hrvatski zavod za norme).",
      details: `## Kako funkcionira:

Svaka profesionalna licenca je izdana od strane određenog tijela koje je nadležno za tu vrstu licence.

**Tijela koja izdaju licence:**
- **Hrvatski zavod za norme** - za elektrotehničke, građevinske i druge licence
- **Hrvatski centar za ratifikaciju** - za posebne licence
- **Ministarstvo** - za određene vrste licenci
- **Regionalni uredi** - za lokalne licence
- **Profesionalne udruge** - za članstva i certifikate

**Kako se koristi:**
- Kada uploadujete licencu, navedete tijelo koje ju je izdalo
- To dokazuje autentičnost i valjanost vaše licence
- Korisnici mogu vidjeti izdavatelja vaše licence

**Zašto je važno:**
- Dokazuje valjanost licence
- Osigurava da je licenca izdana od strane nadležnog tijela
- Povećava povjerenje u vašu kvalifikaciju

**Verifikacija:**
- Admin provjerava da je tijelo koje je izdalo licencu stvarno nadležno
- To osigurava da su licence valjane i priznate
- Spriječava zloupotrebu lažnih dokumenata

Tijela koja izdaju licence osiguravaju da su sve licence valjane i priznate!
`
    },
    "Filtriranje poslova po kategorijama": {
      implemented: true,
      summary: "Filtrirate poslove prema kategorijama kako biste vidjeli samo relevantne poslove.",
      details: `## Kako funkcionira:

Filtriranje poslova po kategorijama omogućava vam da vidite samo poslove u kategorijama koje vas zanimaju.

**Kako filtrirati:**
- Odaberete jednu ili više kategorija iz popisa
- Platforma prikazuje samo poslove u odabranim kategorijama
- Možete kombinirati kategorije za preciznije rezultate

**Prednosti:**
- Ne vidite poslove koji vas ne zanimaju
- Fokus na relevantne poslove
- Brže pronalaženje onoga što tražite

**Za korisnike:**
- Vidite samo poslove u kategorijama koje vas zanimaju
- Lakše pregledavanje relevantnih poslova
- Ušteda vremena

**Za pružatelje:**
- Fokus na poslove u vašim kategorijama
- Brže pronalaženje poslova na koje možete ponuditi uslugu
- Veća efikasnost u traženju poslova

Filtriranje po kategorijama vam štedi vrijeme i fokusira vas na relevantne poslove!
`
    },
    "Postavljanje budžeta (min-max)": {
      implemented: true,
      summary: "Navedite minimalni i maksimalni budžet za vaš posao kako bi pružatelji znali vaše cjenovne očekivanja.",
      details: `## Kako funkcionira:

Prilikom objavljivanja posla, navedite raspon budžeta - minimalnu i maksimalnu cijenu koju ste spremni platiti.

**Kako postaviti budžet:**
- Unesite minimalnu cijenu (npr. 5000 kn)
- Unesite maksimalnu cijenu (npr. 10000 kn)
- Budžet je opcionalan, ali preporučuje se jer privlači bolje ponude

**Zašto je važno:**
- Pružatelji znaju vaše cjenovne očekivanje
- Privlačite pružatelje koji mogu ponuditi u vašem rasponu
- Smanjujete broj neprikladnih ponuda
- Ubrzavate proces odabira

**Kako pružatelji vide:**
- Vidite budžet na kartici posla
- Pružatelji mogu filtrirati poslove prema budžetu
- Točnije ponude jer znaju vaš raspon

**Savjeti:**
- Budite realni - preniski budžeti mogu odbiti kvalitetne pružatelje
- Previsoki budžeti mogu privući nepotrebno skupe ponude
- Pregledajte prosječne cijene za slične poslove prije postavljanja budžeta

Postavljanje budžeta pomaže vam dobiti točnije i relevantnije ponude od pružatelja!
`
    },
    "Lokacija posla (grad)": {
      implemented: true,
      summary: "Navedite grad ili područje gdje se posao obavlja kako bi pružatelji znali lokaciju.",
      details: `## Kako funkcionira:

Prilikom objavljivanja posla, navedite lokaciju - grad ili područje gdje se posao treba obaviti.

**Kako odabrati lokaciju:**
- Odaberete grad iz popisa (npr. Zagreb, Split, Rijeka)
- Ili unesete naziv grada/općine
- Lokacija je obavezna za sve poslove

**Zašto je važno:**
- Pružatelji vide gdje se posao obavlja
- Filtriranje poslova prema lokaciji
- Pružatelji koji rade u tom području mogu brže odgovoriti
- Planiranje putovanja i troškova prije ponude

**Kako pružatelji koriste:**
- Filtrirate poslove prema lokaciji
- Vidite samo poslove u vašem području rada
- Planirate rutu i pristup poslu

**Za korisnike:**
- Privlačite lokalne pružatelje
- Brže pronalaženje pružatelja u vašem području
- Manji troškovi putovanja za pružatelje = niže cijene

Lokacija posla je ključna informacija koja pomaže uparivanju korisnika i pružatelja!
`
    },
    "Geolokacija (latitude/longitude)": {
      implemented: true,
      summary: "Precizna geolokacija posla omogućava točno određivanje pozicije i proračun udaljenosti.",
      details: `## Kako funkcionira:

Platforma koristi geolokaciju (širina i dužina) za precizno određivanje pozicije posla na karti.

**Što je geolokacija:**
- Točne koordinate pozicije (latitude i longitude)
- Omogućava prikaz posla na karti
- Omogućava proračun udaljenosti između korisnika i pružatelja

**Kako funkcionira:**
- Kada unesete adresu ili grad, platforma automatski određuje koordinate
- Možete i ručno označiti lokaciju na karti
- Sve poslove možete vidjeti na karti

**Zašto je korisno:**
- Pružatelji vide točnu lokaciju posla na karti
- Mogu proračunati udaljenost od svoje lokacije
- Planiranje puta i vremena potrebnog za dolazak
- Filtriranje poslova po udaljenosti

**Prikaz na karti:**
- Svi poslovi su vidljivi na interaktivnoj karti
- Možete zumirati i pregledavati poslove na karti
- Klikom na marker vidite detalje posla

**Za pružatelje:**
- Vidite udaljenost od svoje lokacije do posla
- Sortirate poslove po udaljenosti
- Planirate najefikasnije rute

Geolokacija čini pronalaženje i uparivanje poslova preciznijim i efikasnijim!
`
    },
    "Slike posla": {
      implemented: true,
      summary: "Uploadajte slike situacije koju treba riješiti kako bi pružatelji bolje razumjeli vaš posao.",
      details: `## Kako funkcionira:

Prilikom objavljivanja posla, možete priložiti slike koje prikazuju situaciju koju treba riješiti ili rad koji želite.

**Kako dodati slike:**
- Kliknite na "Dodaj slike" ili povucite slike u područje
- Odaberete slike s računala ili mobitela
- Možete dodati više slika (obično do 10 slika)
- Slike se automatski uploadaju i prikazuju

**Što slike prikazuju:**
- Trenutno stanje situacije (npr. oštećen zid)
- Detalje koje treba popraviti ili izmijeniti
- Primjere ili reference kako bi trebalo izgledati
- Kontekst i okolinu gdje se posao obavlja

**Zašto je važno:**
- Slika vrijedi tisuću riječi - bolje objašnjenje nego samo tekst
- Pružatelji bolje razumijevaju što treba napraviti
- Preciznije ponude jer pružatelji znaju situaciju
- Manje pitanja i brži proces

**Kako pružatelji vide:**
- Slike se prikazuju na kartici posla
- Mogu pregledati sve slike u većem formatu
- Slike pomažu u procjeni složenosti i vremena potrebnog za posao

**Savjeti:**
- Snimite dobre slike u dobroj svjetlosti
- Uključite više kutova ako je moguće
- Označite problematična područja ako je moguće

Slike posla značajno poboljšavaju komunikaciju i kvalitetu ponuda!
`
    },
    "Status posla (OTVOREN, U TIJEKU, ZAVRŠEN, OTKAZAN)": {
      implemented: true,
      summary: "Svaki posao ima status koji pokazuje u kojoj je fazi - otvoren, u tijeku, završen ili otkazan.",
      details: `## Kako funkcionira:

Svaki posao na platformi ima status koji pokazuje trenutno stanje posla i kako napreduje.

**Statusi poslova:**
- **OTVOREN** - Posao je objavljen i traži se pružatelj usluga
- **U TIJEKU** - Pružatelj je odabran i posao se trenutno izvršava
- **ZAVRŠEN** - Posao je uspješno završen i moguće je ocjenjivanje
- **OTKAZAN** - Posao je otkazan (od strane korisnika ili pružatelja)

**Kako se mijenja status:**
- Status se automatski mijenja kada prihvatite ponudu (OTVOREN → U TIJEKU)
- Vi ili pružatelj možete ručno označiti posao kao ZAVRŠEN
- Vi ili pružatelj možete otkazati posao (status → OTKAZAN)

**Za korisnike:**
- Vidite status svih svojih poslova
- Pratite napredak posla u stvarnom vremenu
- Znate kada možete ocijeniti pružatelja (nakon ZAVRŠEN)

**Za pružatelje:**
- Vidite status poslova na koje ste poslali ponude
- Znate kada je posao aktivan i kada možete raditi
- Jasna komunikacija o tome što se događa s poslom

Status posla osigurava transparentnost i jasnu komunikaciju o napretku posla!
`
    },
    "Hitnost posla (NORMALNA, HITNA)": {
      implemented: true,
      summary: "Označite posao kao hitan ako vam treba brzo rješenje, ili normalan za standardni tempo.",
      details: `## Kako funkcionira:

Prilikom objavljivanja posla, možete označiti koliko je posao hitan - to pomaže pružateljima razumjeti vašu situaciju.

**Tipovi hitnosti:**
- **NORMALNA** - Standardni tempo, nema posebnog žurba
- **HITNA** - Trebate brzo rješenje, hitan posao koji treba biti obavljen što prije

**Kako se koristi:**
- Odaberete hitnost pri objavljivanju posla
- Pružatelji vide hitnost na kartici posla
- Hitni poslovi mogu imati prioritet u prikazivanju

**Zašto je važno:**
- Pružatelji znaju vašu situaciju i mogu planirati
- Hitni poslovi privlače pružatelje koji mogu brzo odgovoriti
- Realna očekivanja o vremenu izvršenja

**Za korisnike:**
- Jasno komuniciramo koliko vam je posao hitan
- Privlačite pružatelje koji mogu brzo raditi
- Postavljate očekivanja o vremenu

**Za pružatelje:**
- Vidite koje poslove možete obaviti brzo
- Planirate radni raspored prema hitnosti
- Odlučujete možete li prihvatiti hitan posao

Hitnost posla pomaže u boljem uparivanju i postavljanju realnih očekivanja!
`
    },
    "Veličina posla (MALA, SREDNJA, VELIKA)": {
      implemented: true,
      summary: "Kategorizirajte posao prema veličini kako bi pružatelji znali obim rada.",
      details: `## Kako funkcionira:

Prilikom objavljivanja posla, možete označiti veličinu posla - to pomaže pružateljima razumjeti obim rada.

**Kategorije veličine:**
- **MALA** - Mali posao, brzo se obavi (npr. zamjena prekidača, popravak cijevi)
- **SREDNJA** - Srednje kompleksan posao (npr. renovacija kupaonice, instalacija grijanja)
- **VELIKA** - Veliki projekt, traje dulje (npr. kompleksna renovacija, nova instalacija)

**Kako se koristi:**
- Odaberete veličinu pri objavljivanju posla
- Pružatelji vide veličinu na kartici posla
- Veličina pomaže u procjeni vremena i cijene

**Zašto je važno:**
- Pružatelji mogu bolje procjeniti vrijeme i resurse potrebne
- Realnije ponude jer znaju obim rada
- Bolje planiranje radnog rasporeda

**Za korisnike:**
- Jasno komuniciramo obim posla
- Privlačite prave pružatelje za svoj posao
- Realnija očekivanja o vremenu i cijeni

**Za pružatelje:**
- Vidite obim rada prije nego što pošaljete ponudu
- Planirate radni raspored prema veličini poslova
- Odlučujete možete li se uklopiti u raspored

Veličina posla olakšava komunikaciju i postavljanje realnih očekivanja!
`
    },
    "Rok izvršenja": {
      implemented: true,
      summary: "Navedite željeni rok za završetak posla kako bi pružatelji znali vaše vremenske zahtjeve.",
      details: `## Kako funkcionira:

Prilikom objavljivanja posla, možete navesti željeni rok izvršenja - datum do kojeg želite da posao bude završen.

**Kako postaviti rok:**
- Unesete datum do kojeg želite da posao bude završen
- Rok je opcionalan, ali preporučuje se jer pomaže u planiranju
- Možete odabrati konkretan datum ili opći okvir (npr. "u narednih tjedan dana")

**Zašto je važno:**
- Pružatelji znaju vaše vremenske zahtjeve
- Privlačite pružatelje koji mogu uklopiti posao u svoj raspored
- Jasna komunikacija o očekivanjima
- Izbjegavanje nesporazuma oko vremena

**Za korisnike:**
- Komunicirate svoje vremenske potrebe
- Privlačite pružatelje koji mogu zadovoljiti rok
- Postavljate jasna očekivanja

**Za pružatelje:**
- Vidite vremenske zahtjeve prije nego što pošaljete ponudu
- Planirate može li se posao uklopiti u raspored
- Odlučujete možete li zadovoljiti rok

**Pregovaranje o roku:**
- Možete pregovarati s pružateljem o roku
- Pružatelj može predložiti alternativni rok u ponudi
- Dogovorite se na rok koji odgovara obje strane

Rok izvršenja pomaže u planiranju i postavljanju realnih očekivanja!
`
    },
    "Filtriranje po kategoriji, lokaciji, budžetu": {
      implemented: true,
      summary: "Kombinirajte više filtera kako biste pronašli točno ono što tražite - po kategoriji, lokaciji i budžetu.",
      details: `## Kako funkcionira:

Napredno filtriranje omogućava vam da kombinirate više filtera za precizno pronalaženje poslova ili pružatelja.

**Filteri:**
- **Po kategoriji** - Filtrirate samo poslove/pružatelje u odabranoj kategoriji
- **Po lokaciji** - Filtrirate samo poslove/pružatelje u određenom gradu ili području
- **Po budžetu** - Filtrirate poslove prema vašem budžetnom rasponu

**Kako kombinirati filtere:**
- Odaberete kategoriju (npr. "Elektrotehnika")
- Odaberete lokaciju (npr. "Zagreb")
- Postavite raspon budžeta (npr. 5000-10000 kn)
- Platforma prikazuje samo rezultate koji zadovoljavaju sve kriterije

**Prednosti:**
- Preciznije rezultate - vidite samo ono što vas zanimaju
- Ušteda vremena - ne morate pregledavati sve opcije
- Brže pronalaženje idealnog posla ili pružatelja

**Za korisnike:**
- Pronalazite pružatelje koji odgovaraju svim vašim kriterijima
- Fokus na relevantne opcije
- Brže donošenje odluka

**Za pružatelje:**
- Pronalazite poslove koji odgovaraju vašim kategorijama, lokaciji i cjenovnom rasponu
- Veća efikasnost u traženju poslova
- Fokus na relevantne prilike

Filtriranje po kategoriji, lokaciji i budžetu čini pronalaženje točno onoga što tražite jednostavnijim!
`
    },
    "Pregled detalja posla": {
      implemented: true,
      summary: "Vidite sve detalje o poslu - opis, slike, budžet, lokaciju, ponude i više.",
      details: `## Kako funkcionira:

Klikom na posao otvara se stranica s detaljima gdje možete vidjeti sve informacije o poslu.

**Što možete vidjeti:**
- **Naslov i opis posla** - Detaljan opis što treba napraviti
- **Slike** - Sve slike koje je korisnik priložio
- **Kategorija** - Kategorija usluge
- **Lokacija** - Grad i geolokacija na karti
- **Budžet** - Minimalna i maksimalna cijena
- **Hitnost** - Je li posao hitan ili normalan
- **Veličina** - Je li posao mala, srednja ili velika
- **Rok izvršenja** - Željeni datum završetka
- **Status** - Trenutno stanje posla (otvoren, u tijeku, završen)
- **Ponude** - Sve ponude koje su pružatelji poslali za ovaj posao
- **Informacije o korisniku** - Tko je objavio posao

**Za korisnike:**
- Vidite sve detalje svog posla na jednom mjestu
- Pregledavate ponude koje su primljene
- Uređujete detalje posla ako je potrebno

**Za pružatelje:**
- Vidite sve informacije potrebne za ponudu
- Procjenjujete složenost i vrijeme potrebno za posao
- Vidite postojeće ponude za usporedbu
- Slanje ponude direktno s stranice detalja

**Dodatne opcije:**
- Chat s korisnikom/pružateljem direktno s stranice
- Prihvaćanje ili odbijanje ponuda
- Ažuriranje statusa posla
- Ocjenjivanje nakon završetka

Pregled detalja posla omogućava vam potpunu sliku o poslu i donošenje informirane odluke!
`
    },
    "Iznos ponude": {
      implemented: true,
      summary: "Unesite iznos vaše ponude - cijenu koju tražite za obavljanje posla.",
      details: `## Kako funkcionira:

Kada šaljete ponudu za posao, unesete iznos - cijenu koju tražite za obavljanje posla.

**Kako unijeti iznos:**
- Unesete iznos u kunama (npr. 5000 kn)
- Iznos mora biti broj (bez valute, valuta se dodaje automatski)
- Iznos se prikazuje jasno u ponudi

**Savjeti za iznos:**
- Pregledajte budžet posla - vaš iznos bi trebao biti unutar raspona
- Uzmite u obzir složenost posla i vrijeme potrebno
- Budite konkurentni, ali ne podcijenite svoj rad
- Označite ponudu kao "pregovorno" ako je cijena fleksibilna

**Kako korisnici vide:**
- Iznos se prikazuje jasno na kartici ponude
- Korisnici mogu usporediti iznose različitih ponuda
- Iznos je vidljiv prije nego što prihvate ponudu

**Pregovaranje:**
- Možete označiti ponudu kao "pregovorno" ako ste spremni na kompromis
- Korisnik može predložiti alternativni iznos
- Možete pregovarati o konačnoj cijeni

Iznos ponude je vaš način da komuniciramo cjenovno očekivanje i privučete korisnika!
`
    },
    "Poruka uz ponudu": {
      implemented: true,
      summary: "Napišite poruku u kojoj objašnjavate svoj pristup poslu i zašto ste pravi izbor.",
      details: `## Kako funkcionira:

Uz iznos ponude, možete priložiti poruku u kojoj objašnjavate svoj pristup i argumentirate zašto ste pravi izbor.

**Što uključiti u poruku:**
- Vaš pristup poslu - kako planirate obaviti posao
- Vaša iskustva s sličnim poslovima
- Što sve uključuje vaša cijena
- Zašto ste pravi izbor za ovaj posao
- Posebne napomene ili pitanja

**Savjeti za dobru poruku:**
- Budite konkretni i profesionalni
- Pokažite da razumijete zahtjeve posla
- Navedite relevantna iskustva
- Budite iskreni o vremenu izvršenja
- Izbjegavajte generičke fraze

**Zašto je važno:**
- Poruka pokazuje profesionalnost i pažnju
- Korisnici češće prihvaćaju ponude s dobrim porukama
- Razlikuje vas od drugih pružatelja
- Gradi povjerenje prije nego što se dogovorite

**Kako korisnici vide:**
- Poruka se prikazuje uz iznos ponude
- Korisnici mogu pročitati poruku prije odabira
- Poruka je vidljiva u svim ponudama za posao

Poruka uz ponudu je vaša prilika da se istaknete i pokažete profesionalnost!
`
    },
    "Status ponude (NA ČEKANJU, PRIHVAĆENA, ODBIJENA)": {
      implemented: true,
      summary: "Pratite status svoje ponude - je li na čekanju, prihvaćena ili odbijena.",
      details: `## Kako funkcionira:

Svaka ponuda koju pošaljete ima status koji pokazuje kako korisnik reagira na vašu ponudu.

**Statusi ponuda:**
- **NA ČEKANJU** - Korisnik još nije odgovorio na vašu ponudu
- **PRIHVAĆENA** - Korisnik je prihvatio vašu ponudu - možete započeti rad
- **ODBIJENA** - Korisnik je odbio vašu ponudu

**Kako vidite status:**
- Status se prikazuje na kartici ponude u "Moje ponude"
- Status se automatski ažurira kada korisnik reagira
- Primite notifikaciju kada se status promijeni

**Što slijedi nakon prihvaćanja:**
- Korisnik i vi možete komunicirati preko chata
- Posao prelazi u status "U TIJEKU"
- Možete početi raditi na poslu
- Nakon završetka, možete ocijeniti jedan drugog

**Ako je ponuda odbijena:**
- Ne možete više poslati ponudu za taj posao
- Možete pregledati zašto je ponuda odbijena (ako je korisnik naveo razlog)
- Možete nastaviti s drugim poslovima

**Prednosti:**
- Jasna komunikacija o statusu ponude
- Ne morate čekati neizvjesno - znate je li ponuda prihvaćena
- Mogućnost praćenja svih vaših ponuda na jednom mjestu

Status ponude daje vam uvid u napredak vaših ponuda i omogućava planiranje!
`
    },
    "Mogućnost pregovaranja o cijeni": {
      implemented: true,
      summary: "Pregovarajte o cijeni s korisnikom ili pružateljem kako biste postigli dogovor.",
      details: `## Kako funkcionira:

Ako iznos ponude nije idealan, možete pregovarati o cijeni kako biste postigli dogovor koji odgovara obje strane.

**Kako pregovarati:**
- Označite ponudu kao "pregovorno" ako je cijena fleksibilna
- Možete poslati poruku s alternativnim iznosom
- Korisnik može predložiti kontraponudu
- Komunicirate dok ne postignete dogovor

**Za korisnike:**
- Možete predložiti alternativni iznos ako je ponuda previsoka
- Možete pregovarati o uvjetima i cijeni
- Dogovorite se na cijenu koja odgovara vama

**Za pružatelje:**
- Možete prilagoditi cijenu ako je potrebno
- Možete pregovarati o uvjetima rada
- Dogovorite se na cijenu koja je fer za obje strane

**Pregovaranje kroz chat:**
- Komunicirate preko chata za detaljno pregovaranje
- Možete slati slike ili dokumente ako su relevantni
- Možete postavljati pitanja kako biste razumjeli potrebe

**Prednosti:**
- Fleksibilnost u postizanju dogovora
- Obe strane su zadovoljne konačnom cijenom
- Osobna komunikacija gradi povjerenje

Mogućnost pregovaranja omogućava vam postizanje dogovora koji odgovara svima!
`
    },
    "Označavanje ponuda kao pregovorno": {
      implemented: true,
      summary: "Označite svoju ponudu kao pregovornu ako ste spremni na fleksibilnost u cijeni.",
      details: `## Kako funkcionira:

Kada šaljete ponudu, možete je označiti kao "pregovorno" - to znači da ste spremni pregovarati o cijeni s korisnikom.

**Što znači pregovorno:**
- Vaša cijena nije fiksna - spremni ste na kompromis
- Otvoreni ste za razgovor o cijeni s korisnikom
- Možete prilagoditi iznos ovisno o detaljima

**Zašto označiti ponudu kao pregovornu:**
- Privlačite korisnike koji traže fleksibilnost
- Pokažete da ste spremni na kompromis
- Više prilika za dogovor

**Kako korisnici vide:**
- Pregovorna ponuda ima oznaku "pregovorno"
- Korisnici znaju da mogu predložiti alternativnu cijenu
- Više vjerojatnost da će korisnik odgovoriti

Označavanje ponude kao pregovorne daje vam više fleksibilnosti u postizanju dogovora!
`
    },
    "Procijenjeni broj dana za izvršenje": {
      implemented: true,
      summary: "Navedite koliko dana vam je potrebno da završite posao - to pomaže korisnicima planirati.",
      details: `## Kako funkcionira:

Prilikom slanja ponude, možete navesti procijenjeni broj dana koliko vam je potrebno da završite posao.

**Kako procijeniti vrijeme:**
- Razmislite o složenosti posla
- Uzmite u obzir svoja iskustva s sličnim poslovima
- Ostavite rezervu za neočekivane probleme
- Razmotrite dostupnost materijala i pristup lokaciji

**Zašto je važno:**
- Korisnici znaju kada možete završiti posao
- Postavljate realna očekivanja o vremenu
- Pomaže korisnicima planirati
- Izbjegavanje nesporazuma oko vremena

**Kako korisnici vide:**
- Procijenjeno vrijeme se prikazuje uz ponudu
- Korisnici mogu usporediti vrijeme različitih ponuda
- Točnije planiranje kada će posao biti završen

**Savjeti:**
- Budite realni - ne obećavajte nešto što ne možete ispuniti
- Uzmite u obzir kompleksnije situacije
- Komunicirajte ako vrijeme treba prilagoditi

Procijenjeni broj dana pomaže korisnicima planirati i postavlja realna očekivanja!
`
    },
    "Pregled svih ponuda za posao": {
      implemented: true,
      summary: "Kao korisnik, vidite sve ponude koje su pružatelji poslali za vaš posao na jednom mjestu.",
      details: `## Kako funkcionira:

Kao korisnik, kada pružatelji pošalju ponude za vaš posao, vidite sve ponude na jednoj stranici za laku usporedbu.

**Što vidite:**
- Sve ponude koje su pružatelji poslali za vaš posao
- Iznos svake ponude
- Poruku koju je pružatelj priložio
- Procijenjeno vrijeme izvršenja
- Informacije o pružatelju (ocjena, broj recenzija, verifikacije)
- Status ponude (pregovorno ili ne)

**Kako usporediti:**
- Vidite sve ponude odjednom
- Uspoređujete cijene, vrijeme i pristup
- Pregledavate profile pružatelja prije odabira
- Sortirate ponude po cijeni, vremenu ili ocjeni pružatelja

**Odabir ponude:**
- Kliknete na ponudu da vidite detalje pružatelja
- Možete prihvatiti ponudu direktno
- Možete i odgovoriti pružatelju preko chata prije odabira
- Možete pregovarati o cijeni ako je ponuda pregovorna

**Zašto je korisno:**
- Laka usporedba svih opcija
- Informirana odluka o tome koga odabrati
- Mogućnost pronalaska najbolje kombinacije cijene i kvalitete

Pregled svih ponuda omogućava vam informirano donošenje odluke o odabiru pružatelja!
`
    },
    "Prihvaćanje/odbijanje ponuda": {
      implemented: true,
      summary: "Prihvatite ponudu koja vam odgovara ili odbijte one koje ne odgovaraju.",
      details: `## Kako funkcionira:

Kada pružatelji pošalju ponude za vaš posao, možete ih prihvatiti ili odbiti.

**Prihvaćanje ponude:**
- Kliknete "Prihvati" na ponudi koja vam odgovara
- Posao prelazi u status "U TIJEKU"
- Pružatelj i vi možete komunicirati preko chata
- Možete početi planirati izvršenje posla

**Odbijanje ponude:**
- Kliknete "Odbij" na ponudi koja vam ne odgovara
- Možete opcionalno navesti razlog (npr. "previsoka cijena")
- Pružatelj dobiva obavijest da je ponuda odbijena
- Možete prihvatiti neku drugu ponudu

**Nakon prihvaćanja:**
- Posao više nije dostupan drugim pružateljima
- Možete komunicirati s pružateljem o detaljima
- Pružatelj može početi raditi na poslu
- Nakon završetka, možete ocijeniti pružatelja

**Zašto je važno:**
- Kontrolirate tko radi na vašem poslu
- Brzo odlučujete o ponudama koje vam odgovaraju
- Jasna komunikacija o statusu ponuda

Prihvaćanje ili odbijanje ponuda daje vam kontrolu nad odabiron pružatelja za vaš posao!
`
    },
    "Komentiranje iskustva s pružateljem": {
      implemented: true,
      summary: "Napišite komentar o svom iskustvu s pružateljem - što vam se svidjelo i što bi se moglo poboljšati.",
      details: `## Kako funkcionira:

Nakon završenog posla, možete napisati komentar o svom iskustvu s pružateljem uz ocjenu.

**Što uključiti u komentar:**
- Što vam se svidjelo u radu s pružateljem
- Kako je posao izveden - je li točno kako ste željeli
- Komunikacija - je li bila dobra i profesionalna
- Preporuke za poboljšanja ako postoje
- Vaša preporuka drugim korisnicima

**Kako napisati dobar komentar:**
- Budite specifični - napišite konkretne primjere
- Budite konstruktivni - fokus na činjenice
- Budite iskreni ali pristojni
- Pokažite što vam je bilo dobro
- Ako ima problema, napišite ih na pristojan način

**Kako pružatelji vide:**
- Komentar se prikazuje uz vašu ocjenu na profilu pružatelja
- Pružatelji mogu odgovoriti na komentare
- Komentar pomaže pružateljima razumjeti kako poboljšati uslugu

**Zašto je važno:**
- Pomaže drugim korisnicima odabrati kvalitetnog pružatelja
- Pružatelji dobivaju povratne informacije kako poboljšati
- Gradi povjerenje u platformu
- Potiče kvalitetu usluga

Komentiranje iskustva pomaže svima - i korisnicima i pružateljima!
`
    },
    "Bilateralno ocjenjivanje (korisnik ↔ pružatelj)": {
      implemented: true,
      summary: "I vi možete ocijeniti pružatelja, i pružatelj može ocijeniti vas - fer i objektivno ocjenjivanje.",
      details: `## Kako funkcionira:

Sustav bilateralnog ocjenjivanja znači da i vi možete ocijeniti pružatelja, i pružatelj može ocijeniti vas nakon završenog posla.

**Kako funkcionira:**
- Nakon završenog posla, i vi i pružatelj možete napisati ocjenu
- Ocjenjujete jedan drugog neovisno
- Ocjene se prikazuju na oba profila
- Obe strane vide što drugi misli o iskustvu

**Zašto je fer:**
- Obe strane mogu izraziti mišljenje
- Nema jednostranog ocjenjivanja
- Bolja slika o obje strane transakcije
- Potiče profesionalnost s obje strane

**Za korisnike:**
- Možete vidjeti kako vas pružatelji ocjenjuju
- Možete poboljšati svoj pristup ako dobijete lošu ocjenu
- Gradi vašu reputaciju kao dobrog klijenta

**Za pružatelje:**
- Možete vidjeti kako vas korisnici ocjenjuju
- Možete poboljšati svoju uslugu na temelju povratnih informacija
- Gradi vašu reputaciju kao kvalitetnog pružatelja

**Prednosti:**
- Fer sustav ocjenjivanja
- Obje strane dobivaju povratne informacije
- Potiče profesionalnost i kvalitetu
- Transparentnost u ocjenjivanju

Bilateralno ocjenjivanje osigurava fer i objektivan sustav ocjenjivanja za sve!
`
    },
    "Sprečavanje duplikata recenzija": {
      implemented: true,
      summary: "Sustav osigurava da možete ocjeniti svaki posao samo jednom - sprečava zloupotrebe.",
      details: `## Kako funkcionira:

Sustav osigurava da možete napisati recenziju za svaki posao samo jednom - to sprečava zloupotrebe i osigurava fer ocjenjivanje.

**Kako funkcionira:**
- Nakon završenog posla, možete napisati recenziju samo jednom
- Ako već imate recenziju za posao, ne možete napisati novu
- Možete urediti postojeću recenziju ako želite promijeniti ocjenu ili komentar

**Zašto je važno:**
- Sprečava spam ili višestruko ocjenjivanje
- Osigurava da svaki posao ima jednu recenziju po korisniku
- Fer sustav ocjenjivanja
- Pouzdanost ocjena i komentara

**Uređivanje recenzija:**
- Možete urediti svoju recenziju ako se vaša mišljenja promijene
- Možete promijeniti ocjenu ili ažurirati komentar
- Sve promjene su vidljive (može biti označeno kao "uređeno")

**Brisanje recenzija:**
- Možete obrisati svoju recenziju ako smatrate da više nije relevantna
- Obrisana recenzija više nije vidljiva
- Ne možete napisati novu recenziju nakon brisanja

Sprečavanje duplikata osigurava fer i pouzdan sustav ocjenjivanja!
`
    },
    "Uređivanje postojećih recenzija": {
      implemented: true,
      summary: "Možete urediti svoju recenziju ako se vaša mišljenja promijene ili želite ažurirati komentar.",
      details: `## Kako funkcionira:

Nakon što napišete recenziju, možete je urediti ako želite promijeniti ocjenu ili ažurirati komentar.

**Kako urediti recenziju:**
- Pronađite svoju recenziju na profilu pružatelja
- Kliknite "Uredi" na vašoj recenziji
- Promijenite ocjenu, komentar ili oboje
- Spremite promjene

**Kada urediti:**
- Ako se vaša mišljenja promijene s vremenom
- Ako želite dodati dodatne informacije
- Ako želite ažurirati komentar na temelju novih razmišljanja

**Kako drugi vide:**
- Uređena recenzija može imati oznaku "uređeno"
- Svi vide najnoviju verziju recenzije
- Mogu vidjeti kada je recenzija zadnji put ažurirana

**Zašto je korisno:**
- Mogućnost ažuriranja ako se vaša mišljenja promijene
- Možete dodati dodatne informacije koje su postale relevantne
- Fleksibilnost u održavanju recenzije aktualnom

Uređivanje recenzija omogućava vam održavanje vaših komentara aktualnim i točnim!
`
    },
    "Brisanje recenzija": {
      implemented: true,
      summary: "Možete obrisati svoju recenziju ako smatrate da više nije relevantna ili želite je ukloniti.",
      details: `## Kako funkcionira:

Ako želite ukloniti svoju recenziju, možete je obrisati s profila pružatelja.

**Kako obrisati recenziju:**
- Pronađite svoju recenziju na profilu pružatelja
- Kliknite "Obriši" na vašoj recenziji
- Potvrdite brisanje
- Recenzija se uklanja i više nije vidljiva

**Kada obrisati:**
- Ako smatrate da recenzija više nije relevantna
- Ako ste se predomislili o recenziji
- Ako je došlo do nesporazuma koji je sada razriješen

**Što se događa nakon brisanja:**
- Recenzija se uklanja s profila pružatelja
- Ocjena se uklanja iz prosječne ocjene (ako je to jedina recenzija)
- Ne možete napisati novu recenziju za isti posao

**Zašto je korisno:**
- Kontrola nad svojim komentarima
- Mogućnost uklanjanja ako ste se predomislili
- Održavanje relevantnosti recenzija

Brisanje recenzija daje vam kontrolu nad svojim komentarima i ocjenama!
`
    },
    "Automatsko izračunavanje prosječne ocjene": {
      implemented: true,
      summary: "Platforma automatski izračunava prosječnu ocjenu pružatelja na temelju svih recenzija.",
      details: `## Kako funkcionira:

Platforma automatski izračunava prosječnu ocjenu pružatelja na temelju svih recenzija koje je primio.

**Kako se izračunava:**
- Sve ocjene (od 1 do 5 zvjezdica) se zbrajaju
- Suma se dijeli s brojem recenzija
- Rezultat je prosječna ocjena (npr. 4.5 zvjezdica)

**Kada se ažurira:**
- Automatski se ažurira kada se doda nova recenzija
- Automatski se ažurira kada se recenzija uredi
- Automatski se ažurira kada se recenzija obriše
- Nema potrebe za ručnim ažuriranjem

**Kako se koristi:**
- Prosječna ocjena se prikazuje na profilu pružatelja
- Korisnici vide prosječnu ocjenu prije odabira pružatelja
- Možete sortirati pružatelje prema prosječnoj ocjeni

**Zašto je važno:**
- Brza vizualna procjena kvalitete pružatelja
- Usporedba različitih pružatelja
- Osnova za odluku o odabiru

Automatsko izračunavanje osigurava da uvijek vidite ažurnu prosječnu ocjenu!
`
    },
    "Brojanje ukupnog broja recenzija": {
      implemented: true,
      summary: "Vidite koliko ukupno recenzija pružatelj ima - više recenzija znači više iskustva.",
      details: `## Kako funkcionira:

Platforma prikazuje ukupan broj recenzija koje je pružatelj primio, što pokazuje koliko je poslova obavio.

**Što pokazuje broj recenzija:**
- Ukupan broj završenih poslova koje je pružatelj obavio
- Količina iskustva na platformi
- Pouzdanost i aktivnost pružatelja

**Kako se prikazuje:**
- Broj recenzija se prikazuje uz prosječnu ocjenu
- Primjerice: "4.5 ⭐ (23 recenzije)"
- Vidljivo na profilu pružatelja i na kartici

**Zašto je važno:**
- Više recenzija znači više iskustva
- Pouzdaniji pokazatelj kvalitete od jedne ocjene
- Pokazuje aktivnost pružatelja na platformi

**Kako koristiti:**
- Pružatelji s više recenzija obično imaju više iskustva
- Kombinirajte s prosječnom ocjenom za kompletnu sliku
- Više recenzija s visokom ocjenom = pouzdan pružatelj

Brojanje recenzija pomaže vam razumjeti iskustvo i pouzdanost pružatelja!
`
    },
    "Prikaz recenzija na profilu pružatelja": {
      implemented: true,
      summary: "Sve recenzije koje je pružatelj primio prikazuju se na njegovom profilu za javni pregled.",
      details: `## Kako funkcionira:

Sve recenzije koje je pružatelj primio prikazuju se na njegovom javnom profilu tako da svi mogu vidjeti što drugi korisnici misle.

**Što vidite:**
- Sve recenzije koje je pružatelj primio
- Ocjene (1-5 zvjezdica)
- Komentare korisnika
- Datum kada je recenzija napisana
- Informacije o korisniku koji je napisao recenziju

**Kako pregledavati:**
- Recenzije su prikazane kronološki (najnovije najprije)
- Možete sortirati po ocjeni (najbolje najprije ili najgore najprije)
- Možete filtrirati recenzije prema ocjeni
- Možete vidjeti detalje svake recenzije

**Za korisnike:**
- Vidite što drugi korisnici misle o pružatelju
- Čitate konkretna iskustva s poslovima
- Donosite informiranu odluku o odabiru pružatelja

**Za pružatelje:**
- Vidite što korisnici misle o vašem radu
- Poboljšavate svoju uslugu na temelju povratnih informacija
- Gradite svoju reputaciju kroz kvalitetan rad

**Prednosti:**
- Transparentnost u ocjenjivanju
- Pouzdanost informacija za korisnike
- Motivacija za pružatelje da pružaju kvalitetne usluge

Prikaz recenzija osigurava transparentnost i gradi povjerenje u platformu!
`
    },
    "Detaljni profil pružatelja": {
      implemented: true,
      summary: "Sveobuhvatan profil pružatelja s informacijama o iskustvu, licencama, portfolio-u i recenzijama.",
      details: `## Kako funkcionira:

Detaljni profil pružatelja je vaša javna stranica gdje korisnici mogu vidjeti sve informacije o vama i vašim uslugama.

**Što profil sadrži:**
- **Biografija** - Vaša kratka biografija i uvod
- **Specijalizacije** - Područja u kojima ste najbolji
- **Godine iskustva** - Koliko dugo radite u tom području
- **Licence i certifikati** - Sve vaše licence koje dokazuju kvalifikaciju
- **Portfolio** - Slike vaših završenih projekata
- **Recenzije** - Sve recenzije koje ste primili
- **Prosječna ocjena** - Vaša ukupna prosječna ocjena
- **Kategorije** - U kojim kategorijama radite
- **Lokacije** - Gdje radite (gradovi/područja)
- **Verifikacije** - Email, Phone, DNS, Business badge

**Za korisnike:**
- Vidite sve informacije o pružatelju na jednom mjestu
- Procjenjujete kvalitetu i profesionalnost
- Donosite informiranu odluku o odabiru

**Za pružatelje:**
- Privlačite korisnike s profesionalnim profilom
- Gradite svoju reputaciju
- Dokazujete svoju kvalifikaciju i iskustvo

**Prednosti:**
- Sve informacije na jednom mjestu
- Lako pronalaženje relevantnih podataka
- Profesionalan pristup

Detaljni profil je vaša virtuelna poslovna kartica koja privlači klijente!
`
    },
    "Biografija pružatelja": {
      implemented: true,
      summary: "Napišite kratku biografiju koja predstavlja vas, vaše iskustvo i pristup poslu.",
      details: `## Kako funkcionira:

Biografija je kratki tekst na vašem profilu koji predstavlja vas i vaše usluge korisnicima.

**Što uključiti u biografiju:**
- Tko ste i što radite
- Vaše godine iskustva i obrazovanje
- Vaš pristup poslu i filozofija rada
- Što vas čini posebnim
- Zašto ste pravi izbor za korisnike

**Savjeti za dobru biografiju:**
- Budite konkretni i profesionalni
- Navedite relevantna iskustva
- Pokažite entuzijazam za svoj posao
- Budite iskreni i pristojni
- Napišite kratko i jasno (ne previše dugačko)

**Kako korisnici vide:**
- Biografija se prikazuje na vrhu vašeg profila
- Prva stvar koju korisnici vide o vama
- Pomaže korisnicima razumjeti tko ste

**Zašto je važno:**
- Prvo dojam - biografija je prva stvar koju korisnici vide
- Privlači korisnike ako je dobro napisana
- Razlikuje vas od drugih pružatelja
- Gradi povjerenje u vašu profesionalnost

Biografija je vaša prilika da se predstavite i privučete prave klijente!
`
    },
    "Specijalizacije": {
      implemented: true,
      summary: "Navedite svoja specijalizirana područja - gdje ste najbolji i što najviše volite raditi.",
      details: `## Kako funkcionira:

Specijalizacije su područja u kojima ste najbolji i što najviše volite raditi - to pomaže korisnicima razumjeti vaše najjače strane.

**Što su specijalizacije:**
- Konkretna područja ili vrste poslova u kojima ste eksperti
- Primjerice: "Klima uređaji", "Keramičarski radovi", "Električne instalacije"
- Područja gdje imate najviše iskustva

**Kako dodati specijalizacije:**
- Odaberete iz popisa ili unesete vlastite
- Možete dodati više specijalizacija
- Svaka specijalizacija opisuje jedno područje ekspertize

**Zašto je važno:**
- Korisnici znaju u čemu ste najbolji
- Privlačite poslove koji odgovaraju vašim specijalizacijama
- Razlikujete se od drugih pružatelja
- Realnija očekivanja od korisnika

**Kako korisnici koriste:**
- Traže pružatelje prema specijalizacijama
- Vidite koje specijalizacije pružatelj ima prije odabira
- Bolje uparivanje poslova s pravim stručnjacima

Specijalizacije pokazuju vaše najjače strane i privlače prave klijente!
`
    },
    "Godine iskustva": {
      implemented: true,
      summary: "Navedite koliko godina radite u svojoj djelatnosti - to pokazuje vaše iskustvo.",
      details: `## Kako funkcionira:

Godine iskustva pokazuju koliko dugo radite u svojoj djelatnosti i koliko iskustva imate.

**Kako navesti iskustvo:**
- Unesete broj godina koliko radite u toj djelatnosti
- Možete navesti opće iskustvo ili iskustvo u specifičnoj kategoriji
- Budite iskreni - korisnici cijene iskrenost

**Zašto je važno:**
- Korisnici vide koliko iskustva imate
- Više iskustva = veće povjerenje
- Razlikuje vas od manje iskusnih pružatelja
- Realna očekivanja od korisnika

**Kako korisnici koriste:**
- Vidite godine iskustva na profilu pružatelja
- Možete filtrirati pružatelje prema iskustvu
- Kombinirajte s ocjenom za kompletnu sliku

**Prednosti:**
- Dokaz vašeg iskustva
- Privlačite klijente koji cijene iskustvo
- Gradite povjerenje

Godine iskustva pokazuju vašu profesionalnost i privlače klijente koji cijene iskustvo!
`
    },
    "Web stranica": {
      implemented: true,
      summary: "Dodajte link na svoju web stranicu kako bi korisnici mogli vidjeti više o vašim uslugama.",
      details: `## Kako funkcionira:

Možete dodati link na svoju web stranicu na profil kako bi korisnici mogli vidjeti više informacija o vama i vašim uslugama.

**Kako dodati web stranicu:**
- Unesete URL vaše web stranice (npr. https://mojatvrtka.hr)
- Link se automatski provjerava da je valjan
- Link se prikazuje na vašem profilu kao klikabilan

**Zašto je korisno:**
- Korisnici mogu vidjeti više o vama i vašim uslugama
- Privlači korisnike koji žele više informacija
- Povećava profesionalnost vašeg profila
- Mogućnost prikaza portfolija na vlastitoj stranici

**Kako korisnici koriste:**
- Kliknu na link da odu na vašu web stranicu
- Vidite dodatne informacije o vašim uslugama
- Više povjerenje ako imate profesionalnu web stranicu

**Za pružatelje:**
- Direktna veza s vašom web stranicom
- Privlačite korisnike na vašu stranicu
- Povećanje prometa na vašu web stranicu

Web stranica dodaje profesionalnost vašem profilu i omogućava korisnicima da saznaju više o vama!
`
    },
    "Područje rada": {
      implemented: true,
      summary: "Navedite gradove ili područja u kojima radite - to pomaže korisnicima vidjeti pokrivate li njihovo područje.",
      details: `## Kako funkcionira:

Područje rada pokazuje u kojim gradovima ili područjima nudite svoje usluge - to pomaže korisnicima razumjeti možete li raditi na njihovoj lokaciji.

**Kako definirati područje:**
- Odaberete gradove ili općine u kojima radite
- Možete odabrati više lokacija ako radite u više područja
- Možete specificirati određena područja unutar grada

**Zašto je važno:**
- Korisnici znaju pokrivate li njihovo područje
- Filtriranje pružatelja prema lokaciji
- Bolje uparivanje korisnika s pružateljima
- Realnija očekivanja o dostupnosti

**Kako korisnici koriste:**
- Vidite područje rada na profilu pružatelja
- Filtrirate pružatelje prema području rada
- Znate možete li kontaktirati pružatelja za svoj posao

**Za pružatelje:**
- Komunicirate gdje radite
- Privlačite korisnike u vašem području
- Smanjujete nepotrebne upite iz drugih područja

Područje rada pomaže korisnicima pronaći pružatelje u svojem području!
`
    },
    "Status dostupnosti": {
      implemented: true,
      summary: "Označite jesite li trenutno dostupni za nove poslove ili ste zauzeti.",
      details: `## Kako funkcionira:

Status dostupnosti pokazuje korisnicima jesite li trenutno dostupni za nove poslove ili ste zauzeti.

**Statusi dostupnosti:**
- **Dostupan** - Spremni ste prihvatiti nove poslove
- **Zauzet** - Trenutno radite na poslovima i niste dostupni
- **Neaktivan** - Privremeno ne radite na platformi

**Kako promijeniti status:**
- Kliknete na status na vašem profilu
- Odaberete novi status
- Status se automatski ažurira i korisnici ga vide

**Zašto je važno:**
- Korisnici znaju možete li prihvatiti novi posao
- Filtriranje samo dostupnih pružatelja
- Realna očekivanja o odgovoru
- Bolje planiranje za pružatelje

**Kako korisnici koriste:**
- Vidite status dostupnosti na profilu pružatelja
- Kontaktirate samo dostupne pružatelje
- Realnija očekivanja o odgovoru

**Za pružatelje:**
- Komunicirate svoju dostupnost
- Kontrolirate kada primate nove poslove
- Planirate radni raspored

Status dostupnosti osigurava da korisnici kontaktiraju samo dostupne pružatelje!
`
    },
    "Kategorije u kojima radi": {
      implemented: true,
      summary: "Odaberite kategorije usluga u kojima radite - to određuje koje poslove vidite.",
      details: `## Kako funkcionira:

Odabirom kategorija u kojima radite, određujete koje poslove vidite i u kojim područjima nudite usluge.

**Kako odabrati kategorije:**
- Odaberete kategorije iz popisa (npr. Elektrotehnika, Građevinarstvo)
- Možete odabrati više kategorija ako radite u više područja
- Kategorije se prikazuju na vašem profilu

**Što određuje:**
- Koje poslove vidite u pretraživanju
- Koje leadove primate (ako koristite EXCLUSIVE)
- U kojim kategorijama vas korisnici mogu naći
- Vaš fokus i stručnost

**Zašto je važno:**
- Fokus na poslove u vašim kategorijama
- Manje vremena na nevažne poslove
- Bolje uparivanje s poslovima koji odgovaraju
- Realnija očekivanja od korisnika

**Za korisnike:**
- Vidite u kojim kategorijama pružatelj radi
- Filtrirate pružatelje prema kategorijama
- Znate možete li kontaktirati pružatelja za svoj posao

Kategorije u kojima radite određuju vaš fokus i privlače prave klijente!
`
    },
    "Odabir kategorija za primanje leadova": {
      implemented: true,
      summary: "Odaberite u kojim kategorijama želite primati ekskluzivne leadove - to određuje koje leadove vidite.",
      details: `## Kako funkcionira:

Ako koristite EXCLUSIVE sustav, možete odabrati u kojim kategorijama želite primati ekskluzivne leadove.

**Kako odabrati kategorije:**
- Odaberete kategorije u kojima želite raditi s leadovima
- Možete odabrati više kategorija
- Kategorije određuju koje leadove vidite na tržištu

**Što određuje:**
- Koje leadove vidite na tržištu leadova
- Koje leadove primate u redu čekanja (ako koristite queue)
- Fokus na kategorije gdje imate najviše šansi za uspjeh

**Zašto je važno:**
- Fokus na leadove u vašim kategorijama
- Veća šansa za konverziju jer radite u svojim područjima
- Bolje ROI jer znate kategoriju
- Manje vremena na nevažne leadove

**Fleksibilnost:**
- Možete promijeniti kategorije u bilo kojem trenutku
- Promjene se primjenjuju odmah
- Možete eksperimentirati s različitim kategorijama

Odabir kategorija za primanje leadova fokusira vas na najprofitabilnije prilike!
`
    },
    "Filtriranje leadova po kategorijama": {
      implemented: true,
      summary: "Filtrirate leadove prema kategorijama kako biste vidjeli samo relevantne leadove.",
      details: `## Kako funkcionira:

Filtriranje leadova po kategorijama omogućava vam da vidite samo leadove u kategorijama koje vas zanimaju.

**Kako filtrirati:**
- Odaberete jednu ili više kategorija iz popisa
- Platforma prikazuje samo leadove u odabranim kategorijama
- Možete kombinirati kategorije za preciznije rezultate

**Zašto je važno:**
- Ne vidite leadove koji vas ne zanimaju
- Fokus na relevantne leadove
- Brže pronalaženje leadova za kupnju
- Veća efikasnost u traženju leadova

**Prednosti:**
- Ušteda vremena - ne morate pregledavati sve leadove
- Fokus na leadove gdje imate najviše šansi
- Bolje planiranje budžeta za leadove
- Veća šansa za uspjeh jer radite u svojim kategorijama

**Kako koristiti:**
- Odaberite kategorije u kojima imate najviše iskustva
- Eksperimentirajte s različitim kategorijama
- Pratite konverziju po kategorijama

Filtriranje leadova po kategorijama pomaže vam fokusirati se na najprofitabilnije prilike!
`
    },
    "Pregled svih pružatelja": {
      implemented: true,
      summary: "Pregledajte sve pružatelje na platformi i pronađite onog koji najbolje odgovara vašim potrebama.",
      details: `## Kako funkcionira:

Kao korisnik, možete pregledati sve pružatelje na platformi i pronaći onog koji najbolje odgovara vašim potrebama.

**Kako pregledavati:**
- Otvorite stranicu "Svi pružatelji" ili "Pronađi pružatelja"
- Vidite listu svih pružatelja na platformi
- Svaki pružatelj prikazuje osnovne informacije (ocjena, kategorije, lokacija)

**Što vidite:**
- Profil slika i ime pružatelja
- Prosječna ocjena i broj recenzija
- Kategorije u kojima radi
- Lokacije gdje radi
- Verifikacije (Email, Phone, DNS, Business badge)

**Filteri i sortiranje:**
- Filtrirate po kategoriji, lokaciji, ocjeni
- Sortirate po ocjeni, broju recenzija, udaljenosti
- Pretražujete po imenu ili nazivu tvrtke

**Odabir pružatelja:**
- Kliknete na pružatelja da vidite detaljni profil
- Pregledavate portfolio, licence, recenzije
- Kontaktirate pružatelja direktno ili pošaljete ponudu za posao

**Prednosti:**
- Pregled svih dostupnih pružatelja
- Laka usporedba različitih opcija
- Informirana odluka o odabiru

Pregled svih pružatelja omogućava vam pronalaženje pravog pružatelja za vaš posao!
`
    },
    "Chat sobe za svaki posao": {
      implemented: true,
      summary: "Svaki posao ima svoju chat sobu gdje možete komunicirati s korisnikom ili pružateljem oko tog posla.",
      details: `## Kako funkcionira:

Svaki posao na platformi ima svoju chat sobu gdje možete komunicirati s korisnikom ili pružateljem oko detalja posla.

**Kako otvoriti chat:**
- Otvorite posao za koji želite komunicirati
- Kliknete na "Chat" ili "Poruka"
- Otvara se chat soba za taj posao
- Možete odmah početi razgovorati

**Zašto je korisno:**
- Sve poruke o poslu su na jednom mjestu
- Lako pronalaženje povijesti razgovora
- Ne brkate se između različitih poslova
- Organiziranija komunikacija

**Za korisnike:**
- Komunicirate s pružateljem o detaljima posla
- Pregledavate sve ponude i raspravljate o njima
- Dogovorite se o cijeni, vremenu i detaljima

**Za pružatelje:**
- Komunicirate s korisnikom o poslu
- Odgovarate na pitanja i dajete dodatne informacije
- Dogovorite se o detaljima izvršenja

**Povijest poruka:**
- Sve poruke su spremljene u chat sobi
- Možete se vratiti i vidjeti što ste dogovorili
- Korisno za pregled dogovora

Chat sobe osiguravaju organiziranu komunikaciju oko svakog posla!
`
    },
    "Povijest poruka": {
      implemented: true,
      summary: "Sve poruke koje pošaljete i primite su spremljene tako da možete vidjeti cijelu povijest razgovora.",
      details: `## Kako funkcionira:

Sve poruke koje pošaljete i primite u chatu su spremljene tako da možete vidjeti cijelu povijest razgovora u bilo kojem trenutku.

**Kako vidjeti povijest:**
- Otvorite chat s korisnikom ili pružateljem
- Vidite sve poruke kronološki (najstarije najprije)
- Možete se vratiti i vidjeti što ste dogovorili

**Što sadrži povijest:**
- Sve poruke koje ste poslali
- Sve poruke koje ste primili
- Datum i vrijeme svake poruke
- Priložene slike ili dokumente
- Status poruka (poslana, dostavljena, pročitana)

**Zašto je važno:**
- Ne gubite informacije o dogovorima
- Možete se vratiti na što ste se dogovorili
- Dokaz komunikacije u slučaju sporova
- Organizirana komunikacija

**Kako koristiti:**
- Pregledavate što ste se dogovorili o cijeni ili vremenu
- Tražite specifične informacije koje ste razgovarali
- Pregledavate detalje posla kroz razgovor

Povijest poruka osigurava da nikada ne izgubite informacije iz razgovora!
`
    },
    "Notifikacije za nove poruke": {
      implemented: true,
      summary: "Primajte obavijesti kada vam netko pošalje poruku u chatu - ne propustite važne poruke.",
      details: `## Kako funkcionira:

Kada vam netko pošalje poruku u chatu, automatski primite obavijest kako ne biste propustili važne poruke.

**Kada primite notifikaciju:**
- Čim netko pošalje poruku u bilo kojoj chat sobi
- Notifikacija se pojavljuje u realnom vremenu
- Primite i email notifikaciju ako je omogućeno

**Što notifikacija sadrži:**
- Ime osobe koja je poslala poruku
- Prvi dio poruke (preview)
- Naslov posla ako je poruka vezana uz posao
- Vrijeme kada je poruka poslana

**Gdje vidite notifikacije:**
- U gornjem desnom kutu ekrana (ikonica zvona)
- Vidite brojač nepročitanih poruka
- Kliknete na ikonicu da vidite sve notifikacije
- Otvorite chat direktno iz notifikacije

**Prednosti:**
- Ne propustite važne poruke
- Brz odgovor korisnicima ili pružateljima
- Mogućnost odgovora direktno iz notifikacije
- Email notifikacije osiguravaju da vidite poruku i ako niste na platformi

Notifikacije za nove poruke osiguravaju da uvijek ostanete povezani s komunikacijom!
`
    },
    "Notifikacije za prihvaćene ponude": {
      implemented: true,
      summary: "Primajte obavijest kada korisnik prihvati vašu ponudu - možete započeti rad na poslu.",
      details: `## Kako funkcionira:

Kada korisnik prihvati vašu ponudu za posao, automatski primite obavijest kako biste znali da možete započeti rad.

**Kada primite notifikaciju:**
- Čim korisnik prihvati vašu ponudu
- Notifikacija se pojavljuje odmah
- Primite i email notifikaciju

**Što notifikacija sadrži:**
- Naslov posla za koji je ponuda prihvaćena
- Iznos ponude koji je prihvaćen
- Informacije o korisniku
- Link za direktni pristup poslu

**Što slijedi:**
- Posao prelazi u status "U TIJEKU"
- Možete komunicirati s korisnikom preko chata
- Možete početi planirati izvršenje posla
- Možete pristupiti detaljima posla i kontakt informacijama

**Zašto je važno:**
- Ne propustite priliku započeti rad
- Brz odgovor korisniku gradi povjerenje
- Jasna komunikacija o statusu ponude

Notifikacije za prihvaćene ponude osiguravaju da znate kada možete započeti rad!
`
    },
    "Notifikacije za nove poslove (providere)": {
      implemented: true,
      summary: "Kao pružatelj, primajte obavijesti kada se objavi novi posao u vašim kategorijama - ne propustite priliku.",
      details: `## Kako funkcionira:

Kada se objavi novi posao u kategorijama u kojima radite, automatski primite obavijest kako ne biste propustili priliku.

**Kada primite notifikaciju:**
- Čim se objavi novi posao u vašim kategorijama
- Notifikacija se pojavljuje u realnom vremenu
- Primite i email notifikaciju ako je omogućeno

**Što notifikacija sadrži:**
- Naslov novog posla
- Kategorija usluge
- Lokacija posla
- Budžet (ako je naveden)
- Link za direktni pristup poslu

**Zašto je važno:**
- Ne propustite nove prilike
- Brži odgovor znači veću šansu za prihvaćanje ponude
- Fokus na poslove u vašim kategorijama
- Mogućnost slanja prve ponude

**Kako reagirati:**
- Kliknite na notifikaciju da otvorite posao
- Pregledajte detalje posla
- Pošaljite ponudu ako vas zanima

**Prednosti:**
- Brz odgovor na nove prilike
- Veća šansa za dobivanje posla
- Fokus na relevantne poslove
- Email notifikacije osiguravaju da vidite posao i ako niste na platformi

Notifikacije za nove poslove osiguravaju da ne propustite nijednu priliku!
`
    },
    "Email notifikacije": {
      implemented: true,
      summary: "Primajte važne obavijesti na email kako biste bili informirani čak i ako niste na platformi.",
      details: `## Kako funkcionira:

Pored in-app notifikacija, možete primati važne obavijesti i na svoju email adresu.

**Koje obavijesti primate:**
- Nove ponude za vaše poslove
- Prihvaćene ponude
- Nove poruke u chatu
- Novi poslovi u vašim kategorijama
- Statusi ponuda (prihvaćene, odbijene)
- Važne promjene na vašem računu

**Zašto je korisno:**
- Vidite obavijesti čak i ako niste na platformi
- Ne propustite važne događaje
- Mogućnost brzog odgovora direktno iz emaila
- Arhiva važnih obavijesti u email inboxu

**Postavke:**
- Možete omogućiti ili onemogućiti email notifikacije
- Možete odabrati koje vrste obavijesti želite primati
- Kontrola nad količinom email obavijesti

**Prednosti:**
- Uvijek informirani o važnim događajima
- Brz odgovor čak i ako niste aktivni na platformi
- Ne propustite prilike

Email notifikacije osiguravaju da uvijek budete u toku s važnim događajima!
`
    },
    "In-app notifikacije": {
      implemented: true,
      summary: "Primajte obavijesti direktno na platformi - vidite ih u realnom vremenu dok koristite platformu.",
      details: `## Kako funkcionira:

In-app notifikacije su obavijesti koje vidite direktno na platformi dok je koristite - pojavljuju se u realnom vremenu.

**Kada primite notifikaciju:**
- U realnom vremenu kada se dogodi nešto važno
- Notifikacija se pojavljuje u gornjem desnom kutu (ikonica zvona)
- Vidite brojač nepročitanih notifikacija

**Vrste obavijesti:**
- Nove ponude za vaše poslove
- Prihvaćene ili odbijene ponude
- Nove poruke u chatu
- Novi poslovi u vašim kategorijama
- Promjene statusa poslova ili ponuda
- Važne obavijesti o vašem računu

**Kako koristiti:**
- Kliknite na ikonicu zvona da vidite sve notifikacije
- Kliknite na notifikaciju da otvorite relevantnu stranicu
- Označite notifikacije kao pročitane
- Obrišite notifikacije koje više nisu relevantne

**Prednosti:**
- Brze obavijesti u realnom vremenu
- Ne propustite važne događaje
- Lako praćenje aktivnosti
- Mogućnost brzog odgovora

In-app notifikacije osiguravaju da ste uvijek u toku s događajima na platformi!
`
    },
    "Brojač nepročitanih notifikacija": {
      implemented: true,
      summary: "Vidite broj nepročitanih notifikacija na ikonici zvona - znate koliko novih obavijesti imate.",
      details: `## Kako funkcionira:

Ikonica zvona u gornjem desnom kutu prikazuje broj nepročitanih notifikacija kako biste znali koliko novih obavijesti imate.

**Kako funkcionira:**
- Svaki put kada primite novu notifikaciju, brojač se povećava
- Kada pročitate notifikaciju, brojač se smanjuje
- Brojač pokazuje ukupan broj nepročitanih notifikacija

**Zašto je korisno:**
- Brzo vidite imate li nove obavijesti
- Ne propustite važne događaje
- Lako praćenje nepročitanih obavijesti
- Poticaj da pročitate sve obavijesti

**Kako koristiti:**
- Pogledate brojač na ikonici zvona
- Ako je brojač veći od 0, imate nepročitanih obavijesti
- Kliknite na ikonicu da vidite sve notifikacije
- Pročitajte notifikacije da se brojač resetira

Brojač nepročitanih notifikacija pomaže vam pratiti važne obavijesti!
`
    },
    "Cijene leadova (10-20 kredita)": {
      implemented: true,
      summary: "Leadovi koštaju između 10 i 20 kredita ovisno o kvaliteti - viša kvaliteta = viša cijena.",
      details: `## Kako funkcionira:

Cijene ekskluzivnih leadova variraju između 10 i 20 kredita ovisno o kvaliteti leada koju AI sustav ocijeni.

**Kako se određuje cijena:**
- **20 kredita** - VRHUNSKI leadovi (80-100 AI score)
- **15 kredita** - DOBAR leadovi (60-79 AI score)
- **10 kredita** - PROSJEČAN leadovi (40-59 AI score)
- **5 kredita** - SLAB leadovi (0-39 AI score)

**Zašto različite cijene:**
- Viša kvaliteta leadova = veća šansa za konverziju
- Viša cijena = veći ROI ako konvertirate
- Različite strategije - možete kupovati jeftinije ili skuplje leadove
- Fleksibilnost u planiranju budžeta

**Kako odabrati:**
- Visoki score leadovi su sigurniji, ali skuplji
- Niži score leadovi su jeftiniji, ali rizičniji
- Kombinirajte različite kvalitete ovisno o strategiji
- Pratite ROI za svaku kvalitetu

**Planiranje budžeta:**
- 20 kredita za VRHUNSKI lead = 1 lead po 20 kredita
- 10 kredita za PROSJEČAN lead = 2 leada po 10 kredita
- Odaberite strategiju koja vam odgovara

Cijene leadova osiguravaju fleksibilnost i različite strategije za različite budžete!
`
    },
    "Kupnja leadova": {
      implemented: true,
      summary: "Kupite ekskluzivni lead klikom na gumb - krediti se troše automatski ili plaćate direktno karticom.",
      details: `## Kako funkcionira:

Kupovina leadova je jednostavna - odaberete lead koji vas zanima i kliknete "Kupi lead" za ekskluzivni pristup.

**Proces kupovine:**
- Pregledate dostupne leadove na tržištu
- Odaberete lead koji vas zanima
- Kliknete "Kupi lead"
- Plaćanje se vrši kreditima (ako ih imate) ili direktno kreditnom karticom
- Nakon kupovine, kontakt informacije postaju dostupne samo vama

**Načini plaćanja:**
- **Interni krediti** - Ako imate dovoljno kredita, oni se troše automatski
- **Stripe Payment Intent** - Ako nemate dovoljno kredita, možete platiti direktno karticom
- Plaćanje je sigurno i zaštićeno

**Nakon kupovine:**
- Lead se skida s tržišta i vi ste jedini koji imate pristup
- Vidite kontakt informacije (email, telefon)
- Lead se dodaje u "Moji leadovi"
- Imate 48 sati da kontaktirate klijenta

**Prednosti:**
- Brza kupovina - samo jedan klik
- Ekskluzivni pristup - nema konkurencije
- Fleksibilno plaćanje - krediti ili kartica
- Automatsko ažuriranje balansa kredita

Kupovina leadova je brza, jednostavna i sigurna - samo jedan klik i imate ekskluzivni pristup!
`
    },
    "Red čekanja za leadove": {
      implemented: true,
      summary: "Uredite se u red čekanja za leadove - leadovi se automatski dijele redom providerima u redu.",
      details: `## Kako funkcionira:

Red čekanja za leadove omogućava vam da se prijavite za automatsko primanje leadova u vašim kategorijama.

**Kako se prijaviti:**
- Odaberete kategorije u kojima želite primati leadove
- Prijavite se u red čekanja za te kategorije
- Leadovi se automatski dijele redom providerima u redu

**Kako funkcionira:**
- Kada se objavi novi lead u vašoj kategoriji, automatski se nudi provideru na vrhu reda
- Ako provider odbije ili ne odgovori u roku, lead se nudi sljedećem u redu
- Prolazite kroz red dok netko ne prihvati lead

**Prednosti:**
- Ne morate ručno pregledavati leadove
- Automatski primanje relevantnih leadova
- Fer distribucija leadova među providerima
- Veća šansa za dobivanje leadova

**Pozicija u redu:**
- Vidite svoju poziciju u redu za svaku kategoriju
- Pozicija se mijenja kako leadovi prolaze kroz red
- Što ste aktivniji, to brže prolazite kroz red

Red čekanja osigurava fer distribuciju leadova među svim providerima!
`
    },
    "Verifikacija klijenata": {
      implemented: true,
      summary: "Sustav automatski verifikira klijente - verificirani klijenti znače kvalitetnije leadove.",
      details: `## Kako funkcionira:

Platforma automatski verifikira klijente na temelju različitih faktora kako bi osigurala kvalitetu leadova.

**Kako se verifikira:**
- **Email verifikacija** - Je li email potvrđen?
- **Telefon verifikacija** - Je li telefon verificiran SMS-om?
- **OIB verifikacija** - Je li OIB valjan?
- **Tvrtka verifikacija** - Je li tvrtka verificirana kroz sudski registar?

**Zašto je važno:**
- Verificirani klijenti su ozbiljniji i imaju veću šansu za konverziju
- Verificirani klijenti dobivaju viši AI score
- Veća pouzdanost leadova
- Manje rizika od neozbiljnih upita

**Kako se koristi:**
- AI score kvalitete uključuje verifikacije
- Verificirani klijenti znače kvalitetnije leadove
- Možete filtrirati leadove prema verifikaciji

**Prednosti:**
- Veća šansa za konverziju s verificiranim klijentima
- Manje vremena na neozbiljne upite
- Bolje ROI s kvalitetnijim leadovima

Verifikacija klijenata osigurava kvalitetu leadova i veću šansu za uspjeh!
`
    },
    "Pretplata na leadove": {
      implemented: true,
      summary: "Pretplatite se na plan (BASIC, PREMIUM, PRO) kako biste dobili kredite i pristup ekskluzivnim leadovima.",
      details: `## Kako funkcionira:

Pretplata na plan omogućava vam pristup ekskluzivnim leadovima i dobivanje mjesečnih kredita za kupovinu leadova.

**Dostupni planovi:**
- **BASIC** - Osnovni plan s ograničenim kreditima
- **PREMIUM** - Srednji plan s više kredita i funkcionalnosti
- **PRO** - Najnapredniji plan s najviše kredita i svim funkcionalnostima

**Što dobivate s pretplatom:**
- Mjesečne kredite za kupovinu leadova
- Pristup ekskluzivnim leadovima
- ROI dashboard za praćenje rezultata
- Različite funkcionalnosti ovisno o planu

**Kako funkcionira:**
- Odaberete plan koji vam odgovara
- Plaćate mjesečno preko Stripe-a
- Krediti se dodaju na vaš račun svaki mjesec
- Pretplata se automatski obnavlja

**Nadogradnja:**
- Možete nadograditi plan u bilo kojem trenutku
- Razlika se naplaćuje proporcionalno
- Dodatni krediti se dodaju odmah

**Otkazivanje:**
- Možete otkazati pretplatu u bilo kojem trenutku
- Pretplata traje do kraja obračunskog razdoblja
- Krediti koje ste dobili ostaju na vašem računu

Pretplata na leadove omogućava vam pristup ekskluzivnim leadovima i rast vašeg poslovanja!
`
    },
    "Statistike uspješnosti": {
      implemented: true,
      summary: "Vidite sve svoje statistike uspješnosti - konverziju, ROI, prihod i druge metrike.",
      details: `## Kako funkcionira:

Statistike uspješnosti pokazuju vam koliko uspješno radite s leadovima - vidite sve važne metrike na jednom mjestu.

**Glavne metrike:**
- **Stopa konverzije** - Koliki postotak leadova se konvertira u poslove
- **ROI** - Koliki profit ostvarujete na svaku kunu uloženu
- **Ukupan prihod** - Koliko ste ukupno zaradili od leadova
- **Prosječna vrijednost leada** - Koliko u prosjeku zaradite po konvertiranom leadu
- **Ukupno potrošenih kredita** - Koliko kredita ste potrošili

**Mjesečne statistike:**
- Vidite kako se vaše metrike mijenjaju kroz mjesece
- Pratite trendove - poboljšavate li se
- Usporedba između mjeseci

**Kategorijske statistike:**
- Vidite kako radite u različitim kategorijama
- Identificirajte najprofitabilnije kategorije
- Fokus na kategorije gdje imate najbolji ROI

**Prednosti:**
- Brzo vidite jesmo li profitabilni
- Razumijete koje strategije rade
- Donosite informirane odluke
- Optimizirate svoju strategiju

Statistike uspješnosti vam daju potpunu sliku vašeg poslovanja i pomažu vam optimizirati strategiju!
`
    },
    "Pozicija u redu čekanja": {
      implemented: true,
      summary: "Vidite svoju poziciju u redu čekanja za svaku kategoriju - znate koliko vas još čeka prije vas.",
      details: `## Kako funkcionira:

Kada ste u redu čekanja za leadove, vidite svoju poziciju - koliko vas providera je ispred vas u redu.

**Kako vidite poziciju:**
- Otvorite "Red čekanja" sekciju
- Vidite svoju poziciju za svaku kategoriju
- Primjerice: "Pozicija 3 od 15" znači da su još 2 providera ispred vas

**Kako se mijenja pozicija:**
- Pozicija se smanjuje kada provideri ispred vas primaju ili odbiju leadove
- Pozicija se smanjuje kada dodate više kategorija (možete biti višestruko u redu)
- Što ste aktivniji, to brže prolazite kroz red

**Zašto je važno:**
- Znate kada možete očekivati lead
- Planirate budžet na temelju pozicije
- Razumijete koliko providera konkurenta ima

**Prednosti:**
- Transparentnost u distribuciji leadova
- Realna očekivanja o vremenu
- Mogućnost planiranja

Pozicija u redu čekanja daje vam uvid u vašu poziciju i očekivanja!
`
    },
    "Statusi u redu (WAITING, OFFERED, ACCEPTED, DECLINED, EXPIRED, SKIPPED)": {
      implemented: true,
      summary: "Svaki lead u redu čekanja ima status koji pokazuje gdje je u procesu distribucije.",
      details: `## Kako funkcionira:

Svaki lead u redu čekanja ima status koji pokazuje gdje se nalazi u procesu distribucije među providerima.

**Statusi leadova u redu:**
- **WAITING** - Lead čeka u redu, još nije ponuđen nijednom provideru
- **OFFERED** - Lead je ponuđen provideru i čeka odgovor
- **ACCEPTED** - Provider je prihvatio lead - kupio ga je
- **DECLINED** - Provider je odbio lead
- **EXPIRED** - Lead je istekao - nijedan provider nije odgovorio u roku
- **SKIPPED** - Provider je preskočio lead (nije odgovorio u roku)

**Kako se koristi:**
- Vidite status leadova koji su vam ponuđeni
- Znate što se događa s leadovima u redu
- Pratite napredak kroz red čekanja

**Zašto je važno:**
- Jasna komunikacija o statusu leadova
- Razumijevanje procesa distribucije
- Realna očekivanja o vremenu

Statusi u redu osiguravaju transparentnost u distribuciji leadova!
`
    },
    "Automatska distribucija leadova": {
      implemented: true,
      summary: "Leadovi se automatski dijele providerima u redu čekanja - nema potrebe za ručnom intervencijom.",
      details: `## Kako funkcionira:

Leadovi se automatski dijele providerima u redu čekanja prema redoslijedu - nema potrebe za ručnom intervencijom.

**Kako funkcionira:**
- Novi lead se objavi u kategoriji
- Sustav automatski nudi lead provideru na vrhu reda za tu kategoriju
- Ako provider prihvati, lead se kupi
- Ako provider odbije ili ne odgovori, lead se nudi sljedećem u redu
- Proces se ponavlja dok netko ne prihvati lead

**Zašto je korisno:**
- Ne morate ručno pregledavati leadove
- Automatski primanje relevantnih leadova
- Fer distribucija među svim providerima
- Brži proces od ponude do kupovine

**Prednosti:**
- Ušteda vremena - nema ručnog pregledavanja
- Fer sustav - svi provideri prolaze kroz red
- Automatski proces - nema potrebe za intervencijom
- Veća šansa za dobivanje leadova

Automatska distribucija osigurava fer i efikasan sustav dijeljenja leadova!
`
    },
    "Rok za odgovor (24h)": {
      implemented: true,
      summary: "Imate 24 sata da odgovorite na lead koji vam je ponuđen u redu čekanja - nakon toga se preskačete.",
      details: `## Kako funkcionira:

Kada vam se lead ponudi u redu čekanja, imate 24 sata da odgovorite - ako ne odgovorite, više se ne nudi i prelazi na sljedećeg providera.

**Kako funkcionira:**
- Lead vam se ponudi automatski
- Primite notifikaciju o novom leadu u redu
- Imate 24 sata da odgovorite (INTERESTED, NOT_INTERESTED ili ignorirate)
- Ako ne odgovorite u roku, status postaje SKIPPED i lead se nudi sljedećem

**Zašto postoji rok:**
- Osigurava brz odgovor providerima
- Ne blokira lead u redu predugo
- Brži proces distribucije leadova
- Daje priliku svim providerima u redu

**Kako odgovoriti:**
- Kliknete "Zainteresiran" ako želite kupiti lead
- Kliknete "Nisam zainteresiran" ako vas lead ne zanima
- Ako ne odgovorite, automatski se preskačete

**Prednosti:**
- Brži odgovori znače brži pristup leadovima
- Fer sustav - svi imaju isti rok
- Brži proces distribucije

Rok za odgovor osigurava brzu distribuciju leadova i fer pristup svim providerima!
`
    },
    "Odgovori providera (INTERESTED, NOT_INTERESTED, NO_RESPONSE)": {
      implemented: true,
      summary: "Možete odgovoriti na ponuđeni lead u redu čekanja - zainteresirani, niste zainteresirani ili ne odgovarate.",
      details: `## Kako funkcionira:

Kada vam se lead ponudi u redu čekanja, možete odgovoriti na tri načina kako biste komunicirali svoju želju.

**Opcije odgovora:**
- **INTERESTED (Zainteresiran)** - Želite kupiti lead, otvara se proces kupovine
- **NOT_INTERESTED (Nisam zainteresiran)** - Lead vas ne zanima, prelazi na sljedećeg providera
- **NO_RESPONSE (Bez odgovora)** - Ne odgovorite u roku od 24 sata, automatski se preskačete

**Kako odgovoriti:**
- Primite notifikaciju o novom leadu
- Otvorite lead da vidite detalje
- Odaberete opciju koja vam odgovara
- Ako ste zainteresirani, kupnja se nastavlja

**Zašto je važno:**
- Brz odgovor znači brži pristup leadovima
- Ne blokirate red čekanja ako niste zainteresirani
- Jasna komunikacija o interesu

**Prednosti:**
- Kontrola nad leadovima koje želite kupiti
- Brža distribucija leadova
- Fer sustav za sve provider

Odgovori providera osiguravaju brzu i efikasnu distribuciju leadova!
`
    },
    "Preskakanje neaktivnih providera": {
      implemented: true,
      summary: "Provideri koji ne odgovore na leadove u roku od 24 sata automatski se preskaču - ne blokiraju red.",
      details: `## Kako funkcionira:

Ako provider ne odgovori na ponuđeni lead u roku od 24 sata, automatski se preskače i lead se nudi sljedećem provideru u redu.

**Kako funkcionira:**
- Lead se nudi provideru na vrhu reda
- Provider ima 24 sata da odgovori
- Ako ne odgovori, status postaje SKIPPED
- Lead se automatski nudi sljedećem provideru u redu

**Zašto postoji:**
- Ne blokira red čekanja predugo
- Osigurava brzu distribuciju leadova
- Daje priliku svim providerima
- Brži proces od ponude do kupovine

**Prednosti:**
- Brža distribucija leadova
- Ne blokira red neaktivnim providerima
- Fer sustav za sve aktivne provider
- Veća efikasnost u distribuciji

Preskakanje neaktivnih providera osigurava da red čekanja ne bude blokiran i da se leadovi brzo distribuiraju!
`
    },
    "Queue scheduler (provjera svakih sat vremena)": {
      implemented: true,
      summary: "Sustav automatski provjerava red čekanja svakih sat vremena i nudi leadove providerima.",
      details: `## Kako funkcionira:

Sustav automatski provjerava red čekanja svakih sat vremena, nudi nove leadove providerima i ažurira statuse.

**Kako funkcionira:**
- Svakih sat vremena sustav provjerava red čekanja
- Nudi nove leadove providerima na vrhu reda
- Provjerava status ponuđenih leadova
- Ako provider ne odgovori, prelazi na sljedećeg

**Zašto je važno:**
- Automatski proces bez ručne intervencije
- Brža distribucija leadova
- Pravilno upravljanje redom čekanja
- Svi provideri dobivaju priliku

**Prednosti:**
- Nema potrebe za ručnom intervencijom
- Brža distribucija leadova
- Fer sustav za sve provider
- Automatsko ažuriranje statusa

Queue scheduler osigurava automatsko i efikasno upravljanje redom čekanja!
`
    },
    "Notifikacije za nove leadove u redu": {
      implemented: true,
      summary: "Primajte obavijesti kada vam se nudi novi lead u redu čekanja - imate 24 sata za odgovor.",
      details: `## Kako funkcionira:

Kada vam se nudi novi lead u redu čekanja, automatski primite obavijest kako biste znali da imate priliku za kupovinu.

**Kada primite notifikaciju:**
- Čim vam se lead ponudi u redu čekanja
- Notifikacija se pojavljuje u realnom vremenu
- Primite i email notifikaciju

**Što notifikacija sadrži:**
- Naslov leada koji vam je ponuđen
- Kategorija i lokacija
- Budžet (ako je naveden)
- Link za direktni pristup leadu
- Podsjetnik o roku od 24 sata za odgovor

**Kako reagirati:**
- Kliknite na notifikaciju da otvorite lead
- Pregledajte detalje leada
- Odlučite jeste li zainteresirani ili ne
- Odgovorite u roku od 24 sata

**Zašto je važno:**
- Ne propustite priliku za kupovinu leada
- Brz odgovor znači brži pristup leadu
- Realan rok za donošenje odluke

Notifikacije za nove leadove osiguravaju da ne propustite nijednu priliku u redu čekanja!
`
    },
    "Pregled mojih leadova u redu": {
      implemented: true,
      summary: "Vidite sve leadove koji su vam ponuđeni u redu čekanja i njihove status - odgovoreli ste ili ne.",
      details: `## Kako funkcionira:

U sekciji "Pregled mojih leadova u redu" vidite sve leadove koji su vam ponuđeni u redu čekanja i gdje se nalaze u procesu.

**Što vidite:**
- Sve leadove koji su vam ponuđeni u redu čekanja
- Status svakog leada (WAITING, OFFERED, ACCEPTED, DECLINED, EXPIRED, SKIPPED)
- Kada vam je lead ponuđen
- Koliko vremena imate do isteka roka za odgovor

**Kako koristiti:**
- Pregledavate sve leadove koji su vam ponuđeni
- Vidite status svakog leada
- Odlučujete jeste li zainteresirani ili ne
- Odgovarate na leadove koje niste još odgovorili

**Prednosti:**
- Centralizirani pregled svih ponuđenih leadova
- Lako praćenje statusa
- Ne propustite leadove koji traže odgovor
- Organizirano upravljanje leadovima

**Filtri:**
- Možete filtrirati po statusu
- Možete filtrirati po kategoriji
- Možete sortirati po datumu ponude

Pregled mojih leadova u redu omogućava vam upravljanje svim ponuđenim leadovima na jednom mjestu!
`
    },
    "Statistike queue sustava": {
      implemented: true,
      summary: "Vidite statistike reda čekanja - koliko leadova je prošlo kroz red, konverziju i efikasnost.",
      details: `## Kako funkcionira:

Statistike queue sustava pokazuju vam koliko uspješno funkcionira red čekanja i distribucija leadova.

**Što statistike pokazuju:**
- Ukupan broj leadova koji su prošli kroz red
- Koliko leadova je prihvaćeno, odbijeno ili isteklo
- Prosječno vrijeme odgovora providera
- Stopu konverzije leadova iz reda
- Efikasnost distribucije

**Kako koristiti:**
- Vidite kako funkcionira red čekanja
- Identificirate probleme u distribuciji
- Optimizirate proces distribucije

**Za providere:**
- Vidite koliko leadova je prošlo kroz red u vašim kategorijama
- Razumijete svoju poziciju i šanse
- Planirate strategiju kupovine

**Za platformu:**
- Vidite efikasnost sustava
- Identificirate područja za poboljšanje
- Optimizirate distribuciju leadova

Statistike queue sustava daju vam uvid u efikasnost distribucije leadova!
`
    },
    "Red čekanja za leadove (LeadQueue)": {
      implemented: true,
      summary: "Sustav reda čekanja koji automatski dijeli ekskluzivne leadove providerima prema redoslijedu.",
      details: `## Kako funkcionira:

LeadQueue je sustav reda čekanja koji automatski dijeli ekskluzivne leadove providerima prema njihovoj poziciji u redu.

**Kako funkcionira:**
- Prijavite se u red čekanja za odabrane kategorije
- Leadovi se automatski dijele providerima prema redoslijedu
- Svaki provider dobiva priliku za kupovinu leada
- Ako provider odbije ili ne odgovori, lead se nudi sljedećem

**Prednosti:**
- Fer distribucija leadova među svim providerima
- Automatski proces - nema ručne intervencije
- Svi provideri dobivaju jednak pristup
- Brža distribucija leadova

**Kako koristiti:**
- Odaberete kategorije u kojima želite primati leadove
- Prijavite se u red čekanja
- Leadovi se automatski nudi u redoslijedu
- Odgovarate na ponuđene leadove u roku od 24 sata

LeadQueue osigurava fer i efikasan način distribucije leadova među svim providerima!
`
    },
    "Refund kredita (vraćanje internih kredita)": {
      implemented: true,
      summary: "Ako se lead vrati zbog određenog razloga, krediti se automatski vraćaju na vaš račun.",
      details: `## Kako funkcionira:

Ako kupite lead koji se kasnije vrati zbog određenog razloga (npr. klijent ne odgovori), krediti se automatski vraćaju na vaš račun.

**Kada se refundira:**
- Klijent ne odgovori unutar određenog roka
- Lead je neispravan ili neodgovarajući
- Ručno zatražite refund s razlogom
- Automatski nakon 48 sati neaktivnosti

**Kako funkcionira:**
- Sustav automatski detektira razlog za refund
- Krediti se vraćaju na vaš račun
- Status leada se mijenja u REFUNDED
- Lead se vraća na tržište ili se označava kao istekao

**Prednosti:**
- Ne gubite kredite na neispravne leadove
- Automatski proces - nema ručne intervencije
- Zaštićeni ste od loših leadova
- Fer sustav za sve providere

Refund kredita osigurava da ne gubite kredite na leadove koji se ne mogu koristiti!
`
    },
    "Stripe Payment Intent refund API (PSD2 compliant)": {
      implemented: true,
      summary: "Ako ste platili lead direktno karticom preko Stripe-a, refund se vrši direktno na vašu karticu u skladu s PSD2 propisima.",
      details: `## Kako funkcionira:

Ako ste platili lead direktno karticom preko Stripe Payment Intent, refund se automatski vrši direktno na vašu karticu u skladu s PSD2 propisima.

**Kako funkcionira:**
- Ako ste platili karticom, refund se vraća na istu karticu
- Proces je automatski i zaštićen PSD2 propisima
- Refund se može vidjeti na vašem bankovnom računu
- Stripe prati svaki refund i šalje potvrdu

**Prednosti:**
- Refund direktno na karticu
- PSD2 compliant - siguran i zaštićen proces
- Automatski proces
- Potvrda refunda od Stripe-a

**Kada se koristi:**
- Plaćanje leadova direktno karticom (umjesto internih kredita)
- Refund za neispravne ili neodgovarajuće leadove
- Ručno zatraženi refund s razlogom

Stripe refund osigurava siguran i zakoniti povrat novca direktno na vašu karticu!
`
    },
    "Automatski odabir refund metode (Stripe API ili interni krediti)": {
      implemented: true,
      summary: "Sustav automatski odlučuje kako će refundirati - na karticu ako ste platili karticom, ili kao interne kredite ako ste platili kreditima.",
      details: `## Kako funkcionira:

Sustav automatski detektira kako ste platili lead i vraća kredite na isti način - ako ste platili karticom, refund ide na karticu, ako ste platili kreditima, refund ide kao krediti.

**Kako funkcionira:**
- Sustav provjerava način plaćanja leada
- Ako je plaćen Stripe Payment Intent, refund ide na karticu
- Ako je plaćen internim kreditima, refund ide kao krediti
- Proces je potpuno automatski

**Prednosti:**
- Automatski proces - nema ručne intervencije
- Refund ide na način na koji ste platili
- Jednostavno i transparentno
- Nema zabune o načinu refunda

**Zašto je važno:**
- Jednostavnost - sustav odlučuje umjesto vas
- Transparentnost - znate kako će refund ići
- Brz proces - bez dodatnih koraka

Automatski odabir refund metode osigurava da refund uvijek ide na pravi način!
`
    },
    "Refund ako klijent ne odgovori u roku": {
      implemented: true,
      summary: "Ako klijent ne odgovori na vaš kontakt unutar određenog roka, lead se automatski refundira i krediti se vraćaju.",
      details: `## Kako funkcionira:

Ako kontaktirate klijenta nakon kupovine leada, ali klijent ne odgovori unutar određenog roka (npr. 48 sati), lead se automatski refundira i krediti se vraćaju na vaš račun.

**Kako funkcionira:**
- Kupite lead i kontaktirate klijenta
- Klijent ne odgovori u roku (npr. 48 sati)
- Sustav automatski detektira neaktivnost
- Lead se refundira i krediti se vraćaju

**Prednosti:**
- Zaštićeni ste od neaktivnih klijenata
- Ne gubite kredite na leadove gdje klijent ne odgovori
- Automatski proces - nema ručne intervencije
- Fair sustav za sve providere

**Rok za odgovor:**
- Tipično 48 sati od kontakta
- Može varirati ovisno o tipu leada
- Automatski se prati aktivnost klijenta

Refund ako klijent ne odgovori osigurava da ne gubite kredite na neaktivne klijente!
`
    },
    "Razlozi za refund (klijent ne odgovori, itd.)": {
      implemented: true,
      summary: "Možete zatražiti refund s razlogom - klijent ne odgovori, lead je neispravan, itd. - sustav automatski obrađuje zahtjev.",
      details: `## Kako funkcionira:

Ako se lead pokaže neispravan ili neodgovarajući, možete zatražiti refund s razlogom - sustav automatski obrađuje vaš zahtjev.

**Dostupni razlozi:**
- Klijent ne odgovori unutar određenog roka
- Lead je neispravan ili neodgovarajući
- Kontakt informacije su netočne
- Klijent više nije zainteresiran
- Ostali razlozi (navedite)

**Kako zatražiti:**
- Otvorite lead koji želite refundirati
- Kliknete "Zatraži refund"
- Odaberete razlog iz padajućeg popisa
- Dodate dodatne napomene ako je potrebno
- Pošaljete zahtjev

**Obrađivanje:**
- Admin pregledava zahtjev
- Ako je razlog valjan, refund se odobrava
- Krediti se vraćaju na vaš račun
- Lead se označava kao refundiran

**Prednosti:**
- Zaštićeni ste od loših leadova
- Transparentan proces refunda
- Mogućnost obrazloženja razloga
- Fer sustav za sve providere

Razlozi za refund osiguravaju da možete zahtijevati povrat kredita za neispravne leadove!
`
    },
    "Ručno zatraživanje refund-a": {
      implemented: true,
      summary: "Možete ručno zatražiti refund za lead koji ste kupili - odaberete razlog i pošaljete zahtjev adminu.",
      details: `## Kako funkcionira:

Možete ručno zatražiti refund za lead koji ste kupili ako smatrate da se lead ne može koristiti ili je neispravan.

**Kako zatražiti:**
- Otvorite lead koji želite refundirati
- Kliknete "Zatraži refund" ili "Request Refund"
- Odaberete razlog za refund iz padajućeg popisa
- Dodate dodatne napomene ako je potrebno
- Pošaljete zahtjev

**Razlozi za refund:**
- Klijent ne odgovori
- Lead je neispravan
- Kontakt informacije su netočne
- Klijent više nije zainteresiran
- Ostali razlozi

**Obrađivanje:**
- Admin pregledava zahtjev
- Ako je razlog valjan, refund se odobrava
- Krediti se vraćaju na vaš račun
- Status leada se mijenja u REFUNDED

**Prednosti:**
- Kontrola nad refundom leadova
- Mogućnost obrazloženja razloga
- Transparentan proces
- Zaštićeni ste od loših leadova

Ručno zatraživanje refund-a omogućava vam kontrolu nad refundom leadova koji se ne mogu koristiti!
`
    },
    "Povijest refund transakcija (CreditTransaction tip REFUND)": {
      implemented: true,
      summary: "Vidite sve refund transakcije u povijesti - kada ste refundirali, koliko kredita se vratilo, i razlog refunda.",
      details: `## Kako funkcionira:

Sve refund transakcije se bilježe u povijesti kredita kako biste mogli pratiti sve refundove koje ste primili.

**Što vidite:**
- Datum i vrijeme refunda
- Iznos refundiranih kredita
- Razlog refunda
- Lead koji je refundiran
- Status refunda (odobren, odbijen, u tijeku)

**Kako koristiti:**
- Otvorite povijest transakcija
- Filtrirate po tipu transakcije (REFUND)
- Vidite sve refundove koje ste primili
- Pregledavate detalje svakog refunda

**Prednosti:**
- Kompletna povijest refundova
- Lako praćenje povrata kredita
- Transparentnost u refund procesu
- Mogućnost analize refund razloga

Povijest refund transakcija omogućava vam praćenje svih refundova koje ste primili!
`
    },
    "Status refund-a (REFUNDED)": {
      implemented: true,
      summary: "Svaki refund ima status koji pokazuje gdje se nalazi u procesu - u tijeku, odobren, odbijen, itd.",
      details: `## Kako funkcionira:

Svaki refund ima status koji pokazuje gdje se nalazi u procesu obrađivanja - to vam omogućava praćenje refund zahtjeva.

**Statusi refunda:**
- **PENDING** - Zahtjev je poslan i čeka obradu
- **APPROVED** - Refund je odobren, krediti se vraćaju
- **REJECTED** - Refund je odbijen, razlog je naveden
- **REFUNDED** - Refund je završen, krediti su vraćeni

**Kako se koristi:**
- Vidite status svakog refund zahtjeva
- Znate kada su krediti vraćeni
- Razumijete zašto je refund odbijen (ako je slučaj)
- Pratite napredak refund zahtjeva

**Prednosti:**
- Transparentnost u refund procesu
- Lako praćenje statusa
- Razumijevanje zašto je refund odobren ili odbijen
- Realna očekivanja o vremenu

Status refund-a omogućava vam praćenje refund zahtjeva kroz cijeli proces!
`
    },
    "Oslobađanje leada nakon refund-a (lead se vraća na tržište)": {
      implemented: true,
      summary: "Nakon što se lead refundira, automatski se vraća na tržište kako bi drugi provideri mogli ga kupiti.",
      details: `## Kako funkcionira:

Kada se lead refundira (bilo automatski ili ručno), automatski se vraća na tržište kako bi drugi provideri mogli ga kupiti.

**Kako funkcionira:**
- Lead se refundira
- Lead se automatski vraća na tržište
- Drugi provideri mogu ga ponovno kupiti
- Status leada se ažurira u ACTIVE (dostupan)

**Zašto je važno:**
- Leadovi ne gube se ako jedan provider ne uspije
- Drugi provideri dobivaju priliku
- Fer sustav za sve providere
- Maksimalno iskorištenje leadova

**Prednosti:**
- Ne gube se leadovi nakon refunda
- Drugi provideri dobivaju priliku
- Fer distribucija leadova
- Optimizacija resursa

Oslobađanje leada nakon refund-a osigurava da leadovi ne gube se i da drugi provideri dobivaju priliku!
`
    },
    "Stripe refund ID tracking (stripeRefundId)": {
      implemented: true,
      summary: "Svaki Stripe refund se prati preko Stripe refund ID-a kako bi se mogao pratiti status refunda direktno u Stripe-u.",
      details: `## Kako funkcionira:

Kada se refund vrši preko Stripe-a, svaki refund dobiva Stripe refund ID koji se prati kako bi se mogao pratiti status refunda direktno u Stripe-u.

**Kako funkcionira:**
- Refund se vrši preko Stripe API-ja
- Stripe vraća refund ID
- Refund ID se sprema u naš sustav
- Možete pratiti status refunda u Stripe dashboardu

**Zašto je važno:**
- Mogućnost praćenja refunda u Stripe-u
- Transparentnost u refund procesu
- Mogućnost rješavanja problema ako se refund ne završi
- Dokaz refunda za računovodstvo

**Prednosti:**
- Transparentnost u refund procesu
- Mogućnost praćenja statusa refunda
- Lako rješavanje problema
- Dokaz refunda za administrativne svrhe

Stripe refund ID tracking omogućava vam praćenje refunda direktno u Stripe-u!
`
    },
    "Fallback na interne kredite ako Stripe refund ne uspije": {
      implemented: true,
      summary: "Ako Stripe refund ne uspije iz bilo kojeg razloga, sustav automatski vraća kredite kao interne kredite kako biste bili zaštićeni.",
      details: `## Kako funkcionira:

Ako se refund pokuša preko Stripe-a, ali ne uspije iz bilo kojeg razloga (npr. bankovna greška, Stripe greška), sustav automatski vraća kredite kao interne kredite.

**Kako funkcionira:**
- Pokuša se Stripe refund
- Ako Stripe refund ne uspije, sustav automatski prelazi na interne kredite
- Krediti se vraćaju na vaš račun kao interne kredite
- Primite notifikaciju o refundu i načinu refunda

**Zašto je važno:**
- Zaštićeni ste od Stripe grešaka
- Refund se uvijek završi, bez obzira na greške
- Ne gubite kredite zbog tehničkih problema
- Fer sustav za sve providere

**Prednosti:**
- Automatski fallback ako Stripe ne uspije
- Zaštićeni ste od tehničkih grešaka
- Refund se uvijek završi
- Transparentan proces

Fallback na interne kredite osigurava da refund uvijek završi, čak i ako Stripe ne uspije!
`
    },
    "Pregled trenutne pretplate": {
      implemented: true,
      summary: "Vidite sve detalje vaše trenutne pretplate - koji plan imate, kada istječe, koliko kredita imate, itd.",
      details: `## Kako funkcionira:

Na stranici pretplata vidite sve detalje vaše trenutne pretplate - koji plan imate, kada istječe, koliko kredita imate i druge informacije.

**Što vidite:**
- Trenutni plan pretplate (BASIC, PREMIUM, PRO)
- Datum početka pretplate
- Datum isteka pretplate
- Status pretplate (ACTIVE, CANCELLED, EXPIRED)
- Trenutni broj kredita na računu
- Mjesečni krediti koje dobivate
- Povijest pretplata

**Kako koristiti:**
- Pregledavate sve informacije o pretplati
- Planirate budžet na temelju kredita
- Odlučujete trebate li nadograditi plan
- Pratite kada pretplata istječe

**Prednosti:**
- Kompletan pregled pretplate na jednom mjestu
- Lako planiranje budžeta
- Transparentnost u pretplati
- Mogućnost nadogradnje ili otkazivanja

Pregled trenutne pretplate omogućava vam potpunu kontrolu nad vašom pretplatom!
`
    },
    "Dostupni planovi (BASIC, PREMIUM, PRO)": {
      implemented: true,
      summary: "Tri plana pretplate s različitim količinama kredita i funkcionalnosti - odaberite plan koji vam odgovara.",
      details: `## Kako funkcionira:

Platforma nudi tri plana pretplate s različitim količinama kredita i funkcionalnosti - odaberite plan koji najbolje odgovara vašim potrebama.

**Dostupni planovi:**
- **BASIC** - Osnovni plan s ograničenim kreditima i funkcionalnostima
- **PREMIUM** - Srednji plan s više kredita i dodatnim funkcionalnostima
- **PRO** - Najnapredniji plan s najviše kredita i svim funkcionalnostima

**Razlike između planova:**
- Različiti brojevi mjesečnih kredita
- Različite funkcionalnosti (npr. ROI dashboard, white-label, itd.)
- Različite cijene pretplata
- Različiti benefiti

**Kako odabrati:**
- Pregledate funkcionalnosti svakog plana
- Odlučite koliko kredita vam treba
- Odaberete plan koji odgovara vašem budžetu
- Možete nadograditi plan kasnije

**Prednosti:**
- Fleksibilnost u odabiru plana
- Mogućnost nadogradnje
- Različite opcije za različite potrebe
- Transparentne cijene

Dostupni planovi omogućavaju vam odabir pretplate koja najbolje odgovara vašim potrebama!
`
    },
    "Nadogradnja pretplate": {
      implemented: true,
      summary: "Možete nadograditi pretplatu na viši plan u bilo kojem trenutku - razlika se naplaćuje proporcionalno.",
      details: `## Kako funkcionira:

Možete nadograditi pretplatu na viši plan (npr. BASIC na PREMIUM) u bilo kojem trenutku - razlika se naplaćuje proporcionalno.

**Kako funkcionira:**
- Odaberete plan na koji želite nadograditi
- Sustav izračunava razliku u cijeni proporcionalno preostalim danima
- Plaćate razliku preko Stripe-a
- Pretplata se automatski ažurira na novi plan
- Dodatni krediti se dodaju odmah

**Kada nadograditi:**
- Kada trebate više kredita
- Kada trebate dodatne funkcionalnosti
- Kada vaš posao raste i trebate više leadova
- Kada želite probati naprednije funkcionalnosti

**Prednosti:**
- Fleksibilnost - možete nadograditi kad god
- Proporcionalna naplata - plaćate samo za preostale dane
- Dodatni krediti odmah
- Nema obvezujućih ugovora

**Obrnuto:**
- Ne možete smanjiti plan unutar istog razdoblja
- Možete otkazati pretplatu i pretplatiti se na niži plan sljedeći mjesec

Nadogradnja pretplate omogućava vam rast vašeg poslovanja bez čekanja kraja mjeseca!
`
    },
    "Otkazivanje pretplate": {
      implemented: true,
      summary: "Možete otkazati pretplatu u bilo kojem trenutku - pretplata traje do kraja obračunskog razdoblja, krediti ostaju.",
      details: `## Kako funkcionira:

Možete otkazati pretplatu u bilo kojem trenutku - pretplata traje do kraja obračunskog razdoblja, a krediti koje ste dobili ostaju na vašem računu.

**Kako funkcionira:**
- Kliknete "Otkazi pretplatu"
- Potvrdite otkazivanje
- Pretplata se automatski otkazuje
- Pretplata traje do kraja obračunskog razdoblja (do kraja mjeseca)
- Krediti koje ste dobili ostaju na vašem računu

**Što se događa:**
- Pretplata se ne obnavlja sljedeći mjesec
- Možete i dalje koristiti kredite koje ste dobili
- Nema dodatnih naplata
- Status pretplate postaje CANCELLED nakon isteka

**Prednosti:**
- Sloboda otkazivanja kad god želite
- Nema obvezujućih ugovora
- Krediti koje ste dobili ostaju
- Transparentan proces

**Napomena:**
- Krediti koje ste dobili ostaju na računu
- Možete se ponovno pretplatiti bilo kada
- Nema penala za otkazivanje

Otkazivanje pretplate omogućava vam slobodu bez obvezujućih ugovora!
`
    },
    "Status pretplate (ACTIVE, CANCELLED, EXPIRED)": {
      implemented: true,
      summary: "Svaka pretplata ima status koji pokazuje trenutno stanje - aktivna, otkazana ili istekla.",
      details: `## Kako funkcionira:

Svaka pretplata ima status koji pokazuje gdje se nalazi u procesu - aktivna, otkazana ili istekla.

**Statusi pretplate:**
- **ACTIVE** - Pretplata je aktivna i obnavlja se automatski svaki mjesec
- **CANCELLED** - Pretplata je otkazana, ali još traje do kraja obračunskog razdoblja
- **EXPIRED** - Pretplata je istekla, više se ne obnavlja

**Kako se koristi:**
- Vidite trenutni status vaše pretplate
- Znate kada pretplata istječe
- Razumijete što se događa s vašom pretplatom
- Planirate budžet na temelju statusa

**Prednosti:**
- Transparentnost u statusu pretplate
- Lako praćenje statusa
- Razumijevanje što se događa s pretplatom
- Realna očekivanja o pretplati

Status pretplate omogućava vam praćenje vaše pretplate kroz cijeli životni ciklus!
`
    },
    "Automatsko isteka pretplate": {
      implemented: true,
      summary: "Ako pretplata istječe (npr. zbog neuspjelog plaćanja), automatski se označava kao istekla i vraća na BASIC plan.",
      details: `## Kako funkcionira:

Ako pretplata istječe (npr. zbog neuspjelog plaćanja), automatski se označava kao istekla i vaš račun se vraća na BASIC plan.

**Kako funkcionira:**
- Ako se plaćanje ne uspije, pretplata se automatski označava kao EXPIRED
- Status pretplate se mijenja u EXPIRED
- Vaš račun se vraća na BASIC plan (osim ako ste već na BASIC planu)
- Krediti koje ste dobili ostaju na računu

**Zašto se događa:**
- Neuspjelo plaćanje (npr. nedovoljno sredstava na kartici)
- Otkazana kartica ili bankovni račun
- Ažuriranje Stripe-a ne uspije

**Što se događa:**
- Pretplata se ne obnavlja
- Status postaje EXPIRED
- Vaš račun se vraća na BASIC plan
- Možete se ponovno pretplatiti bilo kada

**Prednosti:**
- Automatski proces - nema ručne intervencije
- Transparentan proces
- Krediti ostaju na računu
- Mogućnost ponovne pretplate

Automatsko isteka pretplate osigurava transparentnost i jednostavnost u upravljanju pretplatom!
`
    },
    "Notifikacije o isteku pretplate": {
      implemented: true,
      summary: "Primajte obavijesti prije nego pretplata istječe - podsjetnici 7 dana prije, 3 dana prije i na dan isteka.",
      details: `## Kako funkcionira:

Primajte obavijesti prije nego pretplata istječe - podsjetnici 7 dana prije, 3 dana prije i na dan isteka kako ne biste propustili obnovu.

**Kada primite notifikaciju:**
- 7 dana prije isteka pretplate
- 3 dana prije isteka pretplate
- Na dan isteka pretplate
- Ako se plaćanje ne uspije

**Što notifikacija sadrži:**
- Datum isteka pretplate
- Trenutni plan pretplate
- Podsjetnik o obnovi pretplate
- Link za obnovu pretplate

**Zašto je važno:**
- Ne propustite obnovu pretplate
- Imate dovoljno vremena za ažuriranje plaćanja
- Ne gubite pristup funkcionalnostima
- Planirate budžet za obnovu

**Kako reagirati:**
- Proverite informacije o pretplati
- Ažurirajte plaćanje ako je potrebno
- Obnovite pretplatu prije isteka

Notifikacije o isteku pretplate osiguravaju da ne propustite obnovu pretplate!
`
    },
    "Povijest pretplata": {
      implemented: true,
      summary: "Vidite sve vaše prethodne pretplate - kada ste se pretplatili, kada ste otkazali, koje planove ste imali.",
      details: `## Kako funkcionira:

U povijesti pretplata vidite sve vaše prethodne pretplate - kada ste se pretplatili, kada ste otkazali, koje planove ste imali i druge informacije.

**Što vidite:**
- Svi prethodni planovi pretplate
- Datumi početka i kraja svake pretplate
- Status svake pretplate (ACTIVE, CANCELLED, EXPIRED)
- Mjesečne kredite koje ste dobivali
- Cijene pretplata

**Kako koristiti:**
- Pregledavate svoju povijest pretplata
- Vidite koliko ste vremena bili na svakom planu
- Pratite promjene planova tijekom vremena
- Analizirate potrošnju kredita

**Prednosti:**
- Kompletna povijest pretplata
- Lako praćenje promjena
- Transparentnost u pretplati
- Mogućnost analize potrošnje

**Zašto je korisno:**
- Razumijete kako se vaša pretplata mijenjala tijekom vremena
- Planirate budžet na temelju povijesti
- Vidite trendove u potrošnji kredita

Povijest pretplata omogućava vam potpuni uvid u sve vaše prethodne pretplate!
`
    },
    "Trial period (7 dana)": {
      implemented: true,
      summary: "Dobivate 7 dana besplatnog trial perioda za svaki novi plan - isprobajte funkcionalnosti prije nego se pretplatite.",
      details: `## Kako funkcionira:

Kada se prvi put pretplatite na plan, dobivate 7 dana besplatnog trial perioda - isprobajte sve funkcionalnosti prije nego se pretplatite.

**Kako funkcionira:**
- Kada se prvi put pretplatite na bilo koji plan, dobivate 7 dana besplatnog trial perioda
- Tijekom trial perioda možete koristiti sve funkcionalnosti plana
- Ne naplaćuje se ništa tijekom trial perioda
- Nakon 7 dana, ako ne otkazate, pretplata se automatski aktivira

**Što dobivate:**
- Pristup svim funkcionalnostima plana
- Besplatni krediti za isprobavanje (5 leadova)
- Mogućnost otkazivanja bez naplate
- Puna funkcionalnost plana

**Prednosti:**
- Isprobate funkcionalnosti prije plaćanja
- Bez rizika - možete otkazati prije plaćanja
- Besplatno testiranje
- Puna funkcionalnost tijekom trial perioda

**Kako otkazati:**
- Možete otkazati bilo kada tijekom trial perioda
- Ako otkazate prije kraja, ne naplaćuje se ništa
- Pretplata se ne aktivira ako otkazate tijekom trial perioda

Trial period omogućava vam isprobavanje funkcionalnosti bez rizika!
`
    },
    "Besplatni krediti za trial (5 leadova)": {
      implemented: true,
      summary: "Tijekom trial perioda dobivate besplatnih 5 kredita (5 leadova) za isprobavanje sustava bez rizika.",
      details: `## Kako funkcionira:

Tijekom trial perioda dobivate besplatnih 5 kredita (dovoljno za 5 leadova) za isprobavanje sustava bez rizika.

**Kako funkcionira:**
- Kada se pretplatite na trial, automatski dobivate 5 besplatnih kredita
- Možete kupiti do 5 leadova tijekom trial perioda
- Krediti su besplatni - ne naplaćuje se ništa
- Nakon trial perioda, krediti se ne vraćaju, ali možete koristiti nove kredite iz pretplate

**Zašto je korisno:**
- Isprobate sustav bez rizika
- Vidite kako funkcioniraju leadovi
- Testirate ROI i konverziju
- Razumijete vrijednost sustava

**Prednosti:**
- Besplatno isprobavanje
- Bez rizika
- Realna iskustva s leadovima
- Mogućnost testiranja bez ulaganja

**Kako koristiti:**
- Kupite leadove tijekom trial perioda
- Testirate kontaktiranje klijenata
- Vidite kako funkcionira sustav
- Donosite informiranu odluku o pretplati

Besplatni krediti za trial omogućavaju vam realno isprobavanje sustava bez rizika!
`
    },
    "Automatsko vraćanje na BASIC plan": {
      implemented: true,
      summary: "Ako pretplata istječe ili se otkaže, vaš račun se automatski vraća na BASIC plan s osnovnim funkcionalnostima.",
      details: `## Kako funkcionira:

Ako pretplata istječe ili se otkaže, vaš račun se automatski vraća na BASIC plan s osnovnim funkcionalnostima.

**Kako funkcionira:**
- Ako pretplata istječe, status postaje EXPIRED
- Vaš račun se automatski vraća na BASIC plan
- Gubite pristup PREMIUM ili PRO funkcionalnostima
- Zadržavate osnovne funkcionalnosti BASIC plana

**Kada se vraća:**
- Kada pretplata istječe
- Kada otkazete pretplatu i ona istječe
- Kada se plaćanje ne uspije

**Što zadržavate:**
- Osnovne funkcionalnosti BASIC plana
- Krediti koje ste dobili ostaju na računu
- Pristup osnovnim funkcionalnostima
- Povijest leadova i transakcija

**Prednosti:**
- Nema naglog gubitka pristupa
- Postupni prijelaz na BASIC plan
- Krediti ostaju na računu
- Mogućnost ponovne pretplate

Automatsko vraćanje na BASIC plan osigurava kontinuitet vašeg poslovanja!
`
    },
    "Upload dokumenata licenci": {
      implemented: true,
      summary: "Prenesite dokumente svojih licenci na platformu - admini će ih verificirati i prikazati na vašem profilu.",
      details: `## Kako funkcionira:

Možete prenijeti dokumente svojih licenci na platformu kako bi korisnici vidjeli da ste licencirani i verificirani.

**Kako prenijeti:**
- Odaberete tip licence
- Prenesete dokument licence (PDF, JPG, PNG)
- Unesete broj licence i datum izdavanja
- Odaberete tijelo koje je izdalo licencu
- Admini pregledaju i verificiraju licencu

**Tipovi licenci:**
- Elektrotehnička
- Građevinska
- Vodoinstalaterska
- Krovopokrivačka
- Ostali tipovi ovisno o kategoriji

**Zašto je važno:**
- Korisnici vidje da ste licencirani
- Privlačite korisnike koji traže licencirane pružatelje
- Gradite povjerenje i profesionalnost
- Razlikujete se od nelicenciranih pružatelja

**Prednosti:**
- Povećava povjerenje korisnika
- Privlačite ozbiljnije klijente
- Dokaz profesionalnosti
- Razlikovanje od konkurencije

Upload dokumenata licenci omogućava vam dokaz vaše profesionalnosti i privlačenje ozbiljnih klijenata!
`
    },
    "Praćenje isteka licenci": {
      implemented: true,
      summary: "Sustav automatski prati kada vam licence istječu - primajte obavijesti 30, 14, 7 i 1 dan prije isteka.",
      details: `## Kako funkcionira:

Sustav automatski prati datum isteka vaših licenci i šalje vam obavijesti prije nego licence istječu.

**Kada primite obavijest:**
- 30 dana prije isteka licence
- 14 dana prije isteka licence
- 7 dana prije isteka licence
- 1 dan prije isteka licence
- Na dan isteka licence

**Što notifikacija sadrži:**
- Tip licence koja istječe
- Broj licence
- Datum isteka
- Podsjetnik za obnovu licence
- Link za ažuriranje licence

**Zašto je važno:**
- Ne propustite obnovu licence
- Imate dovoljno vremena za obnovu
- Ne gubite status licenciranog pružatelja
- Planirate obnovu unaprijed

**Kako reagirati:**
- Obnovite licencu prije isteka
- Ažurirajte datum isteka na platformi
- Prenesite novi dokument licence ako je potrebno

Praćenje isteka licenci osigurava da ne propustite obnovu i zadržavate status licenciranog pružatelja!
`
    },
    "Različiti tipovi licenci po kategorijama": {
      implemented: true,
      summary: "Različite kategorije zahtijevaju različite tipove licenci - npr. Elektrotehnička za električarske poslove, Građevinska za građevinske radove.",
      details: `## Kako funkcionira:

Različite kategorije usluga zahtijevaju različite tipove licenci - platforma podržava različite tipove licenci ovisno o kategoriji.

**Tipovi licenci:**
- **Elektrotehnička** - Za električarske poslove
- **Građevinska** - Za građevinske radove
- **Vodoinstalaterska** - Za vodoinstalaterske poslove
- **Krovopokrivačka** - Za krovopokrivačke radove
- **Ostali tipovi** - Ovisno o kategoriji

**Kako funkcionira:**
- Odaberete kategoriju usluge
- Vidite koje tipove licenci ta kategorija zahtijeva
- Prenesete odgovarajuće licence
- Licenca se povezuje s kategorijom

**Zašto je važno:**
- Korisnici vidje da ste licencirani za specifičnu kategoriju
- Privlačite korisnike koji traže licencirane pružatelje
- Gradite povjerenje u svoju profesionalnost
- Razlikujete se od nelicenciranih pružatelja

**Prednosti:**
- Precizniji prikaz vaših kompetencija
- Privlačite relevantne klijente
- Gradite povjerenje
- Razlikovanje od konkurencije

Različiti tipovi licenci omogućavaju vam dokaz vaše profesionalnosti za specifične kategorije!
`
    },
    "Tijela koja izdaju licence": {
      implemented: true,
      summary: "Navedite tijelo koje je izdalo vašu licencu - npr. Ministarstvo graditeljstva, Hrvatska komora inženjera, itd.",
      details: `## Kako funkcionira:

Prilikom unosa licence, navedite tijelo koje je izdalo vašu licencu - to pomaže korisnicima razumjeti važnost i valjanost licence.

**Primjeri tijela koja izdaju licence:**
- Ministarstvo graditeljstva i prostornog uređenja
- Hrvatska komora inženjera
- Hrvatski zavod za norme
- Gradska/tvrtke koje izdaju licence
- Ostala tijela ovisno o tipu licence

**Kako funkcionira:**
- Odaberete tijelo koje je izdalo licencu iz padajućeg popisa
- Ili unesete vlastito tijelo ako ga nema na popisu
- Tijelo se prikazuje uz licencu na vašem profilu
- Admini mogu verificirati licencu preko tijela

**Zašto je važno:**
- Korisnici vidje tko je izdao licencu
- Gradite povjerenje u valjanost licence
- Privlačite korisnike koji traže licencirane pružatelje
- Razlikujete se od nelicenciranih pružatelja

**Prednosti:**
- Transparentnost u izvoru licence
- Gradite povjerenje
- Privlačite ozbiljnije klijente
- Razlikovanje od konkurencije

Tijela koja izdaju licence omogućavaju vam dokaz valjanosti vaše licence i privlačenje ozbiljnih klijenata!
`
    },
    "Broj licence i datum izdavanja": {
      implemented: true,
      summary: "Unesite broj licence i datum izdavanja kako bi admini mogli verificirati licencu i korisnici vidjeli detalje.",
      details: `## Kako funkcionira:

Prilikom unosa licence, unesite broj licence i datum izdavanja kako bi admini mogli verificirati licencu i korisnici vidjeli detalje.

**Kako funkcionira:**
- Unesete broj licence iz dokumenta
- Unesete datum izdavanja licence
- Informacije se prikazuju na vašem profilu
- Admini mogu verificirati licencu preko broja i datuma

**Zašto je važno:**
- Admini mogu verificirati licencu
- Korisnici vidje detalje vaše licence
- Gradite povjerenje u valjanost licence
- Transparentnost u licenciranju

**Prednosti:**
- Mogućnost verifikacije
- Transparentnost za korisnike
- Gradite povjerenje
- Dokaz profesionalnosti

Broj licence i datum izdavanja omogućavaju verifikaciju i transparentnost u licenciranju!
`
    },
    "Trust score sustav (0-100)": {
      implemented: true,
      summary: "Svaki klijent dobiva trust score od 0 do 100 na temelju verifikacija - viši score znači kvalitetniji leadovi.",
      details: `## Kako funkcionira:

Svaki klijent dobiva trust score od 0 do 100 na temelju različitih verifikacija - viši score znači kvalitetniji i pouzdaniji klijenti.

**Kako se računa:**
- Email verifikacija dodaje bodove
- Telefon verifikacija (SMS) dodaje bodove
- OIB verifikacija dodaje bodove
- Tvrtka verifikacija (sudski registar) dodaje bodove
- Povijest na platformi dodaje bodove

**Raspon score-a:**
- **0-39** - Nizak trust score (malo verifikacija)
- **40-59** - Prosječan trust score (neke verifikacije)
- **60-79** - Visok trust score (većina verifikacija)
- **80-100** - Vrlo visok trust score (sve verifikacije)

**Zašto je važno:**
- Viši trust score znači kvalitetnije leadove
- Veća šansa za konverziju s visokim trust score
- Manje rizika od neozbiljnih upita
- Bolje ROI s kvalitetnijim leadovima

**Kako se koristi:**
- AI score kvalitete uključuje trust score
- Možete filtrirati leadove prema trust score
- Viši trust score = viša cijena leada

Trust score sustav osigurava kvalitetu leadova i veću šansu za uspjeh!
`
    },
    "Verificiranje telefona": {
      implemented: true,
      summary: "Klijenti mogu verificirati svoj telefon SMS kodom - verificirani telefon znači veći trust score.",
      details: `## Kako funkcionira:

Klijenti mogu verificirati svoj telefon SMS kodom koji stiže na njihov broj - verificirani telefon znači veći trust score i kvalitetnije leadove.

**Kako funkcionira:**
- Klijent unese svoj telefon
- Platforma šalje SMS kod na telefon
- Klijent unese kod za verifikaciju
- Telefon se označava kao verificiran
- Trust score se povećava

**Zašto je važno:**
- Verificirani telefon znači pouzdaniji klijent
- Veći trust score za klijenta
- Kvalitetniji leadovi za providere
- Manje rizika od neozbiljnih upita

**Prednosti:**
- Veća pouzdanost klijenata
- Kvalitetniji leadovi
- Veća šansa za konverziju
- Manje rizika

Verificiranje telefona osigurava pouzdanost klijenata i kvalitetu leadova!
`
    },
    "Verificiranje emaila": {
      implemented: true,
      summary: "Klijenti mogu verificirati svoj email klikom na link - verificirani email znači veći trust score.",
      details: `## Kako funkcionira:

Klijenti mogu verificirati svoj email klikom na verifikacijski link koji stiže na njihov email - verificirani email znači veći trust score.

**Kako funkcionira:**
- Klijent unese svoj email
- Platforma šalje verifikacijski link na email
- Klijent klikne na link
- Email se označava kao verificiran
- Trust score se povećava

**Zašto je važno:**
- Verificirani email znači pouzdaniji klijent
- Veći trust score za klijenta
- Kvalitetniji leadovi za providere
- Manje rizika od neozbiljnih upita

**Prednosti:**
- Veća pouzdanost klijenata
- Kvalitetniji leadovi
- Veća šansa za konverziju
- Manje rizika

Verificiranje emaila osigurava pouzdanost klijenata i kvalitetu leadova!
`
    },
    "Verificiranje OIB-a": {
      implemented: true,
      summary: "Klijenti mogu verificirati svoj OIB - verificirani OIB znači veći trust score i pouzdaniji klijent.",
      details: `## Kako funkcionira:

Klijenti mogu verificirati svoj OIB (Osobni Identifikacijski Broj) - verificirani OIB znači veći trust score i pouzdaniji klijent.

**Kako funkcionira:**
- Klijent unese svoj OIB
- Platforma provjerava valjanost OIB-a
- Ako je OIB valjan, označava se kao verificiran
- Trust score se povećava

**Zašto je važno:**
- Verificirani OIB znači pouzdaniji klijent
- Veći trust score za klijenta
- Kvalitetniji leadovi za providere
- Manje rizika od neozbiljnih upita

**Prednosti:**
- Veća pouzdanost klijenata
- Kvalitetniji leadovi
- Veća šansa za konverziju
- Manje rizika

Verificiranje OIB-a osigurava pouzdanost klijenata i kvalitetu leadova!
`
    },
    "Verificiranje firme (sudski registar)": {
      implemented: true,
      summary: "Klijenti mogu verificirati svoju firmu kroz sudski registar - verificirana firma znači veći trust score.",
      details: `## Kako funkcionira:

Klijenti mogu verificirati svoju firmu kroz sudski registar - verificirana firma znači veći trust score i pouzdaniji klijent.

**Kako funkcionira:**
- Klijent unese podatke o firmi (OIB, naziv)
- Platforma provjerava firmu u sudskom registru
- Ako se firma pronađe, označava se kao verificirana
- Trust score se značajno povećava

**Zašto je važno:**
- Verificirana firma znači pouzdaniji klijent
- Veći trust score za klijenta
- Kvalitetniji leadovi za providere
- Manje rizika od neozbiljnih upita
- Veća šansa za ozbiljne poslove

**Prednosti:**
- Veća pouzdanost klijenata
- Kvalitetniji leadovi
- Veća šansa za konverziju
- Manje rizika
- Ozbiljniji klijenti

Verificiranje firme osigurava pouzdanost klijenata i kvalitetu leadova!
`
    },
    "Kvaliteta leadova na osnovu verifikacije": {
      implemented: true,
      summary: "AI score kvalitete leadova uključuje trust score klijenta - više verifikacija = viši score = kvalitetniji leadovi.",
      details: `## Kako funkcionira:

AI score kvalitete leadova uključuje trust score klijenta - što više verifikacija klijent ima, to viši trust score i kvalitetniji leadovi.

**Kako funkcionira:**
- AI score kvalitete uključuje trust score klijenta
- Više verifikacija = viši trust score = viši AI score
- Viši AI score = kvalitetniji leadovi
- Kvalitetniji leadovi = veća cijena, ali veća šansa za konverziju

**Faktori koji utječu:**
- Email verifikacija
- Telefon verifikacija
- OIB verifikacija
- Firma verifikacija
- Povijest na platformi

**Zašto je važno:**
- Kvalitetniji leadovi = veća šansa za konverziju
- Viša cijena = veći ROI ako konvertirate
- Manje rizika od neozbiljnih upita
- Bolje planiranje budžeta

**Prednosti:**
- Kvalitetniji leadovi
- Veća šansa za konverziju
- Manje rizika
- Bolje ROI

Kvaliteta leadova na osnovu verifikacije osigurava kvalitetne leadove i veću šansu za uspjeh!
`
    },
    "Detaljno praćenje kredita": {
      implemented: true,
      summary: "Svaka transakcija kredita se detaljno bilježi - kada ste dodali, trošili ili refundirali kredite, s potpunom poviješću.",
      details: `## Kako funkcionira:

Svaka transakcija kredita se detaljno bilježi u povijesti kredita - vidite kada ste dodali, trošili ili refundirali kredite, s potpunom poviješću.

**Što vidite:**
- Datum i vrijeme svake transakcije
- Tip transakcije (PURCHASE, LEAD_PURCHASE, REFUND, BONUS, SUBSCRIPTION, ADMIN_ADJUST)
- Iznos kredita (dodano ili potrošeno)
- Stanje nakon transakcije
- Opis transakcije (npr. "Kupnja leada #123")
- Povezanost s leadom ili pretplatom

**Kako koristiti:**
- Pregledavate povijest svih transakcija
- Vidite detalje svake transakcije
- Pratite trošenje i dodavanje kredita
- Filtrirate transakcije po tipu

**Prednosti:**
- Kompletna transparentnost u kreditima
- Lako praćenje trošenja i dodavanja
- Mogućnost analize potrošnje
- Dokaz za računovodstvo

Detaljno praćenje kredita omogućava vam potpunu transparentnost u upravljanju kreditima!
`
    },
    "Različiti tipovi transakcija": {
      implemented: true,
      summary: "Svaka transakcija ima tip koji pokazuje što se dogodilo - kupnja leada, refund, bonus, pretplata, itd.",
      details: `## Kako funkcionira:

Svaka transakcija kredita ima tip koji pokazuje što se dogodilo - to vam omogućava razumijevanje svake transakcije.

**Tipovi transakcija:**
- **PURCHASE** - Kupnja kredita direktno
- **LEAD_PURCHASE** - Kupnja leada (trošenje kredita)
- **REFUND** - Refund leada (povrat kredita)
- **BONUS** - Bonus krediti (npr. trial period)
- **SUBSCRIPTION** - Mjesečni krediti iz pretplate
- **ADMIN_ADJUST** - Administrativna prilagodba (dodatno ili oduzeto)

**Kako se koristi:**
- Vidite tip svake transakcije
- Razumijete zašto su krediti dodani ili oduzeti
- Filtrirate transakcije po tipu
- Analizirate potrošnju po tipovima

**Prednosti:**
- Jasna klasifikacija transakcija
- Lako razumijevanje svake transakcije
- Mogućnost filtriranja i analize
- Transparentnost u upravljanju kreditima

Različiti tipovi transakcija omogućavaju vam jasnu klasifikaciju svake transakcije!
`
    },
    "Povezivanje s poslovima": {
      implemented: true,
      summary: "Transakcije kredita se povezuju s poslovima - vidite za koji posao ste trošili kredite i koliko ste zaradili.",
      details: `## Kako funkcionira:

Transakcije kredita se povezuju s poslovima - vidite za koji posao ste trošili kredite i koliko ste zaradili od tog posla.

**Kako funkcionira:**
- Kupite lead za posao
- Transakcija se povezuje s tim poslom
- Vidite koliko ste potrošili kredita za taj posao
- Ako konvertirate lead, vidite koliko ste zaradili
- ROI se automatski izračunava po poslu

**Što vidite:**
- Posao za koji ste trošili kredite
- Broj kredita potrošenih za posao
- Status posla (konvertiran, ne konvertiran)
- ROI po poslu
- Ukupan prihod od posla

**Prednosti:**
- Lako praćenje ROI po poslovima
- Identificiranje profitabilnih poslova
- Optimizacija strategije kupovine leadova
- Transparentnost u trošenju kredita

Povezivanje s poslovima omogućava vam praćenje ROI po svakom poslu!
`
    },
    "Povezivanje s kupnjama leadova": {
      implemented: true,
      summary: "Svaka kupnja leada stvara transakciju kredita koja se povezuje s tim leadom - vidite detalje svake kupovine.",
      details: `## Kako funkcionira:

Svaka kupnja leada stvara transakciju kredita koja se povezuje s tim leadom - vidite detalje svake kupovine u povijesti.

**Kako funkcionira:**
- Kupite lead
- Transakcija tipa LEAD_PURCHASE se kreira
- Transakcija se povezuje s leadom
- Vidite detalje leada u transakciji
- Ako se lead refundira, vidite refund transakciju

**Što vidite:**
- Lead koji ste kupili
- Broj kredita potrošenih za lead
- Status leada (ACTIVE, CONTACTED, CONVERTED, REFUNDED)
- AI score leada
- Kategorija i lokacija leada

**Prednosti:**
- Lako praćenje svih kupovina leadova
- Identificiranje profitabilnih leadova
- Analiza potrošnje po leadovima
- Transparentnost u kupovinama

Povezivanje s kupnjama leadova omogućava vam praćenje svih vaših kupovina leadova!
`
    },
    "Stanje nakon svake transakcije": {
      implemented: true,
      summary: "Nakon svake transakcije vidite novo stanje kredita - znate koliko kredita imate nakon svake akcije.",
      details: `## Kako funkcionira:

Nakon svake transakcije kredita vidite novo stanje kredita - znate koliko kredita imate nakon svake akcije (dodavanje, trošenje, refund).

**Kako funkcionira:**
- Napravite transakciju (kupnja leada, refund, itd.)
- Sustav automatski izračunava novo stanje
- Novo stanje se prikazuje u transakciji
- Vidite trenutno stanje kredita na dashboardu

**Što vidite:**
- Stanje prije transakcije
- Iznos transakcije
- Stanje nakon transakcije
- Trenutno stanje kredita

**Zašto je važno:**
- Znate koliko kredita imate u svakom trenutku
- Lako praćenje promjena stanja
- Transparentnost u upravljanju kreditima
- Mogućnost planiranja budžeta

**Prednosti:**
- Real-time stanje kredita
- Transparentnost u svakoj transakciji
- Lako praćenje promjena
- Mogućnost planiranja

Stanje nakon svake transakcije omogućava vam real-time praćenje vaših kredita!
`
    },
    "Opisi transakcija": {
      implemented: true,
      summary: "Svaka transakcija ima opis koji objašnjava što se dogodilo - npr. 'Kupnja leada #123', 'Refund leada #456'.",
      details: `## Kako funkcionira:

Svaka transakcija kredita ima opis koji objašnjava što se dogodilo - to vam omogućava brzo razumijevanje svake transakcije.

**Primjeri opisa:**
- "Kupnja leada #123 - Električarski posao, Zagreb"
- "Refund leada #456 - Klijent nije odgovorio"
- "Mjesečni krediti iz PREMIUM pretplate"
- "Bonus krediti za trial period"
- "Administrativna prilagodba - dodatni krediti"

**Zašto je važno:**
- Brzo razumijevanje svake transakcije
- Lako praćenje razloga transakcija
- Transparentnost u upravljanju kreditima
- Mogućnost pretraživanja transakcija

**Kako se koristi:**
- Pregledavate opise transakcija
- Pretražujete transakcije prema opisu
- Razumijete razlog svake transakcije
- Analizirate potrošnju na temelju opisa

**Prednosti:**
- Jasno objašnjenje svake transakcije
- Lako pretraživanje
- Transparentnost
- Mogućnost analize

Opisi transakcija omogućavaju vam brzo razumijevanje svake transakcije!
`
    },
    "Stripe Checkout integracija": {
      implemented: true,
      summary: "Plaćanje pretplata preko Stripe Checkout - sigurno i brzo plaćanje karticom ili drugim načinom plaćanja.",
      details: `## Kako funkcionira:

Stripe Checkout omogućava vam sigurno i brzo plaćanje pretplata karticom ili drugim načinom plaćanja podržanim od Stripe-a.

**Kako funkcionira:**
- Odaberete plan pretplate
- Kliknete "Pretplati se"
- Stripe Checkout stranica se otvara
- Unesete podatke kartice ili odaberete spremljeni način plaćanja
- Plaćanje se obrađuje sigurno preko Stripe-a
- Nakon plaćanja, vraćate se na platformu

**Prednosti:**
- Sigurno plaćanje - Stripe rukovodi svim podacima kartice
- Podržava različite načine plaćanja (kartice, Apple Pay, Google Pay)
- Brz proces - samo nekoliko klikova
- Automatsko ažuriranje pretplate nakon plaćanja

**Zašto je sigurno:**
- Stripe je PCI DSS compliant
- Podaci kartice se nikada ne spremaju na našoj platformi
- SSL enkripcija za sve transakcije
- Zaštićeno od frauda

Stripe Checkout integracija osigurava sigurno i brzo plaćanje pretplata!
`
    },
    "Plaćanje pretplata preko Stripe": {
      implemented: true,
      summary: "Sve pretplate se plaćaju preko Stripe-a - sigurno, brzo i automatski obnavljanje svaki mjesec.",
      details: `## Kako funkcionira:

Sve pretplate se plaćaju preko Stripe-a - sigurno, brzo i automatsko obnavljanje svaki mjesec.

**Kako funkcionira:**
- Odaberete plan pretplate
- Unesete podatke kartice preko Stripe Checkout
- Prvo plaćanje se obrađuje odmah
- Stripe automatski obnavlja pretplatu svaki mjesec
- Krediti se dodaju na vaš račun svaki mjesec

**Prednosti:**
- Sigurno plaćanje
- Automatsko obnavljanje - nema ručnih plaćanja
- Podržava različite načine plaćanja
- Email potvrde o svakoj naplati

**Zašto je korisno:**
- Ne morate se sjećati plaćanja svaki mjesec
- Automatski dodavanje kredita
- Email potvrde za svaku naplatu
- Mogućnost ažuriranja načina plaćanja

Plaćanje pretplata preko Stripe-a osigurava bezbrižno upravljanje pretplatom!
`
    },
    "Stripe Payment Intent za kupovinu leadova": {
      implemented: true,
      summary: "Ako nemate dovoljno kredita, možete platiti lead direktno karticom preko Stripe Payment Intent - brzo i sigurno.",
      details: `## Kako funkcionira:

Ako nemate dovoljno internih kredita za kupovinu leada, možete platiti lead direktno karticom preko Stripe Payment Intent.

**Kako funkcionira:**
- Pokušate kupiti lead
- Ako nemate dovoljno kredita, sustav nudi plaćanje karticom
- Stripe Payment Intent se kreira
- Unesete podatke kartice
- Plaćanje se obrađuje sigurno
- Lead se automatski kupi nakon plaćanja

**Prednosti:**
- Ne morate čekati kupovinu kredita
- Brza kupovina leada
- Sigurno plaćanje
- Fleksibilnost u plaćanju

**Zašto je korisno:**
- Kupite lead čak i ako nemate kredite
- Ne gubite priliku dok kupujete kredite
- Brža kupovina leadova
- Veća fleksibilnost

Stripe Payment Intent omogućava vam kupovinu leadova čak i ako nemate internih kredita!
`
    },
    "Kreiranje Payment Intent-a za pojedinačnu kupovinu leada": {
      implemented: true,
      summary: "Za svaku kupovinu leada se kreira Payment Intent ako nemate dovoljno kredita - sigurno i jednostavno plaćanje.",
      details: `## Kako funkcionira:

Za svaku kupovinu leada se automatski kreira Payment Intent ako nemate dovoljno internih kredita - sigurno i jednostavno plaćanje.

**Kako funkcionira:**
- Pokušate kupiti lead
- Sustav provjerava imate li dovoljno kredita
- Ako nemate, kreira se Payment Intent za točno cijenu leada
- Unesete podatke kartice
- Plaćanje se obrađuje
- Lead se kupi nakon plaćanja

**Prednosti:**
- Plaćate točno cijenu leada (bez preplaćivanja)
- Sigurno plaćanje
- Brz proces
- Automatsko kreiranje

**Zašto je korisno:**
- Ne morate kupovati više kredita nego trebate
- Plaćate samo za lead koji kupujete
- Brža kupovina leadova
- Veća fleksibilnost

Kreiranje Payment Intent-a omogućava vam kupovinu leadova po točnoj cijeni!
`
    },
    "Plaćanje leadova kroz Stripe (opcionalno, umjesto internih kredita)": {
      implemented: true,
      summary: "Možete platiti lead direktno karticom preko Stripe-a umjesto internih kredita - fleksibilnost u plaćanju.",
      details: `## Kako funkcionira:

Možete platiti lead direktno karticom preko Stripe-a umjesto internih kredita - to vam daje fleksibilnost u načinu plaćanja.

**Kako funkcionira:**
- Pokušate kupiti lead
- Odaberete način plaćanja (interni krediti ili kartica)
- Ako odaberete karticu, Stripe Payment Intent se kreira
- Plaćanje se obrađuje sigurno
- Lead se kupi nakon plaćanja

**Prednosti:**
- Fleksibilnost u načinu plaćanja
- Ne morate kupovati kredite unaprijed
- Brža kupovina ako nemate kredita
- Veća kontrola nad plaćanjem

**Kada koristiti:**
- Ako nemate dovoljno internih kredita
- Ako želite platiti direktno karticom
- Ako ne želite kupovati kredite unaprijed
- Za jednokratne kupovine

Plaćanje leadova kroz Stripe omogućava vam fleksibilnost u načinu plaćanja!
`
    },
    "Stripe webhook handling": {
      implemented: true,
      summary: "Sustav automatski obrađuje Stripe webhooke - ažurira pretplate, kredite i status plaćanja u realnom vremenu.",
      details: `## Kako funkcionira:

Sustav automatski prima i obrađuje Stripe webhooke - ažurira pretplate, kredite i status plaćanja u realnom vremenu.

**Koje webhooke obrađuje:**
- **checkout.session.completed** - Pretplata je plaćena, aktivira se i dodaju se krediti
- **invoice.payment_succeeded** - Mjesečna naplata uspješna, dodaju se krediti
- **invoice.payment_failed** - Naplata neuspješna, pretplata se označava kao EXPIRED

**Kako funkcionira:**
- Stripe šalje webhook kada se dogodi nešto važno
- Sustav prima webhook i obrađuje ga
- Pretplata se automatski ažurira
- Krediti se dodaju na račun
- Status se ažurira u realnom vremenu

**Prednosti:**
- Automatsko ažuriranje - nema ručne intervencije
- Real-time status pretplate
- Pouzdanost - webhooki su idempotentni
- Transparentnost u procesu

**Zašto je važno:**
- Pretplata se aktivira odmah nakon plaćanja
- Krediti se dodaju automatski
- Ne propustite nove kredite zbog kašnjenja
- Status pretplate je uvijek točan

Stripe webhook handling osigurava automatsko i pouzdano upravljanje pretplatama!
`
    },
    "Automatsko ažuriranje pretplate nakon plaćanja": {
      implemented: true,
      summary: "Nakon što Stripe potvrdi plaćanje, pretplata se automatski aktivira i krediti se dodaju na vaš račun.",
      details: `## Kako funkcionira:

Nakon što Stripe potvrdi plaćanje preko webhooka, pretplata se automatski aktivira i krediti se dodaju na vaš račun.

**Kako funkcionira:**
- Plaćate pretplatu preko Stripe Checkout
- Stripe obrađuje plaćanje
- Stripe šalje webhook "checkout.session.completed"
- Sustav automatski aktivira pretplatu
- Krediti se dodaju na vaš račun
- Status pretplate postaje ACTIVE

**Prednosti:**
- Automatski proces - nema ručne intervencije
- Brza aktivacija pretplate
- Krediti su odmah dostupni
- Nema kašnjenja

**Zašto je važno:**
- Pretplata se aktivira odmah nakon plaćanja
- Krediti su dostupni odmah
- Ne morate čekati ručnu aktivaciju
- Real-time ažuriranje statusa

Automatsko ažuriranje pretplate osigurava brzu aktivaciju i dostupnost kredita!
`
    },
    "Payment success/failure handling": {
      implemented: true,
      summary: "Sustav automatski obrađuje uspjeh i neuspjeh plaćanja - aktivira pretplatu ili šalje obavijest o neuspjelom plaćanju.",
      details: `## Kako funkcionira:

Sustav automatski obrađuje uspjeh i neuspjeh plaćanja - aktivira pretplatu ako je plaćanje uspješno, ili šalje obavijest ako neuspješno.

**Uspješno plaćanje:**
- Stripe potvrdi plaćanje
- Webhook "checkout.session.completed" se šalje
- Pretplata se aktivira
- Krediti se dodaju
- Primite potvrdu o uspješnom plaćanju

**Neuspješno plaćanje:**
- Stripe detektira neuspješno plaćanje
- Webhook "invoice.payment_failed" se šalje
- Pretplata se označava kao EXPIRED
- Primite obavijest o neuspjelom plaćanju
- Možete ažurirati način plaćanja

**Prednosti:**
- Automatska obrada oba scenarija
- Transparentnost u statusu plaćanja
- Obavijesti o neuspjelim plaćanjima
- Mogućnost brze reakcije

Payment success/failure handling osigurava transparentnost i pouzdanost u plaćanju!
`
    },
    "Povrat na platformu nakon plaćanja": {
      implemented: true,
      summary: "Nakon što platite preko Stripe Checkout, automatski se vraćate na platformu s potvrdom o uspješnom plaćanju.",
      details: `## Kako funkcionira:

Nakon što platite preko Stripe Checkout, automatski se vraćate na platformu s potvrdom o uspješnom plaćanju i aktiviranom pretplatom.

**Kako funkcionira:**
- Plaćate preko Stripe Checkout stranice
- Stripe obrađuje plaćanje
- Stripe vas automatski vraća na platformu
- Vidite potvrdu o uspješnom plaćanju
- Pretplata je aktivna i krediti su dodani

**Prednosti:**
- Ne morate ručno vraćati na platformu
- Automatski povrat nakon plaćanja
- Potvrda o uspješnom plaćanju
- Pretplata je aktivna odmah

**Zašto je korisno:**
- Jednostavniji proces
- Nema ručnog vraćanja
- Brza aktivacija pretplate
- Transparentnost u procesu

Povrat na platformu nakon plaćanja osigurava jednostavnost i brzinu u procesu plaćanja!
`
    },
    "Sigurnosno skladištenje Stripe secret key u AWS Secrets Manager": {
      implemented: true,
      summary: "Svi Stripe API ključevi se sigurno spremaju u AWS Secrets Manager - ne mogu se pristupiti iz koda ili logova.",
      details: `## Kako funkcionira:

Svi Stripe API ključevi se sigurno spremaju u AWS Secrets Manager - ne mogu se pristupiti iz koda ili logova, samo aplikacija može pristupiti.

**Kako funkcionira:**
- Stripe API ključevi se spremaju u AWS Secrets Manager
- Aplikacija dohvaća ključeve pri pokretanju
- Ključevi se ne spremaju u kod ili logove
- Samo aplikacija ima pristup ključevima
- Automatski rotation ključeva ako je potrebno

**Zašto je važno:**
- Sigurnost - ključevi ne mogu biti ukradeni
- Compliance - zadovoljava sigurnosne standarde
- Centralizirano upravljanje ključevima
- Mogućnost rotation ključeva

**Prednosti:**
- Maksimalna sigurnost
- Compliance sa sigurnosnim standardima
- Centralizirano upravljanje
- Lako ažuriranje ključeva

Sigurnosno skladištenje osigurava maksimalnu sigurnost vaših Stripe podataka!
`
    },
    "Konverzija leadova": {
      implemented: true,
      summary: "Pratite koliko leadova konvertirate u poslove - stopa konverzije pokazuje koliko uspješno radite s leadovima.",
      details: `## Kako funkcionira:

Konverzija leadova pokazuje koliko leadova koje ste kupili su se pretvorile u stvarne poslove - to je ključna metrika uspješnosti.

**Kako se računa:**
- Kupite lead
- Kontaktirate klijenta
- Klijent prihvati vašu uslugu
- Lead se označava kao konvertiran
- Stopa konverzije = (broj konvertiranih leadova / ukupan broj kupnji leadova) × 100

**Zašto je važno:**
- Stopa konverzije pokazuje koliko uspješno radite s leadovima
- Viša stopa konverzije = bolji ROI
- Identificirate problematične leadove
- Optimizirate strategiju kupovine leadova

**Kako poboljšati:**
- Brži odgovor na leadove
- Bolje komunikacijske vještine
- Fokus na kvalitetnije leadove (viši AI score)
- Prilagođavanje cijena ponuda

Konverzija leadova osigurava da razumijete koliko uspješno radite s leadovima!
`
    },
    "Ukupan prihod od leadova": {
      implemented: true,
      summary: "Vidite koliko ste ukupno zaradili od leadova koje ste konvertirali - ukupan prihod pokazuje vaš uspjeh.",
      details: `## Kako funkcionira:

Ukupan prihod od leadova pokazuje koliko ste ukupno zaradili od leadova koje ste konvertirali u poslove.

**Kako se računa:**
- Kupite lead
- Konvertirate lead u posao
- Prihod od posla se dodaje u ukupan prihod
- Ukupan prihod = suma svih prihoda od konvertiranih leadova

**Što vidite:**
- Ukupan prihod od svih konvertiranih leadova
- Prosječni prihod po konvertiranom leadu
- Prihod po kategorijama
- Mjesečni prihod trendovi

**Zašto je važno:**
- Vidite koliko zaradite od leadova
- Planirate budžet za kupovinu leadova
- Razumijete ROI vaše investicije
- Optimizirate strategiju kupovine

Ukupan prihod od leadova omogućava vam praćenje vašeg uspjeha i ROI!
`
    },
    "Prosječna vrijednost leada": {
      implemented: true,
      summary: "Vidite koliko u prosjeku zaradite po konvertiranom leadu - prosječna vrijednost pokazuje profitabilnost leadova.",
      details: `## Kako funkcionira:

Prosječna vrijednost leada pokazuje koliko u prosjeku zaradite po konvertiranom leadu - to je ključna metrika profitabilnosti.

**Kako se računa:**
- Prosječna vrijednost = ukupan prihod od konvertiranih leadova / broj konvertiranih leadova
- Pokazuje koliko vrijedi prosječan konvertirani lead

**Zašto je važno:**
- Razumijete profitabilnost leadova
- Planirate cijene ponuda
- Optimizirate strategiju kupovine leadova
- Identificirate najprofitabilnije kategorije

**Kako poboljšati:**
- Fokus na kvalitetnije leadove
- Bolje cijene ponuda
- Veća stopa konverzije
- Fokus na profitabilnije kategorije

Prosječna vrijednost leada omogućava vam optimizaciju vaše strategije!
`
    },
    "Ukupno potrošenih kredita": {
      implemented: true,
      summary: "Vidite koliko kredita ste ukupno potrošili na kupovinu leadova - znate koliko ste uložili.",
      details: `## Kako funkcionira:

Ukupno potrošenih kredita pokazuje koliko kredita ste ukupno potrošili na kupovinu leadova - to je vaša investicija.

**Kako se računa:**
- Svaki put kada kupite lead, krediti se troše
- Ukupno potrošenih kredita = suma svih kredita potrošenih na kupovinu leadova
- Povezano s ukupnim prihodom za izračun ROI

**Zašto je važno:**
- Vidite koliko ste uložili
- Planirate budžet za kupovinu leadova
- Razumijete ROI vaše investicije
- Optimizirate potrošnju kredita

**Kako optimizirati:**
- Fokus na kvalitetnije leadove (bolji ROI)
- Planiranje budžeta unaprijed
- Pracenje ROI po kategorijama
- Balans između količine i kvalitete

Ukupno potrošenih kredita omogućava vam praćenje vaše investicije i ROI!
`
    },
    "Ukupno konvertiranih leadova": {
      implemented: true,
      summary: "Vidite koliko leadova ste ukupno konvertirali u poslove - ukupan broj pokazuje vaš uspjeh.",
      details: `## Kako funkcionira:

Ukupno konvertiranih leadova pokazuje koliko leadova ste ukupno konvertirali u stvarne poslove - to je metrika uspješnosti.

**Kako se računa:**
- Kupite lead
- Kontaktirate klijenta
- Klijent prihvati vašu uslugu
- Lead se označava kao konvertiran
- Ukupno konvertiranih = broj svih konvertiranih leadova

**Zašto je važno:**
- Vidite koliko uspješno radite s leadovima
- Razumijete stopu konverzije
- Planirate strategiju kupovine leadova
- Pracenje napretka kroz vrijeme

**Kako poboljšati:**
- Brži odgovor na leadove
- Bolje komunikacijske vještine
- Fokus na kvalitetnije leadove
- Optimizacija cijena ponuda

Ukupno konvertiranih leadova omogućava vam praćenje vašeg uspjeha!
`
    },
    "Napredne analitike": {
      implemented: true,
      summary: "Pristupite naprednim analitičkim alatima - detaljne metrike, trendovi, kategorijske analize i drugo.",
      details: `## Kako funkcionira:

Napredne analitike omogućavaju vam pristup detaljnim analitičkim alatima za dubinsku analizu vašeg poslovanja.

**Što vidite:**
- Detaljne metrike po kategorijama
- Trendovi kroz vrijeme
- Kategorijske analize
- Komparativne analize
- Prediktivne analize

**Kako koristiti:**
- Pregledavate detaljne metrike
- Analizirate trendove
- Identificirate najprofitabilnije kategorije
- Optimizirate strategiju kupovine leadova

**Prednosti:**
- Dubinska analiza poslovanja
- Identificiranje prilika
- Optimizacija strategije
- Informirane odluke

**Zašto je korisno:**
- Razumijete svoje poslovanje na dubljoj razini
- Identificirate trendove i prilike
- Optimizirate ROI
- Donosite informirane odluke

Napredne analitike omogućavaju vam dubinsku analizu vašeg poslovanja i optimizaciju strategije!
`
    },
    "Registracija kao korisnik usluge": {
      implemented: true,
      summary: "Registrirajte se kao korisnik usluge kako biste mogli objavljivati poslove i tražiti pružatelje usluga.",
      details: `## Kako funkcionira:

Registracija kao korisnik usluge omogućava vam pristup platformi za objavljivanje poslova i traženje pružatelja usluga.

**Kako se registrirati:**
- Otvorite registracijsku stranicu
- Odaberete "Korisnik usluge" kao tip korisnika
- Unesete osnovne podatke (ime, email, lozinka)
- Potvrdite email adresu
- Vaš račun je aktivan

**Što možete raditi:**
- Objavljivati nove poslove
- Primati ponude od pružatelja
- Komunicirati s pružateljima preko chata
- Ocjenjivati pružatelje nakon završetka posla
- Pregledavati povijest poslova

**Prednosti:**
- Jednostavna registracija
- Brz pristup funkcionalnostima
- Mogućnost objavljivanja poslova odmah
- Komunikacija s pružateljima

Registracija kao korisnik usluge omogućava vam brz pristup svim funkcionalnostima platforme!
`
    },
    "Odabir tipa korisnika (Korisnik usluge / Pružatelj usluge)": {
      implemented: true,
      summary: "Tijekom registracije odaberete tip korisnika - korisnik usluge ili pružatelj usluge, ili oba.",
      details: `## Kako funkcionira:

Tijekom registracije odaberete tip korisnika - možete biti korisnik usluge, pružatelj usluge, ili oba istovremeno.

**Dostupni tipovi:**
- **Korisnik usluge** - Objavljujete poslove i tražite pružatelje
- **Pružatelj usluge** - Nudite usluge i primate poslove
- **Oba** - Možete biti i korisnik i pružatelj istovremeno

**Kako funkcionira:**
- Odaberete tip korisnika tijekom registracije
- Možete dodati drugi tip kasnije u postavkama
- Svaki tip ima svoje funkcionalnosti i navigaciju
- Možete prebacivati se između tipova

**Prednosti:**
- Fleksibilnost u korištenju platforme
- Mogućnost obje uloge
- Različiti pristupi funkcionalnostima
- Lako dodavanje novog tipa

Odabir tipa korisnika omogućava vam fleksibilnost u korištenju platforme!
`
    },
    "Fizička osoba vs Pravna osoba za korisnike": {
      implemented: true,
      summary: "Kada se registrirate kao korisnik, odaberete jeste li fizička ili pravna osoba - različiti tipovi imaju različite opcije.",
      details: `## Kako funkcionira:

Kada se registrirate kao korisnik usluge, odaberete jeste li fizička ili pravna osoba - različiti tipovi imaju različite opcije.

**Fizička osoba:**
- Osnovni podaci (ime, prezime, email, telefon)
- Mogućnost objavljivanja poslova
- Osoban profil

**Pravna osoba:**
- Podaci tvrtke (naziv, OIB, adresa)
- Dodatne opcije za fakturiranje
- Profil tvrtke

**Zašto je važno:**
- Različite opcije za različite tipove korisnika
- Mogućnost fakturiranja za pravne osobe
- Prilagođene funkcionalnosti
- Compliance s propisima

**Prednosti:**
- Prilagođene funkcionalnosti
- Mogućnost fakturiranja
- Compliance s propisima
- Fleksibilnost

Fizička osoba vs Pravna osoba omogućava vam prilagođene funkcionalnosti ovisno o vašem tipu!
`
    },
    "Profil korisnika usluge (UserProfile)": {
      implemented: true,
      summary: "Kao korisnik usluge imate svoj profil gdje vidite sve vaše poslove, ponude i komunikacije.",
      details: `## Kako funkcionira:

Kao korisnik usluge imate svoj profil gdje vidite sve vaše poslove, ponude koje ste primili i komunikacije s pružateljima.

**Što vidite na profilu:**
- Svi vaši objavljeni poslovi
- Ponude koje ste primili
- Status svakog posla
- Komunikacije s pružateljima
- Povijest završenih poslova

**Kako koristiti:**
- Pregledavate sve vaše poslove na jednom mjestu
- Upravljate poslovima (otvoren, u tijeku, završen)
- Odgovarate na ponude
- Komunicirate s pružateljima

**Prednosti:**
- Centralizirani pregled svih poslova
- Lako upravljanje poslovima
- Jednostavna komunikacija
- Praćenje statusa poslova

Profil korisnika usluge omogućava vam jednostavno upravljanje svim vašim poslovima!
`
    },
    "Objavljivanje poslova od strane korisnika": {
      implemented: true,
      summary: "Kao korisnik možete objavljivati nove poslove - unesete detalje, kategoriju, lokaciju i budžet.",
      details: `## Kako funkcionira:

Kao korisnik možete objavljivati nove poslove - unesete sve detalje, kategoriju, lokaciju i budžet, a pružatelji mogu slati ponude.

**Kako objaviti posao:**
- Kliknete "Objavi novi posao"
- Unesete naslov i detaljan opis
- Odaberete kategoriju usluge
- Unesete lokaciju (grad ili adresa)
- Postavite budžet (min-max)
- Dodate slike ako želite
- Objavite posao

**Što se događa:**
- Posao se objavljuje na platformi
- Pružatelji u toj kategoriji primaju notifikacije
- Pružatelji mogu slati ponude
- Možete pregledavati sve ponude
- Odlučujete koju ponudu prihvatiti

**Prednosti:**
- Jednostavno objavljivanje poslova
- Brz pristup pružateljima
- Primanje više ponuda
- Odabir najbolje ponude

Objavljivanje poslova omogućava vam brz pristup pružateljima i primanje ponuda!
`
    },
    "Pregled vlastitih poslova (MyJobs)": {
      implemented: true,
      summary: "Vidite sve vaše objavljene poslove na jednom mjestu - status svakog posla, ponude i komunikacije.",
      details: `## Kako funkcionira:

U sekciji "Moji poslovi" vidite sve vaše objavljene poslove na jednom mjestu - status svakog posla, ponude koje ste primili i komunikacije.

**Što vidite:**
- Svi vaši objavljeni poslovi
- Status svakog posla (OTVOREN, U TIJEKU, ZAVRŠEN, OTKAZAN)
- Broj ponuda za svaki posao
- Pružatelj koji je prihvatio ponudu (ako je slučaj)
- Komunikacije s pružateljima

**Kako koristiti:**
- Pregledavate sve vaše poslove
- Upravljate statusom poslova
- Pregledavate i odgovarate na ponude
- Komunicirate s pružateljima
- Označavate poslove kao završene

**Prednosti:**
- Centralizirani pregled svih poslova
- Lako upravljanje poslovima
- Jednostavno praćenje statusa
- Brza komunikacija s pružateljima

Pregled vlastitih poslova omogućava vam jednostavno upravljanje svim vašim poslovima!
`
    },
    "Primanje ponuda za poslove": {
      implemented: true,
      summary: "Kada objavite posao, primajte ponude od pružatelja - vidite iznos, poruku i procijenjeno vrijeme izvršenja.",
      details: `## Kako funkcionira:

Kada objavite posao, pružatelji mogu slati ponude - vi primite sve ponude i možete ih pregledavati, uspoređivati i odabrati najbolju.

**Kako primiti ponude:**
- Objavite posao
- Pružatelji šalju ponude
- Primite notifikacije o novim ponudama
- Pregledavate sve ponude za posao

**Što vidite u ponudi:**
- Iznos ponude
- Poruka uz ponudu
- Procijenjeno vrijeme izvršenja
- Profil pružatelja
- Ocjene i recenzije pružatelja

**Kako odabrati:**
- Pregledate sve ponude
- Usporedite cijene i profile pružatelja
- Komunicirate s pružateljima preko chata
- Odaberete najbolju ponudu

**Prednosti:**
- Više opcija za izbor
- Usporedba ponuda
- Mogućnost pregovaranja
- Odabir najbolje ponude

Primanje ponuda omogućava vam odabir najbolje ponude za vaš posao!
`
    },
    "Prihvaćanje ponuda": {
      implemented: true,
      summary: "Nakon što pregledate ponude, prihvatite onu koja vam najviše odgovara - posao se označava kao 'U tijeku' i započinje komunikacija.",
      details: `## Kako funkcionira:

Nakon što pregledate sve ponude za vaš posao, prihvatite onu koja vam najviše odgovara - posao se automatski označava kao 'U tijeku'.

**Kako prihvatiti:**
- Pregledate sve ponude
- Odaberete ponudu koja vam odgovara
- Kliknete "Prihvati ponudu"
- Posao se označava kao 'U tijeku'
- Pružatelj prima notifikaciju

**Što se događa:**
- Posao prelazi u status 'U TIJEKU'
- Pružatelj prima obavijest o prihvaćanju
- Mogućnost komunikacije preko chata
- Možete pratiti napredak posla

**Prednosti:**
- Jednostavno prihvaćanje ponuda
- Automatsko ažuriranje statusa
- Brza komunikacija s pružateljem
- Praćenje napretka posla

Prihvaćanje ponuda omogućava vam brz odabir pružatelja i započinjanje posla!
`
    },
    "Navigacija specifična za korisnike": {
      implemented: true,
      summary: "Kao korisnik usluge vidite navigaciju prilagođenu vašim potrebama - objavi posao, moji poslovi, ponude, itd.",
      details: `## Kako funkcionira:

Kao korisnik usluge vidite navigaciju prilagođenu vašim potrebama - linkovi su prilagođeni funkcionalnostima korisnika usluge.

**Što vidite u navigaciji:**
- Objavi posao
- Moji poslovi
- Ponude
- Chat
- Profil
- Postavke

**Zašto je važno:**
- Jednostavnija navigacija
- Fokus na relevantne funkcionalnosti
- Manje zabune
- Bolje korisničko iskustvo

**Prednosti:**
- Prilagođena navigacija
- Jednostavnije korištenje
- Fokus na vaše potrebe
- Bolje korisničko iskustvo

Navigacija specifična za korisnike omogućava vam jednostavnije korištenje platforme!
`
    },
    "Sakrivanje provider-specifičnih linkova za korisnike": {
      implemented: true,
      summary: "Kao korisnik ne vidite provider-specifične linkove poput ROI dashboarda ili leadova - navigacija je prilagođena vašim potrebama.",
      details: `## Kako funkcionira:

Kao korisnik usluge ne vidite provider-specifične linkove poput ROI dashboarda, leadova ili pretplata - navigacija je prilagođena vašim potrebama.

**Što se sakriva:**
- ROI dashboard
- Tržište leadova
- Moji leadovi
- Pretplate
- Statistike uspješnosti
- Queue sustav

**Zašto se sakriva:**
- Ne smeta navigacija nepotrebnim linkovima
- Jednostavnija navigacija
- Fokus na relevantne funkcionalnosti
- Bolje korisničko iskustvo

**Prednosti:**
- Čistija navigacija
- Jednostavnije korištenje
- Fokus na vaše potrebe
- Bolje korisničko iskustvo

Sakrivanje provider-specifičnih linkova omogućava vam čistiju i jednostavniju navigaciju!
`
    },
    "Različiti pravni statusi (Fizička osoba, Obrt, d.o.o., j.d.o.o., itd.)": {
      implemented: true,
      summary: "Kada se registrirate kao pružatelj, odaberete svoj pravni status - fizička osoba, obrt, d.o.o., j.d.o.o., itd.",
      details: `## Kako funkcionira:

Kada se registrirate kao pružatelj usluga, odaberete svoj pravni status - fizička osoba, obrt, d.o.o., j.d.o.o., ili drugo.

**Dostupni statusi:**
- **Fizička osoba** - Radite kao fizička osoba
- **Obrt** - Imate obrt
- **d.o.o.** - Imate d.o.o. tvrtku
- **j.d.o.o.** - Imate j.d.o.o. tvrtku
- **Ostalo** - Drugi pravni statusi

**Zašto je važno:**
- Različite opcije za različite pravne statuse
- Mogućnost fakturiranja ovisno o statusu
- Compliance s propisima
- Prilagođene funkcionalnosti

**Kako funkcionira:**
- Odaberete pravni status tijekom registracije
- Unesete potrebne podatke o statusu
- Mogućnost fakturiranja ovisno o statusu
- Profil se prilagođava statusu

Različiti pravni statusi omogućavaju vam prilagođene funkcionalnosti ovisno o vašem statusu!
`
    },
    "OIB validacija": {
      implemented: true,
      summary: "Sustav automatski provjerava valjanost OIB-a (Osobni Identifikacijski Broj) kada ga unesete.",
      details: `## Kako funkcionira:

Sustav automatski provjerava valjanost OIB-a (Osobni Identifikacijski Broj) kada ga unesete - provjerava format i kontrolnu znamenku.

**Kako funkcionira:**
- Unesete OIB
- Sustav automatski provjerava format (11 znamenki)
- Provjerava kontrolnu znamenku
- Ako je OIB valjan, prihvaća se
- Ako nije valjan, prikazuje se greška

**Zašto je važno:**
- Osigurava ispravnost OIB-a
- Sprečava greške u unosu
- Compliance s propisima
- Mogućnost verifikacije

**Prednosti:**
- Automatska validacija
- Sprečavanje grešaka
- Compliance s propisima
- Pouzdanost podataka

OIB validacija osigurava ispravnost unesenih OIB-ova!
`
    },
    "Naziv tvrtke/obrta": {
      implemented: true,
      summary: "Kao pružatelj unesite naziv vaše tvrtke ili obrta - prikazuje se na vašem profilu i u komunikaciji.",
      details: `## Kako funkcionira:

Kao pružatelj unesete naziv vaše tvrtke ili obrta - prikazuje se na vašem profilu, u komunikaciji i na dokumentima.

**Kako unijeti:**
- Tijekom registracije ili u postavkama profila
- Unesete naziv tvrtke ili obrta
- Naziv se automatski prikazuje na profilu
- Mogućnost ažuriranja kasnije

**Zašto je važno:**
- Profesionalni izgled profila
- Prepoznatljivost tvrtke
- Gradite povjerenje
- Prikaz na dokumentima

**Kako se koristi:**
- Prikazuje se na vašem profilu
- Vidljivo u komunikaciji s korisnicima
- Na dokumentima i fakturiranju
- U pretraživanju pružatelja

Naziv tvrtke/obrta omogućava vam profesionalni izgled i prepoznatljivost!
`
    },
    "Auto-verifikacija naziva tvrtke (Sudski registar, Obrtni registar)": {
      implemented: true,
      summary: "Sustav automatski provjerava naziv tvrtke u sudskom registru ili obrtnom registru - verificira da je tvrtka registrirana.",
      details: `## Kako funkcionira:

Sustav automatski provjerava naziv tvrtke u sudskom registru ili obrtnom registru - verificira da je tvrtka registrirana i da naziv odgovara.

**Kako funkcionira:**
- Unesete naziv tvrtke i OIB
- Sustav automatski provjerava u sudskom registru
- Ako se tvrtka pronađe, verificira se
- Business Badge se dodaje na profil
- Trust score se povećava

**Zašto je važno:**
- Verificira da je tvrtka registrirana
- Osigurava ispravnost podataka
- Gradite povjerenje korisnika
- Veći trust score znači kvalitetnije leadove

**Prednosti:**
- Automatska verifikacija
- Osigurava ispravnost podataka
- Gradite povjerenje
- Veći trust score

Auto-verifikacija naziva tvrtke osigurava ispravnost podataka i gradite povjerenje!
`
    },
    "Porezni broj": {
      implemented: true,
      summary: "Kao pružatelj unesite porezni broj vaše tvrtke - koristi se za fakturiranje i dokumentaciju.",
      details: `## Kako funkcionira:

Kao pružatelj unesete porezni broj vaše tvrtke - koristi se za fakturiranje, dokumentaciju i administrativne svrhe.

**Kako unijeti:**
- Tijekom registracije ili u postavkama profila
- Unesete porezni broj tvrtke
- Porezni broj se pohranjuje sigurno
- Koristi se za fakturiranje

**Zašto je važno:**
- Potreban za fakturiranje
- Compliance s propisima
- Dokumentacija i računovodstvo
- Administrativne svrhe

**Kako se koristi:**
- Na PDF fakturiranju
- U dokumentaciji
- Za administrativne svrhe
- Za compliance s propisima

Porezni broj omogućava vam fakturiranje i compliance s propisima!
`
    },
    "Team Locations - geo-dinamičke lokacije": {
      implemented: true,
      summary: "Definirajte više lokacija gdje vaš tim radi - olakšava pronalaženje najbližih pružatelja usluga za korisnike.",
      details: `## Kako funkcionira:

Team Locations omogućava pružateljima da definiraju više lokacija gdje njihovi timovi ili zaposlenici rade.

**Dodavanje lokacija:**
- Dodajte sve lokacije gdje vaš tim može raditi
- Svaka lokacija ima svoju adresu i geografiske koordinate
- Možete dodati neograničen broj lokacija
- Svaka lokacija ima svoj radius pokrivanja

**Prikaz na profilu:**
- Sve vaše lokacije su vidljive na vašem profilu
- Korisnici vide gdje sve možete raditi
- Prikazuje se na karti za bolju vizualizaciju
- Olakšava korisnicima pronalaženje najbližeg pružatelja

**Prednosti:**
- Korisnici pronalaze najbliže pružatelje usluga
- Možete raditi u više gradova ili područja
- Bolje pokrivanje geografskog područja
- Povećava šanse da vas korisnici pronađu

**Integracija s lead sustavom:**
- Leadovi se distribuiraju na osnovu najbližih lokacija
- Ako imate tim u različitim gradovima, leadovi se rutiraju prema najbližoj lokaciji
- Automatski radius checking određuje možete li prihvatiti lead

Team Locations omogućava vam da radite u više lokacija i pronađete više klijenata!
`
    },
    "Upravljanje tim lokacijama": {
      implemented: true,
      summary: "Lako dodajte, uređujte ili brišite lokacije gdje vaš tim radi.",
      details: `## Kako funkcionira:

Upravljanje tim lokacijama omogućava vam potpunu kontrolu nad lokacijama gdje vaš tim radi.

**Dodavanje novih lokacija:**
- Lako dodajte novu lokaciju kroz postavke profila
- Unesite adresu, grad, poštanski broj
- Sustav automatski određuje geografiske koordinate
- Postavite radius pokrivanja za svaku lokaciju
- Odaberite kategorije usluga koje nudite na toj lokaciji

**Uređivanje postojećih lokacija:**
- Ažurirajte adresu ili radius ako se nešto promijeni
- Promijenite kategorije usluga za određenu lokaciju
- Uređujte informacije o lokaciji kada god je potrebno

**Brisanje lokacija:**
- Uklonite lokacije gdje više ne radite
- Jednostavno kliknite na "Obriši" za lokaciju koju želite ukloniti
- Sustav automatski ažurira distribuciju leadova

**Pregled svih lokacija:**
- Vidite sve svoje lokacije na jednom mjestu
- Svaka lokacija prikazuje adresu, radius i kategorije
- Lako prepoznate koje lokacije su aktivne

**Prednosti:**
- Puna kontrola nad geografskim pokrivanjem
- Lako ažuriranje kada se proširite ili smanjite
- Automatska integracija s lead sustavom
- Bolje uparivanje s korisnicima u vašoj blizini

Upravljanje tim lokacijama vam omogućava fleksibilnost i kontrolu nad geografskim područjem gdje radite!
`
    },
    "Radius checking za lokacije": {
      implemented: true,
      summary: "Sustav automatski provjerava možete li prihvatiti lead na osnovu udaljenosti između vaše lokacije i lokacije posla.",
      details: `## Kako funkcionira:

Radius checking automatski određuje možete li raditi na određenoj lokaciji na osnovu vaše udaljenosti od tog mjesta.

**Automatska provjera:**
- Kada se pojavi novi lead, sustav automatski provjerava vaše lokacije
- Izračunava se udaljenost između vaših lokacija i lokacije posla
- Ako je udaljenost unutar vašeg radiusa, lead vam se ponudi
- Ako je izvan radiusa, lead se ne nudi

**Postavljanje radiusa:**
- Određujete koliko daleko možete raditi od svake lokacije
- Radius se može postaviti različito za svaku lokaciju
- Primjerice, možete raditi 10km od glavne lokacije, a 5km od sekundarne
- Radius se mjeri u kilometrima

**Praćenje udaljenosti:**
- Sustav koristi geografiske koordinate za precizan izračun
- Udaljenost se izračunava kao direktna linija (kako ptice leti)
- Automatski se uzima u obzir najbliža vaša lokacija

**Prednosti:**
- Samo dobivate leadove koje možete zapravo obaviti
- Ne dobivate leadove koji su predaleko
- Automatski filtering smanjuje nepotrebne obavijesti
- Povećava kvalitetu uparivanja korisnika s pružateljima

**Kada se koristi:**
- Prilikom distribucije leadova u queue sustavu
- Pri pretraživanju pružatelja za određeni posao
- Prilikom odabira pružatelja koji mogu raditi na određenoj lokaciji
- Automatski u pozadini bez potrebe za ručnim unosom

Radius checking osigurava da samo dobivate relevantne leadove koje možete zapravo obaviti!
`
    },
    "Haversine formula za udaljenost": {
      implemented: true,
      summary: "Najprecizniji način izračuna udaljenosti između dvije lokacije na kugli Zemlje, uzimajući u obzir zakrivljenost planeta.",
      details: `## Kako funkcionira:

Haversine formula je matematički algoritam koji izračunava najkraću udaljenost između dvije točke na površini kugle (kao što je Zemlja).

**Zašto Haversine formula:**
- Zemlja je kugla, ne ravna površina
- Standardno mjerenje "ravne linije" ne uzima u obzir zakrivljenost
- Haversine formula daje točnu udaljenost uzimajući u obzir geografsku širinu i dužinu
- Točnija od jednostavnog izračuna razlike koordinata

**Kako radi:**
- Uzima geografiske koordinate (latitude/longitude) dvije lokacije
- Izračunava kut između njih na površini kugle
- Pretvara kut u stvarnu udaljenost u kilometrima
- Rezultat je udaljenost "kako ptice leti" - najkraća moguća udaljenost

**Kada se koristi:**
- Prilikom provjere mogu li vaše lokacije pokriti određenu adresu
- Pri izračunu udaljenosti između korisnika i pružatelja
- Prilikom sortiranja pružatelja po udaljenosti od korisnika
- U queue sustavu za distribuciju leadova najbližim pružateljima

**Prednosti:**
- Najprecizniji mogući izračun udaljenosti
- Uzima u obzir zakrivljenost Zemlje
- Točnije uparivanje korisnika s pružateljima
- Omogućava bolju geografsku distribuciju leadova

**Primjer:**
- Ako ste u Zagrebu (45.8150° N, 15.9819° E)
- I posao je u Samoboru (45.8027° N, 15.7184° E)
- Haversine formula izračuna da je udaljenost približno 21km
- To je točnije nego jednostavan izračun koji bi dao drugačiju vrijednost

Haversine formula osigurava najprecizniji mogući izračun udaljenosti za najbolje uparivanje korisnika s pružateljima!
`
    },
    "Trust score sustav (0-100)": {
      implemented: true,
      summary: "Sustav ocjene pouzdanosti korisnika (0-100) koji određuje kvalitetu leadova i povjerenje u korisnika.",
      details: `## Kako funkcionira:

Trust score je sustav koji ocjenjuje pouzdanost i kvalitetu korisnika na ljestvici od 0 do 100.

**Kako se računa:**
- Počinje na 0 za nove korisnike
- Raste s obzirom na broj verifikacija koje korisnik ima
- Email verifikacija: +10 bodova
- Telefon verifikacija: +15 bodova
- OIB verifikacija: +20 bodova
- Tvrtka/obrt verifikacija: +25 bodova
- DNS verifikacija domene: +20 bodova
- Maksimalni mogući score je 100

**Što znači score:**
- 0-30: Nizak trust score - korisnik nije verificiran
- 31-60: Srednji trust score - dio verifikacija je završen
- 61-80: Visok trust score - većina verifikacija je završena
- 81-100: Vrlo visok trust score - potpuno verificiran korisnik

**Kako se koristi:**
- Pružatelji vide trust score svakog korisnika prije prihvaćanja leada
- Viši trust score znači veću vjerojatnost da je korisnik ozbiljan
- Leadovi s višim trust score-om se prioritiziraju u distribuciji
- AI score kvalitete leadova uzima u obzir trust score

**Prednosti:**
- Povećava povjerenje između pružatelja i korisnika
- Olakšava prepoznavanje kvalitetnih leadova
- Potiče korisnike da završe verifikacije
- Smanjuje rizik od lažnih ili niskokvalitetnih leadova

**Kako poboljšati trust score:**
- Verificirajte svoj email
- Verificirajte telefon SMS kodom
- Dodajte i verificirajte OIB
- Verificirajte tvrtku/obrt u sudskom registru
- Verificirajte domenu ako imate web stranicu

Trust score vam pomaže da prepoznate kvalitetne i pouzdane korisnike!
`
    },
    "Prosječno vrijeme odgovora (avgResponseTimeMinutes)": {
      implemented: true,
      summary: "Automatsko praćenje koliko brzo odgovarate na leadove - bitno za vašu reputaciju i prioritet u distribuciji leadova.",
      details: `## Kako funkcionira:

Sustav automatski prati koliko vremena vam treba da odgovorite na leadove i izračunava prosječno vrijeme odgovora.

**Praćenje vremena:**
- Kada dobijete lead u queue sustavu, počinje mjerenje vremena
- Vrijeme se mjeri do trenutka kada odgovorite (INTERESTED, NOT_INTERESTED)
- Ako ne odgovorite u 24h, vrijeme se mjeri kao 24h
- Sustav automatski izračunava prosjek svih vaših odgovora

**Kako se izračunava:**
- Zbrajaju se sva vremena odgovora za sve vaše leadove
- Dijeli se s brojem leadova na koje ste odgovorili
- Rezultat je prosječno vrijeme odgovora u minutama
- Ažurira se automatski nakon svakog vašeg odgovora

**Što znači:**
- Brz odgovor (npr. unutar 1h) pokazuje aktivnost i pouzdanost
- Spor odgovor (npr. preko 12h) pokazuje manju aktivnost
- Prosječno vrijeme odgovora utječe na vašu reputaciju
- Utječe na prioritet u distribuciji novih leadova

**Prednosti:**
- Brži odgovori vam donose bolju reputaciju
- Reputacija utječe na prioritet u queue sustavu
- Aktivni pružatelji dobivaju prioritet u distribuciji
- Korisnici vide da brzo odgovarate što povećava povjerenje

**Kako poboljšati:**
- Provjeravajte queue često - najbolje nekoliko puta dnevno
- Odgovarajte na leadove što brže možete
- Ako niste zainteresirani, odgovorite odmah (NOT_INTERESTED)
- Brz odgovor vam donosi bolju reputaciju

Prosječno vrijeme odgovora je pokazatelj vaše aktivnosti i utječe na vašu reputaciju i prioritet!
`
    },
    "Stopa konverzije leadova (conversionRate)": {
      implemented: true,
      summary: "Automatsko izračunavanje koliko leadova uspješno konvertirate u završene poslove - ključni pokazatelj uspješnosti.",
      details: `## Kako funkcionira:

Stopa konverzije je postotak leadova koje ste uspješno konvertirali u završene poslove.

**Kako se izračunava:**
- Prebroje se svi leadovi koje ste kupili
- Prebroje se leadovi koje ste označili kao "konvertirane" (CONVERTED)
- Stopa konverzije = (broj konvertiranih / ukupno kupljenih) × 100
- Primjer: Ako ste kupili 10 leadova i konvertirali 3, stopa konverzije je 30%

**Što znači:**
- Visoka stopa konverzije (npr. 40%+) pokazuje da dobro odabirate leadove
- Niska stopa konverzije (npr. 10%-) pokazuje da možda kupujete neprikladne leadove
- Prosječna stopa konverzije obično je oko 20-30%
- Stopa konverzije utječe na vašu reputaciju i prioritet u distribuciji

**Kako se koristi:**
- Prikazuje se na vašem ROI dashboardu
- Utječe na vašu reputaciju i prioritet
- Pružatelji s višom stopom konverzije dobivaju prioritet u queue sustavu
- AI score kvalitete leadova uzima u obzir vašu stopu konverzije

**Prednosti:**
- Vidite koliko ste uspješni u konverziji leadova
- Možete optimizirati svoj pristup odabira leadova
- Viša stopa konverzije donosi više prihoda
- Bolja reputacija znači prioritet u distribuciji

**Kako poboljšati:**
- Odaberite leadove koji odgovaraju vašim specifikacijama
- Brzo odgovarajte na leadove (unutar 24h)
- Komunicirajte profesionalno s korisnicima
- Pratite svoje statistike i prilagođavajte pristup

Stopa konverzije je ključni pokazatelj vašeg uspjeha u konverziji leadova u prihode!
`
    },
    "Skener dokumenata za licence": {
      implemented: true,
      summary: "Sustav koji automatski skenira i čita podatke s dokumenata licenci kako biste brzo dodali licence u svoj profil.",
      details: `## Kako funkcionira:

Skener dokumenata automatski prepoznaje i čita podatke s dokumenta licence kako biste brzo dodali licencu u svoj profil.

**Kako koristiti:**
- Učitajte fotografiju ili sken dokumenta licence
- Skener automatski prepoznaje tekst na dokumentu
- Izdvoji podatke kao što su: broj licence, datum izdavanja, tijelo koje izdaje licencu
- Vi samo potvrdite ili ispravite podatke ako je potrebno

**Što skener prepoznaje:**
- Broj licence - automatski izvučen iz dokumenta
- Datum izdavanja - prepoznat i pretvoren u pravi format datuma
- Tijelo koje izdaje licencu - prepoznato iz teksta dokumenta
- Tip licence - prepoznat na osnovu sadržaja dokumenta

**Provjera podataka:**
- Nakon što skener izvuče podatke, možete ih pregledati
- Možete ručno ispraviti podatke ako skener nije točno prepoznao
- Potvrdite podatke prije spremanja
- Dokument se sprema kao dokaz licence

**Prednosti:**
- Brže dodavanje licenci - ne trebate ručno unositi sve podatke
- Manje grešaka - automatsko prepoznavanje smanjuje mogućnost tipfelera
- Lakše ažuriranje - lako dodajete nove licence
- Profesionalniji pristup - automatski proces je efikasniji

**Kada koristiti:**
- Kada dodajete novu licencu u profil
- Kada obnavljate licencu
- Kada dodajete dodatne licence za nove kategorije

Skener dokumenata omogućava brže i lakše dodavanje licenci u vaš profil!
`
    },
    "Predviđanje budućih performansi": {
      implemented: true,
      summary: "AI sustav koji predviđa vaše buduće poslovne rezultate na osnovu trenutnih trendova i povijesnih podataka.",
      details: `## Kako funkcionira:

Sustav koristi AI algoritme i vaše povijesne podatke da predvidi vaše buduće poslovne rezultate.

**Na osnovu čega se predviđa:**
- Vaša trenutna stopa konverzije leadova
- Prosječna vrijednost leada
- Trendovi iz prethodnih mjeseci
- Sezonalnost poslovanja (npr. ljetni pik za građevinarstvo)
- Vaša reputacija i prosječno vrijeme odgovora

**Što se predviđa:**
- Očekivani broj konvertiranih leadova u sljedećem mjesecu
- Predviđeni prihod za sljedeći kvartal
- Trend ROI-ja za naredne mjesece
- Optimalan broj leadova koje trebate kupiti
- Predviđanje performansi po kategorijama

**Kako se prikazuje:**
- Grafovi koji pokazuju trenutne i predviđene rezultate
- Procijenjene vrijednosti za sljedeće mjesece
- Trend linije koje pokazuju smjer kretanja
- Usporedba s prošlim rezultatima

**Kada koristiti:**
- Planiranje budućih investicija u leadove
- Određivanje optimalnog budžeta za kupovinu leadova
- Procjena mogućnosti rasta poslovanja
- Planiranje sezonalnih aktivnosti

**Prednosti:**
- Donošenje informiranih odluka o kupovini leadova
- Planiranje budžeta na osnovu predviđanja
- Prepoznavanje trendova prije nego što se dogode
- Optimizacija ulaganja u leadove

**Napomena:**
- Predviđanja su procijene na osnovu trendova, ne garancije
- Rezultati ovise o mnogim čimbenicima koji se mogu promijeniti
- Predviđanja se ažuriraju kada imate nove podatke
- Koristite predviđanja kao vodstvo, ne kao apsolutnu istinu

Predviđanje budućih performansi vam pomaže da donosite informirane odluke i optimizirate svoje poslovanje!
`
    },
    "Usporedba s drugim providerima": {
      implemented: true,
      summary: "Vidite kako se vaši rezultati uspoređuju s drugim pružateljima usluga na platformi - anonimno i privatno.",
      details: `## Kako funkcionira:

Sustav vam omogućava da vidite kako se vaši poslovni rezultati uspoređuju s prosjekom drugih pružatelja na platformi.

**Što se uspoređuje:**
- Vaša stopa konverzije vs prosječna stopa konverzije
- Vaš prosječni prihod po leadu vs prosječni prihod po leadu
- Vaš ROI vs prosječni ROI
- Vaše vrijeme odgovora vs prosječno vrijeme odgovora
- Vaša reputacija vs prosječna reputacija

**Kako se prikazuje:**
- Grafovi koji pokazuju vaše i prosječne vrijednosti
- Postotak iznad ili ispod prosjeka
- Rangiranje u određenim kategorijama (opcionalno)
- Privatno i anonimno - drugi pružatelji ne vide vaše podatke

**Zašto je važno:**
- Vidite jeste li iznad ili ispod prosjeka
- Možete identificirati područja za poboljšanje
- Motivira vas da radite bolje
- Pomaže vam da shvatite gdje se nalazite na tržištu

**Kada koristiti:**
- Planiranje strategije za poboljšanje rezultata
- Identificiranje konkurentskih prednosti
- Procjena svoje pozicije na tržištu
- Motivacija za postizanje boljih rezultata

**Prednosti:**
- Jasna slika vaše pozicije na tržištu
- Identifikacija područja za poboljšanje
- Motivacija za postizanje boljih rezultata
- Benchmarking vaših performansi

**Privatnost:**
- Vaši podatci su privatni
- Drugi pružatelji ne vide vaše individualne podatke
- Vidite samo svoje podatke i prosjek
- Anonimna usporedba osigurava privatnost

Usporedba s drugim providerima vam pomaže da shvatite gdje se nalazite i gdje možete poboljšati svoje rezultate!
`
    },
    "Rate limiting za SMS verifikaciju": {
      implemented: true,
      summary: "Zaštita od zlouporabe SMS verifikacije ograničavanjem broja zahtjeva u određenom vremenskom razdoblju.",
      details: `## Kako funkcionira:

Rate limiting osigurava da SMS verifikaciju ne može zloupotrebljavati ograničavanjem broja zahtjeva.

**Ograničenja:**
- Možete zatražiti maksimalno 3 SMS poruke u 1 satu
- Možete zatražiti maksimalno 10 SMS poruka u 24 sata
- Ako prekoračite limit, morate pričekati prije novog zahtjeva
- Limiti se resetiraju automatski nakon što protekne vremensko razdoblje

**Zašto postoji:**
- Sprječava zloupotrebu SMS usluge
- Smanjuje troškove platforme
- Osigurava da služba ostane dostupna svima
- Zaštita od spam napada

**Što se događa ako prekoračite limit:**
- Ne možete poslati novi zahtjev za SMS kod
- Primite poruku da ste prekoračili limit
- Vidite kada ćete moći poslati novi zahtjev
- Možete koristiti alternativne metode verifikacije

**Alternativne metode:**
- Možete koristiti email verifikaciju ako SMS ne radi
- Možete pričekati dok se limit resetira
- Možete kontaktirati podršku ako imate posebne potrebe

**Prednosti:**
- Zaštita od zloupotrebe
- Osigurava dostupnost servisa
- Smanjuje troškove
- Osigurava fer korištenje za sve korisnike

Rate limiting osigurava da SMS verifikacija ostane dostupna i funkcionalna za sve korisnike!
`
    },
    "Verifikacijski kod expiration (10 minuta)": {
      implemented: true,
      summary: "SMS verifikacijski kod vrijedi 10 minuta nakon slanja - nakon toga morate zatražiti novi kod.",
      details: `## Kako funkcionira:

Verifikacijski kod koji primite SMS porukom vrijedi samo 10 minuta od trenutka kada je poslan.

**Vrijeme trajanja:**
- Kod se kreira kada se pošalje SMS poruka
- Kod vrijedi točno 10 minuta
- Nakon 10 minuta, kod više ne vrijedi
- Morate zatražiti novi kod ako stari istekne

**Zašto postoji vremensko ograničenje:**
- Osigurava sigurnost - kodovi ne vrijede neograničeno
- Smanjuje rizik od zloupotrebe starih kodova
- Potiče korisnike da brzo završe verifikaciju
- Povećava sigurnost procesa verifikacije

**Što se događa ako istekne:**
- Ne možete koristiti isti kod za verifikaciju
- Morate zatražiti novi SMS kod
- Novi kod će vam biti poslan na telefon
- Novi kod također vrijedi 10 minuta

**Najbolje prakse:**
- Unesite kod što brže nakon primitka SMS-a
- Nemojte čekati pred istekom vremena
- Provjerite da li imate dobar signal za primanje SMS-a
- Ako ne primite SMS, zatražite novi kod

**Sigurnost:**
- Stari kodovi se automatski deaktiviraju
- Ne možete koristiti istekle kodove
- Svaki kod se može koristiti samo jednom
- Osigurava da samo vi možete verificirati svoj telefon

Verifikacijski kod expiration osigurava sigurnost vašeg procesa verifikacije!
`
    },
    "Praćenje vremena odgovora na leadove": {
      implemented: true,
      summary: "Sustav automatski prati koliko vremena vam treba da odgovorite na svaki lead - od primitka do vašeg odgovora.",
      details: `## Kako funkcionira:

Sustav automatski prati koliko vremena prođe između trenutka kada dobijete lead i kada na njega odgovorite.

**Kako se prati:**
- Kada dobijete lead u queue sustavu, počinje mjerenje vremena
- Vrijeme se mjeri do trenutka kada odgovorite (INTERESTED, NOT_INTERESTED, ili prođe 24h)
- Svaki vaš odgovor se bilježi s točnim vremenom
- Sustav automatski izračunava prosječno vrijeme odgovora

**Što se bilježi:**
- Vrijeme primitka leada (kada vam je lead dodjeljen)
- Vrijeme vašeg odgovora (kada odgovorite)
- Ukupno vrijeme odgovora u minutama
- Status odgovora (INTERESTED, NOT_INTERESTED, NO_RESPONSE)

**Kako se koristi:**
- Izračunava se prosječno vrijeme odgovora za sve vaše leadove
- Utječe na vašu reputaciju
- Utječe na prioritet u distribuciji novih leadova
- Prikazuje se na vašem profilu (opcionalno)

**Prednosti:**
- Vidite koliko brzo odgovarate
- Brži odgovori donose bolju reputaciju
- Aktivni pružatelji dobivaju prioritet
- Potiče brže odgovaranje na leadove

**Kako poboljšati:**
- Provjeravajte queue sustav često
- Odgovarajte na leadove što brže možete
- Ako niste zainteresirani, odgovorite odmah
- Brz odgovor donosi bolju reputaciju

Praćenje vremena odgovora vam pomaže da optimizirate svoje odgovaranje i poboljšate svoju reputaciju!
`
    },
    "Automatsko izračunavanje reputacije": {
      implemented: true,
      summary: "Sustav automatski izračunava vašu reputaciju na osnovu vaših performansi - bez potrebe za ručnim unosom.",
      details: `## Kako funkcionira:

Reputacija se automatski izračunava na osnovu vaših stvarnih performansi na platformi.

**Čimbenici koji utječu na reputaciju:**
- Prosječno vrijeme odgovora - brži odgovori = bolja reputacija
- Stopa konverzije leadova - viša konverzija = bolja reputacija
- Broj pozitivnih recenzija - više pozitivnih recenzija = bolja reputacija
- Prosječna ocjena - viša ocjena = bolja reputacija
- Aktivnost na platformi - više aktivnosti = bolja reputacija

**Kako se izračunava:**
- Sustav uzima sve relevantne podatke
- Svaki čimbenik ima svoju težinu u izračunu
- Kombinira sve čimbenike u jedan rezultat
- Reputacija se izražava kao broj (npr. 0-100) ili ocjena (npr. ★★★★☆)

**Ažuriranje:**
- Reputacija se automatski ažurira nakon svakog relevantnog događaja
- Nema potrebe za ručnim ažuriranjem
- Promjene su vidljive odmah
- Kontinuirano praćenje performansi

**Kako se koristi:**
- Prikazuje se na vašem profilu
- Utječe na prioritet u distribuciji leadova
- Korisnici vide vašu reputaciju prije odabira
- Pružatelji s boljom reputacijom dobivaju prioritet

**Prednosti:**
- Automatski proces - nema ručnog rada
- Pravedno ocjenjivanje na osnovu stvarnih performansi
- Kontinuirano ažuriranje
- Transparentnost - vidite kako se izračunava

**Kako poboljšati:**
- Brzo odgovarajte na leadove
- Fokusirajte se na kvalitetne leadove za bolju konverziju
- Pobrinite se za zadovoljne klijente za pozitivne recenzije
- Budite aktivni na platformi

Automatsko izračunavanje reputacije osigurava pravednu i objektivnu ocjenu vaših performansi!
`
    },
    "Prikaz reputacije na profilu": {
      implemented: true,
      summary: "Vaša reputacija je vidljiva na vašem javnom profilu - korisnici je vide prije odabira pružatelja usluga.",
      details: `## Kako funkcionira:

Vaša reputacija se automatski prikazuje na vašem javnom profilu kako bi korisnici vidjeli koliko ste pouzdani i uspješni.

**Kako se prikazuje:**
- Broj reputacije (npr. 85/100)
- Zvjezdice ili ocjene (npr. ★★★★☆)
- Progres bar koji pokazuje vašu reputaciju
- Opisni tekst (npr. "Vrlo visoka reputacija")

**Gdje se prikazuje:**
- Na vašem javnom profilu
- U listi pružatelja prije klika na profil
- Prilikom pretraživanja pružatelja
- U rezultatima pretraživanja

**Zašto je važno:**
- Korisnici vide vašu pouzdanost prije odabira
- Povećava povjerenje korisnika
- Razlikuje vas od drugih pružatelja
- Potiče vas da održavate visoku reputaciju

**Kako korisnici vide:**
- Pri pregledu vašeg profila
- U usporedbi s drugim pružateljima
- Kao pokazatelj vaše kvalitete
- Kao dokaz vaših performansi

**Prednosti:**
- Povećava povjerenje korisnika
- Razlikuje vas od konkurencije
- Potiče vas da održavate visoku reputaciju
- Transparentnost vaših performansi

**Kako poboljšati prikaz:**
- Održavajte visoku reputaciju kroz dobre performanse
- Brzo odgovarajte na leadove
- Osigurajte kvalitetne usluge za pozitivne recenzije
- Budite aktivni na platformi

Prikaz reputacije na profilu pomaže korisnicima da donesu informiranu odluku o odabiru pružatelja usluga!
`
    },
    "Integracija s lead matching algoritmom": {
      implemented: true,
      summary: "Vaša reputacija i performanse automatski utječu na to kako vam se distribuiraju leadovi - aktivni i uspješni pružatelji dobivaju prioritet.",
      details: `## Kako funkcionira:

Lead matching algoritam koristi vašu reputaciju i performanse da odredi tko će dobiti određeni lead.

**Kako algoritam radi:**
- Analizira sve dostupne pružatelje za određeni lead
- Uzima u obzir vašu reputaciju, stopu konverzije, vrijeme odgovora
- Uspoređuje vas s drugim pružateljima
- Određuje prioritet u distribuciji leadova

**Čimbenici koje algoritam uzima u obzir:**
- Vaša reputacija - viša reputacija = veći prioritet
- Stopa konverzije - viša stopa = veći prioritet
- Prosječno vrijeme odgovora - brži odgovori = veći prioritet
- Kvaliteta leadova koje odabirete - pametniji odabir = veći prioritet
- Lokacija - najbliži pružatelji dobivaju prioritet

**Kako utječe na distribuciju:**
- Pružatelji s boljom reputacijom dobivaju leadove prvi
- Aktivni pružatelji dobivaju prioritet u queue sustavu
- Pružatelji koji dobro konvertiraju leadove dobivaju više leadova
- Algoritam optimizira distribuciju za maksimalnu konverziju

**Prednosti:**
- Pravedna distribucija na osnovu performansi
- Aktivni i uspješni pružatelji dobivaju prioritet
- Povećava ukupnu stopu konverzije platforme
- Potiče pružatelje da poboljšaju svoje performanse

**Kako poboljšati poziciju:**
- Poboljšajte svoju reputaciju kroz dobre performanse
- Brzo odgovarajte na leadove
- Fokusirajte se na kvalitetne leadove za bolju konverziju
- Budite aktivni na platformi

**Transparentnost:**
- Vidite svoju poziciju u queue sustavu
- Možete vidjeti zašto ste dobili određeni lead
- Algoritam je pravedan i transparentan
- Svi imaju priliku poboljšati svoju poziciju

Integracija s lead matching algoritmom osigurava pravednu i optimiziranu distribuciju leadova na osnovu vaših performansi!
`
    },
    "Responsive dizajn (mobilni, tablet, desktop)": {
      implemented: true,
      summary: "Platforma se automatski prilagođava svakoj veličini ekrana - možete je koristiti na mobilnom telefonu, tabletu ili računalu.",
      details: `## Kako funkcionira:

Platforma se automatski prilagođava veličini ekrana vašeg uređaja, osiguravajući optimalno korisničko iskustvo na svakom uređaju.

**Mobilni telefon:**
- Optimizirani prikaz za male ekrane
- Lako navigiranje prstom
- Sve funkcije dostupne i pristupačne
- Brzo učitavanje i lagan rad
- Optimizirane forme za unos podataka

**Tablet:**
- Srednji format ekrana - balans između mobilnog i desktopa
- Prikazuje više informacija odgođeno
- Lako korištenje touch ekrana
- Optimizirani za horizontalni i vertikalni prikaz

**Desktop/računalo:**
- Puni prikaz svih funkcija
- Više prostora za pregled informacija
- Optimizirano za miš i tipkovnicu
- Mogućnost rada s više tabova istovremeno

**Automatsko prilagođavanje:**
- Platforma automatski prepoznaje veličinu ekrana
- Elementi se automatski reorganiziraju
- Navigacija se prilagođava veličini ekrana
- Slike i sadržaj se automatski skaliraju

**Prednosti:**
- Možete koristiti platformu s bilo kojeg uređaja
- Istovjetno iskustvo na svim uređajima
- Nema potrebe za instalacijom posebnih aplikacija
- Brzo i lagano učitavanje na svim uređajima

**Kada koristiti:**
- Na putu - koristite mobilni telefon za brze provjere
- U uredu - koristite desktop za detaljan rad
- U terenu - koristite tablet za pregled leadova
- Bilokada - pristupite platformi s bilo kojeg uređaja

Responsive dizajn osigurava da možete koristiti platformu udobno na bilo kojem uređaju!
`
    },
    "Intuitivno korisničko sučelje": {
      implemented: true,
      summary: "Jednostavno i jasno sučelje koje je lako za korištenje - bez potrebe za učenjem kompliciranih procesa.",
      details: `## Kako funkcionira:

Korisničko sučelje je dizajnirano da bude jednostavno i intuitivno - možete odmah početi koristiti platformu bez dugog učenja.

**Lako navigiranje:**
- Jasno organizirani izbornici i linkovi
- Logičan redoslijed funkcionalnosti
- Jasne oznake i ikone
- Brzo pronalaženje onoga što tražite

**Jasni uputi:**
- Objašnjenja uz svaku funkciju
- Tooltips i hint-ovi gdje je potrebno
- Objašnjenja koraka u procesima
- Jasne poruke o greškama i upozorenjima

**Konzistentan dizajn:**
- Slični elementi se prikazuju na sličan način
- Konzistentne boje i stilovi
- Predvidljivo ponašanje platforme
- Bez iznenađenja - sve radi kako očekujete

**Pojednostavljeni procesi:**
- Minimalan broj koraka za postizanje cilja
- Jasan tijek rada
- Lako poništavanje akcija ako pogriješite
- Povratak na prethodne korake

**Prednosti:**
- Brzo učenje korištenja platforme
- Manje grešaka u korištenju
- Zadovoljniji korisnici
- Više vremena za rad, manje za učenje

**Za koga je:**
- Novi korisnici - lako se prilagođavaju
- Iskusni korisnici - brže postizanje ciljeva
- Svi korisnici - pristupačno svima

Intuitivno korisničko sučelje osigurava da možete brzo i lako koristiti sve funkcije platforme!
`
    },
    "Brzo učitavanje stranica": {
      implemented: true,
      summary: "Stranice se učitavaju brzo - ne čekate dugo da vidite sadržaj ili izvršite akciju.",
      details: `## Kako funkcionira:

Platforma je optimizirana za brzo učitavanje stranica, osiguravajući da ne čekate dugo da vidite sadržaj ili izvršite akciju.

**Optimizacija performansi:**
- Optimizirani kod za brže učitavanje
- Optimizirane slike i resursi
- Pametno cache-iranje sadržaja
- Minimalno čekanje između stranica

**Brzo prebacivanje:**
- Brzo prebacivanje između stranica
- Instant prikaz rezultata pretraživanja
- Brzo učitavanje formi i podataka
- Lagan prijelaz između sekcija

**Optimizacija za različite brzine:**
- Optimizirano i za sporije internetske veze
- Postepeno učitavanje sadržaja gdje je moguće
- Prioritetno učitavanje važnog sadržaja
- Minimalno čekanje za korisnike

**Prednosti:**
- Manje vremena provedenog u čekanju
- Efikasniji rad na platformi
- Bolje korisničko iskustvo
- Više produktivnosti

**Kada primjećujete:**
- Prilikom otvaranja stranice - brzo se učitava
- Prilikom pretraživanja - rezultati se pojavljuju brzo
- Prilikom navigacije - brzo prebacivanje između stranica
- Prilikom učitavanja podataka - brzo prikazivanje

**Optimizacija:**
- Automatska optimizacija na strani platforme
- Nema potrebe za ručnom optimizacijom
- Kontinuirano poboljšanje performansi
- Optimalno iskustvo za sve korisnike

Brzo učitavanje stranica osigurava da možete efikasno raditi bez nepotrebnog čekanja!
`
    },
    "Pretraživanje u realnom vremenu": {
      implemented: true,
      summary: "Dok tipkate u polje za pretraživanje, rezultati se automatski prikazuju - ne trebate kliknuti na traži.",
      details: `## Kako funkcionira:

Pretraživanje radi u realnom vremenu - čim počnete tipkati, rezultati se automatski prikazuju bez potrebe da kliknete na gumb "Traži".

**Kako radi:**
- Dok tipkate u polje za pretraživanje, platforma automatski pretražuje
- Rezultati se prikazuju dok tipkate
- Rezultati se ažuriraju s svakim novim slovom
- Nema potrebe za ručnim pokretanjem pretraživanja

**Brzo pronalaženje:**
- Brzo vidite relevantne rezultate
- Mogućnost filtriranja dok tipkate
- Prikaz samo relevantnih rezultata
- Lako pronalaženje onoga što tražite

**Optimizacija:**
- Pametno pretraživanje koje razumije što tražite
- Ignoriranje nevažnih znakova
- Automatska korekcija tipfelera
- Prikaz najrelevantnijih rezultata prvo

**Prednosti:**
- Brže pronalaženje onoga što tražite
- Manje klikanja - automatski rad
- Efikasnije korištenje platforme
- Bolje korisničko iskustvo

**Kada koristiti:**
- Prilikom traženja poslova - tipkajte i vidite rezultate odmah
- Prilikom traženja pružatelja - brzo pronalaženje
- Prilikom pretraživanja kategorija - brzo filtriranje
- Prilikom traženja bilo koje informacije na platformi

**Pametno pretraživanje:**
- Razumije što tražite čak i ako ne tipkate točno
- Koristi različite varijante pretraživanja
- Prikazuje najrelevantnije rezultate
- Uzima u obzir kontekst pretraživanja

Pretraživanje u realnom vremenu osigurava brzo i efikasno pronalaženje onoga što tražite!
`
    },
    "Filtriranje i sortiranje": {
      implemented: true,
      summary: "Jednostavno filtrirate i sortirate rezultate prema vašim preferencama - pronađite točno ono što tražite.",
      details: `## Kako funkcionira:

Filtriranje i sortiranje vam omogućava da brzo pronađete točno ono što tražite iz velikog broja rezultata.

**Filtriranje:**
- Filtriranje po kategorijama - odaberite kategoriju i vidite samo te rezultate
- Filtriranje po lokaciji - odaberite grad ili regiju
- Filtriranje po budžetu - postavite minimalnu i maksimalnu cijenu
- Filtriranje po datumu - odaberite vremenski period
- Kombiniranje više filtera - koristite više filtera odjednom

**Sortiranje:**
- Sortiranje po datumu - najnovije ili najstarije prvo
- Sortiranje po cijeni - od najjeftinijih do najskupljih ili obrnuto
- Sortiranje po lokaciji - najbliže prvo
- Sortiranje po reputaciji - najbolje ocijenjeno prvo
- Sortiranje po relevantnosti - najrelevantnije prvo

**Jednostavno korištenje:**
- Lako odabir filtera i sortiranja
- Rezultati se automatski ažuriraju
- Mogućnost brzog resetiranja filtera
- Vidite koliko rezultata odgovara vašim filterima

**Prednosti:**
- Brže pronalaženje točno onoga što tražite
- Manje vremena provedenog na scrollanju
- Precizniji rezultati pretraživanja
- Bolje korisničko iskustvo

**Kada koristiti:**
- Prilikom pretraživanja poslova - filtrirate po kategoriji, lokaciji, budžetu
- Prilikom pretraživanja pružatelja - filtrirate po kategorijama i lokaciji
- Prilikom pregleda leadova - filtrirate po statusu, datumu, kategoriji
- Prilikom pregleda statistika - filtrirate po periodu, kategoriji

**Napredno filtriranje:**
- Kombiniranje više kriterija
- Spremanje omiljenih filtera
- Brzo primjenjivanje uobičajenih filtera
- Pregled svih aktivnih filtera na jednom mjestu

Filtriranje i sortiranje osigurava da brzo i lako pronađete točno ono što tražite!
`
    },
    "Lokalizacija (hrvatski jezik)": {
      implemented: true,
      summary: "Cijela platforma je na hrvatskom jeziku - sve je prevedeno i prilagođeno hrvatskim korisnicima.",
      details: `## Kako funkcionira:

Platforma je potpuno lokalizirana na hrvatskom jeziku - svi tekstovi, poruke, uputi i opisi su na hrvatskom.

**Hrvatski jezik:**
- Svi tekstovi na platformi su na hrvatskom
- Hrvatska gramatika i pravopis
- Hrvatski nazivi i izrazi
- Prilagođeno hrvatskim korisnicima

**Što je prevedeno:**
- Navigacija i izbornici
- Poruke i obavijesti
- Forme i uputi
- Opisi funkcija i funkcionalnosti
- Poruke o greškama i upozorenjima

**Kulturna prilagođenost:**
- Hrvatski datumi i formatiranje brojeva
- Hrvatski nazivi mjeseci i dana
- Hrvatski format adresa
- Prilagođeno hrvatskim običajima

**Prednosti:**
- Lako razumijevanje za hrvatske korisnike
- Prirodno korisničko iskustvo
- Nema jezičnih barijera
- Bolje razumijevanje funkcija i procesa

**Za koga je:**
- Hrvatski korisnici - sve je na njihovom jeziku
- Lokalni pružatelji usluga - prilagođeno njima
- Svi korisnici platforme - jedinstveno iskustvo

**Kada primjećujete:**
- Pri navigaciji - svi izbornici na hrvatskom
- Pri korištenju funkcija - svi uputi na hrvatskom
- Pri primanju obavijesti - sve poruke na hrvatskom
- Pri rješavanju problema - sve objašnjenja na hrvatskom

Lokalizacija na hrvatski jezik osigurava da svi korisnici mogu udobno koristiti platformu!
`
    },
    "Pristupačnost (accessibility)": {
      implemented: true,
      summary: "Platforma je dostupna svima - optimizirana za osobe s različitim potrebama i sposobnostima.",
      details: `## Kako funkcionira:

Pristupačnost osigurava da platformu mogu koristiti svi korisnici, uključujući osobe s invaliditetom ili posebnim potrebama.

**Za osobe s oštećenjem vida:**
- Podrška za screen readere (čitače ekrana)
- Visoki kontrast između elemenata
- Alternativni tekst za slike
- Jasno označeni linkovi i gumbi

**Za osobe s oštećenjem sluha:**
- Vizualne notifikacije uz zvučne
- Tekstualni prikaz svih informacija
- Alternativni načini komunikacije

**Za osobe s motoričkim oštećenjima:**
- Veliki klikabilni elementi
- Navigacija samo pomoću tipkovnice
- Jednostavne i jasne navigacijske putanje
- Minimalno preklapanje elemenata

**Za sve korisnike:**
- Jasni i čitljivi fontovi
- Logičan redoslijed elemenata
- Konzistentan dizajn
- Jasne upute i objašnjenja

**Prednosti:**
- Dostupno svim korisnicima
- Inkluzivno korisničko iskustvo
- Compliance s propisima o pristupačnosti
- Bolje korisničko iskustvo za sve

**Standardi:**
- Slijedi WCAG (Web Content Accessibility Guidelines) standarde
- Testirano s različitim asistivnim tehnologijama
- Kontinuirano poboljšanje pristupačnosti
- Osigurava pravedan pristup svima

**Kada primjećujete:**
- Lako navigiranje bez miša
- Čitljiv tekst na svim ekranima
- Jasno označeni elementi
- Alternativni načini pristupa funkcijama

Pristupačnost osigurava da svi korisnici mogu koristiti platformu bez obzira na njihove sposobnosti!
`
    },
    "Izvoz povijesti transakcija": {
      implemented: true,
      summary: "Izvezite svoju povijest transakcija u različite formate za vanjsku analizu ili računovodstvo.",
      details: `## Kako funkcionira:

Možete izvesti svoju kompletnu povijest transakcija u različite formate za analizu ili računovodstvo.

**Dostupni formati:**
- CSV format - za Excel ili Google Sheets
- PDF format - za tiskanje ili arhiviranje
- Excel format - direktno otvoren u Excelu
- JSON format - za tehničku analizu

**Što se izvozi:**
- Sve transakcije s datumima
- Tip transakcije (kupovina, refund, pretplata, itd.)
- Iznos svake transakcije
- Opis transakcije
- Status transakcije
- Stanje nakon transakcije

**Filtriranje prije izvoza:**
- Možete filtrirati transakcije prije izvoza
- Odaberite vremenski period (npr. zadnji mjesec, godinu)
- Filtrirate po tipu transakcije
- Kombiniranje više filtera

**Kako koristiti:**
- Odaberite format koji vam odgovara
- Postavite filtere ako je potrebno
- Kliknite na "Izvezi"
- Preuzmite datoteku na svoj računalo

**Kada koristiti:**
- Za računovodstvo - izvoz svih transakcija za knjigovodstvo
- Za analizu - analiza troškova i prihoda u Excelu
- Za arhiviranje - spremanje povijesti u PDF formatu
- Za porezne svrhe - priprema podataka za poreznu prijavu

**Prednosti:**
- Lako preuzimanje podataka
- Mogućnost analize u vanjskim alatima
- Spremanje podataka za kasniju upotrebu
- Pojednostavljenje računovodstva

**Sigurnost:**
- Samo vi možete izvesti svoje podatke
- Siguran prenos podataka
- Zaštićeni podaci
- Kontrola nad izvezenim podacima

Izvoz povijesti transakcija osigurava da možete koristiti svoje podatke u vanjskim alatima za analizu ili računovodstvo!
`
    },
    "Mesečni/godišnji izvještaji": {
      implemented: true,
      summary: "Automatski generirani izvještaji o vašim performansama za svaki mjesec ili godinu - pregled vašeg poslovanja u određenom periodu.",
      details: `## Kako funkcionira:

Platforma automatski generira detaljne izvještaje o vašim poslovnim rezultatima za odabrani vremenski period.

**Vrste izvještaja:**
- Mjesečni izvještaj - rezultati za određeni mjesec
- Godišnji izvještaj - rezultati za cijelu godinu
- Kvartalni izvještaj - rezultati za kvartal (3 mjeseca)
- Prilagođeni period - odaberite bilo koji vremenski period

**Što se uključuje u izvještaj:**
- Ukupan broj kupljenih leadova
- Broj konvertiranih leadova
- Stopa konverzije
- Ukupan prihod od leadova
- Prosječna vrijednost leada
- ROI (povrat ulaganja)
- Prosječno vrijeme odgovora
- Reputacija u tom periodu
- Usporedba s prethodnim periodom

**Kako se prikazuje:**
- Grafovi i tablice
- Sažetak ključnih pokazatelja
- Detaljna analiza performansi
- Trendovi i usporedbe
- Prikaz po kategorijama

**Kada koristiti:**
- Planiranje budućeg poslovanja
- Analiza uspješnosti strategije
- Porezne svrhe i računovodstvo
- Procjena performansi
- Donošenje poslovnih odluka

**Prednosti:**
- Automatsko generiranje - nema ručnog rada
- Kompletan pregled poslovanja
- Lako identificiranje trendova
- Osnova za donošenje odluka
- Dokumentacija poslovnih rezultata

**Kako pristupiti:**
- Odaberite period u ROI dashboardu
- Generirajte izvještaj za željeni period
- Pregledajte grafičke i tekstualne izvještaje
- Izvezite izvještaj ako želite (PDF, Excel)

**Usualne značajke:**
- Usporedba s prethodnim periodom
- Trend analiza
- Razbijanje po kategorijama
- Identifikacija najuspješnijih kategorija
- Preporuke za poboljšanje

Mesečni/godišnji izvještaji vam pružaju kompletan pregled vašeg poslovanja i pomažu u donošenju informiranih odluka!
`
    },
    "Filtriranje transakcija po tipu": {
      implemented: true,
      summary: "Jednostavno filtrirate svoju povijest transakcija prema tipu transakcije - vidite samo ono što vas zanima.",
      details: `## Kako funkcionira:

Možete filtrirati svoju povijest transakcija prema tipu transakcije kako biste brzo pronašli određene transakcije ili vidjeli samo određene vrste transakcija.

**Dostupni tipovi za filtriranje:**
- Kupovina leadova - sve transakcije gdje ste kupili leadove
- Refund - sve transakcije gdje ste dobili refund
- Pretplata - sve transakcije za pretplate
- Kredit dodan - transakcije gdje su vam dodani krediti
- Kredit oduzet - transakcije gdje su vam oduzeti krediti
- Ostalo - sve ostale transakcije

**Kako koristiti:**
- Odaberite tip transakcije iz padajućeg izbornika
- Rezultati se automatski filtriraju
- Vidite samo transakcije odabranog tipa
- Možete kombinirati s vremenskim filterom

**Kombiniranje filtera:**
- Kombinirate tip transakcije s vremenskim periodom
- Možete vidjeti samo kupnje leadova u zadnjem mjesecu
- Možete vidjeti samo refundove u određenom periodu
- Fleksibilno filtriranje prema vašim potrebama

**Prednosti:**
- Brzo pronalaženje određenih transakcija
- Lakše praćenje troškova i prihoda
- Jasniji pregled transakcija
- Efikasnije analiziranje poslovanja

**Kada koristiti:**
- Kada tražite određenu transakciju
- Prilikom analize troškova - filtrirate samo kupnje
- Prilikom analize prihoda - filtrirate samo refundove
- Prilikom provjere pretplata - filtrirate samo pretplate

**Usklađenost s drugim filterima:**
- Kombinirate s filtriranjem po datumu
- Kombinirate s filtriranjem po iznosu
- Kombinirate s sortiranjem
- Fleksibilno filtriranje za sve vaše potrebe

Filtriranje transakcija po tipu osigurava da brzo i lako pronađete ono što tražite u svojoj povijesti transakcija!
`
    },
    "Notifikacije o transakcijama": {
      implemented: true,
      summary: "Primajte automatske obavijesti o svim vašim transakcijama - kupovinama, refundovima, pretplatama i ostalim transakcijama.",
      details: `## Kako funkcionira:

Sustav automatski šalje obavijesti o svim vašim transakcijama kako biste bili uvijek informirani o promjenama na vašem računu.

**Kada primate notifikacije:**
- Kupovina leadova - kada kupite lead, primite notifikaciju
- Refund - kada dobijete refund, primite notifikaciju
- Pretplata aktivirana - kada se aktivira vaša pretplata
- Kredit dodan - kada vam se dodaju krediti
- Kredit oduzet - kada se oduzimaju krediti
- Status transakcije - kada se promijeni status transakcije

**Kako primate notifikacije:**
- In-app notifikacije - obavijesti na platformi
- Email notifikacije - obavijesti na vaš email
- Obje opcije - možete omogućiti obje vrste notifikacija

**Što sadrži notifikacija:**
- Tip transakcije - što je transakcija
- Iznos - koliki je iznos transakcije
- Datum i vrijeme - kada je transakcija izvršena
- Status - status transakcije
- Detalji - dodatne informacije o transakciji

**Prednosti:**
- Uvijek ste informirani o transakcijama
- Brzo otkrivanje neautoriziranih transakcija
- Praćenje svih promjena na računu
- Dokumentacija svih transakcija

**Kada koristite:**
- Praćenje troškova - vidite kada trošite kredite
- Praćenje prihoda - vidite kada dobivate refundove
- Sigurnost - brzo otkrivanje neautoriziranih transakcija
- Dokumentacija - zapis svih vaših transakcija

**Upravljanje notifikacijama:**
- Omogućite ili onemogućite notifikacije u postavkama
- Odaberite tipove transakcija za koje želite notifikacije
- Odaberite način primanja notifikacija
- Pristupite povijesti notifikacija kada god želite

**Sigurnost:**
- Brzo otkrivanje neautoriziranih transakcija
- Praćenje svih aktivnosti na računu
- Dokumentacija svih transakcija
- Lako praćenje financijskih aktivnosti

Notifikacije o transakcijama osiguravaju da ste uvijek informirani o svim promjenama na vašem računu!
`
    },
    "Dokument upload za verifikaciju": {
      implemented: true,
      summary: "Učitajte dokumente potrebne za verifikaciju vašeg identiteta ili tvrtke - dokaz vaše legitimnosti.",
      details: `## Kako funkcionira:

Kada je potrebno dokazati vaš identitet ili legitimnost tvrtke, možete učitati relevantne dokumente za verifikaciju.

**Vrste dokumenata:**
- Osobna iskaznica ili putovnica - za verifikaciju fizičke osobe
- OIB potvrda - za verifikaciju OIB-a
- Dokumenti o tvrtki - za verifikaciju pravne osobe
- Sudski registar - za verifikaciju registracije tvrtke
- Ostali dokumenati - prema potrebi verifikacije

**Kako učitati:**
- Odaberite dokument koji želite učitati
- Uploadajte sliku ili PDF dokumenta
- Provjerite da je dokument čitljiv i valjan
- Pristupite verifikaciji nakon upload-a

**Što se provjerava:**
- Validnost dokumenta
- Čitljivost dokumenta
- Podudaranje podataka s unosom
- Legitimnost dokumenta

**Prednosti:**
- Dokaz legitimnosti vašeg identiteta ili tvrtke
- Brža verifikacija
- Povećanje trust score-a
- Povećanje povjerenja korisnika

**Sigurnost:**
- Dokumenti se šalju sigurno
- Pristup samo administratorima za verifikaciju
- Zaštićeno spremanje dokumenata
- Pojedinačna kontrola pristupa

**Kada koristiti:**
- Prilikom verifikacije OIB-a
- Prilikom verifikacije tvrtke
- Prilikom potrebe za dodatnom verifikacijom
- Prilikom dokazivanja legitimnosti

Dokument upload za verifikaciju osigurava bržu i sigurniju verifikaciju vašeg identiteta ili tvrtke!
`
    },
    "Notifikacije o verifikaciji": {
      implemented: true,
      summary: "Primajte automatske obavijesti o statusu vaših verifikacija - kada se završi verifikacija ili ako je potrebno dodatno djelovanje.",
      details: `## Kako funkcionira:

Sustav automatski šalje obavijesti o statusu vaših verifikacija kako biste bili informirani o napretku procesa verifikacije.

**Kada primate notifikacije:**
- Verifikacija započeta - kada započne proces verifikacije
- Verifikacija uspješna - kada se verifikacija uspješno završi
- Verifikacija neuspješna - ako verifikacija nije uspjela
- Potrebno dodatno djelovanje - ako je potrebno nešto dodatno
- Dokument odobren - kada se dokument odobri
- Dokument odbačen - ako dokument ne odgovara zahtjevima

**Kako primate notifikacije:**
- In-app notifikacije - obavijesti na platformi
- Email notifikacije - obavijesti na vaš email
- Obje opcije - možete omogućiti obje vrste notifikacija

**Što sadrži notifikacija:**
- Status verifikacije - je li uspješna ili neuspješna
- Tip verifikacije - što je verificirano
- Datum i vrijeme - kada je verifikacija završena
- Detalji - dodatne informacije o verifikaciji
- Sljedeći koraci - što trebate učiniti ako je potrebno

**Prednosti:**
- Uvijek ste informirani o statusu verifikacije
- Brzo reagiranje ako je potrebno dodatno djelovanje
- Praćenje svih verifikacija
- Transparentnost procesa verifikacije

**Kada koristite:**
- Praćenje statusa verifikacija
- Odgovaranje na zahtjeve za dodatnim djelovanjem
- Provjera kada se verifikacija završi
- Dokumentacija svih verifikacija

**Upravljanje notifikacijama:**
- Omogućite ili onemogućite notifikacije u postavkama
- Odaberite tipove verifikacija za koje želite notifikacije
- Odaberite način primanja notifikacija
- Pristupite povijesti notifikacija kada god želite

Notifikacije o verifikaciji osiguravaju da ste uvijek informirani o statusu vaših verifikacija!
`
    },
    "Verificiranje firme (sudski registar)": {
      implemented: true,
      summary: "Automatska verifikacija vaše tvrtke u sudskom registru - provjera da je tvrtka registrirana i da su podaci ispravni.",
      details: `## Kako funkcionira:

Sustav automatski provjerava vašu tvrtku u sudskom registru kako bi verificirao da je tvrtka registrirana i da su podaci ispravni.

**Kako se verificira:**
- Unesete naziv tvrtke i OIB
- Sustav automatski provjerava u sudskom registru
- Provjerava se registracija tvrtke
- Provjeravaju se podaci (naziv, OIB, adresa)
- Verificira se legitimnost tvrtke

**Što se provjerava:**
- Je li tvrtka registrirana u sudskom registru
- Odgovaraju li podaci (naziv, OIB)
- Status tvrtke (aktivna, u stečaju, itd.)
- Legitimnost tvrtke

**Zašto je važno:**
- Dokaz legitimnosti tvrtke
- Osigurava ispravnost podataka
- Povećava povjerenje korisnika
- Veći trust score za verificirane tvrtke

**Prednosti:**
- Automatska verifikacija - nema ručnog rada
- Osigurava ispravnost podataka
- Povećava povjerenje korisnika
- Veći trust score znači kvalitetnije leadove

**Kako se koristi:**
- Tijekom registracije kao pružatelj
- Prilikom ažuriranja podataka o tvrtki
- Automatski u pozadini za provjeru legitimnosti
- Pri prikazivanju profila korisnicima

**Rezultat:**
- Business Badge se dodaje na profil ako je verifikacija uspješna
- Trust score se povećava
- Korisnici vide da je tvrtka verificirana
- Veća vjerojatnost dobivanja kvalitetnih leadova

Verificiranje firme u sudskom registru osigurava legitimnost tvrtke i povećava povjerenje korisnika!
`
    },
    "Automatska verifikacija": {
      implemented: true,
      summary: "Sustav automatski verificira određene podatke bez potrebe za ručnim unosom ili čekanjem - brža i efikasnija verifikacija.",
      details: `## Kako funkcionira:

Sustav automatski verificira određene podatke koristeći vanjske izvore i baze podataka, bez potrebe za ručnim unosom ili čekanjem na administratora.

**Što se automatski verificira:**
- Email adresa - provjera valjanosti email formata i domena
- OIB - provjera valjanosti OIB formata i checksum-a
- Tvrtka u sudskom registru - provjera registracije i podataka
- Telefon - provjera formata broja
- DNS TXT record - provjera DNS zapisa za domenu

**Kako radi:**
- Sustav automatski provjerava podatke u pozadini
- Koristi vanjske API-je i baze podataka
- Uspoređuje podatke s unosom
- Automatski odlučuje o statusu verifikacije
- Ažurira trust score na osnovu rezultata

**Prednosti:**
- Brža verifikacija - nema čekanja na administratora
- Efikasniji proces - automatski rad
- Konzistentna verifikacija za sve korisnike
- Veća sigurnost - provjera u realnom vremenu

**Kada se koristi:**
- Prilikom registracije - automatska provjera osnovnih podataka
- Prilikom ažuriranja podataka - provjera novih podataka
- Kontinuirano - provjera valjanosti postojećih podataka
- U pozadini - neprekidna provjera legitimnosti

**Rezultati:**
- Odmah vidljiv status verifikacije
- Automatsko ažuriranje trust score-a
- Dodavanje Identity Badge-a ako je verifikacija uspješna
- Upozorenje ako verifikacija ne uspije

**Za korisnike:**
- Brža verifikacija bez čekanja
- Transparentan proces verifikacije
- Automatsko ažuriranje statusa
- Lako praćenje verifikacije

Automatska verifikacija osigurava bržu i efikasniju verifikaciju vaših podataka!
`
    },
    "Pregled vlastitih poslova (MyJobs)": {
      implemented: true,
      summary: "Jednostavno pregledajte sve svoje objavljene poslove na jednom mjestu - praćenje statusa i upravljanje poslovima.",
      details: `## Kako funkcionira:

Kao korisnik usluge možete pregledati sve svoje objavljene poslove na jednom mjestu - jednostavno i efikasno upravljanje poslovima.

**Što vidite:**
- Svi vaši objavljeni poslovi
- Status svakog posla (OTVOREN, U TIJEKU, ZAVRŠEN, OTKAZAN)
- Broj primljenih ponuda za svaki posao
- Datum objavljivanja i status
- Lokacija i budžet svakog posla

**Funkcionalnosti:**
- Pregled svih vaših poslova
- Filtriranje poslova po statusu
- Sortiranje poslova po datumu ili statusu
- Brzi pristup detaljima svakog posla
- Uređivanje statusa posla

**Upravljanje poslovima:**
- Promijenite status posla kada je potrebno
- Otvorite detalje posla za pregled ponuda
- Uređujte informacije o poslu ako je potrebno
- Otkažite posao ako više nije potreban

**Prednosti:**
- Centralizirano upravljanje poslovima
- Brz pregled svih vaših aktivnih poslova
- Lako praćenje statusa poslova
- Efikasno upravljanje komunikacijom s pružateljima

**Kada koristiti:**
- Pregled svih svojih poslova
- Provjera statusa poslova
- Upravljanje ponudama za poslove
- Provjera aktivnih poslova

**Integracija:**
- Pregled ponuda za svaki posao
- Pristup chatu s pružateljima
- Pregled recenzija nakon završetka posla
- Praćenje cijelog procesa od objave do završetka

Pregled vlastitih poslova osigurava jednostavno i efikasno upravljanje svim vašim poslovima na jednom mjestu!
`
    },
    "Navigacija specifična za korisnike usluge": {
      implemented: true,
      summary: "Prilagođena navigacija za korisnike usluge - vidite samo linkove i funkcije relevantne za vašu ulogu, bez zbunjujućih opcija.",
      details: `## Kako funkcionira:

Kao korisnik usluge vidite navigaciju prilagođenu vašoj ulozi - samo linkove i funkcije koje su relevantne za korisnike usluge, bez opcija koje su namijenjene pružateljima usluga.

**Što vidite:**
- Linkovi relevantni za korisnike usluge
- Funkcije za objavljivanje poslova
- Pregled svojih poslova
- Komunikacija s pružateljima
- Upravljanje ponudama

**Što se skriva:**
- Funkcije specifične za pružatelje (npr. ROI dashboard, Lead Queue)
- Provider-specifični linkovi
- Funkcije za upravljanje leadovima
- Provider-specifične statistike

**Prednosti:**
- Jednostavnija navigacija
- Manje zbunjujuće opcije
- Brže pronalaženje relevantnih funkcija
- Bolje korisničko iskustvo
- Fokus na ono što vam je potrebno

**Kako funkcionira:**
- Automatski prilagođavanje na osnovu vaše uloge
- Dinamičko prikazivanje/skrivanje linkova
- Konzistentna navigacija kroz cijelu platformu
- Automatsko ažuriranje kada promijenite ulogu

**Kada primjećujete:**
- Pri prvom ulasku na platformu - navigacija je prilagođena
- Prilikom navigacije - vidite samo relevantne linkove
- Prilikom promjene uloge - navigacija se automatski ažurira
- Kroz cijelo korisničko iskustvo

**Za pružatelje:**
- Pružatelji vide svoju prilagođenu navigaciju
- Funkcije specifične za pružatelje su vidljive
- Provider-specifični linkovi su dostupni
- Različita navigacija za različite uloge

Navigacija specifična za korisnike usluge osigurava jednostavniju i jasniju navigaciju prilagođenu vašoj ulozi!
`
    },
    "Pregled cjenika": {
      implemented: true,
      summary: "Jednostavno pregledajte cijene leadova i paketa pretplate - vidite koliko košta svaki plan i što je uključeno.",
      details: `## Kako funkcionira:

Na stranici cjenika možete vidjeti sve cijene leadova i paketa pretplate na jednom mjestu.

**Cijene leadova:**
- Vidite cijene leadova po kategorijama
- Cijene se izražavaju u kreditima (npr. 10-20 kredita)
- Različite cijene za različite kategorije
- Transparentne cijene bez skrivenih troškova

**Paketi pretplate:**
- BASIC plan - osnovni paket s određenim brojem kredita
- PREMIUM plan - napredniji paket s više kredita
- PRO plan - najnapredniji paket s najviše kredita
- Vidite što je uključeno u svaki paket
- Cijene za svaki paket

**Što vidite:**
- Cijene svih paketa pretplate
- Cijene leadova po kategorijama
- Što je uključeno u svaki paket
- Besplatni trial period informacije
- Cijene za jednokratnu kupovinu leadova

**Prednosti:**
- Transparentne cijene
- Lako usporedba paketa
- Jasno vidite što dobivate
- Informirano donošenje odluka

**Kada koristiti:**
- Pri odabiru paketa pretplate
- Pri planiranju budžeta
- Pri usporedbi paketa
- Pri odlučivanju o kupovini leadova

Pregled cjenika osigurava transparentnost i lako uspoređivanje cijena paketa i leadova!
`
    },
    "Različiti paketi pretplate (BASIC, PREMIUM, PRO)": {
      implemented: true,
      summary: "Tri različita paketa pretplate s različitim količinama kredita i prednostima - odaberite paket koji vam najbolje odgovara.",
      details: `## Kako funkcionira:

Platforma nudi tri različita paketa pretplate - BASIC, PREMIUM i PRO - svaki s različitim količinama kredita i prednostima.

**BASIC paket:**
- Osnovni paket za početnike
- Najmanja cijena
- Osnovni broj kredita
- Osnovne funkcionalnosti
- Idealno za testiranje platforme

**PREMIUM paket:**
- Napredniji paket za aktivne pružatelje
- Srednja cijena
- Više kredita nego BASIC
- Dodatne funkcionalnosti
- Idealno za redovite korisnike

**PRO paket:**
- Najnapredniji paket za profesionalce
- Najviša cijena, ali najviše vrijednosti
- Najviše kredita
- Sve funkcionalnosti
- Idealno za profesionalne pružatelje

**Usporedba paketa:**
- Vidite razlike između paketa
- Jasno vidite što dobivate u svakom paketu
- Lako odabir paketa koji vam odgovara
- Možete nadograditi paket kada god želite

**Prednosti:**
- Fleksibilnost - odaberite paket koji vam odgovara
- Mogućnost nadogradnje - možete promijeniti paket
- Različiti paketi za različite potrebe
- Transparentne cijene i uvjeti

**Kada koristiti:**
- Pri prvoj registraciji - počnite s BASIC paketom
- Prilikom rasta poslovanja - nadogradite na PREMIUM ili PRO
- Prilikom optimizacije troškova - smanjite na niži paket ako treba
- Prilikom planiranja budžeta - odaberite paket koji odgovara vašem budžetu

Različiti paketi pretplate osiguravaju fleksibilnost i prilagođavanje vašim potrebama i budžetu!
`
    },
    "Online plaćanje (Stripe Checkout)": {
      implemented: true,
      summary: "Sigurno online plaćanje za pretplate i kupovinu leadova preko Stripe Checkout-a - brzo i sigurno plaćanje karticom.",
      details: `## Kako funkcionira:

Platforma koristi Stripe Checkout za sigurno online plaćanje pretplata i kupovinu leadova.

**Kako funkcionira:**
- Odaberete paket pretplate ili lead koji želite kupiti
- Kliknete na "Plaćanje" ili "Kupnja"
- Preusmjereni ste na Stripe Checkout stranicu
- Unesete podatke o kartici
- Plaćanje se procesuira sigurno

**Sigurnost:**
- Stripe je PCI DSS certificiran
- Vaši podaci o kartici se ne pohranjuju na platformi
- Enkriptirana komunikacija
- Sigurno procesiranje plaćanja

**Podržane metode plaćanja:**
- Kreditne kartice (Visa, Mastercard, American Express)
- Debitne kartice
- Lokalne kartice (ovisno o regiji)
- Automatske pretplate za mjesečne plaćanja

**Prednosti:**
- Sigurno plaćanje
- Brzo i jednostavno
- Podrška za različite kartice
- Automatsko ažuriranje pretplata

**Kada koristiti:**
- Prilikom kupovine pretplate
- Prilikom jednokratne kupovine leadova
- Prilikom nadogradnje pretplate
- Prilikom obnavljanja pretplate

**Povratak na platformu:**
- Nakon uspješnog plaćanja vraćate se na platformu
- Pretplata se automatski aktivira
- Krediti se dodaju na račun
- Možete odmah koristiti kupljene usluge

**Povrat novca:**
- Mogućnost refund-a ako je potrebno
- Automatski refund u određenim situacijama
- Kontaktirajte podršku za refund zahtjeve

Online plaćanje preko Stripe Checkout-a osigurava sigurno i brzo plaćanje vaših pretplata i leadova!
`
    },
    "Automatska provjera valjanosti licenci": {
      implemented: true,
      summary: "Sustav automatski provjerava valjanost vaših licenci - proverava datume isteka i status licenci.",
      details: `## Kako funkcionira:

Sustav automatski provjerava valjanost vaših licenci u pozadini - provjerava datume isteka i status licenci.

**Kako se provjerava:**
- Sustav automatski provjerava datume isteka licenci
- Provjerava se status licence (aktívna, istekla, itd.)
- Provjeravaju se podaci o licenci
- Automatsko ažuriranje statusa licenci

**Što se provjerava:**
- Datum isteka - je li licenca istekla
- Status licence - je li licenca aktívna
- Valjanost podataka - odgovaraju li podaci
- Potreba za obnavljanjem - treba li obnoviti licencu

**Automatske provjere:**
- Provjera svakodnevno u pozadini
- Provjera pri pristupu određenim funkcionalnostima
- Provjera pri prikazivanju profila
- Kontinuirano praćenje valjanosti

**Notifikacije:**
- Upozorenja kada se licence približavaju isteku
- Upozorenja kada licence ističu
- Podsjetnici za obnavljanje
- Informacije o statusu licenci

**Prednosti:**
- Automatska provjera - nema ručnog rada
- Brzo otkrivanje problema s licencama
- Pravovremene podsjetnike za obnavljanje
- Osigurava aktualnost licenci

**Kada se koristi:**
- Kontinuirano u pozadini
- Prilikom pristupa funkcionalnostima koje zahtijevaju licence
- Prilikom prikazivanja profila korisnicima
- Prilikom provjere kvalifikacija pružatelja

**Rezultati:**
- Status licence se automatski ažurira
- Profil prikazuje valjanost licenci
- Korisnici vide da imate valjane licence
- Ako licence ističu, primite podsjetnike

Automatska provjera valjanosti licenci osigurava da vaše licence ostaju aktualne i valjane!
`
    },
    "Kreditni sustav": {
      implemented: true,
      summary: "Interni sustav kredita za kupovinu leadova - umjesto direktnog plaćanja, koristite kredite koje kupujete ili dobivate s pretplatom.",
      details: `## Kako funkcionira:

Platforma koristi kreditni sustav gdje umjesto direktnog plaćanja za svaki lead, kupujete kredite koje zatim koristite za kupovinu leadova.

**Kako dobiti kredite:**
- Kupnja pretplate - svaki paket uključuje određeni broj kredita
- Jednokratna kupovina - možete kupiti dodatne kredite
- Besplatni trial - dobivate besplatne kredite za probno razdoblje
- Refund - ako dobijete refund, vraća vam se kredit

**Kako koristiti kredite:**
- Kupnja leadova - svaki lead košta određeni broj kredita (npr. 10-20 kredita)
- Automatsko oduzimanje - kada kupite lead, krediti se automatski oduzimaju
- Praćenje stanja - vidite koliko kredita imate na računu
- Povijest - sve transakcije se bilježe

**Prednosti:**
- Jednostavnije plaćanje - ne trebate plaćati za svaki lead odvojeno
- Fleksibilnost - kupujete kredite kada vam trebaju
- Praćenje - lako vidite koliko ste potrošili
- Refund - lako vraćanje kredita ako je potrebno

**Kada koristiti:**
- Pri kupovini leadova - koristite kredite umjesto direktnog plaćanja
- Pri planiranju budžeta - kupujete kredite unaprijed
- Pri upravljanju troškovima - pratite koliko kredita trošite

Kreditni sustav osigurava jednostavnije i fleksibilnije plaćanje leadova!
`
    },
    "Povijest transakcija": {
      implemented: true,
      summary: "Kompletan zapis svih vaših transakcija s kreditima - kupnje, refundovi, pretplate i ostale transakcije.",
      details: `## Kako funkcionira:

Sustav automatski bilježi sve vaše transakcije s kreditima - kompletna povijest svih vaših financijskih aktivnosti na platformi.

**Što se bilježi:**
- Kupnja leadova - kada kupite lead, transakcija se bilježi
- Refund - kada dobijete refund, transakcija se bilježi
- Pretplata - aktivacija pretplate se bilježi
- Kredit dodan - kada se dodaju krediti, transakcija se bilježi
- Kredit oduzet - kada se oduzimaju krediti, transakcija se bilježi

**Informacije o transakciji:**
- Datum i vrijeme transakcije
- Tip transakcije
- Iznos transakcije
- Stanje nakon transakcije
- Opis transakcije
- Status transakcije

**Kako pregledati:**
- Pristupite povijesti transakcija u postavkama
- Filtrirate transakcije po tipu
- Sortirate transakcije po datumu
- Izvezite povijest ako je potrebno

**Prednosti:**
- Kompletan zapis svih transakcija
- Lako praćenje troškova i prihoda
- Dokumentacija za računovodstvo
- Transparentnost svih transakcija

**Kada koristiti:**
- Praćenje troškova - vidite koliko ste potrošili
- Praćenje prihoda - vidite koliko ste dobili od refundova
- Računovodstvo - izvezite podatke za knjigovodstvo
- Analiza - analizirajte svoje troškove i prihode

Povijest transakcija osigurava kompletan zapis svih vaših financijskih aktivnosti na platformi!
`
    },
    "Odabir tipa korisnika (Korisnik usluge / Pružatelj usluge)": {
      implemented: true,
      summary: "Tijekom registracije odaberite jesmo li korisnik usluge (tražite usluge) ili pružatelj usluga (nudite usluge).",
      details: `## Kako funkcionira:

Prilikom registracije na platformu odaberete tip korisnika - želite li biti korisnik usluge ili pružatelj usluga.

**Tipovi korisnika:**
- Korisnik usluge - tražite usluge, objavljujete poslove, primate ponude
- Pružatelj usluga - nudite usluge, šaljete ponude, primate leadove
- Možete imati obje uloge - odaberite obje opcije

**Što određuje odabir:**
- Funkcionalnosti koje ćete vidjeti na platformi
- Navigacija - različita navigacija za različite tipove korisnika
- Funkcije - pristup različitim funkcijama ovisno o tipu
- Profil - različiti tipovi profila za različite tipove korisnika

**Kako odabrati:**
- Tijekom registracije odaberete tip korisnika
- Možete odabrati samo jedan tip ili oba
- Možete promijeniti tip korisnika kasnije u postavkama
- Različiti tipovi imaju različite funkcionalnosti

**Prednosti:**
- Prilagođeno iskustvo za vašu ulogu
- Relevantne funkcije za vašu potrebu
- Jednostavnija navigacija
- Fokus na ono što vam je potrebno

**Za korisnike usluge:**
- Vidite funkcije za objavljivanje poslova
- Pristup upravljanju poslovima
- Komunikacija s pružateljima
- Prihvaćanje ponuda

**Za pružatelje usluga:**
- Vidite funkcije za upravljanje leadovima
- Pristup ROI dashboardu
- Komunikacija s korisnicima
- Slanje ponuda

Odabir tipa korisnika osigurava da vidite funkcije relevantne za vašu ulogu na platformi!
`
    },
    "Profil korisnika usluge (UserProfile)": {
      implemented: true,
      summary: "Vaš osobni profil kao korisnik usluge - upravljajte svojim podacima, postavkama i pregledom aktivnosti.",
      details: `## Kako funkcionira:

Kao korisnik usluge imate svoj osobni profil gdje možete upravljati podacima, postavkama i pregledati svoje aktivnosti.

**Što možete upravljati:**
- Osobni podaci - ime, prezime, email, telefon
- Lokacija - grad, adresa gdje tražite usluge
- Postavke - preferencije i postavke profila
- Notifikacije - upravljanje obavijestima
- Sigurnost - lozinka i sigurnosne postavke

**Što vidite:**
- Svi vaši objavljeni poslovi
- Primljene ponude
- Komunikacija s pružateljima
- Recenzije koje ste ostavili
- Povijest aktivnosti

**Prednosti:**
- Centralizirano upravljanje podacima
- Jednostavno ažuriranje informacija
- Pregled svih aktivnosti
- Kontrola nad profilom i postavkama

**Kada koristiti:**
- Ažuriranje osobnih podataka
- Promjena postavki
- Pregled vlastitih aktivnosti
- Upravljanje notifikacijama

**Integracija:**
- Povezano s vašim poslovima
- Povezano s ponudama
- Povezano s komunikacijom
- Povezano s recenzijama

Profil korisnika usluge osigurava jednostavno upravljanje vašim podacima i aktivnostima na platformi!
`
    },
    "Status pretplate (ACTIVE, CANCELLED, EXPIRED)": {
      implemented: true,
      summary: "Praćenje statusa vaše pretplate - vidite je li pretplata aktivna, otkazana ili istekla.",
      details: `## Kako funkcionira:

Svaka pretplata ima status koji pokazuje njezino trenutno stanje - aktivna, otkazana ili istekla.

**Statusi pretplate:**
- ACTIVE (Aktivna) - pretplata je aktivna i možete koristiti sve funkcionalnosti
- CANCELLED (Otkazana) - pretplata je otkazana ali još vrijedi do kraja perioda
- EXPIRED (Istekla) - pretplata je istekla i više ne možete koristiti funkcionalnosti

**ACTIVE status:**
- Pretplata je aktivna i funkcionalna
- Možete koristiti sve kredite i funkcionalnosti
- Automatsko obnavljanje na kraju perioda (ako je omogućeno)
- Pristup svim funkcionalnostima

**CANCELLED status:**
- Pretplata je otkazana
- Možete koristiti kredite i funkcionalnosti do kraja plaćenog perioda
- Ne obnavlja se automatski na kraju perioda
- Prelazi na EXPIRED nakon isteka perioda

**EXPIRED status:**
- Pretplata je istekla
- Ne možete koristiti funkcionalnosti koje zahtijevaju pretplatu
- Možete se vratiti na BASIC plan ili aktivirati novu pretplatu
- Krediti ostaju ako su ostali

**Kako vidjeti status:**
- U postavkama pretplate
- Na dashboardu
- U obavijestima
- Automatski ažuriranje statusa

**Prednosti:**
- Jasna slika statusa pretplate
- Lako praćenje aktivnosti pretplate
- Transparentnost statusa
- Upozorenja prije isteka

Status pretplate osigurava da uvijek znate u kojem je stanju vaša pretplata!
`
    },
    "Trial period (7 dana)": {
      implemented: true,
      summary: "Probno razdoblje od 7 dana - isprobajte platformu besplatno prije nego što kupite pretplatu.",
      details: `## Kako funkcionira:

Novi pružatelji dobivaju besplatno probno razdoblje od 7 dana da isprobaju platformu prije nego što kupe pretplatu.

**Što dobivate:**
- Besplatno probno razdoblje od 7 dana
- Besplatni krediti za kupovinu leadova
- Pristup svim funkcionalnostima
- Mogućnost isprobavanja platforme bez obveze

**Kako funkcionira:**
- Automatski se aktivira pri registraciji kao pružatelj
- Traje 7 dana od trenutka registracije
- Ne morate unijeti podatke o kartici
- Možete koristiti sve funkcionalnosti

**Prednosti:**
- Isprobajte platformu bez rizika
- Vidite je li platforma za vas
- Bez obveze - možete odustati bilo kada
- Besplatno testiranje funkcionalnosti

**Kada se koristi:**
- Prilikom prve registracije kao pružatelj
- Prije kupovine pretplate
- Za testiranje platforme
- Za upoznavanje s funkcionalnostima

**Nakon trial perioda:**
- Možete kupiti pretplatu ako želite nastaviti
- Možete odustati bez obveze
- Prelazite na BASIC plan ako ne kupite pretplatu
- Nema automatske naplate

Trial period vam omogućava da besplatno isprobate platformu prije kupovine pretplate!
`
    },
    "Besplatni krediti za trial (5 leadova)": {
      implemented: true,
      summary: "Dobivate besplatne kredite za kupovinu 5 leadova tijekom probnog razdoblja - dovoljno da isprobate funkcionalnosti.",
      details: `## Kako funkcionira:

Tijekom probnog razdoblja od 7 dana dobivate besplatne kredite dovoljne za kupovinu 5 leadova.

**Koliko kredita dobivate:**
- Dovoljno kredita za kupovinu 5 leadova
- Možete isprobati kupovinu leadova
- Možete testirati queue sustav
- Možete vidjeti kako funkcioniraju leadovi

**Kako koristiti:**
- Kupite leadove kao što biste inače
- Krediti se automatski oduzimaju
- Možete vidjeti koliko kredita imate
- Sve funkcionalnosti su dostupne

**Prednosti:**
- Pravi test funkcionalnosti
- Vidite kako funkcionira kupnja leadova
- Isprobajte queue sustav
- Bez troškova za testiranje

**Kada koristiti:**
- Tijekom trial perioda
- Za testiranje kupovine leadova
- Za upoznavanje s funkcionalnostima
- Za procjenu kvalitete leadova

**Nakon potrošnje kredita:**
- Možete kupiti pretplatu za više kredita
- Možete testirati ostale funkcionalnosti
- Trial period i dalje traje 7 dana
- Nema automatske naplate

Besplatni krediti za trial omogućavaju vam da isprobate kupovinu leadova bez troškova!
`
    },
    "Notifikacije o isteku licenci": {
      implemented: true,
      summary: "Primajte automatske obavijesti kada se vaše licence približavaju isteku ili ističu - ne propustite obnavljanje.",
      details: `## Kako funkcionira:

Sustav automatski šalje obavijesti o isteku vaših licenci kako biste na vrijeme obnovili licence.

**Kada primate notifikacije:**
- 30 dana prije isteka - prvo upozorenje
- 14 dana prije isteka - podsjetnik
- 7 dana prije isteka - važan podsjetnik
- 1 dan prije isteka - posljednji podsjetnik
- Na dan isteka - obavijest o isteku

**Kako primate notifikacije:**
- In-app notifikacije - obavijesti na platformi
- Email notifikacije - obavijesti na vaš email
- Obje opcije - možete omogućiti obje vrste notifikacija

**Što sadrži notifikacija:**
- Datum isteka licence
- Koja licenca ističe
- Koliko dana preostaje do isteka
- Link za obnavljanje licence
- Upute za obnavljanje

**Prednosti:**
- Pravovremene podsjetnike za obnavljanje
- Ne propustite istek licence
- Održavate aktualan profil
- Kontinuirana dostupnost funkcionalnosti

**Kada koristite:**
- Praćenje isteka licenci
- Planiranje obnavljanja
- Održavanje aktualnog profila
- Osiguravanje kontinuirane dostupnosti

**Upravljanje notifikacijama:**
- Omogućite ili onemogućite notifikacije u postavkama
- Odaberite način primanja notifikacija
- Prilagodite kada primate podsjetnike
- Pristupite povijesti notifikacija

**Zašto je važno:**
- Održavate valjanost licenci
- Ne gubite pristup funkcionalnostima
- Gradite povjerenje korisnika
- Compliance s propisima

Notifikacije o isteku licenci osiguravaju da na vrijeme obnovite licence i održavate aktualan profil!
`
    },
    "ROI dashboard za providere": {
      implemented: true,
      summary: "Centralizirani dashboard za praćenje vaših poslovnih rezultata - vidite stopu konverzije, prihod, ROI i sve važne metrike na jednom mjestu.",
      details: `## Kako funkcionira:

ROI dashboard je centralizirana stranica gdje možete vidjeti sve svoje poslovne rezultate i metrike na jednom mjestu.

**Što vidite na dashboardu:**
- Ukupan prihod od leadova - koliko ste zaradili
- Stopa konverzije - koliko leadova konvertirate
- Prosječna vrijednost leada - prosječni prihod po leadu
- Ukupno potrošenih kredita - koliko ste uložili
- ROI (povrat ulaganja) - profitabilnost vašeg poslovanja
- Prosječno vrijeme odgovora - koliko brzo odgovarate
- Reputacija - vaša trenutna reputacija

**Grafički prikazi:**
- Krugovni graf - status breakdown leadova
- Linijski graf - mjesečni prihod i ROI trendovi
- Stupčasti graf - mjesečni leadovi po statusu
- Graf konverzije - trend stope konverzije
- Graf prihoda po kategorijama - koje kategorije donose najviše prihoda

**Filtriranje i analiza:**
- Filtriranje po vremenskom periodu (mjesec, kvartal, godina)
- Filtriranje po kategorijama
- Usporedba s prethodnim periodom
- Detaljna analiza performansi

**Prednosti:**
- Svi vaši rezultati na jednom mjestu
- Brzo prepoznavanje trendova
- Lako identificiranje područja za poboljšanje
- Informirano donošenje odluka o budžetu

**Kada koristiti:**
- Svakodnevno - brz pregled performansi
- Tjedno - analiza tjednih rezultata
- Mjesečno - planiranje budžeta i strategije
- Kvartalno - procjena dugoročnih rezultata

**Predviđanja:**
- AI predviđanja budućih performansi
- Trend analiza
- Preporuke za optimizaciju
- Procjena budućeg ROI-ja

ROI dashboard osigurava da imate kompletnu sliku vašeg poslovanja i pomaže vam optimizirati vaše rezultate!
`
    },
    "Cijene leadova (10-20 kredita)": {
      implemented: true,
      summary: "Transparentne cijene leadova - svaki lead košta između 10 i 20 kredita, ovisno o kategoriji i kvaliteti leada.",
      details: `## Kako funkcionira:

Svaki lead na tržištu ima svoju cijenu koja se izražava u kreditima - obično između 10 i 20 kredita po leadu.

**Raspon cijena:**
- Minimum: 10 kredita - za osnovne leadove
- Maksimum: 20 kredita - za visokokvalitetne leadove
- Prosjek: 15 kredita - za većinu leadova
- Cijena ovisi o kategoriji i kvaliteti leada

**Što utječe na cijenu:**
- Kategorija usluge - neke kategorije koštaju više
- Kvaliteta leada - viši AI score = viša cijena
- Trust score korisnika - verificirani korisnici = viša cijena
- Kompleksnost posla - veći poslovi = viša cijena

**Transparentnost:**
- Vidite cijenu prije kupovine
- Nema skrivenih troškova
- Cijena je jasno prikazana
- Lako planiranje budžeta

**Kako vidjeti cijenu:**
- Na tržištu leadova vidite cijenu svakog leada
- Cijena je prikazana u kreditima
- Možete filtrirati po cijeni
- Vidite raspon cijena za kategoriju

**Prednosti:**
- Transparentne cijene
- Lako planiranje budžeta
- Jasno vidite što plaćate
- Fer cijene za sve pružatelje

**Kada koristiti:**
- Pri odabiru leadova za kupovinu
- Pri planiranju budžeta
- Pri usporedbi leadova
- Pri optimizaciji troškova

**Fleksibilnost:**
- Možete kupiti leadove različitih cijena
- Mogućnost odabira prema budžetu
- Kombiniranje leadova različitih cijena
- Optimizacija ulaganja

Cijene leadova osiguravaju transparentnost i lako planiranje budžeta za kupovinu leadova!
`
    },
    "Red čekanja za leadove (LeadQueue)": {
      implemented: true,
      summary: "Automatski red čekanja koji distribuira leadove pružateljima prema njihovoj poziciji i reputaciji - pravedna i efikasna distribucija.",
      details: `## Kako funkcionira:

LeadQueue je automatski sustav koji distribuira leadove pružateljima prema njihovoj poziciji u redu i reputaciji.

**Kako radi:**
- Kada se pojavi novi lead, dodaje se u red čekanja
- Pružatelji se dodjeljuju prema poziciji u redu
- Pružatelji s boljom reputacijom dobivaju prioritet
- Automatska distribucija svakog sata

**Pozicija u redu:**
- Svaki pružatelj ima poziciju u redu
- Pozicija se određuje na osnovu reputacije i performansi
- Pružatelji s boljom reputacijom su više u redu
- Aktivni pružatelji mogu poboljšati poziciju

**Statusi leadova:**
- WAITING - čeka na dodjelu pružatelju
- OFFERED - ponuđen pružatelju
- ACCEPTED - prihvaćen od strane pružatelja
- DECLINED - odbijen od strane pružatelja
- EXPIRED - istekao rok za odgovor
- SKIPPED - preskočen zbog neaktivnosti

**Prednosti:**
- Pravedna distribucija leadova
- Aktivni pružatelji dobivaju prioritet
- Automatska distribucija bez ručnog rada
- Optimizirana distribucija za maksimalnu konverziju

Red čekanja za leadove osigurava pravednu i efikasnu distribuciju leadova svim pružateljima!
`
    },
    "Statusi u redu (WAITING, OFFERED, ACCEPTED, DECLINED, EXPIRED, SKIPPED)": {
      implemented: true,
      summary: "Različiti statusi leadova u redu čekanja - vidite gdje se svaki lead nalazi u procesu distribucije.",
      details: `## Kako funkcionira:

Svaki lead u redu čekanja ima status koji pokazuje gdje se nalazi u procesu distribucije.

**Statusi leadova:**

**WAITING (Čeka):**
- Lead čeka na dodjelu pružatelju
- Još nije ponuđen nikome
- U redu čekanja za distribuciju

**OFFERED (Ponuđen):**
- Lead je ponuđen pružatelju
- Čeka odgovor pružatelja
- Rok za odgovor: 24 sata

**ACCEPTED (Prihvaćen):**
- Pružatelj je prihvatio lead
- Lead je sada aktivan za pružatelja
- Pružatelj može kontaktirati korisnika

**DECLINED (Odbijen):**
- Pružatelj je odbio lead
- Lead se vraća u red za druge pružatelje
- Automatski se ponudi sljedećem pružatelju

**EXPIRED (Istekao):**
- Rok za odgovor je istekao (24h)
- Pružatelj nije odgovorio na vrijeme
- Lead se vraća u red ili se refundira

**SKIPPED (Preskočen):**
- Pružatelj je preskočen zbog neaktivnosti
- Lead se automatski pomiče sljedećem
- Aktivni pružatelji dobivaju prioritet

**Kako vidjeti status:**
- U sekciji "Pregled mojih leadova u redu"
- Svaki lead prikazuje svoj status
- Filtriranje leadova po statusu
- Pregled svih leadova s njihovim statusima

**Prednosti:**
- Jasna slika statusa svakog leada
- Lako praćenje leadova
- Transparentnost procesa distribucije
- Brže reagiranje na promjene statusa

Statusi u redu osiguravaju da uvijek znate gdje se vaši leadovi nalaze u procesu distribucije!
`
    },
    "Rok za odgovor (24h)": {
      implemented: true,
      summary: "Imate 24 sata da odgovorite na lead koji vam je ponuđen - nakon toga se automatski vraća u red ili se refundira.",
      details: `## Kako funkcionira:

Kada vam se ponudi lead u redu čekanja, imate 24 sata da odgovorite - prihvatite li ili odbijete lead.

**Kako funkcionira:**
- Lead vam se ponudi u queue sustavu
- Od trenutka ponude imate 24 sata za odgovor
- Možete prihvatiti (INTERESTED) ili odbiti (NOT_INTERESTED)
- Ako ne odgovorite, lead se automatski vraća u red

**Što se događa ako ne odgovorite:**
- Nakon 24 sata lead se označi kao EXPIRED
- Lead se vraća u red za druge pružatelje
- Moguć je automatski refund ako nema odgovora
- Vaša reputacija može biti utječena

**Zašto je važno brzo odgovoriti:**
- Brži odgovori donose bolju reputaciju
- Aktivni pružatelji dobivaju prioritet u distribuciji
- Veća šansa da prihvatite lead prije nego što ističe
- Manje rizika od isteka roka

**Kako pratiti:**
- Vidite koliko vremena preostaje za svaki lead
- Notifikacije za nove leadove u redu
- Podsjetnici prije isteka roka
- Jasni indikatori vremena

**Prednosti:**
- Potiče brze odgovore
- Pravedna distribucija leadova
- Automatsko upravljanje neaktivnim pružateljima
- Efikasniji proces distribucije

Rok za odgovor osigurava da leadovi ne ostaju neodgovoreni i da aktivni pružatelji dobivaju prioritet!
`
    },
    "Odgovori providera (INTERESTED, NOT_INTERESTED, NO_RESPONSE)": {
      implemented: true,
      summary: "Tri moguća odgovora kada vam se ponudi lead - prihvatite, odbijte ili ne odgovorite u roku.",
      details: `## Kako funkcionira:

Kada vam se ponudi lead u redu čekanja, imate tri moguća odgovora.

**Mogući odgovori:**

**INTERESTED (Zainteresiran):**
- Prihvaćate lead i želite kontaktirati korisnika
- Lead postaje aktivan za vas
- Možete odmah kontaktirati korisnika
- Lead se uklanja iz queue sustava

**NOT_INTERESTED (Niste zainteresirani):**
- Odbijate lead jer vam ne odgovara
- Lead se automatski vraća u red
- Ponudi se sljedećem pružatelju
- Vaša reputacija nije negativno utječena

**NO_RESPONSE (Nema odgovora):**
- Ne odgovorite u roku od 24 sata
- Lead se automatski označi kao EXPIRED
- Može se vratiti u red ili refundirati
- Vaša reputacija može biti negativno utječena

**Kako odgovoriti:**
- Kliknite na lead u queue sustavu
- Odaberite INTERESTED ili NOT_INTERESTED
- Možete dodati komentar ako želite
- Odgovor se automatski zapisuje

**Prednosti:**
- Jednostavno odgovaranje - jedan klik
- Brzo prihvaćanje ili odbijanje
- Automatsko upravljanje leadovima
- Transparentan proces

**Zašto je važno odgovoriti:**
- Brži odgovori donose bolju reputaciju
- Aktivni pružatelji dobivaju prioritet
- Leadovi se brže distribuiraju
- Bolja konverzija leadova

Odgovori providera osiguravaju jednostavno i brzo odgovaranje na leadove u queue sustavu!
`
    },
    "Queue scheduler (provjera svakih sat vremena)": {
      implemented: true,
      summary: "Automatska provjera queue sustava svakih sat vremena - distribuira nove leadove i ažurira status postojećih.",
      details: `## Kako funkcionira:

Queue scheduler automatski provjerava queue sustav svakih sat vremena kako bi distribuirao nove leadove i ažurirao status postojećih.

**Kako radi:**
- Automatski pokretanje svakih sat vremena
- Provjerava nove leadove koji čekaju distribuciju
- Distribuira leadove pružateljima prema poziciji u redu
- Ažurira status leadova koji su istekli ili trebaju ažuriranje

**Što scheduler radi:**
- Distribuira nove leadove pružateljima
- Provjerava istekle leadove (nakon 24h)
- Ažurira status EXPIRED leadova
- Preskače neaktivne pružatelje
- Refundira leadove ako je potrebno

**Prednosti:**
- Automatska distribucija - nema ručnog rada
- Efikasna distribucija leadova
- Brzo ažuriranje statusa
- Optimizirana distribucija

**Kada se koristi:**
- Kontinuirano u pozadini
- Svakih sat vremena
- Automatski bez intervencije
- Ne zahtijeva ručno pokretanje

**Za korisnike:**
- Brže dobivanje leadova
- Automatska distribucija
- Pravedna distribucija
- Efikasniji proces

Queue scheduler osigurava automatsku i efikasnu distribuciju leadova svakih sat vremena!
`
    },
    "Refund kredita (vraćanje internih kredita)": {
      implemented: true,
      summary: "Vraćanje internih kredita na vaš račun kada je potreban refund - jednostavno i brzo vraćanje kredita.",
      details: `## Kako funkcionira:

Kada je potreban refund za lead ili pretplatu, krediti se automatski vraćaju na vaš račun kao interni krediti.

**Kada se vraćaju krediti:**
- Refund ako klijent ne odgovori u roku
- Automatski refund nakon 48h neaktivnosti
- Ručno zatraživanje refund-a
- Refund za pretplate

**Kako funkcionira:**
- Krediti se automatski vraćaju na vaš račun
- Vidite refund u povijesti transakcija
- Krediti su odmah dostupni za upotrebu
- Nema čekanja na bankovni transfer

**Prednosti:**
- Brzo vraćanje kredita
- Odmah dostupni za upotrebu
- Jednostavno praćenje
- Transparentan proces

**Kada koristiti:**
- Kada dobijete refund za lead
- Kada dobijete refund za pretplatu
- Provjera povijesti refundova
- Praćenje vraćenih kredita

Refund kredita osigurava brzo i jednostavno vraćanje vaših kredita kada je potreban refund!
`
    },
    "Stripe Payment Intent refund API (PSD2 compliant)": {
      implemented: true,
      summary: "Ako ste platili lead putem Stripe kartice, refund se vraća direktno na vašu karticu prema PSD2 propisima.",
      details: `## Kako funkcionira:

Ako ste kupili lead ili pretplatu putem Stripe kartice, refund se automatski vraća direktno na vašu karticu.

**Kako funkcionira:**
- Ako ste platili Stripe karticom, refund ide na karticu
- Automatski proces refund-a
- PSD2 compliant - u skladu s europskim propisima
- Brzo vraćanje novca na karticu

**Prednosti:**
- Direktno vraćanje na karticu
- Brzo vraćanje novca
- Compliance s propisima
- Automatski proces

**Kada koristiti:**
- Kada dobijete refund za lead plaćen karticom
- Kada dobijete refund za pretplatu plaćenu karticom
- Provjera refund statusa
- Praćenje vraćenih sredstava

Stripe Payment Intent refund API osigurava sigurno i brzo vraćanje novca na vašu karticu!
`
    },
    "Automatski odabir refund metode (Stripe API ili interni krediti)": {
      implemented: true,
      summary: "Sustav automatski odabire najbolju metodu refund-a - vraćanje na karticu ako ste platili karticom, inače vraćanje kredita.",
      details: `## Kako funkcionira:

Sustav automatski odlučuje kako će vratiti refund - vraćanje na karticu ako ste platili Stripe karticom, ili vraćanje internih kredita ako ste koristili kredite.

**Kako radi:**
- Sustav provjerava kako ste platili
- Ako ste platili Stripe karticom, refund ide na karticu
- Ako ste platili kreditima, refund ide kao krediti
- Automatski odabir najbolje metode

**Prednosti:**
- Automatski proces - nema ručnog rada
- Najbolja metoda za svaki slučaj
- Brzo vraćanje sredstava
- Transparentan proces

**Kada koristiti:**
- Automatski prilikom refund-a
- Nema potrebe za ručnim odabirom
- Sustav automatski odlučuje
- Jednostavno i efikasno

Automatski odabir refund metode osigurava da uvijek dobijete refund na najbolji mogući način!
`
    },
    "Razlozi za refund (klijent ne odgovori, itd.)": {
      implemented: true,
      summary: "Različiti razlozi za refund - klijent ne odgovori, automatska neaktivnost ili ručno zatraživanje.",
      details: `## Kako funkcionira:

Postoje različiti razlozi za refund koji određuju kada i zašto ćete dobiti refund.

**Razlozi za refund:**

**Klijent ne odgovori:**
- Klijent ne odgovori na vaš kontakt u određenom roku
- Automatski refund nakon određenog vremena
- Lead se oslobađa i vraća na tržište

**Automatska neaktivnost:**
- Automatski refund nakon 48h neaktivnosti
- Ako lead ostane neaktivan preko 48h
- Lead se automatski oslobađa

**Ručno zatraživanje:**
- Vi ručno zatražite refund za lead
- Možete navesti razlog za refund
- Refund se procesuira brzo

**Prednosti:**
- Zaštita od neaktivnih leadova
- Pravedan refund sustav
- Automatsko upravljanje
- Transparentnost razloga

**Kada koristiti:**
- Automatski kada klijent ne odgovori
- Kada lead ostane neaktivan
- Kada ručno zatražite refund
- Provjera razloga za refundove

Razlozi za refund osiguravaju pravedan i transparentan proces refund-a za sve slučajeve!
`
    },
    "Povijest refund transakcija (CreditTransaction tip REFUND)": {
      implemented: true,
      summary: "Kompletan zapis svih refund transakcija - vidite sve refundove, razloge i iznose u povijesti transakcija.",
      details: `## Kako funkcionira:

Sve refund transakcije se automatski bilježe u povijesti transakcija s tipom REFUND.

**Što se bilježi:**
- Datum i vrijeme refund-a
- Iznos refund-a
- Razlog refund-a
- Način refund-a (Stripe ili krediti)
- Lead ili pretplata za koju je refund
- Status refund-a

**Kako pregledati:**
- U povijesti transakcija
- Filtrirate po tipu REFUND
- Sortirate po datumu
- Pregledate detalje svakog refund-a

**Prednosti:**
- Kompletan zapis svih refundova
- Lako praćenje refundova
- Dokumentacija za računovodstvo
- Transparentnost procesa

**Kada koristiti:**
- Praćenje refundova
- Provjera povijesti refundova
- Dokumentacija za računovodstvo
- Analiza refundova

Povijest refund transakcija osigurava kompletan zapis svih vaših refundova!
`
    },
    "Status refund-a (REFUNDED)": {
      implemented: true,
      summary: "Status REFUNDED označava da je refund uspješno procesuiran i da su sredstva vraćena.",
      details: `## Kako funkcionira:

Status REFUNDED označava da je refund uspješno procesuiran i da su sredstva vraćena na vaš račun ili karticu.

**Što znači REFUNDED:**
- Refund je uspješno procesuiran
- Sredstva su vraćena
- Lead je oslobođen
- Transakcija je završena

**Kako vidjeti status:**
- U povijesti transakcija
- Na detaljima refund transakcije
- U statusu leada
- U obavijestima

**Prednosti:**
- Jasna slika statusa refund-a
- Lako praćenje refundova
- Transparentnost procesa
- Potvrda vraćenih sredstava

**Kada koristiti:**
- Provjera statusa refund-a
- Potvrda vraćenih sredstava
- Praćenje refundova
- Dokumentacija transakcija

Status refund-a osigurava da uvijek znate status vašeg refund-a!
`
    },
    "Oslobađanje leada nakon refund-a (lead se vraća na tržište)": {
      implemented: true,
      summary: "Nakon refund-a, lead se automatski oslobađa i vraća na tržište kako bi ga drugi pružatelji mogli kupiti.",
      details: `## Kako funkcionira:

Kada dobijete refund za lead, lead se automatski oslobađa iz vašeg vlasništva i vraća na tržište kako bi ga drugi pružatelji mogli kupiti.

**Kako funkcionira:**
- Nakon refund-a, lead se automatski oslobađa
- Lead se vraća na tržište leadova
- Drugi pružatelji mogu kupiti lead
- Lead ostaje aktivan na tržištu

**Zašto je važno:**
- Lead ne propada
- Drugi pružatelji mogu koristiti lead
- Efikasnije korištenje leadova
- Veća stopa konverzije

**Kada se događa:**
- Automatski nakon refund-a
- Nakon automatskog refund-a (48h neaktivnosti)
- Nakon ručnog refund-a
- Nakon refund-a zbog neaktivnosti klijenta

**Prednosti:**
- Lead ne propada
- Drugi pružatelji mogu koristiti lead
- Efikasnije korištenje leadova
- Veća šansa za konverziju

Oslobađanje leada nakon refund-a osigurava da leadovi ne propadaju i da drugi pružatelji mogu koristiti leadove!
`
    },
    "Stripe refund ID tracking (stripeRefundId)": {
      implemented: true,
      summary: "Praćenje Stripe refund ID-a za svaki refund - lako praćenje refund transakcija i podrška.",
      details: `## Kako funkcionira:

Za svaki refund koji se procesuira preko Stripe-a, sustav automatski bilježi Stripe refund ID kako biste mogli lako pratiti refund transakciju.

**Što se bilježi:**
- Stripe refund ID za svaki refund
- Povezivanje s refund transakcijom
- Praćenje statusa refund-a u Stripe-u
- Dokumentacija refund transakcije

**Zašto je važno:**
- Lako praćenje refund transakcija
- Pomoć pri kontaktiranju podrške
- Dokumentacija refund transakcija
- Provjera statusa refund-a

**Kada koristiti:**
- Pri provjeri statusa refund-a
- Pri kontaktiranju podrške
- Pri praćenju refund transakcija
- Za dokumentaciju

**Prednosti:**
- Lako praćenje refund transakcija
- Dokumentacija refund transakcija
- Pomoć pri podršci
- Transparentnost procesa

Stripe refund ID tracking osigurava lako praćenje i dokumentaciju svih refund transakcija!
`
    },
    "Povrat novca za pretplate (refund subscription payment)": {
      implemented: true,
      summary: "Mogućnost refund-a za pretplate - vraćanje novca za pretplatu ako je potrebno.",
      details: `## Kako funkcionira:

Možete zatražiti refund za pretplatu - vraćanje novca za pretplatu ako je potrebno.

**Kada možete zatražiti refund:**
- Ako ste platili pretplatu a ne zadovoljni ste
- Ako imate problem s pretplatom
- Ako je došlo do greške
- Kontaktirajte podršku za refund

**Kako funkcionira:**
- Kontaktirate podršku za refund zahtjev
- Podrška procesuira refund zahtjev
- Novac se vraća na vašu karticu ili kao krediti
- Pretplata se otkazuje ako je potrebno

**Prednosti:**
- Mogućnost refund-a ako je potrebno
- Zaštita vaših sredstava
- Pravedan refund sustav
- Podrška vam pomaže

**Kada koristiti:**
- Ako ste nezadovoljni pretplatom
- Ako je došlo do greške
- Ako imate problem s pretplatom
- Kontaktiranje podrške za refund

Povrat novca za pretplate osigurava zaštitu vaših sredstava i pravedan refund sustav!
`
    },
    "Plaćanje leadova kroz Stripe (opcionalno, umjesto internih kredita)": {
      implemented: true,
      summary: "Umjesto korištenja internih kredita, možete direktno platiti lead karticom preko Stripe-a - fleksibilno plaćanje.",
      details: `## Kako funkcionira:

Kada kupujete lead, možete odabrati hoćete li platiti internim kreditima ili direktno karticom preko Stripe-a.

**Dvije opcije plaćanja:**

**Interni krediti:**
- Koristite kredite koje imate na računu
- Brzo i jednostavno plaćanje
- Nema potrebe za unosom kartice
- Idealno za redovite korisnike

**Stripe plaćanje karticom:**
- Plaćate direktno karticom
- Nema potrebe za kreditima
- Jednokratno plaćanje
- Idealno za povremene kupnje

**Kako odabrati:**
- Pri kupovini leada vidite obje opcije
- Odaberete interni kredit ili Stripe plaćanje
- Ako odaberete Stripe, preusmjereni ste na Stripe Checkout
- Nakon plaćanja lead je odmah vaš

**Prednosti:**
- Fleksibilnost u načinu plaćanja
- Možete odabrati što vam više odgovara
- Jednokratne kupnje bez potrebe za kreditima
- Redovite kupnje s kreditima

**Kada koristiti:**
- Jednokratne kupnje - koristite Stripe plaćanje
- Redovite kupnje - koristite interne kredite
- Ako nemate dovoljno kredita - koristite Stripe plaćanje
- Prema vašim preferencama

Plaćanje leadova kroz Stripe osigurava fleksibilnost u načinu plaćanja leadova!
`
    },
    "Fakturiranje (PDF fakture za pretplate i kupovine)": {
      implemented: true,
      summary: "Automatski generirane PDF fakture za sve vaše pretplate i kupovine - profesionalne fakture za računovodstvo.",
      details: `## Kako funkcionira:

Platforma automatski generira PDF fakture za sve vaše pretplate i kupovine leadova.

**Kada se generiraju fakture:**
- Automatski prilikom aktivacije pretplate
- Automatski prilikom kupovine leadova (ako platite karticom)
- Možete preuzeti fakturu bilo kada
- Fakture su dostupne u povijesti transakcija

**Što sadrži faktura:**
- Vaši podaci (ime, adresa, OIB)
- Podaci platforme
- Datum izdavanja fakture
- Broj fakture
- Opis usluge (pretplata ili kupovina leadova)
- Iznos (s PDV-om ako je primjenjivo)
- Način plaćanja

**Kako preuzeti fakturu:**
- U povijesti transakcija
- Kliknite na "Preuzmi fakturu" za transakciju
- PDF se preuzima na vaš računalo
- Možete spremiti ili ispisati fakturu

**Prednosti:**
- Automatsko generiranje faktura
- Profesionalne PDF fakture
- Lako preuzimanje
- Dokumentacija za računovodstvo

**Kada koristiti:**
- Za računovodstvo
- Za dokumentaciju
- Za porezne svrhe
- Za knjigovodstvo

**Zaštita:**
- Fakture se čuvaju sigurno
- Dostupne su bilo kada
- Ne mogu se izmijeniti
- Legalni dokumenti

Fakturiranje osigurava automatsko generiranje profesionalnih PDF faktura za sve vaše transakcije!
`
    },
    "Sigurnosno skladištenje Stripe secret key u AWS Secrets Manager": {
      implemented: true,
      summary: "Sigurno čuvanje vaših podataka o plaćanju - svi podaci o kartici se čuvaju sigurno u AWS Secrets Manager, ne na platformi.",
      details: `## Kako funkcionira:

Vaši podaci o plaćanju i sigurnosni ključevi se čuvaju sigurno u AWS Secrets Manager, najsigurnijem načinu čuvanja osjetljivih podataka.

**Sigurnost podataka:**
- Podaci o kartici se ne čuvaju na platformi
- Stripe obrađuje sve podatke o kartici
- Sigurnosni ključevi su u AWS Secrets Manager
- Najviši standardi sigurnosti

**Zašto je važno:**
- Zaštita vaših financijskih podataka
- Compliance s propisima o zaštiti podataka
- Najsigurniji način čuvanja podataka
- Zaštita od curenja podataka

**Prednosti:**
- Najviši standardi sigurnosti
- Zaštita vaših podataka
- Compliance s propisima
- Pouzdanost

**Za korisnike:**
- Vaši podaci su sigurni
- Nema rizika od zloupotrebe
- Najviši standardi sigurnosti
- Možete se osloniti na platformu

**Kako to funkcionira:**
- Automatski u pozadini
- Nema potrebe za ručnom intervencijom
- Kontinuirana zaštita podataka
- Najsigurniji mogući način

Sigurnosno skladištenje osigurava da su vaši financijski podaci sigurni i zaštićeni!
`
    },
    "Različiti pravni statusi (Fizička osoba, Obrt, d.o.o., j.d.o.o., itd.)": {
      implemented: true,
      summary: "Odaberite svoj pravni status pri registraciji - fizička osoba, obrt, d.o.o., j.d.o.o. ili drugi pravni oblik.",
      details: `## Kako funkcionira:

Prilikom registracije odaberete svoj pravni status - na osnovu toga će se odrediti koji podaci su potrebni i kako će se procesuirati verifikacije.

**Dostupni pravni statusi:**

**Fizička osoba:**
- Za privatne osobe koje nude usluge
- Osnovni podaci - ime, prezime, OIB
- Idealno za freelance radnike

**Obrt:**
- Za registrirane obrte
- Potrebni podaci - naziv obrta, OIB, obrtni broj
- Verifikacija u obrtnom registru

**d.o.o. (društvo s ograničenom odgovornošću):**
- Za d.o.o. tvrtke
- Potrebni podaci - naziv tvrtke, OIB, matični broj
- Verifikacija u sudskom registru

**j.d.o.o. (jednostavno društvo s ograničenom odgovornošću):**
- Za j.d.o.o. tvrtke
- Potrebni podaci - naziv tvrtke, OIB, matični broj
- Verifikacija u sudskom registru

**Ostali pravni oblici:**
- d.d. (dioničko društvo)
- Zadruga
- Udruga
- Ostali legalni oblici

**Kako odabrati:**
- Tijekom registracije odaberete pravni status
- Platforma će tražiti odgovarajuće podatke
- Različiti statusi imaju različite verifikacije
- Možete ažurirati pravni status kasnije

**Prednosti:**
- Prilagođeno vašem pravnom statusu
- Relevantne verifikacije
- Compliance s propisima
- Točan prikaz vašeg poslovnog oblika

**Zašto je važno:**
- Određuje potrebne verifikacije
- Utječe na prikaz profila
- Compliance s propisima
- Pravno točan prikaz

Različiti pravni statusi osiguravaju da vaš profil odražava vaš pravni oblik i da su sve verifikacije relevantne!
`
    },
    "SMS verifikacija telefonskog broja (Twilio)": {
      implemented: true,
      summary: "Verifikacija vašeg telefonskog broja putem SMS poruke - potvrda da telefon stvarno pripada vama.",
      details: `## Kako funkcionira:

Sustav šalje SMS poruku s verifikacijskim kodom na vaš telefon kako bi potvrdio da telefon stvarno pripada vama.

**Kako funkcionira:**
- Unesete svoj telefonski broj
- Sustav šalje SMS poruku s verifikacijskim kodom
- Unesete kod koji ste primili
- Telefon se verificira i dobivate Phone Badge

**Što dobivate:**
- Phone Identity Badge na vašem profilu
- Povećanje trust score-a
- Veće povjerenje korisnika
- Dokaz da telefon pripada vama

**Sigurnost:**
- Kod vrijedi 10 minuta
- Svaki kod se može koristiti samo jednom
- Rate limiting - maksimalno 3 SMS-a u 1 satu
- Zaštita od zloupotrebe

**Prednosti:**
- Brza verifikacija telefona
- Dokaz valjanosti telefona
- Povećanje trust score-a
- Veće povjerenje korisnika

**Kada koristiti:**
- Tijekom registracije
- Pri ažuriranju telefonskog broja
- Za dobivanje Phone Badge-a
- Za povećanje trust score-a

SMS verifikacija osigurava da vaš telefonski broj pripada vama i povećava povjerenje korisnika!
`
    },
    "DNS TXT record verifikacija domena": {
      implemented: true,
      summary: "Verifikacija vašeg web domena dodavanjem DNS TXT zapisa - dokaz da vam domen stvarno pripada.",
      details: `## Kako funkcionira:

Ako imate web stranicu, možete verificirati domen dodavanjem posebnog DNS TXT zapisa u DNS postavke vašeg domena.

**Kako funkcionira:**
- Platforma vam daje poseban TXT zapis
- Dodate TXT zapis u DNS postavke vašeg domena
- Sustav automatski provjerava DNS zapise
- Ako se zapis pronađe, dobivate DNS Badge

**Što trebate učiniti:**
- Prijavite se na DNS providera (gdje ste registrirali domen)
- Dodajte TXT zapis koji vam je dao platforma
- Pričekajte dok DNS zapis postane aktivan (obično nekoliko minuta)
- Platforma automatski verificira domen

**Što dobivate:**
- DNS Identity Badge na vašem profilu
- Povećanje trust score-a
- Dokaz da vam domen pripada
- Veće povjerenje korisnika

**Prednosti:**
- Dokaz vlasništva nad domenom
- Povećanje trust score-a
- Veće povjerenje korisnika
- Profesionalniji izgled profila

**Kada koristiti:**
- Ako imate web stranicu
- Za dobivanje DNS Badge-a
- Za povećanje trust score-a
- Za profesionalniji profil

DNS TXT record verifikacija osigurava dokaz vlasništva nad domenom i povećava povjerenje korisnika!
`
    },
    "Email verifikacija na domeni tvrtke": {
      implemented: true,
      summary: "Verifikacija email adrese na domenu vaše tvrtke - dokaz da email pripada vašoj tvrtki.",
      details: `## Kako funkcionira:

Ako imate email adresu na domenu vaše tvrtke (npr. info@vasa-tvrtka.hr), možete verificirati email i dobiti dodatnu verifikaciju.

**Kako funkcionira:**
- Dodate email adresu s domena tvrtke
- Primite verifikacijski email na tu adresu
- Potvrdite email klikom na link
- Email se verificira i dobivate dodatnu verifikaciju

**Zašto je važno:**
- Dokazuje da imate email na domenu tvrtke
- Povećava povjerenje korisnika
- Povećava trust score
- Pokazuje profesionalnost

**Prednosti:**
- Dokaz profesionalnosti
- Povećanje trust score-a
- Veće povjerenje korisnika
- Profesionalniji profil

**Kada koristiti:**
- Ako imate email na domenu tvrtke
- Za dobivanje dodatne verifikacije
- Za povećanje trust score-a
- Za profesionalniji profil

Email verifikacija na domenu tvrtke osigurava dodatnu verifikaciju i povećava profesionalnost vašeg profila!
`
    },
    "Identity Badge sustav (Email, Phone, DNS, Business značke)": {
      implemented: true,
      summary: "Sustav znački (badge-a) koji dokazuju vaše verifikacije - Email, Phone, DNS i Business značke na vašem profilu.",
      details: `## Kako funkcionira:

Identity Badge sustav dodaje značke na vaš profil koje dokazuju da ste verificirali različite aspekte svog identiteta ili tvrtke.

**Vrste znački:**

**Email Badge:**
- Dokazuje da ste verificirali email adresu
- Dodaje se nakon email verifikacije
- Pokazuje datum verifikacije

**Phone Badge:**
- Dokazuje da ste verificirali telefonski broj
- Dodaje se nakon SMS verifikacije
- Pokazuje datum verifikacije

**DNS Badge:**
- Dokazuje da ste verificirali domen
- Dodaje se nakon DNS TXT verifikacije
- Pokazuje datum verifikacije

**Business Badge:**
- Dokazuje da ste verificirali tvrtku/obrt
- Dodaje se nakon verifikacije u sudskom registru
- Pokazuje datum verifikacije

**Prikaz znački:**
- Sve značke se prikazuju na vašem javnom profilu
- Korisnici vide koje verifikacije imate
- Svaka značka pokazuje datum verifikacije
- Više znački = veće povjerenje

**Prednosti:**
- Dokaz verifikacija na vašem profilu
- Povećanje povjerenja korisnika
- Veći trust score
- Profesionalniji izgled profila

**Kako dobiti značke:**
- Verificirajte email - dobijete Email Badge
- Verificirajte telefon - dobijete Phone Badge
- Verificirajte domen - dobijete DNS Badge
- Verificirajte tvrtku - dobijete Business Badge

Identity Badge sustav osigurava da korisnici vide vaše verifikacije i imaju veće povjerenje u vas!
`
    },
    "Datum verifikacije za svaku značku": {
      implemented: true,
      summary: "Svaka značka prikazuje datum kada ste verificirali tu stavku - transparentnost i povjerenje.",
      details: `## Kako funkcionira:

Svaka Identity Badge na vašem profilu prikazuje datum kada ste verificirali tu stavku.

**Što se prikazuje:**
- Datum verifikacije za svaku značku
- Format: dan.mjesec.godina
- Jasno vidljivo na profilu
- Transparentnost verifikacija

**Zašto je važno:**
- Korisnici vide kada ste verificirali
- Transparentnost procesa verifikacije
- Povećanje povjerenja
- Dokaz aktualnosti verifikacija

**Prednosti:**
- Transparentnost verifikacija
- Povećanje povjerenja korisnika
- Dokaz aktualnosti verifikacija
- Profesionalniji izgled profila

**Kako vidjeti:**
- Na vašem javnom profilu
- Uz svaku značku
- Jasno prikazano
- Lako čitljivo

Datum verifikacije osigurava transparentnost i pokazuje korisnicima kada ste verificirali svaku stavku!
`
    },
    "Prikaz znački na profilu pružatelja": {
      implemented: true,
      summary: "Sve vaše Identity Badge značke se prikazuju na vašem javnom profilu - korisnici vide koje verifikacije imate.",
      details: `## Kako funkcionira:

Sve vaše Identity Badge značke (Email, Phone, DNS, Business) se prikazuju na vašem javnom profilu kako bi korisnici vidjeli koje verifikacije imate.

**Kako se prikazuje:**
- Sve značke su vidljive na vašem profilu
- Svaka značka ima svoju ikonu i naziv
- Prikazuje se datum verifikacije
- Elegantan i profesionalan prikaz

**Zašto je važno:**
- Korisnici vide vaše verifikacije
- Povećanje povjerenja korisnika
- Razlikuje vas od neverificiranih pružatelja
- Profesionalniji izgled profila

**Prednosti:**
- Vidljive verifikacije na profilu
- Povećanje povjerenja korisnika
- Veća vjerojatnost odabira
- Profesionalniji izgled

**Kako korisnici vide:**
- Pri pregledu vašeg profila
- U listi pružatelja
- U rezultatima pretraživanja
- Kao dokaz vaših verifikacija

Prikaz znački na profilu osigurava da korisnici vide vaše verifikacije i imaju veće povjerenje u vas!
`
    },
    "Dokumenti za verifikaciju": {
      implemented: true,
      summary: "Učitavanje dokumenata potrebnih za verifikaciju - osobne iskaznice, dokumenti o tvrtki i drugi potrebni dokumenti.",
      details: `## Kako funkcionira:

Kada je potrebno dokazati vaš identitet ili legitimnost tvrtke, možete učitati relevantne dokumente za verifikaciju.

**Vrste dokumenata:**

**Za fizičke osobe:**
- Osobna iskaznica
- Putovnica
- OIB potvrda
- Ostali dokumenati po potrebi

**Za pravne osobe:**
- Dokumenti o tvrtki (sudski registar)
- OIB potvrda
- Dokumenti o obrtu (obrtni registar)
- Ostali dokumenati po potrebi

**Kako učitati:**
- Odaberete dokument koji želite učitati
- Uploadajte sliku ili PDF dokumenta
- Provjerite da je dokument čitljiv i valjan
- Dokument se šalje administratorima na verifikaciju

**Sigurnost:**
- Dokumenti se šalju sigurno
- Pristup samo administratorima za verifikaciju
- Zaštićeno spremanje dokumenata
- Pojedinačna kontrola pristupa

**Prednosti:**
- Dokaz legitimnosti identiteta ili tvrtke
- Brža verifikacija
- Povećanje trust score-a
- Povećanje povjerenja korisnika

**Kada koristiti:**
- Prilikom verifikacije OIB-a
- Prilikom verifikacije tvrtke
- Prilikom potrebe za dodatnom verifikacijom
- Prilikom dokazivanja legitimnosti

Dokumenti za verifikaciju osiguravaju bržu i sigurniju verifikaciju vašeg identiteta ili tvrtke!
`
    },
    "Email Identity Badge (značka)": {
      implemented: true,
      summary: "Dobijte Email Identity Badge nakon što verificirate svoju email adresu - pokazuje korisnicima da ste verifikirani.",
      details: `## Kako funkcionira:

Email Identity Badge je značka koja se prikazuje na vašem profilu nakon što verificirate svoju email adresu.

**Kako dobiti:**
- Verificirajte svoju email adresu kroz email verifikacijski proces
- Kliknite na link u emailu koji primite
- Nakon potvrde, dobivate Email Identity Badge
- Značka se automatski prikazuje na vašem profilu

**Što znači:**
- Vaša email adresa je verificirana
- Korisnici vide da ste pouzdani
- Povećava povjerenje korisnika
- Razlikuje vas od neverificiranih pružatelja

**Prikaz:**
- Email Badge se prikazuje na vašem javnom profilu
- Vidljiv svim korisnicima koji pregledavaju vaš profil
- Prikazuje se s datumom verifikacije
- Elegantan i profesionalan izgled

**Prednosti:**
- Povećanje povjerenja korisnika
- Profesionalniji izgled profila
- Veća vjerojatnost odabira od strane korisnika
- Dokaz verifikacije emaila

Email Identity Badge je prva značka koju možete dobiti i osnovna za profesionalni profil!
`
    },
    "Phone Identity Badge (SMS verifikacija)": {
      implemented: true,
      summary: "Dobijte Phone Identity Badge nakon što verificirate svoj telefon putem SMS verifikacije.",
      details: `## Kako funkcionira:

Phone Identity Badge je značka koja se prikazuje na vašem profilu nakon što verificirate svoj telefonski broj putem SMS verifikacije.

**Kako dobiti:**
- Unesite svoj telefonski broj u formatu +385XXXXXXXXX
- Kliknite "Pošalji SMS kod" - primit ćete SMS s verifikacijskim kodom
- Unesite kod koji ste primili
- Nakon potvrde, dobivate Phone Identity Badge
- Značka se automatski prikazuje na vašem profilu

**Zašto je važno:**
- Verificirani telefon dokazuje da ste stvarni pružatelj
- Povećava povjerenje korisnika
- Omogućava kontaktiranje preko verificiranog broja
- Pokazuje profesionalnost i ozbiljnost

**Prikaz:**
- Phone Badge se prikazuje na vašem javnom profilu
- Vidljiv svim korisnicima
- Prikazuje se s datumom verifikacije
- Pokazuje da je vaš telefon verificiran

**Prednosti:**
- Povećanje povjerenja korisnika
- Dokaz verifikacije telefona
- Profesionalniji izgled profila
- Veća vjerojatnost odabira

**Sigurnost:**
- Kod vrijedi 10 minuta
- Maksimalno 5 pokušaja unosa koda
- Rate limiting - možete zatražiti novi SMS nakon 60 sekundi
- Jedinstven kod za svaku verifikaciju

Phone Identity Badge dokazuje da vaš telefon stvarno pripada vama i povećava povjerenje korisnika!
`
    },
    "DNS Identity Badge (TXT record)": {
      implemented: true,
      summary: "Dobijte DNS Identity Badge nakon što verificirate svoj domen putem DNS TXT record verifikacije.",
      details: `## Kako funkcionira:

DNS Identity Badge je značka koja se prikazuje na vašem profilu nakon što verificirate svoj domen putem DNS TXT record verifikacije.

**Kako dobiti:**
- Imate vlastiti domen (npr. vasa-tvrtka.hr)
- Dodajte TXT record u DNS postavkama vašeg domena
- Unesite specifičan kod koji vam platforma daje
- Platforma automatski provjerava DNS record
- Nakon potvrde, dobivate DNS Identity Badge

**Što znači:**
- Vi stvarno vladate tim domenom
- Vaša tvrtka ima vlastiti domen
- Profesionalniji i pouzdaniji dojam
- Veće povjerenje korisnika

**Kako verificirati:**
- Odaberite opciju za DNS verifikaciju
- Dobijete kod koji trebate dodati u DNS
- Dodajte TXT record u DNS postavke vašeg domena
- Platforma automatski provjerava (može potrajati nekoliko minuta)
- Nakon uspješne verifikacije dobivate Badge

**Prikaz:**
- DNS Badge se prikazuje na vašem javnom profilu
- Vidljiv svim korisnicima
- Prikazuje se s datumom verifikacije
- Pokazuje profesionalnost vaše tvrtke

**Prednosti:**
- Dokaz vlastništva nad domenom
- Profesionalniji izgled profila
- Povećanje povjerenja korisnika
- Razlikuje vas od manjih pružatelja

**Kada koristiti:**
- Ako imate vlastiti domen
- Ako želite dokazati profesionalnost
- Ako želite povećati povjerenje korisnika
- Kao dio potpunog Identity Badge seta

DNS Identity Badge dokazuje da imate vlastiti profesionalni domen i povećava kredibilitet vaše tvrtke!
`
    },
    "Business Badge (tvrtka/obrt verifikacija)": {
      implemented: true,
      summary: "Dobijte Business Badge nakon što verificirate svoju tvrtku ili obrt preko Sudskog registra ili Obrtnog registra.",
      details: `## Kako funkcionira:

Business Badge je značka koja se prikazuje na vašem profilu nakon što verificirate svoju tvrtku ili obrt preko službenih registara.

**Kako dobiti:**
- Unesite podatke o svojoj tvrtki ili obrtu
- Platforma automatski provjerava podatke u Sudskom registru ili Obrtnom registru
- Ako se podaci podudaraju, dobivate Business Badge
- Značka se automatski prikazuje na vašem profilu

**Što se provjerava:**
- Naziv tvrtke/obrta
- OIB (Osobni identifikacijski broj)
- Porezni broj
- Pravni status (d.o.o., j.d.o.o., obrt, itd.)
- Datum osnivanja

**Što znači:**
- Vaša tvrtka je službeno registrirana
- Podaci su verificirani preko službenih izvora
- Veće povjerenje korisnika
- Profesionalniji i pouzdaniji dojam

**Prikaz:**
- Business Badge se prikazuje na vašem javnom profilu
- Vidljiv svim korisnicima
- Prikazuje se s datumom verifikacije
- Pokazuje legitimnost vaše tvrtke

**Prednosti:**
- Dokaz službene registracije
- Povećanje povjerenja korisnika
- Profesionalniji izgled profila
- Razlikuje vas od neverificiranih tvrtki

**Za različite pravne statuse:**
- **Fizička osoba** - verificiranje putem OIB-a
- **Obrt** - verificiranje u Obrtnom registru
- **d.o.o./j.d.o.o.** - verificiranje u Sudskom registru
- **Druge pravne forme** - verificiranje prema relevantnom registru

**Kada koristiti:**
- Ako imate registriranu tvrtku ili obrt
- Ako želite dokazati legitimnost
- Ako želite povećati povjerenje korisnika
- Kao dio kompletnog Identity Badge seta

Business Badge dokazuje legitimnost vaše tvrtke i značajno povećava povjerenje korisnika u vas!
`
    },
    "Prikaz datuma verifikacije": {
      implemented: true,
      summary: "Svaka značka prikazuje datum kada ste je verificirali - transparentnost i povjerenje za korisnike.",
      details: `## Kako funkcionira:

Pored svake Identity Badge značke na vašem profilu, prikazuje se datum kada ste verificirali tu stavku. To osigurava transparentnost i pokazuje korisnicima kada ste obavili verifikacije.

**Što se prikazuje:**
- Datum verifikacije za svaku značku
- Format: dan.mjesec.godina (npr. 15.03.2024)
- Jasno vidljivo pored svake značke
- Transparentnost procesa verifikacije

**Zašto je važno:**
- Korisnici vide kada ste verificirali
- Pokazuje aktualnost verifikacija
- Povećava povjerenje jer vidite da su verifikacije nedavne
- Transparentnost procesa

**Prednosti:**
- Transparentnost verifikacija
- Povećanje povjerenja korisnika
- Dokaz aktualnosti verifikacija
- Profesionalniji izgled profila

**Kako korisnici vide:**
- Na vašem javnom profilu
- Pored svake značke
- Jasno prikazano
- Lako čitljivo

**Kada primjećujete:**
- Pored Email Badge - datum email verifikacije
- Pored Phone Badge - datum SMS verifikacije
- Pored DNS Badge - datum DNS verifikacije
- Pored Business Badge - datum verifikacije tvrtke

**Kada je korisno:**
- Korisnici vide da su verifikacije nedavne
- Pokazuje da aktualizirate svoj profil
- Povećava povjerenje jer su verifikacije svježe
- Dokaz profesionalnosti

Prikaz datuma verifikacije osigurava transparentnost i pokazuje korisnicima kada ste obavili verifikacije!
`
    },
    "Status verifikacije na profilu": {
      implemented: true,
      summary: "Na vašem profilu se prikazuje opći status verifikacije - pokazuje koliko ste znački verificirali.",
      details: `## Kako funkcionira:

Na vašem profilu se prikazuje opći status verifikacije koji pokazuje koliko ste Identity Badge znački verificirali i vašu opću razinu verifikacije.

**Što se prikazuje:**
- Broj verificiranih znački (npr. "3/4 verificirano")
- Procentualni status verifikacije
- Koje značke ste verificirali
- Koje značke još možete verificirati

**Razine verifikacije:**
- **0-1 značka** - Osnovna verifikacija
- **2-3 značke** - Srednja verifikacija
- **4 značke** - Potpuna verifikacija (sve značke)

**Zašto je važno:**
- Korisnici vide vašu razinu verifikacije
- Više verificiranih znački = veće povjerenje
- Pokazuje profesionalnost i ozbiljnost
- Razlikuje vas od manje verificiranih pružatelja

**Prednosti:**
- Jasna slika vašeg verifikacijskog statusa
- Povećanje povjerenja korisnika
- Motivacija za potpunu verifikaciju
- Profesionalniji izgled profila

**Kako korisnici vide:**
- Na vašem javnom profilu
- U listi pružatelja
- U rezultatima pretraživanja
- Jasno prikazano

**Kada primjećujete:**
- Pri pregledu vašeg profila
- U postavkama profila
- U Identity Badge sekciji
- Kroz cijelo korisničko iskustvo

**Kako poboljšati status:**
- Verificirajte Email - dobijete Email Badge
- Verificirajte Phone - dobijete Phone Badge
- Verificirajte DNS - dobijete DNS Badge
- Verificirajte Business - dobijete Business Badge

Status verifikacije na profilu daje korisnicima jasnu sliku vašeg verifikacijskog statusa i povjerenja!
`
    },
    "Identity Badge Verifikacija komponenta": {
      implemented: true,
      summary: "Jednostavna komponenta za verifikaciju svih vaših Identity Badge znački - sve na jednom mjestu.",
      details: `## Kako funkcionira:

Identity Badge Verifikacija komponenta je centralizirano mjesto gdje možete verificirati sve svoje Identity Badge značke - Email, Phone, DNS i Business.

**Što možete raditi:**
- Verificirati Email adresu
- Verificirati telefonski broj (SMS)
- Verificirati domen (DNS TXT record)
- Verificirati tvrtku/obrt (Business)
- Pregledati status svih verifikacija
- Vidjeti koje značke ste dobili

**Kako koristiti:**
- Otvorite sekciju Identity Badge Verifikacija
- Odaberite značku koju želite verificirati
- Slijedite korake za verifikaciju
- Nakon uspješne verifikacije, značka se dodaje na vaš profil

**Prikaz statusa:**
- Vidite koje značke ste verificirali
- Vidite koje značke još možete verificirati
- Prikazuje se datum verifikacije za svaku značku
- Jasna vizualizacija vašeg napretka

**Prednosti:**
- Sve verifikacije na jednom mjestu
- Jednostavno upravljanje verifikacijama
- Jasna slika vašeg statusa
- Lako praćenje napretka

**Kada koristiti:**
- Pri prvom postavljanju profila
- Kada želite verificirati dodatne značke
- Kada želite provjeriti status verifikacija
- Kada želite poboljšati svoj profil

**Zašto je korisno:**
- Centralizirano mjesto za sve verifikacije
- Jednostavno upravljanje
- Jasna slika vašeg napretka
- Lako praćenje statusa

Identity Badge Verifikacija komponenta osigurava jednostavno i centralizirano upravljanje svim vašim verifikacijama!
`
    },
    "Stripe Payment Intent refund API (PSD2)": {
      implemented: true,
      summary: "Ako ste platili lead putem Stripe kartice, refund se vraća direktno na vašu karticu u skladu s PSD2 propisima.",
      details: `## Kako funkcionira:

Ako ste kupili lead ili pretplatu direktno karticom preko Stripe-a, refund se automatski vraća na vašu karticu prema PSD2 (Payment Services Directive 2) propisima.

**Kako funkcionira:**
- Ako ste platili Stripe karticom, refund ide direktno na vašu karticu
- Automatski proces refund-a bez ručnog rada
- PSD2 compliant - u potpunoj skladu s europskim propisima o plaćanjima
- Brzo vraćanje sredstava na vašu karticu (obično 5-10 radnih dana)

**PSD2 propisi:**
- Propisi Europske unije o plaćanjima
- Osiguravaju zaštitu korisnika
- Transparentnost refund procesa
- Sigurnost plaćanja

**Prednosti:**
- Direktno vraćanje na karticu - nema posrednika
- Brzo vraćanje sredstava
- Compliance s propisima - sve je legalno i sigurno
- Automatski proces - nema ručnog rada

**Kada koristiti:**
- Kada dobijete refund za lead koji ste platili karticom
- Kada dobijete refund za pretplatu plaćenu karticom
- Automatski se koristi ako ste platili karticom
- Nema potrebe za ručnim odabirom

**Razlike od internih kredita:**
- Stripe refund vraća novac na karticu
- Interni krediti se vraćaju kao krediti na platformi
- Sustav automatski odabire najbolju metodu
- Ovisi o tome kako ste platili

Stripe Payment Intent refund API osigurava sigurno i brzo vraćanje novca na vašu karticu u skladu s PSD2 propisima!
`
    },
    "Automatski odabir refund metode ovisno o načinu plaćanja": {
      implemented: true,
      summary: "Sustav automatski odabire najbolju metodu refund-a - vraćanje na karticu ako ste platili karticom, inače vraćanje kredita.",
      details: `## Kako funkcionira:

Sustav automatski odlučuje kako će vratiti refund na temelju načina na koji ste platili - nema potrebe za ručnim odabirom metode.

**Kako radi:**
- Sustav provjerava kako ste platili (Stripe kartica ili interni krediti)
- Ako ste platili Stripe karticom, refund ide direktno na karticu
- Ako ste platili kreditima, refund se vraća kao krediti na vaš račun
- Automatski odabir najbolje metode za svaki slučaj

**Dvije metode refund-a:**

**Stripe refund (na karticu):**
- Ako ste platili direktno karticom preko Stripe-a
- Refund se vraća direktno na vašu karticu
- U skladu s PSD2 propisima
- Brzo vraćanje sredstava

**Interni krediti:**
- Ako ste platili internim kreditima
- Krediti se vraćaju na vaš račun
- Odmah dostupni za upotrebu
- Nema čekanja na bankovni transfer

**Prednosti:**
- Automatski proces - nema potrebe za ručnim odabirom
- Najbolja metoda za svaki slučaj
- Brzo vraćanje sredstava
- Transparentan i pravedan proces

**Kada se koristi:**
- Automatski prilikom refund-a
- Bez vašeg uplitanja
- Sustav sam odlučuje
- Jednostavno i efikasno

**Zašto je korisno:**
- Ne morate razmišljati o tome kako će se refund vratiti
- Sustav automatski odlučuje najbolju metodu
- Brzo i jednostavno
- Pravedno za sve korisnike

Automatski odabir refund metode osigurava da uvijek dobijete refund na najbolji mogući način bez dodatnih briga!
`
    },
    "Lokalizacija (hrvatski jezik)": {
      implemented: true,
      summary: "Cijela platforma je dostupna na hrvatskom jeziku - sve funkcije, opisi i sučelje su na hrvatskom.",
      details: `## Kako funkcionira:

Platforma je potpuno lokalizirana na hrvatski jezik - sve funkcije, opisi, poruke i korisničko sučelje su na hrvatskom jeziku.

**Što je lokalizirano:**
- Svi tekstovi na platformi
- Nazivi funkcija i gumbi
- Poruke i notifikacije
- Opisi kategorija i funkcija
- Forme i upute
- Povratne poruke o greškama

**Kako koristiti:**
- Automatski je postavljeno na hrvatski jezik
- Sve je već prevedeno i dostupno
- Nema potrebe za promjenom jezika
- Jednostavno i intuitivno

**Prednosti:**
- Lako razumijevanje svih funkcija
- Nema jezičnih barijera
- Prirodno korisničko iskustvo za hrvatske korisnike
- Profesionalan dojam platforme

**Kada primjećujete:**
- Pri svakom korištenju platforme
- U svim sekcijama i funkcijama
- U svim porukama i obavijestima
- U svim opisima i uputama

**Za različite korisnike:**
- Korisnici usluge - sve na hrvatskom
- Pružatelji usluga - sve na hrvatskom
- Administratori - sve na hrvatskom
- Jedinstveno iskustvo za sve

**Detalji lokalizacije:**
- Svi tekstovi su prirodno prevedeni
- Kontekstualno relevantni prijevodi
- Profesionalni i razumljivi tekstovi
- Održavanje hrvatskog jezika kroz cijelu platformu

Lokalizacija na hrvatski jezik osigurava da svi korisnici mogu koristiti platformu na prirodan i razumljiv način!
`
    },
    "Auto-verifikacija naziva tvrtke (Sudski registar, Obrtni registar)": {
      implemented: true,
      summary: "Platforma automatski provjerava naziv vaše tvrtke ili obrta u službenim registrima - potvrđuje legitimnost vaše tvrtke.",
      details: `## Kako funkcionira:

Kada unesete podatke o svojoj tvrtki ili obrtu, platforma automatski provjerava naziv u službenim registrima - Sudskom registru za d.o.o./j.d.o.o. ili Obrtnom registru za obrte.

**Kako funkcionira:**
- Unesete naziv vaše tvrtke ili obrta
- Unesete OIB vaše tvrtke
- Platforma automatski provjerava u službenim registrima
- Ako se podaci podudaraju, tvrtka je verificirana
- Ako se ne podudaraju, dobivate upozorenje

**Provjera u registrima:**
- **Sudski registar** - za d.o.o., j.d.o.o. i druge pravne forme
- **Obrtni registar** - za obrte
- Automatska provjera u realnom vremenu
- Provjerava se naziv, OIB i pravni status

**Što se provjerava:**
- Naziv tvrtke/obrta - odgovara li službenom nazivu
- OIB - odgovara li OIB-u u registru
- Pravni status - odgovara li status (d.o.o., obrt, itd.)
- Datum osnivanja - provjerava se konzistentnost podataka

**Zašto je važno:**
- Dokazuje legitimnost vaše tvrtke
- Sprječava lažne podatke
- Povećava povjerenje korisnika
- Potvrđuje da je tvrtka službeno registrirana

**Rezultati verifikacije:**
- **Uspješna verifikacija** - podaci se podudaraju, tvrtka je verificirana
- **Neuspješna verifikacija** - podaci se ne podudaraju, možete provjeriti i ispraviti podatke
- Upozorenje ako podaci nisu točni

**Prednosti:**
- Automatska provjera - nema ručnog rada
- Brza verifikacija u realnom vremenu
- Dokaz legitimnosti tvrtke
- Povećanje povjerenja korisnika

**Kada koristiti:**
- Prilikom registracije kao pružatelj usluga
- Prilikom ažuriranja podataka o tvrtki
- Kada želite verificirati legitimnost tvrtke
- Kao dio Identity Badge verifikacije

**Za različite pravne forme:**
- **Fizička osoba** - verifikacija putem OIB-a
- **Obrt** - verifikacija u Obrtnom registru
- **d.o.o./j.d.o.o.** - verifikacija u Sudskom registru
- **Druge pravne forme** - verifikacija prema relevantnom registru

Auto-verifikacija naziva tvrtke osigurava da samo legitimne i službeno registrirane tvrtke koriste platformu!
`
    }
  };

async function seedDocumentation() {
  console.log('🌱 Počinje seed dokumentacije...');

  // Provjeri da li tablice postoje
  try {
    await prisma.$queryRaw`SELECT 1 FROM "DocumentationCategory" LIMIT 1`;
    await prisma.$queryRaw`SELECT 1 FROM "DocumentationFeature" LIMIT 1`;
    console.log('✅ Tablice DocumentationCategory i DocumentationFeature postoje');
  } catch (error) {
    console.error('❌ Tablice ne postoje! Prvo primijeni migraciju:');
    console.error('   npx prisma migrate dev --name add_documentation_models');
    throw new Error('Tablice ne postoje - primijeni migraciju prvo');
  }

  let categoriesCreated = 0;
  let categoriesUpdated = 0;
  let featuresCreated = 0;
  let featuresUpdated = 0;
  let totalFeatures = 0;
  let implementedFeatures = 0;

  try {
    for (let catIndex = 0; catIndex < features.length; catIndex++) {
      const categoryData = features[catIndex];
      
      const category = await prisma.documentationCategory.upsert({
        where: { name: categoryData.category },
        update: { order: catIndex, isActive: true },
        create: { name: categoryData.category, order: catIndex, isActive: true }
      });

      const wasJustCreated = category.createdAt.getTime() === category.updatedAt.getTime();
      if (wasJustCreated) categoriesCreated++; else categoriesUpdated++;

      console.log(`✅ Kategorija: ${categoryData.category}`);

      if (categoryData.items && Array.isArray(categoryData.items)) {
        for (let itemIndex = 0; itemIndex < categoryData.items.length; itemIndex++) {
          const item = categoryData.items[itemIndex];
          const description = featureDescriptions[item.name];

          const featureData = {
            categoryId: category.id,
            name: item.name,
            implemented: item.implemented !== undefined ? item.implemented : true,
            deprecated: item.deprecated || false,
            isAdminOnly: item.isAdminOnly || false, // Admin-only flag
            order: itemIndex,
            summary: description?.summary || null,
            details: description?.details || null,
            technicalDetails: description?.technicalDetails || null // Tehnički opis (samo admin)
          };

          const existing = await prisma.documentationFeature.findFirst({
            where: { categoryId: category.id, name: item.name }
          });

          if (existing) {
            await prisma.documentationFeature.update({
              where: { id: existing.id },
              data: featureData
            });
            featuresUpdated++;
          } else {
            await prisma.documentationFeature.create({ data: featureData });
            featuresCreated++;
          }
          
          totalFeatures++;
          if (item.implemented) implementedFeatures++;
        }
      }
    }

    // === ADMIN-ONLY FUNKCIONALNOSTI ===
    console.log('');
    console.log('🔐 Seeding admin-only funkcionalnosti...');
    
    const adminFeatures = [
      {
        category: "Upravljanje Korisnicima i Pružateljima",
        items: [
          { name: "Upravljanje korisnicima", implemented: true, isAdminOnly: true },
          { name: "Upravljanje pružateljima", implemented: true, isAdminOnly: true },
          { name: "Upravljanje kategorijama", implemented: true, isAdminOnly: true },
          { name: "Upravljanje pravnim statusima", implemented: true, isAdminOnly: true }
        ]
      },
      {
        category: "Upravljanje Sadržajem",
        items: [
          { name: "Upravljanje poslovima", implemented: true, isAdminOnly: true },
          { name: "Upravljanje ponudama", implemented: true, isAdminOnly: true },
          { name: "Admin upravljanje recenzijama", implemented: true, isAdminOnly: true },
          { name: "Upravljanje notifikacijama", implemented: true, isAdminOnly: true },
          { name: "Upravljanje chat sobama", implemented: true, isAdminOnly: true },
          { name: "Moderacija sadržaja", implemented: true, isAdminOnly: true }
        ]
      },
      {
        category: "Upravljanje Pretplatama i Transakcijama",
        items: [
          { name: "Upravljanje pretplatama", implemented: true, isAdminOnly: true },
          { name: "Upravljanje transakcijama kredita", implemented: true, isAdminOnly: true },
          { name: "Admin odobravanje refund-a", implemented: true, isAdminOnly: true },
          { name: "Admin upravljanje queue sustavom", implemented: true, isAdminOnly: true },
          { name: "Upravljanje ROI statistikama", implemented: true, isAdminOnly: true }
        ]
      },
      {
        category: "Verifikacije i Licence",
        items: [
          { name: "Upravljanje licencama", implemented: true, isAdminOnly: true },
          { name: "Verificiranje licenci od strane admina", implemented: true, isAdminOnly: true },
          { name: "Upravljanje verifikacijama klijenata", implemented: true, isAdminOnly: true },
          { name: "Dokumenti za verifikaciju", implemented: true, isAdminOnly: true },
          { name: "Admin reset SMS pokušaja", implemented: true, isAdminOnly: true }
        ]
      },
      {
        category: "Statistike i Analitika",
        items: [
          { name: "Statistike platforme", implemented: true, isAdminOnly: true },
          { name: "Grafički prikaz statistika", implemented: true, isAdminOnly: true },
          { name: "KYC Metrike", implemented: true, isAdminOnly: true },
          { name: "Provider Approvals", implemented: true, isAdminOnly: true }
        ]
      }
    ];

    const adminFeatureDescriptions = {
      "Upravljanje korisnicima": {
        summary: "Admin panel za upravljanje svim korisnicima platforme",
        details: `## Implementirano:

### 1. **Admin panel za korisnike**
   - Pregled svih korisnika platforme s filtriranjem i pretraživanjem
   - Detalji korisnika: email, telefon, status, verifikacije, pravni status
   - Historija aktivnosti i transakcija
   
### 2. **Upravljanje statusima**
   - Aktivacija/deaktivacija korisničkih računa
   - Promjena uloga korisnika (USER, PROVIDER, ADMIN)
   - Reset lozinke od strane admina bez poznavanja stare lozinke
   - Blokiranje/odblokiranje korisnika
   
### 3. **Verifikacije**
   - Pregled statusa svih verifikacija (email, telefon, ID, company)
   - Ručna verifikacija korisnika od strane admina
   - Reset pokušaja verifikacije (npr. SMS pokušaji)
   - Pregled dokumenta za verifikaciju
   
### 4. **Statistike korisnika**
         - Broj kreiranih poslova po korisniku
         - Broj aktivnih pretplata
         - Kreditna bilanca i transakcije
         - Trust score i reputacija
         - Aktivnost na platformi
      `,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminUsers.jsx\`
- **Route:** \`/admin/users\`
- **Biblioteke:** React, React Router, Axios
- **State management:** useState, useEffect hooks
- **Filtriranje:** Pretraživanje po email, ime, status
- **Tablice:** Sortiranje, paginacija, eksport podataka

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\` - zahtjeva admin ulogu
- **Prisma:** Query za User model s relacijama
- **Validacija:** Joi ili express-validator za input validaciju

### Baza podataka:
- **Tablice:** \`User\`, \`ProviderProfile\`, \`ClientVerification\`, \`CreditTransaction\`
- **Relacije:** User → ProviderProfile, User → ClientVerification
- **Indeksi:** \`@@index([email, role])\`, \`@@index([role])\`
- **Query optimizacija:** \`include\` za eager loading relacija

### API pozivi:
- \`GET /api/admin/users\` - Query params: \`page\`, \`limit\`, \`search\`, \`role\`
- \`GET /api/admin/users/:id\` - Vraća korisnika s relacijama
- \`PUT /api/admin/users/:id\` - Body: \`{ fullName, email, role, isVerified }\`
- \`POST /api/admin/users/:id/reset-password\` - Generira novi reset token
      `
        },
      "Upravljanje pružateljima": {
        summary: "Kompletan admin panel za upravljanje pružateljima usluga",
        details: `## Implementirano:

### 1. **Admin panel za pružatelje**
   - Pregled svih pružatelja usluga s naprednim filtriranjem
   - Detalji profila: naziv, opis, kategorije, lokacije
   - Pregled licenci i certifikata
   - Status verifikacije i odobrenja
   
### 2. **Odobravanje pružatelja**
   - Approval status management (WAITING_FOR_APPROVAL, APPROVED, REJECTED)
   - Aktivacija/deaktivacija profila pružatelja
   - Featured profil postavke (istaknuti pružatelji)
   - Pregled i odobravanje novih registracija
   
### 3. **ROI statistike**
   - Pregled ROI metrika za svakog pružatelja
   - Conversion rate, revenue, profit po pružatelju
   - Benchmarking s drugim pružateljima u istoj kategoriji
   - Godišnji izvještaji i trend analiza
   
### 4. **Upravljanje licencama**
   - Verificiranje upload-anih licenci
   - Praćenje isteka licenci s automatskim notifikacijama
   - Pregled statusa svih licenci u sustavu
   - Notifikacije o isteku licenci

### 5. **KYC verifikacija**
   - Pregled KYC dokumenta (Rješenja Porezne uprave, itd.)
   - Verificiranje OIB-a i podataka
   - OCR provjera dokumenta
   - Provjera u Obrtnom registru i komorskim imenicima
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminProviders.jsx\`
- **Route:** \`/admin/providers\`
- **State management:** useState, useEffect hooks
- **Filtriranje:** Pretraživanje po imenu, kategoriji, statusu odobrenja

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za ProviderProfile model s relacijama

### Baza podataka:
- **Tablice:** \`ProviderProfile\`, \`User\`, \`ProviderLicense\`, \`ProviderROI\`
- **Relacije:** ProviderProfile → User, ProviderProfile → ProviderLicense
- **Indeksi:** \`@@index([userId])\`, \`@@index([approvalStatus])\`

### API pozivi:
- \`GET /api/admin/providers\` - Query params: \`search\`, \`categoryId\`, \`approvalStatus\`
- \`PUT /api/admin/providers/:id/approval\` - Body: \`{ approvalStatus: 'APPROVED' | 'REJECTED', notes?: string }\`
- \`GET /api/admin/providers/:id/roi\` - Vraća ROI statistike za pružatelja
      `
      },
      "Statistike platforme": {
        summary: "Sveobuhvatne statistike i analitika za cijelu platformu",
        details: `## Implementirano:

### 1. **Općenite statistike**
   - Ukupni korisnici (korisnici i pružatelji) s breakdown po ulogama
   - Ukupni poslovi i leadovi s trendovima
   - Aktivne pretplate po planovima
   - Ukupan prihod platforme (MRR, ARR)
   - Prosječna vrijednost transakcije
   
### 2. **Mesečne statistike**
   - Trendovi kroz mjesece (korisnici, prihod, aktivnost)
   - Novi korisnici po mjesecima s breakdown po ulogama
   - Prihod po mjesecima s forecast-om
   - Konverzije i ROI po mjesecima
   - Churn rate i retention metrike
   
### 3. **Statistike po kategorijama**
   - Najpopularnije kategorije usluga
   - Prihod po kategorijama
   - Konverzije po kategorijama
   - Prosječne cijene po kategorijama
   - Kategorije s najboljim ROI-om
   
### 4. **Engagement metrike**
   - Aktivni korisnici (DAU, WAU, MAU)
   - Broj recenzija i prosječne ocjene
   - Chat aktivnost i poruka po razgovoru
   - Notifikacije poslane i otvorene
   - Conversion funnel analiza
   
### 5. **Dashboard komponente**
   - Grafički prikazi (Chart.js integracija)
   - Trend linije za vremenske serije
   - Stupčasti grafovi za usporedbe
   - Krugovni grafovi za breakdown
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminPlatformStats.jsx\`
- **Route:** \`/admin/stats\`
- **Biblioteke:** Chart.js, react-chartjs-2
- **State management:** useState, useEffect hooks

### Backend:
- **Servis:** \`uslugar/backend/src/services/platform-stats-service.js\`
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Endpoint:** \`GET /api/admin/platform-stats\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Cache:** 5 minuta cache za performanse

### Baza podataka:
- **Tablice:** \`User\`, \`Job\`, \`Subscription\`, \`CreditTransaction\`, \`LeadPurchase\`
- **Agregacije:** COUNT, SUM, AVG queries
- **Query optimizacija:** Indexi na ključnim poljima

### API pozivi:
- \`GET /api/admin/platform-stats\` - Vraća sve statistike platforme
- \`GET /api/admin/platform-stats?type=monthly\` - Mesečne statistike
- \`GET /api/admin/platform-stats?type=category\` - Statistike po kategorijama
      `
      },
      "Grafički prikaz statistika": {
        summary: "Interaktivni grafički prikaz svih statistika platforme",
        details: `## Implementirano:

### 1. **Instalirane biblioteke**
   - \`chart.js\` - Glavna biblioteka za grafove
   - \`react-chartjs-2\` - React wrapper za Chart.js
   - Podrška za sve tipove grafova (Line, Bar, Doughnut, Pie)

### 2. **Grafičke komponente u ROI dashboardu**
   
   **Status Breakdown - Doughnut Chart:**
   - Vizualni prikaz statusa leadova (Konvertirani, Kontaktirani, Aktivni, Refundirani)
   - Krugovni graf s bojama za svaki status
   - Interaktivni tooltips s detaljnim informacijama
   
   **Monthly Revenue & ROI - Line Chart:**
   - Prikaz prihoda i ROI-a kroz mjesece
   - Dvostruki Y-os (lijevo: EUR, desno: %)
   - Kombinirani trend prihoda i ROI-a
   - Predikcija za sljedeće mjesece
   
   **Monthly Leads - Bar Chart:**
   - Grupirani stupčasti graf
   - Kupljeno, Kontaktirano, Konvertirano po mjesecima
   - Boje za razlikovanje metrika
   - Stacked bars za ukupne vrijednosti
   
   **Conversion Rate - Line Chart:**
   - Trend stope konverzije kroz godinu
   - Linijski graf s ispunom
   - Benchmark linije (prosjek, cilj)
   
   **Category Revenue - Bar Chart:**
   - Prihod po kategorijama
   - Top 8 kategorija po prihodu
   - Boje za svaku kategoriju
   - Sortiranje po prihodu ili imenu

### 3. **Funkcionalnosti**
   - Godišnji seletor: pregled trenutne, prošle ili prethodne godine
   - Dark mode: grafovi prilagođeni dark modu s automatskom detekcijom
   - Responzivni dizajn: prilagođeno različitim veličinama ekrana
   - Interaktivni tooltips: detalji pri hoveru (vrijednosti, postoci, trendi)
   - Tematske boje: konzistentne boje kroz grafove
   - Export grafova: download kao PNG/JPEG

### 4. **API integracija**
   - Dodan \`getYearlyReport()\` u \`exclusive.js\`
   - Automatsko učitavanje godišnjeg izvještaja pri učitavanju stranice
   - Dinamičko ažuriranje grafova pri promjeni godine
   - Loading states za svaki graf

### 5. **Dizajn**
   - Grafovi prilagođeni dashboard temi
   - Spacing i layout optimizirani za desktop i mobile
   - Dark mode podrška za sve grafove s automatskom paletom boja
   - Profesionalni stil s legendama i osima
   - Grid layout za organizaciju grafova

### 6. **Chart.js konfiguracija**
   - Registrirane sve potrebne komponente (Line, Bar, Doughnut, Legend, Tooltip)
   - Custom opcije za tooltips i legende
   - Multiple Y-axes za kombinirane metrike
   - Theme-aware boje (light/dark mode) s automatskim prepoznavanjem
   - Animacije i tranzicije za smooth UX

### 7. **Korisničko iskustvo**
   - Interaktivni grafovi: hover za detalje, zoom za povećanje
   - Pregled trendova: linijski grafovi za vremenske serije
   - Usporedbe: bar chartovi za usporedbu kategorija/perioda
   - Vizualna razgradnja: doughnut chart za status breakdown
   - Dinamički prikaz: seletor godine za pregled različitih perioda
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/ProviderROI.jsx\` (ROI Dashboard)
- **Biblioteke:** Chart.js, react-chartjs-2
- **State management:** useState, useEffect hooks
- **API integracija:** \`getYearlyReport()\` iz \`exclusive.js\`

### Backend:
- **Servis:** \`uslugar/backend/src/services/provider-roi-service.js\`
- **Route:** \`uslugar/backend/src/routes/exclusive.js\`
- **Endpoint:** \`GET /api/exclusive/roi/yearly-report?year=2024\`

### Baza podataka:
- **Tablice:** \`ProviderROI\`, \`LeadPurchase\`, \`Job\`, \`CreditTransaction\`
- **Agregacije:** GROUP BY po mjesecima/kategorijama
- **Query optimizacija:** Indexi na \`purchasedAt\`, \`categoryId\`

### API pozivi:
- \`GET /api/exclusive/roi/yearly-report?year=2024\` - Godišnji izvještaj
- Query params: \`year\` (opcionalno, default: trenutna godina)
- Response: \`{ revenue, roi, leads, conversions, byMonth, byCategory }\`
      `
      },
      "Upravljanje kategorijama": {
        summary: "CRUD operacije za upravljanje kategorijama usluga",
        details: `## Implementirano:

### 1. **CRUD operacije**
   - Kreiranje novih kategorija s kompletnim podacima
   - Ažuriranje postojećih kategorija (naziv, opis, ikona, NKD kod)
   - Brisanje kategorija (soft delete s isActive flagom)
   - Pregled svih kategorija s filtriranjem
   
### 2. **Hijerarhijska struktura**
   - Parent-child odnos kategorija
   - Podkategorije i glavne kategorije
   - Rekurzivno prikazivanje strukture u admin panelu
   - Drag & drop za promjenu redoslijeda
   
### 3. **Dodatna polja**
   - NKD kodovi djelatnosti (NKD 2007 standard)
   - Opisi kategorija s markdown podrškom
   - Emoji ikone za vizualni prikaz
   - Oznake za licencirane djelatnosti
   - Tipovi licenci i tijela koja izdaju licence
   
### 4. **Upravljanje**
   - Aktivacija/deaktivacija kategorija
   - Display order (poredak prikaza) s drag & drop
   - Filtering i search kroz sve kategorije
   - Bulk operacije (aktivacija/deaktivacija više odjednom)
   - Export kategorija u CSV format

### 5. **Validacija**
   - Provjera jedinstvenosti naziva
   - Validacija NKD kodova
   - Provjera referenci (npr. parent kategorije mora postojati)
   
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminCategories.jsx\`
- **Route:** \`/admin/categories\`
- **State management:** useState, useEffect hooks
- **CRUD operacije:** Kreiranje, ažuriranje, brisanje kategorija

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin-categories.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** CRUD operacije na Category model

### Baza podataka:
- **Tablice:** \`Category\`
- **Relacije:** Category → Category (parentId za hijerarhiju)
- **Indeksi:** \`@@index([parentId])\`, \`@@index([name])\`

### API pozivi:
- \`GET /api/admin/categories\` - Lista svih kategorija
- \`POST /api/admin/categories\` - Body: \`{ name, description, icon, parentId?, nkdCode?, requiresLicense? }\`
- \`PUT /api/admin/categories/:id\` - Body: \`{ name?, description?, icon?, ... }\`
- \`DELETE /api/admin/categories/:id\` - Briše kategoriju (cascade delete)
      `
      },
      "Upravljanje pravnim statusima": {
        summary: "Upravljanje pravnim oblicima za registraciju korisnika",
        details: `## Implementirano:

### 1. **Pravni statusi**
   - Fizička osoba - Privatna osoba bez registrirane djelatnosti
   - Obrtnik - Registrirani obrt s OIB-om
   - Paušalni obrt - Obrt s paušalnim oporezivanjem
   - d.o.o. - Društvo s ograničenom odgovornošću
   - j.d.o.o. - Jednostavno društvo s ograničenom odgovornošću
   - Samostalni djelatnik - Freelancer s paušalnim oporezivanjem

### 2. **CRUD operacije**
   - Kreiranje novih pravnih statusa
   - Ažuriranje postojećih statusa
   - Aktivacija/deaktivacija statusa
   - Pregled svih pravnih statusa

### 3. **Integracija**
   - Povezan s korisnicima i pružateljima
   - Obavezno polje pri registraciji korisnika
   - Validacija OIB-a za pravne osobe
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminLegalStatuses.jsx\`
- **Route:** \`/admin/legal-statuses\`
- **State management:** useState, useEffect hooks
- **CRUD operacije:** Kreiranje, ažuriranje, brisanje pravnih statusa

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** CRUD operacije na LegalStatus model

### Baza podataka:
- **Tablice:** \`LegalStatus\`, \`User\`
- **Relacije:** User → LegalStatus (legalStatusId)
- **Indeksi:** \`@@index([name])\`

### API pozivi:
- \`GET /api/admin/legal-statuses\` - Lista svih pravnih statusa
- \`POST /api/admin/legal-statuses\` - Body: \`{ name, description, isActive }\`
- \`PUT /api/admin/legal-statuses/:id\` - Ažuriranje pravnog statusa
- \`DELETE /api/admin/legal-statuses/:id\` - Brisanje (soft delete)
      `
      },
      "Upravljanje poslovima": {
        summary: "Admin panel za moderaciju i upravljanje poslovima",
        details: `## Implementirano:

### 1. **Pregled poslova**
   - Lista svih poslova na platformi s filtriranjem
   - Statusi poslova (OTVOREN, U TIJEKU, ZAVRŠEN, OTKAZAN)
   - Detalji posla: opis, budžet, lokacija, kategorija
   - Povezani korisnik i dodijeljeni pružatelj

### 2. **Moderacija**
   - Odobravanje/odbijanje poslova
   - Uklanjanje neprikladnih poslova
   - Uređivanje detalja posla (ako je potrebno)
   - Blokiranje korisnika zbog spam poslova

### 3. **Statistike**
   - Broj poslova po statusu
   - Prosječna vrijednost poslova
   - Najpopularnije kategorije
   - Aktivnost po mjesecima
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminJobs.jsx\`
- **Route:** \`/admin/jobs\`
- **State management:** useState, useEffect hooks
- **Filtriranje:** Status, kategorija, lokacija

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za Job model s relacijama

### Baza podataka:
- **Tablice:** \`Job\`, \`User\`, \`Category\`, \`Offer\`
- **Relacije:** Job → User, Job → Category
- **Indeksi:** \`@@index([status])\`, \`@@index([categoryId])\`

### API pozivi:
- \`GET /api/admin/jobs\` - Query params: \`status\`, \`categoryId\`, \`userId\`
- \`PUT /api/admin/jobs/:id\` - Body: \`{ status?, title?, description? }\`
- \`DELETE /api/admin/jobs/:id\` - Soft delete posla
      `
      },
      "Upravljanje ponudama": {
        summary: "Pregled i moderacija ponuda za poslove",
        details: `## Implementirano:

### 1. **Pregled ponuda**
   - Lista svih ponuda s filtriranjem
   - Statusi ponuda (NA ČEKANJU, PRIHVAĆENA, ODBIJENA)
   - Povezanost s poslom i pružateljem
   - Iznos ponude i poruka

### 2. **Moderacija**
   - Pregled detalja ponude
   - Mogućnost uklanjanja neprikladnih ponuda
   - Uređivanje statusa ponude (ako je potrebno)
   - Praćenje pregovora oko cijene

### 3. **Analitika**
   - Prosječne vrijednosti ponuda po kategorijama
   - Stopa prihvaćanja ponuda
   - Najaktivniji pružatelji
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminOffers.jsx\`
- **Route:** \`/admin/offers\`
- **State management:** useState, useEffect hooks
- **Filtriranje:** Status, posao, pružatelj

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za Offer model s relacijama

### Baza podataka:
- **Tablice:** \`Offer\`, \`Job\`, \`User\`
- **Relacije:** Offer → Job, Offer → User (pružatelj)
- **Indeksi:** \`@@index([status])\`, \`@@index([jobId])\`

### API pozivi:
- \`GET /api/admin/offers\` - Query params: \`status\`, \`jobId\`, \`providerId\`
- \`PUT /api/admin/offers/:id\` - Body: \`{ status?, amount? }\`
- \`DELETE /api/admin/offers/:id\` - Brisanje ponude
      `
      },
      "Admin upravljanje recenzijama": {
        summary: "Moderacija recenzija i upravljanje ocjenama",
        details: `## Implementirano:

### 1. **Pregled recenzija**
   - Lista svih recenzija s filtriranjem
   - Ocjene (1-5 zvjezdica) i komentari
   - Povezanost s korisnikom i pružateljem
   - Status recenzije (aktivna, uklonjena)

### 2. **Moderacija**
   - Brisanje neprikladnih recenzija
   - Uređivanje recenzija (ako je potrebno)
   - Blokiranje korisnika za spam recenzije
   - Verifikacija autentičnosti recenzija

### 3. **Automatski sustav**
   - Sprečavanje duplikata recenzija
   - Automatsko izračunavanje prosječne ocjene
   - Notifikacije o novim recenzijama
   - Rating breakdown po kategorijama
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminReviews.jsx\`
- **Route:** \`/admin/reviews\`
- **State management:** useState, useEffect hooks
- **Filtriranje:** Status, korisnik, pružatelj, ocjena

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za Review model s relacijama

### Baza podataka:
- **Tablice:** \`Review\`, \`User\`, \`Job\`
- **Relacije:** Review → User (reviewsGiven), Review → User (reviewsReceived), Review → Job
- **Indeksi:** \`@@index([rating])\`, \`@@index([reviewedUserId])\`

### API pozivi:
- \`GET /api/admin/reviews\` - Query params: \`userId\`, \`providerId\`, \`rating\`
- \`PUT /api/admin/reviews/:id\` - Body: \`{ comment?, rating? }\`
- \`DELETE /api/admin/reviews/:id\` - Brisanje recenzije
      `
      },
      "Upravljanje notifikacijama": {
        summary: "Upravljanje push, email i SMS notifikacijama",
        details: `## Implementirano:

### 1. **Pregled notifikacija**
   - Lista svih poslanih notifikacija
   - Tipovi notifikacija (push, email, SMS)
   - Status dostave (poslano, pročitano, greška)
   - Povezanost s korisnikom i akcijom

### 2. **Upravljanje**
   - Slanje masovnih notifikacija korisnicima
   - Testiranje notifikacija prije slanja
   - Pregled statistika otvorenosti
   - Podešavanje template-a notifikacija

### 3. **Automatske notifikacije**
   - Novi posao/ponuda notifikacije
   - Pretplata i plaćanje notifikacije
   - Verifikacija i status promjene
   - Systém notifikacija za sve važne događaje
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminNotifications.jsx\`
- **Route:** \`/admin/notifications\`
- **State management:** useState, useEffect hooks
- **Tipovi:** Push, Email, SMS notifikacije

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Servis:** \`notification-service.js\`
- **Prisma:** Query za Notification model

### Baza podataka:
- **Tablice:** \`Notification\`, \`User\`
- **Relacije:** Notification → User
- **Indeksi:** \`@@index([userId])\`, \`@@index([read])\`, \`@@index([type])\`

### API pozivi:
- \`GET /api/admin/notifications\` - Query params: \`userId\`, \`type\`, \`read\`
- \`POST /api/admin/notifications/send\` - Body: \`{ userIds, type, title, message }\`
- \`PUT /api/admin/notifications/:id\` - Markira kao pročitano
      `
      },
      "Upravljanje chat sobama": {
        summary: "Moderacija chat razgovora između korisnika i pružatelja",
        details: `## Implementirano:

### 1. **Pregled chat soba**
   - Lista svih aktivnih chat soba
   - Povezanost s poslom i korisnicima
   - Broj poruka i aktivnost
   - Status chat-a (aktivan, arhiviran)

### 2. **Moderacija**
   - Pregled poruka u chat sobama
   - Uklanjanje neprikladnih poruka
   - Blokiranje korisnika za spam
   - Arhiviranje starih chat soba

### 3. **Statistike**
   - Prosječan broj poruka po razgovoru
   - Vrijeme odgovora pružatelja
   - Aktivnost chat-a po kategorijama
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminChatRooms.jsx\`
- **Route:** \`/admin/chat\`
- **State management:** useState, useEffect hooks
- **Real-time:** WebSocket za live poruke

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za ChatRoom i ChatMessage modele

### Baza podataka:
- **Tablice:** \`ChatRoom\`, \`ChatMessage\`, \`User\`, \`Job\`
- **Relacije:** ChatRoom → Job, ChatRoom → User[], ChatMessage → ChatRoom, ChatMessage → User
- **Indeksi:** \`@@index([jobId])\`, \`@@index([createdAt])\`

### API pozivi:
- \`GET /api/admin/chat-rooms\` - Query params: \`jobId\`, \`userId\`
- \`GET /api/admin/chat-rooms/:id/messages\` - Poruke u chat sobi
- \`DELETE /api/admin/chat-rooms/:id\` - Arhiviranje chat sobe
- \`DELETE /api/admin/messages/:id\` - Brisanje poruke
      `
      },
      "Moderacija sadržaja": {
        summary: "Sveobuhvatna moderacija sadržaja na platformi",
        details: `## Implementirano:

### 1. **Moderacija profila**
   - Pregled profila korisnika i pružatelja
   - Verificiranje informacija u profilu
   - Uklanjanje neprikladnih slika ili opisa
   - Blokiranje korisnika

### 2. **Moderacija sadržaja**
   - Pregled objavljenih poslova
   - Moderacija ponuda i recenzija
   - Provjera licence i dokumenata
   - Reporting sustav za neprikladan sadržaj

### 3. **Automatska detekcija**
   - Spam detekcija u porukama
   - Duplikat detekcija za poslove/ponude
   - Provjera autentičnosti profila
   - Flagging sustav za korisnički reporting
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminModeration.jsx\`
- **Route:** \`/admin/moderation\`
- **State management:** useState, useEffect hooks
- **Tipovi:** Job, Review, Offer, Message, Profile

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Servis:** \`moderation-service.js\`
- **Prisma:** Query za Moderation model

### Baza podataka:
- **Tablice:** \`Moderation\`, \`Job\`, \`Review\`, \`Offer\`, \`ChatMessage\`
- **Polja:** \`contentType\`, \`contentId\`, \`status\` (PENDING, APPROVED, REJECTED)
- **Indeksi:** \`@@index([status])\`, \`@@index([contentType])\`

### API pozivi:
- \`GET /api/admin/moderation/pending\` - Query params: \`type\`, \`limit\`, \`offset\`
- \`POST /api/admin/moderation/:type/:id\` - Body: \`{ approved: boolean, reason? }\`
- \`GET /api/admin/moderation/stats\` - Statistike moderacije
      `
      },
      "Upravljanje pretplatama": {
        summary: "Upravljanje subscription planovima i aktivnim pretplatama",
        details: `## Implementirano:

### 1. **Subscription planovi**
   - Pregled svih planova (BASIC, PREMIUM, PRO)
   - Kreiranje i ažuriranje planova
   - Postavljanje cijena i kredita
   - Aktivacija/deaktivacija planova

### 2. **Aktivne pretplate**
   - Lista svih aktivnih pretplata korisnika
   - Status pretplate (aktivna, istekla, otkazana)
   - Pregled plaćanja i faktura
   - Ručno ažuriranje pretplata

### 3. **Upravljanje**
   - Produženje pretplate ručno
   - Otkazivanje pretplate
   - Povrat novca za pretplate
   - Statistike pretplata po planovima
   - Churn rate analiza

`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminSubscriptions.jsx\`
- **Route:** \`/admin/subscriptions\`
- **State management:** useState, useEffect hooks

### Backend:
- **Route:** \`uslugar/backend/src/routes/subscriptions.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za Subscription model s relacijama

### Baza podataka:
- **Tablice:** \`Subscription\`, \`User\`, \`Invoice\`
- **Relacije:** Subscription → User
- **Indeksi:** \`@@index([userId])\`, \`@@index([status])\`

### API pozivi:
- \`GET /api/admin/subscriptions\` - Query params: \`userId\`, \`status\`, \`plan\`
- \`PUT /api/admin/subscriptions/:id\` - Body: \`{ status?, plan?, expiresAt? }\`
- \`POST /api/admin/subscriptions/:id/cancel\` - Otkazuje pretplatu
      `
      },
      "Upravljanje transakcijama kredita": {
        summary: "Upravljanje kreditnim transakcijama i balansama",
        details: `## Implementirano:

### 1. **Pregled transakcija**
   - Lista svih kreditnih transakcija
   - Tipovi transakcija (PURCHASE, REFUND, SUBSCRIPTION, ADMIN_ADJUST)
   - Filtriranje po korisniku, datumu, tipu
   - Status transakcije (uspješna, neuspješna, pending)

### 2. **Admin operacije**
   - Ručno dodavanje/oduzimanje kredita korisniku
   - ADMIN_ADJUST tip transakcije za admin prilagodbe
   - Pregled historije transakcija korisnika
   - Export transakcija u CSV format

### 3. **Statistike**
   - Ukupan iznos transakcija po periodu
   - Prosječna vrijednost transakcije
   - Transakcije po tipu
   - Revenue po mjesecima
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminCreditTransactions.jsx\`
- **Route:** \`/admin/credit-transactions\`
- **State management:** useState, useEffect hooks
- **Filtriranje:** Korisnik, tip, datum

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za CreditTransaction model

### Baza podataka:
- **Tablice:** \`CreditTransaction\`, \`User\`
- **Relacije:** CreditTransaction → User
- **Tipovi:** PURCHASE, REFUND, SUBSCRIPTION, ADMIN_ADJUST
- **Indeksi:** \`@@index([userId])\`, \`@@index([type])\`, \`@@index([createdAt])\`

### API pozivi:
- \`GET /api/admin/credit-transactions\` - Query params: \`userId\`, \`type\`, \`startDate\`, \`endDate\`
- \`POST /api/admin/credit-transactions\` - Body: \`{ userId, amount, type: 'ADMIN_ADJUST', description? }\`
- \`GET /api/admin/credit-transactions/export\` - Export CSV
      `
      },
      "Admin odobravanje refund-a": {
        summary: "Odobravanje povrata novca za neuspjele leadove",
        details: `## Implementirano:

### 1. **Pregled refund zahtjeva**
   - Lista svih refund zahtjeva s filtriranjem
   - Status refund-a (PENDING, APPROVED, REJECTED)
   - Razlog refund-a (npr. klijent nije odgovorio)
   - Povezanost s lead purchase-om

### 2. **Odobravanje**
   - Pregled detalja refund zahtjeva
   - Odobravanje ili odbijanje refund-a
   - Automatsko vraćanje kredita na račun pružatelja
   - Notifikacija pružatelju o odluci

### 3. **Validacija**
   - Provjera razloga refund-a
   - Provjera da li lead ispunjava uvjete za refund
   - Praćenje refund rate po pružatelju
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminRefunds.jsx\`
- **Route:** \`/admin/refunds\`
- **State management:** useState, useEffect hooks
- **Filtriranje:** Status, pružatelj, datum

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za LeadPurchase i CreditTransaction modele

### Baza podataka:
- **Tablice:** \`LeadPurchase\`, \`CreditTransaction\`, \`User\`
- **Relacije:** LeadPurchase → User (pružatelj), CreditTransaction (REFUND tip)
- **Polja:** \`refundRequested\`, \`refundReason\`, \`refundStatus\`
- **Indeksi:** \`@@index([refundStatus])\`, \`@@index([providerId])\`

### API pozivi:
- \`GET /api/admin/refunds\` - Query params: \`status\`, \`providerId\`
- \`POST /api/admin/refunds/:id/approve\` - Odobravanje refund-a
- \`POST /api/admin/refunds/:id/reject\` - Body: \`{ reason: string }\`
      `
      },
      "Admin upravljanje queue sustavom": {
        summary: "Upravljanje queue sustavom za ekskluzivne leadove",
        details: `## Implementirano:

### 1. **Queue sustav**
   - Pregled svih leadova u queue-u
   - Status leadova (WAITING, ASSIGNED, PURCHASED, EXPIRED)
   - Prioritet leadova (AI prioritet, featured providers)
   - Filtri po kategoriji, lokaciji, statusu

### 2. **Upravljanje**
   - Ručno dodjeljivanje leadova pružateljima
   - Premještanje leadova između pružatelja
   - Uklanjanje neispravnih leadova
   - Priprema leadova za dodjelu

### 3. **AI prioritet**
   - Provjera AI prioriteta za pružatelje
   - Prvi u queue-u za featured providere
   - Algoritam za dodjelu leadova
   - Statistike uspješnosti queue-a
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminQueue.jsx\`
- **Route:** \`/admin/queue\`
- **State management:** useState, useEffect hooks
- **Filtriranje:** Status, kategorija, lokacija

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Servis:** \`leadQueueManager.js\`
- **Prisma:** Query za LeadQueue model

### Baza podataka:
- **Tablice:** \`LeadQueue\`, \`Job\`, \`User\`, \`Category\`
- **Relacije:** LeadQueue → Job, LeadQueue → User (pružatelj)
- **Statusi:** WAITING, OFFERED, ACCEPTED, DECLINED, EXPIRED, SKIPPED
- **Indeksi:** \`@@index([status])\`, \`@@index([jobId])\`, \`@@index([position])\`

### API pozivi:
- \`GET /api/admin/queue\` - Query params: \`status\`, \`categoryId\`, \`jobId\`
- \`POST /api/admin/queue/:id/assign\` - Body: \`{ providerId: string }\`
- \`PUT /api/admin/queue/:id\` - Ažuriranje pozicije ili statusa
      `
      },
      "Upravljanje ROI statistikama": {
        summary: "Pregled i upravljanje ROI metrikama za pružatelje",
        details: `## Implementirano:

### 1. **ROI statistike**
   - Pregled ROI metrika za sve pružatelje
   - Conversion rate, revenue, profit po pružatelju
   - Benchmarking s prosjekom platforme
   - Trend analiza ROI-a kroz vrijeme

### 2. **Godišnji izvještaji**
   - Godišnji ROI izvještaji po pružatelju
   - Mesečni breakdown prihoda i troškova
   - Pregled svih leadova i konverzija
   - Export izvještaja u PDF/CSV

### 3. **Analitika**
   - Top pružatelji po ROI-u
   - Najprofitabilnije kategorije
   - Prosječni ROI po kategorijama
   - ROI trendovi kroz godine
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminROI.jsx\`
- **Route:** \`/admin/roi\`
- **State management:** useState, useEffect hooks
- **Grafovi:** Chart.js za vizualizaciju

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Servis:** \`provider-roi-service.js\`
- **Prisma:** Query za ProviderROI model

### Baza podataka:
- **Tablice:** \`ProviderROI\`, \`ProviderProfile\`, \`LeadPurchase\`, \`Job\`
- **Relacije:** ProviderROI → ProviderProfile, ProviderROI → LeadPurchase
- **Polja:** \`revenue\`, \`cost\`, \`profit\`, \`conversionRate\`
- **Indeksi:** \`@@index([providerId])\`, \`@@index([year])\`

### API pozivi:
- \`GET /api/admin/roi/stats\` - Svi ROI statistički podaci
- \`GET /api/admin/roi/provider/:id\` - ROI za određenog pružatelja
- \`GET /api/admin/roi/yearly-report?year=2024\` - Godišnji izvještaj
      `
      },
      "Upravljanje licencama": {
        summary: "Verificiranje i upravljanje licencama pružatelja",
        details: `## Implementirano:

### 1. **Pregled licenci**
   - Lista svih upload-anih licenci
   - Status verifikacije (pending, verified, rejected)
   - Tipovi licenci (Elektrotehnička, Građevinska, itd.)
   - Tijela koja izdaju licence

### 2. **Verifikacija**
   - Ručna verifikacija licenci od strane admina
   - Provjera autentičnosti dokumenta
   - Validacija broja licence i datuma isteka
   - OCR provjera dokumenta (ako je podržano)

### 3. **Upravljanje**
   - Praćenje isteka licenci
   - Automatske notifikacije o isteku
   - Aktivacija/deaktivacija licenci
   - Pregled historije verifikacija
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminLicenses.jsx\`
- **Route:** \`/admin/licenses\`
- **State management:** useState, useEffect hooks
- **Filtriranje:** Status, tip licence, pružatelj

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Query za ProviderLicense model

### Baza podataka:
- **Tablice:** \`ProviderLicense\`, \`ProviderProfile\`
- **Relacije:** ProviderLicense → ProviderProfile
- **Polja:** \`licenseType\`, \`licenseNumber\`, \`issuingAuthority\`, \`expiresAt\`, \`isVerified\`
- **Indeksi:** \`@@index([isVerified])\`, \`@@index([expiresAt])\`

### API pozivi:
- \`GET /api/admin/licenses\` - Query params: \`verified\`, \`providerId\`, \`licenseType\`
- \`PATCH /api/admin/licenses/:licenseId/verify\` - Body: \`{ isVerified: boolean, notes? }\`
- \`GET /api/admin/licenses/expiring\` - Licence koje ističu uskoro
      `
      },
      "Verificiranje licenci od strane admina": {
        summary: "Ručna verifikacija licenci i certifikata",
        details: `## Implementirano:

### 1. **Verifikacijski proces**
   - Pregled upload-anog dokumenta licence
   - Provjera broja licence u relevantnom tijelu
   - Validacija datuma isteka
   - Provjera da li licenca odgovara kategoriji

### 2. **Admin akcije**
   - Odobravanje licence (verified)
   - Odbijanje licence (rejected) s razlogom
   - Zahtjevanje dodatnih dokumenata
   - Notifikacija pružatelju o statusu

### 3. **Dokumentacija**
   - Spremljen upload-an dokument
   - Admin bilješke o verifikaciji
   - Datum verifikacije i admin koji je verificirao
   - Historija svih verifikacijskih pokušaja
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminLicenseVerification.jsx\`
- **Route:** \`/admin/licenses/verify\`
- **State management:** useState, useEffect hooks
- **Pregled:** Upload-ani dokumenti, OCR rezultati

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Servis:** \`license-validator.js\`
- **Prisma:** Query za ProviderLicense model

### Baza podataka:
- **Tablice:** \`ProviderLicense\`, \`ProviderProfile\`, \`User\`
- **Relacije:** ProviderLicense → ProviderProfile
- **Polja:** \`verifiedAt\`, \`verifiedBy\`, \`notes\`, \`documentUrl\`
- **Indeksi:** \`@@index([isVerified])\`, \`@@index([verifiedBy])\`

### API pozivi:
- \`GET /api/admin/licenses/:licenseId\` - Detalji licence
- \`PATCH /api/admin/licenses/:licenseId/verify\` - Body: \`{ isVerified: boolean, notes? }\`
- \`POST /api/admin/licenses/:licenseId/validate\` - Validacija licence (automatska provjera)
      `
      },
      "Upravljanje verifikacijama klijenata": {
        summary: "Upravljanje KYC i drugim verifikacijama korisnika",
        details: `## Implementirano:

### 1. **KYC verifikacija**
   - Pregled upload-anih KYC dokumenata (Rješenja Porezne uprave)
   - OCR provjera dokumenta i ekstrakcija podataka
   - Validacija OIB-a algoritamskim provjerama
   - Provjera u Obrtnom registru i komorskim imenicima

### 2. **Email i telefon verifikacija**
   - Pregled statusa email verifikacije
   - SMS verifikacija telefona
   - Reset pokušaja verifikacije
   - Ručna verifikacija od strane admina

### 3. **Dokumentacija**
   - Pregled upload-anih dokumenata
   - Admin bilješke o verifikaciji
   - Historija verifikacijskih pokušaja
   - Status badge-ova (BUSINESS, IDENTITY, SAFETY)
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminKYC.jsx\`
- **Route:** \`/admin/kyc\`
- **State management:** useState, useEffect hooks
- **Pregled:** KYC dokumenti, OCR rezultati, badge statusi

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Servis:** \`kyc-service.js\`
- **Prisma:** Query za ProviderProfile (KYC polja)

### Baza podataka:
- **Tablice:** \`ProviderProfile\`, \`User\`
- **KYC polja:** \`kycVerified\`, \`kycDocumentUrl\`, \`kycDocumentType\`, \`kycOcrVerified\`, \`kycOibValidated\`, \`badgeData\`
- **Indeksi:** \`@@index([kycVerified])\`, \`@@index([kycOcrVerified])\`

### API pozivi:
- \`GET /api/admin/kyc\` - Query params: \`verified\`, \`userId\`
- \`POST /api/admin/kyc/:userId/verify\` - Body: \`{ kycVerified: boolean, notes? }\`
- \`GET /api/admin/kyc/:userId/document\` - Pregled upload-anog dokumenta
      `
      },
      "Dokumenti za verifikaciju": {
        summary: "Upravljanje dokumentima za KYC i verifikaciju",
        details: `## Implementirano:

### 1. **Tipovi dokumenata**
   - Rješenja Porezne uprave (RPO_SOLUTION)
   - Obrtni registar dokumenti (OBRT_REGISTRY)
   - Licencni dokumenti
   - Dokumenti identiteta

### 2. **Upload i procesiranje**
   - Upload dokumenta od strane korisnika
   - Automatska OCR provjera
   - Ekstrakcija podataka (OIB, ime, datum)
   - Spremanje dokumenta u sigurno skladište

### 3. **Admin pregled**
   - Pregled upload-anog dokumenta
   - Verificiranje ekstrahiranih podataka
   - Ručna korekcija ako OCR ne radi ispravno
   - Odobravanje/odbijanje dokumenta
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminVerificationDocuments.jsx\`
- **Route:** \`/admin/verification-documents\`
- **State management:** useState, useEffect hooks
- **Pregled:** Upload-ani dokumenti, OCR rezultati

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Servis:** \`kyc-service.js\`, OCR servis
- **Prisma:** Query za ProviderProfile (dokument polja)

### Baza podataka:
- **Tablice:** \`ProviderProfile\`, \`User\`
- **Dokument polja:** \`kycDocumentUrl\`, \`kycDocumentType\`, \`kycExtractedOib\`, \`kycExtractedName\`
- **OCR polja:** \`kycOcrVerified\`, \`kycOibValidated\`
- **Indeksi:** \`@@index([kycDocumentType])\`

### API pozivi:
- \`GET /api/admin/verification-documents\` - Query params: \`type\`, \`userId\`
- \`GET /api/admin/verification-documents/:id\` - Pregled dokumenta
- \`POST /api/admin/verification-documents/:id/approve\` - Odobravanje dokumenta
      `
      },
      "Admin reset SMS pokušaja": {
        summary: "Reset pokušaja SMS verifikacije za korisnike",
        details: `## Implementirano:

### 1. **SMS verifikacija**
   - Korisnik prima 6-digit SMS kod
   - Maksimalno 5 pokušaja verifikacije
   - 10 minuta vrijeme isteka koda
   - Automatsko blokiranje nakon previše pokušaja

### 2. **Admin reset**
   - Reset broja pokušaja verifikacije
   - Generiranje novog SMS koda
   - Produženje vremena isteka koda
   - Odblokiranje korisnika

### 3. **Kada koristiti**
   - Korisnik je potrošio sve pokušaje
   - SMS kod nije stigao
   - Tehnički problemi s SMS servisom
   - Korisnik traži pomoć od admina
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminUsers.jsx\` (user details)
- **Route:** \`/admin/users/:id\`
- **State management:** useState hooks
- **Funkcionalnost:** Reset SMS pokušaja u user details sekciji

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Update User model polja za SMS verifikaciju

### Baza podataka:
- **Tablice:** \`User\`
- **SMS polja:** \`phoneVerificationAttempts\`, \`phoneVerificationCode\`, \`phoneVerificationExpires\`
- **Reset:** Postavlja \`phoneVerificationAttempts = 0\`, generira novi kod

### API pozivi:
- \`POST /api/admin/users/:id/reset-sms\` - Reset SMS pokušaja
- Generira novi \`phoneVerificationCode\`, postavlja \`phoneVerificationExpires\` (novi expiry), \`phoneVerificationAttempts = 0\`
      `
      },
      "KYC Metrike": {
        summary: "Statistike i analitika KYC verifikacija",
        details: `## Implementirano:

### 1. **KYC statistike**
   - Broj verificiranih korisnika
   - Stopa uspješnosti KYC verifikacije
   - Prosječno vrijeme verifikacije
   - Razlozi odbijanja verifikacija

### 2. **Breakdown po tipovima**
   - OCR provjera - uspješnost
   - OIB validacija - uspješnost
   - Obrtni registar provjera
   - Komorski imenik provjera
   - VIES (PDV) provjera

### 3. **Trendovi**
   - KYC verifikacije po mjesecima
   - Trend uspješnosti verifikacije
   - Najčešći razlozi neuspjeha
   - Pregled po kategorijama usluga
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminKYCMetrics.jsx\`
- **Route:** \`/admin/kyc-metrics\`
- **State management:** useState, useEffect hooks
- **Grafovi:** Chart.js za vizualizaciju trendova

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Servis:** \`kyc-service.js\`
- **Prisma:** Agregacije za ProviderProfile (KYC polja)

### Baza podataka:
- **Tablice:** \`ProviderProfile\`, \`User\`
- **Agregacije:** COUNT, AVG po mjesecima/kategorijama
- **KYC polja:** \`kycVerified\`, \`kycVerifiedAt\`, \`kycOcrVerified\`, \`kycOibValidated\`
- **Indeksi:** \`@@index([kycVerified])\`, \`@@index([kycVerifiedAt])\`

### API pozivi:
- \`GET /api/admin/kyc-metrics\` - Sve KYC metrike
- \`GET /api/admin/kyc-metrics?period=monthly\` - Mesečne statistike
- \`GET /api/admin/kyc-metrics?breakdown=category\` - Breakdown po kategorijama
      `
      },
      "Provider Approvals": {
        summary: "Statistike odobravanja novih pružatelja",
        details: `## Implementirano:

### 1. **Approval statistike**
   - Broj novih registracija pružatelja
   - Status odobrenja (WAITING, APPROVED, REJECTED)
   - Prosječno vrijeme odobrenja
   - Stopa odobrenja/odbijanja

### 2. **Razlozi odbijanja**
   - Najčešći razlozi odbijanja
   - Provjera dokumentacije
   - Validacija podataka
   - KYC provjera

### 3. **Trendovi**
   - Novi pružatelji po mjesecima
   - Trend odobrenja kroz vrijeme
   - Breakdown po kategorijama
   - Pregled pending zahtjeva
`,
        technicalDetails: `## Tehnički detalji:

### Frontend:
- **Komponenta:** \`uslugar/frontend/src/pages/AdminProviderApprovals.jsx\`
- **Route:** \`/admin/provider-approvals\`
- **State management:** useState, useEffect hooks
- **Grafovi:** Chart.js za trendove odobrenja

### Backend:
- **Route:** \`uslugar/backend/src/routes/admin.js\`
- **Middleware:** \`auth(true, ['ADMIN'])\`
- **Prisma:** Agregacije za ProviderProfile (approvalStatus)

### Baza podataka:
- **Tablice:** \`ProviderProfile\`, \`User\`
- **Polja:** \`approvalStatus\` (WAITING_FOR_APPROVAL, APPROVED, REJECTED)
- **Agregacije:** COUNT po statusu, trendovi po mjesecima
- **Indeksi:** \`@@index([approvalStatus])\`, \`@@index([createdAt])\`

### API pozivi:
- \`GET /api/admin/provider-approvals\` - Query params: \`status\`, \`categoryId\`
- \`GET /api/admin/provider-approvals/stats\` - Statistike odobrenja
- \`PUT /api/admin/providers/:id/approval\` - Body: \`{ approvalStatus: 'APPROVED' | 'REJECTED' }\`
      `
      }
    };

    // Seed admin funkcionalnosti
    for (let catIndex = 0; catIndex < adminFeatures.length; catIndex++) {
      const categoryData = adminFeatures[catIndex];
      
      const category = await prisma.documentationCategory.upsert({
        where: { name: categoryData.category },
        update: { order: 1000 + catIndex, isActive: true },
        create: { name: categoryData.category, order: 1000 + catIndex, isActive: true }
      });

      console.log(`✅ Admin kategorija: ${categoryData.category}`);

      if (categoryData.items && Array.isArray(categoryData.items)) {
        for (let itemIndex = 0; itemIndex < categoryData.items.length; itemIndex++) {
          const item = categoryData.items[itemIndex];
          const description = adminFeatureDescriptions[item.name];

          const featureData = {
            categoryId: category.id,
            name: item.name,
            implemented: item.implemented !== undefined ? item.implemented : true,
            deprecated: item.deprecated || false,
            isAdminOnly: true, // Vazno: admin-only flag
            order: itemIndex,
            summary: description?.summary || null,
            details: description?.details || null,
            technicalDetails: description?.technicalDetails || null // Tehnički opis
          };

          const existing = await prisma.documentationFeature.findFirst({
            where: { categoryId: category.id, name: item.name }
          });

          if (existing) {
            await prisma.documentationFeature.update({
              where: { id: existing.id },
              data: featureData
            });
            featuresUpdated++;
            console.log(`   📝 Ažuriran: ${item.name}`);
          } else {
            await prisma.documentationFeature.create({ data: featureData });
            featuresCreated++;
            console.log(`   ➕ Kreiran: ${item.name}`);
          }
          
          totalFeatures++;
          if (item.implemented) implementedFeatures++;
        }
      }
    }

    console.log('✅ Admin funkcionalnosti seedane!');

    // Dodaj statistiku
    console.log('');
    console.log('📊 Dodavanje statistike...');
    const statsCategory = await prisma.documentationCategory.upsert({
      where: { name: 'Statistike Implementacije' },
      update: { order: 999, isActive: true },
      create: { name: 'Statistike Implementacije', order: 999, isActive: true }
    });

    const statsFeature = await prisma.documentationFeature.upsert({
      where: {
        categoryId_name: {
          categoryId: statsCategory.id,
          name: `${implementedFeatures} Implementirane funkcionalnosti`
        }
      },
      update: {
        summary: `Ukupno ${implementedFeatures} od ${totalFeatures} funkcionalnosti je implementirano.`,
        details: `## Statistika Implementacije:\n\n- **Ukupno funkcionalnosti:** ${totalFeatures}\n- **Implementirane:** ${implementedFeatures}\n- **Postotak:** ${Math.round((implementedFeatures / totalFeatures) * 100)}%\n\nOva statistika se automatski ažurira pri svakom seed-u dokumentacije.`,
        implemented: true,
        order: 0
      },
      create: {
        categoryId: statsCategory.id,
        name: `${implementedFeatures} Implementirane funkcionalnosti`,
        summary: `Ukupno ${implementedFeatures} od ${totalFeatures} funkcionalnosti je implementirano.`,
        details: `## Statistika Implementacije:\n\n- **Ukupno funkcionalnosti:** ${totalFeatures}\n- **Implementirane:** ${implementedFeatures}\n- **Postotak:** ${Math.round((implementedFeatures / totalFeatures) * 100)}%\n\nOva statistika se automatski ažurira pri svakom seed-u dokumentacije.`,
        implemented: true,
        order: 0
      }
    });

    console.log(`✅ Statistika dodana: ${implementedFeatures} Implementirane funkcionalnosti`);

    console.log('');
    console.log('📊 REZULTAT SEED-a:');
    console.log(`   Kategorije kreirane: ${categoriesCreated}`);
    console.log(`   Kategorije ažurirane: ${categoriesUpdated}`);
    console.log(`   Features kreirani: ${featuresCreated}`);
    console.log(`   Features ažurirani: ${featuresUpdated}`);
    console.log(`   Ukupno funkcionalnosti: ${totalFeatures}`);
    console.log(`   Implementirane: ${implementedFeatures} (${Math.round((implementedFeatures / totalFeatures) * 100)}%)`);
    console.log('✅ Seed dokumentacije završen!');

  } catch (error) {
    console.error('❌ Greška pri seed-u dokumentacije:', error);
    throw error;
  }
}

// Pokreni seed ako se pozove direktno
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDocumentation()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('❌ Seed neuspješan:', error);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export default seedDocumentation;
