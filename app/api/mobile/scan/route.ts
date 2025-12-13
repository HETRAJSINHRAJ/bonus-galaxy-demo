import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { qrCode } = body;

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code is required' }, { status: 400 });
    }

    // Check if receipt was already scanned
    const existingReceipt = await prisma.receipt.findFirst({
      where: {
        userId,
        qrCodeData: qrCode,
      },
    });

    if (existingReceipt) {
      return NextResponse.json(
        { error: 'This receipt has already been scanned' },
        { status: 400 }
      );
    }

    // Mock receipt processing - in production, parse QR code for real data
    // For now, generate random data as the web app does
    const mockAmount = Math.floor(Math.random() * 50) + 10;
    const mockPoints = mockAmount * 100; // 100 points per euro
    const mockStore = ['ATU12345678', 'ATU87654321', 'ATU11223344', 'ATU44332211'][Math.floor(Math.random() * 4)];

    // Create receipt record
    const receipt = await prisma.receipt.create({
      data: {
        userId,
        qrCodeData: qrCode,
        amount: mockAmount,
        pointsEarned: mockPoints,
        taxId: mockStore,
        receiptDate: new Date(),
      },
    });

    // Create points transaction
    await prisma.pointsTransaction.create({
      data: {
        userId,
        amount: mockPoints,
        type: 'earn',
        description: `Receipt scanned - ${mockStore}`,
        receiptId: receipt.id,
      },
    });

    return NextResponse.json({
      success: true,
      points: mockPoints,
      amount: mockAmount,
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}