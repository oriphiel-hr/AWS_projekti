// Credit System Service - USLUGAR EXCLUSIVE
import { prisma } from '../lib/prisma.js';

/**
 * Dodaj kredite korisniku
 */
export async function addCredits(userId, amount, type, description = null, relatedJobId = null) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  const newBalance = subscription.creditsBalance + amount;

  // Update subscription
  await prisma.subscription.update({
    where: { userId },
    data: { creditsBalance: newBalance }
  });

  // Create transaction record
  const transaction = await prisma.creditTransaction.create({
    data: {
      userId,
      type,
      amount,
      balance: newBalance,
      description,
      relatedJobId
    }
  });

  console.log(`[CREDITS] Added ${amount} credits to user ${userId}. New balance: ${newBalance}`);
  return { balance: newBalance, transaction };
}

/**
 * Potroši kredite (kupovina leada)
 */
export async function deductCredits(userId, amount, description = null, relatedJobId = null, relatedPurchaseId = null) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  if (subscription.creditsBalance < amount) {
    throw new Error(`Insufficient credits. Available: ${subscription.creditsBalance}, Required: ${amount}`);
  }

  const newBalance = subscription.creditsBalance - amount;

  // Update subscription
  await prisma.subscription.update({
    where: { userId },
    data: {
      creditsBalance: newBalance,
      lifetimeCreditsUsed: subscription.lifetimeCreditsUsed + amount
    }
  });

  // Create transaction record
  const transaction = await prisma.creditTransaction.create({
    data: {
      userId,
      type: 'LEAD_PURCHASE',
      amount: -amount,
      balance: newBalance,
      description,
      relatedJobId,
      relatedPurchaseId
    }
  });

  console.log(`[CREDITS] Deducted ${amount} credits from user ${userId}. New balance: ${newBalance}`);
  return { balance: newBalance, transaction };
}

/**
 * Refund kredita (neuspješan lead)
 */
export async function refundCredits(userId, amount, description = null, relatedPurchaseId = null) {
  return await addCredits(userId, amount, 'REFUND', description, null);
}

/**
 * Dohvati trenutni balans kredita
 */
export async function getCreditsBalance(userId) {
  let subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      creditsBalance: true,
      lifetimeCreditsUsed: true,
      plan: true
    }
  });

  // Create default TRIAL subscription if doesn't exist
  if (!subscription) {
    console.log(`[CREDITS] Creating default TRIAL subscription for user ${userId}`);
    subscription = await prisma.subscription.create({
      data: {
        userId: userId,
        plan: 'TRIAL',
        status: 'ACTIVE',
        credits: 0,
        creditsBalance: 2, // 2 besplatna leada za probati
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dana trial
      },
      select: {
        creditsBalance: true,
        lifetimeCreditsUsed: true,
        plan: true
      }
    });
    
    // Create notification
    await prisma.notification.create({
      data: {
        title: 'Dobrodošli u Uslugar EXCLUSIVE!',
        message: 'Dobili ste 2 besplatna leada da probate našu platformu. Nadogradite pretplatu za više.',
        type: 'SYSTEM',
        userId: userId
      }
    });
  }

  return {
    balance: subscription.creditsBalance,
    lifetime: subscription.lifetimeCreditsUsed || 0,
    plan: subscription.plan
  };
}

/**
 * Dohvati povijest transakcija kredita
 */
export async function getCreditHistory(userId, limit = 50) {
  const transactions = await prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      relatedJob: {
        select: { id: true, title: true }
      },
      relatedPurchase: {
        select: { id: true, status: true }
      }
    }
  });

  return transactions;
}

/**
 * Provjeri ima li dovoljno kredita
 */
export async function hasEnoughCredits(userId, requiredAmount) {
  const { balance } = await getCreditsBalance(userId);
  return balance >= requiredAmount;
}

