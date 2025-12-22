import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/missions
 * Get active missions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    const now = new Date();

    // Build where clause
    const where: any = {
      isActive: true,
      isHidden: false,
      OR: [
        { startDate: null },
        { startDate: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      ],
    };

    if (type) where.type = type;
    if (category) where.category = category;
    if (featured) where.isFeatured = true;

    // Get missions
    const missions = await prisma.mission.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        type: true,
        category: true,
        difficulty: true,
        pointsReward: true,
        bonusReward: true,
        requirements: true,
        imageUrl: true,
        iconName: true,
        isFeatured: true,
        maxCompletions: true,
        totalLimit: true,
        currentCompletions: true,
        partnerName: true,
        partnerLogoUrl: true,
        startDate: true,
        endDate: true,
      },
    });

    // Get user's progress for these missions
    const userProgress = await prisma.userMissionProgress.findMany({
      where: {
        userId,
        missionId: { in: missions.map((m) => m.id) },
      },
    });

    // Create a map of progress by mission ID
    const progressMap = new Map(
      userProgress.map((p) => [p.missionId, p])
    );

    // Combine missions with user progress
    const missionsWithProgress = missions.map((mission) => ({
      ...mission,
      userProgress: progressMap.get(mission.id) || null,
      isAvailable: mission.totalLimit ? mission.currentCompletions < mission.totalLimit : true,
    }));

    return NextResponse.json({ missions: missionsWithProgress });
  } catch (error) {
    console.error('Get missions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
