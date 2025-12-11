import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

/**
 * Admin endpoint to check for completed Stripe payments that don't have voucher purchases
 * This can help recover from webhook failures
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all completed checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
    });

    const results = {
      totalSessions: sessions.data.length,
      missingPurchases: [] as any[],
      existingPurchases: [] as any[],
    };

    for (const session of sessions.data) {
      const sessionUserId = session.metadata?.userId;
      const bundleId = session.metadata?.bundleId;

      if (!sessionUserId || !bundleId) {
        continue;
      }

      // Check if we have a purchase record for this session
      const purchase = await prisma.voucherPurchase.findFirst({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (!purchase) {
        results.missingPurchases.push({
          sessionId: session.id,
          userId: sessionUserId,
          bundleId,
          amount: (session.amount_total || 0) / 100,
          created: new Date(session.created * 1000),
        });
      } else {
        results.existingPurchases.push({
          sessionId: session.id,
          purchaseId: purchase.id,
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error checking purchases:', error);
    return NextResponse.json(
      { error: 'Failed to check purchases' },
      { status: 500 }
    );
  }
}

/**
 * Admin endpoint to manually create missing voucher purchases
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status !== 'complete') {
      return NextResponse.json(
        { error: 'Session is not completed' },
        { status: 400 }
      );
    }

    const sessionUserId = session.metadata?.userId;
    const bundleId = session.metadata?.bundleId;

    if (!sessionUserId || !bundleId) {
      return NextResponse.json(
        { error: 'Missing metadata in session' },
        { status: 400 }
      );
    }

    // Check if purchase already exists
    const existing = await prisma.voucherPurchase.findFirst({
      where: {
        stripeSessionId: sessionId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Purchase already exists', purchase: existing },
        { status: 400 }
      );
    }

    // Create the purchase
    const purchase = await prisma.voucherPurchase.create({
      data: {
        userId: sessionUserId,
        voucherId: bundleId,
        stripeSessionId: sessionId,
        status: 'completed',
        amount: (session.amount_total || 0) / 100,
      },
    });

    // Award bonus points if applicable
    const BUNDLE_BONUS_POINTS: Record<string, number> = {
      'bundle-standard': 0,
      'bundle-premium': 5000,
      'bundle-deluxe': 10000,
    };

    const bonusPoints = BUNDLE_BONUS_POINTS[bundleId] || 0;

    if (bonusPoints > 0) {
      await prisma.pointsTransaction.create({
        data: {
          userId: sessionUserId,
          amount: bonusPoints,
          type: 'earn',
          description: `Bonuspunkte für ${bundleId} Kauf (manuell hinzugefügt)`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      purchase,
      bonusPoints,
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase' },
      { status: 500 }
    );
  }
}
