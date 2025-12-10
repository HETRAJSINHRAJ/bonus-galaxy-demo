# Payment Method Restriction - Implementation Summary

## What Changed

Each voucher bundle can now only be purchased with ONE payment method - either **cash (Stripe)** OR **points**, but not both.

## Changes Made

### 1. Database Schema Update
- Added `paymentMethod` field to the `Voucher` model in Prisma schema
- Values: `"cash"` or `"points"`
- Default: `"cash"` (for backward compatibility)
- Migration applied successfully to database

### 2. Voucher Bundle Configuration
Updated the three bundles in `/app/shop/page.tsx`:

- **Standard Bundle** (€40) → `paymentMethod: 'cash'` ✅ Only buyable with card
- **Premium Bundle** (€75) → `paymentMethod: 'points'` ✅ Only buyable with points
- **Deluxe Bundle** (€100) → `paymentMethod: 'cash'` ✅ Only buyable with card

### 3. UI Component Update
Modified `/components/shop/voucher-card.tsx`:
- Now checks the `paymentMethod` field
- Only displays the appropriate payment button
- If `paymentMethod === 'cash'` → Shows "Mit Karte kaufen" button only
- If `paymentMethod === 'points'` → Shows "Mit Punkten kaufen" button only

## How It Works Now

### For Cash-Only Vouchers:
- Users see only the Stripe payment button
- Points payment option is hidden
- Example: Standard Bundle, Deluxe Bundle

### For Points-Only Vouchers:
- Users see only the points payment button
- Stripe payment option is hidden
- Shows "not enough points" message if user doesn't have sufficient points
- Example: Premium Bundle

## Testing

To test the changes:
1. Visit `/shop` page
2. Verify Standard Bundle shows only card payment
3. Verify Premium Bundle shows only points payment
4. Verify Deluxe Bundle shows only card payment

## Future Vouchers

When adding new vouchers, simply set the `paymentMethod` field:
```typescript
{
  id: 'new-bundle',
  name: 'New Bundle',
  // ... other fields
  paymentMethod: 'cash', // or 'points'
}
```

## Database Migration

Migration file: `20251210134105_add_payment_method_to_voucher`
- Applied successfully ✅
- All existing vouchers default to `'cash'` payment method
