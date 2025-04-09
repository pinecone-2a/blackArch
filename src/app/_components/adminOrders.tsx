"use client";
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Truck,
  Check,
  XCircle,
  Calendar,
  ChevronRight,
  ChevronLeft,
  FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetchData from '@/lib/customHooks/useFetch';

// Sample data for demonstration
const sampleOrders = [
  { 
    id: '12345', 
    customer: 'Buyka Bakhytbek', 
    email: 'buyka@example.com',
    phone: '+1 (123) 456-7890',
    address: '123 Main St, New York, NY 10001', 
    amount: 25000, 
    date: new Date('2025-03-01T09:31:00'), 
    items: [
      { id: 'p1', name: 'Podwolk Streetwear T-shirt', price: 25000, quantity: 1 }
    ],
    status: 'pending',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid'
  },
  { 
    id: '12344', 
    customer: 'Arman Kenzhebek', 
    email: 'arman@example.com',
    phone: '+1 (234) 567-8901',
    address: '456 Oak Ave, Los Angeles, CA 90001', 
    amount: 18900, 
    date: new Date('2025-03-01T12:15:00'), 
    items: [
      { id: 'p2', name: 'Black Casual Hoodie', price: 18900, quantity: 1 }
    ],
    status: 'delivered',
    paymentMethod: 'paypal',
    paymentStatus: 'paid'
  },
  { 
    id: '12343', 
    customer: 'Sasha Kim', 
    email: 'sasha@example.com',
    phone: '+1 (345) 678-9012',
    address: '789 Pine Rd, Chicago, IL 60007', 
    amount: 35000, 
    date: new Date('2025-02-28T15:45:00'), 
    items: [
      { id: 'p3', name: 'Street Style Jacket', price: 25000, quantity: 1 },
      { id: 'p4', name: 'Urban Cap', price: 10000, quantity: 1 }
    ],
    status: 'processing',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid'
  },
  { 
    id: '12342', 
    customer: 'Kaysar Zhiger', 
    email: 'kaysar@example.com',
    phone: '+1 (456) 789-0123',
    address: '321 Cedar Ln, Seattle, WA 98101', 
    amount: 12500, 
    date: new Date('2025-02-28T10:20:00'), 
    items: [
      { id: 'p4', name: 'Urban Cap', price: 12500, quantity: 1 }
    ],
    status: 'cancelled',
    paymentMethod: 'cash',
    paymentStatus: 'unpaid'
  },
  { 
    id: '12341', 
    customer: 'Madina Bekzat', 
    email: 'madina@example.com',
    phone: '+1 (567) 890-1234',
    address: '654 Maple St, Miami, FL 33101', 
    amount: 50000, 
    date: new Date('2025-02-27T14:35:00'), 
    items: [
      { id: 'p5', name: 'Premium Streetwear Set', price: 50000, quantity: 1 }
    ],
    status: 'pending',
    paymentMethod: 'credit_card',
    paymentStatus: 'pending'
  },
];

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

