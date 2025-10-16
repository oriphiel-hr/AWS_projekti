import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const r = Router();

// List all categories
r.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (e) { next(e); }
});

// Get category by ID
r.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        _count: {
          select: {
            jobs: true,
            providers: true
          }
        }
      }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Kategorija nije pronađena' });
    }
    
    res.json(category);
  } catch (e) { next(e); }
});

// Create category (admin only)
r.post('/', async (req, res, next) => {
  try {
    const { name, description, parentId } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Naziv kategorije je obavezan' });
    }
    
    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        parentId: parentId || null
      }
    });
    
    res.status(201).json(category);
  } catch (e) { 
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Kategorija s tim nazivom već postoji' });
    }
    next(e); 
  }
});

// Update category (admin only)
r.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, parentId, isActive } = req.body;
    
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        parentId: parentId || undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });
    
    res.json(category);
  } catch (e) { next(e); }
});

// Delete category (admin only)
r.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Provjeri ima li kategorija djecu ili povezane poslove/pružatelje
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        jobs: true,
        providers: true
      }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Kategorija nije pronađena' });
    }
    
    if (category.children.length > 0) {
      return res.status(400).json({ error: 'Ne možete obrisati kategoriju koja ima podkategorije' });
    }
    
    if (category.jobs.length > 0 || category.providers.length > 0) {
      return res.status(400).json({ error: 'Ne možete obrisati kategoriju koja se koristi' });
    }
    
    await prisma.category.delete({
      where: { id }
    });
    
    res.json({ message: 'Kategorija uspješno obrisana' });
  } catch (e) { next(e); }
});

export default r;
