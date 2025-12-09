import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, ArrowRight, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';

interface RecentReceiptsProps {
  userId: string;
}

export async function RecentReceipts({ userId }: RecentReceiptsProps) {
  const receipts = await prisma.receipt.findMany({
    where: { userId },
    orderBy: { receiptDate: 'desc' },
    take: 5,
  });

  return (
    <div className="rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base">Letzte Rechnungen</h3>
            <p className="text-xs sm:text-sm text-white/60">Deine neuesten Scans</p>
          </div>
        </div>
        <Link href="/points">
          <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 text-xs sm:text-sm px-2 sm:px-3">
            <span className="hidden sm:inline">Alle anzeigen</span>
            <span className="sm:hidden">Alle</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="p-4 sm:p-6">
        {receipts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Receipt className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-400" />
            </div>
            <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Noch keine Rechnungen</h4>
            <p className="text-white/60 mb-4 sm:mb-6 text-xs sm:text-sm px-4">
              Scanne deine erste Rechnung und sammle Punkte!
            </p>
            <Link href="/scan">
              <Button className="btn-gradient text-sm sm:text-base">
                <Sparkles className="h-4 w-4 mr-2" />
                Jetzt scannen
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {receipts.map((receipt, index) => (
              <div
                key={receipt.id}
                className="group flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/10"
              >
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <p className="font-semibold text-white text-sm sm:text-base">
                        €{receipt.amount.toFixed(2)}
                      </p>
                      {index === 0 && (
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-medium">
                          Neu
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-white/60 truncate">
                      {format(new Date(receipt.receiptDate), 'dd. MMM yyyy', { locale: de })}
                    </p>
                    {receipt.taxId && (
                      <p className="text-[10px] sm:text-xs text-white/40 font-mono mt-0.5 truncate">
                        {receipt.taxId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 sm:gap-1 text-emerald-400 font-semibold text-xs sm:text-sm">
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                      +{receipt.pointsEarned}
                    </div>
                    <p className="text-[10px] sm:text-xs text-white/50">Punkte</p>
                  </div>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
