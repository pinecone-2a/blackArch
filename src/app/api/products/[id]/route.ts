import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

  return new Response(JSON.stringify({ message: `Product ID: ${id}` }), {
    headers: { "Content-Type": "application/json" },
  });
}
}
