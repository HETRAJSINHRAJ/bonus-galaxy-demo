# Neon Postgres Setup for Vercel

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Neon Database in Vercel

1. **In Vercel Dashboard** (where you are now):
   - Click "Create" next to **Neon - Serverless Postgres**
   
2. **Integration Setup**:
   - Click "Continue" to authorize Neon integration
   - Select your project: `bonus-galaxy-demo`
   - Click "Add Integration"

3. **Database Creation**:
   - Database name: `bonus-galaxy-db` (or leave default)
   - Region: Choose closest to your users (e.g., `US East (Ohio)`)
   - Click "Create Database"

4. **Automatic Configuration**:
   - Vercel automatically adds `DATABASE_URL` to your environment variables
   - Connection string format: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`

---

### Step 2: Update Prisma Schema

1. **Edit `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Save the file**

---

### Step 3: Push Schema to Neon

1. **Pull environment variables** (to get DATABASE_URL locally):
   ```bash
   vercel env pull .env.local
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Push schema to database**:
   ```bash
   npx prisma db push
   ```
   
   You should see:
   ```
   ✔ Generated Prisma Client
   ✔ Your database is now in sync with your Prisma schema
   ```

4. **Verify tables created**:
   ```bash
   npx prisma studio
   ```
   - Opens GUI at http://localhost:5555
   - Check that all tables exist (Receipt, PointsTransaction, etc.)

---

### Step 4: Deploy

1. **Commit changes**:
   ```bash
   git add prisma/schema.prisma
   git commit -m "chore: switch to PostgreSQL (Neon)"
   git push
   ```

2. **Vercel auto-deploys**:
   - Deployment will use Neon database
   - Check logs for any errors

---

## ✅ Verification

### Test Your App:
1. Visit your Vercel URL
2. Scan a receipt
3. Check if points are saved
4. View dashboard data

### Check Database:
1. Go to Neon Console: https://console.neon.tech
2. Select your project
3. Click "Tables" to see your data
4. Run SQL queries if needed

---

## 📊 Neon Free Tier Limits

- **Storage:** 0.5 GB
- **Compute:** Always-on (no sleep)
- **Data Transfer:** 3 GB/month
- **Branches:** 10 (for dev/staging)
- **Projects:** Unlimited

**Upgrade if needed:**
- Pro: $19/month (3 GB storage, 100 GB transfer)
- Scale: Custom pricing

---

## 🔧 Neon Features

### Branching (Like Git for Databases)
```bash
# Create a branch for testing
neonctl branches create --name dev

# Get branch connection string
neonctl connection-string dev
```

### Point-in-Time Recovery
- Restore database to any point in last 7 days
- Available in Neon Console

### Auto-Scaling
- Scales compute automatically
- Pauses when inactive (saves costs)

---

## 🚨 Troubleshooting

### Error: "Can't connect to database"
```bash
# Test connection
npx prisma db pull
```
- If fails, check DATABASE_URL in `.env.local`
- Verify Neon database is running in console

### Error: "SSL required"
Add to connection string:
```
?sslmode=require
```

### Error: "Too many connections"
Neon free tier: 100 connections
- Use connection pooling
- Close unused connections

---

## 🎯 Next Steps

1. ✅ Database is set up
2. ✅ Schema is pushed
3. ✅ App is deployed

**Now configure:**
- [ ] Stripe webhook (see PRODUCTION-SETUP.md)
- [ ] Test payment flow
- [ ] Monitor database usage

---

## 📚 Resources

- Neon Docs: https://neon.tech/docs
- Neon Console: https://console.neon.tech
- Prisma + Neon: https://neon.tech/docs/guides/prisma
- Vercel + Neon: https://vercel.com/integrations/neon

---

## 💡 Pro Tips

1. **Use Branches for Development**
   - Create a `dev` branch for testing
   - Keep `main` branch for production

2. **Monitor Usage**
   - Check Neon Console for storage/compute usage
   - Set up alerts for limits

3. **Backup Strategy**
   - Neon auto-backups (7 days retention)
   - Export data periodically: `pg_dump`

4. **Performance**
   - Add indexes for frequently queried fields
   - Use Prisma query optimization

---

## 🎉 You're Done!

Your app now uses Neon Postgres - a production-ready, serverless database!

**Benefits:**
- ✅ Scales automatically
- ✅ No server management
- ✅ Built-in backups
- ✅ Fast performance
- ✅ Free tier generous enough for MVP

Happy coding! 🚀
