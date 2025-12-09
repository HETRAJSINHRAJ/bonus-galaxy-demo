'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function MonthFilter() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
        <Calendar className="h-4 w-4 text-indigo-400" />
      </div>
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[160px] border-0 bg-transparent p-0 h-auto focus:ring-0 font-medium text-white">
          <SelectValue placeholder="Monat wählen" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a2942] border-white/10 rounded-lg shadow-lg">
          {generateMonthOptions().map(({ value, label }) => (
            <SelectItem 
              key={value} 
              value={value}
              className="text-white/80 focus:bg-indigo-500/20 focus:text-white cursor-pointer"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
