/**
 * Script to backfill existing voucher purchases with PIN codes and QR data
 * Run with: npx tsx scripts/backfill-voucher-codes.ts
 */

import { PrismaClient } from '@prisma/client';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '../lib/voucher-utils';

const prisma = new PrismaClient();

async function backfillVoucherCodes() {
  console.log('🔄 Starting voucher codes backfill...\n');
  
  try {
    // Find all completed voucher purchases without PIN codes
    const purchases = await prisma.voucherPurchase.findMany({
      where: {
        status: 'completed',
        pinCode: null
      }
    });
    
    console.log(`📦 Found ${purchases.length} voucher purchases to update\n`);
    
    if (purchases.length === 0) {
      console.log('✅ No vouchers need updating. All done!');
      return;
    }
    
    let updated = 0;
    let failed = 0;
    
    for (const purchase of purchases) {
      try {
        // Generate unique PIN
        const pinCode = await generateUniquePIN(prisma);
        
        // Generate QR code data
        const qrCodeData = generateQRData(purchase.id, purchase.userId, pinCode);
        
        // Calculate expiration date (1 year from purchase)
        const expiresAt = calculateExpirationDate(purchase.createdAt);
        
        // Update the purchase
        await prisma.voucherPurchase.update({
          where: { id: purchase.id },
          data: {
            pinCode,
            qrCodeData,
            expiresAt
          }
        });
        
        updated++;
        console.log(`✓ Updated voucher ${purchase.id} - PIN: ${pinCode}`);
        
      } catch (error) {
        failed++;
        console.error(`✗ Failed to update voucher ${purchase.id}:`, error);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Backfill Summary:`);
    console.log(`   Total processed: ${purchases.length}`);
    console.log(`   Successfully updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
    console.log('='.repeat(50));
    
    if (updated > 0) {
      console.log('\n✅ Backfill completed successfully!');
    }
    
  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
backfillVoucherCodes().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
