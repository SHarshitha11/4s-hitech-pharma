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

export default function OrderSuccessPage() {
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
        <div className="mx-auto max-w-3xl">
          <p role="status" className="text-sm text-gray-600">
            Loading order confirmation...
          </p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Order Confirmation
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              No recent order is available in this session.
            </p>

            <Link
              href="/pharmacy/products"
              className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
              ✓
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-green-700">
              Order Confirmed
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Your order request has been submitted
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Keep the Order ID below for future reference and tracking.
            </p>
          </div>

          <div className="mt-7 rounded-xl bg-gray-50 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-gray-600">
                Order ID
              </span>

              <span className="break-all text-sm font-bold text-gray-900 sm:text-right">
                {order.orderId}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-600">
                Status
              </span>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-600">
                Items
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                )}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-600">
                Total
              </span>

              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/pharmacy/orders/${encodeURIComponent(order.orderId)}`}
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Track Order
            </Link>

            <Link
              href="/pharmacy/orders"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              View Orders
            </Link>

            <Link
              href="/pharmacy/products"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}