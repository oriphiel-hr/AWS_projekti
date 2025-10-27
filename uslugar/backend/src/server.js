// src/server.js  (ESM)

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { PrismaClient } from '@prisma/client'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'
import offersRouter from './routes/offers.js'
import providersRouter from './routes/providers.js'
import reviewsRouter from './routes/reviews.js'
import adminRouter from './routes/admin.js'
import uploadRouter from './routes/upload.js'
import notificationsRouter from './routes/notifications.js'
import chatRouter from './routes/chat.js'
import subscriptionsRouter from './routes/subscriptions.js'
import { initSocket } from './lib/socket.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import usersRouter from './routes/users.js'
import categoriesRouter from './routes/categories.js'
import legalStatusesRouter from './routes/legal-statuses.js'
// USLUGAR EXCLUSIVE routes
import exclusiveLeadsRouter from './routes/exclusive-leads.js'
import providerROIRouter from './routes/provider-roi.js'
import clientVerificationRouter from './routes/client-verification.js'
import leadQueueRouter from './routes/lead-queue.js'
import supportRouter from './routes/support.js'
import whitelabelRouter from './routes/whitelabel.js'
import paymentsRouter from './routes/payments.js'
import kycRouter from './routes/kyc.js'
import { startQueueScheduler } from './lib/queueScheduler.js'
import { checkExpiringSubscriptions } from './lib/subscription-reminder.js'

// .env samo izvan produkcije
if (process.env.NODE_ENV !== 'production') {
  try {
    const { config } = await import('dotenv')
    config()
  } catch {
    console.warn('dotenv nije instaliran – preskačem lokalno .env')
  }
}

// Configure body parser for webhooks (before json)
const app = express()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' })) // Stripe webhook needs raw body

const prisma = new PrismaClient()
const PORT = process.env.PORT || 4000

// Auto-seed Legal Statuses if missing
async function ensureLegalStatuses() {
  try {
    const count = await prisma.legalStatus.count();
    if (count >= 6) {
      console.log('✅ Legal statuses already exist:', count);
      return;
    }
    
    console.log('🌱 Initializing legal statuses...');
    const statuses = [
      {id:'cls1_individual',code:'INDIVIDUAL',name:'Fizička osoba',description:'Privatna osoba bez registrirane djelatnosti',isActive:true},
      {id:'cls2_sole_trader',code:'SOLE_TRADER',name:'Obrtnik',description:'Registrirani obrt - fizička osoba s OIB-om',isActive:true},
      {id:'cls3_pausal',code:'PAUSAL',name:'Paušalni obrt',description:'Obrt s paušalnim oporezivanjem',isActive:true},
      {id:'cls4_doo',code:'DOO',name:'d.o.o.',description:'Društvo s ograničenom odgovornošću',isActive:true},
      {id:'cls5_jdoo',code:'JDOO',name:'j.d.o.o.',description:'Jednostavno društvo s ograničenom odgovornošću',isActive:true},
      {id:'cls6_freelancer',code:'FREELANCER',name:'Samostalni djelatnik',description:'Freelancer s paušalnim oporezivanjem',isActive:true}
    ];
    
    for (const s of statuses) {
      await prisma.legalStatus.upsert({
        where: { id: s.id },
        update: s,
        create: s
      });
    }
    console.log('✅ Legal statuses initialized successfully!');
  } catch (error) {
    console.error('⚠️  Failed to initialize legal statuses:', error.message);
  }
}

// Debug: Log SMTP configuration status
console.log('[DEBUG] Environment check:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  SMTP_HOST:', process.env.SMTP_HOST ? 'SET' : 'NOT SET');
console.log('  SMTP_USER:', process.env.SMTP_USER ? 'SET (' + process.env.SMTP_USER + ')' : 'NOT SET');
console.log('  SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');

