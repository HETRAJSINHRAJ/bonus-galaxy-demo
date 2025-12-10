import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body = await request.json();
    const { qrCodeData, receiptDate, amount, taxId } = body;

    if (!qrCodeData || !receiptDate || amount === undefined) {
      return NextResponse.json(
        { error: 'Ungültiger QR-Code. Bitte scannen Sie einen gültigen Kassenbeleg.' },
        { status: 400 }
      );
    }

    // Prüfen ob diese Rechnung bereits gescannt wurde
    const existingReceipt = await prisma.receipt.findFirst({
      where: {
        userId,
        qrCodeData,
      },
    });

    if (existingReceipt) {
      return NextResponse.json(
        { error: 'Dieser Beleg wurde bereits erfasst. Jeder Beleg kann nur einmal eingescannt werden.' },
        { status: 400 }
      );
    }

    // Punkte berechnen: €1 = 100 Punkte
    const pointsEarned = Math.floor(amount * 100);

    // Rechnung speichern
    const receipt = await prisma.receipt.create({
      data: {
        userId,
        qrCodeData,
        receiptDate: new Date(receiptDate),
        amount,
        taxId: taxId || null,
        pointsEarned,
      },
    });

    // Punkte-Transaktion erstellen
    await prisma.pointsTransaction.create({
      data: {
        userId,
        amount: pointsEarned,
        type: 'earn',
        description: `Rechnung gescannt: €${amount.toFixed(2)}`,
        receiptId: receipt.id,
      },
    });

    return NextResponse.json({
      success: true,
      points: pointsEarned,
      amount,
      receiptId: receipt.id,
    });
  } catch (error) {
    console.error('Error processing receipt:', error);
    return NextResponse.json(
      { error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}
