import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { hashPin, isValidPin } from '@/lib/pin-utils';

/**
 * GET /api/shops/:id/employees
 * List shop employees
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const employees = await prisma.employee.findMany({
      where: {
        shopId: params.id,
        isActive: true,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        phone: true,
        canCreateVoucher: true,
        canRedeemVoucher: true,
        canViewAnalytics: true,
        isManager: true,
        totalRedemptions: true,
        totalOffersCreated: true,
        lastActiveAt: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shops/:id/employees
 * Add employee to shop
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: authUserId } = await auth();

    if (!authUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Check if user is admin or shop manager
    // const manager = await prisma.employee.findFirst({
    //   where: { userId: authUserId, shopId: params.id, isManager: true }
    // });
    // if (!manager && !isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body = await req.json();
    const {
      userId,
      name,
      email,
      phone,
      redemptionPin,
      canCreateVoucher = false,
      canRedeemVoucher = true,
      canViewAnalytics = false,
      isManager = false,
    } = body;

    // Validate required fields
    if (!userId || !name || !email || !redemptionPin) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, email, redemptionPin' },
        { status: 400 }
      );
    }

    // Validate PIN format
    if (!isValidPin(redemptionPin)) {
      return NextResponse.json(
        { error: 'Invalid PIN format. Must be 4-6 digits.' },
        { status: 400 }
      );
    }

    // Check if employee already exists
    const existing = await prisma.employee.findUnique({
      where: {
        shopId_userId: {
          shopId: params.id,
          userId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Employee already exists in this shop' },
        { status: 409 }
      );
    }

    // Hash the PIN
    const redemptionPinHash = await hashPin(redemptionPin);

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        shopId: params.id,
        userId,
        name,
        email,
        phone,
        redemptionPinHash,
        canCreateVoucher,
        canRedeemVoucher,
        canViewAnalytics,
        isManager,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        phone: true,
        canCreateVoucher: true,
        canRedeemVoucher: true,
        canViewAnalytics: true,
        isManager: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
