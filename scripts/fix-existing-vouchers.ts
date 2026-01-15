/**
 * Fix existing vouchers that don't have PIN codes or QR codes
 * Run with: npx tsx scripts/fix-existing-vouchers.ts
 */

import { PrismaClient } from '@prisma/client';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '../lib/voucher-utils';

const prisma = new PrismaClient();

async function fixExistingVouchers() {
  console.log('🔧 Fixing existing vouchers without PIN/QR codes...\n');

  try {
    // Find all vouchers without PIN codes
    const vouchersWithoutPIN = await prisma.voucherPurchase.findMany({
      where: {
        OR: [
          { pinCode: null },
          { qrCodeData: null },
          { expiresAt: null },
        ],
        status: 'completed',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log(`Found ${vouchersWithoutPIN.length} vouchers that need fixing\n`);

    if (vouchersWithoutPIN.length === 0) {
      console.log('✅ All vouchers already have PIN codes and QR codes!');
      return;
    }

    let fixed = 0;
    let errors = 0;

    for (const voucher of vouchersWithoutPIN) {
      try {
        console.log(`Fixing voucher ${voucher.id}...`);
        console.log(`  User: ${voucher.userId}`);
        console.log(`  Bundle: ${voucher.voucherId}`);
        console.log(`  Created: ${voucher.createdAt.toISOString()}`);

        // Generate PIN if missing
        let pinCode = voucher.pinCode;
        if (!pinCode) {
          pinCode = await generateUniquePIN(prisma);
          console.log(`  ✅ Generated PIN: ${pinCode}`);
        } else {
          console.log(`  ℹ️  Already has PIN: ${pinCode}`);
        }

        // Generate QR code if missing
        let qrCodeData = voucher.qrCodeData;
        if (!qrCodeData) {
          qrCodeData = generateQRData(voucher.id, voucher.userId, pinCode);
          console.log(`  ✅ Generated QR code`);
        } else {
          console.log(`  ℹ️  Already has QR code`);
        }

        // Calculate expiration if missing
        let expiresAt = voucher.expiresAt;
        if (!expiresAt) {
          expiresAt = calculateExpirationDate(voucher.createdAt);
          console.log(`  ✅ Set expiration: ${expiresAt.toISOString()}`);
        } else {
          console.log(`  ℹ️  Already has expiration: ${expiresAt.toISOString()}`);
        }

        // Update the voucher
        await prisma.voucherPurchase.update({
          where: { id: voucher.id },
          data: {
            pinCode,
            qrCodeData,
            expiresAt,
          },
        });

        console.log(`  ✅ Voucher fixed!\n`);
        fixed++;
      } catch (error) {
        console.error(`  ❌ Error fixing voucher ${voucher.id}:`, error);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Fixed: ${fixed}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📝 Total: ${vouchersWithoutPIN.length}`);

    if (fixed > 0) {
      console.log('\n🎉 Successfully fixed vouchers!');
      console.log('   All vouchers now have PIN codes and QR codes.');
      console.log('   Customers can now redeem their vouchers.');
    }

    // Show sample of fixed vouchers
    if (fixed > 0) {
      console.log('\n📋 Sample of fixed vouchers:');
      const samples = await prisma.voucherPurchase.findMany({
        where: {
          id: { in: vouchersWithoutPIN.slice(0, 3).map(v => v.id) },
        },
        select: {
          id: true,
          voucherId: true,
          pinCode: true,
          expiresAt: true,
        },
      });

      samples.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.voucherId}`);
        console.log(`     PIN: ${v.pinCode}`);
        console.log(`     Expires: ${v.expiresAt?.toISOString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixExistingVouchers()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
