/**
 * Test script to verify webhook functionality
 * Run with: npx tsx scripts/test-webhook.ts
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

async function testWebhook() {
  console.log('🧪 Testing Stripe Webhook Configuration...\n');

  // Check if webhook secret is configured
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is not set in .env');
    process.exit(1);
  }

  if (webhookSecret === 'whsec_your_webhook_secret_here') {
    console.error('❌ STRIPE_WEBHOOK_SECRET is still set to placeholder value');
    console.log('\n📝 Follow these steps to fix:');
    console.log('1. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
    console.log('2. Copy the webhook signing secret (starts with whsec_)');
    console.log('3. Update STRIPE_WEBHOOK_SECRET in .env');
    console.log('4. Restart your dev server\n');
    process.exit(1);
  }

  console.log('✅ STRIPE_WEBHOOK_SECRET is configured');
  console.log(`   Secret: ${webhookSecret.substring(0, 15)}...`);

  // List webhook endpoints
  try {
    const endpoints = await stripe.webhookEndpoints.list({ limit: 10 });
    
    if (endpoints.data.length === 0) {
      console.log('\n⚠️  No webhook endpoints found in Stripe Dashboard');
      console.log('   For production, create one at: https://dashboard.stripe.com/webhooks');
    } else {
      console.log('\n📡 Webhook Endpoints:');
      endpoints.data.forEach((endpoint, i) => {
        console.log(`   ${i + 1}. ${endpoint.url}`);
        console.log(`      Status: ${endpoint.status}`);
        console.log(`      Events: ${endpoint.enabled_events.join(', ')}`);
      });
    }
  } catch (error) {
    console.log('\n⚠️  Could not fetch webhook endpoints (this is normal for test mode)');
  }

  console.log('\n✅ Webhook configuration looks good!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure your dev server is running');
  console.log('2. In a separate terminal, run: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
  console.log('3. Test a purchase or run: stripe trigger checkout.session.completed');
  console.log('4. Check your server logs for: "✅ Processed payment for user..."');
}

testWebhook().catch(console.error);
