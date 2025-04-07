import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Get time period from query params
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "month";

    // Calculate date ranges based on period
    const currentDate = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    
    switch (period) {
      case "day":
        startDate.setHours(0, 0, 0, 0);
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        previousStartDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        const dayOfWeek = currentDate.getDay();
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        previousStartDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        previousStartDate.setDate(1);
        previousStartDate.setHours(0, 0, 0, 0);
        break;
      case "quarter":
        const currentQuarter = Math.floor(currentDate.getMonth() / 3);
        startDate.setMonth(currentQuarter * 3);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        previousStartDate.setMonth(startDate.getMonth() - 3);
        previousStartDate.setDate(1);
        previousStartDate.setHours(0, 0, 0, 0);
        break;
      case "year":
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        previousStartDate.setMonth(0, 1);
        previousStartDate.setHours(0, 0, 0, 0);
        break;
    }

    // Get 6 months for trend data
    let monthsLabels = [];
    let sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    for (let i = 0; i < 6; i++) {
      const month = new Date(sixMonthsAgo);
      month.setMonth(month.getMonth() + i);
      monthsLabels.push(month.toLocaleString('default', { month: 'short' }));
    }

    // REVENUE DATA
    // Current period revenue
    const revenueCurrentPeriod = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: { gte: startDate }
      }
    });

    // Previous period revenue
    const revenuePreviousPeriod = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: { 
          gte: previousStartDate,
          lt: startDate 
        }
      }
    });

    // Monthly revenue for the past 6 months
    const revenueByMonth = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(sixMonthsAgo);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const monthRevenue = await prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: { 
            gte: monthStart,
            lt: monthEnd 
          }
        }
      });
      
      revenueByMonth.push(monthRevenue._sum.totalPrice || 0);
    }

    // ORDERS DATA
    // Current period orders
    const ordersCurrentPeriod = await prisma.order.count({
      where: {
        createdAt: { gte: startDate }
      }
    });

    // Previous period orders
    const ordersPreviousPeriod = await prisma.order.count({
      where: {
        createdAt: { 
          gte: previousStartDate,
          lt: startDate 
        }
      }
    });

    // Orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
      where: {
        createdAt: { gte: startDate }
      }
    });

    // Map order status counts
    const pendingOrders = ordersByStatus.find(o => o.status === 'pending')?._count || 0;
    const processingOrders = ordersByStatus.find(o => o.status === 'processing')?._count || 0;
    const deliveredOrders = ordersByStatus.find(o => o.status === 'delivered' || o.status === 'completed')?._count || 0;
    const cancelledOrders = ordersByStatus.find(o => o.status === 'cancelled')?._count || 0;

    // Monthly orders for the past 6 months
    const ordersByMonth = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(sixMonthsAgo);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const monthOrders = await prisma.order.count({
        where: {
          createdAt: { 
            gte: monthStart,
            lt: monthEnd 
          }
        }
      });
      
      ordersByMonth.push(monthOrders);
    }

    // CUSTOMERS DATA
    // Total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'customer'
      }
    });

    // New customers in current period
    const newCustomers = await prisma.user.count({
      where: {
        role: 'customer',
        createdAt: { gte: startDate }
      }
    });

    // New customers in previous period
    const previousNewCustomers = await prisma.user.count({
      where: {
        role: 'customer',
        createdAt: { 
          gte: previousStartDate,
          lt: startDate 
        }
      }
    });

    // New customers by month for the past 6 months
    const customersByMonth = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(sixMonthsAgo);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const monthCustomers = await prisma.user.count({
        where: {
          role: 'customer',
          createdAt: { 
            gte: monthStart,
            lt: monthEnd 
          }
        }
      });
      
      customersByMonth.push(monthCustomers);
    }

    // PRODUCTS DATA
    // Total products
    const totalProducts = await prisma.product.count();

    // Get product categories distribution
    const categoriesWithProducts = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    const topCategories = categoriesWithProducts.map(category => ({
      name: category.name,
      count: category._count.products
    }));

    // Get top selling products
    // This is an estimation since we don't have direct product sales tracking
    // We're using a sampling of orders to estimate product popularity
    const recentOrders = await prisma.order.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: { items: true, totalPrice: true }
    });
    
    // Count item occurrences
    const productCounts: Record<string, number> = {};
    const productRevenue: Record<string, number> = {};
    
    recentOrders.forEach(order => {
      const itemCount = order.items.length;
      const averageItemPrice = itemCount > 0 ? order.totalPrice / itemCount : 0;
      
      order.items.forEach(itemId => {
        if (productCounts[itemId]) {
          productCounts[itemId]++;
          productRevenue[itemId] += averageItemPrice;
        } else {
          productCounts[itemId] = 1;
          productRevenue[itemId] = averageItemPrice;
        }
      });
    });
    
    // Convert to array and sort by count
    const productPopularity = Object.keys(productCounts).map(id => ({
      id,
      sales: productCounts[id],
      revenue: productRevenue[id]
    })).sort((a, b) => b.sales - a.sales);
    
    // Get top 5 product details
    const topProducts = await Promise.all(
      productPopularity.slice(0, 5).map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.id },
          select: { name: true }
        });
        
        return {
          name: product?.name || `Product ID: ${item.id}`,
          sales: item.sales,
          revenue: Math.round(item.revenue)
        };
      })
    );

    // PAYMENT DATA
    // Approximating payment methods since we don't have detailed payment tracking
    const paymentMethods = await prisma.order.groupBy({
      by: ['paymentMethod'],
      _count: true
    });
    
    const cardPayments = paymentMethods.find(p => p.paymentMethod === 'card')?._count || 0;
    const cashPayments = paymentMethods.find(p => p.paymentMethod === 'cash')?._count || 0;
    const otherPayments = paymentMethods.find(p => p.paymentMethod !== 'card' && p.paymentMethod !== 'cash')?._count || 0;
    
    // Payment status distribution is simplified
    const paymentsByStatus = [85, 10, 5]; // Assuming 85% paid, 10% pending, 5% failed

    // Calculate percentage changes
    const currentRevenue = revenueCurrentPeriod._sum.totalPrice || 0;
    const previousRevenue = revenuePreviousPeriod._sum.totalPrice || 0;
    const revenueChange = previousRevenue === 0 
      ? 100 
      : parseFloat((((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1));
    
    const ordersChange = ordersPreviousPeriod === 0 
      ? 100 
      : parseFloat((((ordersCurrentPeriod - ordersPreviousPeriod) / ordersPreviousPeriod) * 100).toFixed(1));
    
    const customersChange = previousNewCustomers === 0 
      ? 100 
      : parseFloat((((newCustomers - previousNewCustomers) / previousNewCustomers) * 100).toFixed(1));

    // Compile analytics data
    const analytics = {
      revenue: {
        total: currentRevenue,
        previousPeriod: previousRevenue,
        percentageChange: revenueChange,
        byMonth: revenueByMonth
      },
      orders: {
        total: ordersCurrentPeriod,
        previousPeriod: ordersPreviousPeriod,
        percentageChange: ordersChange,
        byStatus: [pendingOrders, processingOrders, deliveredOrders, cancelledOrders],
        byMonth: ordersByMonth
      },
      customers: {
        total: totalCustomers,
        previousPeriod: previousNewCustomers,
        percentageChange: customersChange,
        newByMonth: customersByMonth,
        returningRate: 65 // This would require more complex analysis, using placeholder
      },
      products: {
        total: totalProducts,
        topCategories: topCategories.map(cat => cat.count),
        categoryNames: topCategories.map(cat => cat.name),
        topSelling: topProducts
      },
      payments: {
        byMethod: [cardPayments, cashPayments, otherPayments],
        methodNames: ['Credit Card', 'Cash', 'Other'],
        byStatus: paymentsByStatus
      },
      labels: {
        months: monthsLabels
      }
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
} 