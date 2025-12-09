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
  
  if (parts.length < 8) {
    throw new Error('Ungültiges QR-Code Format');
  }

  // Datum extrahieren (Index 3)
  const dateStr = parts[3];
  const receiptDate = new Date(dateStr);
  
  if (isNaN(receiptDate.getTime())) {
    throw new Error('Ungültiges Datum im QR-Code');
  }

  // Betrag extrahieren (Index 7)
  let amountStr = parts[7];
  
  // Entfernen von zusätzlichen Zeichen nach dem Betrag
  amountStr = amountStr.split('+')[0];
  amountStr = amountStr.replace(',', '.');
  
  const amount = parseFloat(amountStr);
  
  if (isNaN(amount) || amount < 0) {
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
    amount,
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
