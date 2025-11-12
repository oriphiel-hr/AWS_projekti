const fs = require('fs');
const path = 'uslugar/backend/prisma/seeds/seed-documentation.js';
let text = fs.readFileSync(path, 'utf8');
const insertionBlocks = [
  {
    marker: '    "Feature ownership (funkcionalnosti ne nestaju)": {',
    block: `    "Proporcionalna naplata (REAL_VALUE)": {
      implemented: true,
      summary: "Dinamičko određivanje cijene paketa temeljem stvarnog volumena leadova. Plaćate proporcionalno isporučenoj vrijednosti.",
      details: `## Kako funkcionira:

REAL_VALUE model omogućava fer naplatu koja je izravno povezana s brojem isporučenih leadova.

**Formula:**
\`\`\`
REAL_VALUE = MIN( (Isporučeni leadovi / Očekivani leadovi), 1.0 )
Finalna cijena = Osnovna cijena × REAL_VALUE
\`\`\`

**Kako koristimo:**
1. Na kraju razdoblja sustav izračuna koliko je leadova isporučeno
2. Uspoređuje se s očekivanim brojem leadova (definiranim paketom)
3. Ako je isporuka manja od očekivane, cijena se smanjuje proporcionalno
4. Ako je isporuka veća ili jednaka, plaća se puna cijena

**Primjer:**
- Očekivano: 10 leadova
- Isporučeno: 6 leadova
- REAL_VALUE = 6/10 = 0.6
- Naplata = 100 € × 0.6 = 60 €

Ovakav model osigurava da plaćate prema stvarnoj isporučenoj vrijednosti!
`,
      technicalDetails: `## Tehnički detalji:

### Frontend:
- Faktura prikazuje graf očekivano vs. isporučeno te badge REAL_VALUE s postotkom.
- Tooltip uz stavku na fakturi objašnjava izračun i prikazuje sirove brojke.
- Direktor može preuzeti CSV s breakdownom po kategoriji i regiji.

### Backend:
- realValueCalculator.collectUsage(planId, period) agregira leadove i vraća faktor.
- invoiceService.injectRealValueLineItem dodaje stavku ili prilagođava iznos postojećoj.
- Event billing.realValueCalculated se zapisuje u audit log i šalje notifikacije.

### Baza:
- RealValueSnapshot čuva expectedLeads, deliveredLeads, factor i referencu na fakturu.
- InvoiceLineItem ima polja usageExpected, usageDelivered i realValueFactor za transparentnost.
- BillingMetricAggregation koristi snapshotove za BI izvještaje i forecast modele.

### API poziv:
- GET /api/director/billing/real-value?period=YYYY-MM daje pregled faktora po razdoblju.
- GET /api/admin/billing/plans/:planId/real-value-history služi timu platforme za praćenje trendova.
- POST /api/admin/billing/recalculate-real-value pokreće ponovno računanje nakon retroaktivnih korekcija leadova.
`
    },
`
  }
];
for (const { marker, block } of insertionBlocks) {
  if (!text.includes(marker)) {
    throw new Error(`Marker not found: ${marker}`);
  }
  if (text.includes(block)) {
    console.log('Block already present, skipping insertion for marker');
    continue;
  }
  text = text.replace(marker, `${block}\n${marker}`);
}
fs.writeFileSync(path, text, 'utf8');
