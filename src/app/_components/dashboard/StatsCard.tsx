"use client";

import { ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  increasing: boolean;
  icon: ReactNode;
  color: string;
}

export default function StatsCard({ title, value, change, increasing, icon, color }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-md ${color}`}>
            {icon}
          </div>
          <div className={`flex items-center text-xs font-medium ${increasing ? 'text-green-600' : 'text-red-600'}`}>
            {change}
            {increasing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-gray-500">{title}</p>
      </CardContent>
    </Card>
  );
} 