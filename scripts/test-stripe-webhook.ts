/**
 * Test Stripe webhook locally
 * This simulates a Stripe checkout.session.completed event
 * Run with: npx tsx scripts/test-stripe-webhook.ts
 */

import { PrismaClient } from '@prisma/client';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '../lib/voucher-utils';

const prisma = new PrismaClient();

async function testStripeWebhook() {
  console.log('🧪 Testing Stripe webhook flow...\n');

  try {
    // Simulate a Stripe session
    const mockSession = {
      id: 'cs_test_manual_' + Date.now(),
      metadata: {
        userId: 'user_36blJxB6QXZLhbxGfzrP5wRnlET', // Your user ID
        bundleId: 'bundle-standard',
      },
      amount_total: 4000, // €40 in cents
    };

    console.log('📦 Simulating Stripe webhook event:');
    console.log('   Event: checkout.session.completed');
    console.log('   Session ID:', mockSession.id);
    console.log('   User ID:', mockSession.metadata.userId);
    console.log('   Bundle:', mockSession.metadata.bundleId);
    console.log('   Amount:', mockSession.amount_total / 100, 'EUR\n');

    // Check if this session already has a voucher
    const existing = await prisma.voucherPurchase.findFirst({
      where: { stripeSessionId: mockSession.id },
    });

    if (existing) {
      console.log('⚠️  This session already has a voucher!');
      console.log('   Voucher ID:', existing.id);
      console.log('   PIN:', existing.pinCode);
      return;
    }

    // Generate PIN and QR code
    console.log('🔐 Generating PIN and QR code...');
    const pinCode = await generateUniquePIN(prisma);
    const purchaseId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCodeData = generateQRData(purchaseId, mockSession.metadata.userId, pinCode);
    const expiresAt = calculateExpirationDate();

    console.log('   ✅ PIN:', pinCode);
    console.log('   ✅ Expires:', expiresAt.toISOString(), '\n');

    // Create voucher purchase
    console.log('💾 Creating voucher purchase...');
    const purchase = await prisma.voucherPurchase.create({
      data: {
        userId: mockSession.metadata.userId,
        voucherId: mockSession.metadata.bundleId,
        stripeSessionId: mockSession.id,
        status: 'completed',
        amount: mockSession.amount_total / 100,
        pinCode,
        qrCodeData: qrCodeData.replace(purchaseId, ''),
        expiresAt,
      },
    });

    console.log('   ✅ Purchase created with ID:', purchase.id, '\n');

    // Update QR code
    console.log('🔄 Updating QR code with actual purchase ID...');
    const finalQRData = generateQRData(purchase.id, mockSession.metadata.userId, pinCode);
    await prisma.voucherPurchase.update({
      where: { id: purchase.id },
      data: { qrCodeData: finalQRData }
    });

    console.log('   ✅ QR code updated\n');

    // Verify
    const verified = await prisma.voucherPurchase.findUnique({
      where: { id: purchase.id },
    });

    console.log('✅ Webhook simulation completed successfully!\n');
    console.log('📋 Created voucher:');
    console.log('   ID:', verified?.id);
    console.log('   PIN:', verified?.pinCode);
    console.log('   Bundle:', verified?.voucherId);
    console.log('   Amount: €' + verified?.amount);
    console.log('   Expires:', verified?.expiresAt?.toISOString());
    console.log('\n💡 Now check /vouchers page to see this voucher!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testStripeWebhook()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
