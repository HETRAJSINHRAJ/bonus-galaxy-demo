/**
 * Check user status - points and vouchers
 * Run with: npx tsx scripts/check-user-status.ts YOUR_USER_ID
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserStatus(userId?: string) {
  console.log('👤 Checking user status...\n');

  try {
    if (!userId) {
      console.log('❌ Please provide a user ID');
      console.log('Usage: npx tsx scripts/check-user-status.ts YOUR_USER_ID\n');
      console.log('To find your user ID:');
      console.log('1. Open browser console (F12) while logged in');
      console.log('2. Or check Clerk dashboard');
      console.log('3. Or run: npx prisma studio and check any transaction\n');
      return;
    }

    // Check points
    console.log('💰 Checking points...');
    const pointsTransactions = await prisma.pointsTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const totalPoints = pointsTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    console.log(`Total Points: ${totalPoints.toLocaleString()}`);
    console.log(`Transactions: ${pointsTransactions.length}\n`);

    if (pointsTransactions.length > 0) {
      console.log('Recent transactions:');
      pointsTransactions.slice(0, 5).forEach((t, i) => {
        const sign = t.amount >= 0 ? '+' : '';
        console.log(`  ${i + 1}. ${sign}${t.amount} - ${t.description} (${t.createdAt.toISOString()})`);
      });
      console.log('');
    }

    // Check vouchers
    console.log('🎫 Checking vouchers...');
    const vouchers = await prisma.voucherPurchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Total Vouchers: ${vouchers.length}\n`);

    if (vouchers.length > 0) {
      console.log('Voucher details:');
      vouchers.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.voucherId}`);
        console.log(`     ID: ${v.id}`);
        console.log(`     Status: ${v.status}`);
        console.log(`     Amount: €${v.amount}`);
        console.log(`     PIN: ${v.pinCode || '❌ MISSING'}`);
        console.log(`     QR: ${v.qrCodeData ? '✅ Present' : '❌ MISSING'}`);
        console.log(`     Redeemed: ${v.isRedeemed ? '✅ Yes' : '❌ No'}`);
        console.log(`     Created: ${v.createdAt.toISOString()}`);
        console.log(`     Expires: ${v.expiresAt?.toISOString() || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('No vouchers found for this user.\n');
      console.log('💡 To purchase a voucher:');
      console.log('1. Go to /shop');
      console.log('2. Click "Mit Punkten kaufen" (if you have enough points)');
      console.log('3. Or click "Jetzt kaufen" to pay with Stripe\n');
    }

    // Summary
    console.log('📊 Summary:');
    console.log(`   Points: ${totalPoints.toLocaleString()}`);
    console.log(`   Vouchers: ${vouchers.length}`);
    console.log(`   Can purchase Standard Bundle (4000 pts): ${totalPoints >= 4000 ? '✅ Yes' : '❌ No'}`);
    console.log(`   Can purchase Premium Bundle (7500 pts): ${totalPoints >= 7500 ? '✅ Yes' : '❌ No'}`);
    console.log(`   Can purchase Deluxe Bundle (10000 pts): ${totalPoints >= 10000 ? '✅ Yes' : '❌ No'}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

const userId = process.argv[2];
checkUserStatus(userId)
  .then(() => {
    console.log('✅ Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Check failed:', error);
    process.exit(1);
  });
