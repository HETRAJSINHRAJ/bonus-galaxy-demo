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
}
