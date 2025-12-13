# 🔧 Clerk Setup Required for Mobile Authentication

## The Problem

Your mobile app is getting this error:
```
x-clerk-auth-reason: dev-browser-missing
{"error":"Invalid email or password"}
```

This happens because Clerk's **development instances** require browser authentication, which mobile apps can't provide.

## ✅ Solution: Disable Dev Browser Check

Follow these steps to fix the authentication:

### Step 1: Go to Clerk Dashboard

Open: https://dashboard.clerk.com

### Step 2: Select Your Application

Click on **"wealthy-werewolf-56"** (your app)

### Step 3: Navigate to Settings

1. Click **"Settings"** in the left sidebar
2. Click **"Advanced"**
3. Scroll to the **"Development"** section

### Step 4: Disable Browser Authentication

1. Find: **"Require authentication for development instances"**
2. **Toggle it OFF** (disable it)
3. Click **"Save"** or **"Update"**

### Step 5: Test Your Mobile App

1. Restart your Flutter app
2. Try signing in with: `cbing1910@gmail.com` / `cbing@1910`
3. It should work now! ✅

---

## Alternative Solutions

### Option 1: Use Production Keys (Recommended for Production)

If you can't disable the dev browser check, switch to production Clerk keys:

1. Go to Clerk Dashboard → API Keys
2. Copy your **production** keys (pk_live_... and sk_live_...)
3. Update `bonus-galaxy-new/.env`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```
4. Redeploy to Vercel

**Note:** Production instances don't have the dev browser restriction.

### Option 2: Use Email Code Authentication

Instead of password, use email verification codes:

1. User enters email
2. Clerk sends a code to their email
3. User enters the code to sign in

This works without the dev browser check, but requires code changes.

---

## Why This Happens

Clerk's development instances have a security feature that requires browser-based authentication. This is to prevent unauthorized API access during development. Mobile apps can't provide browser cookies, so they fail this check.

Production instances don't have this restriction, which is why this only affects development.

---

## Quick Fix Summary

**Fastest solution:** Disable "Require authentication for development instances" in Clerk Dashboard

**Steps:**
1. https://dashboard.clerk.com
2. Select "wealthy-werewolf-56"
3. Settings → Advanced → Development
4. Toggle OFF "Require authentication for development instances"
5. Save
6. Test mobile app ✅

---

## Need Help?

- Clerk Documentation: https://clerk.com/docs
- Clerk Support: support@clerk.com
- Clerk Discord: https://clerk.com/discord
