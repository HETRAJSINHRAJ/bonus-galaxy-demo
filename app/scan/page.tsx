import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { QRScanner } from '@/components/scan/qr-scanner';
import { Card } from '@/components/ui/card';
import { ScanLine, Camera, Coins, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f9fafb] pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="bg-gradient-hero border-b border-border/40">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ScanLine className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">QR-Code scannen</h1>
            <p className="text-muted-foreground">
              Scanne den QR-Code auf deiner Rechnung und sammle Punkte
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <QRScanner />

          {/* How it works */}
          <Card className="p-6 bg-white border border-border">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                <ScanLine className="h-4 w-4 text-[#6366f1]" />
              </div>
              So funktioniert es
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 bg-[#f9fafb] rounded-xl"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6 bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 border-[#6366f1]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#6366f1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Coins className="h-6 w-6 text-[#6366f1]" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Punkte-System</h4>
                <p className="text-sm text-muted-foreground">
                  Für jeden Euro auf deiner Rechnung erhältst du 100 Galaxy Points. 
                  Sammle Punkte und löse sie gegen attraktive Gutscheine ein!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
