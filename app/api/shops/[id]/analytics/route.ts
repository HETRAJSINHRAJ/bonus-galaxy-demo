import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/shops/:id/analytics
 * Get shop analytics dashboard
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if user has access to this shop's analytics
    const employee = await prisma.employee.findFirst({
      where: {
        userId,
        shopId: id,
        isActive: true,
        OR: [
          { canViewAnalytics: true },
          { isManager: true },
        ],
      },
    });

    if (!employee) {
      // TODO: Check if user is super admin
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view analytics.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30'; // days
    const periodDays = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get shop details
    const shop = await prisma.shop.findUnique({
      where: { id },
    });

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    // Get vouchers sold and redeemed in period
    const vouchersSold = await prisma.userVoucher.count({
      where: {
        offer: { shopId: id },
        purchasedAt: { gte: startDate },
      },
    });

    const vouchersRedeemed = await prisma.userVoucher.count({
      where: {
        offer: { shopId: id },
        status: 'redeemed',
        redeemedAt: { gte: startDate },
      },
    });

    // Calculate redemption rate
    const redemptionRate = vouchersSold > 0 
      ? parseFloat(((vouchersRedeemed / vouchersSold) * 100).toFixed(2))
      : 0;

    // Get revenue (points earned from redemptions)
    const revenueData = await prisma.userVoucher.aggregate({
      where: {
        offer: { shopId: id },
        status: 'redeemed',
        redeemedAt: { gte: startDate },
      },
      _sum: {
        pricePaid: true,
      },
    });

    const revenue = revenueData._sum.pricePaid || 0;

    // Get top offers
    const topOffers = await prisma.voucherOffer.findMany({
      where: {
        shopId: id,
        userVouchers: {
          some: {
            status: 'redeemed',
            redeemedAt: { gte: startDate },
          },
        },
      },
      select: {
        id: true,
        title: true,
        soldCount: true,
        redeemedCount: true,
        priceInPoints: true,
      },
      orderBy: {
        redeemedCount: 'desc',
      },
      take: 5,
    });

    // Get employee activity
    const employeeActivity = await prisma.employee.findMany({
      where: {
        shopId: id,
        isActive: true,
        redemptions: {
          some: {
            redeemedAt: { gte: startDate },
          },
        },
      },
      select: {
        id: true,
        name: true,
        totalRedemptions: true,
        _count: {
          select: {
            redemptions: {
              where: {
                redeemedAt: { gte: startDate },
              },
            },
          },
        },
      },
      orderBy: {
        totalRedemptions: 'desc',
      },
      take: 10,
    });

    // Get daily redemption trend
    const dailyRedemptions = await prisma.$queryRaw<Array<{ date: Date; count: number }>>`
      SELECT 
        DATE(redeemed_at) as date,
        COUNT(*)::int as count
      FROM "UserVoucher"
      WHERE offer_id IN (
        SELECT id FROM "VoucherOffer" WHERE shop_id = ${id}
      )
      AND status = 'redeemed'
      AND redeemed_at >= ${startDate}
      GROUP BY DATE(redeemed_at)
      ORDER BY date ASC
    `;

    // Get average redemption time (hours from purchase to redemption)
    const avgRedemptionTime = await prisma.$queryRaw<Array<{ avg_hours: number }>>`
      SELECT 
        AVG(EXTRACT(EPOCH FROM (redeemed_at - purchased_at)) / 3600)::float as avg_hours
      FROM "UserVoucher"
      WHERE offer_id IN (
        SELECT id FROM "VoucherOffer" WHERE shop_id = ${id}
      )
      AND status = 'redeemed'
      AND redeemed_at >= ${startDate}
    `;

    return NextResponse.json({
      shop: {
        id: shop.id,
        name: shop.name,
        nequadaBalance: shop.nequadaBalance,
        totalVouchersSold: shop.totalVouchersSold,
        totalVouchersRedeemed: shop.totalVouchersRedeemed,
      },
      period: {
        days: periodDays,
        startDate,
        endDate: new Date(),
      },
      metrics: {
        vouchersSold,
        vouchersRedeemed,
        redemptionRate,
        revenue,
        avgRedemptionTime: avgRedemptionTime[0]?.avg_hours?.toFixed(2) || 0,
      },
      topOffers: topOffers.map(offer => ({
        id: offer.id,
        title: offer.title,
        soldCount: offer.soldCount,
        redeemedCount: offer.redeemedCount,
        revenue: offer.redeemedCount * offer.priceInPoints,
      })),
      employeeActivity: employeeActivity.map(emp => ({
        id: emp.id,
        name: emp.name,
        totalRedemptions: emp.totalRedemptions,
        periodRedemptions: emp._count.redemptions,
      })),
      dailyTrend: dailyRedemptions,
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
