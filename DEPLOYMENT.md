# Deployment Guide für Bonus Galaxy auf Vercel

## Voraussetzungen

- GitHub Account
- Vercel Account
- Alle API Keys (Clerk, Stripe, Uploadthing)

## Schritt 1: Repository auf GitHub pushen

```bash
git init
git add .
git commit -m "Initial commit: Bonus Galaxy App"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Schritt 2: Vercel Projekt erstellen

1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf "Add New Project"
3. Importiere dein GitHub Repository
4. Wähle "Next.js" als Framework Preset

## Schritt 3: Environment Variables konfigurieren

Füge folgende Environment Variables in Vercel hinzu:

### Clerk (Authentication)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Stripe (Zahlungen)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=(wird nach Webhook-Setup generiert)
```

### Uploadthing (Bildupload)
```
UPLOADTHING_TOKEN=eyJhcGlLZXk...
```

### Database (Production)
```
DATABASE_URL=postgresql://...
```

**Wichtig**: Erstelle eine PostgreSQL Datenbank für Production!

Optionen:
- **Vercel Postgres** (empfohlen)
- **Supabase**
- **Neon**
- **Railway**

### App URL
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Schritt 4: Vercel Postgres einrichten (empfohlen)

1. Gehe zu deinem Vercel Projekt
2. Klicke auf "Storage" Tab
3. Erstelle eine neue Postgres Datenbank
4. Vercel fügt automatisch die `DATABASE_URL` Environment Variable hinzu

## Schritt 5: Deploy

1. Klicke auf "Deploy"
2. Warte bis das Deployment abgeschlossen ist
3. Vercel führt automatisch aus:
   - `npm install`
   - `prisma generate`
   - `next build`

## Schritt 6: Datenbank Migrationen

Nach dem ersten erfolgreichen Deployment:

1. Öffne ein Terminal in deinem Projekt
2. Führe aus:
```bash
# Mit der Production Database verbinden
npx prisma db push

# Oder mit Migrations
npx prisma migrate deploy
```

Alternative: Nutze Vercel CLI:
```bash
vercel env pull
npx prisma db push
```

## Schritt 7: Stripe Webhook einrichten

1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Klicke auf "Add endpoint"
3. URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Events auswählen:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Kopiere den Webhook Secret
6. Füge in Vercel als `STRIPE_WEBHOOK_SECRET` hinzu

## Schritt 8: Clerk Production Setup

1. Gehe zu [Clerk Dashboard](https://dashboard.clerk.com)
2. Wechsle von Test zu Production Mode
3. Aktualisiere die Keys in Vercel:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → Production Key
   - `CLERK_SECRET_KEY` → Production Key
4. Füge deine Vercel Domain zu Clerk hinzu

## Schritt 9: Domain konfigurieren (Optional)

1. Gehe zu Vercel → Settings → Domains
2. Füge deine Custom Domain hinzu
3. Folge den DNS-Anweisungen
4. Aktualisiere `NEXT_PUBLIC_APP_URL` auf deine Domain

## Troubleshooting

### Build schlägt fehl

**Prisma Client nicht gefunden:**
```bash
# Stelle sicher dass postinstall script läuft
npm run postinstall
```

**Database Connection Error:**
- Prüfe ob `DATABASE_URL` korrekt gesetzt ist
- Stelle sicher dass die DB von Vercel aus erreichbar ist

### Runtime Errors

**Clerk Authentication funktioniert nicht:**
- Prüfe ob Production Keys verwendet werden
- Verifiziere dass Domain in Clerk eingetragen ist

**Stripe Checkout funktioniert nicht:**
- Prüfe `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Verifiziere Webhook URL
- Teste mit Stripe CLI lokal

## Continuous Deployment

Jeder Push zu `main` Branch triggert automatisch ein neues Deployment!

```bash
git add .
git commit -m "Update feature"
git push
```

## Monitoring

- **Vercel Dashboard**: Logs und Analytics
- **Clerk Dashboard**: User Analytics
- **Stripe Dashboard**: Payment Analytics
- **Prisma Studio**: Database Management

## Kosten

- **Vercel**: Hobby Plan ist gratis (mit Limits)
- **Clerk**: Gratis bis 10.000 MAU
- **Stripe**: Pay-per-transaction
- **Vercel Postgres**: Ab $20/Monat

## Support

Bei Problemen:
1. Checke Vercel Logs
2. Prüfe alle Environment Variables
3. Teste mit `vercel dev` lokal

Happy Deploying! 🚀
