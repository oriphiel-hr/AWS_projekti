import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';
import offersRouter from './routes/offers.js';
import providersRouter from './routes/providers.js';
import reviewsRouter from './routes/reviews.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req,res)=>res.json({ ok:true, ts:new Date().toISOString() }));
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/offers', offersRouter);
app.use('/api/providers', providersRouter);
app.use('/api/reviews', reviewsRouter);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`API listening on :${PORT}`));