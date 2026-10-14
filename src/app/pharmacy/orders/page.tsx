"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getOrderHistory,
  ORDER_STATUS_LABELS,
  type OrderRequest,
  type OrderStatus,
} from "@/lib/checkout";

import {
  addToCart,
  type CartItem,
} from "@/lib/cart";

import {
  pharmacyProducts,
  type PharmacyProduct,
} from "@/features/pharmacy/products/catalogue";

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

function getProduct(productId: string): PharmacyProduct | undefined {
  return pharmacyProducts.find(
    (product) => product.id === productId,
  );
}

type ReorderResult = {
  added: string[];
  skipped: string[];
};

function reorderItems(order: OrderRequest): ReorderResult {
  const added: string[] = [];
  const skipped: string[] = [];

  order.items.forEach((orderItem) => {
    const product = getProduct(orderItem.productId);

    if (!product) {
      skipped.push(`${orderItem.productName} is unavailable.`);
      return;
    }

    if (
      product.stockStatus === "Out of Stock" ||
      product.stockQuantity < product.moq
    ) {
      skipped.push(
        `${orderItem.productName} is currently unavailable.`,
      );
      return;
    }

    const reorderQuantity = Math.min(
      orderItem.quantity,
      product.stockQuantity,
    );

    if (reorderQuantity < product.moq) {
      skipped.push(
        `${orderItem.productName} requires a minimum quantity of ${product.moq}.`,
      );
      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      packSize: product.packSize,
      quantity: reorderQuantity,
      priceLabel: "Customer-specific",
    };

    addToCart(cartItem);
    added.push(
      `${product.name} (${reorderQuantity})`,
    );
  });

  return { added, skipped };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | OrderStatus>("ALL");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrders(getOrderHistory());
      setLoaded(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      const matchesSearch =
        query.length === 0 ||
        order.orderId.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(query),
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  function handleReorder(order: OrderRequest) {
    const result = reorderItems(order);

    const parts: string[] = [];

    if (result.added.length > 0) {
      parts.push(
        `${result.added.length} item${result.added.length === 1 ? "" : "s"} added to cart.`,
      );
    }

    if (result.skipped.length > 0) {
      parts.push(
        `${result.skipped.length} item${result.skipped.length === 1 ? "" : "s"} skipped because they are unavailable or cannot meet the minimum order quantity.`,
      );
    }

    setMessage(
      parts.length > 0
        ? parts.join(" ")
        : "No items were eligible for reorder.",
    );
  }

  if (!loaded) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p role="status" className="text-sm text-gray-600">
            Loading order history...
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
            Order History
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Review previous orders, filter order history, and reorder eligible products.
          </p>
        </div>

        {message ? (
          <div
            role="status"
            className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
          >
            {message}
          </div>
        ) : null}

        {orders.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900">
              No orders found
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Complete checkout to create an order that will appear in your history.
            </p>

            <Link
              href="/pharmacy/products"
              className="mt-5 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="order-search"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Search Orders
                  </label>

                  <input
                    id="order-search"
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by Order ID or product"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="order-status"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Order Status
                  </label>

                  <select
                    id="order-status"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as "ALL" | OrderStatus,
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="ALL">All Statuses</option>

                    {Object.entries(ORDER_STATUS_LABELS).map(
                      ([status, label]) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                <span>
                  Showing {filteredOrders.length} of{" "}
                  {orders.length} orders
                </span>

                {(search || statusFilter !== "ALL") ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("ALL");
                    }}
                    className="font-semibold text-gray-700 underline"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <h2 className="text-lg font-bold text-gray-900">
                  No matching orders
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Try another search term or status filter.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredOrders.map((order) => (
                  <article
                    key={order.orderId}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-gray-200 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Order
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
                          {ORDER_STATUS_LABELS[
                            order.status
                          ]}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Products
                        </p>

                        <p className="mt-2 text-sm font-bold text-gray-900">
                          {order.items.length} product
                          {order.items.length === 1
                            ? ""
                            : "s"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {order.items
                            .reduce(
                              (sum, item) =>
                                sum + item.quantity,
                              0,
                            )}{" "}
                          total units
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
                          Total
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
                      <div className="space-y-2">
                        {order.items.map((item) => {
                          const product = getProduct(
                            item.productId,
                          );

                          const available =
                            product !== undefined &&
                            product.stockStatus !== "Out of Stock" &&
                            product.stockQuantity >= product.moq;

                          return (
                            <div
                              key={item.productId}
                              className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="min-w-0">
                                <p className="break-words text-sm font-semibold text-gray-900">
                                  {item.productName}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  Ordered quantity:{" "}
                                  {item.quantity}
                                </p>
                              </div>

                              <span
                                className={
                                  "w-fit rounded-full px-2.5 py-1 text-xs font-semibold " +
                                  (available
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800")
                                }
                              >
                                {available
                                  ? "Available to Reorder"
                                  : "Unavailable"}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Link
                          href={`/pharmacy/orders/${encodeURIComponent(order.orderId)}`}
                          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                        >
                          View Order Details
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleReorder(order)
                          }
                          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}