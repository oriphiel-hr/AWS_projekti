/**
 * USLUGAR EXCLUSIVE - Lead Queue Manager
 * 
 * Manages the queue system for lead distribution
 * Prevents broadcasting to 6+ providers like Trebam.hr
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Pronalazi najbolje matchane providere za posao
 * @param {Object} job - Job objekat
 * @param {Number} limit - Max broj providera (default 5)
 * @returns {Array} - Lista provider profila
 */
async function findTopProviders(job, limit = 5) {
  console.log(`🔍 Tražim top ${limit} providera za job: ${job.title}`)
  
  // Dohvati kategoriju
  const category = await prisma.category.findUnique({
    where: { id: job.categoryId }
  })
  
  // Pronađi sve providere s tom kategorijom
  let providers = await prisma.providerProfile.findMany({
    where: {
      categories: {
        some: { id: job.categoryId }
      },
      isAvailable: true,
      user: {
        city: job.city // Ista lokacija
      }
    },
    include: {
      user: true,
      licenses: {
        where: {
          isVerified: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      }
    }
  })
  
  console.log(`   Pronađeno ${providers.length} potencijalnih providera`)
  
  // Ako kategorija zahtijeva licencu, filtriraj samo one s validnom licencom
  if (category.requiresLicense) {
    providers = providers.filter(p => 
      p.licenses.some(l => 
        l.licenseType === category.licenseType
      )
    )
    console.log(`   Nakon filtriranja po licencama: ${providers.length}`)
  }
  
  // Sortiraj po ocjeni i broju recenzija
  providers.sort((a, b) => {
    // Prvo po ocjeni
    if (b.ratingAvg !== a.ratingAvg) {
      return b.ratingAvg - a.ratingAvg
    }
    // Zatim po broju ocjena (više ocjena = pouzdaniji)
    return b.ratingCount - a.ratingCount
  })
  
  const topProviders = providers.slice(0, limit)
  console.log(`✅ Top ${topProviders.length} providera odabrano`)
  
  return topProviders
}

/**
 * Kreira queue za job
 * @param {String} jobId - ID posla
 * @param {Array} providers - Lista providera
 * @returns {Array} - Kreirane queue stavke
 */
async function createLeadQueue(jobId, providers) {
  console.log(`📋 Kreiram queue za job ${jobId}`)
  
  const queueItems = []
  
  for (let i = 0; i < providers.length; i++) {
    const queueItem = await prisma.leadQueue.create({
      data: {
        jobId,
        providerId: providers[i].userId,
        position: i + 1,
        status: i === 0 ? 'OFFERED' : 'WAITING',
        offeredAt: i === 0 ? new Date() : null,
        expiresAt: i === 0 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null // 24h
      }
    })
    
    queueItems.push(queueItem)
    console.log(`   Pozicija ${i + 1}: ${providers[i].user.fullName} (${providers[i].user.email})`)
  }
  
  // Pošalji notifikaciju prvom provideru
  if (queueItems.length > 0) {
    await sendLeadOfferNotification(queueItems[0])
  }
  
  return queueItems
}

/**
 * Ponudi lead sljedećem provideru u queueu
 * @param {String} jobId - ID posla
 */
async function offerToNextInQueue(jobId) {
  console.log(`➡️ Tražim sljedećeg providera u queueu za job ${jobId}`)
  
  // Pronađi sljedećeg u queueu koji čeka
  const nextInQueue = await prisma.leadQueue.findFirst({
    where: { 
      jobId,
      status: 'WAITING'
    },
    orderBy: { position: 'asc' }
  })
  
  if (!nextInQueue) {
    console.log('   ⚠️ Nema više providera u queueu')
    
    // Provjeri koliko ih je ukupno odbilo
    const declinedCount = await prisma.leadQueue.count({
      where: {
        jobId,
        status: { in: ['DECLINED', 'EXPIRED'] }
      }
    })
    
    if (declinedCount >= 3) {
      console.log('   🚨 3+ providera odbilo - označavam job kao problematičan')
      await prisma.job.update({
        where: { id: jobId },
        data: { 
          leadStatus: 'EXPIRED',
          qualityScore: 0
        }
      })
      // Obavijesti klijenta
      await notifyClientAboutProblematicJob(jobId)
    }
    
    return null
  }
  
  // Ažuriraj status
  await prisma.leadQueue.update({
    where: { id: nextInQueue.id },
    data: {
      status: 'OFFERED',
      offeredAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    }
  })
  
  console.log(`   ✅ Lead ponuđen provideru na poziciji ${nextInQueue.position}`)
  
  // Pošalji notifikaciju
  await sendLeadOfferNotification(nextInQueue)
  
  return nextInQueue
}

/**
 * Provider odgovara na ponudu
 * @param {String} queueId - ID queue stavke
 * @param {String} response - 'INTERESTED' | 'NOT_INTERESTED'
 * @param {String} userId - ID providera koji odgovara
 */
async function respondToLeadOffer(queueId, response, userId) {
  const queueItem = await prisma.leadQueue.findUnique({
    where: { id: queueId },
    include: { job: true }
  })
  
  if (!queueItem) {
    throw new Error('Queue item ne postoji')
  }
  
  if (queueItem.providerId !== userId) {
    throw new Error('Unauthorized - ovo nije vaš lead')
  }
  
  if (queueItem.status !== 'OFFERED') {
    throw new Error('Lead više nije dostupan')
  }
  
  console.log(`💬 Provider ${userId} odgovorio: ${response}`)
  
  if (response === 'INTERESTED') {
    // Provider želi kupiti lead
    const leadPrice = queueItem.job.leadPrice
    
    // Provjeri ima li dovoljno kredita
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })
    
    if (!subscription || subscription.creditsBalance < leadPrice) {
      throw new Error('Nemate dovoljno kredita')
    }
    
    // Počni transakciju
    return await prisma.$transaction(async (tx) => {
      // Oduzmi kredite
      await tx.subscription.update({
        where: { userId },
        data: {
          creditsBalance: { decrement: leadPrice },
          lifetimeCreditsUsed: { increment: leadPrice }
        }
      })
      
      // Kreiraj credit transaction
      await tx.creditTransaction.create({
        data: {
          userId,
          type: 'LEAD_PURCHASE',
          amount: -leadPrice,
          balance: subscription.creditsBalance - leadPrice,
          description: `Kupovina ekskluzivnog leada: ${queueItem.job.title}`,
          relatedJobId: queueItem.jobId
        }
      })
      
      // Kreiraj lead purchase
      const leadPurchase = await tx.leadPurchase.create({
        data: {
          jobId: queueItem.jobId,
          providerId: userId,
          creditsSpent: leadPrice,
          leadPrice: leadPrice,
          status: 'ACTIVE'
        }
      })
      
      // Ažuriraj job
      await tx.job.update({
        where: { id: queueItem.jobId },
        data: {
          leadStatus: 'ASSIGNED',
          assignedProviderId: userId
        }
      })
      
      // Ažuriraj queue status
      await tx.leadQueue.update({
        where: { id: queueId },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
          response: 'INTERESTED'
        }
      })
      
      // Poništi sve ostale u queueu
      await tx.leadQueue.updateMany({
        where: {
          jobId: queueItem.jobId,
          id: { not: queueId }
        },
        data: { status: 'SKIPPED' }
      })
      
      console.log(`✅ Lead uspješno kupljen za ${leadPrice} kredita`)
      
      return leadPurchase
    })
  } else {
    // Provider odbija lead
    await prisma.leadQueue.update({
      where: { id: queueId },
      data: {
        status: 'DECLINED',
        respondedAt: new Date(),
        response: 'NOT_INTERESTED'
      }
    })
    
    console.log(`❌ Provider odbio lead`)
    
    // Ponudi sljedećem u queueu
    await offerToNextInQueue(queueItem.jobId)
  }
}

