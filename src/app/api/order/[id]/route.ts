import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    
    const orderId = params.id;
    console.log("Looking for order with ID:", orderId);
    
  
    const basicOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
      }
    });

    if (!basicOrder) {
      return NextResponse.json(
        { error: "Order not found", status: 404 },
        { status: 404 }
      );
    }

 
    let userName = "Unknown";
    let userEmail = "Unknown";
    
    if (basicOrder.userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: basicOrder.userId },
          select: { 
            username: true,
            email: true
          }
        });
        
        if (user) {
          userName = user.username;
          userEmail = user.email;
        }
      } catch (userError) {
        console.error("Error fetching user:", userError);
      }
    }
    

    const productDetails = await getProductDetails(basicOrder.items as string[]);
    
    const formattedOrder = {
      ...basicOrder,
      customerName: userName,
      customerEmail: userEmail,
      productDetails,
      qpayUrl: basicOrder.qpayUrl
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

async function getProductDetails(itemIds: string[]): Promise<ProductDetail[]> {
  let productDetails: ProductDetail[] = [];
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