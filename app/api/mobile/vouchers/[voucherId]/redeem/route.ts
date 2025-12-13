import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ voucherId: string }> }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { voucherId } = await params;

    // Find the voucher purchase
    const voucherPurchase = await prisma.voucherPurchase.findFirst({
      where: { 
        userId,
        voucherId,
        status: 'completed'
      },
    });

    if (!voucherPurchase) {
      return NextResponse.json({ error: 'Voucher not found or already redeemed' }, { status: 404 });
    }

    // Update status to redeemed
    await prisma.voucherPurchase.update({
      where: { id: voucherPurchase.id },
      data: { status: 'redeemed' },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Voucher redeemed successfully'
    });
  } catch (error) {
    console.error('Redeem voucher error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}