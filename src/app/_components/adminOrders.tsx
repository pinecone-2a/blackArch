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
  FileText,
  Loader2
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
import { useFetchData } from '@/lib/customHooks/useFetch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';


interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  date: Date | string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'unpaid';
}

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [updating, setUpdating] = useState(false);
  const ordersPerPage = 5;
  

  const { data, loading, error, refetch } = useFetchData<Order[]>('/api/admin/orders');
  
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Convert string dates to Date objects
      const processedOrders = data.map(order => ({
        ...order,
        date: new Date(order.date)
      }));
      setOrders(processedOrders);
    } else if (error) {
      toast.error(`Error loading orders: ${error}`);
      console.error("API Error:", error);
    }
  }, [data, error]);

  // Add a function to retry fetching orders
  const retryFetch = () => {
    toast.info("Trying to fetch orders again...");
    refetch();
  };

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
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update order status');
      }
      
      const updatedOrder = await response.json();
      
      // Update the orders list with the new status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: updatedOrder.status as Order['status'],
                paymentStatus: updatedOrder.paymentStatus as Order['paymentStatus']
              } 
            : order
        )
      );
      
      // Also update the selected order if viewing details
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => 
          prev ? { 
            ...prev, 
            status: updatedOrder.status as Order['status'],
            paymentStatus: updatedOrder.paymentStatus as Order['paymentStatus']
          } : null
        );
      }
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  // View order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  // Updated implementation of getStatusBadge and getPaymentBadge to return just a className
  const getStatusBadge = (status: 'pending' | 'processing' | 'delivered' | 'cancelled' | string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return '';
    }
  };

  // Get payment badge variant and color
  const getPaymentBadge = (status: 'paid' | 'pending' | 'unpaid' | string): string => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Захиалгууд</h1>
          <p className="text-gray-500">Хэрэглэгчдын захиалгуудыг удирдах</p>
        </div>

        
        {/* Add a retry button */}
        {error && (
          <Button 
            variant="outline" 
            onClick={retryFetch} 
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4" />
            Try Again

          </Button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <p>Error loading orders: {error}</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              There was a problem retrieving the orders. Please try again or contact support if the problem persists.
            </p>
            <Button 
              variant="outline" 
              onClick={retryFetch} 
              className="mt-4 flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

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
          
          <Button variant="outline" size="icon" onClick={() => refetch()}>
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
                    {loading && filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" /> 
                            Loading orders...
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No orders found matching your filters
                        </td>
                      </tr>
                    ) : (
                      currentOrders.map((order) => (
                        <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-gray-500 text-xs">{order.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {order.date instanceof Date ? order.date.toLocaleDateString() : new Date(order.date).toLocaleDateString()} 
                            <div className="text-xs">
                              {order.date instanceof Date ? order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            ₮{order.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                              disabled={updating}
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
                              variant="outline"
                              className={cn(getPaymentBadge(order.paymentStatus))}
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
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={order.status === 'delivered' || order.status === 'cancelled' || updating}
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                >
                                  <Truck className="mr-2 h-4 w-4" />
                                  Mark as Delivered
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  disabled={order.status === 'delivered' || order.status === 'cancelled' || updating}
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
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
            <DialogTitle>Захиалгын дэлгэрэнгүй</DialogTitle>
            <DialogDescription>
              Тухайн захиалгын дэлгэрэнгүй мэдээлэл.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="py-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Захиалга #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedOrder.date instanceof Date ? 
                      selectedOrder.date.toLocaleDateString() : 
                      new Date(selectedOrder.date).toLocaleDateString()} at {
                      selectedOrder.date instanceof Date ? 
                      selectedOrder.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                      new Date(selectedOrder.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    }
                  </p>
                </div>
                <Badge 
                  variant="outline"
                  className={cn(getStatusBadge(selectedOrder.status))}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Хэрэглэгчын Мэдээлэл</h4>
                  <p className="text-sm">{selectedOrder.customer}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Хүргэх Хаяг</h4>
                  <p className="text-sm">{selectedOrder.address}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2">Захиалгын Бүтээгдэхүүнүүд</h4>
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
                    <p className="font-semibold">Нийт Дүн</p>
                    <p className="font-semibold">₮{selectedOrder.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Төлбөрын Мэдээлэл</h4>
                  <p className="text-sm"><strong>Method:</strong> {selectedOrder.paymentMethod.replace('_', ' ').charAt(0).toUpperCase() + selectedOrder.paymentMethod.replace('_', ' ').slice(1)}</p>
                  <p className="text-sm"><strong>Status:</strong> <Badge 
                    variant="outline"
                    className={cn(getPaymentBadge(selectedOrder.paymentStatus))}
                  >{selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}</Badge></p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Хүргэлтийн Мэдээлэл</h4>
                  <p className="text-sm"><strong>Төлөв:</strong> <Badge 
                    variant="outline"
                    className={cn(getStatusBadge(selectedOrder.status))}
                  >{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</Badge></p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Хаах
            </Button>
            {selectedOrder && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
              <Button 
                variant="default" 
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'delivered');
                  setIsViewDialogOpen(false);
                }}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Уншиж байна...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Хүргэгдсэнээр Тооцох
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}