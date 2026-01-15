'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Gift, Calendar, CreditCard, Coins, QrCode, Lock, X } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import QRCode from 'react-qr-code';

interface VoucherPurchase {
  id: string;
  voucherId: string;
  amount: number;
  createdAt: string;
  stripeSessionId: string | null;
  pinCode: string | null;
  qrCodeData: string | null;
  isRedeemed: boolean;
  redeemedAt: string | null;
  redeemedBy: string | null;
  redeemedLocation: string | null;
  expiresAt: string | null;
}

interface VoucherListProps {
  purchases: VoucherPurchase[];
}

const BUNDLE_INFO: Record<string, { name: string; description: string; voucherCount: number; value: number }> = {
  'bundle-standard': { name: 'Standard Bundle', description: '10 Gutscheine von Top-Partnern', voucherCount: 10, value: 400 },
  'bundle-premium': { name: 'Premium Bundle', description: '10 Exklusive Gutscheine', voucherCount: 10, value: 800 },
  'bundle-deluxe': { name: 'Deluxe Bundle', description: '10 Premium Gutscheine', voucherCount: 10, value: 1200 }
};

export function VoucherList({ purchases }: VoucherListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const selectedPurchase = purchases.find(p => p.id === qrDialogOpen);

  return (
    <>
      <div className="grid gap-4">
        {purchases.map((purchase) => {
          const bundleInfo = BUNDLE_INFO[purchase.voucherId] || { name: 'Gutschein Bundle', description: 'Gutscheine', voucherCount: 10, value: 400 };
          const isPaidWithPoints = !purchase.stripeSessionId;
          const expired = isExpired(purchase.expiresAt);
          const redeemed = purchase.isRedeemed;
          const isCopied = copiedId === `pin-${purchase.id}`;

          return (
            <div key={purchase.id} className={`p-6 rounded-xl bg-white/5 backdrop-blur-sm border transition-all ${redeemed ? 'border-emerald-500/30 bg-emerald-500/5' : expired ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 hover:border-white/20'}`}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                      <Gift className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-semibold text-white">{bundleInfo.name}</h3>
                        <Badge className={redeemed ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs" : expired ? "bg-red-500/20 text-red-400 border-red-500/30 text-xs" : "bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs"}>
                          {redeemed ? "Eingelöst" : expired ? "Abgelaufen" : "Aktiv"}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60">{bundleInfo.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="h-4 w-4 text-white/40" />
                      <span>Gekauft am {format(new Date(purchase.createdAt), 'dd. MMM yyyy', { locale: de })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      {isPaidWithPoints ? <Coins className="h-4 w-4 text-amber-400" /> : <CreditCard className="h-4 w-4 text-white/40" />}
                      <span>{isPaidWithPoints ? "Mit Punkten bezahlt" : `€${purchase.amount.toFixed(2)}`}</span>
                    </div>
                    {purchase.expiresAt && (
                      <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="h-4 w-4 text-white/40" />
                        <span>Gültig bis {format(new Date(purchase.expiresAt), 'dd. MMM yyyy', { locale: de })}</span>
                      </div>
                    )}
                  </div>
                  
                  {redeemed && purchase.redeemedAt && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-sm text-emerald-400">✓ Eingelöst am {format(new Date(purchase.redeemedAt), 'dd. MMM yyyy HH:mm', { locale: de })}</p>
                      {purchase.redeemedBy && <p className="text-xs text-white/60 mt-1">Von: {purchase.redeemedBy} {purchase.redeemedLocation && `• ${purchase.redeemedLocation}`}</p>}
                    </div>
                  )}

                  {!redeemed && !expired && purchase.pinCode && (
                    <div className="p-4 rounded-lg bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Lock className="h-4 w-4 text-amber-400" />
                            <p className="text-xs text-white/60">PIN-Code</p>
                          </div>
                          <p className="text-3xl font-mono font-bold text-amber-300 tracking-widest">{purchase.pinCode}</p>
                          <p className="text-xs text-white/50 mt-1">Wert: €{bundleInfo.value} • {bundleInfo.voucherCount} Gutscheine</p>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(purchase.pinCode!, `pin-${purchase.id}`)} 
                          className={`inline-flex items-center justify-center gap-2 h-8 rounded-md px-3 text-sm font-medium transition-all shrink-0 ${
                            isCopied 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Kopiert!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>Kopieren</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!redeemed && !expired && purchase.qrCodeData && (
                  <div className="flex lg:flex-col gap-2">
                    <button 
                      onClick={() => setQrDialogOpen(purchase.id)} 
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 h-8 rounded-md px-3 text-sm font-medium transition-all bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>QR-Code</span>
                    </button>
                  </div>
                )}
              </div>

              {!redeemed && !expired && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/50">
                    <span>💡 </span>
                    <strong>So löst du ein:</strong>
                    <span> Zeige den QR-Code beim Partner vor oder nenne die 4-stellige PIN. Der Partner kann den Gutschein dann in seinem System validieren.</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {qrDialogOpen && selectedPurchase && selectedPurchase.qrCodeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setQrDialogOpen(null)}>
          <div className="relative bg-gray-900 border border-white/10 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setQrDialogOpen(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">Gutschein QR-Code</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCode value={selectedPurchase.qrCodeData} size={256} level="H" />
              </div>
              <div className="text-center">
                <p className="text-sm text-white/70 mb-2">Zeige diesen QR-Code beim Partner vor</p>
                <p className="text-2xl font-mono font-bold text-amber-300">PIN: {selectedPurchase.pinCode}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
