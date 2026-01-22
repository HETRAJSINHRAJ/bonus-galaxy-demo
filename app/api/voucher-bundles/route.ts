import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/voucher-bundles - Get all active voucher bundles
export async function GET(request: NextRequest) {
  try {
    const bundles = await prisma.voucherBundle.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { isPopular: 'desc' },
        { displayOrder: 'asc' },
      ],
    });

    return NextResponse.json({ bundles });
  } catch (error) {
    console.error('Error fetching voucher bundles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voucher bundles' },
      { status: 500 }
    );
  }
}

// POST /api/voucher-bundles - Create a new voucher bundle (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      value,
      pointsCost,
      voucherCount,
      paymentMethod,
      features,
      isPopular,
      displayOrder,
    } = body;

    // Validation
    if (!name || !description || !price || !value || !pointsCost) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bundle = await prisma.voucherBundle.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        value: parseFloat(value),
        pointsCost: parseInt(pointsCost),
        voucherCount: voucherCount || 10,
        paymentMethod: paymentMethod || 'cash',
        features: features || [],
        isPopular: isPopular || false,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json({ bundle }, { status: 201 });
  } catch (error) {
    console.error('Error creating voucher bundle:', error);
    return NextResponse.json(
      { error: 'Failed to create voucher bundle' },
      { status: 500 }
    );
  }
}
