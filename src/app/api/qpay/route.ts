// app/api/create-invoice/route.ts
import { NextResponse } from "next/server";
import QPAY from "@togtokh.dev/qpay";


const username = process.env.QPAY_USERNAME || "AZJARGAL_B";
const password = process.env.QPAY_PASSWORD || "wxDGviN5";
const invoice_code = process.env.QPAY_INVOICE_CODE || "AZJARGAL_B_INVOICE";

export async function POST() {
  try {
  
    await QPAY.auth.TOKEN({
      username,
      password,
      invoice_code,
    });

    console.log("Authentication successful.");

 
    await QPAY.auth.REFRESH();
    console.log("Authentication refreshed successfully.");


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
        register: "UZ96021105",
        name: "Ganzul",
        email: "test@gmail.com",
        phone: "88614450",
      },
      lines: [
        {
          tax_product_code: "6401",
          line_description: " Order No1311 200.00 .",
          line_quantity: "1.00",
          line_unit_price: "200.00",
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
              amount: 10,
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

    console.log("Invoice created:", invoice);

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("QPAY error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
