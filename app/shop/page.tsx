import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { VoucherCard } from '@/components/shop/voucher-card';
import { Sparkles, ShoppingBag, CreditCard, Gift, Zap, Shield, Check } from 'lucide-react';
import prisma from '@/lib/prisma';

const voucherBundles = [
  {
    id: 'bundle-standard',
    name: 'Standard Bundle',
    description: '10 Gutscheine im Gesamtwert von €400 von gutschein.at',
    price: 40,
    value: 400,
    pointsCost: 4000,
    voucherCount: 10,
    features: [
      '10 Gutscheine von Top-Partnern',
      'Sofortige digitale Zustellung',
      'Bis zu 30% Rabatt',
      'Unbegrenzt gültig',
    ],
  },
  {
    id: 'bundle-premium',
    name: 'Premium Bundle',
    description: '10 Exklusive Gutscheine im Wert von €800 inkl. Bonuspunkte',
    price: 75,
    value: 800,
    pointsCost: 7500,
    voucherCount: 10,
    features: [
      'Alle Standard-Vorteile',
      '+ 5000 Bonuspunkte',
      'Exklusive Partner-Angebote',
      'Priority Support',
    ],
    popular: true,
  },
  {
    id: 'bundle-deluxe',
    name: 'Deluxe Bundle',
    description: '10 Premium Gutscheine im Wert von €1200 mit Extra-Rewards',
    price: 100,
    value: 1200,
    pointsCost: 10000,
    voucherCount: 10,
    features: [
      'Alle Premium-Vorteile',
      '+ 10000 Bonuspunkte',
      'Zugang zu VIP-Angeboten',
      'Persönlicher Account-Manager',
    ],
  },
];

const steps = [
  {
    icon: ShoppingBag,
    title: 'Bundle wählen',
    description: 'Wähle dein gewünschtes Gutschein-Bundle',
  },
  {
    icon: CreditCard,
    title: 'Sicher bezahlen',
    description: 'Bezahle sicher mit Stripe',
  },
  {
    icon: Zap,
    title: 'Sofort erhalten',
    description: 'Erhalte sofortigen Zugang zu deinen Gutscheinen',
  },
  {
    icon: Gift,
    title: 'Einlösen',
    description: 'Löse die Gutscheine bei unseren Partnern ein',
  },
];

export default async function ShopPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  // Get user's current points
  const pointsTransactions = await prisma.pointsTransaction.findMany({
    where: { userId },
  });
  
  const userPoints = pointsTransactions.reduce((sum, t) => {
    return sum + t.amount; // Simply add all amounts (negative amounts will subtract)
  }, 0);

  return (
    <div className="min-h-screen dark-pattern pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-orange-400/20 blur-2xl animate-float hidden sm:block" />
        <div className="absolute bottom-10 left-20 w-16 h-16 rounded-full bg-purple-400/20 blur-2xl animate-float-slow hidden sm:block" />
        
        <div className="container mx-auto px-4 lg:px-6 py-8 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-sm font-semibold border border-indigo-500/30 animate-pulse-glow">
              <Sparkles className="h-4 w-4" />
              Exklusive Gutschein-Bundles
            </div>
            <h1 className="text-3xl font-bold text-white">Gutscheine kaufen</h1>
            <p className="text-white/70">
              Kaufe unsere exklusiven Gutschein-Bundles und spare bei unseren Partnern.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-6 py-6">
        <div className="space-y-8">
          {/* User Points Display */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-center">
            <p className="text-sm text-white/70 mb-1">Deine verfügbaren Punkte</p>
            <p className="text-3xl font-bold text-amber-300">{userPoints.toLocaleString()}</p>
          </div>

          {/* Voucher Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voucherBundles.map((bundle) => (
              <VoucherCard key={bundle.id} bundle={bundle} userPoints={userPoints} />
            ))}
          </div>

          {/* How it works */}
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <h3 className="font-semibold text-lg text-white mb-6 text-center">Wie funktioniert es?</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform border border-white/10">
                      <Icon className="h-7 w-7 text-indigo-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-sm text-white/60">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Sichere Zahlung mit Stripe
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Sofortige Zustellung
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              30 Tage Geld-zurück-Garantie
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
