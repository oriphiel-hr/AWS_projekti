import { prisma } from './prisma.js';
import { sendJobNotification, sendOfferNotification, sendOfferAcceptedNotification } from './email.js';

// Notify providers about new job
export const notifyNewJob = async (job, categoryId) => {
  try {
    // Find all providers in this category
    const providers = await prisma.providerProfile.findMany({
      where: {
        categories: {
          some: { id: categoryId }
        },
        isAvailable: true
      },
      include: {
        user: {
          select: { id: true, email: true, fullName: true }
        }
      }
    });

    // Create notifications and send emails
    for (const provider of providers) {
      // Create in-app notification
      await prisma.notification.create({
        data: {
          title: 'Novi posao u vašoj kategoriji',
          message: `Novi posao: ${job.title}`,
          type: 'NEW_JOB',
          userId: provider.user.id,
          jobId: job.id
        }
      });

      // Send email notification
      const jobUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/jobs/${job.id}`;
      await sendJobNotification(provider.user.email, job.title, jobUrl);
    }

    console.log(`Notified ${providers.length} providers about new job: ${job.title}`);
  } catch (error) {
    console.error('Error notifying providers:', error);
  }
};

// Notify user about new offer
export const notifyNewOffer = async (offer, job) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: job.userId }
    });

    const provider = await prisma.user.findUnique({
      where: { id: offer.userId }
    });

    if (!user || !provider) return;

    // Create in-app notification
    await prisma.notification.create({
      data: {
        title: 'Nova ponuda',
        message: `${provider.fullName} je poslao ponudu za: ${job.title}`,
        type: 'NEW_OFFER',
        userId: user.id,
        jobId: job.id,
        offerId: offer.id
      }
    });

    // Send email notification
    await sendOfferNotification(user.email, job.title, provider.fullName, offer.amount);

    console.log(`Notified user ${user.email} about new offer`);
  } catch (error) {
    console.error('Error notifying about new offer:', error);
  }
};

// Notify provider about accepted offer
export const notifyAcceptedOffer = async (offer, job) => {
  try {
    const provider = await prisma.user.findUnique({
      where: { id: offer.userId }
    });

    const customer = await prisma.user.findUnique({
      where: { id: job.userId }
    });

    if (!provider || !customer) return;

    // Create in-app notification
    await prisma.notification.create({
      data: {
        title: 'Ponuda prihvaćena',
        message: `${customer.fullName} je prihvatio vašu ponudu za: ${job.title}`,
        type: 'OFFER_ACCEPTED',
        userId: provider.id,
        jobId: job.id,
        offerId: offer.id
      }
    });

    // Send email notification
    await sendOfferAcceptedNotification(provider.email, job.title, customer.fullName);

    console.log(`Notified provider ${provider.email} about accepted offer`);
  } catch (error) {
    console.error('Error notifying about accepted offer:', error);
  }
};

// Notify about job completion
export const notifyJobCompleted = async (jobId) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        user: true,
        offers: {
          where: { status: 'ACCEPTED' },
          include: { user: true }
        }
      }
    });

    if (!job) return;

    // Notify customer
    await prisma.notification.create({
      data: {
        title: 'Posao završen',
        message: `Posao "${job.title}" je označen kao završen`,
        type: 'JOB_COMPLETED',
        userId: job.userId,
        jobId: job.id
      }
    });

    // Notify provider
    if (job.offers.length > 0) {
      const provider = job.offers[0].user;
      await prisma.notification.create({
        data: {
          title: 'Posao završen',
          message: `Posao "${job.title}" je označen kao završen`,
          type: 'JOB_COMPLETED',
          userId: provider.id,
          jobId: job.id
        }
      });
    }
  } catch (error) {
    console.error('Error notifying about job completion:', error);
  }
};

// Generic notification helper - USLUGAR EXCLUSIVE
export const notifyClient = async (userId, notification) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        ...notification
      }
    });
    console.log(`Notified user ${userId}: ${notification.title}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const notifyProvider = async (providerId, notification) => {
  return notifyClient(providerId, notification);
};

export default {
  notifyNewJob,
  notifyNewOffer,
  notifyAcceptedOffer,
  notifyJobCompleted,
  notifyClient,
  notifyProvider
};
