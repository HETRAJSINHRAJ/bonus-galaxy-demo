import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Bundle bonus points configuration
const BUNDLE_BONUS_POINTS: Record<string, number> = {
  'bundle-standard': 0,
  'bundle-premium': 5000,
  'bundle-deluxe': 10000,
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Keine Stripe-Signatur gefunden' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook-Signatur ungültig' },
        { status: 400 }
      );
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const bundleId = session.metadata?.bundleId;

      if (!userId || !bundleId) {
        console.error('Missing metadata in session:', session.id);
        return NextResponse.json(
          { error: 'Fehlende Metadaten' },
          { status: 400 }
        );
      }

      // Create voucher purchase record
      await prisma.voucherPurchase.create({
        data: {
          userId,
          voucherId: bundleId,
          stripeSessionId: session.id,
          status: 'completed',
          amount: (session.amount_total || 0) / 100, // Convert from cents
        },
      });

      // Award bonus points if applicable
      const bonusPoints = BUNDLE_BONUS_POINTS[bundleId] || 0;
      
      if (bonusPoints > 0) {
        await prisma.pointsTransaction.create({
          data: {
            userId,
            amount: bonusPoints,
            type: 'earn',
            description: `Bonuspunkte für ${bundleId} Kauf`,
          },
        });
      }

      console.log(`✅ Processed payment for user ${userId}, bundle ${bundleId}, bonus points: ${bonusPoints}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook-Verarbeitung fehlgeschlagen' },
      { status: 500 }
    );
  }
}
