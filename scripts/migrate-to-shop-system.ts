/**
 * Migration Script: Convert existing voucher system to shop-based system
 * 
 * This script:
 * 1. Creates shops from partner locations
 * 2. Creates system employees for each shop
 * 3. Migrates existing vouchers to voucher offers
 * 4. Migrates existing voucher purchases to user vouchers
 * 
 * Run with: npx tsx scripts/migrate-to-shop-system.ts
 */

import prisma from '../lib/prisma';
import { hashPin } from '../lib/pin-utils';

const PARTNER_LOCATIONS = [
  'Vienna Store',
  'Salzburg Store',
  'Innsbruck Store',
  'Graz Store',
  'Linz Store',
  'Ocono Office',
  'Zur Post',
  'Felsenhof',
  'oe24 Office',
  'RTS Office'
];

async function main() {
  console.log('🚀 Starting migration to shop-based voucher system...\n');

  try {
    // Step 1: Create shops from partner locations
    console.log('📍 Step 1: Creating shops from partner locations...');
    const shops = [];
    
    for (const location of PARTNER_LOCATIONS) {
      const shop = await prisma.shop.create({
        data: {
          name: location,
          description: `Partner location: ${location}`,
          isActive: true,
        },
      });
      shops.push(shop);
      console.log(`  ✅ Created shop: ${shop.name} (${shop.id})`);
    }
    console.log(`✅ Created ${shops.length} shops\n`);

    // Step 2: Create system employees for each shop
    console.log('👥 Step 2: Creating system employees...');
    const systemPinHash = await hashPin('0000'); // Default PIN for migration
    const employees = [];

    for (const shop of shops) {
      const employee = await prisma.employee.create({
        data: {
          shopId: shop.id,
          userId: 'system_migration',
          name: 'System Migration',
          email: `system@${shop.id}.bonusgalaxy.com`,
          redemptionPinHash: systemPinHash,
          canCreateVoucher: true,
          canRedeemVoucher: true,
          isManager: true,
        },
      });
      employees.push(employee);
      console.log(`  ✅ Created employee for: ${shop.name}`);
    }
    console.log(`✅ Created ${employees.length} system employees\n`);

    // Step 3: Migrate existing vouchers to voucher offers
    console.log('🎫 Step 3: Migrating vouchers to offers...');
    const oldVouchers = await prisma.voucher.findMany({
      where: { isActive: true },
    });

    const offerMap = new Map<string, string>(); // old voucher ID -> new offer ID

    for (const voucher of oldVouchers) {
      // Use first shop as default
      const defaultShop = shops[0];
      const defaultEmployee = employees[0];

      const offer = await prisma.voucherOffer.create({
        data: {
          shopId: defaultShop.id,
          createdByEmpId: defaultEmployee.id,
          title: voucher.name,
          description: voucher.description,
          priceInPoints: voucher.pointsCost || Math.round(voucher.price * 10),
          originalPrice: voucher.price,
          discountPercent: voucher.discountPercent,
          category: voucher.partnerName,
          isActive: voucher.isActive,
        },
      });

      offerMap.set(voucher.id, offer.id);
      console.log(`  ✅ Migrated: ${voucher.name} -> ${offer.id}`);
    }
    console.log(`✅ Migrated ${oldVouchers.length} vouchers to offers\n`);

    // Step 4: Migrate voucher purchases to user vouchers
    console.log('💳 Step 4: Migrating voucher purchases...');
    const purchases = await prisma.voucherPurchase.findMany({
      where: {
        status: { in: ['completed', 'redeemed'] },
      },
    });

    let migratedCount = 0;
    let skippedCount = 0;

    for (const purchase of purchases) {
      try {
        // Find corresponding offer
        const offerId = offerMap.get(purchase.voucherId);
        if (!offerId) {
          console.log(`  ⚠️  Skipped: No offer found for voucher ${purchase.voucherId}`);
          skippedCount++;
          continue;
        }

        // Find employee if redeemed
        let redeemedByEmpId = null;
        if (purchase.isRedeemed && purchase.redeemedLocation) {
          const shop = shops.find(s => s.name === purchase.redeemedLocation);
          if (shop) {
            const employee = employees.find(e => e.shopId === shop.id);
            redeemedByEmpId = employee?.id;
          }
        }

        // Create user voucher
        await prisma.userVoucher.create({
          data: {
            userId: purchase.userId,
            offerId,
            status: purchase.isRedeemed ? 'redeemed' : 'purchased',
            pricePaid: Math.round(purchase.amount),
            purchasedAt: purchase.createdAt,
            pinCode: purchase.pinCode || `MIG${Math.floor(1000 + Math.random() * 9000)}`,
            qrCodeData: purchase.qrCodeData,
            redeemedByEmpId,
            redeemedAt: purchase.redeemedAt,
            expiresAt: purchase.expiresAt,
          },
        });

        migratedCount++;
        
        if (migratedCount % 10 === 0) {
          console.log(`  📊 Progress: ${migratedCount}/${purchases.length}`);
        }
      } catch (error) {
        console.error(`  ❌ Error migrating purchase ${purchase.id}:`, error);
        skippedCount++;
      }
    }

    console.log(`✅ Migrated ${migratedCount} purchases`);
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} purchases\n`);
    }

    // Step 5: Update shop stats
    console.log('📊 Step 5: Updating shop statistics...');
    for (const shop of shops) {
      const soldCount = await prisma.userVoucher.count({
        where: {
          offer: { shopId: shop.id },
        },
      });

      const redeemedCount = await prisma.userVoucher.count({
        where: {
          offer: { shopId: shop.id },
          status: 'redeemed',
        },
      });

      const revenue = await prisma.userVoucher.aggregate({
        where: {
          offer: { shopId: shop.id },
          status: 'redeemed',
        },
        _sum: {
          pricePaid: true,
        },
      });

      await prisma.shop.update({
        where: { id: shop.id },
        data: {
          totalVouchersSold: soldCount,
          totalVouchersRedeemed: redeemedCount,
          nequadaBalance: revenue._sum.pricePaid || 0,
        },
      });

      console.log(`  ✅ Updated stats for: ${shop.name}`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - Shops created: ${shops.length}`);
    console.log(`  - Employees created: ${employees.length}`);
    console.log(`  - Offers created: ${oldVouchers.length}`);
    console.log(`  - User vouchers migrated: ${migratedCount}`);
    console.log(`  - Skipped: ${skippedCount}`);
    console.log('\n⚠️  Important: System employees have PIN "0000" - please update!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
