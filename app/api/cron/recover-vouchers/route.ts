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

export async function GET(request: Request) {
  console.log('🔄 Cron job: Recovering missing vouchers...');

  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('❌ Unauthorized cron request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get recent completed sessions (last 24 hours)
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: oneDayAgo },
    });

    console.log(`📡 Found ${sessions.data.length} recent Stripe sessions`);

    let recovered = 0;
    let skipped = 0;

    for (const session of sessions.data) {
      if (session.status !== 'complete') {
        skipped++;
        continue;
      }
      
      const userId = session.metadata?.userId;
      const bundleId = session.metadata?.bundleId;
      
      if (!userId || !bundleId) {
        skipped++;
        continue;
      }

      // Check if voucher already exists
      const existing = await prisma.voucherPurchase.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Create missing voucher
      console.log(`🔧 Recovering voucher for session ${session.id}`);
      
      const pinCode = await generateUniquePIN(prisma);
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const qrCodeData = generateQRData(tempId, userId, pinCode);
      const expiresAt = calculateExpirationDate(new Date(session.created * 1000));

      const purchase = await prisma.voucherPurchase.create({
        data: {
          userId,
          voucherId: bundleId,
          stripeSessionId: session.id,
          status: 'completed',
          amount: (session.amount_total || 0) / 100,
          pinCode,
          qrCodeData: qrCodeData.replace(tempId, ''),
          expiresAt,
          createdAt: new Date(session.created * 1000),
        },
      });

      // Update QR code with actual purchase ID
      const finalQR = generateQRData(purchase.id, userId, pinCode);
      await prisma.voucherPurchase.update({
        where: { id: purchase.id },
        data: { qrCodeData: finalQR }
      });

      // Award bonus points if applicable
      const bonusPoints = BUNDLE_BONUS_POINTS[bundleId] || 0;
      if (bonusPoints > 0) {
        await prisma.pointsTransaction.create({
          data: {
            userId,
            amount: bonusPoints,
            type: 'earn',
            description: `Bonuspunkte für ${bundleId} Kauf (automatisch wiederhergestellt)`,
            createdAt: new Date(session.created * 1000),
          },
        });
      }

      console.log(`✅ Recovered voucher with PIN: ${pinCode}`);
      recovered++;
    }

    console.log(`✅ Cron completed: ${recovered} recovered, ${skipped} skipped`);

    return NextResponse.json({ 
      success: true, 
      recovered,
      skipped,
      total: sessions.data.length,
      message: `Recovered ${recovered} missing vouchers`
    });
  } catch (error) {
    console.error('❌ Cron error:', error);
    return NextResponse.json({ 
      error: 'Failed to recover vouchers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
