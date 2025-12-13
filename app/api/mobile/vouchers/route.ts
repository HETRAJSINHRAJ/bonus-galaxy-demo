import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vouchers = await prisma.voucher.findMany({
      where: { 
        isActive: true
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(vouchers);
  } catch (error) {
    console.error('Get vouchers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}