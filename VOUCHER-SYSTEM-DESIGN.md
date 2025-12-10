# Voucher System Design

## 🎯 Business Model

### What Users Get:
When users purchase a voucher bundle, they receive **actual discount vouchers** that can be redeemed at partner stores.

### Example:
- **Standard Bundle (€40):**
  - 10 vouchers worth €40 each = €400 total value
  - Partners: Amazon, MediaMarkt, Zalando, etc.
  - User saves €360 (90% discount)

### Why Users Buy:
1. **Massive Savings** - Get €400 value for €40
2. **Use Points** - Redeem earned points for free vouchers
3. **Gamification** - Scan receipts → Earn points → Get free stuff
4. **Convenience** - Digital vouchers, instant delivery

---

## 🏗️ Implementation Options

### Option 1: Partner with Voucher Aggregator (Recommended)
**Services like:**
- Gutschein.at (Austria)
- Groupon API
- Voucherify
- Rewardful

**How it works:**
1. You purchase voucher codes in bulk from aggregator
2. Store codes in your database
3. Assign codes to users when they purchase
4. User redeems at partner stores

**Pros:**
- Real vouchers with actual value
- Established partner network
- Legal compliance handled
- Easy integration

**Cons:**
- Upfront cost to buy voucher inventory
- Need business agreement
- Margin management

---

### Option 2: Generate Your Own Codes (Simple Start)
**For MVP/Testing:**
1. Generate unique codes
2. Partner with local businesses
3. Manual redemption tracking
4. Build partner network gradually

**Pros:**
- Full control
- No upfront costs
- Flexible terms

**Cons:**
- Need to recruit partners
- Manual processes
- Limited initial value

---

### Option 3: Hybrid Model (Best for Growth)
1. Start with Option 2 (own codes, local partners)
2. Prove concept and get users
3. Transition to Option 1 (aggregator) as you scale

---

## 📊 Database Schema Updates Needed

### Current Schema:
```prisma
model Voucher {
  id              String   @id @default(cuid())
  name            String
  description     String
  partnerName     String
  partnerLogoUrl  String?
  price           Float
  pointsCost      Int
  discountPercent Int
  isActive        Boolean
  createdAt       DateTime
  updatedAt       DateTime
}

model VoucherPurchase {
  id              String   @id @default(cuid())
  userId          String
  voucherId       String
  stripeSessionId String?
  status          String
  amount          Float
  createdAt       DateTime
  updatedAt       DateTime
}
```

### Needed Updates:
```prisma
model VoucherCode {
  id              String   @id @default(cuid())
  code            String   @unique  // Actual voucher code
  voucherId       String
  voucher         Voucher  @relation(fields: [voucherId], references: [id])
  value           Float    // Voucher value (e.g., €40)
  status          String   // "available", "assigned", "redeemed", "expired"
  assignedToUser  String?  // User who owns this code
  purchaseId      String?  // Link to VoucherPurchase
  redeemedAt      DateTime?
  expiresAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([code])
  @@index([assignedToUser])
  @@index([status])
}

model VoucherPurchase {
  id              String        @id @default(cuid())
  userId          String
  voucherId       String
  voucher         Voucher       @relation(fields: [voucherId], references: [id])
  voucherCodes    VoucherCode[] // Codes assigned to this purchase
  stripeSessionId String?
  status          String        // "pending", "completed", "failed"
  amount          Float
  paymentMethod   String        // "stripe" or "points"
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([userId])
  @@index([stripeSessionId])
}

model Voucher {
  id              String           @id @default(cuid())
  name            String
  description     String
  partnerName     String
  partnerLogoUrl  String?
  price           Float
  pointsCost      Int
  discountPercent Int
  isActive        Boolean          @default(true)
  codes           VoucherCode[]    // Available codes
  purchases       VoucherPurchase[] // Purchase history
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}
```

---

## 🔄 Complete User Flow

### 1. Purchase Flow:
```
User selects bundle
    ↓
Pays with Stripe/Points
    ↓
Webhook/API assigns voucher codes
    ↓
Codes stored in database (assigned to user)
    ↓
Email sent with codes
    ↓
User sees codes in "My Vouchers" page
```

### 2. Redemption Flow:
```
User goes to "My Vouchers"
    ↓
Sees list of available codes
    ↓
Clicks "Use Voucher"
    ↓
Copies code or clicks partner link
    ↓
Redeems at partner store
    ↓
(Optional) User marks as "Used"
```

