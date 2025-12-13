import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { parseReceiptQRCode } from '@/lib/receipt-utils';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body = await request.json();
    const { qrCode } = body;

    if (!qrCode) {
      return NextResponse.json({ error: 'QR-Code ist erforderlich' }, { status: 400 });
    }

    // Parse QR code using the same logic as web app
    let parsedData;
    try {
      parsedData = parseReceiptQRCode(qrCode);
    } catch (error) {
      // Provide specific error messages based on parsing failure
      if (error instanceof Error) {
        if (error.message.includes('Format')) {
          return NextResponse.json(
            { error: 'QR-Code Format nicht erkannt. Bitte scannen Sie einen gültigen Kassenbeleg.' },
            { status: 400 }
          );
        } else if (error.message.includes('Datum')) {
          return NextResponse.json(
            { error: 'Datum im QR-Code ungültig. Bitte überprüfen Sie den Beleg.' },
            { status: 400 }
          );
        } else if (error.message.includes('Betrag')) {
          return NextResponse.json(
            { error: 'Betrag konnte nicht gelesen werden. Bitte scannen Sie erneut.' },
            { status: 400 }
          );
        }
      }
      return NextResponse.json(
        { error: 'QR-Code konnte nicht gelesen werden. Stellen Sie sicher, dass es ein Kassenbeleg ist.' },
        { status: 400 }
      );
    }

    // Check if receipt was already scanned
    const existingReceipt = await prisma.receipt.findFirst({
      where: {
        userId,
        qrCodeData: parsedData.qrCodeData,
      },
    });

    if (existingReceipt) {
      return NextResponse.json(
        { error: 'Dieser Beleg wurde bereits erfasst. Jeder Beleg kann nur einmal eingescannt werden.' },
        { status: 400 }
      );
    }

    // Note: Date validation removed - receipts can be scanned regardless of age

    // Check minimum amount (€5.00)
    if (parsedData.amount < 5.00) {
      return NextResponse.json(
        { error: 'Der Betrag ist zu niedrig. Mindestbetrag: €5.00' },
        { status: 400 }
      );
    }

    // Calculate points: €1 = 100 points
    const pointsEarned = Math.floor(parsedData.amount * 100);

    // Create receipt record
    const receipt = await prisma.receipt.create({
      data: {
        userId,
        qrCodeData: parsedData.qrCodeData,
        receiptDate: parsedData.receiptDate,
        amount: parsedData.amount,
        pointsEarned,
        taxId: parsedData.taxId,
      },
    });

    // Create points transaction
    await prisma.pointsTransaction.create({
      data: {
        userId,
        amount: pointsEarned,
        type: 'earn',
        description: `Rechnung gescannt: €${parsedData.amount.toFixed(2)}`,
        receiptId: receipt.id,
      },
    });

    return NextResponse.json({
      success: true,
      points: pointsEarned,
      amount: parsedData.amount,
      receiptId: receipt.id,
      receipt: {
        id: receipt.id,
        userId: receipt.userId,
        amount: receipt.amount,
        points: receipt.pointsEarned,
        store: receipt.taxId || 'Unknown Store',
        qrCode: receipt.qrCodeData,
        scannedAt: receipt.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Scan receipt error:', error);
    return NextResponse.json(
      { error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}