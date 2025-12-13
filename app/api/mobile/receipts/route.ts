import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const receipts = await prisma.receipt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(
      receipts.map(receipt => ({
        id: receipt.id,
        userId: receipt.userId,
        amount: receipt.amount,
        points: receipt.pointsEarned,
        store: receipt.taxId || 'Unknown Store',
        qrCode: receipt.qrCodeData,
        scannedAt: receipt.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error('Get receipts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}