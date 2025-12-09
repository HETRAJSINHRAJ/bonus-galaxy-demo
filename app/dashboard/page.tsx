import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { DashboardStats } from '@/components/dashboard/stats';
import { RecentReceipts } from '@/components/dashboard/recent-receipts';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { MonthFilter } from '@/components/dashboard/month-filter';
import { Button } from '@/components/ui/button';
import { ScanLine, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  const currentDate = new Date();
  const greeting = currentDate.getHours() < 12 ? 'Guten Morgen' : currentDate.getHours() < 18 ? 'Guten Tag' : 'Guten Abend';

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse" />
                <span className="text-sm font-medium text-gray-500">{greeting}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Hier ist dein Überblick über Ausgaben und Rewards
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MonthFilter />
              <Link href="/scan">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm">
                  <ScanLine className="h-4 w-4 mr-2" />
                  Rechnung scannen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Grid */}
          <DashboardStats userId={userId} />
          
          {/* Charts and Recent Activity */}
          <div className="grid gap-8 lg:grid-cols-2">
            <SpendingChart userId={userId} />
            <RecentReceipts userId={userId} />
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/scan" className="group">
              <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ScanLine className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Rechnung scannen</h3>
                <p className="text-sm text-gray-600">Sammle Punkte für jeden Einkauf</p>
              </div>
            </Link>

            <Link href="/shop" className="group">
              <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Gutscheine kaufen</h3>
                <p className="text-sm text-gray-600">Löse deine Punkte ein</p>
              </div>
            </Link>

            <Link href="/points" className="group">
              <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Punkte-Verlauf</h3>
                <p className="text-sm text-gray-600">Siehe alle Transaktionen</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
