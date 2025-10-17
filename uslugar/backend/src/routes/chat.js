import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// Get user's chat rooms
r.get('/rooms', auth(true), async (req, res, next) => {
  try {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: { id: req.user.id }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, fullName: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(rooms);
  } catch (e) {
    next(e);
  }
});

// Create or get chat room for a job
r.post('/rooms', auth(true), async (req, res, next) => {
  try {
    const { jobId, participantId } = req.body;

    if (!jobId || !participantId) {
      return res.status(400).json({ error: 'Missing jobId or participantId' });
    }

    // Check if room already exists
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        jobId,
        participants: {
          every: {
            id: { in: [req.user.id, participantId] }
          }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (existingRoom) {
      return res.json(existingRoom);
    }

    // Create new room
    const room = await prisma.chatRoom.create({
      data: {
        jobId,
        participants: {
          connect: [
            { id: req.user.id },
            { id: participantId }
          ]
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json(room);
  } catch (e) {
    next(e);
  }
});

// Get messages for a room
r.get('/rooms/:roomId/messages', auth(true), async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Verify user has access to this room
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: { id: req.user.id }
        }
      }
    });

    if (!room) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json(messages.reverse());
  } catch (e) {
    next(e);
  }
});

// Delete chat room (only for participants)
r.delete('/rooms/:roomId', auth(true), async (req, res, next) => {
  try {
    const { roomId } = req.params;

    // Verify user has access to this room
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: { id: req.user.id }
        }
      }
    });

    if (!room) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete all messages first
    await prisma.chatMessage.deleteMany({ where: { roomId } });

    // Delete room
    await prisma.chatRoom.delete({ where: { id: roomId } });

    res.json({ message: 'Chat room deleted successfully' });
  } catch (e) {
    next(e);
  }
});

export default r;

