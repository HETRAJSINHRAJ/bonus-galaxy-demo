import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { MissionWebView } from '@/components/missions/mission-webview';

export default async function MissionsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen dark-pattern">
      <Navigation />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        
        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse" />
                <span className="text-sm font-medium text-white/60">Galaktische Abenteuer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">Missionen</h1>
              <p className="text-sm sm:text-base text-white/70">
                Erfülle Missionen und sammle Nequada für die Crew
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        <MissionWebView />
      </main>
    </div>
  );
}