/**
 * Test Voucher Bundles API
 * 
 * This script tests the voucher bundles API endpoint
 * Run with: npx tsx scripts/test-voucher-bundles-api.ts
 */

async function testAPI() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  console.log('🧪 Testing Voucher Bundles API...\n');
  console.log(`📡 API URL: ${API_URL}\n`);

  try {
    console.log('GET /voucher-bundles');
    const response = await fetch(`${API_URL}/voucher-bundles`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`✅ Success! Found ${data.bundles.length} bundles\n`);
    
    data.bundles.forEach((bundle: any, index: number) => {
      console.log(`${index + 1}. ${bundle.name}`);
      console.log(`   ID: ${bundle.id}`);
      console.log(`   Price: €${bundle.price} / ${bundle.pointsCost} points`);
      console.log(`   Value: €${bundle.value}`);
      console.log(`   Payment: ${bundle.paymentMethod}`);
      console.log(`   Popular: ${bundle.isPopular ? 'Yes ⭐' : 'No'}`);
      console.log(`   Features: ${bundle.features.length} items`);
      console.log('');
    });

    console.log('✅ API test passed!\n');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.log('\n💡 Make sure:');
    console.log('   1. bonus-galaxy-new is running (npm run dev)');
    console.log('   2. Database is seeded (npx tsx scripts/setup-voucher-bundles.ts)');
    console.log('   3. API_URL is correct\n');
    process.exit(1);
  }
}

testAPI();
