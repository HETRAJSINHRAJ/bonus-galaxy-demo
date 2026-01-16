# Shop Voucher System - Migration Guide

## Overview
This guide walks through migrating from the current simple voucher system to the comprehensive shop-managed voucher system.

## Prerequisites
- Backup your database before starting
- Ensure all current vouchers are in a stable state
- Notify users of upcoming changes

---

## Step 1: Database Schema Migration

### 1.1 Add New Tables

Copy the models from `prisma/schema-shop-system.prisma` into your main `prisma/schema.prisma` file.

```bash
# Generate migration
npx prisma migrate dev --name add_shop_voucher_system

# Apply to production
npx prisma migrate deploy
```

### 1.2 Verify Tables Created

```sql
-- Check new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Shop', 'Employee', 'VoucherOffer', 'UserVoucher', 'ShopAnalytics', 'RedemptionLog');
```

---

## Step 2: Data Migration

### 2.1 Create Default Shops from Partner Locations

```typescript
// scripts/migrate-partner-locations-to-shops.ts
import prisma from '@/lib/prisma';

const PARTNER_LOCATIONS = [
  'Vienna Store',
  'Salzburg Store',
  'Innsbruck Store',
  'Graz Store',
  'Linz Store',
  'Ocono Office',
  'Zur Post',
  'Felsenhof',
  'oe24 Office',
  'RTS Office'
];

async function migratePartnerLocations() {
  console.log('Creating shops from partner locations...');
  
  for (const location of PARTNER_LOCATIONS) {
    const shop = await prisma.shop.create({
      data: {
        name: location,
        description: `Partner location: ${location}`,
        isActive: true,
      }
    });
    
    console.log(`✅ Created shop: ${shop.name} (${shop.id})`);
  }
  
  console.log('✅ Migration complete!');
}

migratePartnerLocations();
```

### 2.2 Migrate Existing Vouchers to VoucherOffers

```typescript
// scripts/migrate-vouchers-to-offers.ts
import prisma from '@/lib/prisma';

async function migrateVouchers() {
  // Get first shop as default
  const defaultShop = await prisma.shop.findFirst();
  if (!defaultShop) {
    throw new Error('No shop found. Run migrate-partner-locations-to-shops.ts first');
  }
  
  // Create a system employee for migration
  const systemEmployee = await prisma.employee.create({
    data: {
      shopId: defaultShop.id,
      userId: 'system',
      name: 'System Migration',
      email: 'system@bonusgalaxy.com',
      redemptionPinHash: await hashPin('0000'), // Temporary PIN
      canCreateVoucher: true,
      canRedeemVoucher: false,
    }
  });
  
  // Get existing vouchers
  const oldVouchers = await prisma.voucher.findMany({
    where: { isActive: true }
  });
  
  console.log(`Migrating ${oldVouchers.length} vouchers...`);
  
  for (const voucher of oldVouchers) {
    const offer = await prisma.voucherOffer.create({
      data: {
        shopId: defaultShop.id,
        createdByEmpId: systemEmployee.id,
        title: voucher.name,
        description: voucher.description,
        priceInPoints: voucher.pointsCost,
        originalPrice: voucher.price,
        discountPercent: voucher.discountPercent,
        isActive: voucher.isActive,
      }
    });
    
    console.log(`✅ Migrated: ${voucher.name} -> ${offer.id}`);
  }
  
  console.log('✅ Voucher migration complete!');
}

migrateVouchers();
```

### 2.3 Migrate VoucherPurchases to UserVouchers

```typescript
// scripts/migrate-purchases-to-user-vouchers.ts
import prisma from '@/lib/prisma';

async function migratePurchases() {
  // Get all completed purchases
  const purchases = await prisma.voucherPurchase.findMany({
    where: {
      status: { in: ['completed', 'redeemed'] }
    }
  });
  
  console.log(`Migrating ${purchases.length} purchases...`);
  
  // Get default offer (you may need to map old voucherId to new offerId)
  const defaultOffer = await prisma.voucherOffer.findFirst();
  if (!defaultOffer) {
    throw new Error('No offers found. Run migrate-vouchers-to-offers.ts first');
  }
  
  for (const purchase of purchases) {
    // Find employee if redeemed
    let redeemedByEmpId = null;
    if (purchase.isRedeemed && purchase.redeemedBy) {
      // Try to find employee by name or create placeholder
      const employee = await prisma.employee.findFirst({
        where: {
          name: purchase.redeemedBy
        }
      });
      redeemedByEmpId = employee?.id;
    }
    
    const userVoucher = await prisma.userVoucher.create({
      data: {
        userId: purchase.userId,
        offerId: defaultOffer.id, // Map to correct offer
        status: purchase.isRedeemed ? 'redeemed' : 'purchased',
        pricePaid: Math.round(purchase.amount), // Convert to points
        purchasedAt: purchase.createdAt,
        pinCode: purchase.pinCode || generatePin(),
        qrCodeData: purchase.qrCodeData,
        redeemedByEmpId,
        redeemedAt: purchase.redeemedAt,
        expiresAt: purchase.expiresAt,
      }
    });
    
    console.log(`✅ Migrated purchase: ${purchase.id} -> ${userVoucher.id}`);
  }
  
  console.log('✅ Purchase migration complete!');
}

migratePurchases();
```

