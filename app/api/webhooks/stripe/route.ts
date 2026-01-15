import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '@/lib/voucher-utils';

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
  console.log('🔔 Webhook received');
  
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    console.log('📝 Webhook signature present:', !!signature);

    if (!signature) {
      console.error('❌ No Stripe signature found');
      return NextResponse.json(
        { error: 'Keine Stripe-Signatur gefunden' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified, event type:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook-Signatur ungültig' },
        { status: 400 }
      );
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      console.log('💳 Processing checkout.session.completed event');
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const bundleId = session.metadata?.bundleId;

      console.log('📦 Session metadata:', { userId, bundleId, sessionId: session.id });

      if (!userId || !bundleId) {
        console.error('❌ Missing metadata in session:', session.id);
        return NextResponse.json(
          { error: 'Fehlende Metadaten' },
          { status: 400 }
        );
      }

      console.log('🔐 Generating PIN and QR code...');
      // Generate PIN and QR code for the voucher
      const pinCode = await generateUniquePIN(prisma);
      const purchaseId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const qrCodeData = generateQRData(purchaseId, userId, pinCode);
      const expiresAt = calculateExpirationDate();
      
      console.log('✅ Generated PIN:', pinCode);
      console.log('📅 Expiration date:', expiresAt.toISOString());
      
      // Create voucher purchase record with redemption codes
      console.log('💾 Creating voucher purchase in database...');
      const purchase = await prisma.voucherPurchase.create({
        data: {
          userId,
          voucherId: bundleId,
          stripeSessionId: session.id,
          status: 'completed',
          amount: (session.amount_total || 0) / 100, // Convert from cents
          pinCode,
          qrCodeData: qrCodeData.replace(purchaseId, ''), // Placeholder, will update
          expiresAt,
        },
      });
      
      console.log('✅ Voucher purchase created with ID:', purchase.id);
      
      // Update QR code with actual purchase ID
      console.log('🔄 Updating QR code with actual purchase ID...');
      const finalQRData = generateQRData(purchase.id, userId, pinCode);
      await prisma.voucherPurchase.update({
        where: { id: purchase.id },
        data: { qrCodeData: finalQRData }
      });
      
      console.log('✅ QR code updated');

      // Award bonus points if applicable
      const bonusPoints = BUNDLE_BONUS_POINTS[bundleId] || 0;
      
      if (bonusPoints > 0) {
        console.log('🎁 Awarding bonus points:', bonusPoints);
        await prisma.pointsTransaction.create({
          data: {
            userId,
            amount: bonusPoints,
            type: 'earn',
            description: `Bonuspunkte für ${bundleId} Kauf`,
          },
        });
        console.log('✅ Bonus points awarded');
      }

      console.log(`✅ Processed payment for user ${userId}, bundle ${bundleId}, bonus points: ${bonusPoints}`);
    } else {
      console.log('ℹ️ Ignoring event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook-Verarbeitung fehlgeschlagen' },
      { status: 500 }
    );
  }
}