---

## 🎨 UI Components Needed

### 1. My Vouchers Page (`/vouchers`)
- List of all purchased vouchers
- Filter: Available / Used / Expired
- Voucher cards with:
  - Partner logo
  - Voucher value
  - Expiry date
  - Code (hidden until clicked)
  - "Copy Code" button
  - "Redeem at Partner" link

### 2. Voucher Detail Modal
- Full voucher information
- Terms & conditions
- How to redeem instructions
- Partner website link
- QR code for in-store redemption

### 3. Success Page Enhancement
- Show purchased voucher codes immediately
- "View My Vouchers" button
- Email confirmation message

---

## 📧 Email Template Needed

```
Subject: Your Bonus Galaxy Vouchers Are Ready! 🎉

Hi [Name],

Thank you for your purchase! Here are your voucher codes:

[Bundle Name] - €[Value]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Voucher 1: [Partner Name] - €40
Code: BONUS-XXXX-XXXX-XXXX
Redeem at: [Partner URL]
Expires: [Date]

Voucher 2: [Partner Name] - €40
Code: BONUS-YYYY-YYYY-YYYY
Redeem at: [Partner URL]
Expires: [Date]

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View all your vouchers: [App URL]/vouchers

Questions? Contact support@bonusgalaxy.com

Happy shopping! 🛍️
```

---

## 🔐 Security Considerations

1. **Code Generation:**
   - Use cryptographically secure random codes
   - Format: `BONUS-XXXX-XXXX-XXXX`
   - Check for uniqueness

2. **Code Protection:**
   - Don't expose codes in URLs
   - Require authentication to view
   - Rate limit code viewing
   - Log all code access

3. **Fraud Prevention:**
   - One-time use codes
   - Expiry dates
   - User verification
   - Partner validation

---

## 💰 Business Considerations

### Pricing Strategy:
- **Cost:** Buy vouchers at 15-20% of face value
- **Sell:** Sell bundles at 10% of face value
- **Margin:** 5-10% profit per bundle
- **Volume:** Need high volume for profitability

### Example:
- Buy 10x €40 vouchers = €80 cost (20% of €400)
- Sell bundle for €40
- Loss: €40 per bundle
- **Make money from:** Advertising, data, premium features

### Alternative Model:
- **Freemium:** Basic vouchers free with points
- **Premium:** Better vouchers require payment
- **Subscription:** Monthly fee for unlimited vouchers

---

## 🚀 MVP Implementation Plan

### Phase 1: Basic Voucher System (Week 1)
- [ ] Update database schema
- [ ] Generate voucher codes
- [ ] Assign codes on purchase
- [ ] Create "My Vouchers" page
- [ ] Show codes to users

### Phase 2: Email & UX (Week 2)
- [ ] Email delivery system
- [ ] Voucher detail modal
- [ ] Copy code functionality
- [ ] Redemption instructions

### Phase 3: Partner Integration (Week 3)
- [ ] Partner dashboard
- [ ] Code validation API
- [ ] Redemption tracking
- [ ] Analytics

### Phase 4: Advanced Features (Week 4)
- [ ] QR codes for in-store
- [ ] Push notifications
- [ ] Voucher marketplace
- [ ] Gift vouchers to friends

---

## 📝 Next Steps

1. **Decide on voucher source:**
   - Partner with aggregator? (Recommended)
   - Generate own codes? (MVP)
   - Hybrid approach? (Long-term)

2. **Update database schema**
3. **Implement voucher assignment logic**
4. **Create "My Vouchers" page**
5. **Set up email delivery**
6. **Test complete flow**

---

## 🎯 Success Metrics

- **User Engagement:** % of users who redeem vouchers
- **Redemption Rate:** % of codes actually used
- **Customer Satisfaction:** Reviews and ratings
- **Revenue:** Profit per bundle sold
- **Growth:** New users from voucher value proposition

---

## 💡 Marketing Angle

**Tagline:** "Scan receipts, earn points, get FREE vouchers!"

**Value Proposition:**
- Turn your everyday shopping into rewards
- Get €400 worth of vouchers for just €40
- Or use points you earned for FREE
- No catch, real savings at real stores

**Target Audience:**
- Budget-conscious shoppers
- Deal hunters
- Students
- Families

---

Would you like me to implement the complete voucher system now?
