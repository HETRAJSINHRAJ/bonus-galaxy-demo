/**
 * Seed Voucher Bundles
 * 
 * This script creates the initial voucher bundles in the database
 * Run with: npx tsx scripts/seed-voucher-bundles.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bundles = [
  {
    name: 'Standard Bundle',
    description: '10 Gutscheine im Gesamtwert von €400 von gutschein.at',
    price: 40,
    value: 400,
    pointsCost: 4000,
    voucherCount: 10,
    paymentMethod: 'cash',
    features: [
      '10 Gutscheine von Top-Partnern',
      'Sofortige digitale Zustellung',
      'Bis zu 30% Rabatt',
      'Unbegrenzt gültig',
    ],
    isPopular: false,
    displayOrder: 1,
  },
  {
    name: 'Premium Bundle',
    description: '10 Exklusive Gutscheine im Wert von €800 inkl. Bonuspunkte',
    price: 75,
    value: 800,
    pointsCost: 7500,
    voucherCount: 10,
    paymentMethod: 'points',
    features: [
      'Alle Standard-Vorteile',
      '+ 5000 Bonuspunkte',
      'Exklusive Partner-Angebote',
      'Priority Support',
    ],
    isPopular: true,
    displayOrder: 2,
  },
  {
    name: 'Deluxe Bundle',
    description: '10 Premium Gutscheine im Wert von €1200 mit Extra-Rewards',
    price: 100,
    value: 1200,
    pointsCost: 10000,
    voucherCount: 10,
    paymentMethod: 'cash',
    features: [
      'Alle Premium-Vorteile',
      '+ 10000 Bonuspunkte',
      'Zugang zu VIP-Angeboten',
      'Persönlicher Account-Manager',
    ],
    isPopular: false,
    displayOrder: 3,
  },
];

async function main() {
  console.log('🌱 Seeding voucher bundles...');

  for (const bundle of bundles) {
    // Check if bundle already exists
    const existing = await prisma.voucherBundle.findFirst({
      where: { name: bundle.name },
    });

    if (existing) {
      console.log(`✓ Bundle "${bundle.name}" already exists, updating...`);
      await prisma.voucherBundle.update({
        where: { id: existing.id },
        data: bundle,
      });
    } else {
      console.log(`+ Creating bundle "${bundle.name}"...`);
      await prisma.voucherBundle.create({
        data: bundle,
      });
    }
  }

  console.log('✅ Voucher bundles seeded successfully!');

  // Display created bundles
  const allBundles = await prisma.voucherBundle.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  console.log('\n📦 Active Bundles:');
  allBundles.forEach((bundle) => {
    console.log(`  - ${bundle.name} (€${bundle.price} / ${bundle.pointsCost} points)`);
  });
}

main()
  .catch((error) => {
    console.error('❌ Error seeding bundles:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
