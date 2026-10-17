"use client";

import {
  AdminMetricCard,
  AdminPageHeader,
  AdminPlaceholder,
} from "@/components/admin/admin-components";
import { getAuthSession } from "@/lib/auth";
import { hasAdminPermission } from "@/lib/admin-rbac";

const metrics = [
  {
    label: "Total Pharmacies",
    value: "—",
    description: "Live API metric placeholder",
  },
  {
    label: "Pending Approvals",
    value: "—",
    description: "Awaiting admin review",
  },
  {
    label: "Today's Orders",
    value: "—",
    description: "Orders created today",
  },
  {
    label: "Today's Revenue",
    value: "—",
    description: "Revenue summary placeholder",
  },
  {
    label: "Monthly Revenue",
    value: "—",
    description: "Current month summary",
  },
  {
    label: "Pending Deliveries",
    value: "—",
    description: "Deliveries awaiting action",
  },
  {
    label: "Low Stock Products",
    value: "—",
    description: "Inventory warning placeholder",
  },
  {
    label: "Near Expiry Products",
    value: "—",
    description: "Expiry monitoring placeholder",
  },
  {
    label: "Open Support Tickets",
    value: "—",
    description: "Support workload placeholder",
  },
];

export default function AdminDashboardPage() {
  const session = getAuthSession();
  const canViewReports = hasAdminPermission(session?.role, "reports:view");

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          title="Admin Dashboard"
          description="Monitor pharmacy, order, inventory, delivery and support operations from one role-aware workspace."
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <AdminMetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              description={metric.description}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminPlaceholder
            title="Sales over time"
            description="Chart placeholder for future dashboard API integration."
          />

          <AdminPlaceholder
            title="Orders over time"
            description="Chart placeholder for future dashboard API integration."
          />

          <AdminPlaceholder
            title="Top products"
            description="Chart placeholder for future product analytics."
          />

          <AdminPlaceholder
            title="Top pharmacies"
            description="Chart placeholder for future pharmacy analytics."
          />

          {canViewReports ? (
            <AdminPlaceholder
              title="Category and Manufacturing Sales"
              description="Reserved reporting workspace for role-authorized users."
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}