import { NextResponse } from "next/server";
import {
  getServerOrders,
  ORDER_STATUSES,
  setServerOrders,
} from "@/lib/api/server/orders-store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = (await request.json()) as { status?: string };

  if (
    !body.status ||
    !ORDER_STATUSES.includes(
      body.status as (typeof ORDER_STATUSES)[number],
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid order status.",
      },
      { status: 400 },
    );
  }

  const orders = getServerOrders();
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return NextResponse.json(
      {
        success: false,
        message: "Order not found.",
      },
      { status: 404 },
    );
  }

  const updatedOrders = orders.map((item) =>
    item.id === id
      ? {
          ...item,
          status: body.status as typeof item.status,
        }
      : item,
  );

  setServerOrders(updatedOrders);

  return NextResponse.json({
    success: true,
    data: updatedOrders.find((item) => item.id === id),
  });
}