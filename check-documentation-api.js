// Brza provjera da li API endpoint vraća podatke
const https = require('https');

const options = {
  hostname: 'uslugar.oriph.io',
  path: '/api/documentation',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

console.log('🔍 Provjera API endpointa...\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const featureCount = json.features ? json.features.length : 0;
      const descCount = json.featureDescriptions ? Object.keys(json.featureDescriptions).length : 0;

      console.log('✅ API endpoint radi!');
      console.log(`   Broj kategorija: ${featureCount}`);
      console.log(`   Broj feature opisa: ${descCount}\n`);

      if (featureCount > 0) {
        console.log('✅ PODACI SU U BAZI!');
        console.log('   → Migracije su uspješno primijenjene');
        console.log('   → Seed je uspješno pokrenut');
        console.log('   → Tablice postoje i imaju podatke\n');
        console.log('🌐 Frontend može učitati podatke:');
        console.log('   https://uslugar.oriph.io/#documentation');
      } else {
        console.log('⚠️  API radi, ali nema podataka!');
        console.log('   → Provjeri CloudWatch logs za seed job');
      }
    } catch (e) {
      console.log('❌ Greška pri parsiranju odgovora:');
      console.log('   ' + e.message);
      console.log('\nRaw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.log('❌ Greška pri pozivanju API-ja:');
  console.log('   ' + e.message);
  console.log('\n💡 Provjeri:');
  console.log('   1. Da li je backend server pokrenut');
  console.log('   2. Da li su migracije primijenjene');
  console.log('   3. GitHub Actions logs za detalje');
});

req.end();

