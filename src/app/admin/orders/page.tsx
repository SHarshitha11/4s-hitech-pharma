"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  formatOrderStatus,
  getNextOrderStatus,
  getOrders,
  saveOrders,
  type ManagedOrder,
  type OrderStatus,
} from "@/lib/order-delivery";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "DISPATCHED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(getOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<ManagedOrder | null>(null);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.pharmacyName.toLowerCase().includes(query) ||
        order.contactPerson.toLowerCase().includes(query) ||
        order.invoiceNumber.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  function updateStatus(orderId: string, status: OrderStatus) {
    const nextOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order,
    );

    setOrders(nextOrders);
    saveOrders(nextOrders);

    setSelectedOrder((current) =>
      current && current.id === orderId
        ? { ...current, status }
        : current,
    );
  }

  function advanceOrder(order: ManagedOrder) {
    const nextStatus = getNextOrderStatus(order.status);

    if (nextStatus) {
      updateStatus(order.id, nextStatus);
    }
  }

  function statusVariant(status: OrderStatus) {
    if (status === "DELIVERED") return "success" as const;
    if (status === "CANCELLED" || status === "RETURNED") {
      return "danger" as const;
    }
    if (status === "PENDING" || status === "RETURN_REQUESTED") {
      return "warning" as const;
    }
    return "default" as const;
  }

  function invoiceAction(order: ManagedOrder) {
    window.alert(`Invoice ${order.invoiceNumber} ready for ${order.id}.`);
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="text-sm text-slate-600">
          Review, process and track pharmacy orders.
        </p>
      </div>

      <Card>
        <div className="grid gap-3 p-4 md:grid-cols-3">
          <input
            aria-label="Search orders"
            placeholder="Search order, pharmacy or invoice..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          />

          <select
            aria-label="Order status filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatOrderStatus(status)}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-md bg-slate-50 px-3 text-sm">
            Orders:
            <strong className="ml-1">{filteredOrders.length}</strong>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Pharmacy</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3">{order.pharmacyName}</td>
                  <td className="px-4 py-3">{order.orderDate}</td>
                  <td className="px-4 py-3">Rs. {order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">{order.paymentStatus}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(order.status)}>
                      {formatOrderStatus(order.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </Button>

                      {getNextOrderStatus(order.status) && (
                        <Button onClick={() => advanceOrder(order)}>
                          Next Status
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => invoiceAction(order)}
                      >
                        Invoice
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={
          selectedOrder
            ? `Order ${selectedOrder.id}`
            : "Order Details"
        }
        description={
          selectedOrder
            ? `${selectedOrder.pharmacyName} · ${selectedOrder.orderDate}`
            : undefined
        }
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <strong>Contact:</strong> {selectedOrder.contactPerson}
              </div>
              <div>
                <strong>Payment:</strong> {selectedOrder.paymentStatus}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {formatOrderStatus(selectedOrder.status)}
              </div>
              <div>
                <strong>Invoice:</strong> {selectedOrder.invoiceNumber}
              </div>
              <div className="md:col-span-2">
                <strong>Delivery Address:</strong>{" "}
                {selectedOrder.deliveryAddress}
              </div>
            </div>

            <div>
              <h2 className="mb-2 font-semibold">Products</h2>

              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 rounded-md border p-3 text-sm md:grid-cols-5"
                  >
                    <span>{item.productName}</span>
                    <span>{item.productCode}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Rs. {item.price}</span>
                    <span>Rs. {item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2 border-t pt-4 text-sm md:grid-cols-3">
              <div>Subtotal: Rs. {selectedOrder.subtotal.toFixed(2)}</div>
              <div>Tax: Rs. {selectedOrder.tax.toFixed(2)}</div>
              <div className="font-semibold">
                Total: Rs. {selectedOrder.total.toFixed(2)}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              {getNextOrderStatus(selectedOrder.status) && (
                <Button onClick={() => advanceOrder(selectedOrder)}>
                  Move to{" "}
                  {formatOrderStatus(
                    getNextOrderStatus(selectedOrder.status)!,
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => invoiceAction(selectedOrder)}
              >
                Generate Invoice
              </Button>

              <Button
                variant="outline"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

