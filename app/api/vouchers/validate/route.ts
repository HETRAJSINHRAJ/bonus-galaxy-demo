import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decryptQRData, isVoucherExpired, getBundleInfo } from '@/lib/voucher-utils';

/**
 * POST /api/vouchers/validate
 * Validate a voucher using PIN or QR code
 * CORS is handled by middleware (proxy.ts)
 */
export async function POST(req: NextRequest) {
  try {
    const { method, code, employeeId, partnerLocation } = await req.json();
    
    // Validate required fields
    if (!method || !code) {
      return NextResponse.json(
        { valid: false, error: 'Missing required fields: method and code' },
        { status: 400 }
      );
    }
    
    if (method !== 'pin' && method !== 'qr') {
      return NextResponse.json(
        { valid: false, error: 'Invalid method. Must be "pin" or "qr"' },
        { status: 400 }
      );
    }
    
    let purchase;
    
    // Find voucher by PIN or QR code
    if (method === 'pin') {
      purchase = await prisma.voucherPurchase.findUnique({
        where: { pinCode: code }
      });
    } else if (method === 'qr') {
      try {
        const decrypted = decryptQRData(code);
        purchase = await prisma.voucherPurchase.findUnique({
          where: { id: decrypted.purchaseId }
        });
        
        // Additional validation: check if PIN matches
        if (purchase && purchase.pinCode !== decrypted.pinCode) {
          return NextResponse.json(
            { valid: false, error: 'QR code validation failed' },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { valid: false, error: 'Invalid or corrupted QR code' },
          { status: 400 }
        );
      }
    }
    
    // Check if voucher exists
    if (!purchase) {
      return NextResponse.json(
        { valid: false, error: 'Voucher not found' },
        { status: 404 }
      );
    }
    
    // Check if voucher is completed
    if (purchase.status !== 'completed') {
      return NextResponse.json(
        { valid: false, error: `Voucher status is ${purchase.status}` },
        { status: 400 }
      );
    }
    
    // Check if already redeemed
    if (purchase.isRedeemed) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Voucher already redeemed',
          redemptionDetails: {
            redeemedAt: purchase.redeemedAt,
            redeemedBy: purchase.redeemedBy,
            redeemedLocation: purchase.redeemedLocation
          }
        },
        { status: 400 }
      );
    }
    
    // Check if expired
    if (purchase.expiresAt && isVoucherExpired(purchase.expiresAt)) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Voucher has expired',
          expiresAt: purchase.expiresAt
        },
        { status: 400 }
      );
    }
    
    // Get bundle information
    const bundleInfo = getBundleInfo(purchase.voucherId);
    
    // Return valid voucher details
    return NextResponse.json({
      valid: true,
      purchaseId: purchase.id,
      voucherDetails: {
        bundleName: bundleInfo.name,
        description: bundleInfo.description,
        value: bundleInfo.value,
        voucherCount: bundleInfo.voucherCount,
        purchaseDate: purchase.createdAt,
        expiresAt: purchase.expiresAt
      }
    });
    
  } catch (error) {
    console.error('Voucher validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Validation failed. Please try again.' },
      { status: 500 }
    );
  }
}
