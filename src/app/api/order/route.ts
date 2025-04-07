import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import QPAY from "@togtokh.dev/qpay";



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
  
      // Step 1: Authenticate to QPay
      await QPAY.auth.TOKEN({
        username,
        password,
        invoice_code
      });
  
      await QPAY.auth.REFRESH();
  
      const invoice = await QPAY.invoice.CREATE({
        invoice_code,
        sender_invoice_no: "123455678",
        invoice_receiver_code: "83",
        sender_branch_code: "BRANCH1",
        invoice_description: "Order No1311 200.00",
        enable_expiry: false,
        allow_partial: false,
        minimum_amount: null,
        allow_exceed: false,
        maximum_amount: null,
        amount: 200,
        callback_url: "https://pineshop.vercel.app/order-confirmation?orderId=67f37eb3d4cc67a655d64845",
        sender_staff_code: "online",
        note: null,
        invoice_receiver_data: {
          register: "",
          name: "Ganzul",
          email: "test@gmail.com",
          phone: "88614450",
        },
        lines: [
          {
            tax_product_code: "6401",
            line_description: " Order No1311 200.00 .",
            line_quantity: "1.00",
            line_unit_price: totalPrice.toFixed(2),
            note: "-.",
            discounts: [
              {
                discount_code: "NONE",
                description: " discounts",
                amount: 10,
                note: " discounts",
              },
            ],
            surcharges: [
              {
                surcharge_code: "NONE",
                description: "Хүргэлтийн зардал",
                amount: 5000,
                note: " Хүргэлт",
              },
            ],
            taxes: [
              {
                tax_code: "VAT",
                description: "НӨАТ",
                amount: 20,
                note: " НӨАТ",
              },
            ],
          },
        ],
      });
  
      // Step 3: Save Order with QPay URL
      const order = await prisma.order.create({
        data: {
          userId,
          totalPrice,
          items,
          shippingAddress,
          paymentMethod,
          qpayUrl: invoice
        },
      });
  
      return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (error) {
      console.error("❌ Failed to create order:", error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }
  }