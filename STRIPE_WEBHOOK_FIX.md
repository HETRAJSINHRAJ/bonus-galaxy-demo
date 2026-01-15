# Stripe Webhook Not Working - Fix Guide

## Problem
Stripe purchases complete successfully, but vouchers are not created because the webhook isn't being triggered.

## Why This Happens

### For Local Development:
- Stripe cannot reach `localhost` from the internet
- Webhooks only work with public URLs

### For Production (Vercel):
- Webhook might not be configured correctly
- Webhook secret might be wrong
- Webhook URL might be incorrect

---

## ✅ Solution 1: For Production (Vercel)

### Step 1: Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter webhook URL:
   ```
   https://bonus-galaxy-demo.vercel.app/api/webhooks/stripe
   ```
4. Select events to listen for:
   - ✅ `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)

### Step 2: Add Webhook Secret to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: `bonus-galaxy-demo`
3. Go to Settings → Environment Variables
4. Add/Update:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
   ```
5. Select "Production" environment
6. Click "Save"

### Step 3: Redeploy

1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Wait for deployment to complete

### Step 4: Test

1. Make a test purchase with card: `4242 4242 4242 4242`
2. Check Stripe Dashboard → Webhooks → Your endpoint
3. Look for recent events
4. Check if status is "Succeeded"
5. Go to `/vouchers` page - voucher should appear with PIN code

---

## ✅ Solution 2: For Local Development

### Option A: Use Stripe CLI (Recommended)

1. **Install Stripe CLI:**
   ```bash
   # Windows (using Scoop)
   scoop install stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to localhost:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   
   This will output a webhook secret like: `whsec_...`

4. **Update your .env file:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_local_secret_here
   ```

5. **Start your dev server (in another terminal):**
   ```bash
   npm run dev
   ```

6. **Test a purchase:**
   - Go to http://localhost:3000/shop
   - Purchase with test card: `4242 4242 4242 4242`
   - Watch the Stripe CLI terminal for webhook events
   - Check your dev server logs for webhook processing

### Option B: Use Recovery Script (Easier)

If you don't want to set up Stripe CLI, just use the recovery script after each purchase:

```bash
npx tsx scripts/recover-stripe-purchases.ts
```

This will find all Stripe purchases without vouchers and create them.

---

## ✅ Solution 3: Automatic Recovery (Best for Production)

Add a cron job to automatically recover missing vouchers:

### Step 1: Create Vercel Cron Job

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/recover-vouchers",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Step 2: Create Cron API Route

Create `app/api/cron/recover-vouchers/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '@/lib/voucher-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get recent completed sessions (last 24 hours)
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: oneDayAgo },
    });

    let recovered = 0;

    for (const session of sessions.data) {
      if (session.status !== 'complete') continue;
      
      const userId = session.metadata?.userId;
      const bundleId = session.metadata?.bundleId;
      
      if (!userId || !bundleId) continue;

      // Check if voucher exists
      const existing = await prisma.voucherPurchase.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (existing) continue;

      // Create missing voucher
      const pinCode = await generateUniquePIN(prisma);
      const tempId = `temp_${Date.now()}`;
      const qrCodeData = generateQRData(tempId, userId, pinCode);
      const expiresAt = calculateExpirationDate(new Date(session.created * 1000));

      const purchase = await prisma.voucherPurchase.create({
        data: {
          userId,
          voucherId: bundleId,
          stripeSessionId: session.id,
          status: 'completed',
          amount: (session.amount_total || 0) / 100,
          pinCode,
          qrCodeData: qrCodeData.replace(tempId, ''),
          expiresAt,
          createdAt: new Date(session.created * 1000),
        },
      });

      // Update QR code
      const finalQR = generateQRData(purchase.id, userId, pinCode);
      await prisma.voucherPurchase.update({
        where: { id: purchase.id },
        data: { qrCodeData: finalQR }
      });

      recovered++;
    }

    return NextResponse.json({ 
      success: true, 
      recovered,
      message: `Recovered ${recovered} missing vouchers`
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

This will automatically check for missing vouchers every hour!

---

## 🔍 Debugging Checklist

### Check 1: Webhook Configuration
```bash
# Check if webhook is configured
curl https://dashboard.stripe.com/webhooks
```

Expected:
- ✅ Endpoint URL: `https://bonus-galaxy-demo.vercel.app/api/webhooks/stripe`
- ✅ Event: `checkout.session.completed`
- ✅ Status: Active

### Check 2: Environment Variables
```bash
# Check Vercel environment variables
vercel env ls
```

Expected:
- ✅ `STRIPE_WEBHOOK_SECRET` is set
- ✅ Value starts with `whsec_`

### Check 3: Webhook Logs
1. Go to Stripe Dashboard → Webhooks
2. Click on your endpoint
3. Check "Events" tab
4. Look for recent `checkout.session.completed` events
5. Check if they succeeded or failed

### Check 4: Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Logs" tab
4. Filter by "webhook"
5. Look for webhook processing logs

---

## 🚀 Quick Fix (Right Now)

If you have Stripe purchases without vouchers right now:

```bash
cd bonus-galaxy-new
npx tsx scripts/recover-stripe-purchases.ts
```

This will immediately create vouchers for all missing Stripe purchases!

---

## 📊 Verify It's Working

After fixing:

1. **Make a test purchase:**
   - Go to `/shop`
   - Buy Standard Bundle
   - Use test card: `4242 4242 4242 4242`

2. **Check Stripe Dashboard:**
   - Go to Webhooks → Your endpoint
   - Should see new `checkout.session.completed` event
   - Status should be "Succeeded"

3. **Check your app:**
   - Go to `/vouchers`
   - New voucher should appear immediately
   - Should have PIN code and QR code

4. **Check Vercel logs:**
   - Should see: `🔔 Webhook received`
   - Should see: `✅ Processed payment for user...`

---

## 💡 Current Status

Based on your setup:
- ✅ Points purchases work (no webhook needed)
- ❌ Stripe purchases don't create vouchers (webhook not firing)
- ✅ Recovery script works (manual fix)

**Root cause:** Webhook is not configured or not reaching your server.

**Best solution:** Configure webhook properly in Stripe Dashboard + Vercel environment variables.

---

## 🆘 Still Not Working?

If webhook still doesn't work after following this guide:

1. **Check webhook secret matches:**
   ```bash
   # In Stripe Dashboard
   Webhook signing secret: whsec_abc123...
   
   # In Vercel Environment Variables
   STRIPE_WEBHOOK_SECRET: whsec_abc123...
   ```
   They must be EXACTLY the same!

2. **Check webhook URL is correct:**
   ```
   https://bonus-galaxy-demo.vercel.app/api/webhooks/stripe
   ```
   No trailing slash, must be HTTPS

3. **Redeploy after changing environment variables:**
   Environment variable changes require a redeploy!

4. **Use recovery script as backup:**
   Run it after each purchase until webhook is fixed
   ```bash
   npx tsx scripts/recover-stripe-purchases.ts
   ```

---

## 📞 Need Help?

If you're still stuck:
1. Share Stripe webhook logs (screenshot)
2. Share Vercel deployment logs
3. Share any error messages
4. I'll help you debug!
