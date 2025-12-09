# Bonus Galaxy 🌟

Eine moderne Next.js Webanwendung zum Scannen von Rechnungs-QR-Codes, Sammeln von Punkten und Einlösen von Gutscheinen.

## Features

- ✨ **QR-Code Scanner**: Scanne österreichische Rechnungs-QR-Codes und sammle automatisch Punkte (€1 = 100 Punkte)
- 💳 **Gutschein-Shop**: Kaufe exklusive Gutschein-Bundles mit Stripe Checkout
- 📊 **Dashboard**: Übersicht über Ausgaben, Punkte und gescannte Rechnungen
- 🎯 **Punkte-System**: Verdiene und verwalte deine Punkte
- 👤 **Benutzer-Authentifizierung**: Sichere Anmeldung mit Clerk
- 📱 **Responsive Design**: Optimiert für Desktop und Mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + Shadcn/ui Components
- **Authentifizierung**: Clerk
- **Datenbank**: Prisma + SQLite (Development) / PostgreSQL (Production)
- **Zahlungen**: Stripe
- **Bildupload**: Uploadthing
- **QR-Scanner**: html5-qrcode

## Installation

1. Repository klonen und Dependencies installieren:
```bash
npm install
```

2. Environment Variables sind bereits in `.env.local` konfiguriert

3. Datenbank einrichten:
```bash
npx prisma generate
npx prisma db push
```

4. Development Server starten:
```bash
npm run dev
```

Die App läuft auf [http://localhost:3000](http://localhost:3000)

## Projektstruktur

```
bonus-world/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── checkout/         # Stripe Checkout
│   │   └── receipts/         # Receipt Processing
│   ├── dashboard/            # Dashboard Page
│   ├── scan/                 # QR Scanner Page
│   ├── shop/                 # Gutschein Shop
│   ├── points/               # Punkte-Übersicht
│   ├── settings/             # Account Settings
│   └── layout.tsx            # Root Layout mit Clerk
├── components/               # React Components
│   ├── ui/                   # Shadcn/ui Components
│   ├── dashboard/            # Dashboard Components
│   ├── scan/                 # QR Scanner Components
│   ├── shop/                 # Shop Components
│   └── navigation.tsx        # Main Navigation
├── lib/                      # Utilities & Config
│   ├── prisma.ts             # Prisma Client
│   ├── utils.ts              # Helper Functions
│   └── receipt-utils.ts      # Receipt Parsing
├── prisma/                   # Database Schema
│   └── schema.prisma
└── middleware.ts             # Clerk Middleware
```

## QR-Code Format

Die App unterstützt österreichische Rechnungs-QR-Codes im Format:
```
R1-AT0_[Firma]_[ID]_[Datum]_[Beträge]_U:[ATU-Nummer]_[Signatur]
```

Beispiel:
```
R1-AT0_1042_10420151142617_2025-11-06T08:27:53_0,00_0,00_0,00_3,10_0,00+vNmSLQ=_U:ATU46674503-01_...
```

## Deployment auf Vercel

1. Push Code zu GitHub
2. Verbinde Repository mit Vercel
3. Environment Variables aus `.env.local` in Vercel übertragen
4. Wechsle `DATABASE_URL` zu PostgreSQL Connection String für Production
5. Deploy!

### Wichtig für Production:

- Setze `DATABASE_URL` auf PostgreSQL Connection String (z.B. von Vercel Postgres)
- Konfiguriere Stripe Webhook URL in Stripe Dashboard
- Stelle sicher dass alle Environment Variables gesetzt sind

## Entwicklung

### Neue Shadcn Components hinzufügen:
```bash
npx shadcn@latest add [component-name]
```

### Prisma Schema ändern:
```bash
npx prisma db push
npx prisma generate
```

### Prisma Studio öffnen:
```bash
npx prisma studio
```

## Partner

Aktuelle Partner-Unternehmen:
- Ocono (Energiegemeinschaft)
- Zur Post
- Felsenhof
- oe24
- RTS

## Lizenz

Alle Rechte vorbehalten © 2025 Bonus Galaxy
# bonus-galaxy
