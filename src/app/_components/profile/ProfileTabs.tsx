"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageOpen, MapPin, User } from "lucide-react";

interface ProfileTabsProps {
  defaultTab?: string;
  ordersTab?: ReactNode;
  addressesTab?: ReactNode;
  accountTab?: ReactNode;
}

export default function ProfileTabs({
  defaultTab = "orders",
  ordersTab,
  addressesTab,
  accountTab
}: ProfileTabsProps) {
  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-8 -mt-6">
      <Tabs defaultValue={defaultTab} className="w-full">
        <Card className="mb-8 overflow-hidden border-0 shadow-md">
          <TabsList className="w-full justify-start p-0 h-auto bg-transparent border-b rounded-none">
            <TabsTrigger 
              value="orders" 
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-6 py-4"
            >
              <PackageOpen className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="address" 
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-6 py-4"
            >
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-6 py-4"
            >
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>
        </Card>
        
        <TabsContent value="orders" className="space-y-6 mt-0">
          {ordersTab}
        </TabsContent>
        
        <TabsContent value="address" className="mt-0">
          {addressesTab}
        </TabsContent>
        
        <TabsContent value="account" className="mt-0">
          {accountTab}
        </TabsContent>
      </Tabs>
    </div>
  );
} 