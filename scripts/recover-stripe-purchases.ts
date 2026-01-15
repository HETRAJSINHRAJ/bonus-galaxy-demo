/**
 * Recover Stripe purchases that didn't create vouchers (webhook didn't fire)
 * Run with: npx tsx scripts/recover-stripe-purchases.ts
 */

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '../lib/voucher-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

const prisma = new PrismaClient();

const BUNDLE_BONUS_POINTS: Record<string, number> = {
  'bundle-standard': 0,
  'bundle-premium': 5000,
  'bundle-deluxe': 10000,
};

async function recoverStripePurchases() {
  console.log('🔍 Checking for Stripe purchases without vouchers...\n');

  try {
    // Get all completed checkout sessions from Stripe
    console.log('📡 Fetching completed Stripe sessions...');
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
    });

    console.log(`✅ Found ${sessions.data.length} completed Stripe sessions\n`);

    let recovered = 0;
    let skipped = 0;
    let errors = 0;

    for (const session of sessions.data) {
      const sessionUserId = session.metadata?.userId;
      const bundleId = session.metadata?.bundleId;

      if (!sessionUserId || !bundleId) {
        console.log(`⏭️  Skipping session ${session.id} - missing metadata`);
        skipped++;
        continue;
      }

      // Check if we already have a purchase record
      const existing = await prisma.voucherPurchase.findFirst({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (existing) {
        console.log(`✅ Session ${session.id} - already has voucher (${existing.pinCode})`);
        skipped++;
        continue;
      }

      // Create the missing purchase with PIN and QR code
      try {
        console.log(`\n🔧 Recovering purchase for session ${session.id}...`);
        console.log(`   User: ${sessionUserId}`);
        console.log(`   Bundle: ${bundleId}`);
        console.log(`   Amount: €${(session.amount_total || 0) / 100}`);

        const pinCode = await generateUniquePIN(prisma);
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const qrCodeData = generateQRData(tempId, sessionUserId, pinCode);
        const expiresAt = calculateExpirationDate(new Date(session.created * 1000));

        const purchase = await prisma.voucherPurchase.create({
          data: {
            userId: sessionUserId,
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
        const finalQRData = generateQRData(purchase.id, sessionUserId, pinCode);
        await prisma.voucherPurchase.update({
          where: { id: purchase.id },
          data: { qrCodeData: finalQRData }
        });

        console.log(`   ✅ Voucher created!`);
        console.log(`   PIN: ${pinCode}`);
        console.log(`   Expires: ${expiresAt.toISOString()}`);

        // Award bonus points if applicable
        const bonusPoints = BUNDLE_BONUS_POINTS[bundleId] || 0;

        if (bonusPoints > 0) {
          await prisma.pointsTransaction.create({
            data: {
              userId: sessionUserId,
              amount: bonusPoints,
              type: 'earn',
              description: `Bonuspunkte für ${bundleId} Kauf (wiederhergestellt)`,
              createdAt: new Date(session.created * 1000),
            },
          });
          console.log(`   🎁 Bonus points awarded: ${bonusPoints}`);
        }

        recovered++;
      } catch (error) {
        console.error(`   ❌ Error creating voucher:`, error);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Recovery Summary:');
    console.log('='.repeat(60));
    console.log(`   ✅ Recovered: ${recovered}`);
    console.log(`   ⏭️  Already existed: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📝 Total sessions: ${sessions.data.length}`);
    console.log('='.repeat(60));

    if (recovered > 0) {
      console.log('\n🎉 Successfully recovered missing vouchers!');
      console.log('   Customers can now see their vouchers at /vouchers');
    } else if (skipped === sessions.data.length) {
      console.log('\n✅ All Stripe purchases already have vouchers!');
    } else {
      console.log('\n⚠️  No purchases to recover.');
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
recoverStripePurchases()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
