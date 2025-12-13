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

    return NextResponse.json({
      totalReceipts,
      totalExpenses: totalExpenses._sum.amount || 0,
      pointsBalance,
      monthlyStats: {
        receipts: monthlyReceipts,
        monthChange,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}