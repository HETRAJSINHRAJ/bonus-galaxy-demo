/**
 * Voucher utility functions for PIN generation, QR code creation, and validation
 */

import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';

/**
 * Generate a random 4-digit PIN code
 */
export function generatePIN(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Ensure the generated PIN is unique in the database
 */
export async function generateUniquePIN(prisma: PrismaClient): Promise<string> {
  let pin = generatePIN();
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const existing = await prisma.voucherPurchase.findUnique({
      where: { pinCode: pin }
    });
    
    if (!existing) {
      return pin;
    }
    
    pin = generatePIN();
    attempts++;
  }
  
  throw new Error('Unable to generate unique PIN after maximum attempts');
}

/**
 * Generate encrypted QR code data for a voucher purchase
 */
export function generateQRData(purchaseId: string, userId: string, pinCode: string): string {
  const payload = {
    purchaseId,
    userId,
    pinCode,
    timestamp: Date.now(),
    type: 'voucher_redemption'
  };
  
  const encryptionKey = process.env.QR_ENCRYPTION_KEY || 'bonus-galaxy-default-key-change-in-production';
  
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    encryptionKey
  ).toString();
  
  return encrypted;
}

/**
 * Decrypt and validate QR code data
 */
export function decryptQRData(qrData: string): {
  purchaseId: string;
  userId: string;
  pinCode: string;
  timestamp: number;
  type: string;
} {
  try {
    const encryptionKey = process.env.QR_ENCRYPTION_KEY || 'bonus-galaxy-default-key-change-in-production';
    
    const decrypted = CryptoJS.AES.decrypt(
      qrData,
      encryptionKey
    ).toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Failed to decrypt QR data');
    }
    
    const payload = JSON.parse(decrypted);
    
    // Validate payload structure
    if (!payload.purchaseId || !payload.userId || !payload.pinCode || !payload.type) {
      throw new Error('Invalid QR data structure');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid or corrupted QR code');
  }
}

/**
 * Calculate voucher expiration date (1 year from purchase)
 */
export function calculateExpirationDate(purchaseDate: Date = new Date()): Date {
  const expirationDate = new Date(purchaseDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  return expirationDate;
}

/**
 * Check if a voucher has expired
 */
export function isVoucherExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() > new Date(expiresAt);
}

/**
 * Get bundle information by voucherId
 */
export function getBundleInfo(voucherId: string): {
  name: string;
  description: string;
  voucherCount: number;
  value: number;
} {
  const bundles: Record<string, any> = {
    'bundle-standard': {
      name: 'Standard Bundle',
      description: '10 Gutscheine von Top-Partnern',
      voucherCount: 10,
      value: 400
    },
    'bundle-premium': {
      name: 'Premium Bundle',
      description: '10 Exklusive Gutscheine',
      voucherCount: 10,
      value: 800
    },
    'bundle-deluxe': {
      name: 'Deluxe Bundle',
      description: '10 Premium Gutscheine',
      voucherCount: 10,
      value: 1200
    }
  };
  
  return bundles[voucherId] || {
    name: 'Gutschein Bundle',
    description: 'Gutscheine',
    voucherCount: 10,
    value: 400
  };
}

/**
 * Validate partner location (add your actual partner locations here)
 */
export function isValidPartnerLocation(location: string): boolean {
  const validLocations = [
    'Vienna Store',
    'Salzburg Store',
    'Innsbruck Store',
    'Graz Store',
    'Linz Store',
    'Ocono Office',
    'Zur Post',
    'Felsenhof',
    'oe24 Office',
    'RTS Office'
  ];
  
  return validLocations.includes(location);
}
