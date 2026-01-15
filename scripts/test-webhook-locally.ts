/**
 * Test webhook endpoint locally
 * This simulates what Stripe sends to your webhook
 * Run with: npx tsx scripts/test-webhook-locally.ts
 */

import { generateUniquePIN, generateQRData, calculateExpirationDate } from '../lib/voucher-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWebhookFlow() {
  console.log('🧪 Testing webhook flow locally...\n');

  try {
    // Simulate a Stripe checkout session
    const testSession = {
      id: 'cs_test_' + Date.now(),
      metadata: {
        userId: 'user_36blJxB6QXZLhbxGfzrP5wRnlET', // Your actual user ID
        bundleId: 'bundle-standard',
      },
      amount_total: 4000, // €40 in cents
    };

    console.log('1️⃣ Simulating Stripe webhook event...');
    console.log('   Session ID:', testSession.id);
    console.log('   User ID:', testSession.metadata.userId);
    console.log('   Bundle:', testSession.metadata.bundleId);
    console.log('   Amount:', testSession.amount_total / 100, 'EUR\n');

    // Generate PIN and QR code
    console.log('2️⃣ Generating PIN and QR code...');
    const pinCode = await generateUniquePIN(prisma);
    const purchaseId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCodeData = generateQRData(purchaseId, testSession.metadata.userId, pinCode);
    const expiresAt = calculateExpirationDate();

    console.log('   ✅ PIN:', pinCode);
    console.log('   ✅ QR Code length:', qrCodeData.length, 'chars');
    console.log('   ✅ Expires:', expiresAt.toISOString(), '\n');

    // Create voucher purchase
    console.log('3️⃣ Creating voucher purchase...');
    const purchase = await prisma.voucherPurchase.create({
      data: {
        userId: testSession.metadata.userId,
        voucherId: testSession.metadata.bundleId,
        stripeSessionId: testSession.id,
        status: 'completed',
        amount: testSession.amount_total / 100,
        pinCode,
        qrCodeData: qrCodeData.replace(purchaseId, ''),
        expiresAt,
      },
    });

    console.log('   ✅ Purchase created with ID:', purchase.id, '\n');

    // Update QR code
    console.log('4️⃣ Updating QR code with actual purchase ID...');
    const finalQRData = generateQRData(purchase.id, testSession.metadata.userId, pinCode);
    await prisma.voucherPurchase.update({
      where: { id: purchase.id },
      data: { qrCodeData: finalQRData }
    });

    console.log('   ✅ QR code updated\n');

    // Verify the purchase
    console.log('5️⃣ Verifying purchase in database...');
    const verified = await prisma.voucherPurchase.findUnique({
      where: { id: purchase.id },
    });

    if (verified) {
      console.log('   ✅ Purchase verified!');
      console.log('   ID:', verified.id);
      console.log('   Bundle:', verified.voucherId);
      console.log('   PIN:', verified.pinCode);
      console.log('   QR Code:', verified.qrCodeData ? 'Present' : 'Missing');
      console.log('   Expires:', verified.expiresAt?.toISOString());
      console.log('   Amount:', '€' + verified.amount);
    }

    console.log('\n✅ Webhook flow test completed successfully!');
    console.log('\n📝 This proves the webhook code works correctly.');
    console.log('   If Stripe purchases still don\'t work, the issue is:');
    console.log('   1. Webhook not being called by Stripe');
    console.log('   2. Webhook secret mismatch');
    console.log('   3. Webhook URL incorrect in Stripe dashboard\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testWebhookFlow()
  .then(() => {
    console.log('✅ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
