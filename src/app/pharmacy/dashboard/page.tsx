import Link from "next/link";

import { Badge, Button, Card } from "@/components/ui";

const dashboardCards = [
  {
    label: "Pending Orders",
    value: "04",
    description: "Orders awaiting processing",
  },
  {
    label: "Orders This Month",
    value: "18",
    description: "Orders placed this month",
  },
  {
    label: "Items in Cart",
    value: "07",
    description: "Products currently in cart",
  },
  {
    label: "Outstanding Amount",
    value: "Rs. 24,500",
    description: "Demo outstanding balance",
  },
];

const quickActions = [
  {
    title: "Order Medicines",
    description: "Search products and add medicines to your cart.",
    href: "/pharmacy/products",
    action: "Browse Products",
  },
  {
    title: "Repeat Previous Order",
    description: "Review previous purchases and reorder products.",
    href: "/pharmacy/orders",
    action: "View Orders",
  },
  {
    title: "Track Orders",
    description: "Check the latest status of your pharmacy orders.",
    href: "/pharmacy/orders",
    action: "Track Orders",
  },
  {
    title: "View Invoices",
    description: "Access invoices and order documents.",
    href: "/pharmacy/invoices",
    action: "Open Invoices",
  },
  {
    title: "Contact Support",
    description: "Raise or review a support request.",
    href: "/pharmacy/support",
    action: "Get Support",
  },
];

const recentOrders = [
  {
    order: "#4SHP10021",
    date: "05-Oct-2026",
    items: 8,
    amount: "Rs. 12,800",
    status: "Processing",
  },
  {
    order: "#4SHP10018",
    date: "02-Oct-2026",
    items: 5,
    amount: "Rs. 8,450",
    status: "Dispatched",
  },
  {
    order: "#4SHP10011",
    date: "28-Sep-2026",
    items: 11,
    amount: "Rs. 16,200",
    status: "Delivered",
  },
];

const frequentlyOrderedProducts = [
  {
    name: "Paracetamol 500 mg",
    composition: "Paracetamol",
    pack: "10 x 10 Tablets",
  },
  {
    name: "Amoxicillin 500 mg",
    composition: "Amoxicillin",
    pack: "10 x 10 Capsules",
  },
  {
    name: "Pantoprazole 40 mg",
    composition: "Pantoprazole",
    pack: "10 x 10 Tablets",
  },
];

function getStatusVariant(status: string) {
  if (status === "Delivered") {
    return "success" as const;
  }

  if (status === "Processing") {
    return "warning" as const;
  }

  return "default" as const;
}

export default function DashboardPage() {
  return (
    <main className="min-w-0 w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-8">
        <section className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Pharmacy Dashboard
          </p>

          <div className="mt-2 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Manage your pharmaceutical purchases, orders, invoices and
                account information from one place.
              </p>
            </div>

            <div className="shrink-0">
              <Link href="/pharmacy/products">
                <Button size="lg">Order Medicines</Button>
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-label="Dashboard summary"
          className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {dashboardCards.map((card) => (
            <div key={card.label} className="min-w-0">
              <Card>
                <p className="truncate text-sm font-medium text-gray-600">
                  {card.label}
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                  {card.value}
                </p>

                <p className="mt-2 break-words text-xs leading-5 text-gray-500">
                  {card.description}
                </p>
              </Card>
            </div>
          ))}
        </section>

        <section className="min-w-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Common pharmacy tasks are available here.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {quickActions.map((action) => (
              <div key={action.title} className="min-w-0">
                <Card>
                  <h3 className="break-words text-base font-semibold text-gray-900">
                    {action.title}
                  </h3>

                  <p className="mt-2 min-h-12 break-words text-sm leading-6 text-gray-600">
                    {action.description}
                  </p>

                  <Link
                    href={action.href}
                    className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {action.action}
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </section>

        <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="min-w-0">
            <Card>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Recent demo order activity.
                  </p>
                </div>

                <Link
                  href="/pharmacy/orders"
                  className="shrink-0 text-sm font-semibold text-blue-600 hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-3 py-3">Order</th>
                      <th className="px-3 py-3">Date</th>
                      <th className="px-3 py-3">Items</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((item) => (
                      <tr
                        key={item.order}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="px-3 py-4 font-medium text-gray-900">
                          {item.order}
                          <p className="mt-1 text-xs text-gray-500">
                            {item.amount}
                          </p>
                        </td>

                        <td className="px-3 py-4 text-gray-600">
                          {item.date}
                        </td>

                        <td className="px-3 py-4 text-gray-600">
                          {item.items}
                        </td>

                        <td className="px-3 py-4">
                          <Badge variant={getStatusVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="min-w-0">
            <Card>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Frequently Ordered Products
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Sample products for the dashboard shell.
                  </p>
                </div>

                <Link
                  href="/pharmacy/products"
                  className="shrink-0 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Browse
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {frequentlyOrderedProducts.map((product) => (
                  <div
                    key={product.name}
                    className="min-w-0 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-semibold text-gray-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 break-words text-xs text-gray-500">
                          {product.composition}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs font-medium text-gray-600">
                        {product.pack}
                      </span>
                    </div>

                    <div className="mt-3">
                      <Link
                        href="/pharmacy/products"
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        Add to Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="min-w-0">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">
              Portal Status
            </h2>

            <div className="mt-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 break-words text-sm leading-6 text-gray-600">
                You are viewing the authenticated pharmacy portal shell.
                Dashboard figures and product/order examples are demo data
                until backend integration is connected.
              </p>

              <div className="shrink-0">
                <Badge variant="success">Authenticated</Badge>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}