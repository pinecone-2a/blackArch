"use client";
import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Repeat, 
  Truck, 
  Check, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Eye,
  ShoppingBag,
  Plus,
  Tag
} from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import useFetchData from '@/lib/customHooks/useFetch';


type Stats = {
  totalRevenue: number;
  totalOrders: number;
  ordersByMonth: Array<{ month: string; total: number }>;
  lastOrders: Array<{ id: string; customer: string; address: string; amount: number; date: Date; product: string; status: string }> | [];
  userCount: number;
}


// Sample data for demonstration
const sampleOrders = [
  { 
    id: '12345', 
    customer: 'Buyka Bakhytbek', 
    address: '123 Main St, New York, NY 10001', 
    amount: 25000, 
    date: new Date('2025-03-01T09:31:00'), 
    product: 'Podwolk Streetwear T-shirt', 
    status: 'pending'
  },
  { 
    id: '12344', 
    customer: 'Arman Kenzhebek', 
    address: '456 Oak Ave, Los Angeles, CA 90001', 
    amount: 18900, 
    date: new Date('2025-03-01T12:15:00'), 
    product: 'Black Casual Hoodie', 
    status: 'delivered'
  },
  { 
    id: '12343', 
    customer: 'Sasha Kim', 
    address: '789 Pine Rd, Chicago, IL 60007', 
    amount: 35000, 
    date: new Date('2025-02-28T15:45:00'), 
    product: 'Street Style Collection', 
    status: 'processing'
  },
  { 
    id: '12342', 
    customer: 'Kaysar Zhiger', 
    address: '321 Cedar Ln, Seattle, WA 98101', 
    amount: 12500, 
    date: new Date('2025-02-28T10:20:00'), 
    product: 'Urban Cap', 
    status: 'cancelled'
  },
];

// Time periods for filtering
const timePeriods = [
  { value: 'today', label: 'Өнөөдөр' },
  { value: 'week', label: '7хоног' },
  { value: 'month', label: 'Сар' },
  { value: 'year', label: 'Жил' }
];

export default function AdminHome() {
  const {data, loading} = useFetchData<Stats>("/admin")
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (data?.lastOrders) {
      setOrders(data.lastOrders);
    }
  }, [data]);
  const [timePeriod, setTimePeriod] = useState('week');
  const [revenueData, setRevenueData] = useState({
    total: data ? data.totalRevenue : 0,
    percentage: 0,
    increasing: true
  });
  
  // Handler for updating order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  
  // const totalOrders = orders.length;
  // const pendingOrders = orders.filter(order => order.status === 'pending').length;
  // const processingOrders = orders.filter(order => order.status === 'processing').length;
  // const completedOrders = orders.filter(order => order.status === 'delivered').length;
  
  const stats = [
    { 
      title: "Нийт Орлого", 
      value: `₮${(revenueData.total).toFixed(2)}`, 
      change: `${revenueData.increasing ? '+' : '-'}${revenueData.percentage}%`, 
      increasing: revenueData.increasing,
      icon: <DollarSign size={20} />, 
      color: "bg-green-100 text-green-600" 
    },
    { 
      title: "Нийт Захиалга", 
      value: data ? data.totalOrders: 0, 
      change: "0", 
      increasing: true,
      icon: <ShoppingCart size={20} />, 
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      title: "Хэрэглэгчийн Тоо", 
      value: data ? data.userCount: 0, 
      change: "0", 
      increasing: true,
      icon: <Users size={20} />, 
      color: "bg-purple-100 text-purple-600" 
    },
    { 
      title: "Захиалгын Тоо", 
      value: "₮0.00", 
      change: "0", 
      increasing: false,
      icon: <TrendingUp size={20} />, 
      color: "bg-orange-100 text-orange-600" 
    },
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Самбар</h1>
          <p className="text-gray-500">Эргэн тавтай морилно уу, Admin Azaa!</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
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
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-md ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center text-xs font-medium ${stat.increasing ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                  {stat.increasing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Бүтээгдэхүүн Менежмент</CardTitle>
            <CardDescription>Бүтээгдэхүүнүүдийг Хянах</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-gray-500" size={18} />
                <span className="font-medium">Бүх бүтээгдэхүүн</span>
              </div>
              <Link href="/admin/products">
                <Button size="sm" variant="ghost">
                  Хянах <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Plus className="text-gray-500" size={18} />
                <span className="font-medium">Шинэ Бүтээгдэхүүн Нэмэх</span>
              </div>
              <Link href="/admin/products">
                <Button size="sm">
                  Нэмэх <Plus size={16} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ангилал Менежмент</CardTitle>
            <CardDescription>Бүтээгдэхүүнүүдийг Хянах</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Tag className="text-gray-500" size={18} />
                <span className="font-medium">Бүх бүтээгдэхүүн</span>
              </div>
              <Link href="/admin/categories">
                <Button size="sm" variant="ghost">
                  Хянах <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Plus className="text-gray-500" size={18} />
                <span className="font-medium">Шинэ Ангилал Нэмэх</span>
              </div>
              <Link href="/admin/categories">
                <Button size="sm">
                  Нэмэх <Plus size={16} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
                Бүгдийг Харах <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Хэрэглэгч</th>
                      <th className="px-4 py-3">Бүтээгдэхүүн</th>
                      <th className="px-4 py-3">Дүн</th>
                      <th className="px-4 py-3">Хугацаа</th>
                      <th className="px-4 py-3">Статус</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">#{order.id}</td>
                        <td className="px-4 py-3 text-sm">{order.customer}</td>
                        <td className="px-4 py-3 text-sm">{order.product}</td>
                        <td className="px-4 py-3 text-sm">${(order.amount / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">{order.date.toLocaleDateString()} {order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="px-4 py-3 text-sm">
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  order.status === 'pending' ? 'bg-yellow-500' : 
                                  order.status === 'processing' ? 'bg-blue-500' : 
                                  order.status === 'delivered' ? 'bg-green-500' : 
                                  'bg-red-500'
                                }`}></div>
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Хүлээгдэж</SelectItem>
                              <SelectItem value="processing">Хүргэлтэд</SelectItem>
                              <SelectItem value="delivered">Хүргэгдсэн</SelectItem>
                              <SelectItem value="cancelled">Цуцлагдсан</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye size={16} className="text-gray-500 hover:text-gray-800" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-gray-500">Showing {orders.length} orders</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.filter(order => order.status === 'pending').map((order) => (
                      <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">#{order.id}</td>
                        <td className="px-4 py-3 text-sm">{order.customer}</td>
                        <td className="px-4 py-3 text-sm">{order.product}</td>
                        <td className="px-4 py-3 text-sm">${(order.amount / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">{order.date.toLocaleDateString()} {order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            Pending
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye size={16} className="text-gray-500 hover:text-gray-800" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.filter(order => order.status === 'processing').map((order) => (
                      <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">#{order.id}</td>
                        <td className="px-4 py-3 text-sm">{order.customer}</td>
                        <td className="px-4 py-3 text-sm">{order.product}</td>
                        <td className="px-4 py-3 text-sm">${(order.amount / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">{order.date.toLocaleDateString()} {order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                            Processing
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye size={16} className="text-gray-500 hover:text-gray-800" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.filter(order => order.status === 'delivered').map((order) => (
                      <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">#{order.id}</td>
                        <td className="px-4 py-3 text-sm">{order.customer}</td>
                        <td className="px-4 py-3 text-sm">{order.product}</td>
                        <td className="px-4 py-3 text-sm">${(order.amount / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">{order.date.toLocaleDateString()} {order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Delivered
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye size={16} className="text-gray-500 hover:text-gray-800" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}