import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/mobile/missions/[id]
 * Get a specific mission for mobile app
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const mission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    if (!mission.isActive) {
      return NextResponse.json({ error: 'Mission is not active' }, { status: 403 });
    }

    // Get user's progress for this mission
    const userProgress = await prisma.userMissionProgress.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId: id,
        },
      },
    });

    // Track view analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.missionAnalytics.upsert({
      where: {
        missionId_date: {
          missionId: id,
          date: today,
        },
      },
      create: {
        missionId: id,
        date: today,
        views: 1,
        uniqueUsers: 1,
      },
      update: {
        views: { increment: 1 },
      },
    });

    return NextResponse.json({
      mission: {
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
        validationRules: mission.validationRules,
        imageUrl: mission.imageUrl,
        iconName: mission.iconName,
        isFeatured: mission.isFeatured,
        maxCompletions: mission.maxCompletions,
        partnerName: mission.partnerName,
        partnerLogoUrl: mission.partnerLogoUrl,
        startDate: mission.startDate,
        endDate: mission.endDate,
      },
      userProgress: userProgress
        ? {
            status: userProgress.status,
            progress: userProgress.progress,
            currentStep: userProgress.currentStep,
            totalSteps: userProgress.totalSteps,
            completionCount: userProgress.completionCount,
            startedAt: userProgress.startedAt,
            completedAt: userProgress.completedAt,
          }
        : null,
      isAvailable: mission.totalLimit ? mission.currentCompletions < mission.totalLimit : true,
      canComplete: mission.maxCompletions
        ? (userProgress?.completionCount || 0) < mission.maxCompletions
        : true,
    });
  } catch (error) {
    console.error('Get mobile mission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
