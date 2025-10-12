// src/server.js  (ESM)

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';
import offersRouter from './routes/offers.js';
import providersRouter from './routes/providers.js';
import reviewsRouter from './routes/reviews.js';
import adminRouter from './routes/admin.js';

// .env samo izvan produkcije
if (process.env.NODE_ENV !== 'production') {
  try {
    const { config } = await import('dotenv');
    config();
  } catch {
    console.warn('dotenv nije instaliran – preskačem lokalno .env');
  }
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ health: i stari i novi put
app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('/api/health', (_req, res) =>
  res.status(200).json({ ok: true, ts: new Date().toISOString() })
);

// API mount
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/offers', offersRouter);
app.use('/api/providers', providersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin', adminRouter);

// basic error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// graceful shutdown (Prisma)
const server = app.listen(PORT, () => {
  console.log(`✅ API listening on :${PORT}`);
});
const shutdown = async () => {
  try { await prisma.$disconnect(); } finally { server.close(() => process.exit(0)); }
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
