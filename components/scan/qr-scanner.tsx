'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanLine, CheckCircle2, XCircle, Loader2, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScanResult {
  success: boolean;
  message: string;
  points?: number;
  amount?: number;
}

export function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  const parseQRCode = (qrData: string) => {
    const parts = qrData.split('_');
    
    if (parts.length < 8) {
      throw new Error('Ungültiges QR-Code Format');
    }

    const dateStr = parts[3];
    const receiptDate = new Date(dateStr);
    const amountStr = parts[7].replace(',', '.');
    const amount = parseFloat(amountStr);

    let taxId = '';
    const atuPart = parts.find(p => p.includes('U:ATU'));
    if (atuPart) {
      const atuMatch = atuPart.match(/U:(ATU\d+)/);
      if (atuMatch) {
        taxId = atuMatch[1];
      }
    }

    return {
      qrCodeData: qrData,
      receiptDate: receiptDate.toISOString(),
      amount,
      taxId,
    };
  };

  const processQRCode = async (qrData: string) => {
    setLoading(true);
    try {
      const parsedData = parseQRCode(qrData);
      
      const response = await fetch('/api/receipts/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Rechnung erfolgreich gescannt!',
          points: data.points,
          amount: data.amount,
        });
        
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 3000);
      } else {
        setResult({
          success: false,
          message: data.error || 'Fehler beim Verarbeiten der Rechnung',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Fehler beim Scannen',
      });
    } finally {
      setLoading(false);
      stopScanner();
    }
  };

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          processQRCode(decodedText);
        },
        undefined
      );

      setScanning(true);
    } catch (error) {
      console.error('Scanner error:', error);
      setResult({
        success: false,
        message: 'Kamera konnte nicht gestartet werden',
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Card className="p-8 bg-white border border-border">
      {!scanning && !result && (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-full flex items-center justify-center mx-auto">
            <ScanLine className="h-12 w-12 text-[#6366f1]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Bereit zum Scannen</h3>
            <p className="text-muted-foreground text-sm">
              Klicke auf den Button um die Kamera zu aktivieren
            </p>
          </div>
          <Button onClick={startScanner} size="lg" className="btn-gradient px-8">
            <Camera className="h-5 w-5 mr-2" />
            Scanner starten
          </Button>
        </div>
      )}

      {scanning && !result && (
        <div className="space-y-6">
          <div id="qr-reader" className="w-full rounded-xl overflow-hidden border-2 border-[#6366f1]/20" />
          <div className="flex flex-col items-center gap-4">
            <Button onClick={stopScanner} variant="outline" className="w-full max-w-xs">
              Abbrechen
            </Button>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-[#6366f1]" />
                Verarbeite Rechnung...
              </div>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="text-center space-y-6">
          {result.success ? (
            <>
              <div className="w-24 h-24 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-12 w-12 text-[#10b981]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{result.message}</h3>
                {result.amount && (
                  <p className="text-muted-foreground">
                    Betrag: <span className="font-semibold">€{result.amount.toFixed(2)}</span>
                  </p>
                )}
                {result.points && (
                  <p className="text-2xl font-bold text-[#6366f1] mt-3">
                    +{result.points} Punkte
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Du wirst zum Dashboard weitergeleitet...
              </div>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-[#ef4444]/10 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-12 w-12 text-[#ef4444]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fehler</h3>
                <p className="text-muted-foreground">{result.message}</p>
              </div>
              <Button onClick={() => setResult(null)} className="btn-gradient px-8">
                Erneut versuchen
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
