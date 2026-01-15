import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { VoucherList } from '@/components/vouchers/voucher-list';
import { Ticket, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function VouchersPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  // Get user's voucher purchases
  const purchasesRaw = await prisma.voucherPurchase.findMany({
    where: { 
      userId,
      status: 'completed'
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      voucherId: true,
      amount: true,
      createdAt: true,
      stripeSessionId: true,
      pinCode: true,
      qrCodeData: true,
      isRedeemed: true,
      redeemedAt: true,
      redeemedBy: true,
      redeemedLocation: true,
      expiresAt: true,
    }
  });

  // Serialize dates to avoid hydration issues
  const purchases = purchasesRaw.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    redeemedAt: p.redeemedAt?.toISOString() || null,
    expiresAt: p.expiresAt?.toISOString() || null,
  }));

  return (
    <div className="min-h-screen dark-pattern pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-amber-400/20 blur-2xl animate-float hidden sm:block" />
        <div className="absolute bottom-10 left-20 w-16 h-16 rounded-full bg-purple-400/20 blur-2xl animate-float-slow hidden sm:block" />
        
        <div className="container mx-auto px-4 lg:px-6 py-8 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-sm font-semibold border border-indigo-500/30 animate-pulse-glow">
              <Ticket className="h-4 w-4" />
              Meine Gutscheine
            </div>
            <h1 className="text-3xl font-bold text-white">Deine Gutscheine</h1>
            <p className="text-white/70">
              Hier findest du alle deine gekauften Gutscheine
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-6 py-6">
        {purchases.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Ticket className="h-10 w-10 text-white/40" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Noch keine Gutscheine</h2>
            <p className="text-white/60 mb-6">
              Du hast noch keine Gutscheine gekauft. Stöbere in unserem Shop und sichere dir tolle Angebote!
            </p>
            <Button asChild className="btn-gradient">
              <Link href="/shop">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Zum Shop
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-white/70">
                Du hast <span className="text-white font-semibold">{purchases.length}</span> Gutschein{purchases.length !== 1 ? 'e' : ''}
              </p>
              <Button asChild variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                <Link href="/shop">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Mehr kaufen
                </Link>
              </Button>
            </div>
            
            <VoucherList purchases={purchases} />
          </div>
        )}
      </main>
    </div>
  );
}
