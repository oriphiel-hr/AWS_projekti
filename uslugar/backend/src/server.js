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

// .env samo izvan produkcije
if (process.env.NODE_ENV !== 'production') {
  try {
    const { config } = await import('dotenv')
    config()
  } catch {
    console.warn('dotenv nije instaliran – preskačem lokalno .env')
  }
}

const app = express()
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

// graceful shutdown (Prisma + Socket.io) + start
const server = httpServer.listen(PORT, () => {
  console.log(`[OK] API listening on :${PORT}`)
  console.log(`[OK] Socket.io ready for real-time chat`)
  console.log(`[OK] USLUGAR EXCLUSIVE features: Exclusive Leads, Credits, ROI Dashboard, AI Scoring`)
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
