# Test Stripe Webhook Locally

## Quick Setup

### 1. Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (with Scoop)
scoop install stripe

# Or download from: https://github.com/stripe/stripe-cli/releases
```

### 2. Login to Stripe
```bash
stripe login
```

### 3. Start Your Development Server
```bash
npm run dev
```

### 4. Forward Webhooks (in a new terminal)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### 5. Copy the Webhook Secret
Copy the `whsec_...` value and add it to your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 6. Restart Your Dev Server
```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### 7. Test a Payment
1. Go to http://localhost:3000/shop
2. Click "Mit Karte kaufen" on any bundle
3. Use test card: `4242 4242 4242 4242`
4. Complete the payment

### 8. Check the Webhook Terminal
You should see:
```
✅ Processed payment for user xxx, bundle bundle-premium, bonus points: 5000
```

### 9. Verify in Your App
- Go to Points page
- You should see the bonus points added
- Check transaction history

## Troubleshooting

### Webhook Secret Not Working
- Make sure you copied the full `whsec_...` value
- Restart your dev server after adding the secret
- Check there are no extra spaces in `.env`

### No Bonus Points
- Check the bundle ID matches in `BUNDLE_BONUS_POINTS`
- Verify the webhook event is `checkout.session.completed`
- Check server console for errors

### Webhook Not Receiving Events
- Make sure Stripe CLI is running
- Verify the forward URL is correct
- Check your dev server is running on port 3000
