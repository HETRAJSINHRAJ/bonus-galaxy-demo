'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Sparkles, Coins, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  value: number;
  features: string[];
  popular?: boolean;
  pointsCost?: number;
  voucherCount?: number;
}

interface VoucherCardProps {
  bundle: Bundle;
  userPoints?: number;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function VoucherCard({ bundle, userPoints = 0 }: VoucherCardProps) {
  const [loading, setLoading] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const handleStripePurchase = async () => {
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

      const data = await response.json();
      
      if (data.url) {
        // Redirect immediately - Stripe handles the page properly
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received');
        alert('Die Zahlungsseite konnte nicht geladen werden. Bitte versuchen Sie es erneut.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Keine Verbindung möglich. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
      setLoading(false);
    }
    // Don't set loading to false in finally - let the page navigate away
  };

  const handlePointsPurchase = async () => {
    setLoadingPoints(true);
    try {
      const response = await fetch('/api/vouchers/purchase-with-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundleId: bundle.id,
          pointsCost: bundle.pointsCost,
          voucherCount: bundle.voucherCount || 10,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        window.location.href = '/shop/success?payment=points';
      } else {
        alert(data.error || 'Nicht genügend Punkte verfügbar. Sammeln Sie mehr Punkte durch das Scannen von Belegen.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Keine Verbindung möglich. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
    } finally {
      setLoadingPoints(false);
    }
  };

  const savings = bundle.value - bundle.price;
  const savingsPercent = Math.round((savings / bundle.value) * 100);

  return (
    <div className={`relative p-4 flex flex-col rounded-xl bg-white/5 backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
      bundle.popular 
        ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/20' 
        : 'border-white/10 hover:border-white/20'
    }`}>
      {bundle.popular && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 btn-gradient text-white border-0 px-3 py-0.5 text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          Beliebteste Wahl
        </Badge>
      )}
      
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{bundle.name}</h3>
          <p className="text-xs text-white/60">{bundle.description}</p>
        </div>

        {/* Pricing */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">€{bundle.price}</span>
            <span className="text-base text-white/40 line-through">€{bundle.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 text-xs">
              Spare €{savings}
            </Badge>
            <span className="text-xs text-white/50">
              ({savingsPercent}% Rabatt)
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2">
          {bundle.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-xs">
              <div className="w-4 h-4 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-2.5 w-2.5 text-indigo-400" />
              </div>
              <span className="text-white/80">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Options */}
      <div className="space-y-2 mt-4">
        {/* Stripe Payment */}
        <Button
          className={`w-full ${bundle.popular ? 'btn-gradient' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
          size="default"
          onClick={handleStripePurchase}
          disabled={loading || loadingPoints}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird geladen...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Mit Karte kaufen - €{bundle.price}
            </>
          )}
        </Button>

        {/* Points Payment */}
        {bundle.pointsCost && (
          <Button
            className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
            size="default"
            onClick={handlePointsPurchase}
            disabled={loading || loadingPoints || userPoints < bundle.pointsCost}
          >
            {loadingPoints ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird geladen...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Mit Punkten kaufen - {bundle.pointsCost.toLocaleString()} Punkte
              </>
            )}
          </Button>
        )}
        
        {bundle.pointsCost && userPoints < bundle.pointsCost && (
          <p className="text-xs text-center text-red-400">
            Nicht genügend Punkte (Du hast: {userPoints.toLocaleString()})
          </p>
        )}
      </div>
    </div>
  );
}
