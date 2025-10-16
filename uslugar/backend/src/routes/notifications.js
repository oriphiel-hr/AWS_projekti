import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// Get user notifications
r.get('/', auth(true), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId: req.user.id,
      ...(unreadOnly === 'true' ? { isRead: false } : {})
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          job: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      }),
      prisma.notification.count({ where })
    ]);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (e) { next(e); }
});

// Mark notification as read
r.put('/:id/read', auth(true), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const notification = await prisma.notification.updateMany({
      where: {
        id,
        userId: req.user.id
      },
      data: { isRead: true }
    });

    if (notification.count === 0) {
      return res.status(404).json({ error: 'Notifikacija nije pronađena' });
    }

    res.json({ success: true });
  } catch (e) { next(e); }
});

// Mark all notifications as read
r.put('/read-all', auth(true), async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ success: true });
  } catch (e) { next(e); }
});

// Delete notification
r.delete('/:id', auth(true), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const notification = await prisma.notification.deleteMany({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (notification.count === 0) {
      return res.status(404).json({ error: 'Notifikacija nije pronađena' });
    }

    res.json({ success: true });
  } catch (e) { next(e); }
});

// Get notification count
r.get('/count', auth(true), async (req, res, next) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    res.json({ count });
  } catch (e) { next(e); }
});

export default r;
