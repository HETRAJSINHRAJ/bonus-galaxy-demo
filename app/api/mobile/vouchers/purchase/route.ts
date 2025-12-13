import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { voucherId, pointsCost } = body;

    if (!voucherId || pointsCost === undefined) {
      return NextResponse.json({ error: 'Voucher ID and points cost are required' }, { status: 400 });
    }

    // Get user's current points
    const transactions = await prisma.pointsTransaction.findMany({
      where: { userId },
    });
    
    const currentPoints = transactions.reduce((sum, t) => {
      return sum + t.amount;
    }, 0);

    if (currentPoints < pointsCost) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      );
    }

    // Deduct points
    await prisma.pointsTransaction.create({
      data: {
        userId,
        amount: -pointsCost,
        type: 'spend',
        description: `Voucher purchase: ${voucherId}`,
      },
    });

    // Create voucher purchase record
    await prisma.voucherPurchase.create({
      data: {
        userId,
        voucherId,
        status: 'completed',
        amount: 0, // Paid with points
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Voucher purchased successfully',
      remainingPoints: currentPoints - pointsCost
    });
  } catch (error) {
    console.error('Purchase voucher error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}