// === UNIVERZALNI CORS – STAVLJENO ODMAH NAKON create app ===================
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://uslugar.oriph.io')
  .split(',').map(s => s.trim())

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // res.setHeader('Access-Control-Allow-Credentials', 'true') // uključi samo ako koristiš cookies

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204) // preflight završi odmah
  }
  next()
})
// ===========================================================================

// (opcionalno) dodatni CORS sloj preko paketa – neće smetati
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true)                     // server-to-server/no-origin
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
}))
app.options('*', cors())
app.options('/api/*', (req, res) => {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res.sendStatus(204)
})

// ostali middlewares
app.use(express.json())
app.use(morgan('dev'))

// Health check endpoints
app.get('/health', (_req, res) => res.status(200).send('ok'))
app.get('/api/health', (_req, res) =>
  res.status(200).json({ ok: true, ts: new Date().toISOString() })
)

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Dodaj nedostajuće kategorije - javni endpoint
app.post('/api/add-categories', async (req, res) => {
  try {
    console.log('🌱 Dodavanje nedostajućih kategorija...');
    
    const missingCategories = [
      { name: 'Građevina', description: 'Opći građevinski radovi, renovacije, adaptacije', icon: '🏗️', nkdCode: '41.20', requiresLicense: true, licenseType: 'Građevinska licenca', licenseAuthority: 'Hrvatska komora inženjera građevinarstva' },
      { name: 'Građevinski nadzor', description: 'Nadzor nad izvođenjem građevinskih radova', icon: '👷', nkdCode: '71.12', requiresLicense: true, licenseType: 'Licenca građevinskog nadzora', licenseAuthority: 'Hrvatska komora inženjera građevinarstva' },
      { name: 'Geodetske usluge', description: 'Mjerenja, izrada geodetskih elaborata', icon: '📐', nkdCode: '71.12', requiresLicense: true, licenseType: 'Geodetska licenca', licenseAuthority: 'Hrvatska komora inženjera geodezije' },
      { name: 'Energetski certifikati', description: 'Izdavanje energetskih certifikata za zgrade', icon: '⚡', nkdCode: '71.12', requiresLicense: true, licenseType: 'Licenca energetskog certifikata', licenseAuthority: 'Hrvatska energetska agencija' },
      { name: 'Legalizacija objekata', description: 'Pomoć pri legalizaciji bespravno sagrađenih objekata', icon: '📋', nkdCode: '71.12', requiresLicense: false },
      { name: 'Dizajn interijera', description: 'Uređenje i dizajn unutarnjih prostora', icon: '🎨', nkdCode: '74.10', requiresLicense: false },
      { name: 'Arhitektonske usluge', description: 'Projektiranje, izrada arhitektonskih planova', icon: '🏛️', nkdCode: '71.11', requiresLicense: true, licenseType: 'Arhitektonska licenca', licenseAuthority: 'Hrvatska komora arhitekata' },
      { name: 'Landscape dizajn', description: 'Uređenje vanjskih prostora, vrtovi', icon: '🌳', nkdCode: '71.12', requiresLicense: false },
      { name: 'Solarni sustavi', description: 'Ugradnja solarnih panela i sustava', icon: '☀️', nkdCode: '43.21', requiresLicense: true, licenseType: 'Elektrotehnička licenca', licenseAuthority: 'Hrvatska komora inženjera elektrotehnike' },
      { name: 'Web dizajn', description: 'Izrada i dizajn web stranica', icon: '🌐', nkdCode: '62.01', requiresLicense: false },
      { name: 'SEO usluge', description: 'Optimizacija web stranica za pretraživače', icon: '🔍', nkdCode: '62.01', requiresLicense: false },
      { name: 'Digitalni marketing', description: 'Online marketing, društvene mreže', icon: '📱', nkdCode: '73.11', requiresLicense: false },
      { name: 'E-commerce', description: 'Izrada online trgovina', icon: '🛒', nkdCode: '62.01', requiresLicense: false },
      { name: 'Fotografija', description: 'Profesionalno fotografiranje za različite potrebe', icon: '📸', nkdCode: '74.20', requiresLicense: false },
      { name: 'Drone snimanje', description: 'Zračno snimanje dronovima', icon: '🚁', nkdCode: '74.20', requiresLicense: false },
      { name: '3D vizualizacija', description: '3D modeli, renderi, vizualizacije', icon: '🎬', nkdCode: '74.20', requiresLicense: false },
      { name: 'Dostava', description: 'Dostava paketa, hrane, pošiljki', icon: '📦', nkdCode: '53.20', requiresLicense: false },
      { name: 'Prijevoz putnika', description: 'Taxi, prijevoz putnika', icon: '🚕', nkdCode: '49.32', requiresLicense: true, licenseType: 'Licenca za prijevoz putnika', licenseAuthority: 'Ministarstvo mora, prometa i infrastrukture' },
      { name: 'Čišćenje kućanstva', description: 'Čišćenje domova, stanova', icon: '🏠', nkdCode: '81.21', requiresLicense: false },
      { name: 'Čišćenje ureda', description: 'Čišćenje poslovnih prostora', icon: '🏢', nkdCode: '81.21', requiresLicense: false },
      { name: 'Čišćenje nakon gradnje', description: 'Čišćenje nakon građevinskih radova', icon: '🏗️', nkdCode: '81.21', requiresLicense: false },
      { name: 'Fizioterapija', description: 'Fizioterapijske usluge, rehabilitacija', icon: '🏥', nkdCode: '86.90', requiresLicense: true, licenseType: 'Licenca fizioterapeuta', licenseAuthority: 'Hrvatska komora fizioterapeuta' },
      { name: 'Masage', description: 'Opuštajuće i terapeutske masaže', icon: '💆', nkdCode: '96.09', requiresLicense: false },
      { name: 'Kozmetika', description: 'Kozmetičke usluge, njega lica', icon: '💄', nkdCode: '96.02', requiresLicense: false },
      { name: 'Manikura/Pedikura', description: 'Njega noktiju ruku i nogu', icon: '💅', nkdCode: '96.02', requiresLicense: false },
      { name: 'Instrukcije', description: 'Poduka učenika, instrukcije', icon: '📚', nkdCode: '85.59', requiresLicense: false },
      { name: 'Jezici', description: 'Učenje stranih jezika', icon: '🗣️', nkdCode: '85.59', requiresLicense: false },
      { name: 'Muzika', description: 'Glazbena nastava, poduka', icon: '🎵', nkdCode: '85.59', requiresLicense: false },
      { name: 'Računovodstvo', description: 'Knjigovodstvo, računovodstvene usluge', icon: '📊', nkdCode: '69.20', requiresLicense: false },
      { name: 'Osiguranje', description: 'Osiguravajuće usluge', icon: '🛡️', nkdCode: '65.20', requiresLicense: true, licenseType: 'Licenca osiguravajućeg agenta', licenseAuthority: 'Hrvatska agencija za nadzor financijskih usluga' },
      { name: 'Energetska učinkovitost', description: 'Energetski pregledi, optimizacija potrošnje', icon: '🌱', nkdCode: '71.12', requiresLicense: true, licenseType: 'Licenca energetskog savjetnika', licenseAuthority: 'Hrvatska energetska agencija' },
      { name: 'Recikliranje', description: 'Usluge recikliranja, odvoz otpada', icon: '♻️', nkdCode: '38.11', requiresLicense: false },
      { name: 'Popravak kućanskih aparata', description: 'Popravak perilica, sušilica, frižidera', icon: '🔧', nkdCode: '95.21', requiresLicense: false },
      { name: 'Montaža namještaja', description: 'Montaža namještaja, sklapanje', icon: '🪑', nkdCode: '43.30', requiresLicense: false },
      { name: 'Montaža klima uređaja', description: 'Ugradnja i servis klima uređaja', icon: '❄️', nkdCode: '43.22', requiresLicense: true, licenseType: 'Licenca za klimatizaciju', licenseAuthority: 'Hrvatska komora inženjera građevinarstva' }
    ];

    let addedCount = 0;
    let updatedCount = 0;

    for (const cat of missingCategories) {
      try {
        const existing = await prisma.category.findUnique({
          where: { name: cat.name }
        });

        if (existing) {
          await prisma.category.update({
            where: { name: cat.name },
            data: {
              description: cat.description,
              icon: cat.icon,
              nkdCode: cat.nkdCode,
              requiresLicense: cat.requiresLicense,
              licenseType: cat.licenseType,
              licenseAuthority: cat.licenseAuthority,
              isActive: true
            }
          });
          updatedCount++;
          console.log(`✅ Ažurirana: ${cat.name}`);
        } else {
          await prisma.category.create({
            data: {
              name: cat.name,
              description: cat.description,
              icon: cat.icon,
              nkdCode: cat.nkdCode,
              requiresLicense: cat.requiresLicense,
              licenseType: cat.licenseType,
              licenseAuthority: cat.licenseAuthority,
              isActive: true
            }
          });
          addedCount++;
          console.log(`➕ Dodana: ${cat.name}`);
        }
      } catch (error) {
        console.error(`❌ Greška za ${cat.name}:`, error.message);
      }
    }

    console.log(`📊 REZULTAT: Dodano ${addedCount}, Ažurirano ${updatedCount}`);
    
    res.json({ 
      message: 'Kategorije uspješno dodane/ažurirane!',
      added: addedCount,
      updated: updatedCount,
      total: missingCategories.length
    });
  } catch (e) {
    console.error('❌ Greška pri dodavanju kategorija:', e);
    res.status(500).json({ error: e.message });
  }
});