/**
 * Cron job - provjerava istekle ponude
 * Pokreće se svaki sat
 */
async function checkExpiredOffers() {
  console.log('⏰ Provjeravam istekle ponude...')
  
  const expiredOffers = await prisma.leadQueue.findMany({
    where: {
      status: 'OFFERED',
      expiresAt: { lt: new Date() }
    }
  })
  
  console.log(`   Pronađeno ${expiredOffers.length} isteklih ponuda`)
  
  for (const offer of expiredOffers) {
    console.log(`   Istekao offer za job ${offer.jobId}, pozicija ${offer.position}`)
    
    // Označi kao expired
    await prisma.leadQueue.update({
      where: { id: offer.id },
      data: {
        status: 'EXPIRED',
        response: 'NO_RESPONSE'
      }
    })
    
    // Ponudi sljedećem
    await offerToNextInQueue(offer.jobId)
  }
  
  console.log('✅ Provjera isteklih ponuda završena')
}

/**
 * Šalje notifikaciju provideru o ponuđenom leadu
 */
async function sendLeadOfferNotification(queueItem) {
  const job = await prisma.job.findUnique({
    where: { id: queueItem.jobId },
    include: { 
      user: true,
      category: true
    }
  })
  
  const provider = await prisma.user.findUnique({
    where: { id: queueItem.providerId }
  })
  
  // Kreiraj notifikaciju u bazi
  await prisma.notification.create({
    data: {
      userId: provider.id,
      type: 'NEW_JOB',
      title: '🎯 Novi ekskluzivni lead dostupan!',
      message: `${job.category.name}: ${job.title} u ${job.city}. Cijena: ${job.leadPrice} kredita. Imate 24h da odgovorite.`,
      jobId: job.id
    }
  })
  
  // TODO: Pošalji email
  // TODO: Pošalji push notifikaciju
  // TODO: SMS za urgentne poslove
  
  console.log(`📧 Notifikacija poslana provideru ${provider.email}`)
}

/**
 * Obavještava klijenta da je job problematičan
 */
async function notifyClientAboutProblematicJob(jobId) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { 
      user: true,
      category: true
    }
  })
  
  await prisma.notification.create({
    data: {
      userId: job.userId,
      type: 'SYSTEM',
      title: '⚠️ Vaš oglas zahtijeva reviziju',
      message: `Više providera nije zainteresirano za vaš oglas "${job.title}". Možda trebate revidirati opis, cijenu ili lokaciju.`,
      jobId: job.id
    }
  })
  
  console.log(`📧 Klijent ${job.user.email} obaviješten o problematičnom jobu`)
}

module.exports = {
  findTopProviders,
  createLeadQueue,
  offerToNextInQueue,
  respondToLeadOffer,
  checkExpiredOffers,
  sendLeadOfferNotification,
  notifyClientAboutProblematicJob
}

