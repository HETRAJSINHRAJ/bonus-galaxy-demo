import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { generateRandomPin } from '@/lib/pin-utils';
import { generateQRData } from '@/lib/voucher-utils';

/**
 * POST /api/offers/:id/purchase
 * User purchases a voucher offer
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
    const body = await req.json();
    const { quantity = 1 } = body;

    // Validate quantity
    if (quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Get offer details
    const offer = await prisma.voucherOffer.findUnique({
      where: { id },
      include: {
        shop: true,
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Check if offer is active
    if (!offer.isActive) {
      return NextResponse.json(
        { error: 'This offer is no longer active' },
        { status: 400 }
      );
    }

    // Check validity dates
    const now = new Date();
    if (offer.validFrom > now) {
      return NextResponse.json(
        { error: 'This offer is not yet available' },
        { status: 400 }
      );
    }
    if (offer.validUntil && offer.validUntil < now) {
      return NextResponse.json(
        { error: 'This offer has expired' },
        { status: 400 }
      );
    }

    // Check quota
    if (offer.quota && offer.soldCount + quantity > offer.quota) {
      return NextResponse.json(
        { error: 'Not enough vouchers available' },
        { status: 400 }
      );
    }

    // Calculate total cost
    const totalCost = offer.priceInPoints * quantity;

    // TODO: Check user's point balance
    // const userPoints = await getUserPoints(userId);
    // if (userPoints < totalCost) {
    //   return NextResponse.json(
    //     { error: 'Insufficient points' },
    //     { status: 400 }
    //   );
    // }

    // Create vouchers in a transaction
    const vouchers = await prisma.$transaction(async (tx) => {
      const createdVouchers = [];

      for (let i = 0; i < quantity; i++) {
        // Generate unique PIN
        let pinCode = generateRandomPin();
        let pinExists = await tx.userVoucher.findUnique({
          where: { pinCode },
        });

        // Ensure PIN is unique
        while (pinExists) {
          pinCode = generateRandomPin();
          pinExists = await tx.userVoucher.findUnique({
            where: { pinCode },
          });
        }

        // Generate QR code data
        const qrCodeData = generateQRData(
          `temp_${Date.now()}_${i}`, // Will be updated after creation
          userId,
          pinCode
        );

        // Calculate expiry (1 year from now)
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        // Create voucher
        const voucher = await tx.userVoucher.create({
          data: {
            userId,
            offerId: offer.id,
            status: 'purchased',
            pricePaid: offer.priceInPoints,
            pinCode,
            qrCodeData,
            expiresAt,
          },
        });

        createdVouchers.push(voucher);
      }

      // Update offer sold count
      await tx.voucherOffer.update({
        where: { id: offer.id },
        data: {
          soldCount: { increment: quantity },
        },
      });

      // Update shop stats
      await tx.shop.update({
        where: { id: offer.shopId },
        data: {
          totalVouchersSold: { increment: quantity },
        },
      });

      // TODO: Deduct points from user
      // await tx.pointsTransaction.create({
      //   data: {
      //     userId,
      //     amount: -totalCost,
      //     type: 'spend',
      //     description: `Purchased ${quantity}x ${offer.title}`,
      //   },
      // });

      return createdVouchers;
    });

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${quantity} voucher(s)`,
      vouchers: vouchers.map(v => ({
        id: v.id,
        pinCode: v.pinCode,
        qrCodeData: v.qrCodeData,
        expiresAt: v.expiresAt,
      })),
      totalCost,
    }, { status: 201 });

  } catch (error) {
    console.error('Error purchasing voucher:', error);
    return NextResponse.json(
      { error: 'Failed to purchase voucher' },
      { status: 500 }
    );
  }
}
