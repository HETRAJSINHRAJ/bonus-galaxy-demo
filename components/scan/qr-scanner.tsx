'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { ScanLine, CheckCircle2, XCircle, Loader2, Camera, AlertCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseReceiptQRCode } from '@/lib/receipt-utils';

interface ScanResult {
  success: boolean;
  message: string;
  points?: number;
  amount?: number;
}

type ScanFeedback = 'idle' | 'detecting' | 'processing' | 'error';

interface PositionGuidance {
  direction: 'up' | 'down' | 'left' | 'right' | 'closer' | 'farther' | 'center' | 'steady' | 'blurry' | 'dark';
  message: string;
  icon: React.ReactNode;
  severity?: 'info' | 'warning' | 'error';
}

export function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<ScanFeedback>('idle');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [guidance, setGuidance] = useState<PositionGuidance | null>(null);
  const [scanAttempts, setScanAttempts] = useState(0);
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const [steadyStartTime, setSteadyStartTime] = useState<number>(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const parseQRCode = (qrData: string) => {
    try {
      const parsedData = parseReceiptQRCode(qrData);
      
      return {
        qrCodeData: parsedData.qrCodeData,
        receiptDate: parsedData.receiptDate.toISOString(),
        amount: parsedData.amount,
        taxId: parsedData.taxId || '',
      };
    } catch (error) {
      // Provide specific error messages based on parsing failure
      if (error instanceof Error) {
        if (error.message.includes('format')) {
          throw new Error('QR-Code Format nicht erkannt. Bitte scannen Sie einen gültigen Kassenbeleg.');
        } else if (error.message.includes('date')) {
          throw new Error('Datum im QR-Code ungültig. Bitte überprüfen Sie den Beleg.');
        } else if (error.message.includes('amount')) {
          throw new Error('Betrag konnte nicht gelesen werden. Bitte scannen Sie erneut.');
        }
      }
      throw new Error('QR-Code konnte nicht gelesen werden. Stellen Sie sicher, dass es ein Kassenbeleg ist.');
    }
  };

  const processQRCode = async (qrData: string) => {
    // Prevent duplicate processing
    if (processingRef.current) return;
    processingRef.current = true;
    
    // Show detecting feedback
    setScanFeedback('detecting');
    setErrorDetail('');
    
    setLoading(true);
    setScanFeedback('processing');
    
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
          window.location.href = '/dashboard';
        }, 3000);
      } else {
        // Provide specific error messages
        let errorMessage = data.error || 'Der Beleg konnte nicht verarbeitet werden.';
        
        if (data.error?.includes('bereits')) {
          errorMessage = '⚠️ Dieser Beleg wurde bereits gescannt und kann nicht erneut verwendet werden.';
        } else if (data.error?.includes('abgelaufen') || data.error?.includes('expired')) {
          errorMessage = '⏰ Dieser Beleg ist zu alt. Nur Belege der letzten 30 Tage sind gültig.';
        } else if (data.error?.includes('Mindestbetrag') || data.error?.includes('minimum')) {
          errorMessage = '💰 Der Betrag ist zu niedrig. Mindestbetrag: €5.00';
        }
        
        setResult({
          success: false,
          message: errorMessage,
        });
        setScanFeedback('error');
        setErrorDetail(data.error || '');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Keine Verbindung möglich. Bitte überprüfen Sie Ihre Internetverbindung.';
      setResult({
        success: false,
        message: errorMessage,
      });
      setScanFeedback('error');
      setErrorDetail(errorMessage);
    } finally {
      setLoading(false);
      stopScanner();
      // Reset processing flag after a delay to allow retry if needed
      setTimeout(() => {
        processingRef.current = false;
        setScanFeedback('idle');
      }, 1000);
    }
  };

  const startScanner = () => {
    // First set scanning to true to render the qr-reader div
    setScanning(true);
  };

  // Analyze video frame for partial QR code detection
  const analyzeFrame = () => {
    const video = document.querySelector('#qr-reader video') as HTMLVideoElement;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    videoRef.current = video;
    
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const guidance = detectQRPosition(imageData, canvas.width, canvas.height);
      setGuidance(guidance);
      
      // Track scan attempts for better error messages - ultra-fast tracking
      const now = Date.now();
      if (now - lastScanTime > 200) { // 200ms intervals
        setScanAttempts(prev => prev + 1);
        setLastScanTime(now);
      }
    } catch (error) {
      console.error('Frame analysis error:', error);
    }
  };

  // Calculate image blur using Laplacian variance - OPTIMIZED for speed
  const calculateBlur = (imageData: ImageData, width: number, height: number): number => {
    const data = imageData.data;
    let sum = 0;
    let count = 0;
    
    // Sample every 5th pixel for 25x speed improvement
    const step = 5;
    
    // Convert to grayscale and apply Laplacian operator
    for (let y = step; y < height - step; y += step) {
      for (let x = step; x < width - step; x += step) {
        const i = (y * width + x) * 4;
        
        // Get grayscale value (optimized - single calculation)
        const center = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        // Get neighboring pixels
        const topI = ((y - step) * width + x) * 4;
        const top = (data[topI] + data[topI + 1] + data[topI + 2]) / 3;
        
        const bottomI = ((y + step) * width + x) * 4;
        const bottom = (data[bottomI] + data[bottomI + 1] + data[bottomI + 2]) / 3;
        
        const leftI = (y * width + (x - step)) * 4;
        const left = (data[leftI] + data[leftI + 1] + data[leftI + 2]) / 3;
        
        const rightI = (y * width + (x + step)) * 4;
        const right = (data[rightI] + data[rightI + 1] + data[rightI + 2]) / 3;
        
        // Laplacian: center * 4 - (top + bottom + left + right)
        const laplacian = Math.abs(center * 4 - (top + bottom + left + right));
        sum += laplacian * laplacian;
        count++;
      }
    }
    
    // Return variance (higher = sharper, lower = blurrier)
    return sum / count;
  };

  // Calculate average brightness - OPTIMIZED for speed
  const calculateBrightness = (imageData: ImageData): number => {
    const data = imageData.data;
    let sum = 0;
    
    // Sample every 10th pixel for 10x speed improvement
    const step = 40; // 4 bytes per pixel * 10 pixels
    let count = 0;
    
    for (let i = 0; i < data.length; i += step) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      count++;
    }
    
    return sum / count;
  };

  // Detect QR code position and provide guidance
  const detectQRPosition = (imageData: ImageData, width: number, height: number): PositionGuidance | null => {
    const data = imageData.data;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Detect dark patterns (potential QR code modules) FIRST
    let darkPixels = 0;
    let darkPixelX = 0;
    let darkPixelY = 0;
    let totalChecked = 0;
    let edgePixels = 0; // Count high-contrast edges (QR patterns)
    
    // Sample pixels in a grid pattern - optimized step size
    const step = 15; // Increased from 10 to 15 for 2.25x speed improvement
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        if (brightness < 100) { // Dark pixel
          darkPixels++;
          darkPixelX += x;
          darkPixelY += y;
        }
        
        // Check for edges (high contrast between adjacent pixels)
        if (x < width - step && y < height - step) {
          const nextI = (y * width + (x + step)) * 4;
          const nextBrightness = (data[nextI] + data[nextI + 1] + data[nextI + 2]) / 3;
          if (Math.abs(brightness - nextBrightness) > 80) {
            edgePixels++;
          }
        }
        
        totalChecked++;
      }
    }
    
    // Check if QR code is detected (significant dark patterns and edges)
    // Very lenient thresholds for any angle and distance
    const darkRatio = darkPixels / totalChecked;
    const edgeRatio = edgePixels / totalChecked;
    const hasQRPattern = darkPixels >= 10 && darkRatio >= 0.02 && darkRatio <= 0.6; // Very lenient: min 10 pixels, 2-60% coverage
    
    // No QR code detected
    if (!hasQRPattern) {
      return {
        direction: 'center',
        message: 'QR-Code positionieren',
        icon: <Camera className="h-5 w-5" />,
        severity: 'info'
      };
    }
    
    // Calculate center of dark region
    const avgX = darkPixelX / darkPixels;
    const avgY = darkPixelY / darkPixels;
    
    // Determine guidance based on position
    const offsetX = avgX - centerX;
    const offsetY = avgY - centerY;
    const threshold = 80; // Increased from 50 to 80 for more lenient positioning at distance
    
    // Check if QR is well-positioned (centered and right size)
    // Very lenient positioning - allow any angle
    const isWellPositioned = Math.abs(offsetX) <= threshold * 1.5 && Math.abs(offsetY) <= threshold * 1.5 && darkRatio >= 0.02 && darkRatio <= 0.6;
    
    // REMOVED quality checks - let the scanner try to scan without blocking
    
    // Check if QR code is too small or too large
    // Very lenient thresholds for any distance
    if (darkRatio < 0.02) { // Very small - too far
      return {
        direction: 'closer',
        message: 'Näher',
        icon: <ZoomIn className="h-5 w-5" />,
        severity: 'info'
      };
    } else if (darkRatio > 0.6) { // Very large - too close
      return {
        direction: 'farther',
        message: 'Weiter weg',
        icon: <ZoomOut className="h-5 w-5" />,
        severity: 'info'
      };
    }
    
    // Reset steady timer when not centered
    if (steadyStartTime !== 0) {
      setSteadyStartTime(0);
    }
    
    // Directional guidance - very lenient
    if (Math.abs(offsetX) > threshold * 1.5 || Math.abs(offsetY) > threshold * 1.5) {
      if (Math.abs(offsetX) > Math.abs(offsetY)) {
        if (offsetX > 0) {
          return {
            direction: 'left',
            message: '← Links',
            icon: <ArrowLeft className="h-5 w-5" />,
            severity: 'info'
          };
        } else {
          return {
            direction: 'right',
            message: 'Rechts →',
            icon: <ArrowRight className="h-5 w-5" />,
            severity: 'info'
          };
        }
      } else {
        if (offsetY > 0) {
          return {
            direction: 'up',
            message: '↑ Oben',
            icon: <ArrowUp className="h-5 w-5" />,
            severity: 'info'
          };
        } else {
          return {
            direction: 'down',
            message: 'Unten ↓',
            icon: <ArrowDown className="h-5 w-5" />,
            severity: 'info'
          };
        }
      }
    }
    
    // QR code is centered and positioned well
    // Track how long it's been steady
    const now = Date.now();
    if (steadyStartTime === 0) {
      setSteadyStartTime(now);
    }
    
    const steadyDuration = now - steadyStartTime;
    
    // After 2 seconds of being steady without scanning, show helpful message
    if (steadyDuration > 2000) {
      return {
        direction: 'blurry',
        message: 'Nicht lesbar - Besseres Licht oder näher',
        icon: <AlertCircle className="h-5 w-5" />,
        severity: 'warning'
      };
    }
    
    return {
      direction: 'steady',
      message: 'Scannen...',
      icon: <ScanLine className="h-5 w-5 animate-pulse" />,
      severity: 'info'
    };
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
            fps: 60, // Maximum FPS for instant scanning
            qrbox: function(viewfinderWidth, viewfinderHeight) {
              // Use full screen for maximum detection area
              return {
                width: Math.floor(viewfinderWidth * 0.95),
                height: Math.floor(viewfinderHeight * 0.95)
              };
            },
            aspectRatio: 1.0, // Square aspect ratio for better QR detection
            disableFlip: false, // Allow flipped QR codes for any angle scanning
          },
          (decodedText) => {
            processQRCode(decodedText);
          },
          (errorMessage) => {
            // Silent error handling - this fires constantly during scanning
          }
        );
        
        // Start frame analysis for positioning guidance - balanced interval
        detectionIntervalRef.current = setInterval(analyzeFrame, 150); // 150ms for balance between speed and performance
        
      } catch (error) {
        console.error('Scanner error:', error);
        setScanning(false);
        
        // Provide specific error messages
        let errorMsg = 'Kamerazugriff verweigert. Bitte erlauben Sie den Kamerazugriff in Ihren Browser-Einstellungen.';
        
        if (error instanceof Error) {
          if (error.message.includes('NotAllowedError') || error.message.includes('Permission')) {
            errorMsg = '📷 Kamerazugriff verweigert. Bitte erlauben Sie den Kamerazugriff in Ihren Browser-Einstellungen und laden Sie die Seite neu.';
          } else if (error.message.includes('NotFoundError')) {
            errorMsg = '📷 Keine Kamera gefunden. Bitte stellen Sie sicher, dass Ihr Gerät eine funktionierende Kamera hat.';
          } else if (error.message.includes('NotReadableError')) {
            errorMsg = '📷 Kamera wird bereits verwendet. Bitte schließen Sie andere Apps, die die Kamera verwenden.';
          } else if (error.message.includes('OverconstrainedError')) {
            errorMsg = '📷 Kamera unterstützt die erforderlichen Einstellungen nicht. Versuchen Sie es mit einer anderen Kamera.';
          }
        }
        
        setResult({
          success: false,
          message: errorMsg,
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initScanner, 100);
    return () => clearTimeout(timer);
  }, [scanning]);

  const stopScanner = async () => {
    // Clear detection interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
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
    setGuidance(null);
    setScanAttempts(0);
    setSteadyStartTime(0);
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
          <div className="relative">
            <div id="qr-reader" className="w-full rounded-xl overflow-hidden border-2 border-indigo-500/30" />
            
            {/* Visual feedback overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Minimal corner markers only */}
              {scanFeedback === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Corner markers - yellow ONLY when QR detected and positioned */}
                  <div className="relative w-[85%] h-[85%]">
                    {/* Top-left */}
                    <div className={`absolute top-0 left-0 w-16 h-16 border-t-[6px] border-l-[6px] rounded-tl-lg transition-all duration-200 ${
                      guidance && guidance.direction === 'steady'
                        ? 'qr-corner-yellow qr-highlight' 
                        : 'border-indigo-400/70'
                    }`} />
                    {/* Top-right */}
                    <div className={`absolute top-0 right-0 w-16 h-16 border-t-[6px] border-r-[6px] rounded-tr-lg transition-all duration-200 ${
                      guidance && guidance.direction === 'steady'
                        ? 'qr-corner-yellow qr-highlight' 
                        : 'border-indigo-400/70'
                    }`} />
                    {/* Bottom-left */}
                    <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-[6px] border-l-[6px] rounded-bl-lg transition-all duration-200 ${
                      guidance && guidance.direction === 'steady'
                        ? 'qr-corner-yellow qr-highlight' 
                        : 'border-indigo-400/70'
                    }`} />
                    {/* Bottom-right */}
                    <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-[6px] border-r-[6px] rounded-br-lg transition-all duration-200 ${
                      guidance && guidance.direction === 'steady'
                        ? 'qr-corner-yellow qr-highlight' 
                        : 'border-indigo-400/70'
                    }`} />
                    
                    {/* Yellow corner dots when QR detected */}
                    {guidance && guidance.direction === 'steady' && (
                      <>
                        <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)' }} />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)' }} />
                        <div className="absolute bottom-0 left-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)' }} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)' }} />
                      </>
                    )}
                    
                    {/* Scanning line animation when positioned */}
                    {guidance && guidance.direction === 'steady' && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-scan-line" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {scanFeedback === 'detecting' && (
                <div className="bg-indigo-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                  <ScanLine className="h-5 w-5 animate-pulse" />
                  <span className="font-medium">QR-Code erkannt! Lese Daten...</span>
                </div>
              )}
              
              {scanFeedback === 'processing' && (
                <div className="bg-purple-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Verarbeite Beleg...</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Compact feedback below scanner */}
          <div className="flex items-center justify-center gap-2 min-h-[32px]">
            {guidance && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                guidance.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                guidance.direction === 'steady' ? 'bg-emerald-500/20 text-emerald-300' :
                guidance.direction === 'center' ? 'bg-white/10 text-white/60' :
                'bg-indigo-500/20 text-indigo-300'
              }`}>
                <span className="scale-75">{guidance.icon}</span>
                <span className="font-medium">{guidance.message}</span>
              </div>
            )}
          </div>
          
          {/* Show detailed help only after many attempts */}
          {scanAttempts > 5 && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-2">
                <strong className="text-white">Probleme beim Scannen?</strong> Versuchen Sie:
              </p>
              <ul className="text-xs text-white/60 space-y-1 ml-4 list-disc">
                <li>Bessere Beleuchtung oder Kamera-Blitz verwenden</li>
                <li>Beleg flach auf Tisch legen und von oben scannen</li>
                <li>Näher herangehen oder weiter weg</li>
                <li>Auf Bildschirm tippen zum Fokussieren</li>
              </ul>
            </div>
          )}
          
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
