// Stripe Payment Integration - HR Market
// Updated: 2025-10-26 - Deployed to production
import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// Initialize Stripe with error handling
let stripe;
try {
  const stripeKey = process.env.STRIPE_SECRET_KEY || '';
  if (stripeKey && stripeKey !== '') {
    stripe = new Stripe(stripeKey);
    console.log('[PAYMENTS] Stripe initialized successfully');
  } else {
    console.warn('[PAYMENTS] STRIPE_SECRET_KEY is empty or not set');
    stripe = null;
  }
} catch (error) {
  console.error('[PAYMENTS] Stripe initialization failed:', error.message);
  stripe = null;
}

// Get publishable key for frontend
r.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    enabled: !!process.env.STRIPE_SECRET_KEY
  });
});

/**
 * Create Stripe Checkout Session
 * POST /api/payments/create-checkout
 */
r.post('/create-checkout', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    // Check if Stripe is configured
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      console.error('[PAYMENTS] Stripe not configured - STRIPE_SECRET_KEY missing');
      return res.status(503).json({ 
        error: 'Payment system not configured',
        message: 'Stripe API keys are missing. Please contact support.'
      });
    }

    const { plan } = req.body;
    
    if (!plan) {
      return res.status(400).json({ error: 'Plan is required' });
    }

    // Get plan details from database
    const planDetails = await prisma.subscriptionPlan.findUnique({
      where: { name: plan }
    });

    if (!planDetails) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Kartice (Visa, Mastercard, Diners)
      mode: 'subscription', // Recurring payment
      customer_email: req.user.email,
      line_items: [{
        price_data: {
          currency: planDetails.currency.toLowerCase() || 'eur',
          product_data: {
            name: `${planDetails.displayName} Plan`,
            description: `${planDetails.credits} ekskluzivnih leadova mjesečno`,
          },
          unit_amount: planDetails.price * 100, // Stripe koristi cents
          recurring: {
            interval: 'month' // Mjesečna pretplata
          }
        },
        quantity: 1
      }],
      success_url: `${process.env.CLIENT_URL || 'https://uslugar.oriph.io'}#subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'https://uslugar.oriph.io'}#pricing`,
      metadata: {
        userId: req.user.id,
        plan: plan,
        credits: planDetails.credits.toString()
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    next(error);
  }
});

/**
 * Handle Stripe Webhook
 * POST /api/payments/webhook
 */
r.post('/webhook', async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;
      const credits = parseInt(session.metadata.credits);

      console.log(`[PAYMENT] Subscription activated for user ${userId}, plan: ${plan}`);

      // Activate subscription
      await activateSubscription(userId, plan, credits);

      return res.json({ received: true });
    }

    // Handle recurring payment success
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      
      console.log(`[PAYMENT] Recurring payment succeeded for customer ${customerId}`);
      
      // TODO: Renew subscription credits
      // await renewSubscription(customerId);
      
      return res.json({ received: true });
    }

    // Handle payment failure
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      
      console.log(`[PAYMENT] Payment failed for customer ${customerId}`);
      
      // TODO: Notify user about failed payment
      // await notifyPaymentFailed(customerId);
      
      return res.json({ received: true });
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    next(error);
  }
});

/**
 * Cancel Stripe subscription
 * POST /api/payments/cancel-subscription
 */
r.post('/cancel-subscription', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    // Get user's subscription from DB
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel Stripe subscription if exists
    if (subscription.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        console.log(`[PAYMENT] Stripe subscription ${subscription.stripeSubscriptionId} cancelled`);
      } catch (stripeError) {
        console.error('Stripe cancellation error:', stripeError);
        // Continue anyway - mark as cancelled locally
      }
    }

    // Update subscription in DB
    const updatedSubscription = await prisma.subscription.update({
      where: { userId: req.user.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        title: 'Pretplata otkazana',
        message: 'Vaša pretplata je otkazana. Zadržavate postojeće kredite do kraja periode.',
        type: 'SYSTEM',
        userId: req.user.id
      }
    });

    res.json({ 
      success: true,
      subscription: updatedSubscription,
      message: 'Pretplata je uspješno otkazana.' 
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    next(error);
  }
});

/**
 * Confirm subscription after successful payment
 * GET /api/payments/success
 */
r.get('/success', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.redirect('/subscription/plans?error=no_session');
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // Subscription je već aktivirana preko webhook-a
      // Ovde možemo prikazati potvrdu
      res.json({
        success: true,
        message: 'Pretplata uspješno aktivirana!',
        sessionId: session_id
      });
    } else {
      res.redirect('/subscription/plans?error=payment_pending');
    }

  } catch (error) {
    console.error('Payment success handler error:', error);
    next(error);
  }
});

/**
 * Helper: Activate subscription after payment
 */
async function activateSubscription(userId, plan, credits) {
  try {
    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mjesec

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        status: 'ACTIVE',
        creditsBalance: credits,
        credits: credits, // Legacy
        expiresAt
      },
      update: {
        plan,
        status: 'ACTIVE',
        creditsBalance: existingSubscription 
          ? existingSubscription.creditsBalance + credits 
          : credits,
        expiresAt
      }
    });

    // Create credit transaction
    await prisma.creditTransaction.create({
      data: {
        userId,
        type: 'SUBSCRIPTION',
        amount: credits,
        balance: subscription.creditsBalance,
        description: `${plan} subscription - ${credits} credits`
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        title: 'Pretplata aktivirana!',
        message: `Uspješno ste se pretplatili na ${plan} plan! Dodano ${credits} kredita.`,
        type: 'SYSTEM',
        userId
      }
    });

    console.log(`[SUBSCRIPTION] Activated: User ${userId}, Plan ${plan}, Credits ${credits}`);

    return subscription;

  } catch (error) {
    console.error('Activate subscription error:', error);
    throw error;
  }
}

export default r;

