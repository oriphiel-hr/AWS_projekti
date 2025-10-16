import { prisma } from './prisma.js';
import nodemailer from 'nodemailer';

// Email transporter konfiguracija
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Kreiranje notifikacije u bazi
export const createNotification = async (userId, title, message, type, jobId = null, offerId = null) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        jobId,
        offerId
      }
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Slanje email notifikacije
export const sendEmailNotification = async (userEmail, title, message, htmlContent = null) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('SMTP not configured, skipping email notification');
      return false;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: `Uslugar - ${title}`,
      text: message,
      html: htmlContent || `<p>${message}</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}: ${title}`);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

// Notifikacija za novi posao
export const notifyNewJob = async (job, categoryId) => {
  try {
    // Pronađi sve pružatelje u toj kategoriji
    const providers = await prisma.providerProfile.findMany({
      where: {
        categories: {
          some: { id: categoryId }
        },
        isAvailable: true
      },
      include: {
        user: true
      }
    });

    const title = 'Novi posao u vašoj kategoriji';
    const message = `Novi posao "${job.title}" je objavljen u kategoriji.`;

    // Kreiraj notifikacije za sve pružatelje
    for (const provider of providers) {
      await createNotification(
        provider.userId,
        title,
        message,
        'NEW_JOB',
        job.id
      );

      // Pošalji email
      await sendEmailNotification(
        provider.user.email,
        title,
        message
      );
    }

    console.log(`Notified ${providers.length} providers about new job: ${job.title}`);
  } catch (error) {
    console.error('Error notifying about new job:', error);
  }
};

// Notifikacija za novu ponudu
export const notifyNewOffer = async (offer, job) => {
  try {
    const title = 'Nova ponuda za vaš posao';
    const message = `Dobili ste novu ponudu za posao "${job.title}".`;

    await createNotification(
      job.userId,
      title,
      message,
      'NEW_OFFER',
      job.id,
      offer.id
    );

    // Pošalji email vlasniku posla
    const jobOwner = await prisma.user.findUnique({
      where: { id: job.userId }
    });

    if (jobOwner) {
      await sendEmailNotification(
        jobOwner.email,
        title,
        message
      );
    }

    console.log(`Notified job owner about new offer for job: ${job.title}`);
  } catch (error) {
    console.error('Error notifying about new offer:', error);
  }
};

// Notifikacija za prihvaćenu ponudu
export const notifyAcceptedOffer = async (offer, job) => {
  try {
    const title = 'Vaša ponuda je prihvaćena';
    const message = `Vaša ponuda za posao "${job.title}" je prihvaćena.`;

    await createNotification(
      offer.userId,
      title,
      message,
      'OFFER_ACCEPTED',
      job.id,
      offer.id
    );

    // Pošalji email pružatelju
    const provider = await prisma.user.findUnique({
      where: { id: offer.userId }
    });

    if (provider) {
      await sendEmailNotification(
        provider.email,
        title,
        message
      );
    }

    console.log(`Notified provider about accepted offer for job: ${job.title}`);
  } catch (error) {
    console.error('Error notifying about accepted offer:', error);
  }
};

// Notifikacija za završeni posao
export const notifyCompletedJob = async (job) => {
  try {
    const title = 'Posao je završen';
    const message = `Posao "${job.title}" je označen kao završen.`;

    // Notifikacija za vlasnika posla
    await createNotification(
      job.userId,
      title,
      message,
      'JOB_COMPLETED',
      job.id
    );

    // Notifikacija za pružatelja (ako postoji prihvaćena ponuda)
    if (job.acceptedOfferId) {
      const offer = await prisma.offer.findUnique({
        where: { id: job.acceptedOfferId }
      });

      if (offer) {
        await createNotification(
          offer.userId,
          title,
          message,
          'JOB_COMPLETED',
          job.id
        );
      }
    }

    console.log(`Notified users about completed job: ${job.title}`);
  } catch (error) {
    console.error('Error notifying about completed job:', error);
  }
};
