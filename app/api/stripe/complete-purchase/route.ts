import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '@/lib/voucher-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

const BUNDLE_BONUS_POINTS: Record<string, number> = {
  'bundle-standard': 0,
  'bundle-premium': 5000,
  'bundle-deluxe': 10000,
};

export async function POST(request: Request) {
  console.log('🎫 Complete purchase API called');

  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    console.log('🔍 Retrieving Stripe session:', sessionId);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('✅ Session retrieved, payment status:', session.payment_status);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ 
        error: 'Payment not completed',
        status: session.payment_status 
      }, { status: 400 });
    }

    const userId = session.metadata?.userId;
    const bundleId = session.metadata?.bundleId;

    if (!userId || !bundleId) {
      return NextResponse.json({ 
        error: 'Missing metadata' 
      }, { status: 400 });
    }

    console.log('📦 Session metadata:', { userId, bundleId });

    // Check if voucher already exists
    const existingVoucher = await prisma.voucherPurchase.findFirst({
      where: { stripeSessionId: sessionId },
    });

    if (existingVoucher) {
      console.log('ℹ️ Voucher already exists');
      return NextResponse.json({ 
        success: true,
        alreadyExists: true,
        voucher: {
          id: existingVoucher.id,
          pinCode: existingVoucher.pinCode,
        }
      });
    }

    console.log('🎫 Creating new voucher...');

    // Generate PIN and QR code
    const pinCode = await generateUniquePIN(prisma);
    const purchaseId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCodeData = generateQRData(purchaseId, userId, pinCode);
    const expiresAt = calculateExpirationDate();

    // Create voucher purchase
    const purchase = await prisma.voucherPurchase.create({
      data: {
        userId,
        voucherId: bundleId,
        stripeSessionId: sessionId,
        status: 'completed',
        amount: (session.amount_total || 0) / 100,
        pinCode,
        qrCodeData: qrCodeData.replace(purchaseId, ''),
        expiresAt,
      },
    });

    // Update QR code with actual purchase ID
    const finalQRData = generateQRData(purchase.id, userId, pinCode);
    await prisma.voucherPurchase.update({
      where: { id: purchase.id },
      data: { qrCodeData: finalQRData }
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

    console.log('✅ Voucher created successfully with PIN:', pinCode);

    return NextResponse.json({ 
      success: true,
      voucher: {
        id: purchase.id,
        pinCode: purchase.pinCode,
        bundleId: purchase.voucherId,
        bonusPoints,
      }
    });

  } catch (error) {
    console.error('❌ Error completing purchase:', error);
    return NextResponse.json({ 
      error: 'Failed to complete purchase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
