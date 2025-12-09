import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Receipt className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Letzte Rechnungen</h3>
            <p className="text-sm text-gray-500">Deine neuesten Scans</p>
          </div>
        </div>
        <Link href="/points">
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            Alle anzeigen
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="p-6">
        {receipts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-8 w-8 text-indigo-400" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Noch keine Rechnungen</h4>
            <p className="text-gray-600 mb-6 text-sm">
              Scanne deine erste Rechnung und sammle Punkte!
            </p>
            <Link href="/scan">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Jetzt scannen
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {receipts.map((receipt, index) => (
              <div
                key={receipt.id}
                className="group flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Receipt className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        €{receipt.amount.toFixed(2)}
                      </p>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          Neu
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(receipt.receiptDate), 'dd. MMMM yyyy', { locale: de })}
                    </p>
                    {receipt.taxId && (
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {receipt.taxId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <Sparkles className="h-4 w-4" />
                      +{receipt.pointsEarned}
                    </div>
                    <p className="text-xs text-gray-500">Punkte</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
