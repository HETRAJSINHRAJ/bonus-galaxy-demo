import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/shops/:id/offers
 * List shop's voucher offers
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const offers = await prisma.voucherOffer.findMany({
      where: {
        shopId: id,
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            userVouchers: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shops/:id/offers
 * Create voucher offer (requires canCreateVoucher permission)
 */
export async function POST(
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

    // Check if user is an employee with create permission
    const employee = await prisma.employee.findFirst({
      where: {
        userId,
        shopId: id,
        isActive: true,
        canCreateVoucher: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to create offers.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      termsOfService,
      imageUrl,
      priceInPoints,
      originalPrice,
      discountPercent,
      quota,
      validFrom,
      validUntil,
      category,
      tags = [],
      isFeatured = false,
      displayOrder = 0,
    } = body;

    // Validate required fields
    if (!title || !description || !priceInPoints) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, priceInPoints' },
        { status: 400 }
      );
    }

    if (priceInPoints < 1) {
      return NextResponse.json(
        { error: 'Price must be at least 1 point' },
        { status: 400 }
      );
    }

    // Create offer
    const offer = await prisma.voucherOffer.create({
      data: {
        shopId: id,
        createdByEmpId: employee.id,
        title,
        description,
        termsOfService,
        imageUrl,
        priceInPoints,
        originalPrice,
        discountPercent,
        quota,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        category,
        tags,
        isFeatured,
        displayOrder,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update employee stats
    await prisma.employee.update({
      where: { id: employee.id },
      data: {
        totalOffersCreated: { increment: 1 },
      },
    });

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
