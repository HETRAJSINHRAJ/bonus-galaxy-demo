import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/missions/[id]/start
 * Start a mission for the current user
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if mission exists and is active
    const mission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    if (!mission.isActive) {
      return NextResponse.json({ error: 'Mission is not active' }, { status: 403 });
    }

    // Check if mission has reached total limit
    if (mission.totalLimit && mission.currentCompletions >= mission.totalLimit) {
      return NextResponse.json({ error: 'Mission limit reached' }, { status: 403 });
    }

    // Check if user already has progress for this mission
    const existingProgress = await prisma.userMissionProgress.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId: id,
        },
      },
    });

    if (existingProgress) {
      // Check if user has already completed max times
      if (mission.maxCompletions && existingProgress.completionCount >= mission.maxCompletions) {
        return NextResponse.json({ error: 'Mission already completed maximum times' }, { status: 403 });
      }

      // Update existing progress to in_progress if not already
      if (existingProgress.status === 'not_started' || existingProgress.status === 'completed') {
        const updated = await prisma.userMissionProgress.update({
          where: { id: existingProgress.id },
          data: {
            status: 'in_progress',
            lastActivityAt: new Date(),
          },
        });

        return NextResponse.json({ progress: updated });
      }

      return NextResponse.json({ progress: existingProgress });
    }

    // Create new progress
    const progress = await prisma.userMissionProgress.create({
      data: {
        userId,
        missionId: id,
        status: 'in_progress',
        progress: {},
        currentStep: 0,
        totalSteps: 1,
        startedAt: new Date(),
        lastActivityAt: new Date(),
      },
    });

    // Update analytics
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
        starts: 1,
        uniqueUsers: 1,
      },
      update: {
        starts: { increment: 1 },
      },
    });

    return NextResponse.json({ progress }, { status: 201 });
  } catch (error) {
    console.error('Start mission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
