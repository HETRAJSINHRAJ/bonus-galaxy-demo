import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, ShoppingBag, Mail, Gift, Coins, Sparkles, Star } from 'lucide-react';
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
    <div className="min-h-screen dark-pattern pb-24 lg:pb-8">
      <Navigation />
      
      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 w-32 h-32 rounded-full bg-emerald-400/10 blur-3xl animate-float hidden lg:block" />
      <div className="fixed bottom-20 left-10 w-24 h-24 rounded-full bg-indigo-400/10 blur-3xl animate-float-slow hidden lg:block" />
      
      <main className="container mx-auto px-4 lg:px-6 py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="p-8 lg:p-12 text-center space-y-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
            
            {/* Animated stars */}
            <div className="absolute top-6 right-6 text-amber-400/30 animate-pulse">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <div className="absolute top-12 right-16 text-amber-400/20 animate-pulse delay-200">
              <Star className="h-4 w-4 fill-current" />
            </div>
            <div className="absolute top-8 left-8 text-indigo-400/30 animate-pulse delay-300">
              <Sparkles className="h-5 w-5" />
            </div>
            
            <div className="relative z-10 space-y-8">
              {/* Success Icon */}
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-scale-in">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                </div>
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse-glow" />
              </div>
              
              {/* Message */}
              <div className="space-y-3 animate-fade-in delay-100">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">Zahlung erfolgreich!</h1>
                <p className="text-white/70 text-lg">
                  Vielen Dank für deinen Kauf. Deine Gutscheine wurden erfolgreich freigeschaltet.
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl text-left border border-indigo-500/20 animate-fade-in delay-200">
                <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  Nächste Schritte:
                </h3>
                <div className="space-y-3">
                  {nextSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors border border-white/10">
                          <Icon className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="text-sm text-white/80 pt-2">{step.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in delay-300">
                <Button asChild className="btn-gradient text-white border-0 hover:scale-105 transition-transform">
                  <Link href="/dashboard">
                    Zum Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 transition-transform">
                  <Link href="/shop">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Weitere Gutscheine kaufen
                  </Link>
                </Button>
              </div>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-white/50 pt-4">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Sichere Transaktion abgeschlossen
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