// API mount
app.use('/api/auth', authRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/offers', offersRouter)
app.use('/api/providers', providersRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/legal-statuses', legalStatusesRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/subscriptions', subscriptionsRouter)
// USLUGAR EXCLUSIVE API routes
app.use('/api/exclusive/leads', exclusiveLeadsRouter)
app.use('/api/exclusive/roi', providerROIRouter)
app.use('/api/verification', clientVerificationRouter)
app.use('/api/lead-queue', leadQueueRouter)
app.use('/api/support', supportRouter)
app.use('/api/whitelabel', whitelabelRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/kyc', kycRouter)

// basic error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

// Create HTTP server and initialize Socket.io
const httpServer = createServer(app)
const io = initSocket(httpServer)

// Initialize database (seed legal statuses if missing)
await ensureLegalStatuses()

// Auto-fix: Add missing columns and enums if needed
async function ensureProjectTypeColumn() {
  try {
    // Try to query a job with projectType - if fails, column doesn't exist
    await prisma.$queryRaw`SELECT "projectType" FROM "Job" LIMIT 1`
    console.log('✅ projectType column exists')
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('🔧 Adding missing projectType and customFields columns...')
      try {
        await prisma.$executeRaw`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "projectType" TEXT`
        await prisma.$executeRaw`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "customFields" JSONB`
        console.log('✅ Columns added successfully')
      } catch (e) {
        console.error('⚠️  Failed to add columns:', e.message)
      }
    }
  }
}
await ensureProjectTypeColumn()

// Auto-fix: Ensure lifetimeLeadsConverted exists in Subscription
async function ensureLifetimeLeadsConverted() {
  try {
    await prisma.$queryRaw`SELECT "lifetimeLeadsConverted" FROM "Subscription" LIMIT 1`
    console.log('✅ lifetimeLeadsConverted column exists')
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('🔧 Adding missing lifetimeLeadsConverted column...')
      try {
        await prisma.$executeRaw`ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "lifetimeLeadsConverted" INTEGER DEFAULT 0`
        console.log('✅ Column added successfully')
      } catch (e) {
        console.error('⚠️  Failed to add column:', e.message)
      }
    }
  }
}
await ensureLifetimeLeadsConverted()

