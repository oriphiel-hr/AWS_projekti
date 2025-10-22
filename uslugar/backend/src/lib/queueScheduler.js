/**
 * USLUGAR EXCLUSIVE - In-Process Queue Scheduler
 * 
 * Pokreće se kao dio glavnog servera
 * Provjerava istekle leadove svaki sat
 */

import cron from 'node-cron'
import { checkExpiredOffers } from './leadQueueManager.js'

export function startQueueScheduler() {
  console.log('⏰ Starting Queue Scheduler...')
  
  // Pokreni svaki sat (0 minuta svaki sat)
  cron.schedule('0 * * * *', async () => {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`⏰ Scheduled Check: ${new Date().toISOString()}`)
    console.log('='.repeat(50))
    
    try {
      await checkExpiredOffers()
      console.log('✅ Scheduled check completed')
    } catch (error) {
      console.error('❌ Scheduled check failed:', error)
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
  console.log('   - Monitor heartbeat: Every 15 minutes')
}

