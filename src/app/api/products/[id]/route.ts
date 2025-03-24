import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  return new Response(JSON.stringify({ message: `Product ID: ${id}` }), {
    headers: { "Content-Type": "application/json" },
  });
}
