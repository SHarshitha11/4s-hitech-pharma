import { NextResponse } from "next/server";
import {
  DELIVERY_STATUSES,
  getServerOrders,
  setServerOrders,
} from "@/lib/api/server/orders-store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: Params,
) {
  const { id } = await params;

  const body = (await request.json()) as {
    deliveryPartner?: string;
    deliveryPerson?: string;
    trackingNumber?: string;
    dispatchDate?: string;
    expectedDelivery?: string;
    status?: string;
  };

  if (
    !body.deliveryPartner ||
    !body.deliveryPerson ||
    !body.trackingNumber ||
    !body.status ||
    !DELIVERY_STATUSES.includes(
      body.status as (typeof DELIVERY_STATUSES)[number],
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Delivery partner, delivery person, tracking number and status are required.",
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

  const deliveryStatus =
    body.status as (typeof DELIVERY_STATUSES)[number];

  const updatedOrderStatus =
    deliveryStatus === "DELIVERED"
      ? "DELIVERED"
      : deliveryStatus === "OUT_FOR_DELIVERY"
        ? "OUT_FOR_DELIVERY"
        : deliveryStatus === "ASSIGNED"
          ? "DISPATCHED"
          : order.status;

  const updatedOrders = orders.map((item) =>
    item.id === id
      ? {
          ...item,
          status: updatedOrderStatus,
          delivery: {
            id: item.delivery?.id ?? `DEL-${item.id}`,
            orderId: item.id,
            deliveryPartner: body.deliveryPartner!,
            deliveryPerson: body.deliveryPerson!,
            trackingNumber: body.trackingNumber!,
            dispatchDate:
              body.dispatchDate || new Date().toISOString(),
            expectedDelivery: body.expectedDelivery || "",
            status: deliveryStatus,
          },
        }
      : item,
  );

  setServerOrders(updatedOrders);

  return NextResponse.json({
    success: true,
    data: updatedOrders.find((item) => item.id === id),
  });
}