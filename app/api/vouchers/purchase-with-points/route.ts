import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bundleId, pointsCost, voucherCount } = await req.json();

    // Get user's current points
    const pointsTransactions = await prisma.pointsTransaction.findMany({
      where: { userId },
    });
    
    const currentPoints = pointsTransactions.reduce((sum, t) => {
      return sum + t.amount; // Simply add all amounts (negative amounts will subtract)
    }, 0);

    // Check if user has enough points
    if (currentPoints < pointsCost) {
      return NextResponse.json(
        { error: `Sie benötigen ${pointsCost.toLocaleString()} Punkte. Aktuell verfügbar: ${currentPoints.toLocaleString()} Punkte.` },
        { status: 400 }
      );
    }

    // Deduct points (store as negative amount)
    await prisma.pointsTransaction.create({
      data: {
        userId,
        amount: -pointsCost,
        type: 'spend',
        description: `Gekauft: ${voucherCount} Gutscheine (${bundleId})`,
      },
    });

    // Create voucher purchase record
    await prisma.voucherPurchase.create({
      data: {
        userId,
        voucherId: bundleId,
        status: 'completed',
        amount: 0, // Paid with points
      },
    });

    return NextResponse.json({ 
      success: true,
      message: '🎉 Erfolgreich! Ihre Gutscheine wurden freigeschaltet.',
      remainingPoints: currentPoints - pointsCost
    });
  } catch (error) {
    console.error('Error purchasing with points:', error);
    return NextResponse.json(
      { error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
