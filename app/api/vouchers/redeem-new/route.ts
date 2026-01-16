import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPin, isEmployeeLocked, calculateLockoutExpiry, getRemainingLockoutTime, PIN_CONFIG } from '@/lib/pin-utils';

/**
 * POST /api/vouchers/redeem-new
 * Redeem a voucher with employee PIN verification (new shop system)
 */
export async function POST(req: NextRequest) {
  try {
    const { voucherId, employeeId, employeePin, method = 'pin', redemptionNotes } = await req.json();
    
    // Validate required fields
    if (!voucherId || !employeeId || !employeePin) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: voucherId, employeeId, employeePin' },
        { status: 400 }
      );
    }

    // Get employee with shop details
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        shop: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    if (!employee.isActive) {
      return NextResponse.json(
        { success: false, error: 'Employee account is inactive' },
        { status: 403 }
      );
    }

    if (!employee.canRedeemVoucher) {
      return NextResponse.json(
        { success: false, error: 'Employee does not have redemption permission' },
        { status: 403 }
      );
    }

    // Check for recent failed PIN attempts
    const recentAttempts = await prisma.employeePinAttempt.findMany({
      where: {
        employeeId,
        attemptedAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
        },
      },
      orderBy: {
        attemptedAt: 'desc',
      },
      take: PIN_CONFIG.MAX_ATTEMPTS,
    });

    // Check if locked
    const latestAttempt = recentAttempts[0];
    if (latestAttempt?.isLocked && latestAttempt.lockUntil && isEmployeeLocked(latestAttempt.lockUntil)) {
      const remainingMinutes = getRemainingLockoutTime(latestAttempt.lockUntil);
      return NextResponse.json(
        {
          success: false,
          error: `Account locked due to multiple failed attempts. Try again in ${remainingMinutes} minutes.`,
          locked: true,
          lockUntil: latestAttempt.lockUntil,
        },
        { status: 429 }
      );
    }

    // Verify PIN
    const isPinValid = await verifyPin(employeePin, employee.redemptionPinHash);

    // Log PIN attempt
    const failedAttempts = recentAttempts.filter(a => !a.success).length;
    const shouldLock = !isPinValid && failedAttempts >= PIN_CONFIG.MAX_ATTEMPTS - 1;

    await prisma.employeePinAttempt.create({
      data: {
        employeeId,
        success: isPinValid,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        isLocked: shouldLock,
        lockUntil: shouldLock ? calculateLockoutExpiry() : undefined,
      },
    });

    if (!isPinValid) {
      const attemptsLeft = PIN_CONFIG.MAX_ATTEMPTS - failedAttempts - 1;
      
      if (shouldLock) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid PIN. Account locked for ${PIN_CONFIG.LOCKOUT_DURATION_MINUTES} minutes.`,
            locked: true,
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Invalid PIN. ${attemptsLeft} attempt(s) remaining.`,
          attemptsLeft,
        },
        { status: 401 }
      );
    }

    // Get voucher
    const voucher = await prisma.userVoucher.findUnique({
      where: { id: voucherId },
      include: {
        offer: {
          include: {
            shop: true,
          },
        },
      },
    });

    if (!voucher) {
      return NextResponse.json(
        { success: false, error: 'Voucher not found' },
        { status: 404 }
      );
    }

    // Verify voucher belongs to employee's shop
    if (voucher.offer.shopId !== employee.shopId) {
      return NextResponse.json(
        { success: false, error: 'This voucher cannot be redeemed at your shop' },
        { status: 403 }
      );
    }

    // Check if already redeemed
    if (voucher.status === 'redeemed') {
      return NextResponse.json(
        {
          success: false,
          error: 'Voucher already redeemed',
          redemptionDetails: {
            redeemedAt: voucher.redeemedAt,
            redeemedBy: voucher.redeemedBy?.name,
          }
        },
        { status: 400 }
      );
    }

    // Perform redemption in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update voucher
      const updatedVoucher = await tx.userVoucher.update({
        where: { id: voucherId },
        data: {
          status: 'redeemed',
          redeemedByEmpId: employeeId,
          redeemedAt: new Date(),
          redemptionNotes,
        },
      });

      // Update offer stats
      await tx.voucherOffer.update({
        where: { id: voucher.offerId },
        data: {
          redeemedCount: { increment: 1 },
        },
      });

      // Update shop stats and wallet
      await tx.shop.update({
        where: { id: employee.shopId },
        data: {
          totalVouchersRedeemed: { increment: 1 },
          nequadaBalance: { increment: voucher.pricePaid },
        },
      });

      // Update employee stats
      await tx.employee.update({
        where: { id: employeeId },
        data: {
          totalRedemptions: { increment: 1 },
          lastActiveAt: new Date(),
        },
      });

      // Log redemption
      await tx.redemptionLog.create({
        data: {
          voucherId: voucher.id,
          offerId: voucher.offerId,
          userId: voucher.userId,
          employeeId,
          shopId: employee.shopId,
          method,
          pinAttempts: 1,
          success: true,
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
          userAgent: req.headers.get('user-agent') || undefined,
        },
      });

      return updatedVoucher;
    });

    return NextResponse.json({
      success: true,
      message: 'Voucher redeemed successfully',
      voucher: {
        id: result.id,
        redeemedAt: result.redeemedAt,
        redeemedBy: employee.name,
        shopName: employee.shop.name,
      },
    });

  } catch (error) {
    console.error('Voucher redemption error:', error);
    
    // Log failed redemption attempt
    try {
      const { voucherId, employeeId, method = 'pin' } = await req.json();
      if (voucherId && employeeId) {
        const voucher = await prisma.userVoucher.findUnique({
          where: { id: voucherId },
        });
        
        if (voucher) {
          await prisma.redemptionLog.create({
            data: {
              voucherId,
              offerId: voucher.offerId,
              userId: voucher.userId,
              employeeId,
              shopId: '', // Unknown at this point
              method,
              pinAttempts: 1,
              success: false,
              failureReason: error instanceof Error ? error.message : 'Unknown error',
            },
          });
        }
      }
    } catch (logError) {
      console.error('Failed to log redemption error:', logError);
    }

    return NextResponse.json(
      { success: false, error: 'Redemption failed. Please try again.' },
      { status: 500 }
    );
  }
}