// Auto-fix: Ensure SupportTicket table exists
async function ensureSupportTicket() {
  try {
    await prisma.$queryRaw`SELECT "id" FROM "SupportTicket" LIMIT 1`
    console.log('✅ SupportTicket table exists')
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('🔧 Adding missing SupportTicket table and enums...')
      try {
        // Create enums
        await prisma.$executeRaw`DO $$ BEGIN CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`
        await prisma.$executeRaw`DO $$ BEGIN CREATE TYPE "SupportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`
        await prisma.$executeRaw`DO $$ BEGIN CREATE TYPE "SupportCategory" AS ENUM ('BILLING', 'TECHNICAL', 'REFUND', 'FEATURE_REQUEST', 'OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`
        
        // Create table
        await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "SupportTicket" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "subject" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "priority" "SupportPriority" NOT NULL DEFAULT 'NORMAL',
          "status" "SupportStatus" NOT NULL DEFAULT 'OPEN',
          "category" "SupportCategory" NOT NULL DEFAULT 'OTHER',
          "assignedTo" TEXT,
          "notes" TEXT,
          "resolvedAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
        
        console.log('✅ SupportTicket table added successfully')
      } catch (e) {
        console.error('⚠️  Failed to add SupportTicket table:', e.message)
      }
    }
  }
}
await ensureSupportTicket()

