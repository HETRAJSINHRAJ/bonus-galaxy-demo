import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/vouchers/redemptions
 * Get all voucher redemptions (for admin dashboard)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const location = searchParams.get('location');
    const employee = searchParams.get('employee');
    
    // Build where clause
    const where: any = {
      isRedeemed: true
    };
    
    if (startDate || endDate) {
      where.redeemedAt = {};
      if (startDate) {
        where.redeemedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.redeemedAt.lte = new Date(endDate);
      }
    }
    
    if (location) {
      where.redeemedLocation = location;
    }
    
    if (employee) {
      where.redeemedBy = employee;
    }
    
    // Fetch redemptions
    const redemptions = await prisma.voucherPurchase.findMany({
      where,
      orderBy: {
        redeemedAt: 'desc'
      },
      select: {
        id: true,
        userId: true,
        voucherId: true,
        amount: true,
        redeemedAt: true,
        redeemedBy: true,
        redeemedLocation: true,
        createdAt: true
      }
    });
    
    // Calculate analytics
    const analytics = {
      totalRedemptions: redemptions.length,
      totalValue: redemptions.reduce((sum, r) => sum + r.amount, 0),
      byLocation: {} as Record<string, number>,
      byEmployee: {} as Record<string, number>
    };
    
    redemptions.forEach(r => {
      if (r.redeemedLocation) {
        analytics.byLocation[r.redeemedLocation] = (analytics.byLocation[r.redeemedLocation] || 0) + 1;
      }
      if (r.redeemedBy) {
        analytics.byEmployee[r.redeemedBy] = (analytics.byEmployee[r.redeemedBy] || 0) + 1;
      }
    });
    
    return NextResponse.json({
      redemptions,
      analytics
    });
    
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redemptions' },
      { status: 500 }
    );
  }
}
