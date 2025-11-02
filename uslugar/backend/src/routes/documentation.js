import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const r = Router();

// GET /api/documentation - Dohvati sve kategorije i feature opise
r.get('/', async (req, res, next) => {
  try {
    // Provjeri da li tablice postoje - ako ne, vrati prazan array
    let categories;
    try {
      categories = await prisma.documentationCategory.findMany({
        where: {
          isActive: true
        },
        include: {
          features: {
            where: {
              deprecated: false
            },
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      });
    } catch (error) {
      // Ako tablice ne postoje (npr. migracije nisu primijenjene), vrati prazan odgovor
      if (error.message.includes('does not exist') || error.message.includes('Unknown table')) {
        console.warn('⚠️  DocumentationCategory table does not exist - migrations may not be applied');
        return res.json({
          features: [],
          featureDescriptions: {}
        });
      }
      throw error; // Re-throw other errors
    }

    // Transformiraj podatke u format koji komponenta očekuje
    const features = categories.map(cat => ({
      category: cat.name,
      items: cat.features.map(f => ({
        name: f.name,
        implemented: f.implemented,
        deprecated: f.deprecated
      }))
    }));

    // Kreiraj featureDescriptions objekt
    const featureDescriptions = {};
    categories.forEach(cat => {
      cat.features.forEach(f => {
        if (f.summary || f.details) {
          featureDescriptions[f.name] = {
            implemented: f.implemented,
            summary: f.summary || '',
            details: f.details || ''
          };
        }
      });
    });

    res.json({
      features,
      featureDescriptions
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/documentation/stats - Statistike implementacije
r.get('/stats', async (req, res, next) => {
  try {
    const categories = await prisma.documentationCategory.findMany({
      where: {
        isActive: true
      },
      include: {
        features: {
          where: {
            deprecated: false
          }
        }
      }
    });

    let totalItems = 0;
    let implementedItems = 0;

    categories.forEach(cat => {
      cat.features.forEach(f => {
        totalItems++;
        if (f.implemented) {
          implementedItems++;
        }
      });
    });

    const percentage = totalItems > 0 ? Math.round((implementedItems / totalItems) * 100) : 0;

    res.json({
      totalItems,
      implementedItems,
      percentage
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/documentation/migrate - Migriraj hardkodirane podatke u bazu (admin only)
// Koristi se jednom za migraciju postojećih podataka
r.post('/migrate', async (req, res, next) => {
  try {
    const { features, featureDescriptions } = req.body;

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ error: 'Features array is required' });
    }

    let categoriesCreated = 0;
    let featuresCreated = 0;
    let featuresUpdated = 0;

    for (let catIndex = 0; catIndex < features.length; catIndex++) {
      const categoryData = features[catIndex];
      
      // Kreiraj ili ažuriraj kategoriju
      const category = await prisma.documentationCategory.upsert({
        where: { name: categoryData.category },
        update: {
          order: catIndex,
          isActive: true
        },
        create: {
          name: categoryData.category,
          order: catIndex,
          isActive: true
        }
      });

      if (category) categoriesCreated++;

      // Kreiraj ili ažuriraj feature opise
      if (categoryData.items && Array.isArray(categoryData.items)) {
        for (let itemIndex = 0; itemIndex < categoryData.items.length; itemIndex++) {
          const item = categoryData.items[itemIndex];
          const description = featureDescriptions?.[item.name];

          const featureData = {
            categoryId: category.id,
            name: item.name,
            implemented: item.implemented !== undefined ? item.implemented : true,
            deprecated: item.deprecated || false,
            order: itemIndex,
            summary: description?.summary || null,
            details: description?.details || null
          };

          const existing = await prisma.documentationFeature.findFirst({
            where: {
              categoryId: category.id,
              name: item.name
            }
          });

          if (existing) {
            await prisma.documentationFeature.update({
              where: { id: existing.id },
              data: featureData
            });
            featuresUpdated++;
          } else {
            await prisma.documentationFeature.create({
              data: featureData
            });
            featuresCreated++;
          }
        }
      }
    }

    res.json({
      message: 'Migration completed successfully',
      categoriesCreated,
      featuresCreated,
      featuresUpdated
    });
  } catch (e) {
    next(e);
  }
});

export default r;

