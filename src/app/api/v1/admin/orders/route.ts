import { NextResponse } from "next/server";
import { getServerOrders } from "@/lib/api/server/orders-store";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: getServerOrders(),
  });
}
