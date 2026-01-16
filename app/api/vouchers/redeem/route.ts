import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isValidPartnerLocation } from '@/lib/voucher-utils';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
    ? 'https://bonus-galaxy-cms.vercel.app'
    : '*', // Allow mission-cms in production, all origins in development
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * OPTIONS /api/vouchers/redeem
 * Handle preflight CORS requests
 */
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * POST /api/vouchers/redeem
 * Redeem a voucher after validation
 */
export async function POST(req: NextRequest) {
  try {
    const { purchaseId, employeeId, partnerLocation, method } = await req.json();
    
    // Validate required fields
    if (!purchaseId || !employeeId || !partnerLocation || !method) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate partner location
    if (!isValidPartnerLocation(partnerLocation)) {
      return NextResponse.json(
        { success: false, error: 'Invalid partner location' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Find the voucher purchase
    const existingPurchase = await prisma.voucherPurchase.findUnique({
      where: { id: purchaseId }
    });
    
    if (!existingPurchase) {
      return NextResponse.json(
        { success: false, error: 'Voucher not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Check if already redeemed
    if (existingPurchase.isRedeemed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Voucher already redeemed',
          redemptionDetails: {
            redeemedAt: existingPurchase.redeemedAt,
            redeemedBy: existingPurchase.redeemedBy,
            redeemedLocation: existingPurchase.redeemedLocation
          }
        },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Update voucher purchase with redemption details
    const purchase = await prisma.voucherPurchase.update({
      where: { id: purchaseId },
      data: {
        isRedeemed: true,
        redeemedAt: new Date(),
        redeemedBy: employeeId,
        redeemedLocation: partnerLocation,
        status: 'redeemed'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Voucher redeemed successfully',
      purchase: {
        id: purchase.id,
        redeemedAt: purchase.redeemedAt,
        redeemedBy: purchase.redeemedBy,
        redeemedLocation: purchase.redeemedLocation
      }
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Voucher redemption error:', error);
    return NextResponse.json(
      { success: false, error: 'Redemption failed. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
