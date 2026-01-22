import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/voucher-bundles/[id] - Get a specific bundle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bundle = await prisma.voucherBundle.findUnique({
      where: { id },
    });

    if (!bundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error('Error fetching bundle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bundle' },
      { status: 500 }
    );
  }
}

// PATCH /api/voucher-bundles/[id] - Update a bundle (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const bundle = await prisma.voucherBundle.update({
      where: { id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        value: body.value ? parseFloat(body.value) : undefined,
        pointsCost: body.pointsCost ? parseInt(body.pointsCost) : undefined,
        voucherCount: body.voucherCount ? parseInt(body.voucherCount) : undefined,
      },
    });

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error('Error updating bundle:', error);
    return NextResponse.json(
      { error: 'Failed to update bundle' },
      { status: 500 }
    );
  }
}

// PUT /api/voucher-bundles/[id] - Update a bundle (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('PUT request for bundle:', id);
    console.log('Request body:', body);
    
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

    // Validate required fields
    if (!name || !description || price === undefined || value === undefined || pointsCost === undefined) {
      console.error('Missing required fields:', { name, description, price, value, pointsCost });
      return NextResponse.json(
        { error: 'Missing required fields', details: 'name, description, price, value, and pointsCost are required' },
        { status: 400 }
      );
    }

    const bundle = await prisma.voucherBundle.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        value: parseFloat(value),
        pointsCost: parseInt(pointsCost),
        voucherCount: voucherCount ? parseInt(voucherCount) : 10,
        paymentMethod: paymentMethod || 'cash',
        features: features || [],
        isPopular: isPopular !== undefined ? isPopular : false,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
      },
    });

    console.log('Bundle updated successfully:', bundle.id);
    return NextResponse.json({ bundle });
  } catch (error) {
    console.error('Error updating bundle:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to update bundle', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/voucher-bundles/[id] - Delete a bundle (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bundle = await prisma.voucherBundle.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error('Error deleting bundle:', error);
    return NextResponse.json(
      { error: 'Failed to delete bundle' },
      { status: 500 }
    );
  }
}
