import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total receipts count
    const totalReceipts = await prisma.receipt.count({
      where: { userId },
    });

    // Get total expenses (sum of all receipt amounts)
    const totalExpenses = await prisma.receipt.aggregate({
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    // Get monthly stats (current month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const monthlyReceipts = await prisma.receipt.count({
      where: {
        userId,
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    const lastMonthReceipts = await prisma.receipt.count({
      where: {
        userId,
        createdAt: {
          gte: firstDayOfLastMonth,
          lt: firstDayOfMonth,
        },
      },
    });

    // Calculate month change percentage
    const monthChange = lastMonthReceipts > 0 
      ? ((monthlyReceipts - lastMonthReceipts) / lastMonthReceipts) * 100 
      : 0;

    // Get current points balance
    const pointsTransactions = await prisma.pointsTransaction.findMany({
      where: { userId },
      select: {
        amount: true,
        type: true,
      },
    });

    const pointsBalance = pointsTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Get monthly spending data for the last 6 months (matching web app logic)
    const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    
    // Get receipts from the last 6 months using receiptDate (same as web app)
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

    // Group receipts by month (same logic as web app)
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

    // Convert to chart data format (same as web app)
    const monthlySpending = Array.from(monthlyData.entries()).map(([key, amount]) => {
      const [year, monthIndex] = key.split('-');
      return {
        month: monthNames[parseInt(monthIndex)],
        amount: Math.round(amount),
      };
    });

    return NextResponse.json({
      totalReceipts,
      totalExpenses: totalExpenses._sum.amount || 0,
      pointsBalance,
      monthlyStats: {
        receipts: monthlyReceipts,
        monthChange,
      },
      monthlySpending,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}