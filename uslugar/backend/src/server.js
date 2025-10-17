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

// ✅ health
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
app.use('/api/upload', uploadRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/subscriptions', subscriptionsRouter)

// basic error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

// Create HTTP server and initialize Socket.io
const httpServer = createServer(app)
const io = initSocket(httpServer)

// graceful shutdown (Prisma + Socket.io) + start
const server = httpServer.listen(PORT, () => {
  console.log(`✅ API listening on :${PORT}`)
  console.log(`✅ Socket.io ready for real-time chat`)
  console.log(`✅ New features enabled: Upload, Notifications, Chat, Subscriptions, Geolocation`)
  console.log(`✅ Routes registered: /api/jobs, /api/categories, /api/admin, /api/users`)
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
