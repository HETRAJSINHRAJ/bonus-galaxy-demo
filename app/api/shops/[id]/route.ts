import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/shops/:id
 * Get shop details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        employees: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            email: true,
            isManager: true,
            totalRedemptions: true,
            totalOffersCreated: true,
          },
        },
        voucherOffers: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            priceInPoints: true,
            soldCount: true,
            redeemedCount: true,
          },
        },
      },
    });

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shop' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/shops/:id
 * Update shop (admin or shop manager only)
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

    // TODO: Check if user is admin or shop manager
    // const employee = await prisma.employee.findFirst({
    //   where: { userId, shopId: id, isManager: true }
    // });
    // if (!employee && !isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body = await req.json();
    const {
      name,
      description,
      address,
      latitude,
      longitude,
      logo,
      email,
      phone,
      website,
      isActive,
    } = body;

    const shop = await prisma.shop.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(address !== undefined && { address }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(logo !== undefined && { logo }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(website !== undefined && { website }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shops/:id
 * Soft delete shop (admin only)
 */
export async function DELETE(
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

    // TODO: Add admin role check

    const shop = await prisma.shop.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { error: 'Failed to delete shop' },
      { status: 500 }
    );
  }
}
