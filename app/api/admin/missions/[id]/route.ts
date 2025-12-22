import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, Role, requireUserId, canEditMission } from '@/lib/auth';
import { UpdateMissionSchema } from '@/lib/mission-validation';

/**
 * GET /api/admin/missions/[id]
 * Get a single mission by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireRole(Role.VIEWER);
    if (authCheck instanceof NextResponse) return authCheck;

    const { id } = await params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        userProgress: {
          take: 10,
          orderBy: { updatedAt: 'desc' },
        },
        analytics: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        _count: {
          select: {
            userProgress: true,
          },
        },
      },
    });

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    return NextResponse.json(mission);
  } catch (error) {
    console.error('Get mission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/missions/[id]
 * Update a mission
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireRole(Role.EDITOR);
    if (authCheck instanceof NextResponse) return authCheck;

    const { id } = await params;
    const userId = await requireUserId();
    const body = await request.json();

    // Check if mission exists
    const existingMission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!existingMission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Check if user can edit this mission
    const canEdit = await canEditMission(existingMission.createdBy);
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden - Cannot edit this mission' }, { status: 403 });
    }

    // Validate request body
    const validatedData = UpdateMissionSchema.parse(body);

    // Prepare update data
    const updateData: any = {
      ...validatedData,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      lastEditedBy: userId,
    };

    // Update mission
    const mission = await prisma.mission.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(mission);
  } catch (error) {
    console.error('Update mission error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/missions/[id]
 * Delete a mission
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireRole(Role.ADMIN);
    if (authCheck instanceof NextResponse) return authCheck;

    const { id } = await params;

    // Check if mission exists
    const existingMission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!existingMission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Delete mission (will cascade to user progress and analytics)
    await prisma.mission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete mission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
