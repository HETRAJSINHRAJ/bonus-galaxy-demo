'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine, CheckCircle2, XCircle, Loader2, Camera, AlertCircle } from 'lucide-react';
import { parseReceiptQRCode } from '@/lib/receipt-utils';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface ScanResult {
  success: boolean;
  message: string;
  points?: number;
  amount?: number;
}

// Check if native Barcode Detection API is available
const hasNativeBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;

export function QRScannerNew() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('QR-Code positionieren');
  const [scanAttempts, setScanAttempts] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);
  const processingRef = useRef(false);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const processQRCode = async (qrData: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    
    setLoading(true);
    setFeedback('Verarbeite Beleg...');
    
    try {
      const parsedData = parseReceiptQRCode(qrData);
      
      const response = await fetch('/api/receipts/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeData: parsedData.qrCodeData,
          receiptDate: parsedData.receiptDate.toISOString(),
          amount: parsedData.amount,
          taxId: parsedData.taxId || '',
        }),
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
          window.location.href = '/dashboard';
        }, 3000);
      } else {
        let errorMessage = data.error || 'Der Beleg konnte nicht verarbeitet werden.';
        
        if (data.error?.includes('bereits')) {
          errorMessage = '⚠️ Dieser Beleg wurde bereits gescannt.';
        } else if (data.error?.includes('abgelaufen') || data.error?.includes('expired')) {
          errorMessage = '⏰ Beleg zu alt. Nur letzte 30 Tage gültig.';
        }
        
        setResult({
          success: false,
          message: errorMessage,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Keine Verbindung möglich.';
      setResult({
        success: false,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
      stopScanner();
      processingRef.current = false;
    }
  };

  // Native Barcode Detection API scanning
  const scanWithNativeAPI = async () => {
    if (!videoRef.current || !canvasRef.current || !scanningRef.current) {
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameRef.current = requestAnimationFrame(scanWithNativeAPI);
        return;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // @ts-ignore - BarcodeDetector is not in TypeScript types yet
      const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const barcodes = await barcodeDetector.detect(canvas);

      if (barcodes.length > 0 && scanningRef.current) {
        const qrCode = barcodes[0].rawValue;
        console.log('✓ QR Code detected (Native API):', qrCode);
        setFeedback('✓ QR-Code erkannt!');
        await processQRCode(qrCode);
        return;
      }
    } catch (error) {
      console.error('Native scan error:', error);
    }

    // Continue scanning at 60 FPS
    if (scanningRef.current) {
      animationFrameRef.current = requestAnimationFrame(scanWithNativeAPI);
    }
  };

  // ZXing fallback scanning - canvas-based
  const scanWithZXing = async () => {
    if (!videoRef.current || !canvasRef.current || !scanningRef.current) {
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameRef.current = requestAnimationFrame(scanWithZXing);
        return;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (!zxingReaderRef.current) {
        zxingReaderRef.current = new BrowserMultiFormatReader();
        console.log('ZXing reader initialized');
      }

      // Decode from canvas
      const result = await zxingReaderRef.current.decodeFromCanvas(canvas);
      
      if (result && scanningRef.current) {
        console.log('✓ QR Code detected (ZXing):', result.getText());
        setFeedback('✓ QR-Code erkannt!');
        await processQRCode(result.getText());
        return;
      }
    } catch (error) {
      // NotFoundException is expected when no QR code is visible
      if (error instanceof Error && !error.message.includes('NotFoundException')) {
        console.error('ZXing scan error:', error);
      }
    }

    // Continue scanning at 60 FPS
    if (scanningRef.current) {
      animationFrameRef.current = requestAnimationFrame(scanWithZXing);
    }
  };

  const startScanner = async () => {
    setScanning(true);
    setFeedback('Kamera wird gestartet...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 60, min: 30 }
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('Video playing, starting scan...');
              scanningRef.current = true;
              setFeedback('Scannen...');

              // Small delay to ensure video is fully ready
              setTimeout(() => {
                // Use native API if available, otherwise use ZXing
                if (hasNativeBarcodeDetector) {
                  console.log('✓ Using native Barcode Detection API (fastest)');
                  scanWithNativeAPI();
                } else {
                  console.log('→ Using ZXing fallback');
                  scanWithZXing();
                }
              }, 300);

              // Track scan attempts
              const attemptInterval = setInterval(() => {
                if (scanningRef.current) {
                  setScanAttempts(prev => prev + 1);
                } else {
                  clearInterval(attemptInterval);
                }
              }, 1000);
            }).catch(err => {
              console.error('Video play error:', err);
              setFeedback('Fehler beim Starten der Kamera');
            });
          }
        };
      }
    } catch (error) {
      console.error('Camera error:', error);
      let errorMsg = '📷 Kamerazugriff verweigert.';
      
      if (error instanceof Error) {
        if (error.message.includes('NotAllowedError') || error.name === 'NotAllowedError') {
          errorMsg = '📷 Kamerazugriff verweigert. Bitte erlauben Sie den Zugriff.';
        } else if (error.message.includes('NotFoundError') || error.name === 'NotFoundError') {
          errorMsg = '📷 Keine Kamera gefunden.';
        } else if (error.message.includes('NotReadableError') || error.name === 'NotReadableError') {
          errorMsg = '📷 Kamera wird bereits verwendet.';
        }
      }
      
      setScanning(false);
      setResult({
        success: false,
        message: errorMsg,
      });
    }
  };

  const stopScanner = () => {
    scanningRef.current = false;
    
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Stop video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Clear ZXing reader reference
    if (zxingReaderRef.current) {
      zxingReaderRef.current = null;
    }
    
    setScanning(false);
    setScanAttempts(0);
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
              {hasNativeBarcodeDetector ? '⚡ Schnell-Scan aktiviert' : 'Standard-Scan aktiviert'}
            </p>
          </div>
          <Button onClick={startScanner} size="lg" className="btn-gradient px-8">
            <Camera className="h-5 w-5 mr-2" />
            Scanner starten
          </Button>
        </div>
      )}

      {scanning && !result && (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-black min-h-[400px]">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              style={{ minHeight: '400px' }}
            />
            
            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Corner markers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[85%] h-[85%]">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-400/70" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-400/70" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-400/70" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-400/70" />
                
                {/* Scanning line */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Compact feedback */}
          <div className="flex items-center justify-center gap-2 min-h-[32px]">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-emerald-500/20 text-emerald-300">
              <ScanLine className="h-4 w-4 animate-pulse" />
              <span className="font-medium">{feedback}</span>
            </div>
          </div>
          
          {/* Show help after 5 seconds */}
          {scanAttempts > 5 && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-2">
                <strong className="text-white">Probleme?</strong> Versuchen Sie:
              </p>
              <ul className="text-xs text-white/60 space-y-1 ml-4 list-disc">
                <li>Bessere Beleuchtung verwenden</li>
                <li>Beleg flach auf Tisch legen</li>
                <li>Näher oder weiter weg</li>
                <li>Bildschirm antippen zum Fokussieren</li>
              </ul>
            </div>
          )}
          
          <div className="flex flex-col items-center gap-4">
            <Button onClick={stopScanner} variant="outline" className="w-full max-w-xs bg-white/5 border-white/20 text-white hover:bg-white/10">
              Abbrechen
            </Button>
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
                Weiterleitung zum Dashboard...
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
