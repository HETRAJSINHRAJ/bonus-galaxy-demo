import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, Role } from '@/lib/auth';
import { AnalyticsQuerySchema } from '@/lib/mission-validation';

/**
 * GET /api/admin/missions/analytics
 * Get mission analytics and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const authCheck = await requireRole(Role.VIEWER);
    if (authCheck instanceof NextResponse) return authCheck;

    const { searchParams } = new URL(request.url);
    
    const queryParams = {
      missionId: searchParams.get('missionId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      groupBy: (searchParams.get('groupBy') || 'day') as 'day' | 'week' | 'month',
    };

    const filters = AnalyticsQuerySchema.parse(queryParams);

    // Build where clause for analytics
    const where: any = {};
    
    if (filters.missionId) {
      where.missionId = filters.missionId;
    }
    
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }

    // Get analytics data
    const analytics = await prisma.missionAnalytics.findMany({
      where,
      orderBy: { date: 'asc' },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            type: true,
            category: true,
          },
        },
      },
    });

    // Calculate aggregated statistics
    const stats = analytics.reduce(
      (acc, record) => ({
        totalViews: acc.totalViews + record.views,
        totalStarts: acc.totalStarts + record.starts,
        totalCompletions: acc.totalCompletions + record.completions,
        totalFailures: acc.totalFailures + record.failures,
        totalUniqueUsers: acc.totalUniqueUsers + record.uniqueUsers,
        totalPointsAwarded: acc.totalPointsAwarded + record.totalPointsAwarded,
        totalBonusAwarded: acc.totalBonusAwarded + record.totalBonusAwarded,
      }),
      {
        totalViews: 0,
        totalStarts: 0,
        totalCompletions: 0,
        totalFailures: 0,
        totalUniqueUsers: 0,
        totalPointsAwarded: 0,
        totalBonusAwarded: 0,
      }
    );

    // Calculate average metrics
    const avgCompletionRate = stats.totalStarts > 0 
      ? (stats.totalCompletions / stats.totalStarts) * 100 
      : 0;
    
    const avgCompletionTime = analytics
      .filter(a => a.avgCompletionTime !== null)
      .reduce((sum, a) => sum + (a.avgCompletionTime || 0), 0) / analytics.length || 0;

    // Get top performing missions if no specific mission is requested
    let topMissions: any[] = [];
    if (!filters.missionId) {
      topMissions = await prisma.mission.findMany({
        take: 10,
        orderBy: { currentCompletions: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          category: true,
          currentCompletions: true,
          pointsReward: true,
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      analytics,
      stats: {
        ...stats,
        avgCompletionRate,
        avgCompletionTime,
      },
      topMissions,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
