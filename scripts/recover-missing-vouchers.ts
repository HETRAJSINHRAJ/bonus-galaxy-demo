/**
 * Script to recover missing voucher purchases from completed Stripe payments
 * This helps fix the issue for customers who already paid but didn't get their vouchers
 * 
 * Run with: npx tsx scripts/recover-missing-vouchers.ts
 */

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

const prisma = new PrismaClient();

const BUNDLE_BONUS_POINTS: Record<string, number> = {
  'bundle-standard': 0,
  'bundle-premium': 5000,
  'bundle-deluxe': 10000,
};

async function recoverMissingVouchers() {
  console.log('🔍 Checking for missing voucher purchases...\n');

  try {
    // Get all completed checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
    });

    console.log(`Found ${sessions.data.length} completed Stripe sessions\n`);

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
        console.log(`✅ Session ${session.id} - already has purchase record`);
        skipped++;
        continue;
      }

      // Create the missing purchase
      try {
        const purchase = await prisma.voucherPurchase.create({
          data: {
            userId: sessionUserId,
            voucherId: bundleId,
            stripeSessionId: session.id,
            status: 'completed',
            amount: (session.amount_total || 0) / 100,
            createdAt: new Date(session.created * 1000), // Use original payment date
          },
        });

        // Award bonus points if applicable
        const bonusPoints = BUNDLE_BONUS_POINTS[bundleId] || 0;

        if (bonusPoints > 0) {
          await prisma.pointsTransaction.create({
            data: {
              userId: sessionUserId,
              amount: bonusPoints,
              type: 'earn',
              description: `Bonuspunkte für ${bundleId} Kauf (wiederhergestellt)`,
              createdAt: new Date(session.created * 1000), // Use original payment date
            },
          });
        }

        console.log(`🎉 Recovered purchase for session ${session.id}`);
        console.log(`   User: ${sessionUserId}`);
        console.log(`   Bundle: ${bundleId}`);
        console.log(`   Amount: €${purchase.amount}`);
        console.log(`   Bonus Points: ${bonusPoints}`);
        console.log('');

        recovered++;
      } catch (error) {
        console.error(`❌ Error creating purchase for session ${session.id}:`, error);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Recovered: ${recovered}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📝 Total: ${sessions.data.length}`);

    if (recovered > 0) {
      console.log('\n🎉 Successfully recovered missing vouchers!');
      console.log('   Affected customers should now see their vouchers.');
    } else {
      console.log('\n✅ No missing vouchers found. Everything is in sync!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
recoverMissingVouchers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
