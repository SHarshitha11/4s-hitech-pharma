"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getLastOrder,
  ORDER_STATUS_LABELS,
  type OrderRequest,
} from "@/lib/checkout";

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

function getStatusClasses(status: OrderRequest["status"]) {
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

export default function OrdersPage() {
  const [order, setOrder] = useState<OrderRequest | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrder(getLastOrder());
      setLoaded(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!loaded) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p role="status" className="text-sm text-gray-600">
            Loading orders...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Pharmacy Partner Portal
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            View your recent order request and track its current status.
          </p>
        </div>

        {!order ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900">
              No orders found
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Complete checkout to create your first order request.
            </p>

            <Link
              href="/pharmacy/products"
              className="mt-5 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Latest Order
                  </p>

                  <h2 className="mt-1 break-all text-lg font-bold text-gray-900">
                    {order.orderId}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={
                    "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold " +
                    getStatusClasses(order.status)
                  }
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Items
                </p>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  {order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  )}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Total quantity
                </p>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Payment
                </p>

                <p className="mt-2 text-sm font-bold text-gray-900">
                  {order.paymentTerm === "CREDIT"
                    ? "Credit Terms"
                    : "Prepaid"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Selected payment term
                </p>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Order Total
                </p>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  {formatCurrency(order.total)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Includes demo tax
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  href={`/pharmacy/orders/${encodeURIComponent(order.orderId)}`}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  View Order Details
                </Link>

                <Link
                  href={`/pharmacy/orders/${encodeURIComponent(order.orderId)}`}
                  className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}