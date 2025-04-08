
import { NextResponse } from "next/server";
import type { NextResponse as NextResponseType } from "next/server";
import QPAY from "@togtokh.dev/qpay";


const username = process.env.QPAY_USERNAME || "AZJARGAL_B";
const password = process.env.QPAY_PASSWORD || "wxDGviN5";
const invoice_code = process.env.QPAY_INVOICE_CODE || "AZJARGAL_B_INVOICE";

export async function POST(req: Request
    
) {
    
  try {
    const body = await req.json();
    const { orderId } = body;

    await QPAY.auth.TOKEN({
      username,
      password,
      invoice_code,
    });

    console.log("Authentication successful.");

 
    await QPAY.auth.REFRESH();
    console.log("Authentication refreshed successfully.");

    const checkPayment = await QPAY.payment.CHECK(orderId);

    return NextResponse.json({ success: true, checkPayment });

  } catch (error) {
    console.error("QPAY error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
