"use client";
import { useState, useEffect } from 'react';
import { 
  Calendar,
  Download,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Package,
  Repeat
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetchData from '@/lib/customHooks/useFetch';

// Define types for chart components
interface ChartProps {
  data: number[];
  labels: string[];
  title: string;
}

interface DonutChartProps extends ChartProps {
  colors?: string[];
}

// Chart component (placeholder with mock data)
function BarChart({ data, labels, title }: ChartProps) {
  // This is a simple placeholder for a real chart component
  // In a real application, you would use a chart library like Chart.js, Recharts, etc.
  const maxValue = Math.max(...data);
  
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="flex flex-col space-y-2">
        {data.map((value: number, index: number) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{labels[index]}</span>
              <span className="font-medium">₮{value.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black rounded-full" 
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Line chart placeholder
function LineChart({ data, labels, title }: ChartProps) {
  // Mock SVG line chart
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  const chartHeight = 100;
  
  // Create points for SVG path
  const points = data.map((value: number, index: number) => {
    const x = (index / (data.length - 1)) * 100; // Convert to percentage
    const y = chartHeight - ((value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="w-full h-[140px] relative">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f1f1" strokeWidth="0.5" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f1f1" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f1f1" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f1f1" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f1f1" strokeWidth="0.5" />
          
          {/* Line chart */}
          <polyline
            fill="none"
            stroke="black"
            strokeWidth="2"
            points={points}
          />
          
          {/* Data points */}
          {data.map((value: number, index: number) => {
            const x = (index / (data.length - 1)) * 100;
            const y = chartHeight - ((value - minValue) / range) * chartHeight;
            return (
              <circle 
                key={index} 
                cx={x} 
                cy={y} 
                r="1.5" 
                fill="black" 
              />
            );
          })}
        </svg>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {labels.map((label: string, index: number) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Define a type for donut chart segments
interface DonutSegment {
  percentage: number;
  startAngle: number;
  endAngle: number;
  color: string;
}

// Donut chart placeholder
function DonutChart({ data, labels, title, colors = ['#000000', '#333333', '#666666', '#999999'] }: DonutChartProps) {
  const total = data.reduce((acc: number, curr: number) => acc + curr, 0);
  let cumulativePercentage = 0;
  
  // Calculate percentages and create segments
  const segments = data.map((value: number, index: number) => {
    const percentage = (value / total) * 100;
    const startAngle = cumulativePercentage;
    cumulativePercentage += percentage;
    const endAngle = cumulativePercentage;
    
    return {
      percentage,
      startAngle,
      endAngle,
      color: colors[index % colors.length]
    };
  });
  
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-center">
        <div className="w-[140px] h-[140px] relative">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* Create a circle with a hole in the middle */}
            <circle cx="50" cy="50" r="50" fill="white" />
            
            {/* Donut segments */}
            {segments.map((segment: DonutSegment, index: number) => {
              // Convert percentages to radians
              const startAngle = (segment.startAngle / 100) * 2 * Math.PI - (Math.PI / 2);
              const endAngle = (segment.endAngle / 100) * 2 * Math.PI - (Math.PI / 2);
              
              // Calculate arc path
              const x1 = 50 + 40 * Math.cos(startAngle);
              const y1 = 50 + 40 * Math.sin(startAngle);
              const x2 = 50 + 40 * Math.cos(endAngle);
              const y2 = 50 + 40 * Math.sin(endAngle);
              
              // Determine if the arc should take the long way around
              const largeArcFlag = segment.percentage > 50 ? 1 : 0;
              
              // Create path
              const path = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={segment.color}
                />
              );
            })}
            
            {/* Inner circle to create donut hole */}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
        </div>
        <div className="ml-4 space-y-2 flex-1">
          {data.map((value: number, index: number) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 mr-2 rounded-sm" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="flex justify-between w-full text-sm">
                <span>{labels[index]}</span>
                <span className="font-medium">{((value / total) * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Define types for analytics data
interface Revenue {
  total: number;
  previousPeriod: number;
  percentageChange: number;
  byMonth: number[];
}

interface Orders {
  total: number;
  previousPeriod: number;
  percentageChange: number;
  byStatus: number[];
  byMonth: number[];
}

interface Customers {
  total: number;
  previousPeriod: number;
  percentageChange: number;
  newByMonth: number[];
  returningRate: number;
}

interface Product {
  name: string;
  sales: number;
  revenue: number;
}

interface Products {
  total: number;
  topCategories: number[];
  topSelling: Product[];
}

interface Payments {
  byMethod: number[];
  byStatus: number[];
}

interface Analytics {
  revenue: Revenue;
  orders: Orders;
  customers: Customers;
  products: Products;
  payments: Payments;
}

// Sample data for demonstration
const sampleAnalytics: Analytics = {
  // Revenue data
  revenue: {
    total: 1350000,
    previousPeriod: 1250000,
    percentageChange: 8,
    byMonth: [980000, 1050000, 1200000, 1350000, 1280000, 1350000]
  },
  
  // Order data
  orders: {
    total: 256,
    previousPeriod: 223,
    percentageChange: 14.8,
    byStatus: [45, 28, 170, 13], // Pending, Processing, Delivered, Cancelled
    byMonth: [180, 198, 215, 256, 235, 256]
  },
  
  // Customer data
  customers: {
    total: 1850,
    previousPeriod: 1720,
    percentageChange: 7.5,
    newByMonth: [120, 135, 150, 165, 140, 190],
    returningRate: 65
  },
  
  // Product data
  products: {
    total: 120,
    topCategories: [35, 25, 20, 40], // Clothing, Accessories, Footwear, Other
    topSelling: [
      { name: "Podwolk Streetwear T-shirt", sales: 85, revenue: 2125000 },
      { name: "Black Casual Hoodie", sales: 72, revenue: 1360800 },
      { name: "Street Style Jacket", sales: 68, revenue: 1700000 },
      { name: "Urban Cap", sales: 64, revenue: 800000 },
      { name: "Premium Streetwear Set", sales: 58, revenue: 2900000 }
    ]
  },
  
  // Payment data
  payments: {
    byMethod: [60, 25, 15], // Credit Card, PayPal, Cash on Delivery
    byStatus: [85, 10, 5] // Paid, Pending, Failed
  }
};

// Define time period interface
interface TimePeriod {
  value: string;
  label: string;
}

// Time periods for filtering
const timePeriods: TimePeriod[] = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' }
];

export default function AdminAnalyticsComp() {
  const [timePeriod, setTimePeriod] = useState<string>('month');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [analytics, setAnalytics] = useState<Analytics>(sampleAnalytics);
  
  // Replace with real data when API is ready
  // const { data, loading, error } = useFetchData('/api/analytics');
  
  // useEffect(() => {
  //   if (data) {
  //     setAnalytics(data);
  //   }
  // }, [data]);

  // Generate month labels for charts
  const monthLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Анализ</h1>
          <p className="text-gray-500">View detailed analytics of your store</p>
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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Бүгд</TabsTrigger>
          <TabsTrigger value="sales">Борлуулалт</TabsTrigger>
          <TabsTrigger value="customers">Хэрэглэгчид</TabsTrigger>
          <TabsTrigger value="products">Бүтээгдэхүүн</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-md bg-green-100 text-green-600">
                    <DollarSign size={20} />
                  </div>
                  <div className={`flex items-center text-xs font-medium ${analytics.revenue.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.revenue.percentageChange >= 0 ? '+' : ''}{analytics.revenue.percentageChange}%
                    {analytics.revenue.percentageChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₮{analytics.revenue.total.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                    <ShoppingCart size={20} />
                  </div>
                  <div className={`flex items-center text-xs font-medium ${analytics.orders.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.orders.percentageChange >= 0 ? '+' : ''}{analytics.orders.percentageChange}%
                    {analytics.orders.percentageChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.orders.total}</div>
                <p className="text-sm text-gray-500">Total Orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-md bg-purple-100 text-purple-600">
                    <Users size={20} />
                  </div>
                  <div className={`flex items-center text-xs font-medium ${analytics.customers.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.customers.percentageChange >= 0 ? '+' : ''}{analytics.customers.percentageChange}%
                    {analytics.customers.percentageChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.customers.total}</div>
                <p className="text-sm text-gray-500">Total Customers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-md bg-orange-100 text-orange-600">
                    <Package size={20} />
                  </div>
                  <div className="flex items-center text-xs font-medium">
                    {analytics.products.total}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.products.total}</div>
                <p className="text-sm text-gray-500">Total Products</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue for the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={analytics.revenue.byMonth} 
                  labels={monthLabels}
                  title=""
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Orders Overview</CardTitle>
                <CardDescription>Order distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart 
                  data={analytics.orders.byStatus} 
                  labels={['Pending', 'Processing', 'Delivered', 'Cancelled']}
                  title=""
                  colors={['#EAB308', '#2563EB', '#16A34A', '#DC2626']}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Top selling products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products with highest sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Sales</th>
                      <th className="px-6 py-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.products.topSelling.map((product, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-sm">{product.sales} units</td>
                        <td className="px-6 py-4 text-sm">₮{product.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sales Tab */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Monthly revenue for the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={analytics.revenue.byMonth} 
                  labels={monthLabels}
                  title=""
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Orders Trend</CardTitle>
                <CardDescription>Monthly orders for the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={analytics.orders.byMonth} 
                  labels={monthLabels}
                  title=""
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart 
                  data={analytics.payments.byMethod} 
                  labels={['Credit Card', 'PayPal', 'Cash on Delivery']}
                  title=""
                  colors={['#2563EB', '#16A34A', '#EAB308']}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Monthly Revenue Performance</CardTitle>
              <CardDescription>Detailed revenue analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Month</th>
                      <th className="px-6 py-3">Revenue</th>
                      <th className="px-6 py-3">Orders</th>
                      <th className="px-6 py-3">Avg. Order Value</th>
                      <th className="px-6 py-3">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthLabels.map((month, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{month}</td>
                        <td className="px-6 py-4 text-sm">₮{analytics.revenue.byMonth[index].toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">{analytics.orders.byMonth[index]}</td>
                        <td className="px-6 py-4 text-sm">
                          ₮{(analytics.revenue.byMonth[index] / analytics.orders.byMonth[index]).toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {index > 0 ? (
                            <span className={`flex items-center ${analytics.revenue.byMonth[index] >= analytics.revenue.byMonth[index-1] ? 'text-green-600' : 'text-red-600'}`}>
                              {analytics.revenue.byMonth[index] >= analytics.revenue.byMonth[index-1] ? '+' : ''}
                              {(((analytics.revenue.byMonth[index] - analytics.revenue.byMonth[index-1]) / analytics.revenue.byMonth[index-1]) * 100).toFixed(1)}%
                              {analytics.revenue.byMonth[index] >= analytics.revenue.byMonth[index-1] ? <ArrowUp className="ml-1" size={14} /> : <ArrowDown className="ml-1" size={14} />}
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>New Customers</CardTitle>
                <CardDescription>Monthly new customer acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={analytics.customers.newByMonth} 
                  labels={monthLabels}
                  title=""
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Loyalty</CardTitle>
                <CardDescription>Returning vs. new customers</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart 
                  data={[analytics.customers.returningRate, 100 - analytics.customers.returningRate]} 
                  labels={['Returning Customers', 'New Customers']}
                  title=""
                  colors={['#2563EB', '#D1D5DB']}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition</CardTitle>
              <CardDescription>Monthly growth and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Month</th>
                      <th className="px-6 py-3">New Customers</th>
                      <th className="px-6 py-3">Total Customers</th>
                      <th className="px-6 py-3">Growth Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthLabels.map((month, index) => {
                      // Calculate cumulative customers (simplified for demo)
                      const cumulativeCustomers = analytics.customers.newByMonth
                        .slice(0, index + 1)
                        .reduce((sum, value) => sum + value, 0);
                      
                      return (
                        <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium">{month}</td>
                          <td className="px-6 py-4 text-sm">{analytics.customers.newByMonth[index]}</td>
                          <td className="px-6 py-4 text-sm">{cumulativeCustomers}</td>
                          <td className="px-6 py-4 text-sm">
                            {index > 0 ? (
                              <span className={`flex items-center ${analytics.customers.newByMonth[index] >= analytics.customers.newByMonth[index-1] ? 'text-green-600' : 'text-red-600'}`}>
                                {analytics.customers.newByMonth[index] >= analytics.customers.newByMonth[index-1] ? '+' : ''}
                                {(((analytics.customers.newByMonth[index] - analytics.customers.newByMonth[index-1]) / analytics.customers.newByMonth[index-1]) * 100).toFixed(1)}%
                                {analytics.customers.newByMonth[index] >= analytics.customers.newByMonth[index-1] ? <ArrowUp className="ml-1" size={14} /> : <ArrowDown className="ml-1" size={14} />}
                              </span>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart 
                  data={analytics.products.topCategories} 
                  labels={['Clothing', 'Accessories', 'Footwear', 'Other']}
                  title=""
                  colors={['#2563EB', '#16A34A', '#EAB308', '#D1D5DB']}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
                <CardDescription>Highest revenue generating products</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={analytics.products.topSelling.map(p => p.revenue).slice(0, 5)} 
                  labels={analytics.products.topSelling.map(p => p.name).slice(0, 5)}
                  title=""
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Best performing products by sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Sales</th>
                      <th className="px-6 py-3">Revenue</th>
                      <th className="px-6 py-3">Avg. Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.products.topSelling.map((product, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-sm">{product.sales} units</td>
                        <td className="px-6 py-4 text-sm">₮{product.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">₮{(product.revenue / product.sales).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
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