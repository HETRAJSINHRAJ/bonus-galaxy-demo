import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/missions/[id]/complete
 * Complete a mission and award rewards
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
    const body = await request.json();
    const { validationData } = body;

    // Get mission
    const mission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    if (!mission.isActive) {
      return NextResponse.json({ error: 'Mission is not active' }, { status: 403 });
    }

    // Get user progress
    const progress = await prisma.userMissionProgress.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId: id,
        },
      },
    });

    if (!progress) {
      return NextResponse.json({ error: 'Mission not started' }, { status: 400 });
    }

    if (progress.status === 'completed' && mission.maxCompletions) {
      if (progress.completionCount >= mission.maxCompletions) {
        return NextResponse.json({ error: 'Mission already completed maximum times' }, { status: 403 });
      }
    }

    // Validate mission requirements (simplified - should be more robust)
    // This is where you'd implement custom validation logic based on mission.requirements
    const isValid = await validateMissionCompletion(mission, validationData, userId);

    if (!isValid) {
      return NextResponse.json({ error: 'Mission requirements not met' }, { status: 400 });
    }

    // Use transaction to ensure atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Update user progress
      const updatedProgress = await tx.userMissionProgress.update({
        where: { id: progress.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          completionCount: { increment: 1 },
          currentStep: progress.totalSteps,
        },
      });

      // Award points
      const pointsTransaction = await tx.pointsTransaction.create({
        data: {
          userId,
          amount: mission.pointsReward + mission.bonusReward,
          type: 'earn',
          description: `Completed mission: ${mission.title}`,
        },
      });

      // Update mission completion count
      await tx.mission.update({
        where: { id },
        data: {
          currentCompletions: { increment: 1 },
        },
      });

      // Update analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const completionTime = progress.startedAt
        ? (new Date().getTime() - progress.startedAt.getTime()) / (1000 * 60)
        : null;

      await tx.missionAnalytics.upsert({
        where: {
          missionId_date: {
            missionId: id,
            date: today,
          },
        },
        create: {
          missionId: id,
          date: today,
          completions: 1,
          totalPointsAwarded: mission.pointsReward,
          totalBonusAwarded: mission.bonusReward,
          avgCompletionTime: completionTime,
        },
        update: {
          completions: { increment: 1 },
          totalPointsAwarded: { increment: mission.pointsReward },
          totalBonusAwarded: { increment: mission.bonusReward },
        },
      });

      return { updatedProgress, pointsTransaction };
    });

    return NextResponse.json({
      success: true,
      progress: result.updatedProgress,
      pointsEarned: mission.pointsReward + mission.bonusReward,
    });
  } catch (error) {
    console.error('Complete mission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Validate mission completion based on requirements
 * This is a simplified version - should be expanded based on requirement types
 */
async function validateMissionCompletion(
  mission: any,
  validationData: any,
  userId: string
): Promise<boolean> {
  const requirements = mission.requirements as any;

  switch (requirements.type) {
    case 'receipt_scan':
      // Check if user has scanned required number of receipts
      if (validationData?.receiptId) {
        const receipt = await prisma.receipt.findFirst({
          where: {
            id: validationData.receiptId,
            userId,
          },
        });
        return !!receipt;
      }
      return false;

    case 'point_threshold':
      // Check if user has reached point threshold
      const transactions = await prisma.pointsTransaction.findMany({
        where: { userId },
      });
      const totalPoints = transactions.reduce((sum, t) => {
        return t.type === 'earn' ? sum + t.amount : sum - t.amount;
      }, 0);
      return totalPoints >= (requirements.targetValue || 0);

    case 'voucher_purchase':
      // Check if user has purchased a voucher
      if (validationData?.purchaseId) {
        const purchase = await prisma.voucherPurchase.findFirst({
          where: {
            id: validationData.purchaseId,
            userId,
            status: 'completed',
          },
        });
        return !!purchase;
      }
      return false;

    case 'daily_login':
      // For daily login, just returning true as login is already verified by auth
      return true;

    case 'custom':
      // Custom validation logic would go here
      return validationData?.completed === true;

    default:
      return false;
  }
}
