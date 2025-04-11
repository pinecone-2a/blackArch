"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, RefreshCcw, ShoppingBag, PackageOpen, Calendar } from "lucide-react";
import Link from "next/link";

type Order ={
  id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  paymentStatus?: string;
  paymentMethod?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  items?: Array<any>;
  productDetails?: Array<{
    name: string;
    quantity: number;
    price: string;
    image?: string;
  }>;
}

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  ordersLoading?: boolean;
  error: string | null;
  refreshUserData: () => void;
  formatDate: (dateString: string) => string;
}

export default function OrdersList({ orders, loading, ordersLoading, error, refreshUserData, formatDate }: OrdersListProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUserData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loading) {
    return <OrdersLoadingSkeleton />;
  }

  if (ordersLoading || isRefreshing) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
          <p className="mt-2 text-sm text-gray-600">Захиалгуудыг шинэчилж байна...</p>
        </div>
        {orders.length > 0 ? (
          <div className="opacity-50">
            <OrdersList 
              orders={orders} 
              loading={false} 
              error={null} 
              refreshUserData={() => {}} 
              formatDate={formatDate} 
            />
          </div>
        ) : (
          <OrdersLoadingSkeleton />
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-flex items-center mb-4">
          <span className="mr-2">⚠️</span> {error}
        </div>
        <Button variant="outline" onClick={handleRefresh} className="mt-2">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Дахин оролдох
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 inline-flex p-4 rounded-full mb-4">
          <ShoppingBag className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Танд одоогоор захиалга байхгүй байна</h3>
        <p className="text-gray-500 mb-4">Танд ямар нэгэн захиалга байхгүй байна.</p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/category">Дэлгүүр рүү очих</Link>
          </Button>
          <Button variant="ghost" onClick={handleRefresh} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Шинэчлэх
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 mt-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Миний Захиалгууд</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
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
      
        <OrdersGrid 
        orders={orders} 
          formatDate={formatDate} 
        />
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
          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border relative">
            {/* Watermark for paid orders */}
            {order.paymentStatus === "Paid" && (
              <div className="absolute top-2 left-2 z-10">
                <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
                  Захиалга баталгаажсан
                </div>
              </div>
            )}
            
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
                <div className="flex gap-2 items-center">
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
                  
                  {/* Payment status badge */}
                  {order.paymentStatus && (
                    <Badge className={`${
                      order.paymentStatus === "Paid" 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    } border-0`}>
                      {order.paymentStatus === "Paid" ? "Төлөгдсөн" : "Төлөгдөөгүй"}
                    </Badge>
                  )}
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
              
              {/* Products section */}
              {order.productDetails && order.productDetails.length > 0 ? (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Захиалсан бүтээгдэхүүнүүд</h4>
                  <div className="space-y-3">
                    {order.productDetails.map((product, idx) => (
                      <div key={`${order.id}-product-${idx}`} className="flex items-center">
                        {product.image && (
                          <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <div className="flex justify-between">
                            <p className="text-gray-600 text-xs">Тоо ширхэг: {product.quantity || 1}</p>
                            <p className="text-gray-800 text-sm font-medium">₮{Number(product.price || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Захиалсан бүтээгдэхүүнүүд</h4>
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-sm text-gray-600">{order.items.length} бүтээгдэхүүн</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
              
            <CardFooter className="border-t bg-gray-50 py-3 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
                <div className="text-sm text-gray-600 hidden sm:block">
                  {order.items && (
                    <span>
                      {order.items.length} бүтээгдэхүүн
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto justify-end">
                  {/* Show payment button for unpaid orders */}
                  {!order.paymentStatus || order.paymentStatus !== "Paid" ? (
                    <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white gap-1 w-full sm:w-auto">
                      <Link href={`/order-confirmation?orderId=${order.id}`} className="flex items-center justify-center gap-1 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                          <path d="M12 18V6"></path>
                        </svg>
                        Төлбөр төлөх
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="gap-1 w-full sm:w-auto">
                      <Link href={`/order-confirmation?orderId=${order.id}`} className="flex items-center justify-center gap-1 w-full">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Захиалга харах
                      </Link>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1 w-full sm:w-auto">
                  <PackageOpen className="h-3.5 w-3.5" />
                    Дэлгэрэнгүй
                </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 