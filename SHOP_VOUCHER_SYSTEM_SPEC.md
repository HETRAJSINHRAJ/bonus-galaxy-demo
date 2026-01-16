# Shop Voucher Management System - Implementation Specification

## Overview
Transform the current voucher system into a comprehensive shop-managed voucher platform with employee tracking, PIN-based redemption, and detailed analytics.

## Current System vs. New System

### Current System:
- Vouchers are purchased by users from a central shop
- Fixed voucher bundles (5, 10, 20 vouchers)
- Simple PIN/QR redemption at partner locations
- Basic redemption tracking (location, employee ID as text)

### New System:
- **Shops** create their own voucher offers
- **Employees** manage vouchers with PIN-based authentication
- **Users** purchase shop-specific vouchers
- **Detailed tracking** of creation, sales, and redemptions
- **Analytics** for shops and employees

---

## 1. Database Schema

### A. Shop Table
```prisma
model Shop {
  id              String    @id @default(cuid())
  name            String
  description     String?
  address         String?
  latitude        Float?
  longitude       Float?
  logo            String?   // URL to logo image
  
  // Wallet & Points
  nequadaBalance  Int       @default(0) // Shop's accumulated points
  
  // Stats
  totalVouchersSold     Int @default(0)
  totalVouchersRedeemed Int @default(0)
  
  // Relationships
  employees       Employee[]
  voucherOffers   VoucherOffer[]
  
  // Metadata
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([isActive])
}
```

### B. Employee Table
```prisma
model Employee {
  id              String    @id @default(cuid())
  shopId          String
  shop            Shop      @relation(fields: [shopId], references: [id], onDelete: Cascade)
  
  // User Info
  userId          String    // Links to Clerk user
  name            String
  email           String
  
  // Security
  redemptionPinHash String  // Hashed 4-6 digit PIN for redemption
  
  // Permissions
  canCreateVoucher  Boolean @default(false)
  canRedeemVoucher  Boolean @default(true)
  
  // Relationships
  createdOffers     VoucherOffer[]  @relation("CreatedBy")
  redemptions       UserVoucher[]   @relation("RedeemedBy")
  
  // Metadata
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([shopId, userId])
  @@index([shopId])
  @@index([userId])
}
```

### C. VoucherOffer Table (The Product)
```prisma
model VoucherOffer {
  id              String    @id @default(cuid())
  shopId          String
  shop            Shop      @relation(fields: [shopId], references: [id], onDelete: Cascade)
  
  createdByEmpId  String
  createdBy       Employee  @relation("CreatedBy", fields: [createdByEmpId], references: [id])
  
  // Offer Details
  title           String
  description     String
  termsOfService  String?
  
  // Pricing
  priceInPoints   Int       // Cost in Nequada points
  
  // Limits
  quota           Int?      // Optional: Max number of sales
  soldCount       Int       @default(0)
  
  // Validity
  validFrom       DateTime  @default(now())
  validUntil      DateTime?
  
  // Relationships
  userVouchers    UserVoucher[]
  
  // Metadata
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([shopId])
  @@index([isActive])
  @@index([validFrom, validUntil])
}
```

### D. UserVoucher Table (The Instance)
```prisma
model UserVoucher {
  id              String    @id @default(cuid())
  
  // Ownership
  userId          String
  offerId         String
  offer           VoucherOffer @relation(fields: [offerId], references: [id])
  
  // Status
  status          String    @default("purchased") // purchased, redeemed, expired
  
  // Purchase Info
  purchasedAt     DateTime  @default(now())
  pricePaid       Int       // Points paid at purchase
  
  // Redemption Info
  redeemedByEmpId String?
  redeemedBy      Employee? @relation("RedeemedBy", fields: [redeemedByEmpId], references: [id])
  redeemedAt      DateTime?
  
  // QR/PIN Codes
  pinCode         String    @unique
  qrCodeData      String?   // Encrypted QR data
  
  // Metadata
  expiresAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([offerId])
  @@index([status])
  @@index([pinCode])
}
```

---

## 2. API Endpoints

### Shop Management

#### POST /api/shops
Create a new shop
```typescript
{
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
}
```

#### GET /api/shops
List all shops (public)

#### GET /api/shops/:id
Get shop details

#### PUT /api/shops/:id
Update shop (admin only)

### Employee Management

#### POST /api/shops/:shopId/employees
Add employee to shop
```typescript
{
  userId: string;
  name: string;
  email: string;
  redemptionPin: string; // Will be hashed
  canCreateVoucher: boolean;
  canRedeemVoucher: boolean;
}
```

#### GET /api/shops/:shopId/employees
List shop employees

#### PUT /api/employees/:id/pin
Update employee redemption PIN
```typescript
{
  currentPin: string;
  newPin: string;
}
```

### Voucher Offer Management

#### POST /api/shops/:shopId/offers
Create voucher offer (requires canCreateVoucher permission)
```typescript
{
  title: string;
  description: string;
  termsOfService?: string;
  priceInPoints: number;
  quota?: number;
  validFrom?: Date;
  validUntil?: Date;
}
```

