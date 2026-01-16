import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Ticket, Sparkles, ShoppingBag, QrCode, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { VoucherQRModal } from '@/components/vouchers/voucher-qr-modal-new';
import { CopyPinButton } from '@/components/vouchers/copy-pin-button';

export default async function VouchersNewPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  // Get user's vouchers from new system
  const vouchersRaw = await prisma.userVoucher.findMany({
    where: { userId },
    include: {
      offer: {
        include: {
          shop: true,
        },
      },
    },
    orderBy: {
      purchasedAt: 'desc',
    },
  });

  // Serialize dates
  const vouchers = vouchersRaw.map(v => ({
    ...v,
    purchasedAt: v.purchasedAt.toISOString(),
    redeemedAt: v.redeemedAt?.toISOString() || null,
    expiresAt: v.expiresAt?.toISOString() || null,
    offer: {
      ...v.offer,
      validFrom: v.offer.validFrom.toISOString(),
      validUntil: v.offer.validUntil?.toISOString() || null,
      createdAt: v.offer.createdAt.toISOString(),
      updatedAt: v.offer.updatedAt.toISOString(),
      shop: {
        ...v.offer.shop,
        createdAt: v.offer.shop.createdAt.toISOString(),
        updatedAt: v.offer.shop.updatedAt.toISOString(),
      },
    },
  }));

  const activeVouchers = vouchers.filter(v => v.status === 'purchased');
  const redeemedVouchers = vouchers.filter(v => v.status === 'redeemed');
  const expiredVouchers = vouchers.filter(v => v.status === 'expired');

  return (
    <div className="min-h-screen dark-pattern pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        
        <div className="container mx-auto px-4 lg:px-6 py-8 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-sm font-semibold border border-indigo-500/30">
              <Ticket className="h-4 w-4" />
              My Vouchers
            </div>
            <h1 className="text-3xl font-bold text-white">Your Vouchers</h1>
            <p className="text-white/70">
              View and manage all your purchased vouchers
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-6 py-6">
        {vouchers.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Ticket className="h-10 w-10 text-white/40" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Vouchers Yet</h2>
            <p className="text-white/60 mb-6">
              You haven't purchased any vouchers yet. Browse the marketplace to find great deals!
            </p>
            <Button asChild className="btn-gradient">
              <Link href="/marketplace">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Marketplace
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-white/60 text-sm">Active</p>
                    <p className="text-3xl font-bold text-green-400">{activeVouchers.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-white/60 text-sm">Redeemed</p>
                    <p className="text-3xl font-bold text-blue-400">{redeemedVouchers.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-white/60 text-sm">Expired</p>
                    <p className="text-3xl font-bold text-red-400">{expiredVouchers.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Vouchers */}
            {activeVouchers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Active Vouchers</h2>
                  <Button asChild variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <Link href="/marketplace">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get More
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeVouchers.map(voucher => (
                    <VoucherCard key={voucher.id} voucher={voucher} />
                  ))}
                </div>
              </div>
            )}

            {/* Redeemed Vouchers */}
            {redeemedVouchers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Redeemed Vouchers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {redeemedVouchers.map(voucher => (
                    <VoucherCard key={voucher.id} voucher={voucher} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function VoucherCard({ voucher }: { voucher: any }) {
  const isRedeemed = voucher.status === 'redeemed';
  const isExpired = voucher.status === 'expired';

  return (
    <Card className={`bg-white/5 border-white/10 ${isRedeemed ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-white text-lg">{voucher.offer.title}</CardTitle>
            <CardDescription className="text-white/60 mt-1">
              {voucher.offer.shop.name}
            </CardDescription>
          </div>
          {isRedeemed && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Redeemed
            </Badge>
          )}
          {isExpired && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              Expired
            </Badge>
          )}
          {!isRedeemed && !isExpired && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-white/80 text-sm line-clamp-2">{voucher.offer.description}</p>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan-400">{voucher.pricePaid}</span>
          <span className="text-white/60">points</span>
        </div>

        {!isRedeemed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-white/60 text-xs">PIN Code</p>
                <p className="text-white font-mono text-lg">{voucher.pinCode}</p>
              </div>
              <CopyPinButton pinCode={voucher.pinCode} />
            </div>

            <VoucherQRModal
              voucherId={voucher.id}
              qrCodeData={voucher.qrCodeData}
              pinCode={voucher.pinCode}
              title={voucher.offer.title}
              shopName={voucher.offer.shop.name}
            />
          </div>
        )}

        {isRedeemed && voucher.redeemedAt && (
          <div className="text-xs text-white/40">
            Redeemed on {new Date(voucher.redeemedAt).toLocaleDateString()}
          </div>
        )}

        {voucher.expiresAt && !isRedeemed && (
          <div className="text-xs text-white/40">
            Expires: {new Date(voucher.expiresAt).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
