import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || '*',
      methods: ['GET', 'POST']
    }
  });

  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join room
    socket.on('join-room', async (roomId) => {
      try {
        // Verify user has access to this room
        const room = await prisma.chatRoom.findFirst({
          where: {
            id: roomId,
            participants: {
              some: { id: socket.userId }
            }
          }
        });

        if (!room) {
          socket.emit('error', 'Access denied to this room');
          return;
        }

        socket.join(roomId);
        console.log(`User ${socket.userId} joined room ${roomId}`);

        // Load chat history
        const messages = await prisma.chatMessage.findMany({
          where: { roomId },
          include: {
            sender: {
              select: { id: true, fullName: true, email: true }
            }
          },
          orderBy: { createdAt: 'asc' },
          take: 50 // Last 50 messages
        });

        socket.emit('chat-history', messages);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', 'Failed to join room');
      }
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { roomId, content = '', attachments = [] } = data;

        // Validate: mora biti ili content ili attachments
        if (!content.trim() && (!attachments || attachments.length === 0)) {
          socket.emit('error', 'Message must have content or attachments');
          return;
        }

        // Verify user has access to this room
        const room = await prisma.chatRoom.findFirst({
          where: {
            id: roomId,
            participants: {
              some: { id: socket.userId }
            }
          }
        });

        if (!room) {
          socket.emit('error', 'Access denied to this room');
          return;
        }

        // Save message to database
        const message = await prisma.chatMessage.create({
          data: {
            content: content.trim() || '', // Može biti prazan ako su samo slike
            attachments: Array.isArray(attachments) ? attachments : [],
            senderId: socket.userId,
            roomId
          },
          include: {
            sender: {
              select: { id: true, fullName: true, email: true }
            }
          }
        });

        // Broadcast to room
        io.to(roomId).emit('new-message', message);

        // Create notification for other participants
        const otherParticipants = await prisma.chatRoom.findUnique({
          where: { id: roomId },
          include: {
            participants: {
              where: {
                id: { not: socket.userId }
              },
              select: { id: true }
            }
          }
        });

        for (const participant of otherParticipants.participants) {
          await prisma.notification.create({
            data: {
              title: 'Nova poruka',
              message: `Imate novu poruku u chatu`,
              type: 'SYSTEM',
              userId: participant.id
            }
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Typing indicator
    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('user-typing', { userId: socket.userId });
    });

    socket.on('stop-typing', (roomId) => {
      socket.to(roomId).emit('user-stop-typing', { userId: socket.userId });
    });

    // Leave room
    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.userId} left room ${roomId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

