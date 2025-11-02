/**
 * USLUGAR EXCLUSIVE - In-Process Queue Scheduler
 * 
 * Pokreće se kao dio glavnog servera
 * Provjerava istekle leadove svaki sat
 * Provjerava neaktivne lead purchase-ove svaki sat (automatski refund nakon 48h)
 * Provjerava licence koje istječu svaki dan (notifikacije o isteku)
 */

import cron from 'node-cron'
import { checkExpiredOffers } from './leadQueueManager.js'
import { checkInactiveLeadPurchases } from '../services/lead-service.js'
import { checkExpiringLicenses } from '../services/license-expiry-checker.js'
import { validateAllLicenses } from '../services/license-validator.js'
import { batchAutoVerifyClients } from '../services/auto-verification.js'

export function startQueueScheduler() {
  console.log('⏰ Starting Queue Scheduler...')
  
  // Pokreni svaki sat (0 minuta svaki sat)
  cron.schedule('0 * * * *', async () => {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`⏰ Scheduled Check: ${new Date().toISOString()}`)
    console.log('='.repeat(50))
    
    try {
      // Provjeri istekle ponude u queueu
      await checkExpiredOffers()
      
      // Provjeri neaktivne lead purchase-ove (automatski refund nakon 48h)
      await checkInactiveLeadPurchases()
      
      console.log('✅ Scheduled check completed')
    } catch (error) {
      console.error('❌ Scheduled check failed:', error)
    }
    
    console.log('='.repeat(50) + '\n')
  })
  
  // Provjeri licence koje istječu svaki dan u 9:00
  cron.schedule('0 9 * * *', async () => {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`⏰ License Expiry Check: ${new Date().toISOString()}`)
    console.log('='.repeat(50))
    
    try {
      await checkExpiringLicenses()
      console.log('✅ License expiry check completed')
    } catch (error) {
      console.error('❌ License expiry check failed:', error)
    }
    
    console.log('='.repeat(50) + '\n')
  })
  
  // Provjeri valjanost licenci svaki dan u 10:00 (1h nakon expiry check-a)
  cron.schedule('0 10 * * *', async () => {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`⏰ License Validity Check: ${new Date().toISOString()}`)
    console.log('='.repeat(50))
    
    try {
      await validateAllLicenses()
      console.log('✅ License validity check completed')
    } catch (error) {
      console.error('❌ License validity check failed:', error)
    }
    
    console.log('='.repeat(50) + '\n')
  })
  
  // Batch automatska verifikacija klijenata svaki dan u 11:00
  cron.schedule('0 11 * * *', async () => {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`⏰ Batch Auto Verification: ${new Date().toISOString()}`)
    console.log('='.repeat(50))
    
    try {
      const result = await batchAutoVerifyClients()
      console.log(`✅ Batch auto-verification completed: ${result.verified}/${result.total} verified, ${result.errors} errors`)
    } catch (error) {
      console.error('❌ Batch auto-verification failed:', error)
    }
    
    console.log('='.repeat(50) + '\n')
  })
  
  // Također pokreni svake 15 minuta za hitne poslove
  cron.schedule('*/15 * * * *', async () => {
    // Samo log svake 15 min, za monitoring
    console.log(`⏰ Queue Monitor: ${new Date().toISOString()} - System running`)
  })
  
  console.log('✅ Queue Scheduler started successfully')
  console.log('   - Expired offers check: Every hour at :00')
  console.log('   - Inactive lead purchases check (48h auto-refund): Every hour at :00')
  console.log('   - License expiry check: Daily at 09:00')
  console.log('   - License validity check: Daily at 10:00')
  console.log('   - Batch auto-verification: Daily at 11:00')
  console.log('   - Monitor heartbeat: Every 15 minutes')
}

