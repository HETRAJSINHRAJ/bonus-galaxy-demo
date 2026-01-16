# CORS Fix for mission-cms API Access

## Problem
`mission-cms` (localhost:3001) was blocked from calling APIs on `bonus-galaxy-new` (vercel.app) due to CORS policy.

## Solution Applied

Added CORS headers to the voucher API endpoints:
- `/api/vouchers/validate`
- `/api/vouchers/redeem`

### Changes Made

1. **Added CORS Headers**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows all origins
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

2. **Added OPTIONS Handler** (for preflight requests)
```typescript
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}
```

3. **Added Headers to All Responses**
Every `NextResponse.json()` now includes `{ headers: corsHeaders }`

## Files Modified
- `app/api/vouchers/validate/route.ts`
- `app/api/vouchers/redeem/route.ts`

## Deployment Required

⚠️ **These changes need to be deployed to Vercel to work!**

### Deploy to Vercel:

**Option 1: Automatic (if connected to GitHub)**
```bash
git push origin main
# Vercel will auto-deploy
```

**Option 2: Manual Deploy**
```bash
cd bonus-galaxy-new
vercel --prod
```

**Option 3: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments"
4. Click "Redeploy" on the latest deployment

## Testing After Deployment

1. Wait for Vercel deployment to complete (~2 minutes)
2. Go to `http://localhost:3001/partner/redeem` (mission-cms)
3. Try to validate a voucher
4. Should work without CORS errors

## Security Note

Currently using `'Access-Control-Allow-Origin': '*'` which allows **all origins**.

### For Production, Consider:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://your-mission-cms-domain.com'
    : '*',
  // ... rest
};
```

This restricts access to only your mission-cms domain in production.

## Alternative: Use Same Domain

Instead of CORS, you could:
1. Deploy mission-cms to same domain as bonus-galaxy-new
2. Use subdomain: `admin.bonus-galaxy-demo.vercel.app`
3. No CORS needed - same origin!

---

**Status**: ✅ Fixed locally, ⏳ Needs Vercel deployment
**Date**: January 16, 2026
