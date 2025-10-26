// Subscription Expiry Reminder - Send email warnings before subscription expires
import { prisma } from './prisma.js';
import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_USER) {
    console.warn('SMTP not configured - email reminders disabled');
    return null;
  }
  
  const port = parseInt(process.env.SMTP_PORT || '587');
  const isSSL = port === 465;
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: isSSL,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const transporter = createTransporter();

// Send expiry reminder email
export async function sendExpiryReminder(subscription, daysLeft, user) {
  if (!transporter) {
    console.log('SMTP not configured, skipping expiry reminder');
    return;
  }

  const isTrial = subscription.plan === 'TRIAL';
  const subject = isTrial 
    ? `🔔 Vaš TRIAL istječe za ${daysLeft} dana!`
    : `🔔 Vaša pretplata istječe za ${daysLeft} dana!`;

  const message = isTrial
    ? `
      <h2>🎁 Besplatni TRIAL istječe za ${daysLeft} dana!</h2>
      <p>Poštovani <strong>${user.fullName}</strong>,</p>
      <p>Vaš besplatni 7-dnevni probni period za Uslugar EXCLUSIVE istječe za <strong>${daysLeft} dana</strong>.</p>
      
      <h3>Što dobivam s TRIAL-om?</h3>
      <ul>
        <li>✅ 2 besplatna leada</li>
        <li>✅ Ekskluzivni leadovi (1:1, bez konkurencije)</li>
        <li>✅ ROI statistika</li>
        <li>✅ Refund ako klijent ne odgovori</li>
      </ul>
      
      <p><strong>Nadogradite na Premium ili Pro plan da nastavite koristiti:</strong></p>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #059669; margin-top: 0;">⭐ PREMIUM - ${subscription.plan === 'PREMIUM' ? 'Vaš plan' : '89€/mj'}</h3>
        <p style="font-size: 18px; color: #16a34a;">25 leadova mjesečno</p>
        <p>✅ CSV export • SMS notifikacije • AI prioritet • Prioriteta podrška</p>
        <p style="margin-top: 10px; color: #dc2626; font-weight: bold;">Ušteda 161€ vs pay-per-lead (36% popust!)</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'https://uslugar.oriph.io'}/#subscription" 
           style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">
          Nadogradi Pretplatu →
        </a>
      </div>
      
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Pitanja? Kontaktirajte nas na support@uslugar.hr
      </p>
    `
    : `
      <h2>📅 Vaša pretplata istječe za ${daysLeft} dana!</h2>
      <p>Poštovani <strong>${user.fullName}</strong>,</p>
      <p>Vaša pretplata <strong>${subscription.plan}</strong> istječe za <strong>${daysLeft} dana</strong>.</p>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Trenutno stanje:</h3>
        <p>Plan: <strong>${subscription.plan}</strong></p>
        <p>Preostalo kredita: <strong>${subscription.creditsBalance || 0}</strong></p>
        <p>Ističe: <strong>${new Date(subscription.expiresAt).toLocaleDateString('hr-HR')}</strong></p>
      </div>
      
      <p><strong>Nadogradite pretplatu da nastavite koristiti Uslugar EXCLUSIVE:</strong></p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'https://uslugar.oriph.io'}/#subscription" 
           style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">
          Obnovi Pretplatu →
        </a>
      </div>
      
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Više o paketima: <a href="${process.env.FRONTEND_URL || 'https://uslugar.oriph.io'}/#subscription">Pogledaj planove</a>
      </p>
    `;

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: subject,
      html: message
    });
    
    console.log(`📧 Expiry reminder sent to ${user.email} (${daysLeft} days left)`);
  } catch (error) {
    console.error('Error sending expiry reminder:', error);
  }
}

// Check subscriptions and send reminders
export async function checkExpiringSubscriptions() {
  try {
    const now = new Date();
    const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Find subscriptions expiring in 2 days
    const expiringSoon = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: now,
          lte: in2Days
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    });

    // Find subscriptions expiring in 7 days (early warning)
    const expiringLater = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: in2Days,
          lte: in7Days
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    });

    // Send 2-day warning
    for (const sub of expiringSoon) {
      const daysLeft = Math.ceil((sub.expiresAt - now) / (1000 * 60 * 60 * 24));
      await sendExpiryReminder(sub, daysLeft, sub.user);
      
      // Create in-app notification
      await prisma.notification.create({
        data: {
          title: `Pretplata istječe za ${daysLeft} dana`,
          message: `${sub.plan} pretplata istječe ${new Date(sub.expiresAt).toLocaleDateString('hr-HR')}. Obnovite da nastavite koristiti Uslugar EXCLUSIVE.`,
          type: 'SYSTEM',
          userId: sub.user.id
        }
      });
    }

    // Send 7-day early warning (only once)
    for (const sub of expiringLater) {
      const daysLeft = Math.ceil((sub.expiresAt - now) / (1000 * 60 * 60 * 24));
      
      // Check if already sent notification (to avoid duplicates)
      const recentNotification = await prisma.notification.findFirst({
        where: {
          userId: sub.user.id,
          type: 'SYSTEM',
          title: {
            contains: 'istječe za 7 dana'
          },
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) // In last 24h
          }
        }
      });

      if (!recentNotification) {
        await sendExpiryReminder(sub, daysLeft, sub.user);
        
        // Create in-app notification
        await prisma.notification.create({
          data: {
            title: `Pretplata istječe za ${daysLeft} dana`,
            message: `${sub.plan} pretplata istječe ${new Date(sub.expiresAt).toLocaleDateString('hr-HR')}. Nadogradite pretplatu da nastavite koristiti Uslugar EXCLUSIVE.`,
            type: 'SYSTEM',
            userId: sub.user.id
          }
        });
      }
    }

    console.log(`📧 Checked expiring subscriptions: ${expiringSoon.length} soon, ${expiringLater.length} later`);
  } catch (error) {
    console.error('Error checking expiring subscriptions:', error);
  }
}

