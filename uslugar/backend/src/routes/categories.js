import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const r = Router();

// list all categories (public)
r.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '1000', 10), 1000);
    const categories = await prisma.category.findMany({
      take: limit,
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (e) { next(e); }
});

// get single category
r.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (e) { next(e); }
});

export default r;
