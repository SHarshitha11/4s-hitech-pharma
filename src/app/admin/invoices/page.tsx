"use client";

import { useMemo, useState } from "react";
import { getOrders, type ManagedOrder } from "@/lib/order-delivery";

function formatCurrency(value: number) {
  return `Rs. ${value.toFixed(2)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPaymentStatusClass(status: string) {
  if (status === "PAID" || status === "AUTHORIZED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "FAILED" || status === "REFUNDED") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function AdminInvoicesPage() {
  const orders = getOrders();

  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ManagedOrder | null>(
    null,
  );

  const invoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      return (
        order.invoiceNumber.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.pharmacyName.toLowerCase().includes(query)
      );
    });
  }, [orders, search]);

  function printInvoice(order: ManagedOrder) {
    const invoiceWindow = window.open(
      "",
      "_blank",
      "width=900,height=800",
    );

    if (!invoiceWindow) {
      window.alert("Please allow pop-ups to print the invoice.");
      return;
    }

    const itemRows = order.items
      .map(
        (item) => `
          <tr>
            <td>${item.productName}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${item.price.toFixed(2)}</td>
            <td>Rs. ${item.total.toFixed(2)}</td>
          </tr>
        `,
      )
      .join("");

    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${order.invoiceNumber}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 32px;
              color: #111827;
              background: #ffffff;
            }

            .invoice {
              max-width: 900px;
              margin: 0 auto;
            }

            .header {
              display: flex;
              justify-content: space-between;
              gap: 24px;
              padding-bottom: 20px;
              margin-bottom: 24px;
              border-bottom: 2px solid #111827;
            }

            .company h1 {
              margin: 0 0 6px;
              font-size: 24px;
            }

            .company p,
            .invoice-meta p {
              margin: 4px 0;
              color: #4b5563;
            }

            .invoice-meta {
              text-align: right;
            }

            .invoice-meta h2 {
              margin: 0 0 8px;
              font-size: 20px;
            }

            .section {
              margin-bottom: 24px;
            }

            .section h2 {
              margin: 0 0 8px;
              font-size: 14px;
              text-transform: uppercase;
            }

            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
            }

            .details p {
              margin: 5px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th,
            td {
              padding: 10px;
              text-align: left;
              border: 1px solid #d1d5db;
            }

            th {
              background: #f3f4f6;
            }

            .summary {
              width: 320px;
              margin-left: auto;
              margin-top: 20px;
            }

            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }

            .summary-row.total {
              padding-top: 12px;
              margin-top: 8px;
              border-top: 2px solid #111827;
              font-size: 18px;
              font-weight: 700;
            }

            .footer {
              margin-top: 40px;
              padding-top: 16px;
              border-top: 1px solid #d1d5db;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }

            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>

        <body>
          <div class="invoice">

            <div class="header">
              <div class="company">
                <h1>4S HITECH PHARMA</h1>
                <p>Pharmaceutical Distribution Platform</p>
                <p>Wholesale Pharmacy Management</p>
              </div>

              <div class="invoice-meta">
                <h2>INVOICE</h2>
                <p>
                  <strong>Invoice:</strong>
                  ${order.invoiceNumber}
                </p>
                <p>
                  <strong>Order:</strong>
                  ${order.id}
                </p>
                <p>
                  <strong>Date:</strong>
                  ${formatDate(order.orderDate)}
                </p>
              </div>
            </div>

            <div class="section details">
              <div>
                <h2>Bill To</h2>
                <p>
                  <strong>${order.pharmacyName}</strong>
                </p>
                <p>${order.contactPerson}</p>
                <p>${order.deliveryAddress}</p>
              </div>

              <div>
                <h2>Order Information</h2>
                <p>
                  <strong>Payment Status:</strong>
                  ${order.paymentStatus}
                </p>
                <p>
                  <strong>Order Status:</strong>
                  ${order.status}
                </p>
              </div>
            </div>

            <div class="section">
              <h2>Order Items</h2>

              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </div>

            <div class="summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatCurrency(order.subtotal)}</span>
              </div>

              <div class="summary-row">
                <span>Tax</span>
                <span>${formatCurrency(order.tax)}</span>
              </div>

              <div class="summary-row total">
                <span>Total</span>
                <span>${formatCurrency(order.total)}</span>
              </div>
            </div>

            <div class="footer">
              <p>
                Thank you for doing business with 4S HITECH PHARMA.
              </p>

              <p>
                This is a system-generated invoice.
              </p>
            </div>

          </div>
        </body>
      </html>
    `);

    invoiceWindow.document.close();
    invoiceWindow.focus();

    window.setTimeout(() => {
      invoiceWindow.print();
    }, 300);
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Invoice Management
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          View, search and print invoices generated for pharmacy orders.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <label
          htmlFor="invoice-search"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Search invoices
        </label>

        <input
          id="invoice-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by invoice number, order ID or pharmacy..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Invoice
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Order
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Pharmacy
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Payment
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Total
                </th>

                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {invoices.length > 0 ? (
                invoices.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {order.invoiceNumber}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.id}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.pharmacyName}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(order.orderDate)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClass(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => printInvoice(order)}
                          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Invoice {selectedOrder.invoiceNumber}
                </h2>

                <p className="text-sm text-gray-500">
                  Order {selectedOrder.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Pharmacy Details
                  </h3>

                  <p className="text-sm font-medium text-gray-800">
                    {selectedOrder.pharmacyName}
                  </p>

                  <p className="text-sm text-gray-600">
                    {selectedOrder.contactPerson}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Invoice Details
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Invoice Number:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedOrder.invoiceNumber}
                      </span>
                    </p>

                    <p>
                      Order Date:{" "}
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedOrder.orderDate)}
                      </span>
                    </p>

                    <p>
                      Payment Status:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>

                    <p>
                      Order Status:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Order Items
                </h3>

                <div className="overflow-hidden rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                          Product
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                          Product Code
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                          Qty
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                          Price
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {item.productName}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.productCode}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.quantity}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatCurrency(item.price)}
                          </td>

                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="ml-auto max-w-sm space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => printInvoice(selectedOrder)}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}