#### GET /api/shops/:shopId/offers
List shop's voucher offers

#### GET /api/offers
List all active offers (marketplace)

#### PUT /api/offers/:id
Update offer

### User Voucher Purchase & Redemption

#### POST /api/offers/:offerId/purchase
User purchases a voucher
```typescript
{
  userId: string;
  quantity: number;
}
```

#### POST /api/vouchers/validate
Validate voucher for redemption
```typescript
{
  method: "pin" | "qr";
  code: string;
  employeeId: string;
}
```

#### POST /api/vouchers/redeem
Redeem voucher with employee PIN
```typescript
{
  voucherId: string;
  employeeId: string;
  employeePin: string; // Verified against redemptionPinHash
}
```

### Analytics

#### GET /api/shops/:shopId/analytics
Shop analytics dashboard
```typescript
{
  totalVouchersSold: number;
  totalVouchersRedeemed: number;
  redemptionRate: number;
  nequadaBalance: number;
  topOffers: Array<{offerId, title, soldCount, redeemedCount}>;
  employeeActivity: Array<{employeeId, name, redemptionCount}>;
}
```

#### GET /api/employees/:id/analytics
Employee performance metrics

---

## 3. Workflows

### Workflow A: Shop & Employee Setup

1. **Admin creates Shop**
   - POST /api/shops
   - Shop gets unique ID and empty wallet

2. **Shop Manager adds Employees**
   - POST /api/shops/:shopId/employees
   - Each employee sets redemption PIN
   - Assign permissions (create/redeem)

### Workflow B: Voucher Offer Creation

1. **Employee logs into Shop Portal**
   - Verify canCreateVoucher permission

2. **Create Offer**
   - POST /api/shops/:shopId/offers
   - System records createdByEmpId
   - Offer appears in marketplace

### Workflow C: User Purchase

1. **User browses marketplace**
   - GET /api/offers
   - Sees all active shop offers

2. **User purchases voucher**
   - POST /api/offers/:offerId/purchase
   - Deduct points from user
   - Generate PIN and QR code
   - Create UserVoucher record

### Workflow D: Redemption (The Handshake)

1. **User visits shop with QR code**

2. **Employee scans QR**
   - POST /api/vouchers/validate
   - System shows voucher details

3. **Employee enters PIN**
   - POST /api/vouchers/redeem
   - System verifies:
     - Employee belongs to this shop
     - PIN matches redemptionPinHash
     - Voucher is valid and not redeemed
   
4. **System processes redemption**
   - Mark voucher as redeemed
   - Log redeemedByEmpId and timestamp
   - Transfer points to shop wallet
   - Update shop and employee stats

---

## 4. Security Considerations

### PIN Security
- Store redemptionPinHash using bcrypt
- Require 4-6 digit numeric PIN
- Rate limit PIN attempts (3 tries, 15-minute lockout)
- Log all PIN verification attempts

### Authorization
- Employees can only redeem for their shop
- Shop managers can view their shop's data only
- Super admins can view all shops

### Audit Trail
- Log all voucher creations (who, when, what)
- Log all redemptions (who, when, where)
- Track PIN changes

---

## 5. Migration Strategy

### Phase 1: Database Schema
1. Create new tables (Shop, Employee, VoucherOffer, UserVoucher)
2. Migrate existing VoucherPurchase data to UserVoucher
3. Create default "Partner Locations" as Shops
4. Create employee records for existing redemptions

### Phase 2: API Development
1. Build shop management APIs
2. Build employee management APIs
3. Build voucher offer APIs
4. Update redemption flow with PIN verification

### Phase 3: UI Development
1. Shop Portal (mission-cms)
   - Shop dashboard
   - Employee management
   - Offer creation
   - Analytics
2. Redemption App
   - QR scanner with PIN prompt
   - Employee login
3. User App (bonus-galaxy-new)
   - Marketplace view
   - Purchase flow
   - My vouchers

### Phase 4: Testing & Deployment
1. Test complete workflows
2. Load testing for redemption flow
3. Security audit
4. Gradual rollout

---

## 6. Analytics & Reports

### Shop Dashboard
- Total sales vs redemptions
- Revenue (points earned)
- Top performing offers
- Employee activity leaderboard
- Redemption trends (daily/weekly/monthly)

### Employee Dashboard
- Personal redemption count
- Average redemptions per day
- Performance vs. other employees

### Admin Dashboard
- All shops overview
- System-wide statistics
- Fraud detection alerts

---

## 7. Implementation Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Database schema & migration | 2-3 days |
| Phase 2 | API development | 5-7 days |
| Phase 3 | UI development | 7-10 days |
| Phase 4 | Testing & deployment | 3-5 days |
| **Total** | | **17-25 days** |

---

## Next Steps

1. **Approve this specification**
2. **Create database migration scripts**
3. **Build API endpoints**
4. **Develop shop portal UI**
5. **Update redemption flow**
6. **Test end-to-end**
7. **Deploy to production**

---

**Document Version**: 1.0  
**Date**: January 16, 2026  
**Status**: Awaiting Approval
