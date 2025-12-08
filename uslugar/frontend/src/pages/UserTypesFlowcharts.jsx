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
    <svg viewBox="0 0 1200 700" className="w-full h-auto">
      <defs>
        <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill={textColor} />
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

      {/* KYC Verifikacija */}
      <rect x="450" y="150" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="180" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        KYC Verifikacija
      </text>
      <text x="600" y="200" textAnchor="middle" fontSize="12" fill={textColor}>
        Upload dokumenata: OIB, sudski registar
      </text>
      <text x="600" y="215" textAnchor="middle" fontSize="12" fill={textColor}>
        Admin provjera → companyVerified
      </text>

      <line x1="600" y1="230" x2="600" y2="270" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />

      <polygon points="600,270 650,310 600,350 550,310" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="315" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Verificiran?
      </text>

      {/* Verificiran */}
      <line x1="550" y1="310" x2="400" y2="310" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <rect x="200" y="360" width="400" height="60" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="400" y="385" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        ✓ Verificirani pružatelj
      </text>
      <text x="400" y="405" textAnchor="middle" fontSize="12" fill="white">
        Badge: Business, Identity
      </text>

      {/* Nije verificiran */}
      <line x1="650" y1="310" x2="800" y2="310" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <rect x="700" y="360" width="200" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="800" y="385" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Nije verificiran
      </text>
      <text x="800" y="405" textAnchor="middle" fontSize="12" fill={textColor}>
        Čeka provjeru
      </text>

      {/* Licenciranje */}
      <line x1="400" y1="420" x2="400" y2="460" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />

      <polygon points="400,460 450,500 400,540 350,500" fill={warningColor} stroke={borderColor} strokeWidth="2" />
      <text x="400" y="505" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
        Licenca potrebna?
      </text>

      {/* Potrebna licenca */}
      <line x1="350" y1="500" x2="200" y2="500" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <rect x="50" y="550" width="300" height="80" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="200" y="575" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Upload licence
      </text>
      <text x="200" y="595" textAnchor="middle" fontSize="12" fill={textColor}>
        PDF dokument, tip licence
      </text>
      <text x="200" y="610" textAnchor="middle" fontSize="12" fill={textColor}>
        Admin verifikacija
      </text>
      <text x="200" y="625" textAnchor="middle" fontSize="12" fill={successColor}>
        ✓ Licencirani pružatelj
      </text>

      {/* Nije potrebna licenca */}
      <line x1="450" y1="500" x2="600" y2="500" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <rect x="500" y="550" width="200" height="60" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="600" y="575" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Licenca nije potrebna
      </text>
      <text x="600" y="595" textAnchor="middle" fontSize="12" fill={textColor}>
        Kategorija ne zahtijeva
      </text>
      <text x="600" y="610" textAnchor="middle" fontSize="12" fill={successColor}>
        ✓ Aktivni pružatelj
      </text>
    </svg>
  );

  // Dijagram 3: Pretplate
  const SubscriptionFlowchart = () => (
    <svg viewBox="0 0 1200 600" className="w-full h-auto">
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
    </svg>
  );

  // Dijagram 4: Korištenje platforme - Korisnik usluge
  const UserJourneyFlowchart = () => (
    <svg viewBox="0 0 1200 800" className="w-full h-auto">
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
      <text x="300" y="430" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Posao objavljen
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

      {/* Ponude */}
      <line x1="300" y1="440" x2="300" y2="480" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      <rect x="100" y="480" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="505" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Primljene ponude
      </text>
      <text x="300" y="525" textAnchor="middle" fontSize="11" fill={textColor}>
        1. Pregled ponuda od pružatelja
      </text>
      <text x="300" y="540" textAnchor="middle" fontSize="11" fill={textColor}>
        2. Pregled profila pružatelja
      </text>
      <text x="300" y="555" textAnchor="middle" fontSize="11" fill={textColor}>
        3. Prihvati/odbij ponudu
      </text>
      <text x="300" y="570" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Chat soba kreirana
      </text>

      {/* Chat i završetak */}
      <line x1="300" y1="580" x2="300" y2="620" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead4)" />
      <rect x="100" y="620" width="400" height="80" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="645" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        Chat i završetak posla
      </text>
      <text x="300" y="665" textAnchor="middle" fontSize="12" fill="white">
        Komunikacija, dogovor detalja, završetak
      </text>
      <text x="300" y="680" textAnchor="middle" fontSize="12" fill="white">
        Recenzija i ocjena pružatelja
      </text>
    </svg>
  );

  // Dijagram 5: Korištenje platforme - Pružatelj
  const ProviderJourneyFlowchart = () => (
    <svg viewBox="0 0 1200 800" className="w-full h-auto">
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

      {/* Ekskluzivni leadovi */}
      <line x1="650" y1="290" x2="900" y2="290" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="700" y="340" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="900" y="365" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Ekskluzivni leadovi
      </text>
      <text x="900" y="385" textAnchor="middle" fontSize="11" fill={textColor}>
        1. Pregled marketplace leadova
      </text>
      <text x="900" y="400" textAnchor="middle" fontSize="11" fill={textColor}>
        2. Kupovina leada (krediti/Stripe)
      </text>
      <text x="900" y="415" textAnchor="middle" fontSize="11" fill={textColor}>
        3. Kontaktiranje klijenta
      </text>
      <text x="900" y="430" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Lead kupljen
      </text>

      {/* Prihvaćena ponuda */}
      <line x1="300" y1="440" x2="300" y2="480" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="100" y="480" width="400" height="100" rx="5" fill={boxColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="505" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
        Prihvaćena ponuda
      </text>
      <text x="300" y="525" textAnchor="middle" fontSize="11" fill={textColor}>
        1. Notifikacija o prihvaćanju
      </text>
      <text x="300" y="540" textAnchor="middle" fontSize="11" fill={textColor}>
        2. Chat soba automatski kreirana
      </text>
      <text x="300" y="555" textAnchor="middle" fontSize="11" fill={textColor}>
        3. Komunikacija s klijentom
      </text>
      <text x="300" y="570" textAnchor="middle" fontSize="11" fill={successColor}>
        ✓ Posao u tijeku
      </text>

      {/* Završetak i ROI */}
      <line x1="300" y1="580" x2="300" y2="620" stroke={textColor} strokeWidth="2" markerEnd="url(#arrowhead5)" />
      <rect x="100" y="620" width="400" height="80" rx="5" fill={successColor} stroke={borderColor} strokeWidth="2" />
      <text x="300" y="645" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
        Završetak posla
      </text>
      <text x="300" y="665" textAnchor="middle" fontSize="12" fill="white">
        Završetak radova, recenzija, ROI tracking
      </text>
      <text x="300" y="680" textAnchor="middle" fontSize="12" fill="white">
        Ažuriranje statistika i konverzije
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

