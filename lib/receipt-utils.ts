/**
 * Parst einen österreichischen Rechnungs-QR-Code
 * Format: R1-AT0_1042_10420151142617_2025-11-06T08:27:53_0,00_0,00_0,00_3,10_0,00+vNmSLQ=_U:ATU46674503-01_...
 */
export interface ParsedReceiptData {
  qrCodeData: string;
  receiptDate: Date;
  amount: number;
  taxId: string | null;
}

export function parseReceiptQRCode(qrData: string): ParsedReceiptData {
  const parts = qrData.split('_');
  
  if (parts.length < 6) {
    throw new Error('Ungültiges QR-Code Format');
  }

  // Datum extrahieren (Index 4 für R1-AT3 Format)
  const dateStr = parts[4];
  let receiptDate: Date;
  
  // Try parsing as ISO date first
  receiptDate = new Date(dateStr);
  
  // If invalid, try parsing as YYYYMMDD format
  if (isNaN(receiptDate.getTime()) && /^\d{8}$/.test(dateStr)) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    receiptDate = new Date(`${year}-${month}-${day}`);
  }
  
  // If still invalid, try parsing as YYYYMMDDHHmmss format
  if (isNaN(receiptDate.getTime()) && /^\d{14}$/.test(dateStr)) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);
    receiptDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  }
  
  if (isNaN(receiptDate.getTime())) {
    throw new Error('Ungültiges Datum im QR-Code');
  }

  // Beträge extrahieren und summieren (ab Index 5)
  // Austrian QR codes have multiple amount fields that need to be summed
  let totalAmount = 0;
  
  // Look for amount fields starting from index 5
  for (let i = 5; i < parts.length; i++) {
    let amountStr = parts[i];
    
    // Stop if we hit non-amount data (contains letters or special chars except comma/plus)
    if (!/^[\d,+.]+$/.test(amountStr)) {
      break;
    }
    
    // Clean up the amount string
    amountStr = amountStr.split('+')[0]; // Remove signature part
    amountStr = amountStr.replace(',', '.'); // Convert comma to dot
    
    const amount = parseFloat(amountStr);
    
    // Add to total if it's a valid positive number
    if (!isNaN(amount) && amount >= 0) {
      totalAmount += amount;
    }
  }
  
  if (totalAmount < 0) {
    throw new Error('Ungültiger Betrag im QR-Code');
  }

  // ATU-Nummer extrahieren
  let taxId: string | null = null;
  const atuPart = parts.find(p => p.includes('U:ATU'));
  if (atuPart) {
    const atuMatch = atuPart.match(/U:(ATU\d+)/);
    if (atuMatch) {
      taxId = atuMatch[1];
    }
  }

  return {
    qrCodeData: qrData,
    receiptDate,
    amount: totalAmount,
    taxId,
  };
}

/**
 * Berechnet Punkte basierend auf dem Betrag
 * €1 = 100 Punkte
 */
export function calculatePoints(amount: number): number {
  return Math.floor(amount * 100);
}

/**
 * Formatiert Punkte mit Tausendertrennzeichen
 */
export function formatPoints(points: number): string {
  return points.toLocaleString('de-DE');
}

/**
 * Formatiert Währung in Euro
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
