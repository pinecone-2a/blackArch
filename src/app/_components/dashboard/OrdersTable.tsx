"use client";

import { Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  customer: string;
  address: string;
  amount: number;
  date: Date | string | null;
  product: string;
  status: string;
}

interface OrdersTableProps {
  orders: Order[];
  filteredStatus?: string;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
  readOnly?: boolean;
}

export default function OrdersTable({ 
  orders, 
  filteredStatus, 
  onUpdateStatus,
  readOnly = false 
}: OrdersTableProps) {
  const displayOrders = filteredStatus 
    ? orders.filter(order => order.status === filteredStatus)
    : orders;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3">Захиалгын ID</th>
                <th className="px-4 py-3">Хэрэглэгч</th>
                <th className="px-4 py-3">Бүтээгдэхүүн</th>
                <th className="px-4 py-3">Дүн</th>
                <th className="px-4 py-3">Хугацаа</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayOrders.map((order) => (
                <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.customer}</td>
                  <td className="px-4 py-3 text-sm">{order.product}</td>
                  <td className="px-4 py-3 text-sm">₮{(order?.amount)?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.date ? (
                      typeof order.date === 'object' && order.date instanceof Date ?
                      `${order.date.toLocaleDateString()} ${order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` :
                      typeof order.date === 'string' ? 
                      new Date(order.date).toLocaleDateString() + ' ' + new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) :
                      "N/A"
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {readOnly ? (
                      <StatusBadge status={order.status} /> 
                    ) : (
                      <Select 
                        value={order.status} 
                        onValueChange={(value) => onUpdateStatus && onUpdateStatus(order.id, value)}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <div className="flex items-center">
                            <StatusIndicator status={order.status} />
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
                    )}
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
        <div className="text-sm text-gray-500">
          Нийт {displayOrders.length} захиалга
          {filteredStatus && ` with status "${filteredStatus}"`}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={displayOrders.length === 0}>Буцах</Button>
          <Button variant="outline" size="sm" disabled={displayOrders.length === 0}>Дараагынх</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function StatusIndicator({ status }: { status: string }) {
  return (
    <div 
      className={`w-2 h-2 rounded-full mr-2 ${
        status === 'pending' ? 'bg-yellow-500' : 
        status === 'processing' ? 'bg-blue-500' : 
        status === 'delivered' ? 'bg-green-500' : 
        'bg-red-500'
      }`}
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  let className = 'border-';
  let text = '';
  
  switch(status) {
    case 'pending':
      className = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      text = 'Хүлээгдэж';
      break;
    case 'processing':
      className = 'bg-blue-100 text-blue-800 border-blue-300';
      text = 'Хүргэлтэд';
      break;
    case 'delivered':
      className = 'bg-green-100 text-green-800 border-green-300';
      text = 'Хүргэгдсэн';
      break;
    case 'cancelled':
      className = 'bg-red-100 text-red-800 border-red-300';
      text = 'Цуцлагдсан';
      break;
  }
  
  return (
    <Badge variant="outline" className={className}>
      {text}
    </Badge>
  );
} 