// Auto-fix: Ensure WhiteLabel table exists
async function ensureWhiteLabel() {
  try {
    await prisma.$queryRaw`SELECT "id" FROM "WhiteLabel" LIMIT 1`
    console.log('✅ WhiteLabel table exists')
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('🔧 Adding missing WhiteLabel table...')
      try {
        await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "WhiteLabel" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL UNIQUE,
          "companyName" TEXT NOT NULL,
          "logoUrl" TEXT,
          "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
          "secondaryColor" TEXT,
          "accentColor" TEXT,
          "faviconUrl" TEXT,
          "footerText" TEXT,
          "poweredByHidden" BOOLEAN NOT NULL DEFAULT false,
          "customDomain" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
        
        await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "WhiteLabel_userId_key" ON "WhiteLabel"("userId")`
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "WhiteLabel_userId_idx" ON "WhiteLabel"("userId")`
        
        // Add foreign key
        await prisma.$executeRaw`ALTER TABLE "WhiteLabel" ADD CONSTRAINT "WhiteLabel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        
        console.log('✅ WhiteLabel table added successfully')
      } catch (e) {
        console.error('⚠️  Failed to add WhiteLabel table:', e.message)
      }
    }
  }
}
await ensureWhiteLabel()

// Start Queue Scheduler (checks expired offers every hour)
startQueueScheduler()

// Start Subscription Reminder Scheduler (checks expiring subscriptions daily at 9am)
import cron from 'node-cron'
cron.schedule('0 9 * * *', async () => {
  console.log('📧 Checking expiring subscriptions...')
  await checkExpiringSubscriptions()
})

console.log('[OK] Subscription reminder scheduler active (daily at 9am)')

// graceful shutdown (Prisma + Socket.io) + start
const server = httpServer.listen(PORT, () => {
  console.log(`[OK] API listening on :${PORT}`)
  console.log(`[OK] Socket.io ready for real-time chat`)
  console.log(`[OK] USLUGAR EXCLUSIVE features: Exclusive Leads, Credits, ROI Dashboard, AI Scoring, Queue Model`)
  console.log(`[OK] Queue Scheduler: Active (checks expired leads every hour)`)
  console.log(`[OK] Subscription plans: TRIAL (2 free), BASIC (39€), PREMIUM (89€), PRO (149€)`)
  console.log(`[OK] All routes registered successfully`)
})
const shutdown = async () => {
  try { 
    io.close()
    await prisma.$disconnect() 
  } finally { 
    server.close(() => process.exit(0)) 
  }
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

