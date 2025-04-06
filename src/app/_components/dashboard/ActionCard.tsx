"use client";

import { ReactNode } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface ActionItem {
  icon: ReactNode;
  title: string;
  link: string;
  actionType: 'view' | 'add';
}

interface ActionCardProps {
  title: string;
  description: string;
  items: ActionItem[];
}

export default function ActionCard({ title, description, items }: ActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </div>
            <Link href={item.link}>
              <Button size="sm" variant={item.actionType === 'view' ? "ghost" : "default"}>
                {item.actionType === 'view' ? (
                  <>Manage <ChevronRight size={16} /></>
                ) : (
                  <>Add <Plus size={16} /></>
                )}
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 