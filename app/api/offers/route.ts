import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/offers
 * List all active offers (marketplace)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const shopId = searchParams.get('shopId');
    const featured = searchParams.get('featured') === 'true';

    const now = new Date();

    const offers = await prisma.voucherOffer.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
        ...(shopId && { shopId }),
        ...(featured && { isFeatured: true }),
        // Check validity dates
        validFrom: { lte: now },
        OR: [
          { validUntil: null },
          { validUntil: { gte: now } },
        ],
        // Check quota
        OR: [
          { quota: null },
          { soldCount: { lt: prisma.voucherOffer.fields.quota } },
        ],
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            logo: true,
            address: true,
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
      take: 50, // Limit results
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
