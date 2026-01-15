/**
 * Seed the Voucher table with bundle definitions
 * Run with: npx tsx scripts/seed-vouchers.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vouchers = [
  {
    id: 'bundle-standard',
    name: 'Standard Bundle',
    description: '10 Gutscheine im Gesamtwert von €400 von gutschein.at',
    partnerName: 'gutschein.at',
    partnerLogoUrl: null,
    price: 40,
    pointsCost: 4000,
    discountPercent: 0,
    paymentMethod: 'cash', // Only buyable with cash
    isActive: true,
  },
  {
    id: 'bundle-premium',
    name: 'Premium Bundle',
    description: '10 Exklusive Gutscheine im Wert von €800 inkl. Bonuspunkte',
    partnerName: 'gutschein.at',
    partnerLogoUrl: null,
    price: 75,
    pointsCost: 7500,
    discountPercent: 0,
    paymentMethod: 'points', // Only buyable with points
    isActive: true,
  },
  {
    id: 'bundle-deluxe',
    name: 'Deluxe Bundle',
    description: '10 Premium Gutscheine im Wert von €1200 mit Extra-Rewards',
    partnerName: 'gutschein.at',
    partnerLogoUrl: null,
    price: 100,
    pointsCost: 10000,
    discountPercent: 0,
    paymentMethod: 'cash', // Only buyable with cash
    isActive: true,
  },
];

async function seedVouchers() {
  console.log('🌱 Seeding Voucher table...\n');

  try {
    for (const voucher of vouchers) {
      const existing = await prisma.voucher.findUnique({
        where: { id: voucher.id },
      });

      if (existing) {
        console.log(`⏭️  Voucher "${voucher.name}" already exists, updating...`);
        await prisma.voucher.update({
          where: { id: voucher.id },
          data: voucher,
        });
        console.log(`✅ Updated: ${voucher.name}\n`);
      } else {
        await prisma.voucher.create({
          data: voucher,
        });
        console.log(`✅ Created: ${voucher.name}`);
        console.log(`   ID: ${voucher.id}`);
        console.log(`   Price: €${voucher.price}`);
        console.log(`   Points: ${voucher.pointsCost}`);
        console.log(`   Payment: ${voucher.paymentMethod}\n`);
      }
    }

    console.log('✅ Voucher seeding completed!\n');

    // Show all vouchers
    const allVouchers = await prisma.voucher.findMany({
      orderBy: { price: 'asc' },
    });

    console.log('📋 Current vouchers in database:');
    allVouchers.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.name} (${v.id})`);
      console.log(`     Price: €${v.price} | Points: ${v.pointsCost}`);
      console.log(`     Payment: ${v.paymentMethod} | Active: ${v.isActive}`);
    });

  } catch (error) {
    console.error('❌ Error seeding vouchers:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedVouchers()
  .then(() => {
    console.log('\n✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
