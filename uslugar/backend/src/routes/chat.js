import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { upload, getImageUrl } from '../lib/upload.js';

const r = Router();

// Get user's chat rooms
r.get('/rooms', auth(true), async (req, res, next) => {
  try {
    // Dohvati PUBLIC chat roomove
    const { getPublicChatRooms } = await import('../services/public-chat-service.js');
    const publicRooms = await getPublicChatRooms(req.user.id);

    // Dohvati OFFER_BASED chat roomove (stari sustav)
    const offerBasedRooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: { id: req.user.id }
        },
        job: {
          offers: {
            some: { status: 'ACCEPTED' }
          },
          leadPurchases: {
            none: {
              status: { in: ['ACTIVE', 'CONTACTED', 'CONVERTED'] }
            }
          }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Kombiniraj i ukloni duplikate
    const allRooms = [...publicRooms, ...offerBasedRooms];
    const uniqueRooms = Array.from(
      new Map(allRooms.map(room => [room.id, room])).values()
    );

    res.json(uniqueRooms);
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

    // Provjeri PUBLIC chat pristup (nakon otključavanja leada)
    const { checkPublicChatAccess } = await import('../services/public-chat-service.js');
    const publicChatAccess = await checkPublicChatAccess(jobId, req.user.id);

    if (publicChatAccess.hasAccess) {
      return res.json({
        hasAccess: true,
        chatType: 'PUBLIC',
        room: publicChatAccess.room,
        job: publicChatAccess.room?.job,
        roomExists: !!publicChatAccess.room,
        roomId: publicChatAccess.room?.id,
        isJobOwner: publicChatAccess.isJobOwner,
        isProvider: publicChatAccess.isProvider,
        isTeamMember: publicChatAccess.isTeamMember
      });
    }

    // Fallback na stari sustav (ACCEPTED offer)
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
      chatType: 'OFFER_BASED',
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
            },
            leadPurchases: {
              where: {
                status: { in: ['ACTIVE', 'CONTACTED', 'CONVERTED'] }
              },
              take: 1
            }
          }
        }
      }
    });

    if (!room) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Provjeri pristup: PUBLIC chat (lead purchase) ili OFFER_BASED chat (accepted offer)
    const hasLeadPurchase = room.job.leadPurchases && room.job.leadPurchases.length > 0;
    const hasAcceptedOffer = room.job.offers && room.job.offers.length > 0;

    if (!hasLeadPurchase && !hasAcceptedOffer) {
      return res.status(403).json({ error: 'Chat is only available after lead unlock or job acceptance' });
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

    // Označi poruke koje nisu od trenutnog korisnika kao DELIVERED ako još nisu
    // A automatski kao READ ako korisnik dohvaća poruke (znači da gleda chat)
    const now = new Date();
    const messageIdsToUpdate = messages
      .filter(msg => msg.senderId !== req.user.id && msg.status !== 'READ')
      .map(msg => msg.id);

    if (messageIdsToUpdate.length > 0) {
      await prisma.chatMessage.updateMany({
        where: {
          id: { in: messageIdsToUpdate }
        },
        data: {
          status: 'READ',
          readAt: now
        }
      });
    }

    // Ponovno dohvati poruke s ažuriranim statusom
    const updatedMessages = await prisma.chatMessage.findMany({
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

    res.json(updatedMessages.reverse());
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
            },
            leadPurchases: {
              where: {
                status: { in: ['ACTIVE', 'CONTACTED', 'CONVERTED'] }
              },
              take: 1
            }
          }
        }
      }
    });

    if (!room) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Provjeri pristup: PUBLIC chat (lead purchase) ili OFFER_BASED chat (accepted offer)
    const hasLeadPurchase = room.job.leadPurchases && room.job.leadPurchases.length > 0;
    const hasAcceptedOffer = room.job.offers && room.job.offers.length > 0;

    if (!hasLeadPurchase && !hasAcceptedOffer) {
      return res.status(403).json({ error: 'Chat is only available after lead unlock or job acceptance' });
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
            },
            leadPurchases: {
              where: {
                status: { in: ['ACTIVE', 'CONTACTED', 'CONVERTED'] }
              },
              take: 1
            }
          }
        }
      }
    });

    if (!room) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Provjeri pristup: PUBLIC chat (lead purchase) ili OFFER_BASED chat (accepted offer)
    const hasLeadPurchase = room.job.leadPurchases && room.job.leadPurchases.length > 0;
    const hasAcceptedOffer = room.job.offers && room.job.offers.length > 0;

    if (!hasLeadPurchase && !hasAcceptedOffer) {
      return res.status(403).json({ error: 'Chat is only available after lead unlock or job acceptance' });
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

/**
 * PATCH /api/chat/rooms/:roomId/messages/:messageId/read
 * Označi poruku kao pročitanu
 */
r.patch('/rooms/:roomId/messages/:messageId/read', auth(true), async (req, res, next) => {
  try {
    const { roomId, messageId } = req.params;

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

    // Get message
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Provjeri da poruka nije od trenutnog korisnika (ne možete označiti svoje poruke kao pročitane)
    if (message.senderId === req.user.id) {
      return res.status(400).json({ error: 'Cannot mark your own message as read' });
    }

    // Ažuriraj status
    const updatedMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        status: 'READ',
        readAt: new Date()
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

    res.json(updatedMessage);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/chat/rooms/:roomId/mark-all-read
 * Označi sve poruke u sobi kao pročitane (za trenutnog korisnika)
 */
r.post('/rooms/:roomId/mark-all-read', auth(true), async (req, res, next) => {
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

    // Označi sve poruke koje nisu od trenutnog korisnika kao pročitane
    const now = new Date();
    const result = await prisma.chatMessage.updateMany({
      where: {
        roomId,
        senderId: { not: req.user.id }, // Samo poruke od drugih korisnika
        status: { not: 'READ' } // Samo one koje još nisu pročitane
      },
      data: {
        status: 'READ',
        readAt: now
      }
    });

    res.json({
      success: true,
      messagesMarkedAsRead: result.count,
      message: `${result.count} poruka označeno kao pročitano`
    });
  } catch (e) {
    next(e);
  }
});

export default r;

