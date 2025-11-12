const fs = require('fs');
const path = 'uslugar/backend/prisma/seeds/seed-documentation.js';
let text = fs.readFileSync(path, 'utf8');

function insertBlock(marker, block) {
  if (!text.includes(marker)) throw new Error('Marker not found: ' + marker);
  if (text.includes(block)) return;
  text = text.replace(marker, block + '\n' + marker);
}

const blockRealValue = [
  '    "Proporcionalna naplata (REAL_VALUE)": {',
  '      implemented: true,',
  '      summary: "Dinamičko određivanje cijene paketa temeljem stvarnog volumena leadova. Plaćate proporcionalno isporučenoj vrijednosti.",',
  '      details: ## Kako funkcionira:',
  '',
  'REAL_VALUE model omogućava fer naplatu koja je izravno povezana s brojem isporučenih leadova.',
  '',
  '**Formula:**',
  '`',
  'REAL_VALUE = MIN( (Isporučeni leadovi / Očekivani leadovi), 1.0 )',
  'Finalna cijena = Osnovna cijena × REAL_VALUE',
  '`',
  '',
  '**Kako koristimo:**',
  '1. Na kraju razdoblja sustav izračuna koliko je leadova isporučeno',
  '2. Uspoređuje se s očekivanim brojem leadova (definiranim paketom)',
  '3. Ako je isporuka manja od očekivane, cijena se smanjuje proporcionalno',
  '4. Ako je isporuka veća ili jednaka, plaća se puna cijena',
  '',
  '**Primjer:**',
  '- Očekivano: 10 leadova',
  '- Isporučeno: 6 leadova',
  '- REAL_VALUE = 6/10 = 0.6',
  '- Naplata = 100 € × 0.6 = 60 €',
  '',
  'Ovakav model osigurava da plaćate prema stvarnoj isporučenoj vrijednosti!',
  '',
  '    },'
].join('\n');

insertBlock('    "Feature ownership (funkcionalnosti ne nestaju)": {', blockRealValue);

fs.writeFileSync(path, text, 'utf8');
