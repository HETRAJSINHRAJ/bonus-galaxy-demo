'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ExternalLink, Gift, Calendar, CreditCard, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface VoucherPurchase {
  id: string;
  voucherId: string;
  amount: number;
  createdAt: Date;
  stripeSessionId: string | null;
}

interface VoucherListProps {
  purchases: VoucherPurchase[];
}

// Bundle information mapping
const BUNDLE_INFO: Record<string, { name: string; description: string; voucherCount: number; value: number }> = {
  'bundle-standard': {
    name: 'Standard Bundle',
    description: '10 Gutscheine von Top-Partnern',
    voucherCount: 10,
    value: 400
  },
  'bundle-premium': {
    name: 'Premium Bundle',
    description: '10 Exklusive Gutscheine',
    voucherCount: 10,
    value: 800
  },
  'bundle-deluxe': {
    name: 'Deluxe Bundle',
    description: '10 Premium Gutscheine',
    voucherCount: 10,
    value: 1200
  }
};

export function VoucherList({ purchases }: VoucherListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid gap-4">
      {purchases.map((purchase) => {
        const bundleInfo = BUNDLE_INFO[purchase.voucherId] || {
          name: 'Gutschein Bundle',
          description: 'Gutscheine',
          voucherCount: 10,
          value: 400
        };

        const isPaidWithPoints = !purchase.stripeSessionId;

        return (
          <div
            key={purchase.id}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left side - Voucher Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <Gift className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{bundleInfo.name}</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        Aktiv
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">{bundleInfo.description}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="h-4 w-4 text-white/40" />
                    <span>Gekauft am {format(new Date(purchase.createdAt), 'dd. MMM yyyy', { locale: de })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    {isPaidWithPoints ? (
                      <>
                        <Coins className="h-4 w-4 text-amber-400" />
                        <span>Mit Punkten bezahlt</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 text-white/40" />
                        <span>€{purchase.amount.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Voucher Code Display */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-white/60 mb-1">Gutschein-Code</p>
                      <p className="text-lg font-mono font-bold text-amber-300 tracking-wider">
                        {purchase.id.toUpperCase().slice(0, 16)}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        Wert: €{bundleInfo.value} • {bundleInfo.voucherCount} Gutscheine
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(purchase.id.toUpperCase().slice(0, 16), purchase.id)}
                      className={`shrink-0 ${
                        copiedId === purchase.id
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                      }`}
                    >
                      {copiedId === purchase.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Kopiert!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Kopieren
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex lg:flex-col gap-2">
                <Button
                  asChild
                  className="flex-1 lg:flex-none bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                  size="sm"
                >
                  <a href="https://www.gutschein.at" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Einlösen
                  </a>
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/50">
                💡 <strong>So löst du ein:</strong> Besuche gutschein.at, wähle deine gewünschten Gutscheine aus und gib diesen Code beim Checkout ein.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
