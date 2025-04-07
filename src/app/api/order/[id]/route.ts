import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const orderId = params.id;
    console.log("Looking for order with ID:", orderId);
    
    // Try first finding all orders to verify connection works
    const allOrders = await prisma.order.findMany({
      take: 5,
      select: {
        id: true,
        status: true
      }
    });
    
    console.log("Found orders in database:", allOrders.length);
    if (allOrders.length > 0) {
      console.log("Order IDs in database:", allOrders.map(o => o.id));
      
      // Try finding the order by matching ID in the list first
      const exactMatch = allOrders.find(o => o.id === orderId);
      if (exactMatch) {
        console.log("Found exact match in list!");
      }
    }

    // Try fetching with findUnique 
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,
      }
    });

    console.log("Order found with findUnique:", order ? "Yes" : "No");
    
    if (!order) {
      // If not found with findUnique, try with findFirst
      console.log("Trying findFirst as fallback");
      const orderByFirstMatch = await prisma.order.findFirst({
        where: {
          id: {
            equals: orderId
          }
        },
        include: {
          user: true,
        }
      });
      
      console.log("Order found with findFirst:", orderByFirstMatch ? "Yes" : "No");
      
      if (orderByFirstMatch) {
        // Use the order we found with findFirst
        const productDetails = await getProductDetails(orderByFirstMatch.items as string[]);
        
        const formattedOrder = {
          ...orderByFirstMatch,
          customerName: orderByFirstMatch.user.username,
          customerEmail: orderByFirstMatch.user.email,
          productDetails
        };
        
        return NextResponse.json({ message: formattedOrder, status: 200 });
      }
      
      return NextResponse.json(
        { error: "Order not found", status: 404 },
        { status: 404 }
      );
    }
    
    // Get product details for the order items
    const productDetails = await getProductDetails(order.items as string[]);
    
    // Format the order response with additional details
    const formattedOrder = {
      ...order,
      customerName: order.user.username,
      customerEmail: order.user.email,
      productDetails
    };

    return NextResponse.json({ message: formattedOrder, status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};

// Helper function to get product details
async function getProductDetails(itemIds: string[]) {
  let productDetails = [];
  if (itemIds && itemIds.length > 0) {
    try {
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: itemIds
          }
        }
      });
      
      productDetails = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }));
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }
  return productDetails;
}

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const orderId = params.id;
    const body = await req.json();
    const { status } = body;

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ message: updatedOrder, status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
}; 