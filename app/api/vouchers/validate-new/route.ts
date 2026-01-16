import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decryptQRData, isVoucherExpired } from '@/lib/voucher-utils';

/**
 * POST /api/vouchers/validate-new
 * Validate a voucher for redemption (new shop system)
 */
export async function POST(req: NextRequest) {
  try {
    const { method, code, employeeId } = await req.json();
    
    // Validate required fields
    if (!method || !code || !employeeId) {
      return NextResponse.json(
        { valid: false, error: 'Missing required fields: method, code, employeeId' },
        { status: 400 }
      );
    }
    
    if (method !== 'pin' && method !== 'qr') {
      return NextResponse.json(
        { valid: false, error: 'Invalid method. Must be "pin" or "qr"' },
        { status: 400 }
      );
    }

    // Get employee details
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        shop: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { valid: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    if (!employee.isActive) {
      return NextResponse.json(
        { valid: false, error: 'Employee account is inactive' },
        { status: 403 }
      );
    }

    if (!employee.canRedeemVoucher) {
      return NextResponse.json(
        { valid: false, error: 'Employee does not have redemption permission' },
        { status: 403 }
      );
    }
    
    let voucher;
    
    // Find voucher by PIN or QR code
    if (method === 'pin') {
      voucher = await prisma.userVoucher.findUnique({
        where: { pinCode: code },
        include: {
          offer: {
            include: {
              shop: true,
            },
          },
        },
      });
    } else if (method === 'qr') {
      try {
        const decrypted = decryptQRData(code);
        voucher = await prisma.userVoucher.findFirst({
          where: {
            id: decrypted.voucherId,
            pinCode: decrypted.pinCode,
          },
          include: {
            offer: {
              include: {
                shop: true,
              },
            },
          },
        });
      } catch (error) {
        return NextResponse.json(
          { valid: false, error: 'Invalid or corrupted QR code' },
          { status: 400 }
        );
      }
    }
    
    // Check if voucher exists
    if (!voucher) {
      return NextResponse.json(
        { valid: false, error: 'Voucher not found' },
        { status: 404 }
      );
    }

    // Check if voucher belongs to employee's shop
    if (voucher.offer.shopId !== employee.shopId) {
      return NextResponse.json(
        { valid: false, error: 'This voucher cannot be redeemed at your shop' },
        { status: 403 }
      );
    }
    
    // Check if voucher is purchased
    if (voucher.status !== 'purchased') {
      return NextResponse.json(
        { valid: false, error: `Voucher status is ${voucher.status}` },
        { status: 400 }
      );
    }
    
    // Check if already redeemed
    if (voucher.status === 'redeemed') {
      return NextResponse.json(
        {
          valid: false,
          error: 'Voucher already redeemed',
          redemptionDetails: {
            redeemedAt: voucher.redeemedAt,
            redeemedBy: voucher.redeemedBy?.name,
          }
        },
        { status: 400 }
      );
    }
    
    // Check if expired
    if (voucher.expiresAt && isVoucherExpired(voucher.expiresAt)) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Voucher has expired',
          expiresAt: voucher.expiresAt
        },
        { status: 400 }
      );
    }
    
    // Return valid voucher details
    return NextResponse.json({
      valid: true,
      voucherId: voucher.id,
      voucherDetails: {
        title: voucher.offer.title,
        description: voucher.offer.description,
        shopName: voucher.offer.shop.name,
        value: voucher.pricePaid,
        purchaseDate: voucher.purchasedAt,
        expiresAt: voucher.expiresAt,
      },
      employeeInfo: {
        id: employee.id,
        name: employee.name,
        shopName: employee.shop.name,
      },
    });
    
  } catch (error) {
    console.error('Voucher validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Validation failed. Please try again.' },
      { status: 500 }
    );
  }
}
