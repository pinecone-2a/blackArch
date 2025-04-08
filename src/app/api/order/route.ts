import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import QPAY from "@togtokh.dev/qpay";

interface CartItem {
  id: string;
  quantity?: number;
}

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      totalPrice,
      items,
      shippingAddress,
      paymentMethod,
    } = body;

    // Generate a unique order ID
    const orderId = new ObjectId().toString();

    // If payment method is QPay, create invoice first
    let qpayInvoice = null;
    let qpayImageUrl = null;
    
    if (paymentMethod === 'qpay') {
      try {
        // Step 1: Authenticate to QPay
        await QPAY.auth.TOKEN({
          username,
          password,
          invoice_code
        });

        await QPAY.auth.REFRESH();

        qpayInvoice = await QPAY.invoice.CREATE({
          invoice_code,
          sender_invoice_no: orderId,
          invoice_receiver_code: "83",
          sender_branch_code: "BRANCH1",
          invoice_description: `Order ${orderId} ${totalPrice}`,
          enable_expiry: false,
          allow_partial: false,
          minimum_amount: null,
          allow_exceed: false,
          maximum_amount: null,
          amount: totalPrice,
          callback_url: `https://pineshop-6ynb6bkn0-chinguuns-projects-116e87ac.vercel.app/order-confirmation?orderId=${orderId}`,
          sender_staff_code: "online",
          note: null,
          invoice_receiver_data: {
            register: "",
            name: shippingAddress.name || "Customer",
            email: shippingAddress.email || "customer@example.com",
            phone: shippingAddress.phone || "00000000",
          },
          lines: [
            {
              tax_product_code: "6401",
              line_description: `Order ${orderId} ${totalPrice}`,
              line_quantity: "1.00",
              line_unit_price: totalPrice.toFixed(2),
              note: "-",
              discounts: [],
              surcharges: [],
              taxes: [],
            },
          ],
        });

        console.log("QPay invoice created:", JSON.stringify(qpayInvoice, null, 2));
        
        // Check if the QPay response contains bank URLs
        if (qpayInvoice && qpayInvoice.data && qpayInvoice.data.urls) {
          console.log(`QPay response includes ${qpayInvoice.data.urls.length} bank URLs`);
        } else {
          console.log("No bank URLs found in QPay response");
        }
        
        // Check for QR image
        if (qpayInvoice && qpayInvoice.data) {
          if (qpayInvoice.data.qr_image) {
            console.log("QPay response includes QR image");
            qpayImageUrl = qpayInvoice.data.qr_image;
          } else if (qpayInvoice.data.qr_text) {
            console.log("QPay response includes QR text");
            qpayImageUrl = qpayInvoice.data.qr_text;
          } else if (qpayInvoice.data.qPay_shortUrl) {
            console.log("QPay response includes short URL");
            qpayImageUrl = qpayInvoice.data.qPay_shortUrl;
          }
        }
        
        console.log("Extracted QPay URL:", qpayImageUrl);
      } catch (qpayError) {
        console.error("QPay error:", qpayError);
        return NextResponse.json({ 
          success: false, 
          error: "Failed to create QPay invoice" 
        }, { status: 500 });
      }
    }

    // Create the order with QPay URL if available
    const order = await prisma.order.create({
      data: {
        id: orderId,
        userId,
        totalPrice,
        items: (items as CartItem[])
          .filter((item): item is CartItem => 
            item !== null && 
            item !== undefined && 
            typeof item === 'object' && 
            'id' in item && 
            typeof item.id === 'string'
          )
          .map(item => item.id),
        status: 'pending',
        paymentMethod,
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip
        },
        // Store the full QPay response
        qpayUrl: qpayInvoice ? JSON.stringify(qpayInvoice) : null
      }
    });

    console.log("Order created:", order);

    return NextResponse.json({ 
      success: true, 
      order: { ...order } 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to create order:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}