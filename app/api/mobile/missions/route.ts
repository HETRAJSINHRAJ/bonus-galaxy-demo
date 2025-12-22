import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/mobile/missions
 * Get active missions for mobile app
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

    // Get missions
    const missions = await prisma.mission.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
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
    const missionsWithProgress = missions.map((mission) => {
      const userProg = progressMap.get(mission.id);
      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        shortDescription: mission.shortDescription,
        type: mission.type,
        category: mission.category,
        difficulty: mission.difficulty,
        pointsReward: mission.pointsReward,
        bonusReward: mission.bonusReward,
        requirements: mission.requirements,
        imageUrl: mission.imageUrl,
        iconName: mission.iconName,
        isFeatured: mission.isFeatured,
        maxCompletions: mission.maxCompletions,
        partnerName: mission.partnerName,
        partnerLogoUrl: mission.partnerLogoUrl,
        status: userProg?.status || 'not_started',
        progress: userProg?.progress || {},
        currentStep: userProg?.currentStep || 0,
        totalSteps: userProg?.totalSteps || 1,
        completionCount: userProg?.completionCount || 0,
        isAvailable: mission.totalLimit ? mission.currentCompletions < mission.totalLimit : true,
        canComplete: mission.maxCompletions ? (userProg?.completionCount || 0) < mission.maxCompletions : true,
      };
    });

    // Group missions by category for better mobile UX
    const grouped = {
      featured: missionsWithProgress.filter((m) => m.isFeatured),
      daily: missionsWithProgress.filter((m) => m.type === 'daily'),
      weekly: missionsWithProgress.filter((m) => m.type === 'weekly'),
      special: missionsWithProgress.filter((m) => m.category === 'special'),
      all: missionsWithProgress,
    };

    return NextResponse.json({
      missions: grouped,
      stats: {
        total: missionsWithProgress.length,
        completed: missionsWithProgress.filter((m) => m.status === 'completed').length,
        inProgress: missionsWithProgress.filter((m) => m.status === 'in_progress').length,
      },
    });
  } catch (error) {
    console.error('Get mobile missions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
