# Production Setup Guide

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables

Update your `.env` file (or Vercel environment variables) with production values:

```env
# Clerk Authentication (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Stripe (Production Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (Production Database URL)
DATABASE_URL=postgresql://...  # Use PostgreSQL for production, not SQLite

# App URL (Your production domain)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# UploadThing (Production Token)
UPLOADTHING_TOKEN=...
```

---

## 📦 Database Migration (SQLite → PostgreSQL)

**Current:** Using SQLite (`file:./dev.db`) - NOT suitable for production

**Required:** PostgreSQL database

### Option 1: Vercel Postgres
```bash
# Install Vercel Postgres
vercel postgres create

# Get connection string from Vercel dashboard
# Add to environment variables
```

### Option 2: Supabase
1. Create project at https://supabase.com
2. Get connection string from Settings → Database
3. Update `DATABASE_URL` in `.env`

### Option 3: PlanetScale
1. Create database at https://planetscale.com
2. Get connection string
3. Update `DATABASE_URL` in `.env`

### Run Migrations
```bash
# Update prisma/schema.prisma datasource
datasource db {
  provider = "postgresql"  # Change from sqlite
  url      = env("DATABASE_URL")
}

# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Or use migrations
npx prisma migrate deploy
```

---

## 🔐 Clerk Setup

### 1. Create Production Instance
- Go to https://dashboard.clerk.com
- Create a new application or switch to production
- Get production keys

### 2. Configure Domains
- Add your production domain to allowed domains
- Configure redirect URLs:
  - Sign-in: `https://yourdomain.com`
  - Sign-up: `https://yourdomain.com`
  - After sign-out: `https://yourdomain.com`

### 3. Email Settings
- Configure email templates
- Set up custom email domain (optional)

---

## 💳 Stripe Setup

### 1. Activate Production Mode
- Go to https://dashboard.stripe.com
- Switch from Test mode to Live mode
- Get production API keys

### 2. Configure Webhook
**Critical for bonus points and voucher delivery!**

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
5. Copy the webhook signing secret
6. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

### 3. Test Webhook Locally (Development)
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret (whsec_...) to .env
```

### 4. Configure Email Receipts
- Go to Settings → Emails
- Enable "Successful payments"
- Customize email template with your branding

---

## 📧 Email Configuration (Optional - Custom Emails)

If you want custom voucher delivery emails beyond Stripe receipts:

### Option: Resend
```bash
npm install resend
```

```env
RESEND_API_KEY=re_...
```

Create `app/api/send-voucher-email/route.ts` for custom emails.

---

## 🗄️ File Storage (UploadThing)

### Production Setup
1. Go to https://uploadthing.com
2. Create production app
3. Get production token
4. Update `UPLOADTHING_TOKEN` in environment variables

---

## 🔒 Security Checklist

- [ ] All API keys are production keys (not test keys)
- [ ] Webhook secret is configured
- [ ] Database is PostgreSQL (not SQLite)
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (consider adding)
- [ ] Input validation on all API routes
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)

---

## 🚀 Deployment Steps

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Import your GitHub repository
- Configure environment variables
- Deploy

3. **Post-Deployment**
- Test Stripe webhook: Make a test purchase
- Check webhook logs in Stripe dashboard
- Verify bonus points are awarded
- Test email receipts

### Deploy to Other Platforms

**Railway:**
```bash
railway login
railway init
railway up
```

**Netlify:**
- Connect GitHub repo
- Configure build settings
- Add environment variables

---

## 🧪 Testing Production

### Test Checklist
- [ ] User registration works
- [ ] QR code scanning works
- [ ] Points are awarded correctly
- [ ] Stripe payment works
- [ ] Bonus points are awarded after payment
- [ ] Email receipts are sent
- [ ] Points purchase works
- [ ] Dashboard shows real data
- [ ] Mobile responsive

### Test Stripe Payment
Use test cards in test mode:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

---

## 📊 Monitoring

### Recommended Tools
- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Stripe Dashboard** - Payment monitoring

### Set Up Alerts
- Failed payments
- Webhook failures
- Database errors
- High error rates

---

## 🔄 Maintenance

### Regular Tasks
- Monitor Stripe webhook logs
- Check database performance
- Review error logs
- Update dependencies
- Backup database

### Database Backups
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## 📝 Environment Variables Summary

```env
# Required for Production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
UPLOADTHING_TOKEN=...
```

---

## 🆘 Troubleshooting

### Webhook Not Working
1. Check webhook secret is correct
2. Verify endpoint URL is accessible
3. Check Stripe dashboard webhook logs
4. Test with Stripe CLI locally

### Bonus Points Not Awarded
1. Check webhook is configured
2. Verify `checkout.session.completed` event is selected
3. Check server logs for errors
4. Verify bundle IDs match in webhook handler

### Database Connection Issues
1. Verify DATABASE_URL is correct
2. Check database is accessible from Vercel
3. Run `npx prisma db push` to sync schema
4. Check connection limits

---

## ✅ Production Ready Checklist

- [ ] PostgreSQL database configured
- [ ] All environment variables set
- [ ] Stripe webhook configured and tested
- [ ] Production API keys (Clerk, Stripe, UploadThing)
- [ ] Email receipts enabled
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Error monitoring set up
- [ ] Database backups configured
- [ ] Test purchase completed successfully
- [ ] Bonus points awarded correctly

---

## 🎉 You're Ready!

Once all items are checked, your application is production-ready!

For support:
- Stripe: https://support.stripe.com
- Clerk: https://clerk.com/support
- Vercel: https://vercel.com/support
