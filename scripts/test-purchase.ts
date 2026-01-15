/**
 * Test script to verify voucher purchase creation
 * Run with: npx tsx scripts/test-purchase.ts
 */

import { PrismaClient } from '@prisma/client';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '../lib/voucher-utils';

const prisma = new PrismaClient();

async function testPurchase() {
  console.log('🧪 Testing voucher purchase creation...\n');

  try {
    // Test 1: Check database connection
    console.log('1️⃣ Testing database connection...');
    const purchaseCount = await prisma.voucherPurchase.count();
    console.log(`✅ Database connected. Voucher purchases in DB: ${purchaseCount}\n`);

    // Test 2: Generate PIN
    console.log('2️⃣ Testing PIN generation...');
    const pinCode = await generateUniquePIN(prisma);
    console.log(`✅ Generated PIN: ${pinCode}\n`);

    // Test 3: Generate QR code
    console.log('3️⃣ Testing QR code generation...');
    const testUserId = 'test_user_123';
    const testPurchaseId = 'test_purchase_123';
    const qrCodeData = generateQRData(testPurchaseId, testUserId, pinCode);
    console.log(`✅ Generated QR code (length: ${qrCodeData.length} chars)\n`);

    // Test 4: Calculate expiration
    console.log('4️⃣ Testing expiration date...');
    const expiresAt = calculateExpirationDate();
    console.log(`✅ Expiration date: ${expiresAt.toISOString()}\n`);

    // Test 5: Check existing voucher purchases
    console.log('5️⃣ Checking existing voucher purchases...');
    const purchases = await prisma.voucherPurchase.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        voucherId: true,
        status: true,
        amount: true,
        pinCode: true,
        qrCodeData: true,
        createdAt: true,
      }
    });
    
    console.log(`Found ${purchases.length} recent purchases:`);
    purchases.forEach((p, i) => {
      console.log(`  ${i + 1}. ID: ${p.id}`);
      console.log(`     User: ${p.userId}`);
      console.log(`     Bundle: ${p.voucherId}`);
      console.log(`     Status: ${p.status}`);
      console.log(`     Amount: €${p.amount}`);
      console.log(`     PIN: ${p.pinCode || '❌ MISSING'}`);
      console.log(`     QR: ${p.qrCodeData ? '✅ Present' : '❌ MISSING'}`);
      console.log(`     Created: ${p.createdAt.toISOString()}`);
      console.log('');
    });

    // Test 6: Create a test purchase
    console.log('6️⃣ Creating a test voucher purchase...');
    const testPinCode = await generateUniquePIN(prisma);
    const tempId = `temp_${Date.now()}`;
    const testQRData = generateQRData(tempId, 'test_user_script', testPinCode);
    const testExpiresAt = calculateExpirationDate();

    const testPurchase = await prisma.voucherPurchase.create({
      data: {
        userId: 'test_user_script',
        voucherId: 'bundle-standard',
        status: 'completed',
        amount: 40,
        pinCode: testPinCode,
        qrCodeData: testQRData.replace(tempId, ''),
        expiresAt: testExpiresAt,
      },
    });

    console.log(`✅ Test purchase created with ID: ${testPurchase.id}`);
    console.log(`   PIN: ${testPurchase.pinCode}`);
    console.log(`   Expires: ${testPurchase.expiresAt?.toISOString()}\n`);

    // Update with final QR code
    const finalQR = generateQRData(testPurchase.id, 'test_user_script', testPinCode);
    await prisma.voucherPurchase.update({
      where: { id: testPurchase.id },
      data: { qrCodeData: finalQR }
    });
    console.log(`✅ Updated QR code with actual purchase ID\n`);

    console.log('✅ All tests passed! The voucher system is working correctly.\n');
    console.log('📝 Note: You can delete the test purchase from the database if needed.');
    console.log(`   DELETE FROM "VoucherPurchase" WHERE id = '${testPurchase.id}';\n`);

  } catch (error) {
    console.error('❌ Error during testing:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testPurchase()
  .then(() => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
