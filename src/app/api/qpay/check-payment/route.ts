import { NextResponse } from "next/server";
import QPAY from "@togtokh.dev/qpay";
import prisma from "@/lib/connect";
const username = process.env.QPAY_USERNAME || "AZJARGAL_B";
const password = process.env.QPAY_PASSWORD || "wxDGviN5";
const invoice_code = process.env.QPAY_INVOICE_CODE || "AZJARGAL_B_INVOICE";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, invoiceId } = body;

    if (!invoiceId) {
      console.error("Missing invoiceId parameter");
      return NextResponse.json(
        { success: false, error: "Missing invoiceId parameter" },
        { status: 400 }
      );
    }

    try {
      await QPAY.auth.TOKEN({
        username,
        password,
        invoice_code,
      });

      console.log("Authentication successful.");

      await QPAY.auth.REFRESH();
      console.log("Authentication refreshed successfully.");

      const checkPayment = await QPAY.payment.CHECK(invoiceId);
      console.log("Payment check response:", checkPayment);

      if (checkPayment && checkPayment.success === true && orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "Paid" },
          });
          console.log(`Order ${orderId} marked as paid`);
        } catch (dbError) {
          console.error("Database update error:", dbError);
        }
      }

      return NextResponse.json({ 
        success: true, 
        paid: checkPayment && checkPayment.success === true, 
        checkPayment 
      });
    } catch (qpayError) {
      console.error("QPAY service error:", qpayError);
      return NextResponse.json(
        { 
          success: false, 
          error: "QPay service error", 
          details: qpayError instanceof Error ? qpayError.message : String(qpayError) 
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
