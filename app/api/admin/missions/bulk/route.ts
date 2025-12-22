import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, Role } from '@/lib/auth';
import { BulkMissionActionSchema } from '@/lib/mission-validation';

/**
 * POST /api/admin/missions/bulk
 * Perform bulk actions on missions
 */
export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireRole(Role.ADMIN);
    if (authCheck instanceof NextResponse) return authCheck;

    const body = await request.json();
    const validatedData = BulkMissionActionSchema.parse(body);

    const { missionIds, action, updates } = validatedData;

    let result;

    switch (action) {
      case 'activate':
        result = await prisma.mission.updateMany({
          where: { id: { in: missionIds } },
          data: { isActive: true },
        });
        break;

      case 'deactivate':
        result = await prisma.mission.updateMany({
          where: { id: { in: missionIds } },
          data: { isActive: false },
        });
        break;

      case 'delete':
        result = await prisma.mission.deleteMany({
          where: { id: { in: missionIds } },
        });
        break;

      case 'feature':
        result = await prisma.mission.updateMany({
          where: { id: { in: missionIds } },
          data: { isFeatured: true },
        });
        break;

      case 'unfeature':
        result = await prisma.mission.updateMany({
          where: { id: { in: missionIds } },
          data: { isFeatured: false },
        });
        break;

      case 'duplicate':
        // Duplicate missions
        const missionsToClone = await prisma.mission.findMany({
          where: { id: { in: missionIds } },
        });

        const clonedMissions = await Promise.all(
          missionsToClone.map(async (mission) => {
            const { id, createdAt, updatedAt, ...missionData } = mission;
            return prisma.mission.create({
              data: {
                ...missionData as any,
                title: `${mission.title} (Copy)`,
                isActive: false,
              },
            });
          })
        );

        result = { count: clonedMissions.length };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      affected: result.count,
      action,
    });
  } catch (error) {
    console.error('Bulk mission action error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
