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
    console.log("[GET /api/order/[id]] Looking for order with ID:", orderId, "Type:", typeof orderId);
    
    if (!orderId || orderId === "null" || orderId === "undefined") {
      console.error("[GET /api/order/[id]] Invalid order ID received:", orderId);
      return NextResponse.json(
        { error: "Invalid order ID", status: 400, debug: { orderId, type: typeof orderId } },
        { status: 400 }
      );
    }
    
    // Add additional validation for MongoDB ObjectID format
    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
      console.error("[GET /api/order/[id]] Order ID is not a valid MongoDB ObjectID:", orderId);
      return NextResponse.json(
        { error: "Order ID format is invalid", status: 400, debug: { orderId } },
        { status: 400 }
      );
    }
  
    try {
      const basicOrder = await prisma.order.findFirst({
        where: {
          id: orderId,
        }
      });

      if (!basicOrder) {
        console.error(`[GET /api/order/[id]] Order not found with ID: ${orderId}`);
        
        // Try to get a list of recent orders for debugging
        const recentOrders = await prisma.order.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            createdAt: true
          }
        });
        
        console.log(`[GET /api/order/[id]] Recent orders for debugging:`, recentOrders);
        
        return NextResponse.json(
          { 
            error: "Order not found", 
            status: 404, 
            debug: { 
              orderId,
              recentOrders
            } 
          },
          { status: 404 }
        );
      }
      
      console.log(`[GET /api/order/[id]] Order found with ID: ${orderId}`);

 
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
            console.log(`[GET /api/order/[id]] Found user: ${userName}, ${userEmail}`);
          } else {
            console.log(`[GET /api/order/[id]] User not found for ID: ${basicOrder.userId}`);
          }
        } catch (userError) {
          console.error("[GET /api/order/[id]] Error fetching user:", userError);
        }
      }
      
      // Parse qpayUrl if it's a JSON string
      let parsedQpayUrl = basicOrder.qpayUrl;
      let extractedProductDetails: any[] = [];
      
      interface ExtendedQPayData {
        productDetails?: any[];
        qpayResponse?: any;
        [key: string]: any;
      }
      
      if (typeof basicOrder.qpayUrl === 'string') {
        try {
          const jsonData = JSON.parse(basicOrder.qpayUrl) as ExtendedQPayData;
          parsedQpayUrl = jsonData;
          
          // Check if this is our enhanced JSON structure with product details
          if (jsonData.productDetails && Array.isArray(jsonData.productDetails)) {
            console.log("Found product details in qpayUrl JSON:", jsonData.productDetails.length);
            extractedProductDetails = jsonData.productDetails;
            
            // If we have a qpayResponse field, that's the actual QPay data
            if (jsonData.qpayResponse) {
              parsedQpayUrl = jsonData.qpayResponse;
            }
          }
        } catch (e) {
          console.log("Failed to parse qpayUrl as JSON, using as-is:", e);
        }
      } else if (typeof basicOrder.qpayUrl === 'object' && basicOrder.qpayUrl !== null) {
        // It's already an object (Prisma might parse it automatically)
        const jsonData = basicOrder.qpayUrl as unknown as ExtendedQPayData;
        
        if (jsonData.productDetails && Array.isArray(jsonData.productDetails)) {
          console.log("Found product details in qpayUrl object:", jsonData.productDetails.length);
          extractedProductDetails = jsonData.productDetails;
          
          // If we have a qpayResponse field, that's the actual QPay data
          if (jsonData.qpayResponse) {
            parsedQpayUrl = jsonData.qpayResponse;
          }
        }
      }
      
      // Combine product details from both sources:
      // 1. First use any details stored in JSON (our new way)
      // 2. Then add any details from item ID lookup (original way)
      // This ensures backward compatibility
      let combinedProductDetails = [...extractedProductDetails];
      
      // If we still don't have product details, try to look them up by item IDs
      if (combinedProductDetails.length === 0) {
        const lookupProductDetails = await getProductDetails(Array.isArray(basicOrder.items) ? basicOrder.items : []);
        if (lookupProductDetails.length > 0) {
          combinedProductDetails = lookupProductDetails;
        }
      }
      
      console.log(`Combined product details: ${combinedProductDetails.length} items`);
      
      const formattedOrder = {
        ...basicOrder,
        customerName: userName,
        customerEmail: userEmail,
        productDetails: combinedProductDetails,
        qpayUrl: parsedQpayUrl,
        items: Array.isArray(basicOrder.items) ? basicOrder.items : []
      };

      return NextResponse.json({ message: formattedOrder, status: 200 });
    } catch (dbError) {
      console.error("[GET /api/order/[id]] Database error:", dbError);
      return NextResponse.json(
        { error: "Database query error", status: 500, debug: { message: (dbError as Error).message } },
        { status: 500 }
      );
    }
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
  
  console.log("Received itemIds:", itemIds);
  console.log("Type of itemIds:", typeof itemIds);
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    console.log("No valid item IDs provided");
    return productDetails;
  }
  
  // Ensure all IDs are strings
  const validIds = itemIds
    .filter(id => id && (typeof id === 'string' || typeof id === 'number'))
    .map(id => String(id));
    
  console.log("Valid product IDs for lookup:", validIds);
  
  if (validIds.length === 0) {
    console.log("No valid product IDs after filtering");
    return productDetails;
  }

  try {
    // Fetch products by ID
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: validIds
        }
      }
    });
    
    console.log(`Found ${products.length} products out of ${validIds.length} IDs`);
    
    if (products.length === 0) {
      // If no products found, try to lookup by productId field in case the schema is different
      console.log("Trying alternate lookup by productId field");
      const productsAlt = await prisma.product.findMany({});
      
      // Match products manually by comparing with the validIds
      const matchedProducts = productsAlt.filter(product => {
        // Access any to avoid TypeScript errors since productId might not exist on all products
        const productAny = product as any;
        return validIds.includes(product.id) || 
               (productAny.productId && validIds.includes(productAny.productId)) || 
               (productAny.productId && validIds.includes(String(productAny.productId)));
      });
      
      console.log(`Found ${matchedProducts.length} products via alternate lookup`);
      
      if (matchedProducts.length > 0) {
        productDetails = matchedProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        }));
      }
    } else {
      productDetails = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }));
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
  
  console.log(`Returning ${productDetails.length} product details`);
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