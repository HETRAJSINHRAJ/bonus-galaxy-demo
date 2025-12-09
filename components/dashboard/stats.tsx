import { Receipt, TrendingUp, Coins, Award, ArrowUp, ArrowDown } from 'lucide-react';
import prisma from '@/lib/prisma';

interface DashboardStatsProps {
  userId: string;
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const lastMonth = new Date(currentMonth);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const [receiptsCount, totalSpent, pointsBalance, receiptsThisMonth, receiptsLastMonth] = await Promise.all([
    prisma.receipt.count({ where: { userId } }),
    prisma.receipt.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.pointsTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.receipt.count({
      where: {
        userId,
        receiptDate: { gte: currentMonth },
      },
    }),
    prisma.receipt.count({
      where: {
        userId,
        receiptDate: { gte: lastMonth, lt: currentMonth },
      },
    }),
  ]);

  const monthChange = receiptsLastMonth > 0 
    ? ((receiptsThisMonth - receiptsLastMonth) / receiptsLastMonth * 100).toFixed(0)
    : 0;

  const stats = [
    {
      label: 'Gescannte Rechnungen',
      value: receiptsCount.toString(),
      icon: Receipt,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Gesamtausgaben',
      value: `€${(totalSpent._sum.amount || 0).toFixed(2)}`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Punkte-Balance',
      value: (pointsBalance._sum.amount || 0).toLocaleString('de-DE'),
      icon: Coins,
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Diesen Monat',
      value: receiptsThisMonth.toString(),
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      change: monthChange,
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const hasPositiveChange = stat.change && Number(stat.change) > 0;
        const hasNegativeChange = stat.change && Number(stat.change) < 0;
        
        return (
          <div 
            key={stat.label} 
            className="group relative overflow-hidden p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
          >
            {/* Gradient Background */}
            <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                {stat.change !== undefined && (
                  <div className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                    hasPositiveChange ? 'bg-emerald-500/20 text-emerald-400' : 
                    hasNegativeChange ? 'bg-red-500/20 text-red-400' : 
                    'bg-white/10 text-white/60'
                  }`}>
                    {hasPositiveChange && <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                    {hasNegativeChange && <ArrowDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                    {stat.change}%
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-xs sm:text-sm font-medium text-white/60 mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-all">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
