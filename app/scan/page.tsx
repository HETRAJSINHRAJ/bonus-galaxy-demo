import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { QRScanner } from '@/components/scan/qr-scanner';
import { ScanLine, Camera, Coins, CheckCircle2, Zap } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: 'Kamera aktivieren',
    description: 'Klicke auf "Scanner starten" um die Kamera zu aktivieren',
  },
  {
    icon: ScanLine,
    title: 'QR-Code scannen',
    description: 'Halte die Rechnung vor die Kamera',
  },
  {
    icon: CheckCircle2,
    title: 'Automatische Erkennung',
    description: 'Der QR-Code wird automatisch erkannt',
  },
  {
    icon: Coins,
    title: 'Punkte erhalten',
    description: 'Deine Punkte werden gutgeschrieben (€1 = 100 Punkte)',
  },
];

export default async function ScanPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen dark-pattern pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        
        <div className="container mx-auto px-4 lg:px-8 py-8 relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25 animate-float">
              <ScanLine className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">QR-Code scannen</h1>
            <p className="text-white/70">
              Scanne den QR-Code auf deiner Rechnung und sammle Punkte
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Scanner - centered with max width */}
          <div className="max-w-2xl mx-auto">
            <QRScanner />
          </div>

          {/* How it works - full width */}
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <h3 className="font-semibold text-lg text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <ScanLine className="h-4 w-4 text-indigo-400" />
              </div>
              So funktioniert es
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{step.title}</p>
                      <p className="text-xs text-white/60 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Card - full width */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Coins className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Punkte-System</h4>
                <p className="text-sm text-white/70">
                  Für jeden Euro auf deiner Rechnung erhältst du 100 Galaxy Points. 
                  Sammle Punkte und löse sie gegen attraktive Gutscheine ein!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
