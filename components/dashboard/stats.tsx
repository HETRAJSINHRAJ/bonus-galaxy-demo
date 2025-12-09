import { Card } from '@/components/ui/card';
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
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Gesamtausgaben',
      value: `€${(totalSpent._sum.amount || 0).toFixed(2)}`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Punkte-Balance',
      value: (pointsBalance._sum.amount || 0).toLocaleString('de-DE'),
      icon: Coins,
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Diesen Monat',
      value: receiptsThisMonth.toString(),
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: monthChange,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const hasPositiveChange = stat.change && Number(stat.change) > 0;
        const hasNegativeChange = stat.change && Number(stat.change) < 0;
        
        return (
          <div 
            key={stat.label} 
            className="group relative overflow-hidden p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
          >
            {/* Gradient Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                {stat.change !== undefined && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    hasPositiveChange ? 'bg-green-50 text-green-700' : 
                    hasNegativeChange ? 'bg-red-50 text-red-700' : 
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {hasPositiveChange && <ArrowUp className="h-3 w-3" />}
                    {hasNegativeChange && <ArrowDown className="h-3 w-3" />}
                    {stat.change}%
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
