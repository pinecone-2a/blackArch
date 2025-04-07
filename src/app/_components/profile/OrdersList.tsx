"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, RefreshCcw, ShoppingBag, PackageOpen, Calendar } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  items?: Array<any>;
}

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshUserData: () => void;
  formatDate: (dateString: string) => string;
}

export default function OrdersList({
  orders,
  loading,
  error,
  refreshUserData,
  formatDate
}: OrdersListProps) {
  
  return (
    <div className="space-y-6 mt-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Миний Захиалгууд</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshUserData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? 
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Ачаалж байна</span>
            </> : 
            <>
              <RefreshCcw className="h-4 w-4" />
              Дахин ачаалах
            </>
          }
        </Button>
      </div>
      
      {loading ? (
        <OrdersLoadingSkeleton />
      ) : error ? (
        <ErrorDisplay error={error} onRetry={refreshUserData} />
      ) : orders.length === 0 ? (
        <EmptyOrdersState />
      ) : (
        <OrdersGrid 
          orders={orders} 
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden border">
          <CardHeader className="pb-0">
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50">
            <Skeleton className="h-4 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function ErrorDisplay({ error, onRetry }: { error: string, onRetry: () => void }) {
  return (
    <Card className="border-red-200">
      <CardContent className="pt-6">
        <div className="text-red-500 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
          {error}
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Дахин оролдох
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyOrdersState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border shadow-sm overflow-hidden"
    >
      <div className="p-12 flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">Захиалга байхгүй байна</h3>
        <p className="text-gray-500 mb-6 text-center max-w-sm">Таны захиалгын түүх энд харагдах болно. Та одоогоор захиалга хийгээгүй байна.</p>
        <Button asChild className="gap-2">
          <Link href="/category">
            <ShoppingBag className="h-4 w-4" />
            Дэлгүүрлэх
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

function OrdersGrid({ 
  orders, 
  formatDate
}: { 
  orders: Order[], 
  formatDate: (date: string) => string
}) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border">
            <CardHeader className="pb-0 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gray-100 border-0 text-gray-800 gap-1">
                    <PackageOpen className="h-3 w-3" /> 
                    Захиалга #{order.id.slice(-6)}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div>
                  <Badge className={`${
                    order.status === "completed" || order.status === "delivered" 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : order.status === "pending" 
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" 
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  } border-0`}>
                    {order.status === "pending" ? "Хүлээгдэж буй" :
                     order.status === "processing" ? "Боловсруулж байгаа" :
                     order.status === "delivered" || order.status === "completed" ? "Хүргэгдсэн" :
                     order.status === "cancelled" ? "Цуцлагдсан" :
                     order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Нийт дүн</h4>
                  <p className="text-2xl font-semibold">₮{order.totalPrice.toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Хүргэлтийн хаяг</h4>
                  <p className="font-medium">
                    {order.shippingAddress?.street || "Байхгүй"}, {order.shippingAddress?.city || ""},
                    {order.shippingAddress?.state || ""} {order.shippingAddress?.zip || ""}
                  </p>
                </div>
              </div>
            </CardContent>
              
            <CardFooter className="border-t bg-gray-50 py-3 px-6">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  {order.items && (
                    <span className="text-sm">
                      {order.items.length} бүтээгдэхүүн
                    </span>
                  )}
                </div>
                <Button size="sm" variant="outline" className="gap-1">
                  <PackageOpen className="h-3.5 w-3.5" />
                  Дэлгэрэнгүй
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 