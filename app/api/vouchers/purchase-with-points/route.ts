import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateUniquePIN, generateQRData, calculateExpirationDate } from '@/lib/voucher-utils';

export async function POST(req: Request) {
  console.log('🛒 Purchase with points request received');
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error('❌ Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bundleId, pointsCost, voucherCount } = await req.json();
    console.log('📦 Purchase details:', { userId, bundleId, pointsCost, voucherCount });

    // Get user's current points
    const pointsTransactions = await prisma.pointsTransaction.findMany({
      where: { userId },
    });
    
    const currentPoints = pointsTransactions.reduce((sum, t) => {
      return sum + t.amount; // Simply add all amounts (negative amounts will subtract)
    }, 0);

    console.log('💰 User points:', currentPoints, 'Required:', pointsCost);

    // Check if user has enough points
    if (currentPoints < pointsCost) {
      console.error('❌ Insufficient points');
      return NextResponse.json(
        { error: `Sie benötigen ${pointsCost.toLocaleString()} Punkte. Aktuell verfügbar: ${currentPoints.toLocaleString()} Punkte.` },
        { status: 400 }
      );
    }

    // Deduct points (store as negative amount)
    console.log('💸 Deducting points...');
    await prisma.pointsTransaction.create({
      data: {
        userId,
        amount: -pointsCost,
        type: 'spend',
        description: `Gekauft: ${voucherCount} Gutscheine (${bundleId})`,
      },
    });
    console.log('✅ Points deducted');

    // Generate PIN and QR code for the voucher
    console.log('🔐 Generating PIN and QR code...');
    const pinCode = await generateUniquePIN(prisma);
    const purchaseId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCodeData = generateQRData(purchaseId, userId, pinCode);
    const expiresAt = calculateExpirationDate();

    console.log('✅ Generated PIN:', pinCode);
    console.log('📅 Expiration date:', expiresAt.toISOString());

    // Create voucher purchase record with redemption codes
    console.log('💾 Creating voucher purchase...');
    const purchase = await prisma.voucherPurchase.create({
      data: {
        userId,
        voucherId: bundleId,
        status: 'completed',
        amount: 0, // Paid with points
        pinCode,
        qrCodeData: qrCodeData.replace(purchaseId, ''), // Placeholder, will update
        expiresAt,
      },
    });

    console.log('✅ Voucher purchase created with ID:', purchase.id);

    // Update QR code with actual purchase ID
    console.log('🔄 Updating QR code...');
    const finalQRData = generateQRData(purchase.id, userId, pinCode);
    await prisma.voucherPurchase.update({
      where: { id: purchase.id },
      data: { qrCodeData: finalQRData }
    });
    console.log('✅ QR code updated');

    console.log('✅ Purchase completed successfully');
    return NextResponse.json({ 
      success: true,
      message: '🎉 Erfolgreich! Ihre Gutscheine wurden freigeschaltet.',
      remainingPoints: currentPoints - pointsCost
    });
  } catch (error) {
    console.error('❌ Error purchasing with points:', error);
    return NextResponse.json(
      { error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
