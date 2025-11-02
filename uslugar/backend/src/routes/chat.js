import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { upload, getImageUrl } from '../lib/upload.js';

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

    // Get job and verify status
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        offers: {
          where: { status: 'ACCEPTED' },
          include: {
            user: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if job has accepted offer
    const acceptedOffer = job.offers[0];
    if (!acceptedOffer) {
      return res.status(403).json({ 
        error: 'Chat is only available after a provider accepts the job' 
      });
    }

    // Verify that the participants are the job owner and the accepted provider
    const isJobOwner = req.user.id === job.userId;
    const isAcceptedProvider = req.user.id === acceptedOffer.userId;
    
    if (!isJobOwner && !isAcceptedProvider) {
      return res.status(403).json({ 
        error: 'Only the job owner and accepted provider can chat' 
      });
    }

    // Verify participantId matches
    const expectedOtherParticipant = isJobOwner ? acceptedOffer.userId : job.userId;
    if (participantId !== expectedOtherParticipant) {
      return res.status(403).json({ 
        error: 'Invalid participant - you can only chat with the job owner or accepted provider' 
      });
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

// Check chat access and get other participant info
r.get('/check/:jobId', auth(true), async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        offers: {
          where: { status: 'ACCEPTED' },
          include: {
            user: {
              select: { id: true, fullName: true, email: true }
            }
          }
        },
        user: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const acceptedOffer = job.offers[0];
    const isJobOwner = req.user.id === job.userId;
    const isAcceptedProvider = acceptedOffer && req.user.id === acceptedOffer.userId;

    // Determine who can chat
    if (!isJobOwner && !isAcceptedProvider) {
      return res.json({
        hasAccess: false,
        message: 'Chat is only available for the job owner and accepted provider'
      });
    }

    // Get the other participant
    const otherParticipant = isJobOwner ? acceptedOffer?.user : job.user;

    // Check if chat room exists
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        jobId,
        participants: {
          some: { id: req.user.id }
        }
      }
    });

    res.json({
      hasAccess: true,
      otherParticipant,
      job: {
        id: job.id,
        title: job.title,
        status: job.status
      },
      roomExists: !!existingRoom,
      roomId: existingRoom?.id
    });
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
      },
      include: {
        job: {
          include: {
            offers: {
              where: { status: 'ACCEPTED' },
              include: { user: true }
            }
          }
        }
      }
    });

    if (!room) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Additional validation: ensure job has accepted offer
    if (!room.job.offers || room.job.offers.length === 0) {
      return res.status(403).json({ error: 'Chat is only available after job acceptance' });
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

/**
 * POST /api/chat/rooms/:roomId/upload-image
 * Upload slike za chat poruku
 */
r.post('/rooms/:roomId/upload-image', auth(true), upload.single('image'), async (req, res, next) => {
  try {
    const { roomId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Verify user has access to this room
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: { id: req.user.id }
        }
      },
      include: {
        job: {
          include: {
            offers: {
              where: { status: 'ACCEPTED' },
              include: { user: true }
            }
          }
        }
      }
    });

    if (!room) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Additional validation: ensure job has accepted offer
    if (!room.job.offers || room.job.offers.length === 0) {
      return res.status(403).json({ error: 'Chat is only available after job acceptance' });
    }

    // Get image URL
    const imageUrl = getImageUrl(req, req.file.filename);

    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      message: 'Image uploaded successfully'
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/chat/rooms/:roomId/messages
 * Kreiraj novu poruku (može sadržavati tekst i/ili slike)
 */
r.post('/rooms/:roomId/messages', auth(true), async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { content = '', attachments = [] } = req.body;

    // Validate: mora biti ili content ili attachments
    if (!content.trim() && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ error: 'Message must have content or attachments' });
    }

    // Verify user has access to this room
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: { id: req.user.id }
        }
      },
      include: {
        job: {
          include: {
            offers: {
              where: { status: 'ACCEPTED' },
              include: { user: true }
            }
          }
        }
      }
    });

    if (!room) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Additional validation: ensure job has accepted offer
    if (!room.job.offers || room.job.offers.length === 0) {
      return res.status(403).json({ error: 'Chat is only available after job acceptance' });
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim() || '',
        attachments: Array.isArray(attachments) ? attachments : [],
        senderId: req.user.id,
        roomId
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    // Update room updatedAt
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    });

    res.status(201).json(message);
  } catch (e) {
    next(e);
  }
});

export default r;

