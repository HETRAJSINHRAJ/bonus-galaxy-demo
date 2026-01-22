import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/employees/:id/analytics
 * Get employee performance metrics
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

    // Get employee
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        shop: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if user owns this employee record or is manager/admin
    if (employee.userId !== userId) {
      const manager = await prisma.employee.findFirst({
        where: {
          userId,
          shopId: employee.shopId,
          isManager: true,
        },
      });

      if (!manager) {
        // TODO: Check if user is super admin
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30'; // days
    const periodDays = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get redemptions in period
    const redemptions = await prisma.userVoucher.findMany({
      where: {
        redeemedByEmpId: id,
        redeemedAt: { gte: startDate },
      },
      include: {
        offer: {
          select: {
            title: true,
            priceInPoints: true,
          },
        },
      },
      orderBy: {
        redeemedAt: 'desc',
      },
    });

    const redemptionCount = redemptions.length;

    // Calculate total value redeemed
    const totalValue = redemptions.reduce((sum, v) => sum + v.pricePaid, 0);

    // Get daily redemption count
    const dailyRedemptions = await prisma.$queryRaw<Array<{ date: Date; count: number }>>`
      SELECT 
        DATE(redeemed_at) as date,
        COUNT(*)::int as count
      FROM "UserVoucher"
      WHERE redeemed_by_emp_id = ${id}
      AND redeemed_at >= ${startDate}
      GROUP BY DATE(redeemed_at)
      ORDER BY date ASC
    `;

    // Calculate average redemptions per day
    const avgPerDay = periodDays > 0 
      ? parseFloat((redemptionCount / periodDays).toFixed(2))
      : 0;

    // Get most redeemed offers
    const offerBreakdown = redemptions.reduce((acc, v) => {
      const title = v.offer.title;
      if (!acc[title]) {
        acc[title] = { count: 0, value: 0 };
      }
      acc[title].count++;
      acc[title].value += v.pricePaid;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    const topOffers = Object.entries(offerBreakdown)
      .map(([title, data]) => ({ title, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get employee rank in shop
    const shopEmployees = await prisma.employee.findMany({
      where: {
        shopId: employee.shopId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        totalRedemptions: true,
      },
      orderBy: {
        totalRedemptions: 'desc',
      },
    });

    const rank = shopEmployees.findIndex(e => e.id === id) + 1;

    return NextResponse.json({
      employee: {
        id: employee.id,
        name: employee.name,
        shopName: employee.shop.name,
        totalRedemptions: employee.totalRedemptions,
        totalOffersCreated: employee.totalOffersCreated,
      },
      period: {
        days: periodDays,
        startDate,
        endDate: new Date(),
      },
      metrics: {
        redemptionCount,
        totalValue,
        avgPerDay,
        rank,
        totalEmployees: shopEmployees.length,
      },
      topOffers,
      dailyTrend: dailyRedemptions,
      recentRedemptions: redemptions.slice(0, 10).map(r => ({
        id: r.id,
        offerTitle: r.offer.title,
        value: r.pricePaid,
        redeemedAt: r.redeemedAt,
      })),
    });

  } catch (error) {
    console.error('Error fetching employee analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
