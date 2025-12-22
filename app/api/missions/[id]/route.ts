import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/missions/[id]
 * Get a specific mission with user progress
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
        validationRules: true,
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
        isActive: true,
      },
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
      mission,
      userProgress,
      isAvailable: mission.totalLimit ? mission.currentCompletions < mission.totalLimit : true,
    });
  } catch (error) {
    console.error('Get mission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