const paymentOptions = [
  { value: 'all', label: 'All Payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'unpaid', label: 'Unpaid' }
];

export default function AdminOrdersComp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [orders, setOrders] = useState(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const ordersPerPage = 5;
  
  // Replace with real data when API is ready
  // const { data, loading, error } = useFetchData('/api/orders');
  
  // useEffect(() => {
  //   if (data) {
  //     setOrders(data);
  //   }
  // }, [data]);

  // Apply filters
  const filteredOrders = orders.filter(order => {
    // Apply search filter
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Apply payment filter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    // Apply tab filter
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesPayment && matchesTab;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Update order status
  const updateOrderStatus = (orderId:any, newStatus:any) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // View order details
  const viewOrderDetails = (order:any) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  // Get status badge variant and color
  const getStatusBadge = (status:any) => {
    switch (status) {
      case 'pending':
        return { variant: 'outline', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      case 'processing':
        return { variant: 'outline', className: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'delivered':
        return { variant: 'outline', className: 'bg-green-100 text-green-800 border-green-300' };
      case 'cancelled':
        return { variant: 'outline', className: 'bg-red-100 text-red-800 border-red-300' };
      default:
        return { variant: 'outline', className: '' };
    }
  };

  // Get payment badge variant and color
  const getPaymentBadge = (status:any) => {
    switch (status) {
      case 'paid':
        return { variant: 'outline', className: 'bg-green-100 text-green-800 border-green-300' };
      case 'pending':
        return { variant: 'outline', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      case 'unpaid':
        return { variant: 'outline', className: 'bg-red-100 text-red-800 border-red-300' };
      default:
        return { variant: 'outline', className: '' };
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Захиалгууд</h1>
          <p className="text-gray-500">Харилцагчийн захиалгыг удирдах ба боловсруулах.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Хэрэглэгчийг Id болон нэрээр хайх..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              {paymentOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Orders tabs and list */}
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all" className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">Бүгд</TabsTrigger>
            <TabsTrigger value="pending">Хүлээгдэж Буй</TabsTrigger>
            <TabsTrigger value="processing">Хүргэлтэд Гарсан</TabsTrigger>
            <TabsTrigger value="delivered">Дууссан</TabsTrigger>
            <TabsTrigger value="cancelled">Цуцлагдсан</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="m-0">
          <Card>
            <CardHeader className="bg-muted/50 px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">
                  {statusOptions.find(option => option.value === activeTab)?.label || 'All Orders'}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {filteredOrders.length} захиалга
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Payment</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentOrders.map((order) => (
                      <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-gray-500 text-xs">{order.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.date.toLocaleDateString()} 
                          <div className="text-xs">
                            {order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          ₮{order.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
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
                        <td className="px-6 py-4 text-sm">
                          <Badge 
                            {...getPaymentBadge(order.paymentStatus)}
                          >
                            {order.paymentStatus === 'paid' ? 'Paid' : 
                            order.paymentStatus === 'pending' ? 'Pending' : 'Unpaid'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => viewOrderDetails(order)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Нарийвчилан харах
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={order.status === 'delivered' || order.status === 'cancelled'}
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Хүргэлтэд гаргах
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                disabled={order.status === 'delivered' || order.status === 'cancelled'}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Захиалга цуцлах
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-gray-500">
                Showing {currentOrders.length > 0 ? indexOfFirstOrder + 1 : 0} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Буцах
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Дараагынх
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Full information about this order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="py-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Order #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedOrder.date.toLocaleDateString()} at {selectedOrder.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <Badge {...getStatusBadge(selectedOrder.status)}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Customer Information</h4>
                  <p className="text-sm">{selectedOrder.customer}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Shipping Address</h4>
                  <p className="text-sm">{selectedOrder.address}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2">Order Items</h4>
                <div className="bg-gray-50 rounded-md p-3">
                  {selectedOrder.items.map((item:any) => (
                    <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₮{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 mt-2 border-t border-gray-300">
                    <p className="font-semibold">Total</p>
                    <p className="font-semibold">₮{selectedOrder.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Payment Information</h4>
                  <p className="text-sm"><strong>Method:</strong> {selectedOrder.paymentMethod.replace('_', ' ').charAt(0).toUpperCase() + selectedOrder.paymentMethod.replace('_', ' ').slice(1)}</p>
                  <p className="text-sm"><strong>Status:</strong> <Badge {...getPaymentBadge(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}</Badge></p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Delivery Information</h4>
                  <p className="text-sm"><strong>Status:</strong> <Badge {...getStatusBadge(selectedOrder.status)}>{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</Badge></p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedOrder && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
              <Button variant="default" onClick={() => {
                updateOrderStatus(selectedOrder.id, 'delivered');
                setIsViewDialogOpen(false);
              }}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Delivered
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}