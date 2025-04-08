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

    let monthsLabels = [];
    let sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    for (let i = 0; i < 6; i++) {
      const month = new Date(sixMonthsAgo);
      month.setMonth(month.getMonth() + i);
      monthsLabels.push(month.toLocaleString('default', { month: 'short' }));
    }

 
    const revenueCurrentPeriod = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: { gte: startDate }
      }
    });


    const revenuePreviousPeriod = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: { 
          gte: previousStartDate,
          lt: startDate 
        }
      }
    });

 
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


    const ordersCurrentPeriod = await prisma.order.count({
      where: {
        createdAt: { gte: startDate }
      }
    });


    const ordersPreviousPeriod = await prisma.order.count({
      where: {
        createdAt: { 
          gte: previousStartDate,
          lt: startDate 
        }
      }
    });


    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
      where: {
        createdAt: { gte: startDate }
      }
    });


    const pendingOrders = ordersByStatus.find(o => o.status === 'pending')?._count || 0;
    const processingOrders = ordersByStatus.find(o => o.status === 'processing')?._count || 0;
    const deliveredOrders = ordersByStatus.find(o => o.status === 'delivered' || o.status === 'completed')?._count || 0;
    const cancelledOrders = ordersByStatus.find(o => o.status === 'cancelled')?._count || 0;

 
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


    const totalCustomers = await prisma.user.count({
      where: {
        role: 'customer'
      }
    });


    const newCustomers = await prisma.user.count({
      where: {
        role: 'customer',
        createdAt: { gte: startDate }
      }
    });


    const previousNewCustomers = await prisma.user.count({
      where: {
        role: 'customer',
        createdAt: { 
          gte: previousStartDate,
          lt: startDate 
        }
      }
    });


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

    const totalProducts = await prisma.product.count();


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


    const recentOrders = await prisma.order.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: { items: true, totalPrice: true }
    });
    

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
    
  
    const productPopularity = Object.keys(productCounts).map(id => ({
      id,
      sales: productCounts[id],
      revenue: productRevenue[id]
    })).sort((a, b) => b.sales - a.sales);
    
 
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


    const paymentMethods = await prisma.order.groupBy({
      by: ['paymentMethod'],
      _count: true
    });
    
    const cardPayments = paymentMethods.find(p => p.paymentMethod === 'card')?._count || 0;
    const cashPayments = paymentMethods.find(p => p.paymentMethod === 'cash')?._count || 0;
    const otherPayments = paymentMethods.find(p => p.paymentMethod !== 'card' && p.paymentMethod !== 'cash')?._count || 0;
    

    const paymentsByStatus = [85, 10, 5]; 


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
        returningRate: 65 
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