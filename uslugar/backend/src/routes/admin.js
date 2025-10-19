// src/routes/admin.js
import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

// Dozvoljeni modeli (prema Prisma schemi)
const ALLOWED_MODELS = [
  'User',
  'ProviderProfile',
  'Category',
  'Job',
  'Offer',
  'Review',
  'Notification',
  'ChatRoom',
  'ChatMessage',
  'Subscription'
];

/**
 * Vrati Prisma delegata npr. prisma.user, prisma.job ...
 */
function getDelegate(model) {
  if (!ALLOWED_MODELS.includes(model)) throw new Error('Model not allowed');
  // Prisma delegati su lowerCamelCase
  const key = model[0].toLowerCase() + model.slice(1);
  const delegate = prisma[key];
  if (!delegate) throw new Error('Prisma delegate not found for ' + model);
  return delegate;
}

const r = Router();

// Svi admin CRUD endpointi zahtijevaju ADMIN rolu
r.use(auth(true, ['ADMIN']));

// LIST with optional paging & filters
r.get('/:model', async (req, res, next) => {
  try {
    const { model } = req.params;
    const delegate = getDelegate(model);
    const take = Math.min(parseInt(req.query.take || '25', 10), 100);
    const skip = parseInt(req.query.skip || '0', 10);
    const where = req.query.where ? JSON.parse(req.query.where) : {};
    const include = req.query.include ? JSON.parse(req.query.include) : undefined;

    const [items, total] = await Promise.all([
      delegate.findMany({ skip, take, where, include }),
      delegate.count({ where })
    ]);
    res.json({ items, total, skip, take });
  } catch (e) { next(e); }
});

// READ by id
r.get('/:model/:id', async (req, res, next) => {
  try {
    const { model, id } = req.params;
    const delegate = getDelegate(model);
    const include = req.query.include ? JSON.parse(req.query.include) : undefined;
    const item = await delegate.findUnique({ where: { id }, include });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// CREATE
r.post('/:model', async (req, res, next) => {
  try {
    const { model } = req.params;
    const delegate = getDelegate(model);
    const data = req.body || {};
    const created = await delegate.create({ data });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// UPDATE (by id)
r.put('/:model/:id', async (req, res, next) => {
  try {
    const { model, id } = req.params;
    const delegate = getDelegate(model);
    const data = req.body || {};
    const updated = await delegate.update({ where: { id }, data });
    res.json(updated);
  } catch (e) { next(e); }
});

// DELETE (by id)
r.delete('/:model/:id', async (req, res, next) => {
  try {
    const { model, id } = req.params;
    const delegate = getDelegate(model);
    await delegate.delete({ where: { id } });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default r;
