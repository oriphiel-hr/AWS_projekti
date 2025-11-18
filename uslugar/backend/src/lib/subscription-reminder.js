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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: #4CAF50; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">USLUGAR</h1>
        </div>
        <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; font-size: 24px;">🎁 Vaš TRIAL istječe za ${daysLeft} dana!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Poštovani/na <strong>${user.fullName}</strong>,</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Vaš besplatni 14-dnevni probni period za Uslugar EXCLUSIVE istječe za <strong>${daysLeft} dana</strong> (${new Date(subscription.expiresAt).toLocaleDateString('hr-HR')}).</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #4CAF50;">
            <h3 style="color: #333; margin-top: 0;">Što ste dobili s TRIAL-om?</h3>
            <ul style="color: #666; font-size: 14px; line-height: 1.8;">
              <li>✅ 8 besplatnih leadova</li>
              <li>✅ Sve Premium funkcionalnosti (AI prioritet, SMS notifikacije, CSV export, napredna analitika)</li>
              <li>✅ 2 kategorije i 1 regija (add-on paketi)</li>
              <li>✅ Ekskluzivni leadovi (1:1, bez konkurencije)</li>
              <li>✅ ROI statistika i refund ako klijent ne odgovori</li>
            </ul>
          </div>
          
          <p style="color: #333; font-size: 16px; font-weight: bold; margin-top: 30px;">Nadogradite na Premium ili Pro plan da nastavite koristiti:</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #4CAF50;">
            <h3 style="color: #059669; margin-top: 0;">⭐ PREMIUM - 89€/mj</h3>
            <p style="font-size: 18px; color: #16a34a; font-weight: bold;">25 leadova mjesečno</p>
            <p style="color: #666; font-size: 14px;">✅ CSV export • SMS notifikacije • AI prioritet • Prioritetna podrška • Napredna analitika</p>
            <p style="margin-top: 10px; color: #dc2626; font-weight: bold;">Ušteda 161€ vs pay-per-lead (36% popust!)</p>
          </div>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #f59e0b;">
            <h3 style="color: #d97706; margin-top: 0;">🚀 PRO - 149€/mj</h3>
            <p style="font-size: 18px; color: #f59e0b; font-weight: bold;">50 leadova mjesečno</p>
            <p style="color: #666; font-size: 14px;">✅ Sve iz Premium + Premium kvaliteta leadova (80+ score) • VIP podrška 24/7 • Featured profil</p>
            <p style="margin-top: 10px; color: #dc2626; font-weight: bold;">Ušteda 351€ vs pay-per-lead (47% popust!)</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://uslugar.oriph.io'}/#subscription" 
               style="background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">
              Nadogradi Pretplatu →
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #999; font-size: 14px; line-height: 1.6;">
            Pitanja? Kontaktirajte nas na <a href="mailto:support@uslugar.hr" style="color: #4CAF50; text-decoration: none;">support@uslugar.hr</a>
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Uslugar. Sva prava pridržana.</p>
        </div>
      </body>
      </html>
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
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Find TRIAL subscriptions expiring in 3 days (specifično za TRIAL)
    const trialExpiringIn3Days = await prisma.subscription.findMany({
      where: {
        plan: 'TRIAL',
        status: 'ACTIVE',
        expiresAt: {
          gte: new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000) - (12 * 60 * 60 * 1000)), // 2.5 dana
          lte: in3Days // 3 dana
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

    // Find subscriptions expiring in 2 days (non-TRIAL)
    const expiringSoon = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        plan: { not: 'TRIAL' }, // Ne uključi TRIAL (već obrađen gore)
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

    // Find subscriptions expiring in 7 days (early warning, non-TRIAL)
    const expiringLater = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        plan: { not: 'TRIAL' }, // Ne uključi TRIAL
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

    // Send TRIAL 3-day reminder (only once)
    for (const sub of trialExpiringIn3Days) {
      const daysLeft = Math.ceil((sub.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Provjeri da li je već poslan podsjetnik (izbjegni duplikate)
      const recentNotification = await prisma.notification.findFirst({
        where: {
          userId: sub.user.id,
          type: 'SYSTEM',
          title: {
            contains: 'TRIAL istječe za 3 dana'
          },
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) // U zadnja 24h
          }
        }
      });

      if (!recentNotification && daysLeft === 3) {
        await sendExpiryReminder(sub, daysLeft, sub.user);
        
        // Create in-app notification
        await prisma.notification.create({
          data: {
            title: `TRIAL istječe za 3 dana`,
            message: `Vaš besplatni TRIAL period istječe za ${daysLeft} dana (${new Date(sub.expiresAt).toLocaleDateString('hr-HR')}). Nadogradite pretplatu da nastavite koristiti Uslugar EXCLUSIVE sa svim Premium funkcionalnostima!`,
            type: 'SYSTEM',
            userId: sub.user.id
          }
        });
        
        console.log(`📧 TRIAL reminder sent to ${sub.user.email} (${daysLeft} days left)`);
      }
    }

    // Send 2-day warning (non-TRIAL)
    for (const sub of expiringSoon) {
      const daysLeft = Math.ceil((sub.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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

    // Send 7-day early warning (only once, non-TRIAL)
    for (const sub of expiringLater) {
      const daysLeft = Math.ceil((sub.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
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

    console.log(`📧 Checked expiring subscriptions: ${trialExpiringIn3Days.length} TRIAL (3 days), ${expiringSoon.length} soon (2 days), ${expiringLater.length} later (7 days)`);
  } catch (error) {
    console.error('Error checking expiring subscriptions:', error);
  }
}

