"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getOrderById,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_SEQUENCE,
  type OrderRequest,
  type OrderStatus,
} from "@/lib/checkout";

type OrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
    case "RETURNED":
      return "bg-red-100 text-red-800";
    case "OUT_FOR_DELIVERY":
    case "DISPATCHED":
      return "bg-blue-100 text-blue-800";
    case "CONFIRMED":
    case "PROCESSING":
    case "PACKED":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}

function getTimelineDescription(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "Order request has been received and is awaiting confirmation.";
    case "CONFIRMED":
      return "Order has been confirmed for processing.";
    case "PROCESSING":
      return "Order is being prepared.";
    case "PACKED":
      return "Products have been packed and are ready for dispatch.";
    case "DISPATCHED":
      return "Order has been dispatched.";
    case "OUT_FOR_DELIVERY":
      return "Order is currently out for delivery.";
    case "DELIVERED":
      return "Order has been delivered successfully.";
    case "CANCELLED":
      return "Order has been cancelled.";
    case "RETURN_REQUESTED":
      return "A return request has been submitted.";
    case "RETURNED":
      return "Order has been returned.";
    default:
      return "Order status updated.";
  }
}

function isStatusCompleted(
  currentStatus: OrderStatus,
  timelineStatus: OrderStatus,
) {
  const currentIndex =
    ORDER_STATUS_SEQUENCE.indexOf(currentStatus);

  const timelineIndex =
    ORDER_STATUS_SEQUENCE.indexOf(timelineStatus);

  if (currentIndex === -1 || timelineIndex === -1) {
    return currentStatus === timelineStatus;
  }

  return timelineIndex <= currentIndex;
}

function getStatusDate(order: OrderRequest, status: OrderStatus) {
  if (status === order.status) {
    return formatDate(order.createdAt);
  }

  return "Pending";
}

export default function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const [order, setOrder] = useState<OrderRequest | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    let active = true;

    params.then((resolvedParams) => {
      if (!active) {
        return;
      }

      setOrderId(resolvedParams.orderId);

      const timer = window.setTimeout(() => {
        if (active) {
          setOrder(getOrderById(resolvedParams.orderId));
          setLoaded(true);
        }
      }, 0);

      return () => {
        window.clearTimeout(timer);
      };
    });

    return () => {
      active = false;
    };
  }, [params]);

  if (!loaded) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p role="status" className="text-sm text-gray-600">
            Loading order details...
          </p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-w-0 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Order Not Found
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              We could not find order {orderId}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              The order may not exist in the current session.
            </p>

            <Link
              href="/pharmacy/orders"
              className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/pharmacy/orders"
              className="text-sm font-semibold text-gray-600 underline"
            >
              ← Back to Orders
            </Link>

            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Order Details
            </p>

            <h1 className="mt-1 break-all text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {order.orderId}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <span
            className={
              "inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold " +
              getStatusClasses(order.status)
            }
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Order Tracking
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {getTimelineDescription(order.status)}
              </p>

              <div className="mt-6">
                {ORDER_STATUS_SEQUENCE.map((status, index) => {
                  const completed = isStatusCompleted(
                    order.status,
                    status,
                  );

                  const current =
                    order.status === status;

                  return (
                    <div
                      key={status}
                      className="relative flex gap-4"
                    >
                      {index <
                      ORDER_STATUS_SEQUENCE.length - 1 ? (
                        <div
                          className={
                            "absolute left-3 top-7 h-full w-px " +
                            (completed
                              ? "bg-gray-900"
                              : "bg-gray-200")
                          }
                        />
                      ) : null}

                      <div
                        className={
                          "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold " +
                          (completed
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 bg-white text-gray-400")
                        }
                      >
                        {completed ? "✓" : ""}
                      </div>

                      <div className="min-w-0 flex-1 pb-7">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p
                            className={
                              "text-sm font-bold " +
                              (current
                                ? "text-gray-900"
                                : completed
                                  ? "text-gray-700"
                                  : "text-gray-400")
                            }
                          >
                            {ORDER_STATUS_LABELS[status]}
                          </p>

                          <p className="text-xs text-gray-500">
                            {getStatusDate(order, status)}
                          </p>
                        </div>

                        <p
                          className={
                            "mt-1 text-xs leading-5 " +
                            (current
                              ? "text-gray-600"
                              : "text-gray-400")
                          }
                        >
                          {status === order.status
                            ? getTimelineDescription(status)
                            : "This tracking stage will update when the order progresses."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Order Items
              </h2>

              <div className="mt-5 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-3 rounded-lg border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-gray-900">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pack Size: {item.packSize}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.unitPrice)} each
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Delivery Information
              </h2>

              <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                <p className="font-semibold text-gray-900">
                  {order.deliveryAddress.businessName}
                </p>

                <p>{order.deliveryAddress.contactName}</p>
                <p>{order.deliveryAddress.phone}</p>
                <p>{order.deliveryAddress.addressLine1}</p>

                {order.deliveryAddress.addressLine2 ? (
                  <p>{order.deliveryAddress.addressLine2}</p>
                ) : null}

                <p>
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pinCode}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Order Notes
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {order.notes || "No additional notes."}
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">
                    Demo tax
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.tax)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Payment / Credit Terms
              </h2>

              <p className="mt-3 text-sm font-semibold text-gray-900">
                {order.paymentTerm === "CREDIT"
                  ? "Credit Terms"
                  : "Prepaid"}
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                {order.paymentTerm === "CREDIT"
                  ? "Credit eligibility and limits are subject to backend verification."
                  : "Live payment processing is not connected in this UI."}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Tracking Status
              </h2>

              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Current Status
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {ORDER_STATUS_LABELS[order.status]}
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-600">
                  {getTimelineDescription(order.status)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}