---

## Step 3: Update API Endpoints

### 3.1 Create New Shop APIs

Create these files:
- `app/api/shops/route.ts` - List/create shops
- `app/api/shops/[id]/route.ts` - Get/update shop
- `app/api/shops/[id]/employees/route.ts` - Manage employees
- `app/api/shops/[id]/offers/route.ts` - Manage offers
- `app/api/shops/[id]/analytics/route.ts` - Shop analytics

### 3.2 Update Redemption Flow

Update `app/api/vouchers/redeem/route.ts` to:
1. Verify employee PIN
2. Check employee belongs to shop
3. Log redemption attempt
4. Update shop and employee stats

---

## Step 4: Update UI Components

### 4.1 Mission CMS Updates

Create new pages:
- `/shops` - Shop management
- `/shops/[id]` - Shop details
- `/shops/[id]/employees` - Employee management
- `/shops/[id]/offers` - Offer management
- `/shops/[id]/analytics` - Shop analytics

### 4.2 Redemption App Updates

Update `/partner/redeem/page.tsx`:
- Add employee login
- Add PIN input field
- Show employee info after login
- Verify PIN on redemption

### 4.3 User App Updates

Update `bonus-galaxy-new`:
- Create marketplace view (`/marketplace`)
- Show shop-specific offers
- Update voucher purchase flow
- Show shop info on vouchers

---

## Step 5: Testing

### 5.1 Test Shop Creation
```bash
curl -X POST http://localhost:3000/api/shops \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Shop",
    "description": "Test shop for development"
  }'
```

### 5.2 Test Employee Creation
```bash
curl -X POST http://localhost:3000/api/shops/{shopId}/employees \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "redemptionPin": "1234",
    "canCreateVoucher": true
  }'
```

### 5.3 Test Offer Creation
```bash
curl -X POST http://localhost:3000/api/shops/{shopId}/offers \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy 1 Get 1 Free",
    "description": "Get a free beer with purchase",
    "priceInPoints": 50
  }'
```

### 5.4 Test Redemption with PIN
```bash
curl -X POST http://localhost:3000/api/vouchers/redeem \
  -H "Content-Type: application/json" \
  -d '{
    "voucherId": "voucher_123",
    "employeeId": "emp_123",
    "employeePin": "1234"
  }'
```

---

## Step 6: Deployment

### 6.1 Pre-Deployment Checklist
- [ ] Database backup completed
- [ ] Migration scripts tested on staging
- [ ] All API endpoints tested
- [ ] UI components tested
- [ ] Security audit completed
- [ ] Performance testing done

### 6.2 Deployment Steps
1. Run database migrations
2. Run data migration scripts
3. Deploy API updates
4. Deploy UI updates
5. Monitor for errors

### 6.3 Post-Deployment
- Monitor error logs
- Check redemption flow
- Verify analytics data
- Gather user feedback

---

## Step 7: Rollback Plan

If issues occur:

### 7.1 Database Rollback
```bash
# Revert migration
npx prisma migrate resolve --rolled-back {migration_name}
```

### 7.2 Code Rollback
```bash
# Revert to previous deployment
git revert HEAD
git push origin main
```

### 7.3 Data Restoration
```bash
# Restore from backup
pg_restore -d bonus_galaxy backup.dump
```

---

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Planning | 1 day | Review spec, prepare scripts |
| Schema Migration | 1 day | Create tables, test migrations |
| Data Migration | 2 days | Migrate shops, vouchers, purchases |
| API Development | 5 days | Build new endpoints |
| UI Development | 7 days | Update all interfaces |
| Testing | 3 days | End-to-end testing |
| Deployment | 1 day | Production deployment |
| **Total** | **20 days** | |

---

## Support

For issues during migration:
1. Check migration logs
2. Review error messages
3. Test on staging first
4. Contact development team

---

**Document Version**: 1.0  
**Last Updated**: January 16, 2026
