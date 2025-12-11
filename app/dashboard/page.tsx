import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { DashboardStats } from '@/components/dashboard/stats';
import { RecentReceipts } from '@/components/dashboard/recent-receipts';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { MonthFilter } from '@/components/dashboard/month-filter';
import { Button } from '@/components/ui/button';
import { ScanLine, Sparkles, TrendingUp, ChevronRight, Ticket } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
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
        
        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse" />
                <span className="text-sm font-medium text-white/60">Willkommen zurück</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base text-white/70">
                Hier ist dein Überblick über Ausgaben und Rewards
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <MonthFilter />
              <Link href="/scan" className="w-full sm:w-auto">
                <Button className="btn-gradient shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105 w-full sm:w-auto">
                  <ScanLine className="h-4 w-4 mr-2" />
                  <span className="sm:inline">Rechnung scannen</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6 lg:space-y-8">
          {/* Stats Grid */}
          <DashboardStats userId={userId} />
          
          {/* Charts and Recent Activity */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <SpendingChart userId={userId} />
            <RecentReceipts userId={userId} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link href="/scan" className="group">
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 active:scale-95 sm:hover:scale-105">
                <div className="absolute top-5 sm:top-6 right-5 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-white/40" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <ScanLine className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 text-base sm:text-lg">Rechnung scannen</h3>
                <p className="text-xs sm:text-sm text-white/60">Sammle Punkte für jeden Einkauf</p>
              </div>
            </Link>

            <Link href="/vouchers" className="group">
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 active:scale-95 sm:hover:scale-105">
                <div className="absolute top-5 sm:top-6 right-5 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-white/40" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Ticket className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 text-base sm:text-lg">Meine Gutscheine</h3>
                <p className="text-xs sm:text-sm text-white/60">Gekaufte Gutscheine ansehen</p>
              </div>
            </Link>

            <Link href="/shop" className="group">
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 active:scale-95 sm:hover:scale-105">
                <div className="absolute top-5 sm:top-6 right-5 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-white/40" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 text-base sm:text-lg">Gutscheine kaufen</h3>
                <p className="text-xs sm:text-sm text-white/60">Löse deine Punkte ein</p>
              </div>
            </Link>

            <Link href="/points" className="group sm:col-span-2 lg:col-span-1">
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 active:scale-95 sm:hover:scale-105">
                <div className="absolute top-5 sm:top-6 right-5 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-white/40" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 text-base sm:text-lg">Punkte-Verlauf</h3>
                <p className="text-xs sm:text-sm text-white/60">Siehe alle Transaktionen</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
