import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// create offer
r.post('/', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { jobId, amount, message } = req.body;
    if (!jobId || !amount) return res.status(400).json({ error: 'Missing fields' });
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== 'OPEN') return res.status(400).json({ error: 'Job is not open' });
    const offer = await prisma.offer.create({ data: { jobId, amount, message: message || '', userId: req.user.id } });
    res.status(201).json(offer);
  } catch (e) { next(e); }
});

// list offers for a job (owner or provider self)
r.get('/job/:jobId', auth(true), async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const offers = await prisma.offer.findMany({ where: { jobId }, include: { user: true } });
    res.json(offers);
  } catch (e) { next(e); }
});

export default r;