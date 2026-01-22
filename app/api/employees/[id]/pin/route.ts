import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { hashPin, verifyPin, isValidPin } from '@/lib/pin-utils';

/**
 * PUT /api/employees/:id/pin
 * Update employee redemption PIN
 */
export async function PUT(
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
    const body = await req.json();
    const { currentPin, newPin } = body;

    // Validate required fields
    if (!currentPin || !newPin) {
      return NextResponse.json(
        { error: 'Both currentPin and newPin are required' },
        { status: 400 }
      );
    }

    // Validate new PIN format
    if (!isValidPin(newPin)) {
      return NextResponse.json(
        { error: 'Invalid PIN format. Must be 4-6 digits.' },
        { status: 400 }
      );
    }

    // Get employee
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if user owns this employee record or is admin
    if (employee.userId !== userId) {
      // TODO: Check if user is admin
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Verify current PIN
    const isCurrentPinValid = await verifyPin(currentPin, employee.redemptionPinHash);

    if (!isCurrentPinValid) {
      return NextResponse.json(
        { error: 'Current PIN is incorrect' },
        { status: 401 }
      );
    }

    // Hash new PIN
    const newPinHash = await hashPin(newPin);

    // Update PIN
    await prisma.employee.update({
      where: { id },
      data: {
        redemptionPinHash: newPinHash,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'PIN updated successfully',
    });
  } catch (error) {
    console.error('Error updating PIN:', error);
    return NextResponse.json(
      { error: 'Failed to update PIN' },
      { status: 500 }
    );
  }
}
