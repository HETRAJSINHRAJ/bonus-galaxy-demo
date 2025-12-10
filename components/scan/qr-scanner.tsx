'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { ScanLine, CheckCircle2, XCircle, Loader2, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseReceiptQRCode } from '@/lib/receipt-utils';

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
    const parsedData = parseReceiptQRCode(qrData);
    
    return {
      qrCodeData: parsedData.qrCodeData,
      receiptDate: parsedData.receiptDate.toISOString(),
      amount: parsedData.amount,
      taxId: parsedData.taxId || '',
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
          message: '🎉 Erfolgreich! Ihre Punkte wurden gutgeschrieben.',
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
          message: data.error || 'Der Beleg konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Keine Verbindung möglich. Bitte überprüfen Sie Ihre Internetverbindung.',
      });
    } finally {
      setLoading(false);
      stopScanner();
    }
  };

  const startScanner = () => {
    // First set scanning to true to render the qr-reader div
    setScanning(true);
  };

  // Initialize scanner after the qr-reader div is rendered
  useEffect(() => {
    if (!scanning || scannerRef.current) return;

    const initScanner = async () => {
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
      } catch (error) {
        console.error('Scanner error:', error);
        setScanning(false);
        setResult({
          success: false,
          message: 'Kamerazugriff verweigert. Bitte erlauben Sie den Kamerazugriff in Ihren Browser-Einstellungen.',
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initScanner, 100);
    return () => clearTimeout(timer);
  }, [scanning]);

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
    <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
      {!scanning && !result && (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
            <ScanLine className="h-12 w-12 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Bereit zum Scannen</h3>
            <p className="text-white/60 text-sm">
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
          <div id="qr-reader" className="w-full rounded-xl overflow-hidden border-2 border-indigo-500/30" />
          <div className="flex flex-col items-center gap-4">
            <Button onClick={stopScanner} variant="outline" className="w-full max-w-xs bg-white/5 border-white/20 text-white hover:bg-white/10">
              Abbrechen
            </Button>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
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
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{result.message}</h3>
                {result.amount && (
                  <p className="text-white/60">
                    Betrag: <span className="font-semibold text-white">€{result.amount.toFixed(2)}</span>
                  </p>
                )}
                {result.points && (
                  <p className="text-2xl font-bold text-indigo-400 mt-3">
                    +{result.points} Punkte
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                Du wirst zum Dashboard weitergeleitet...
              </div>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-12 w-12 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Ups, das hat nicht geklappt</h3>
                <p className="text-white/60">{result.message}</p>
              </div>
              <Button onClick={() => setResult(null)} className="btn-gradient px-8">
                Erneut versuchen
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
