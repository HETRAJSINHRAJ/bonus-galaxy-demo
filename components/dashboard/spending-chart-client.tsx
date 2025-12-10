'use client';

import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ChartData {
  month: string;
  amount: number;
}

interface SpendingChartClientProps {
  chartData: ChartData[];
}

const chartConfig = {
  amount: {
    label: 'Ausgaben',
    color: '#6366f1',
  },
} satisfies ChartConfig;

export function SpendingChartClient({ chartData }: SpendingChartClientProps) {
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
  const avgAmount = chartData.length > 0 ? (totalAmount / chartData.length).toFixed(0) : '0';
  const firstMonth = chartData[0]?.amount || 0;
  const lastMonth = chartData[chartData.length - 1]?.amount || 0;
  const trendValue = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth * 100) : 0;
  const trend = Math.abs(trendValue).toFixed(0);
  const isPositiveTrend = trendValue >= 0;

  return (
    <div className="rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base">Ausgaben Übersicht</h3>
              <p className="text-xs sm:text-sm text-white/60">Letzte 6 Monate</p>
            </div>
          </div>
          {totalAmount > 0 && (
            <div className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
              isPositiveTrend 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositiveTrend ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              {isPositiveTrend ? '+' : '-'}{trend}%
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-white/60 mb-1">Gesamt</p>
            <p className="text-xl sm:text-2xl font-bold text-white">€{totalAmount}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-white/60 mb-1">Durchschnitt</p>
            <p className="text-xl sm:text-2xl font-bold text-white">€{avgAmount}</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {totalAmount === 0 ? (
          <div className="h-[200px] sm:h-[250px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 text-sm">Noch keine Belege gescannt</p>
              <p className="text-white/40 text-xs mt-1">Scanne deinen ersten Beleg um Daten zu sehen</p>
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255,255,255,0.1)" 
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  tickFormatter={(value) => `€${value}`}
                  dx={-10}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
