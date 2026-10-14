"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  formatInvoiceCurrency,
  getInvoices,
  getInvoiceTotal,
  type InvoiceStatus,
} from "@/lib/invoices";

const statusOptions: Array<"ALL" | InvoiceStatus> = [
  "ALL",
  "PAID",
  "PENDING",
  "OVERDUE",
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | InvoiceStatus>("ALL");
  const [date, setDate] = useState("");

  const invoices = useMemo(() => getInvoices(), []);

  const filteredInvoices = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !searchValue ||
        invoice.id.toLowerCase().includes(searchValue) ||
        invoice.orderId.toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "ALL" || invoice.status === status;

      const matchesDate =
        !date || invoice.invoiceDate === date;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [date, invoices, search, status]);

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Pharmacy Partner Portal
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Invoices & Documents
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Access invoice records and applicable order documents from your
            pharmacy account.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="invoice-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search Invoices
              </label>
              <input
                id="invoice-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Invoice ID or Order ID"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="invoice-status"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Invoice Status
              </label>
              <select
                id="invoice-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "ALL" | InvoiceStatus)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="ALL">All Statuses</option>
                {statusOptions.slice(1).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="invoice-date"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Invoice Date
              </label>
              <input
                id="invoice-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Invoice
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {invoice.orderId}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {invoice.invoiceDate}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatInvoiceCurrency(getInvoiceTotal(invoice))}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link
                        href={`/pharmacy/invoices/${invoice.id}`}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                      >
                        View Invoice
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-gray-500"
                    >
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
