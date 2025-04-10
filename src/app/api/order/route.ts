import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import QPAY from "@togtokh.dev/qpay";

interface CartItem {
  id: string;
  quantity?: number;
}

// QPAY credentials
const username = process.env.QPAY_USERNAME || "AZJARGAL_B";
const password = process.env.QPAY_PASSWORD || "wxDGviN5";
const invoice_code = process.env.QPAY_INVOICE_CODE || "AZJARGAL_B_INVOICE";

export const GET = async () => {
    try {
      const order = await prisma.order.findMany();
      return NextResponse.json({ message: order, status: 200 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
  };

// Helper function to get product details
const getProductDetails = async (itemIds: string[]) => {
  try {
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return [];
    }
    
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: itemIds
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true
      }
    });
    
    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }));
  } catch (error) {
    console.error("Error fetching product details:", error);
    return [];
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    
    const { 
      totalPrice, 
      items, 
      paymentMethod, 
      shippingAddress, 
      productDetails, 
      userId 
    } = body;
    
    console.log("[POST /api/order] Creating order with:", {
      totalPrice,
      paymentMethod,
      itemsCount: items?.length || 0,
      shippingAddress: !!shippingAddress,
      userId: !!userId,
      productDetailsCount: productDetails?.length || 0
    });

    if (!totalPrice) {
      return NextResponse.json(
        { error: "Total price is required", status: 400 },
        { status: 400 }
      );
    }

    let qpayInvoice: any;
    let qpayUrl = null;
    
    if (paymentMethod === "qpay") {
      try {
        console.log("[POST /api/order] Creating QPay invoice");
        
        const orderRef = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pineshop-seven.vercel.app";
        const callbackUrl = `${baseUrl}/api/qpay/callback`;
        
        await QPAY.auth.TOKEN({
          username,
          password,
          invoice_code,
        });
        
        console.log("[POST /api/order] QPAY Authentication successful");

        await QPAY.auth.REFRESH();
        console.log("[POST /api/order] QPAY Authentication refreshed");
        
        qpayInvoice = await QPAY.invoice.CREATE({
          invoice_code,
          sender_invoice_no: orderRef,
          sender_branch_code: "BRANCH1",
          invoice_receiver_code: "terminal",
          invoice_description: "Payment for Pine Shop order",
          invoice_receiver_data: {
            register: "UZ96021105",
            name: "Customer",
            email: "customer@example.com",
            phone: "12345678"
          },
          enable_expiry: false,
          allow_partial: false,
          minimum_amount: null,
          allow_exceed: false,
          maximum_amount: null,
          amount: totalPrice,
          callback_url: callbackUrl,
          sender_staff_code: "online",
          note: null,
        });
        
        console.log("[POST /api/order] QPay Invoice created:", JSON.stringify(qpayInvoice, null, 2));
        
        // Check for QPay response data
        if (qpayInvoice && qpayInvoice.data && qpayInvoice.data.invoice_id) {
          const invoiceId = qpayInvoice.data.invoice_id;
          console.log(`QPAY invoice_id: ${invoiceId}`);
          
          try {
         
            
            let qrImage = qpayInvoice.data.qr_image || null;
            let qrText = qpayInvoice.data.qr_text || null;
            
         
            if (!qrImage) {
              const paymentCheck = await QPAY.payment.CHECK(invoiceId);
              console.log("[POST /api/order] Payment check for QR:", JSON.stringify(paymentCheck, null, 2));
              
           
            }
            
            // Combine all data for the response
            qpayInvoice = {
              ...qpayInvoice,
              data: {
                ...qpayInvoice.data,
                qr_image: qrImage,
                qr_text: qrText,
                urls: qpayInvoice.data.urls || []
              }
            };
          } catch (qrError) {
            console.error("[POST /api/order] Error getting QR data:", qrError);
          }
        }
        
        qpayUrl = qpayInvoice ? JSON.stringify(qpayInvoice) : null;
      } catch (qpayError) {
        console.error("[POST /api/order] Error creating QPay invoice:", qpayError);
      }
    }

    const productData = Array.isArray(productDetails) && productDetails.length > 0 
      ? productDetails 
      : Array.isArray(items) && items.length > 0 
        ? await getProductDetails(items) 
        : [];
        
    console.log(`[POST /api/order] Collected ${productData.length} product details to save`);

 
    let orderJson = null;
    
    if (paymentMethod === "qpay") {
    
      const fullOrderData = {
        qpayResponse: qpayInvoice,
        productDetails: productData
      };
      orderJson = JSON.stringify(fullOrderData);
    } else {
      orderJson = JSON.stringify({ productDetails: productData });
    }

    const order = await prisma.order.create({
      data: {
        totalPrice,
        items: items || [],
        paymentMethod,
        status: "pending",
        paymentStatus: "pending", 
        shippingAddress,
        qpayUrl: orderJson, 
        userId,
      },
    });

    console.log("[POST /api/order] Order created successfully:", order.id);

    return NextResponse.json({ 
      message: {
        ...order,
        productDetails: productData, 
        qpayInvoice, 
      }, 
      status: 201 
    }, { status: 201 });
    
  } catch (error) {
    console.error("[POST /api/order] Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order", status: 500 },
      { status: 500 }
    );
  }
};