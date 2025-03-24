import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

interface Context {
  params: { id: string };
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = context.params; // ✅ Extract params from context

    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
