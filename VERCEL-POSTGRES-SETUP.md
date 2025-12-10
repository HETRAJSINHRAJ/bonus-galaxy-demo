# Vercel Postgres Setup Guide

## 🎯 Quick Setup (Recommended - Via Dashboard)

### Step 1: Deploy to Vercel First

1. **Push your code to GitHub** (already done ✅)

2. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

3. **Import your GitHub repository**
   - Select: `HETRAJSINHRAJ/bonus-galaxy-demo`
   - Click "Import"

4. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   UPLOADTHING_TOKEN=...
   ```
   
   **Note:** Leave `DATABASE_URL` empty for now - we'll add it after creating the database

6. **Click "Deploy"**
   - Wait for deployment to complete
   - Note your deployment URL (e.g., `https://bonus-galaxy-demo.vercel.app`)

---

### Step 2: Create Postgres Database

1. **Go to Storage Tab**
   - In your Vercel project dashboard
   - Click "Storage" tab
   - Click "Create Database"

2. **Select Postgres**
   - Choose "Postgres"
   - Click "Continue"

3. **Configure Database**
   - Database Name: `bonus-galaxy-db`
   - Region: Choose closest to your users (e.g., `iad1` for US East)
   - Click "Create"

4. **Wait for Creation**
   - Takes ~30 seconds
   - Database will be created and connected to your project

5. **Get Connection String**
   - Click on your database
   - Go to "Settings" tab
   - Copy the connection string (starts with `postgres://`)
   - It looks like: `postgres://default:xxxxx@xxx-xxx-xxx.postgres.vercel-storage.com:5432/verceldb`

---

### Step 3: Update Environment Variables

1. **Add DATABASE_URL**
   - Go to Project Settings → Environment Variables
   - Add new variable:
     - Name: `DATABASE_URL`
     - Value: `postgres://default:xxxxx@...` (paste your connection string)
   - Select all environments (Production, Preview, Development)
   - Click "Save"

2. **Update Local .env**
   ```env
   DATABASE_URL="postgres://default:xxxxx@xxx-xxx-xxx.postgres.vercel-storage.com:5432/verceldb"
   ```

---

### Step 4: Update Prisma Schema

1. **Edit `prisma/schema.prisma`**
   Change the datasource from SQLite to PostgreSQL:
   
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Remove SQLite-specific settings**
   - Remove any `@default(cuid())` if causing issues
   - PostgreSQL handles IDs differently

---

### Step 5: Push Schema to Database

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Vercel Postgres**
   ```bash
   npx prisma db push
   ```
   
   This will:
   - Connect to your Vercel Postgres database
   - Create all tables (Receipt, PointsTransaction, Voucher, VoucherPurchase)
   - Set up indexes and relationships

3. **Verify Tables Created**
   ```bash
   npx prisma studio
   ```
   - Opens a GUI to view your database
   - Check that all tables exist

---

### Step 6: Redeploy

1. **Commit Changes**
   ```bash
   git add prisma/schema.prisma
   git commit -m "chore: switch to PostgreSQL"
   git push
   ```

2. **Vercel Auto-Deploys**
   - Vercel will automatically redeploy
   - New deployment will use PostgreSQL
   - Check deployment logs for any errors

---

## 🧪 Testing

### Test Database Connection

1. **Check Deployment Logs**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment
   - Check "Build Logs" for Prisma errors

2. **Test Your App**
   - Visit your Vercel URL
   - Try scanning a receipt
   - Check if points are saved
   - Verify dashboard shows data

3. **View Database Data**
   - Go to Vercel Dashboard → Storage → Your Database
   - Click "Data" tab
   - See your tables and data

---

## 🔧 Alternative: CLI Setup

If you prefer CLI (after project is deployed):

```bash
# Link project
vercel link

# Create database
vercel postgres create

# Get connection string
vercel env pull .env.local

# Push schema
npx prisma db push
```

---

## 🚨 Troubleshooting

### Error: "Can't connect to database"
- Check DATABASE_URL is correct
- Verify database is in same region as deployment
- Check firewall/IP restrictions

### Error: "Prisma Client not generated"
- Run `npx prisma generate` locally
- Commit and push changes
- Vercel will run it during build

### Error: "Table doesn't exist"
- Run `npx prisma db push` to create tables
- Or use migrations: `npx prisma migrate deploy`

### Data Migration from SQLite
If you have existing data in SQLite:

1. **Export SQLite data**
   ```bash
   sqlite3 prisma/dev.db .dump > backup.sql
   ```

2. **Convert to PostgreSQL format**
   - Use online converter or manual SQL editing
   - Remove SQLite-specific syntax

3. **Import to PostgreSQL**
   ```bash
   psql $DATABASE_URL < backup-postgres.sql
   ```

---

## 📊 Database Limits (Vercel Postgres Free Tier)

- **Storage:** 256 MB
- **Compute:** 60 hours/month
- **Rows:** ~100,000 (estimated)
- **Connections:** 20 concurrent

**Upgrade if needed:**
- Hobby: $20/month (512 MB, unlimited compute)
- Pro: Custom pricing

---

## ✅ Checklist

- [ ] Deployed project to Vercel
- [ ] Created Postgres database
- [ ] Updated DATABASE_URL in environment variables
- [ ] Changed Prisma schema to PostgreSQL
- [ ] Ran `npx prisma db push`
- [ ] Verified tables created
- [ ] Tested app functionality
- [ ] Checked deployment logs

---

## 🎉 You're Done!

Your app is now using Vercel Postgres in production!

**Next Steps:**
1. Set up Stripe webhook (see PRODUCTION-SETUP.md)
2. Test complete payment flow
3. Monitor database usage in Vercel dashboard
4. Set up backups (Vercel handles this automatically)

---

## 📚 Resources

- Vercel Postgres Docs: https://vercel.com/docs/storage/vercel-postgres
- Prisma with PostgreSQL: https://www.prisma.io/docs/concepts/database-connectors/postgresql
- Vercel CLI: https://vercel.com/docs/cli
