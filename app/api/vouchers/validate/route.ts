import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decryptQRData, isVoucherExpired, getBundleInfo } from '@/lib/voucher-utils';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins (or specify: 'http://localhost:3001')
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * OPTIONS /api/vouchers/validate
 * Handle preflight CORS requests
 */
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * POST /api/vouchers/validate
 * Validate a voucher using PIN or QR code
 */
export async function POST(req: NextRequest) {
  try {
    const { method, code, employeeId, partnerLocation } = await req.json();
    
    // Validate required fields
    if (!method || !code) {
      return NextResponse.json(
        { valid: false, error: 'Missing required fields: method and code' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (method !== 'pin' && method !== 'qr') {
      return NextResponse.json(
        { valid: false, error: 'Invalid method. Must be "pin" or "qr"' },
        { status: 400, headers: corsHeaders }
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
            { status: 400, headers: corsHeaders }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { valid: false, error: 'Invalid or corrupted QR code' },
          { status: 400, headers: corsHeaders }
        );
      }
    }
    
    // Check if voucher exists
    if (!purchase) {
      return NextResponse.json(
        { valid: false, error: 'Voucher not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Check if voucher is completed
    if (purchase.status !== 'completed') {
      return NextResponse.json(
        { valid: false, error: `Voucher status is ${purchase.status}` },
        { status: 400, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
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
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Voucher validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Validation failed. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
