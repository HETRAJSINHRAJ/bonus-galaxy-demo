import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, ShoppingBag, Mail, Gift, Coins } from 'lucide-react';
import Link from 'next/link';

const nextSteps = [
  {
    icon: Mail,
    text: 'Du erhältst eine Bestätigungs-E-Mail mit allen Details',
  },
  {
    icon: Gift,
    text: 'Deine Gutscheine findest du in deinem Dashboard',
  },
  {
    icon: Coins,
    text: 'Eventuelle Bonuspunkte wurden deinem Konto gutgeschrieben',
  },
];

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 lg:pb-8">
      <Navigation />
      
      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 text-center space-y-8 bg-white border border-border">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12 text-[#10b981]" />
            </div>
            
            {/* Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">Zahlung erfolgreich!</h1>
              <p className="text-muted-foreground text-lg">
                Vielen Dank für deinen Kauf. Deine Gutscheine wurden erfolgreich freigeschaltet.
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 p-6 rounded-xl text-left border border-[#6366f1]/10">
              <h3 className="font-semibold text-lg mb-4">Nächste Schritte:</h3>
              <div className="space-y-3">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <Icon className="h-5 w-5 text-[#6366f1]" />
                      </div>
                      <span className="text-sm">{step.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild className="btn-gradient">
                <Link href="/dashboard">
                  Zum Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/shop">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Weitere Gutscheine kaufen
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
