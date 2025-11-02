// Script to trigger backend workflow via empty commit
const { execSync } = require('child_process');

console.log('🚀 Triggering backend deployment workflow...\n');

try {
  // Provjeri status
  console.log('📋 Checking git status...');
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  
  if (status.trim()) {
    console.log('📝 Staging changes...');
    execSync('git add uslugar/backend/src/routes/documentation.js uslugar/backend/src/server.js', { stdio: 'inherit' });
    console.log('💾 Committing...');
    execSync('git commit -m "feat: Trigger backend deployment - documentation route"', { stdio: 'inherit' });
  }
  
  console.log('\n📤 Pushing to main branch...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n✅ Push uspješan!');
  console.log('🔄 Backend workflow će se automatski pokrenuti...');
  console.log('\n📊 Provjeri status:');
  console.log('   https://github.com/oriphiel/AWS_projekti/actions');
  console.log('\n⏱️  Čekaj ~7-10 minuta za deployment');
  
} catch (error) {
  console.error('❌ Greška:', error.message);
  console.log('\n💡 Ručno pokreni workflow:');
  console.log('   https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml');
}

