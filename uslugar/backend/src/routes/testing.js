import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// ===== Test Plans =====
r.get('/plans', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const plans = await prisma.testPlan.findMany({
      include: { items: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(plans);
  } catch (e) { next(e); }
});

r.post('/plans', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { name, description, category, items = [] } = req.body || {};
    const plan = await prisma.testPlan.create({
      data: {
        name, description, category,
        items: {
          create: items.map((it, idx) => ({
            title: it.title,
            description: it.description,
            expectedResult: it.expectedResult,
            dataVariations: it.dataVariations ?? null,
            order: it.order ?? idx
          }))
        }
      },
      include: { items: true }
    });
    res.status(201).json(plan);
  } catch (e) { next(e); }
});

r.put('/plans/:planId', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { name, description, category, items } = req.body || {};

    const updates = { name, description, category };
    // Basic update for plan fields
    const updated = await prisma.testPlan.update({
      where: { id: planId },
      data: updates
    });

    // Optional items full replace if provided
    if (Array.isArray(items)) {
      // Delete existing, recreate (simpler sync)
      await prisma.testItem.deleteMany({ where: { planId } });
      await prisma.testItem.createMany({
        data: items.map((it, idx) => ({
          id: undefined,
          planId,
          title: it.title,
          description: it.description ?? null,
          expectedResult: it.expectedResult ?? null,
          dataVariations: it.dataVariations ?? null,
          order: it.order ?? idx
        }))
      });
    }

    const full = await prisma.testPlan.findUnique({
      where: { id: planId },
      include: { items: { orderBy: { order: 'asc' } } }
    });
    res.json(full);
  } catch (e) { next(e); }
});

r.delete('/plans/:planId', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { planId } = req.params;
    await prisma.testPlan.delete({ where: { id: planId } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ===== Test Runs =====
r.get('/runs', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const runs = await prisma.testRun.findMany({
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(runs);
  } catch (e) { next(e); }
});

r.get('/runs/:runId', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { runId } = req.params;
    const run = await prisma.testRun.findUnique({
      where: { id: runId },
      include: {
        plan: { include: { items: { orderBy: { order: 'asc' } } } },
        items: { include: { item: true } }
      }
    });
    if (!run) return res.status(404).json({ error: 'Not found' });
    res.json(run);
  } catch (e) { next(e); }
});

r.post('/runs', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const user = req.user;
    const { planId, name, notes } = req.body || {};
    const plan = await prisma.testPlan.findUnique({ where: { id: planId }, include: { items: true } });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const run = await prisma.testRun.create({
      data: {
        planId,
        name: name || `${plan.name} - run` ,
        createdById: user?.id || null,
        status: 'IN_PROGRESS',
        notes: notes ?? null,
        items: {
          create: plan.items
            .sort((a,b) => (a.order ?? 0) - (b.order ?? 0))
            .map(it => ({ itemId: it.id, status: 'PENDING', screenshots: [] }))
        }
      },
      include: { items: true }
    });
    res.status(201).json(run);
  } catch (e) { next(e); }
});

r.patch('/runs/:runId', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { runId } = req.params;
    const { status, notes, name } = req.body || {};
    const updated = await prisma.testRun.update({
      where: { id: runId },
      data: {
        status: status ?? undefined,
        notes: notes ?? undefined,
        name: name ?? undefined
      }
    });
    res.json(updated);
  } catch (e) { next(e); }
});

// Update a specific run item (status/comment/screenshots)
r.patch('/runs/:runId/items/:itemId', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { runId, itemId } = req.params;
    const { status, comment, addScreenshots = [], removeScreenshots = [] } = req.body || {};

    // Find run item
    const runItem = await prisma.testRunItem.findUnique({
      where: { runId_itemId: { runId, itemId } }
    }).catch(() => null);

    if (!runItem) {
      return res.status(404).json({ error: 'Run item not found' });
    }

    // Prepare screenshots
    let screenshots = runItem.screenshots || [];
    if (Array.isArray(addScreenshots) && addScreenshots.length) {
      screenshots = screenshots.concat(addScreenshots);
    }
    if (Array.isArray(removeScreenshots) && removeScreenshots.length) {
      screenshots = screenshots.filter(u => !removeScreenshots.includes(u));
    }

    const updated = await prisma.testRunItem.update({
      where: { id: runItem.id },
      data: {
        status: status ?? undefined,
        comment: comment ?? undefined,
        screenshots
      }
    });
    res.json(updated);
  } catch (e) { next(e); }
});

export default r;
// Seed a default plan (idempotent)
r.post('/plans/seed-default', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const exists = await prisma.testPlan.findFirst({ where: { name: 'Core korisničko testiranje' } })
    if (exists) return res.json({ ok: true, seeded: false, planId: exists.id })

    const plan = await prisma.testPlan.create({
      data: {
        name: 'Core korisničko testiranje',
        description: 'Registracija, login, objava posla, validacija OIB-a',
        category: 'Korisnik',
        items: {
          create: [
            { order: 1, title: 'Registracija korisnika usluge', description: 'Ispravni podaci', expectedResult: 'Uspješna registracija', dataVariations: { examples: ['ispravan email', 'jaka lozinka'] } },
            { order: 2, title: 'Prijava', description: 'Login s registriranim računom', expectedResult: 'Uspješna prijava' },
            { order: 3, title: 'Validacija OIB-a', description: 'Unos OIB-a u profil', expectedResult: 'Ispravan OIB prolazi, neispravan javlja grešku', dataVariations: { examples: ['ispravan OIB', 'neispravan OIB'] } },
            { order: 4, title: 'Objava posla', description: 'Kreiranje job-a sa slikama', expectedResult: 'Posao vidljiv u listi', dataVariations: { examples: ['bez slike', 's više slika'] } }
          ]
        }
      },
      include: { items: true }
    })
    res.json({ ok: true, seeded: true, plan })
  } catch (e) { next(e) }
})

