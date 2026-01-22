import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/shops
 * List all active shops (public)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    console.log('Fetching shops, includeInactive:', includeInactive);

    const shops = await prisma.shop.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: {
            employees: true,
            voucherOffers: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log('Shops fetched successfully:', shops.length);
    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Error fetching shops:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch shops', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shops
 * Create a new shop (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Add admin role check
    // const user = await clerkClient.users.getUser(userId);
    // if (user.publicMetadata.role !== 'super_admin') {
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
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Shop name is required' },
        { status: 400 }
      );
    }

    const shop = await prisma.shop.create({
      data: {
        name,
        description,
        address,
        latitude,
        longitude,
        logo,
        email,
        phone,
        website,
      },
    });

    return NextResponse.json({ shop }, { status: 201 });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { error: 'Failed to create shop' },
      { status: 500 }
    );
  }
}
