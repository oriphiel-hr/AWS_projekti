import { prisma } from '../lib/prisma.js';
import { checkAddonStatus } from './addon-service.js';

/**
 * Cron job za provjeru i ažuriranje lifecycle statusa add-on paketa
 * Pokreće se svaki sat
 */
export async function checkAddonLifecycles() {
  console.log('[ADDON-LIFECYCLE] Starting lifecycle check...');

  try {
    // Dohvati sve aktivne add-one
    const activeAddons = await prisma.addonSubscription.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'LOW_BALANCE', 'GRACE_MODE']
        }
      },
      include: {
        usage: true
      }
    });

    let updated = 0;
    let expired = 0;
    let graceStarted = 0;

    for (const addon of activeAddons) {
      try {
        const beforeStatus = addon.status;
        const checked = await checkAddonStatus(addon.id);

        if (checked && checked.status !== beforeStatus) {
          updated++;

          if (checked.status === 'EXPIRED') {
            expired++;
          } else if (checked.status === 'GRACE_MODE') {
            graceStarted++;
          }
        }
      } catch (error) {
        console.error(`[ADDON-LIFECYCLE] Error checking addon ${addon.id}:`, error.message);
      }
    }

    console.log(`[ADDON-LIFECYCLE] Check complete: ${updated} updated, ${expired} expired, ${graceStarted} grace started`);

    return {
      checked: activeAddons.length,
      updated,
      expired,
      graceStarted
    };
  } catch (error) {
    console.error('[ADDON-LIFECYCLE] Error in lifecycle check:', error);
    throw error;
  }
}

/**
 * Provjeri i obnovi add-one s auto-renew
 */
export async function processAutoRenewals() {
  console.log('[ADDON-LIFECYCLE] Processing auto-renewals...');

  try {
    const now = new Date();
    const graceEnd = new Date(now);
    graceEnd.setDate(graceEnd.getDate() - 1); // 1 dan nakon grace perioda

    // Dohvati add-one koji su u grace periodu i imaju auto-renew
    const addonsToRenew = await prisma.addonSubscription.findMany({
      where: {
        status: 'GRACE_MODE',
        autoRenew: true,
        graceUntil: {
          lte: now // Grace period je prošao
        }
      }
    });

    let renewed = 0;
    let failed = 0;

    for (const addon of addonsToRenew) {
      try {
        // Izračunaj novi validUntil (1 mjesec od sada)
        const newValidUntil = new Date(now);
        newValidUntil.setMonth(newValidUntil.getMonth() + 1);

        const renewedAddon = await prisma.addonSubscription.update({
          where: { id: addon.id },
          data: {
            status: 'ACTIVE',
            validFrom: now,
            validUntil: newValidUntil,
            graceUntil: new Date(newValidUntil.getTime() + 7 * 24 * 60 * 60 * 1000) // +7 dana
          }
        });

        // Kreiraj event log
        await prisma.addonEventLog.create({
          data: {
            addonId: addon.id,
            eventType: 'RENEWED',
            oldStatus: 'GRACE_MODE',
            newStatus: 'ACTIVE',
            metadata: {
              autoRenew: true,
              validUntil: newValidUntil.toISOString()
            }
          }
        });

        // Ako je CREDITS add-on, dodaj kredite
        if (addon.type === 'CREDITS' && addon.creditsAmount) {
          const subscription = await prisma.subscription.findUnique({
            where: { userId: addon.userId }
          });

          if (subscription) {
            await prisma.subscription.update({
              where: { userId: addon.userId },
              data: {
                creditsBalance: subscription.creditsBalance + addon.creditsAmount
              }
            });

            await prisma.creditTransaction.create({
              data: {
                userId: addon.userId,
                type: 'PURCHASE',
                amount: addon.creditsAmount,
                balance: subscription.creditsBalance + addon.creditsAmount,
                description: `Auto-renew add-on: ${addon.displayName} - ${addon.creditsAmount} kredita`
              }
            });
          }
        }

        // Kreiraj notifikaciju
        await prisma.notification.create({
          data: {
            userId: addon.userId,
            title: 'Add-on automatski obnovljen',
            message: `Vaš add-on "${addon.displayName}" je automatski obnovljen.`,
            type: 'SYSTEM'
          }
        });

        renewed++;
      } catch (error) {
        console.error(`[ADDON-LIFECYCLE] Error renewing addon ${addon.id}:`, error.message);
        failed++;

        // Ako auto-renew ne uspije, označi kao EXPIRED
        await prisma.addonSubscription.update({
          where: { id: addon.id },
          data: { status: 'EXPIRED' }
        });

        await prisma.notification.create({
          data: {
            userId: addon.userId,
            title: 'Add-on obnova neuspješna',
            message: `Auto-renew za add-on "${addon.displayName}" nije uspio. Molimo obnovite ručno.`,
            type: 'SYSTEM'
          }
        });
      }
    }

    console.log(`[ADDON-LIFECYCLE] Auto-renewal complete: ${renewed} renewed, ${failed} failed`);

    return {
      renewed,
      failed,
      total: addonsToRenew.length
    };
  } catch (error) {
    console.error('[ADDON-LIFECYCLE] Error in auto-renewal:', error);
    throw error;
  }
}


