import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's transactions to calculate points
    const transactions = await prisma.pointsTransaction.findMany({
      where: { userId },
      select: {
        amount: true,
        type: true,
      },
    });

    // Calculate points balance
    let balance = 0;
    let earned = 0;
    let spent = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'EARN') {
        balance += transaction.amount;
        earned += transaction.amount;
      } else if (transaction.type === 'SPEND') {
        balance -= transaction.amount;
        spent += transaction.amount;
      }
    });

    return NextResponse.json({
      balance: Math.max(0, balance), // Ensure balance is never negative
      earned,
      spent,
    });
  } catch (error) {
    console.error('Get points error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}