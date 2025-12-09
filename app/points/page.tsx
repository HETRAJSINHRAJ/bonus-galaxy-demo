import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, TrendingDown, ScanLine, Gamepad2, ShoppingBag, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';

export default async function PointsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  const [pointsBalance, transactions] = await Promise.all([
    prisma.pointsTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.pointsTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  const totalPoints = pointsBalance._sum.amount || 0;
  const earnedPoints = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const spentPoints = Math.abs(
    transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
  );

  const stats = [
    {
      label: 'Aktueller Stand',
      value: totalPoints.toLocaleString('de-DE'),
      icon: Coins,
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/20',
    },
    {
      label: 'Verdient',
      value: earnedPoints.toLocaleString('de-DE'),
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/20',
    },
    {
      label: 'Ausgegeben',
      value: spentPoints.toLocaleString('de-DE'),
      icon: TrendingDown,
      gradient: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/20',
    },
  ];

  const earnMethods = [
    { icon: ScanLine, text: 'Scanne Rechnungen: €1 = 100 Punkte' },
    { icon: Gamepad2, text: 'Spiele Arcade-Games und gewinne Punkte' },
    { icon: ShoppingBag, text: 'Kaufe Premium-Bundles und erhalte Bonuspunkte' },
  ];

  return (
    <div className="min-h-screen dark-pattern pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        
        <div className="container mx-auto px-4 lg:px-8 py-8 relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25 animate-float">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Meine Punkte</h1>
            <p className="text-white/70">Überblick über deine Punkte und Transaktionen</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Points Summary */}
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label} 
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/60 font-medium">{stat.label}</span>
                    <div className={`${stat.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Transaction History */}
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Transaktionsverlauf
            </h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-indigo-400" />
                </div>
                <p className="text-white/60 mb-4">Noch keine Transaktionen vorhanden.</p>
                <Link href="/scan">
                  <Button className="btn-gradient">Erste Rechnung scannen</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          className={transaction.amount > 0 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }
                        >
                          {transaction.type === 'earn' ? 'Verdient' : 
                           transaction.type === 'spend' ? 'Ausgegeben' : 'Gewinn'}
                        </Badge>
                        <span className="text-sm text-white/50">
                          {format(new Date(transaction.createdAt), 'dd. MMM yyyy, HH:mm', { locale: de })}
                        </span>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-white/60">{transaction.description}</p>
                      )}
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('de-DE')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How to earn more */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Wie sammle ich mehr Punkte?
            </h3>
            <div className="space-y-3">
              {earnMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-sm text-white/80">{method.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
