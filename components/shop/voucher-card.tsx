'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  value: number;
  features: string[];
  popular?: boolean;
}

interface VoucherCardProps {
  bundle: Bundle;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function VoucherCard({ bundle }: VoucherCardProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundleId: bundle.id,
          price: bundle.price,
          name: bundle.name,
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (stripe && sessionId) {
        // @ts-expect-error - redirectToCheckout exists on Stripe but types may be outdated
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe error:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const savings = bundle.value - bundle.price;
  const savingsPercent = Math.round((savings / bundle.value) * 100);

  return (
    <Card className={`relative p-6 flex flex-col bg-white border card-hover ${
      bundle.popular 
        ? 'border-[#6366f1] border-2 shadow-lg shadow-[#6366f1]/10' 
        : 'border-border'
    }`}>
      {bundle.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white border-0 px-4 py-1">
          <Sparkles className="h-3 w-3 mr-1" />
          Beliebteste Wahl
        </Badge>
      )}
      
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
          <p className="text-sm text-muted-foreground">{bundle.description}</p>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">€{bundle.price}</span>
            <span className="text-lg text-muted-foreground line-through">€{bundle.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20 hover:bg-[#10b981]/20">
              Spare €{savings}
            </Badge>
            <span className="text-sm text-muted-foreground">
              ({savingsPercent}% Rabatt)
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {bundle.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 bg-[#6366f1]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-[#6366f1]" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={`w-full mt-6 ${bundle.popular ? 'btn-gradient' : ''}`}
        size="lg"
        onClick={handlePurchase}
        disabled={loading}
        variant={bundle.popular ? 'default' : 'outline'}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird geladen...
          </>
        ) : (
          'Jetzt kaufen'
        )}
      </Button>
    </Card>
  );
}
