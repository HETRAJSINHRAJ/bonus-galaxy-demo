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

    // Mock receipt processing - in production, you'd parse the QR code
    // and extract receipt information from your receipt processing service
    const mockAmount = Math.floor(Math.random() * 50) + 10;
    const mockPoints = mockAmount * 100; // 100 points per euro
    const mockStore = ['ATU12345678', 'ATU87654321', 'ATU11223344', 'ATU44332211'][Math.floor(Math.random() * 4)];

    try {
      // Create receipt record
      const receipt = await prisma.receipt.create({
        data: {
          userId,
          amount: mockAmount,
          pointsEarned: mockPoints,
          taxId: mockStore,
          qrCodeData: qrCode,
          receiptDate: new Date(),
        },
      });

      // Create transaction for points earned
      await prisma.pointsTransaction.create({
        data: {
          userId,
          type: 'earn',
          amount: mockPoints,
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
          userId,
          amount: mockAmount,
          points: mockPoints,
          store: mockStore,
          qrCode,
          scannedAt: receipt.createdAt.toISOString(),
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 });
    }
  } catch (error) {
    console.error('Scan receipt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}