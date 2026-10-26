"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Period = "DAILY" | "WEEKLY" | "MONTHLY";

const SALES_DATA: Record<
  Period,
  { label: string; value: string; change: string }[]
> = {
  DAILY: [
    { label: "Today's Sales", value: "Rs. 28,450", change: "+8.4%" },
    { label: "Orders Today", value: "18", change: "+5.2%" },
    { label: "Average Order", value: "Rs. 1,580", change: "+3.1%" },
  ],
  WEEKLY: [
    { label: "Weekly Sales", value: "Rs. 1,86,240", change: "+11.6%" },
    { label: "Orders This Week", value: "124", change: "+7.8%" },
    { label: "Average Order", value: "Rs. 1,502", change: "+4.3%" },
  ],
  MONTHLY: [
    { label: "Monthly Sales", value: "Rs. 7,42,680", change: "+14.2%" },
    { label: "Orders This Month", value: "486", change: "+9.7%" },
    { label: "Average Order", value: "Rs. 1,528", change: "+3.9%" },
  ],
};

const PRODUCT_SALES = [
  { product: "Paracetamol 500mg", units: 420, sales: "Rs. 26,040" },
  { product: "Vitamin C 500mg", units: 315, sales: "Rs. 27,720" },
  { product: "Amoxicillin 500mg", units: 198, sales: "Rs. 18,612" },
];

const PHARMACY_SALES = [
  {
    pharmacy: "Sri Lakshmi Medicals",
    orders: 32,
    sales: "Rs. 1,24,500",
  },
  {
    pharmacy: "Apollo Care Pharmacy",
    orders: 27,
    sales: "Rs. 98,240",
  },
  {
    pharmacy: "HealthFirst Chemists",
    orders: 21,
    sales: "Rs. 76,840",
  },
];

const ORDER_SUMMARY = [
  { label: "Pending", value: 12, variant: "warning" as const },
  { label: "Processing", value: 18, variant: "default" as const },
  { label: "Delivered", value: 142, variant: "success" as const },
  { label: "Cancelled", value: 9, variant: "danger" as const },
];

const INVENTORY_SUMMARY = [
  { label: "Current Stock", value: "12,480" },
  { label: "Low Stock", value: "18" },
  { label: "Near Expiry", value: "11" },
  { label: "Expired", value: "3" },
];

const CUSTOMER_SUMMARY = [
  { label: "New Pharmacies", value: "24" },
  { label: "Active Pharmacies", value: "138" },
  { label: "Inactive Pharmacies", value: "17" },
  { label: "Top Ordering Pharmacies", value: "3" },
];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<Period>("MONTHLY");

  const salesData = useMemo(() => SALES_DATA[period], [period]);

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Sales, orders, inventory and pharmacy performance reports.
          </p>
        </div>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            Sales Period
          </span>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as Period)
            }
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </label>
      </div>

      <section aria-labelledby="sales-report-heading">
        <h2
          id="sales-report-heading"
          className="mb-3 text-lg font-semibold text-gray-900"
        >
          Sales Summary
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {salesData.map((item) => (
            <Card key={item.label}>
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {item.value}
                </p>

                <p className="mt-2 text-xs font-medium text-green-600">
                  {item.change} from previous period
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="order-report-heading">
        <h2
          id="order-report-heading"
          className="mb-3 text-lg font-semibold text-gray-900"
        >
          Order Summary
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ORDER_SUMMARY.map((item) => (
            <Card key={item.label}>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-gray-600">
                  {item.label}
                </span>

                <Badge variant={item.variant}>{item.value}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="product-sales-heading">
        <h2
          id="product-sales-heading"
          className="mb-3 text-lg font-semibold text-gray-900"
        >
          Product Sales
        </h2>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Units Sold</th>
                  <th className="px-4 py-3">Sales</th>
                </tr>
              </thead>

              <tbody>
                {PRODUCT_SALES.map((item) => (
                  <tr
                    key={item.product}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">
                      {item.product}
                    </td>
                    <td className="px-4 py-3">{item.units}</td>
                    <td className="px-4 py-3">{item.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section aria-labelledby="pharmacy-sales-heading">
        <h2
          id="pharmacy-sales-heading"
          className="mb-3 text-lg font-semibold text-gray-900"
        >
          Pharmacy Sales
        </h2>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3">Pharmacy</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Sales</th>
                </tr>
              </thead>

              <tbody>
                {PHARMACY_SALES.map((item) => (
                  <tr
                    key={item.pharmacy}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">
                      {item.pharmacy}
                    </td>
                    <td className="px-4 py-3">{item.orders}</td>
                    <td className="px-4 py-3">{item.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section aria-labelledby="inventory-report-heading">
        <h2
          id="inventory-report-heading"
          className="mb-3 text-lg font-semibold text-gray-900"
        >
          Inventory Summary
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INVENTORY_SUMMARY.map((item) => (
            <Card key={item.label}>
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {item.value}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="customer-report-heading">
        <h2
          id="customer-report-heading"
          className="mb-3 text-lg font-semibold text-gray-900"
        >
          Pharmacy Summary
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMER_SUMMARY.map((item) => (
            <Card key={item.label}>
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {item.value}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}