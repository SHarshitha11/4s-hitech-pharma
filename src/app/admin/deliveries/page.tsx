"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type DeliveryStatus,
  type ManagedOrder,
} from "@/lib/order-delivery";
import {
  getAdminOrders,
  updateAdminDelivery,
} from "@/lib/api/client";

const DELIVERY_STATUSES: DeliveryStatus[] = [
  "READY_FOR_DISPATCH",
  "ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function formatStatus(status: DeliveryStatus) {
  return status.replaceAll("_", " ");
}

function statusClass(status: DeliveryStatus) {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "OUT_FOR_DELIVERY":
      return "bg-blue-100 text-blue-700";
    case "ASSIGNED":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDateInput(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

export default function AdminDeliveriesPage() {
  const [orders, setOrders] = useState<ManagedOrder[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | DeliveryStatus>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<ManagedOrder | null>(
    null,
  );

  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [deliveryStatus, setDeliveryStatus] =
    useState<DeliveryStatus>("READY_FOR_DISPATCH");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDeliveries() {
      setLoading(true);
      setError(null);

      try {
        const apiOrders = await getAdminOrders();

        if (active) {
          setOrders(apiOrders);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load deliveries.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDeliveries();

    return () => {
      active = false;
    };
  }, []);

  const deliveries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (!order.delivery) {
        return false;
      }

      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.pharmacyName.toLowerCase().includes(query) ||
        order.invoiceNumber.toLowerCase().includes(query) ||
        order.delivery.trackingNumber.toLowerCase().includes(query) ||
        order.delivery.deliveryPartner.toLowerCase().includes(query) ||
        order.delivery.deliveryPerson.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" || order.delivery.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  async function refreshDeliveries() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const apiOrders = await getAdminOrders();
      setOrders(apiOrders);
      setSuccess("Delivery data refreshed successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh delivery data.",
      );
    } finally {
      setLoading(false);
    }
  }

  function openDelivery(order: ManagedOrder) {
    setSelectedOrder(order);

    setDeliveryPartner(order.delivery?.deliveryPartner ?? "");
    setDeliveryPerson(order.delivery?.deliveryPerson ?? "");
    setTrackingNumber(order.delivery?.trackingNumber ?? "");
    setDispatchDate(toDateInput(order.delivery?.dispatchDate));
    setExpectedDelivery(toDateInput(order.delivery?.expectedDelivery));
    setDeliveryStatus(order.delivery?.status ?? "READY_FOR_DISPATCH");

    setError(null);
    setSuccess(null);
  }

  function closeDelivery() {
    setSelectedOrder(null);
    setDeliveryPartner("");
    setDeliveryPerson("");
    setTrackingNumber("");
    setDispatchDate("");
    setExpectedDelivery("");
    setDeliveryStatus("READY_FOR_DISPATCH");
  }

  async function saveDelivery() {
    if (!selectedOrder) return;

    if (!deliveryPartner.trim()) {
      setError("Delivery partner is required.");
      return;
    }

    if (!deliveryPerson.trim()) {
      setError("Delivery person is required.");
      return;
    }

    if (!trackingNumber.trim()) {
      setError("Tracking number is required.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedOrder = await updateAdminDelivery(
        selectedOrder.id,
        {
          deliveryPartner: deliveryPartner.trim(),
          deliveryPerson: deliveryPerson.trim(),
          trackingNumber: trackingNumber.trim(),
          dispatchDate: dispatchDate
            ? new Date(dispatchDate).toISOString()
            : undefined,
          expectedDelivery: expectedDelivery
            ? new Date(expectedDelivery).toISOString()
            : undefined,
          status: deliveryStatus,
        },
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );

      setSelectedOrder(updatedOrder);
      setSuccess("Delivery details saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save delivery details.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Delivery Management
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage delivery assignment, tracking and status through the API.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshDeliveries}
          disabled={loading}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Deliveries</p>
          <p className="mt-1 text-2xl font-bold">{deliveries.length}</p>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Out for Delivery</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {
              orders.filter(
                (order) =>
                  order.delivery?.status === "OUT_FOR_DELIVERY",
              ).length
            }
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {
              orders.filter(
                (order) => order.delivery?.status === "DELIVERED",
              ).length
            }
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, pharmacy, tracking or partner..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as "ALL" | DeliveryStatus)
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="ALL">All statuses</option>

            {DELIVERY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  Pharmacy
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  Partner
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  Tracking
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  Expected
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Loading deliveries...
                  </td>
                </tr>
              ) : deliveries.length > 0 ? (
                deliveries.map((order) => {
                  const delivery = order.delivery!;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">
                        {order.id}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {order.pharmacyName}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        <div>{delivery.deliveryPartner}</div>
                        <div className="text-xs text-gray-500">
                          {delivery.deliveryPerson}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {delivery.trackingNumber}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {formatDate(delivery.expectedDelivery)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                            delivery.status,
                          )}`}
                        >
                          {formatStatus(delivery.status)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => openDelivery(order)}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No delivery records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold">
                  Delivery Assignment
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedOrder.id} · {selectedOrder.pharmacyName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDelivery}
                className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Delivery Partner
                </label>

                <input
                  value={deliveryPartner}
                  onChange={(event) =>
                    setDeliveryPartner(event.target.value)
                  }
                  placeholder="4S Express"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Delivery Person
                </label>

                <input
                  value={deliveryPerson}
                  onChange={(event) =>
                    setDeliveryPerson(event.target.value)
                  }
                  placeholder="Ravi Kumar"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tracking Number
                </label>

                <input
                  value={trackingNumber}
                  onChange={(event) =>
                    setTrackingNumber(event.target.value)
                  }
                  placeholder="4SHP-TRK-1004"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Delivery Status
                </label>

                <select
                  value={deliveryStatus}
                  onChange={(event) =>
                    setDeliveryStatus(
                      event.target.value as DeliveryStatus,
                    )
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm"
                >
                  {DELIVERY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Dispatch Date
                </label>

                <input
                  type="date"
                  value={dispatchDate}
                  onChange={(event) =>
                    setDispatchDate(event.target.value)
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Expected Delivery
                </label>

                <input
                  type="date"
                  value={expectedDelivery}
                  onChange={(event) =>
                    setExpectedDelivery(event.target.value)
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div className="md:col-span-2 rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Delivery Address
                </p>

                <p className="mt-1 text-sm font-medium">
                  {selectedOrder.deliveryAddress}
                </p>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeDelivery}
                  className="rounded-md border px-4 py-2 text-sm"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveDelivery}
                  disabled={saving}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Delivery"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}