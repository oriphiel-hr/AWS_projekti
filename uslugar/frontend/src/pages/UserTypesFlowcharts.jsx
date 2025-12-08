import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext.jsx';

export default function UserTypesFlowcharts() {
  const { isDarkMode } = useDarkMode();
  
  const textColor = isDarkMode ? '#E5E7EB' : '#1F2937';
  const bgColor = isDarkMode ? '#111827' : '#FFFFFF';
  const boxColor = isDarkMode ? '#1F2937' : '#F3F4F6';
  const borderColor = isDarkMode ? '#374151' : '#D1D5DB';
  const primaryColor = '#3B82F6';
  const successColor = '#10B981';
  const warningColor = '#F59E0B';
  const dangerColor = '#EF4444';

  // Dijagram 1: Registracija i Onboarding
  const RegistrationFlowchart = () => (
    <svg viewBox="0 0 1200 800" className="w-full h-auto">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill={textColor} />
        </marker>
        <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="providerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Naslov */}
      <text x="600" y="30" textAnchor="middle" fontSize="24" fontWeight="bold" fill={textColor}>
        Proces Registracije i Onboarding-a
      </text>

      {/* Početak */}
      <rect x="550" y="60" width="100" height="50" rx="5" fill={primaryColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="90" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">
        Početak
      </text>

      {/* Odabir tipa korisnika */}
      <rect x="500" y="150" width="200" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Odabir tipa korisnika
      </text>
      <text x="600" y="195" textAnchor="middle" fontSize="12" fill={textColor}>
        USER ili PROVIDER
      </text>

      {/* Strelica */}
      <line x1="600" y1="110" x2="600" y2="150" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Grananje */}
      <polygon points="600,210 650,250 600,290 550,250" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="255" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Tip?
      </text>

      {/* Strelica USER */}
      <line x1="550" y1="250" x2="400" y2="250" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="475" y="245" textAnchor="middle" fontSize="12" fill={textColor}>USER</text>

      {/* Strelica PROVIDER */}
      <line x1="650" y1="250" x2="800" y2="250" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="725" y="245" textAnchor="middle" fontSize="12" fill={textColor}>PROVIDER</text>

      {/* USER putanja */}
      <g>
        <rect x="250" y="300" width="300" height="60" rx="5" fill="url(#userGradient)" stroke={primaryColor} strokeWidth="2" />
        <text x="400" y="325" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
          Registracija korisnika usluge
        </text>
        <text x="400" y="345" textAnchor="middle" fontSize="12" fill={textColor}>
          Email, lozinka, ime
        </text>

        <line x1="400" y1="360" x2="400" y2="400" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />

        <polygon points="400,400 450,440 400,480 350,440" fill={warningColor} stroke={borderColor} strokeWidth="2" />
        <text x="400" y="445" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
          Pravni status?
        </text>

        {/* Privatni korisnik */}
        <line x1="350" y1="440" x2="200" y2="440" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />
        <rect x="50" y="490" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
        <text x="200" y="515" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
          Privatni korisnik
        </text>
        <text x="200" y="535" textAnchor="middle" fontSize="11" fill={textColor}>
          Fizička osoba
        </text>
        <text x="200" y="550" textAnchor="middle" fontSize="11" fill={textColor}>
          Traži usluge za osobne potrebe
        </text>
        <text x="200" y="565" textAnchor="middle" fontSize="11" fill={successColor}>
          ✓ Registracija završena
        </text>

        {/* Poslovni korisnik */}
        <line x1="450" y1="440" x2="600" y2="440" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />
        <rect x="450" y="490" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
        <text x="600" y="515" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
          Poslovni korisnik
        </text>
        <text x="600" y="535" textAnchor="middle" fontSize="11" fill={textColor}>
          Pravna osoba (obrt, d.o.o.)
        </text>
        <text x="600" y="550" textAnchor="middle" fontSize="11" fill={textColor}>
          Traži usluge za poslovanje
        </text>
        <text x="600" y="565" textAnchor="middle" fontSize="11" fill={successColor}>
          ✓ Registracija završena
        </text>
      </g>

      {/* PROVIDER putanja */}
      <g>
        <rect x="700" y="300" width="300" height="60" rx="5" fill="url(#providerGradient)" stroke={successColor} strokeWidth="2" />
        <text x="850" y="325" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
          Registracija pružatelja
        </text>
        <text x="850" y="345" textAnchor="middle" fontSize="12" fill={textColor}>
          Email, lozinka, pravni status, OIB
        </text>

        <line x1="850" y1="360" x2="850" y2="400" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />

        <rect x="700" y="400" width="300" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
        <text x="850" y="425" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
          Wizard: Odabir kategorija
        </text>
        <text x="850" y="445" textAnchor="middle" fontSize="12" fill={textColor}>
          Kategorije usluga, regije
        </text>

        <line x1="850" y1="460" x2="850" y2="500" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />

        <polygon points="850,500 900,540 850,580 800,540" fill={warningColor} stroke={borderColor} strokeWidth="2" />
        <text x="850" y="545" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
          Tvrtka?
        </text>

        {/* Solo provider */}
        <line x1="800" y1="540" x2="650" y2="540" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />
        <rect x="500" y="590" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
        <text x="650" y="615" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
          Pružatelj (Solo)
        </text>
        <text x="650" y="635" textAnchor="middle" fontSize="11" fill={textColor}>
          Pojedinačni pružatelj
        </text>
        <text x="650" y="650" textAnchor="middle" fontSize="11" fill={textColor}>
          Bez tima
        </text>
        <text x="650" y="665" textAnchor="middle" fontSize="11" fill={successColor}>
          ✓ Onboarding završen
        </text>

        {/* Tvrtka provider */}
        <line x1="900" y1="540" x2="1050" y2="540" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead)" />
        <rect x="900" y="590" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
        <text x="1050" y="615" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
          Pružatelj (Tvrtka)
        </text>
        <text x="1050" y="635" textAnchor="middle" fontSize="11" fill={textColor}>
          Tvrtka s timom
        </text>
        <text x="1050" y="650" textAnchor="middle" fontSize="11" fill={textColor}>
          Company name, direktor
        </text>
        <text x="1050" y="665" textAnchor="middle" fontSize="11" fill={successColor}>
          ✓ Onboarding završen
        </text>
      </g>
    </svg>
  );

  // Dijagram 2: Verifikacija i Licenciranje
  const VerificationFlowchart = () => (
    <svg viewBox="0 0 1200 900" className="w-full h-auto">
      <defs>
        <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill={textColor} />
        </marker>
        <marker id="arrowhead2-back" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
          <polygon points="10 0, 0 3, 10 6" fill={textColor} />
        </marker>
      </defs>

      <text x="600" y="30" textAnchor="middle" fontSize="24" fontWeight="bold" fill={textColor}>
        Proces Verifikacije i Licenciranja
      </text>

      {/* Pružatelj */}
      <rect x="500" y="60" width="200" height="50" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="90" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">
        Pružatelj usluga
      </text>

      <line x1="600" y1="110" x2="600" y2="150" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />

      {/* KYC Verifikacija - Upload */}
      <rect x="450" y="150" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="180" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        KYC Verifikacija - Upload
      </text>
      <text x="600" y="200" textAnchor="middle" fontSize="12" fill={textColor}>
        Upload dokumenata: OIB, sudski registar
      </text>
      <text x="600" y="215" textAnchor="middle" fontSize="12" fill={textColor}>
        Dokumenti poslani na provjeru
      </text>

      <line x1="600" y1="230" x2="600" y2="270" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />

      {/* ADMIN provjera */}
      <rect x="450" y="270" width="300" height="100" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="3" />
      <text x="600" y="300" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">
        🔐 ADMIN Provjera
      </text>
      <text x="600" y="325" textAnchor="middle" fontSize="12" fill="white">
        • Pregled dokumenata
      </text>
      <text x="600" y="345" textAnchor="middle" fontSize="12" fill="white">
        • Provjera OIB-a (Sudski registar)
      </text>
      <text x="600" y="365" textAnchor="middle" fontSize="12" fill="white">
        • Odobrenje/Odbijanje
      </text>

      <line x1="600" y1="370" x2="600" y2="410" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />

      <polygon points="600,410 650,450 600,490 550,450" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="455" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Odobreno?
      </text>

      {/* Verificiran */}
      <line x1="550" y1="450" x2="400" y2="450" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <rect x="200" y="500" width="400" height="80" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="400" y="525" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ Verificirani pružatelj
      </text>
      <text x="400" y="545" textAnchor="middle" fontSize="12" fill="white">
        companyVerified = true
      </text>
      <text x="400" y="565" textAnchor="middle" fontSize="12" fill="white">
        Badge: Business, Identity
      </text>

      {/* Odbijeno */}
      <line x1="650" y1="450" x2="800" y2="450" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <rect x="700" y="500" width="200" height="100" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="2" />
      <text x="800" y="525" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ❌ ODBIJENO
      </text>
      <text x="800" y="545" textAnchor="middle" fontSize="12" fill="white">
        Admin razlog odbijanja
      </text>
      <text x="800" y="565" textAnchor="middle" fontSize="12" fill="white">
        • Neispravni dokumenti
      </text>
      <text x="800" y="580" textAnchor="middle" fontSize="12" fill="white">
        • Neuspjela provjera OIB-a
      </text>
      <text x="800" y="595" textAnchor="middle" fontSize="12" fill="white">
        Mogućnost ponovnog slanja
      </text>

      {/* Povratak na upload */}
      <line x1="800" y1="600" x2="800" y2="640" stroke={textColor} strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead2-back)" />
      <text x="820" y="625" textAnchor="start" fontSize="10" fill={textColor}>ponovno slanje</text>
      <line x1="800" y1="640" x2="600" y2="640" stroke={textColor} strokeWidth="2" strokeDasharray="5,5" />
      <line x1="600" y1="640" x2="600" y2="230" stroke={textColor} strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead2)" />

      {/* Licenciranje */}
      <line x1="400" y1="580" x2="400" y2="620" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />

      <polygon points="400,620 450,660 400,700 350,660" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="400" y="665" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Licenca potrebna?
      </text>

      {/* Potrebna licenca */}
      <line x1="350" y1="660" x2="200" y2="660" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      
      {/* Upload licence */}
      <rect x="50" y="710" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="200" y="735" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Upload licence
      </text>
      <text x="200" y="755" textAnchor="middle" fontSize="12" fill={textColor}>
        PDF dokument, tip licence
      </text>
      <text x="200" y="770" textAnchor="middle" fontSize="12" fill={textColor}>
        Broj licence, izdavatelj
      </text>
      <text x="200" y="785" textAnchor="middle" fontSize="12" fill={textColor}>
        Dokument poslan na provjeru
      </text>

      <line x1="200" y1="790" x2="200" y2="830" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />

      {/* ADMIN verifikacija licence */}
      <rect x="50" y="830" width="300" height="100" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="3" />
      <text x="200" y="860" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">
        🔐 ADMIN Verifikacija
      </text>
      <text x="200" y="885" textAnchor="middle" fontSize="12" fill="white">
        • Provjera valjanosti licence
      </text>
      <text x="200" y="905" textAnchor="middle" fontSize="12" fill="white">
        • Kontakt s izdavateljem (opcionalno)
      </text>
      <text x="200" y="925" textAnchor="middle" fontSize="12" fill="white">
        • Odobrenje/Odbijanje
      </text>

      {/* Nije potrebna licenca */}
      <line x1="450" y1="660" x2="600" y2="660" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <rect x="500" y="710" width="200" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="735" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Licenca nije potrebna
      </text>
      <text x="600" y="755" textAnchor="middle" fontSize="12" fill={textColor}>
        Kategorija ne zahtijeva
      </text>
      <text x="600" y="770" textAnchor="middle" fontSize="12" fill={successColor}>
        ✓ Aktivni pružatelj
      </text>

      {/* Licenca odobrena */}
      <line x1="200" y1="930" x2="200" y2="970" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <rect x="50" y="970" width="300" height="60" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="200" y="995" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ Licencirani pružatelj
      </text>
      <text x="200" y="1015" textAnchor="middle" fontSize="12" fill="white">
        isVerified = true, Badge: Safety
      </text>
    </svg>
  );

  // Dijagram 3: Pretplate
  const SubscriptionFlowchart = () => (
    <svg viewBox="0 0 1200 700" className="w-full h-auto">
      <defs>
        <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill={textColor} />
        </marker>
      </defs>

      <text x="600" y="30" textAnchor="middle" fontSize="24" fontWeight="bold" fill={textColor}>
        Proces Pretplata
      </text>

      {/* Registracija */}
      <rect x="500" y="60" width="200" height="50" rx="5" fill={primaryColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="90" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">
        Registracija
      </text>

      <line x1="600" y1="110" x2="600" y2="150" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />

      {/* TRIAL */}
      <rect x="450" y="150" width="300" height="80" rx="5" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="180" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">
        TRIAL Paket
      </text>
      <text x="600" y="200" textAnchor="middle" fontSize="12" fill="white">
        Automatski dodijeljen
      </text>
      <text x="600" y="215" textAnchor="middle" fontSize="12" fill="white">
        Ograničeno vrijeme (npr. 14 dana)
      </text>

      <line x1="600" y1="230" x2="600" y2="270" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />

      <polygon points="600,270 650,310 600,350 550,310" fill={primaryColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="315" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Upgrade?
      </text>

      {/* Upgrade opcije */}
      <line x1="550" y1="310" x2="400" y2="310" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />
      <line x1="400" y1="310" x2="200" y2="310" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />
      <line x1="650" y1="310" x2="800" y2="310" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />
      <line x1="800" y1="310" x2="1000" y2="310" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />

      {/* BASIC */}
      <rect x="50" y="360" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="200" y="385" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        BASIC
      </text>
      <text x="200" y="405" textAnchor="middle" fontSize="11" fill={textColor}>
        Osnovne funkcionalnosti
      </text>
      <text x="200" y="420" textAnchor="middle" fontSize="11" fill={textColor}>
        Ograničen broj poslova
      </text>
      <text x="200" y="435" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Aktivna pretplata
      </text>

      {/* PREMIUM */}
      <rect x="400" y="360" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="550" y="385" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        PREMIUM
      </text>
      <text x="550" y="405" textAnchor="middle" fontSize="11" fill={textColor}>
        Napredne funkcionalnosti
      </text>
      <text x="550" y="420" textAnchor="middle" fontSize="11" fill={textColor}>
        Više poslova, prioritet
      </text>
      <text x="550" y="435" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Aktivna pretplata
      </text>

      {/* PRO */}
      <rect x="750" y="360" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="900" y="385" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        PRO
      </text>
      <text x="900" y="405" textAnchor="middle" fontSize="11" fill={textColor}>
        Sve funkcionalnosti
      </text>
      <text x="900" y="420" textAnchor="middle" fontSize="11" fill={textColor}>
        Unlimited, VIP podrška
      </text>
      <text x="900" y="435" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Aktivna pretplata
      </text>

      {/* Nema upgrade */}
      <line x1="1000" y1="310" x2="1000" y2="360" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />
      <rect x="900" y="470" width="200" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="1000" y="495" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Nema pretplate
      </text>
      <text x="1000" y="515" textAnchor="middle" fontSize="12" fill={textColor}>
        TRIAL istekao
      </text>

      {/* ADMIN upravljanje pretplatama */}
      <line x1="600" y1="440" x2="600" y2="480" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />
      <rect x="450" y="480" width="300" height="100" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="3" />
      <text x="600" y="510" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">
        🔐 ADMIN Upravljanje
      </text>
      <text x="600" y="535" textAnchor="middle" fontSize="12" fill="white">
        • Ručno produženje pretplate
      </text>
      <text x="600" y="555" textAnchor="middle" fontSize="12" fill="white">
        • Promjena plana (upgrade/downgrade)
      </text>
      <text x="600" y="575" textAnchor="middle" fontSize="12" fill="white">
        • Otkazivanje, refundiranje
      </text>
      <text x="600" y="590" textAnchor="middle" fontSize="12" fill="white">
        • Pregled faktura i transakcija
      </text>

      <line x1="600" y1="580" x2="600" y2="620" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead3)" />
      <rect x="450" y="620" width="300" height="60" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="645" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ Pretplata aktivna
      </text>
      <text x="600" y="665" textAnchor="middle" fontSize="12" fill="white">
        Status: ACTIVE, automatska obnova
      </text>
    </svg>
  );

  // Dijagram 4: Korištenje platforme - Korisnik usluge
  const UserJourneyFlowchart = () => (
    <svg viewBox="0 0 1200 1520" className="w-full h-auto">
      <defs>
        <marker id="arrowhead4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill={textColor} />
        </marker>
      </defs>

      <text x="600" y="30" textAnchor="middle" fontSize="24" fontWeight="bold" fill={textColor}>
        Proces Korištenja Platforme - Korisnik Usluge
      </text>

      {/* Prijava */}
      <rect x="500" y="60" width="200" height="50" rx="5" fill={primaryColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="90" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">
        Prijava
      </text>

      <line x1="600" y1="110" x2="600" y2="150" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />

      {/* Dashboard */}
      <rect x="450" y="150" width="300" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Dashboard
      </text>
      <text x="600" y="195" textAnchor="middle" fontSize="12" fill={textColor}>
        Pregled poslova, pretraga
      </text>

      <line x1="600" y1="210" x2="600" y2="250" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />

      <polygon points="600,250 650,290 600,330 550,290" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="295" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Akcija?
      </text>

      {/* Objavi posao */}
      <line x1="550" y1="290" x2="300" y2="290" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      <rect x="100" y="340" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="365" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Objavi posao
      </text>
      <text x="300" y="385" textAnchor="middle" fontSize="11" fill={textColor}>
        1. Odaberi kategoriju
      </text>
      <text x="300" y="400" textAnchor="middle" fontSize="11" fill={textColor}>
        2. Unesi detalje (opis, budžet, lokacija)
      </text>
      <text x="300" y="415" textAnchor="middle" fontSize="11" fill={textColor}>
        3. Postavi slike (opcionalno)
      </text>
      <text x="300" y="430" textAnchor="middle" fontSize="11" fill={textColor}>
        4. Posao kreiran (status: OPEN)
      </text>

      <line x1="300" y1="440" x2="300" y2="480" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />

      {/* ADMIN moderacija (opcionalno) */}
      <rect x="100" y="480" width="400" height="80" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="505" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        🔐 ADMIN Moderacija (opcionalno)
      </text>
      <text x="300" y="525" textAnchor="middle" fontSize="11" fill="white">
        Provjera sadržaja, spam detekcija
      </text>
      <text x="300" y="540" textAnchor="middle" fontSize="11" fill="white">
        Odobrenje/Odbijanje ako je potrebno
      </text>
      <text x="300" y="555" textAnchor="middle" fontSize="11" fill="white">
        Većina poslova automatski odobrena
      </text>

      <line x1="300" y1="560" x2="300" y2="600" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />

      <rect x="100" y="600" width="400" height="60" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="625" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ Posao objavljen i vidljiv
      </text>
      <text x="300" y="645" textAnchor="middle" fontSize="12" fill="white">
        Dostupan pružateljima za ponude
      </text>

      {/* Pretraži poslove */}
      <line x1="650" y1="290" x2="900" y2="290" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      <rect x="700" y="340" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="900" y="365" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Pretraži poslove
      </text>
      <text x="900" y="385" textAnchor="middle" fontSize="11" fill={textColor}>
        1. Filteri (kategorija, grad, budžet)
      </text>
      <text x="900" y="400" textAnchor="middle" fontSize="11" fill={textColor}>
        2. Spremi pretragu (opcionalno)
      </text>
      <text x="900" y="415" textAnchor="middle" fontSize="11" fill={textColor}>
        3. Job alerts (opcionalno)
      </text>
      <text x="900" y="430" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Rezultati prikazani
      </text>

      {/* Ponude - zahtijeva PRUŽATELJA */}
      <line x1="300" y1="660" x2="300" y2="700" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      
      {/* Pružatelj šalje ponudu */}
      <rect x="700" y="700" width="300" height="100" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="850" y="720" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
        👤 PRUŽATELJ
      </text>
      <text x="850" y="740" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        Šalje ponudu
      </text>
      <text x="850" y="760" textAnchor="middle" fontSize="11" fill="white">
        • Iznos, poruka, rok
      </text>
      <text x="850" y="775" textAnchor="middle" fontSize="11" fill="white">
        • Status: NA_ČEKANJU
      </text>
      <text x="850" y="790" textAnchor="middle" fontSize="11" fill="white">
        ⚠️ Bez ponude nema chatrooma
      </text>

      {/* Korisnik prima ponude */}
      <rect x="100" y="700" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="720" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>
        👤 KORISNIK USLUGE
      </text>
      <text x="300" y="740" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Primljene ponude
      </text>
      <text x="300" y="760" textAnchor="middle" fontSize="11" fill={textColor}>
        1. Pregled ponuda od pružatelja
      </text>
      <text x="300" y="775" textAnchor="middle" fontSize="11" fill={textColor}>
        2. Pregled profila pružatelja
      </text>
      <text x="300" y="790" textAnchor="middle" fontSize="11" fill={textColor}>
        3. Prihvati/odbij ponudu
      </text>

      {/* Strelica između sudionika */}
      <line x1="500" y1="750" x2="700" y2="750" stroke={textColor} strokeWidth="2" strokeDasharray="5,5" />
      <text x="600" y="745" textAnchor="middle" fontSize="10" fill={textColor}>interakcija</text>

      <line x1="300" y1="800" x2="300" y2="840" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />

      {/* Odluka o ponudi */}
      <polygon points="300,840 350,880 300,920 250,880" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="885" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Odluka?
      </text>

      {/* Prihvaćena ponuda */}
      <line x1="250" y1="880" x2="100" y2="880" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />

      {/* Prihvaćena ponuda - putanja */}
      <rect x="50" y="900" width="200" height="80" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="150" y="925" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ PRIHVAĆENA
      </text>
      <text x="150" y="945" textAnchor="middle" fontSize="12" fill="white">
        Status: PRIHVAĆENA
      </text>
      <text x="150" y="965" textAnchor="middle" fontSize="12" fill="white">
        Chatroom se kreira
      </text>

      {/* Odbijena ponuda */}
      <line x1="350" y1="880" x2="500" y2="880" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      <rect x="450" y="900" width="200" height="100" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="2" />
      <text x="550" y="925" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ❌ ODBIJENA
      </text>
      <text x="550" y="945" textAnchor="middle" fontSize="12" fill="white">
        Status: ODBIJENA
      </text>
      <text x="550" y="965" textAnchor="middle" fontSize="12" fill="white">
        • Ponuda odbijena
      </text>
      <text x="550" y="980" textAnchor="middle" fontSize="12" fill="white">
        • Nema chatrooma
      </text>
      <text x="550" y="995" textAnchor="middle" fontSize="12" fill="white">
        • Pružatelj može poslati novu
      </text>

      {/* Chatroom - ZAHTIJEVA OBA SUDIONIKA */}
      <line x1="150" y1="980" x2="150" y2="1020" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      
      {/* Chatroom kreiranje */}
      <rect x="50" y="1020" width="200" height="120" rx="5" fill={primaryColor} stroke={borderColor} strokeWidth="3" />
      <text x="150" y="1045" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        💬 CHATROOM
      </text>
      <text x="150" y="1065" textAnchor="middle" fontSize="11" fill="white">
        ⚠️ ZAHTIJEVA:
      </text>
      <text x="150" y="1085" textAnchor="middle" fontSize="10" fill="white">
        • Korisnik usluge (vlasnik posla)
      </text>
      <text x="150" y="1100" textAnchor="middle" fontSize="10" fill="white">
        • Pružatelj (prihvaćena ponuda)
      </text>
      <text x="150" y="1115" textAnchor="middle" fontSize="10" fill="white">
        • Posao s ACCEPTED offer
      </text>
      <text x="150" y="1130" textAnchor="middle" fontSize="11" fill="white">
        ✓ Automatski kreiran
      </text>

      {/* Oba sudionika u chatu */}
      <rect x="350" y="1020" width="300" height="120" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="500" y="1045" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>
        👥 OBA SUDIONIKA
      </text>
      <text x="500" y="1065" textAnchor="middle" fontSize="11" fill={textColor}>
        Komunikacija u chatroomu
      </text>
      <text x="500" y="1085" textAnchor="middle" fontSize="11" fill={textColor}>
        • Dogovor detalja
      </text>
      <text x="500" y="1100" textAnchor="middle" fontSize="11" fill={textColor}>
        • Razmjena informacija
      </text>
      <text x="500" y="1115" textAnchor="middle" fontSize="11" fill={textColor}>
        • Otkrivanje kontakata
      </text>
      <text x="500" y="1130" textAnchor="middle" fontSize="11" fill={textColor}>
        ⚠️ Bez oba sudionika nema chata
      </text>

      {/* Strelica između chatrooma i sudionika */}
      <line x1="250" y1="1080" x2="350" y2="1080" stroke={textColor} strokeWidth="2" strokeDasharray="5,5" />
      <text x="300" y="1075" textAnchor="middle" fontSize="10" fill={textColor}>koristi</text>

      <line x1="150" y1="1140" x2="150" y2="1180" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />

      {/* Odluka o izvršenju posla */}
      <polygon points="150,1180 200,1220 150,1260 100,1220" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="150" y="1225" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Izvršen?
      </text>

      {/* Posao izvršen */}
      <line x1="100" y1="1220" x2="50" y2="1220" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      <rect x="50" y="1280" width="200" height="80" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="150" y="1305" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ POSAO IZVRŠEN
      </text>
      <text x="150" y="1325" textAnchor="middle" fontSize="12" fill="white">
        Status: ZAVRŠEN
      </text>
      <text x="150" y="1345" textAnchor="middle" fontSize="12" fill="white">
        Recenzije, ROI tracking
      </text>

      {/* Posao otkazan */}
      <line x1="200" y1="1220" x2="350" y2="1220" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      <rect x="300" y="1280" width="200" height="100" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="2" />
      <text x="400" y="1305" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ❌ POSAO OTKAZAN
      </text>
      <text x="400" y="1325" textAnchor="middle" fontSize="12" fill="white">
        Status: OTKAZAN
      </text>
      <text x="400" y="1345" textAnchor="middle" fontSize="12" fill="white">
        • Korisnik otkazao
      </text>
      <text x="400" y="1365" textAnchor="middle" fontSize="12" fill="white">
        • Pružatelj otkazao
      </text>
      <text x="400" y="1380" textAnchor="middle" fontSize="12" fill="white">
        • Nema recenzija
      </text>

      <line x1="150" y1="1360" x2="150" y2="1400" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />

      {/* Završetak i recenzije */}
      <rect x="50" y="1400" width="200" height="120" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="150" y="1425" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        Završetak posla
      </text>
      <text x="150" y="1445" textAnchor="middle" fontSize="12" fill="white">
        Status: ZAVRŠEN
      </text>
      <text x="150" y="1465" textAnchor="middle" fontSize="11" fill="white">
        👥 OBA SUDIONIKA: Recenzije
      </text>
      <text x="150" y="1485" textAnchor="middle" fontSize="10" fill="white">
        • Korisnik ocjenjuje pružatelja
      </text>
      <text x="150" y="1500" textAnchor="middle" fontSize="10" fill="white">
        • Pružatelj ocjenjuje korisnika
      </text>
      <text x="150" y="1515" textAnchor="middle" fontSize="11" fill="white">
        ⚠️ Bilateralno ocjenjivanje
      </text>
    </svg>
  );

  // Dijagram 5: Korištenje platforme - Pružatelj
  const ProviderJourneyFlowchart = () => (
    <svg viewBox="0 0 1200 1120" className="w-full h-auto">
      <defs>
        <marker id="arrowhead5" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill={textColor} />
        </marker>
      </defs>

      <text x="600" y="30" textAnchor="middle" fontSize="24" fontWeight="bold" fill={textColor}>
        Proces Korištenja Platforme - Pružatelj Usluga
      </text>

      {/* Prijava */}
      <rect x="500" y="60" width="200" height="50" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="90" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">
        Prijava (PROVIDER)
      </text>

      <line x1="600" y1="110" x2="600" y2="150" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />

      {/* Dashboard */}
      <rect x="450" y="150" width="300" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Provider Dashboard
      </text>
      <text x="600" y="195" textAnchor="middle" fontSize="12" fill={textColor}>
        Pregled poslova, leadovi, statistike
      </text>

      <line x1="600" y1="210" x2="600" y2="250" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />

      <polygon points="600,250 650,290 600,330 550,290" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="295" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Akcija?
      </text>

      {/* Pregled poslova */}
      <line x1="550" y1="290" x2="300" y2="290" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="100" y="340" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="365" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Pregled dostupnih poslova
      </text>
      <text x="300" y="385" textAnchor="middle" fontSize="11" fill={textColor}>
        1. Filteri (kategorija, lokacija, budžet)
      </text>
      <text x="300" y="400" textAnchor="middle" fontSize="11" fill={textColor}>
        2. Pregled detalja posla
      </text>
      <text x="300" y="415" textAnchor="middle" fontSize="11" fill={textColor}>
        3. Slanje ponude
      </text>
      <text x="300" y="430" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Ponuda poslana
      </text>

      {/* Ekskluzivni leadovi - ZAHTIJEVA KORISNIKA koji je objavio posao */}
      <line x1="650" y1="290" x2="900" y2="290" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      
      {/* Korisnik objavio posao koji postaje lead */}
      <rect x="700" y="340" width="300" height="100" rx="5" fill={primaryColor} stroke={borderColor} strokeWidth="2" />
      <text x="850" y="360" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
        👤 KORISNIK USLUGE
      </text>
      <text x="850" y="380" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        Objavio posao → Lead
      </text>
      <text x="850" y="400" textAnchor="middle" fontSize="11" fill="white">
        • Posao postaje ekskluzivni lead
      </text>
      <text x="850" y="415" textAnchor="middle" fontSize="11" fill="white">
        • Dostupan na marketplaceu
      </text>
      <text x="850" y="430" textAnchor="middle" fontSize="11" fill="white">
        ⚠️ Bez posla nema leada
      </text>

      {/* Pružatelj kupuje lead */}
      <rect x="100" y="340" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="360" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>
        👤 PRUŽATELJ
      </text>
      <text x="300" y="380" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Kupovina ekskluzivnog leada
      </text>
      <text x="300" y="400" textAnchor="middle" fontSize="11" fill={textColor}>
        1. Pregled marketplace leadova
      </text>
      <text x="300" y="415" textAnchor="middle" fontSize="11" fill={textColor}>
        2. Kupovina (krediti/Stripe)
      </text>
      <text x="300" y="430" textAnchor="middle" fontSize="11" fill={successColor}>
        3. ✓ Lead kupljen, kontakt otkriven
      </text>

      {/* Strelica između sudionika */}
      <line x1="500" y1="390" x2="700" y2="390" stroke={textColor} strokeWidth="2" strokeDasharray="5,5" />
      <text x="600" y="385" textAnchor="middle" fontSize="10" fill={textColor}>kupuje</text>

      {/* Odluka korisnika o ponudi */}
      <line x1="300" y1="440" x2="300" y2="480" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      
      {/* Korisnik odlučuje */}
      <rect x="700" y="480" width="300" height="100" rx="5" fill={primaryColor} stroke={borderColor} strokeWidth="2" />
      <text x="850" y="500" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
        👤 KORISNIK USLUGE
      </text>
      <text x="850" y="520" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        Odluka o ponudi
      </text>
      <text x="850" y="540" textAnchor="middle" fontSize="11" fill="white">
        • Pregled ponuda
      </text>
      <text x="850" y="555" textAnchor="middle" fontSize="11" fill="white">
        • Odabir najbolje ponude
      </text>
      <text x="850" y="570" textAnchor="middle" fontSize="11" fill="white">
        ⚠️ Bez odluke nema chatrooma
      </text>

      {/* Pružatelj čeka odluku */}
      <rect x="100" y="480" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="500" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>
        👤 PRUŽATELJ
      </text>
      <text x="300" y="520" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Čeka odluku korisnika
      </text>
      <text x="300" y="540" textAnchor="middle" fontSize="11" fill={textColor}>
        • Status: NA_ČEKANJU
      </text>
      <text x="300" y="555" textAnchor="middle" fontSize="11" fill={textColor}>
        • Može biti prihvaćena ili odbijena
      </text>
      <text x="300" y="570" textAnchor="middle" fontSize="11" fill={textColor}>
        • 🔐 ADMIN: Moderacija (opcionalno)
      </text>

      {/* Strelica između sudionika */}
      <line x1="500" y1="530" x2="700" y2="530" stroke={textColor} strokeWidth="2" strokeDasharray="5,5" />
      <text x="600" y="525" textAnchor="middle" fontSize="10" fill={textColor}>odlučuje</text>

      <line x1="850" y1="580" x2="850" y2="620" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />

      {/* Odluka korisnika */}
      <polygon points="850,620 900,660 850,700 800,660" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="850" y="665" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Odluka?
      </text>

      {/* Prihvaćena */}
      <line x1="800" y1="660" x2="600" y2="660" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="400" y="720" width="200" height="80" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="500" y="745" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ PRIHVAĆENA
      </text>
      <text x="500" y="765" textAnchor="middle" fontSize="12" fill="white">
        Status: PRIHVAĆENA
      </text>
      <text x="500" y="785" textAnchor="middle" fontSize="12" fill="white">
        Chatroom se kreira
      </text>

      {/* Odbijena */}
      <line x1="900" y1="660" x2="1050" y2="660" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="950" y="720" width="200" height="100" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="2" />
      <text x="1050" y="745" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ❌ ODBIJENA
      </text>
      <text x="1050" y="765" textAnchor="middle" fontSize="12" fill="white">
        Status: ODBIJENA
      </text>
      <text x="1050" y="785" textAnchor="middle" fontSize="12" fill="white">
        • Ponuda odbijena
      </text>
      <text x="1050" y="805" textAnchor="middle" fontSize="12" fill="white">
        • Nema chatrooma
      </text>
      <text x="1050" y="820" textAnchor="middle" fontSize="12" fill="white">
        • Pružatelj može poslati novu
      </text>

      {/* Notifikacija pružatelju */}
      <line x1="500" y1="800" x2="300" y2="800" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="100" y="820" width="400" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="845" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        👤 PRUŽATELJ: Notifikacija
      </text>
      <text x="300" y="865" textAnchor="middle" fontSize="12" fill={textColor}>
        Ponuda prihvaćena, chat soba kreirana
      </text>

      <line x1="300" y1="880" x2="300" y2="920" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />

      {/* Chatroom - ZAHTIJEVA OBA SUDIONIKA */}
      <rect x="200" y="620" width="200" height="120" rx="5" fill={primaryColor} stroke={borderColor} strokeWidth="3" />
      <text x="300" y="645" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        💬 CHATROOM
      </text>
      <text x="300" y="665" textAnchor="middle" fontSize="11" fill="white">
        ⚠️ ZAHTIJEVA:
      </text>
      <text x="300" y="685" textAnchor="middle" fontSize="10" fill="white">
        • Korisnik (vlasnik posla)
      </text>
      <text x="300" y="700" textAnchor="middle" fontSize="10" fill="white">
        • Pružatelj (prihvaćena ponuda)
      </text>
      <text x="300" y="715" textAnchor="middle" fontSize="10" fill="white">
        • Oboje moraju biti aktivni
      </text>
      <text x="300" y="730" textAnchor="middle" fontSize="11" fill="white">
        ✓ Automatski kreiran
      </text>

      {/* Oba sudionika u chatu */}
      <rect x="500" y="620" width="300" height="120" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="650" y="645" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>
        👥 OBA SUDIONIKA
      </text>
      <text x="650" y="665" textAnchor="middle" fontSize="11" fill={textColor}>
        Komunikacija u chatroomu
      </text>
      <text x="650" y="685" textAnchor="middle" fontSize="11" fill={textColor}>
        • Razmjena poruka
      </text>
      <text x="650" y="700" textAnchor="middle" fontSize="11" fill={textColor}>
        • Otkrivanje kontakata
      </text>
      <text x="650" y="715" textAnchor="middle" fontSize="11" fill={textColor}>
        • Dogovor detalja
      </text>
      <text x="650" y="730" textAnchor="middle" fontSize="11" fill={textColor}>
        ⚠️ Bez oba sudionika nema chata
      </text>

      {/* Strelica između chatrooma i sudionika */}
      <line x1="400" y1="680" x2="500" y2="680" stroke={textColor} strokeWidth="2" strokeDasharray="5,5" />
      <text x="450" y="675" textAnchor="middle" fontSize="10" fill={textColor}>koristi</text>

      <line x1="300" y1="740" x2="300" y2="780" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />

      <rect x="100" y="780" width="400" height="60" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="805" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ Posao u tijeku
      </text>
      <text x="300" y="825" textAnchor="middle" fontSize="12" fill="white">
        Status: U_TIJEKU
      </text>

      {/* Odluka o izvršenju posla */}
      <line x1="300" y1="840" x2="300" y2="880" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      
      <polygon points="300,880 350,920 300,960 250,920" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="925" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Izvršen?
      </text>

      {/* Posao izvršen */}
      <line x1="250" y1="920" x2="100" y2="920" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="50" y="980" width="200" height="140" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="150" y="1005" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ POSAO IZVRŠEN
      </text>
      <text x="150" y="1025" textAnchor="middle" fontSize="12" fill="white">
        Status: ZAVRŠEN
      </text>
      <text x="150" y="1045" textAnchor="middle" fontSize="11" fill="white">
        👥 OBA SUDIONIKA: Recenzije
      </text>
      <text x="150" y="1065" textAnchor="middle" fontSize="10" fill="white">
        • Pružatelj ocjenjuje korisnika
      </text>
      <text x="150" y="1080" textAnchor="middle" fontSize="10" fill="white">
        • Korisnik ocjenjuje pružatelja
      </text>
      <text x="150" y="1095" textAnchor="middle" fontSize="10" fill="white">
        ⚠️ Bilateralno ocjenjivanje
      </text>
      <text x="150" y="1110" textAnchor="middle" fontSize="11" fill="white">
        ROI tracking, statistike
      </text>
      <text x="150" y="1125" textAnchor="middle" fontSize="11" fill="white">
        🔐 ADMIN: Moderacija recenzija
      </text>

      {/* Posao otkazan */}
      <line x1="350" y1="920" x2="500" y2="920" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="450" y="980" width="200" height="100" rx="5" fill={dangerColor} stroke={borderColor} strokeWidth="2" />
      <text x="550" y="1005" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ❌ POSAO OTKAZAN
      </text>
      <text x="550" y="1025" textAnchor="middle" fontSize="12" fill="white">
        Status: OTKAZAN
      </text>
      <text x="550" y="1045" textAnchor="middle" fontSize="12" fill="white">
        • Korisnik otkazao
      </text>
      <text x="550" y="1065" textAnchor="middle" fontSize="12" fill="white">
        • Pružatelj otkazao
      </text>
      <text x="550" y="1085" textAnchor="middle" fontSize="12" fill="white">
        • Nema recenzija
      </text>
      <text x="550" y="1100" textAnchor="middle" fontSize="12" fill="white">
        • Nema ROI trackinga
      </text>
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundColor: bgColor }}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: textColor }}>
          📊 Dijagrami Procesa za Tipove Korisnika
        </h1>
        <p className="text-xl mb-6" style={{ color: textColor }}>
          Vizualni prikaz cijelog procesa za različite tipove korisnika na Uslugar platformi
        </p>
      </div>

      <div className="space-y-16">
        {/* Dijagram 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
            1. Proces Registracije i Onboarding-a
          </h2>
          <div className="overflow-x-auto">
            <RegistrationFlowchart />
          </div>
        </div>

        {/* Dijagram 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
            2. Proces Verifikacije i Licenciranja
          </h2>
          <div className="overflow-x-auto">
            <VerificationFlowchart />
          </div>
        </div>

        {/* Dijagram 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
            3. Proces Pretplata
          </h2>
          <div className="overflow-x-auto">
            <SubscriptionFlowchart />
          </div>
        </div>

        {/* Dijagram 4 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
            4. Proces Korištenja Platforme - Korisnik Usluge
          </h2>
          <div className="overflow-x-auto">
            <UserJourneyFlowchart />
          </div>
        </div>

        {/* Dijagram 5 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
            5. Proces Korištenja Platforme - Pružatelj Usluga
          </h2>
          <div className="overflow-x-auto">
            <ProviderJourneyFlowchart />
          </div>
        </div>
      </div>

      {/* Informacije */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-3" style={{ color: isDarkMode ? '#93C5FD' : '#1E40AF' }}>
          ℹ️ O dijagramima
        </h3>
        <p className="text-sm" style={{ color: isDarkMode ? '#BFDBFE' : '#1E3A8A' }}>
          Ovi dijagrami prikazuju cijeli proces za različite tipove korisnika na Uslugar platformi. 
          Dijagrami su interaktivni i prilagođeni dark mode-u. Svaki dijagram prikazuje korake i odluke 
          koje korisnici donose tijekom korištenja platforme.
        </p>
      </div>
    </div>
  );
}

