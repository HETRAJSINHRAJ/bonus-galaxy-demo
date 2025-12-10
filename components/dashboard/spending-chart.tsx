import prisma from '@/lib/prisma';
import { SpendingChartClient } from './spending-chart-client';

interface SpendingChartProps {
  userId: string;
}

const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

export async function SpendingChart({ userId }: SpendingChartProps) {
  // Get receipts from the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const receipts = await prisma.receipt.findMany({
    where: {
      userId,
      receiptDate: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      amount: true,
      receiptDate: true,
    },
    orderBy: {
      receiptDate: 'asc',
    },
  });

  // Group receipts by month
  const monthlyData = new Map<string, number>();
  
  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyData.set(key, 0);
  }

  // Sum up amounts by month
  receipts.forEach(receipt => {
    const date = new Date(receipt.receiptDate);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyData.set(key, (monthlyData.get(key) || 0) + receipt.amount);
  });

  // Convert to chart data format
  const chartData = Array.from(monthlyData.entries()).map(([key, amount]) => {
    const [year, monthIndex] = key.split('-');
    return {
      month: monthNames[parseInt(monthIndex)],
      amount: Math.round(amount),
    };
  });

  // Pass data to client component
  return <SpendingChartClient chartData={chartData} />;

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
          <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium flex-shrink-0">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            +{trend}%
          </div>
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
      </div>
    </div>
  );
}
