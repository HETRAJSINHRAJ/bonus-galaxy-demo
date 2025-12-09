'use client';

import { TrendingUp, BarChart3 } from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface SpendingChartProps {
  userId: string;
}

const chartConfig = {
  amount: {
    label: 'Ausgaben',
    color: '#6366f1',
  },
} satisfies ChartConfig;

export function SpendingChart({ userId }: SpendingChartProps) {
  // Demo data - in production this would come from the server
  const chartData = [
    { month: 'Jan', amount: 186 },
    { month: 'Feb', amount: 305 },
    { month: 'Mär', amount: 237 },
    { month: 'Apr', amount: 273 },
    { month: 'Mai', amount: 209 },
    { month: 'Jun', amount: 314 },
  ];

  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
  const avgAmount = (totalAmount / chartData.length).toFixed(0);
  const trend = ((chartData[chartData.length - 1].amount - chartData[0].amount) / chartData[0].amount * 100).toFixed(0);

  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ausgaben Übersicht</h3>
              <p className="text-sm text-gray-500">Letzte 6 Monate</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            +{trend}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Gesamt</p>
            <p className="text-2xl font-bold text-gray-900">€{totalAmount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Durchschnitt</p>
            <p className="text-2xl font-bold text-gray-900">€{avgAmount}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f3f4f6" 
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `€${value}`}
                dx={-10}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />} 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
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
      </div>
    </div>
  );
}
