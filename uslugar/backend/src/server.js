// src/server.js  (ESM)

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { PrismaClient } from '@prisma/client'

import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'
import offersRouter from './routes/offers.js'
import providersRouter from './routes/providers.js'
import reviewsRouter from './routes/reviews.js'
import adminRouter from './routes/admin.js'

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

// --- CORS ----------------------------------------------------------
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://uslugar.oriph.io')
  .split(',')
  .map(s => s.trim())

app.use(cors({
  origin(origin, cb) {
    // dopusti server-to-server/no-origin zahtjeve (cron, health, itd.)
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
}))

// generički preflight
app.options('*', cors())

// eksplicitni preflight za /api/* (ako nešto presretne ranije)
app.options('/api/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || ALLOWED_ORIGINS[0])
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res.sendStatus(204)
})
// ------------------------------------------------------------------

// ostali middlewares
app.use(express.json())
app.use(morgan('dev'))

// ✅ health
app.get('/health', (_req, res) => res.status(200).send('ok'))
app.get('/api/health', (_req, res) =>
  res.status(200).json({ ok: true, ts: new Date().toISOString() })
)

// API mount
app.use('/api/auth', authRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/offers', offersRouter)
app.use('/api/providers', providersRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/admin', adminRouter)

// basic error handler (jedan jedini!)
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

// graceful shutdown (Prisma) + start
const server = app.listen(PORT, () => {
  console.log(`✅ API listening on :${PORT}`)
})
const shutdown = async () => {
  try { await prisma.$disconnect() } finally { server.close(() => process.exit(0)) }
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
