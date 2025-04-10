"use client";

import { ReactNode } from 'react';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePeriod {
  value: string;
  label: string;
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  timePeriod?: string;
  timePeriods?: TimePeriod[];
  onTimePeriodChange?: (value: string) => void;
  actions?: ReactNode;
}

export default function DashboardHeader({ 
  title, 
  subtitle, 
  timePeriod,
  timePeriods = [
    { value: 'today', label: 'Өнөөдөр' },
    { value: 'week', label: 'Долоо хоног' },
    { value: 'month', label: 'Сар' },
    { value: 'year', label: 'Жил' }
  ],
  onTimePeriodChange,
  actions 
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {timePeriod && onTimePeriodChange && (
          <Select value={timePeriod} onValueChange={onTimePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {actions}
      </div>
    </div>
  );
} 