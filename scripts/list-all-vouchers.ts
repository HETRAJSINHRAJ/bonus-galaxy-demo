/**
 * List all vouchers in the database
 * Run with: npx tsx scripts/list-all-vouchers.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAllVouchers() {
  console.log('📋 Listing all vouchers in database...\n');

  try {
    const vouchers = await prisma.voucherPurchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Total vouchers: ${vouchers.length}\n`);

    if (vouchers.length === 0) {
      console.log('No vouchers found in database.');
      return;
    }

    vouchers.forEach((v, i) => {
      console.log(`${i + 1}. Voucher ID: ${v.id}`);
      console.log(`   User: ${v.userId}`);
      console.log(`   Bundle: ${v.voucherId}`);
      console.log(`   Status: ${v.status}`);
      console.log(`   Amount: €${v.amount}`);
      console.log(`   Stripe Session: ${v.stripeSessionId || 'N/A (paid with points)'}`);
      console.log(`   PIN: ${v.pinCode || '❌ MISSING'}`);
      console.log(`   QR Code: ${v.qrCodeData ? '✅ Present' : '❌ MISSING'}`);
      console.log(`   Expires: ${v.expiresAt?.toISOString() || '❌ MISSING'}`);
      console.log(`   Redeemed: ${v.isRedeemed ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created: ${v.createdAt.toISOString()}`);
      console.log('');
    });

    // Summary
    const withPIN = vouchers.filter(v => v.pinCode).length;
    const withQR = vouchers.filter(v => v.qrCodeData).length;
    const withExpiry = vouchers.filter(v => v.expiresAt).length;
    const redeemed = vouchers.filter(v => v.isRedeemed).length;

    console.log('📊 Summary:');
    console.log(`   Total: ${vouchers.length}`);
    console.log(`   With PIN: ${withPIN} (${((withPIN/vouchers.length)*100).toFixed(0)}%)`);
    console.log(`   With QR: ${withQR} (${((withQR/vouchers.length)*100).toFixed(0)}%)`);
    console.log(`   With Expiry: ${withExpiry} (${((withExpiry/vouchers.length)*100).toFixed(0)}%)`);
    console.log(`   Redeemed: ${redeemed} (${((redeemed/vouchers.length)*100).toFixed(0)}%)`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
listAllVouchers()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
