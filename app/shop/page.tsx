import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { VoucherCard } from '@/components/shop/voucher-card';
import { Card } from '@/components/ui/card';
import { Sparkles, ShoppingBag, CreditCard, Gift, Zap } from 'lucide-react';

const voucherBundles = [
  {
    id: 'bundle-standard',
    name: 'Standard Bundle',
    description: 'Gutscheine im Gesamtwert von €400 von gutschein.at',
    price: 40,
    value: 400,
    features: [
      'Gutscheine von Top-Partnern',
      'Sofortige digitale Zustellung',
      'Bis zu 30% Rabatt',
      'Unbegrenzt gültig',
    ],
  },
  {
    id: 'bundle-premium',
    name: 'Premium Bundle',
    description: 'Exklusive Gutscheine im Wert von €800 inkl. Bonuspunkte',
    price: 75,
    value: 800,
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
    description: 'Premium Gutscheine im Wert von €1200 mit Extra-Rewards',
    price: 100,
    value: 1200,
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

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="bg-gradient-hero border-b border-border/40">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 text-[#6366f1] px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Exklusive Gutschein-Bundles
            </div>
            <h1 className="text-4xl font-bold">Gutscheine kaufen</h1>
            <p className="text-lg text-muted-foreground">
              Kaufe unsere exklusiven Gutschein-Bundles und spare bei unseren Partnern.
              Alle Gutscheine von gutschein.at.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="space-y-12">
          {/* Voucher Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {voucherBundles.map((bundle) => (
              <VoucherCard key={bundle.id} bundle={bundle} />
            ))}
          </div>

          {/* How it works */}
          <Card className="p-8 bg-white border border-border max-w-4xl mx-auto">
            <h3 className="font-semibold text-xl mb-8 text-center">Wie funktioniert es?</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-[#6366f1]" />
                    </div>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10b981] rounded-full" />
              Sichere Zahlung mit Stripe
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10b981] rounded-full" />
              Sofortige Zustellung
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10b981] rounded-full" />
              30 Tage Geld-zurück-Garantie
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
