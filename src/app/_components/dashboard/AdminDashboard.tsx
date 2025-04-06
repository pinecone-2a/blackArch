"use client";

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  DollarSign,
  Users,
  TrendingUp,
  ShoppingBag,
  Plus,
  Tag,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import useFetchData from '@/lib/customHooks/useFetch';

// Import our modular components
import DashboardHeader from './DashboardHeader';
import StatsCard from './StatsCard';
import ActionCard from './ActionCard';
import OrdersTable from './OrdersTable';

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  ordersByMonth: Array<{ month: string; total: number }>;
  lastOrders: Array<{ id: string; customer: string; address: string; amount: number; date: Date; product: string; status: string }> | [];
  userCount: number;
}

export default function AdminDashboard() {
  const {data, loading} = useFetchData<Stats>("/admin");
  const [orders, setOrders] = useState([]);
  const [timePeriod, setTimePeriod] = useState('week');
  
  useEffect(() => {
    if (data?.lastOrders) {
      setOrders(data.lastOrders);
    }
  }, [data]);
  
  const stats = [
    { 
      title: "Total Revenue", 
      value: `₮${data ? data.totalRevenue.toLocaleString() : '0'}`, 
      change: "8%", 
      increasing: true,
      icon: <DollarSign size={20} />, 
      color: "bg-green-100 text-green-600" 
    },
    { 
      title: "Total Orders", 
      value: data ? data.totalOrders : 0, 
      change: "14%", 
      increasing: true,
      icon: <ShoppingCart size={20} />, 
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      title: "Total Customers", 
      value: data ? data.userCount : 0, 
      change: "5%", 
      increasing: true,
      icon: <Users size={20} />, 
      color: "bg-purple-100 text-purple-600" 
    },
    { 
      title: "Avg. Order Value", 
      value: "₮25,000", 
      change: "3%", 
      increasing: false,
      icon: <TrendingUp size={20} />, 
      color: "bg-orange-100 text-orange-600" 
    },
  ];

  const productActions = [
    {
      icon: <ShoppingBag className="text-gray-500" size={18} />,
      title: "Бүх Бүтээгдэхүүн",
      link: "/admin/products",
      actionType: "view" as const
    },
    {
      icon: <Plus className="text-gray-500" size={18} />,
      title: "Шинэ Бүтээгдэхүүн Нэмэх",
      link: "/admin/products",
      actionType: "add" as const
    }
  ];

  const categoryActions = [
    {
      icon: <Tag className="text-gray-500" size={18} />,
      title: "All Categories",
      link: "/admin/categories",
      actionType: "view" as const
    },
    {
      icon: <Plus className="text-gray-500" size={18} />,
      title: "Шинэ Ангилал Нэмэх",
      link: "/admin/categories",
      actionType: "add" as const
    }
  ];

  // Handler for updating order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header section */}
      <DashboardHeader 
        title="Самбар" 
        subtitle="Эргэн тавтай морилно уу, Admin User"
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatsCard 
            key={i}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            increasing={stat.increasing}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActionCard
          title="Бүтээгдэхүүн Менежмент"
          description="Бүтээгдэхүүндыг Хянах"
          items={productActions}
        />
        
        <ActionCard
          title="Ангилал Менежмент"
          description="Organize your store's categories"
          items={categoryActions}
        />
      </div>

      {/* Recent orders section */}
      <Tabs defaultValue="all" className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Сүүлийн Захиалгууд</h2>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">Бүгд</TabsTrigger>
              <TabsTrigger value="pending">Хүлээгдэж Буй</TabsTrigger>
              <TabsTrigger value="processing">Хүргэлтэд Гарсан</TabsTrigger>
              <TabsTrigger value="completed">Дууссан</TabsTrigger>
            </TabsList>
            <Link href="/admin/orders" className="ml-4">
              <Button variant="outline" size="sm" className="gap-1">
                View All <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <OrdersTable
            orders={orders}
            onUpdateStatus={updateOrderStatus}
          />
        </TabsContent>

        <TabsContent value="pending" className="m-0">
          <OrdersTable
            orders={orders}
            filteredStatus="pending"
            readOnly={true}
          />
        </TabsContent>

        <TabsContent value="processing" className="m-0">
          <OrdersTable
            orders={orders}
            filteredStatus="processing"
            readOnly={true}
          />
        </TabsContent>

        <TabsContent value="completed" className="m-0">
          <OrdersTable
            orders={orders}
            filteredStatus="delivered"
            readOnly={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 