/**
 * Setup Voucher Bundles System
 * 
 * This script:
 * 1. Generates Prisma client with new schema
 * 2. Seeds initial voucher bundles
 * 
 * Run with: npx tsx scripts/setup-voucher-bundles.ts
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

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
  console.log('🚀 Setting up Voucher Bundles System...\n');

  // Step 1: Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated\n');
  } catch (error) {
    console.error('❌ Failed to generate Prisma Client');
    throw error;
  }

  // Step 2: Check if VoucherBundle table exists
  console.log('🔍 Checking database schema...');
  try {
    await prisma.$queryRaw`SELECT 1 FROM "VoucherBundle" LIMIT 1`;
    console.log('✅ VoucherBundle table exists\n');
  } catch (error) {
    console.log('⚠️  VoucherBundle table does not exist');
    console.log('📝 Please run: npx prisma db push');
    console.log('   Or: npx prisma migrate dev --name add_voucher_bundles\n');
    process.exit(1);
  }

  // Step 3: Seed bundles
  console.log('🌱 Seeding voucher bundles...');

  for (const bundle of bundles) {
    // Check if bundle already exists
    const existing = await prisma.voucherBundle.findFirst({
      where: { name: bundle.name },
    });

    if (existing) {
      console.log(`  ✓ Bundle "${bundle.name}" already exists, updating...`);
      await prisma.voucherBundle.update({
        where: { id: existing.id },
        data: bundle,
      });
    } else {
      console.log(`  + Creating bundle "${bundle.name}"...`);
      await prisma.voucherBundle.create({
        data: bundle,
      });
    }
  }

  console.log('\n✅ Voucher bundles seeded successfully!\n');

  // Display created bundles
  const allBundles = await prisma.voucherBundle.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  console.log('📦 Active Bundles:');
  allBundles.forEach((bundle) => {
    const popular = bundle.isPopular ? '⭐' : '  ';
    console.log(`  ${popular} ${bundle.name}`);
    console.log(`     💰 €${bundle.price} / ${bundle.pointsCost} points`);
    console.log(`     💎 Value: €${bundle.value} (${Math.round((bundle.value - bundle.price) / bundle.value * 100)}% savings)`);
    console.log(`     💳 Payment: ${bundle.paymentMethod}`);
    console.log('');
  });

  console.log('🎉 Setup complete! You can now:');
  console.log('   1. View bundles in mission-cms at /dashboard/bundles');
  console.log('   2. See them in the mobile app shop');
  console.log('   3. Manage them via the API at /api/voucher-bundles\n');
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
