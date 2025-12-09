import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
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
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const stats = [
    {
      label: 'Aktueller Stand',
      value: totalPoints.toLocaleString('de-DE'),
      icon: Coins,
      color: 'text-[#6366f1]',
      bgColor: 'bg-[#6366f1]/10',
      borderColor: 'border-[#6366f1]/20',
    },
    {
      label: 'Verdient',
      value: earnedPoints.toLocaleString('de-DE'),
      icon: TrendingUp,
      color: 'text-[#10b981]',
      bgColor: 'bg-[#10b981]/10',
      borderColor: 'border-[#10b981]/20',
    },
    {
      label: 'Ausgegeben',
      value: spentPoints.toLocaleString('de-DE'),
      icon: TrendingDown,
      color: 'text-[#ef4444]',
      bgColor: 'bg-[#ef4444]/10',
      borderColor: 'border-[#ef4444]/20',
    },
  ];

  const earnMethods = [
    { icon: ScanLine, text: 'Scanne Rechnungen: €1 = 100 Punkte' },
    { icon: Gamepad2, text: 'Spiele Arcade-Games und gewinne Punkte' },
    { icon: ShoppingBag, text: 'Kaufe Premium-Bundles und erhalte Bonuspunkte' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="bg-gradient-hero border-b border-border/40">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Meine Punkte</h1>
            <p className="text-muted-foreground">
              Überblick über deine Punkte und Transaktionen
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Points Summary */}
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={stat.label} 
                  className={`p-6 bg-white border ${stat.borderColor} card-hover`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </Card>
              );
            })}
          </div>

          {/* Transaction History */}
          <Card className="p-6 bg-white border border-border">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#6366f1]" />
              Transaktionsverlauf
            </h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#6366f1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-[#6366f1]" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Noch keine Transaktionen vorhanden.
                </p>
                <Link href="/scan">
                  <Button className="btn-gradient">
                    Erste Rechnung scannen
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl hover:bg-[#f3f4f6] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          className={transaction.amount > 0 
                            ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20' 
                            : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20'
                          }
                        >
                          {transaction.type === 'earn' ? 'Verdient' : 
                           transaction.type === 'spend' ? 'Ausgegeben' : 'Gewinn'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(transaction.createdAt), 'dd. MMM yyyy, HH:mm', { locale: de })}
                        </span>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('de-DE')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* How to earn more */}
          <Card className="p-6 bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 border-[#6366f1]/20">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#6366f1]" />
              Wie sammle ich mehr Punkte?
            </h3>
            <div className="space-y-3">
              {earnMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Icon className="h-5 w-5 text-[#6366f1]" />
                    </div>
                    <span className="text-sm">{method.text}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
