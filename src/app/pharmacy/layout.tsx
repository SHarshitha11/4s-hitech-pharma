"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import { clearAuthSession } from "@/lib/auth";

export default function PharmacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  function handleLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <Link
              href="/pharmacy/dashboard"
              className="text-lg font-bold text-gray-900"
            >
              4S HITECH PHARMA
            </Link>

            <p className="text-xs text-gray-500">Pharmacy Partner Portal</p>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <Link
              href="/pharmacy/dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/pharmacy/products"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Products
            </Link>

            <Link
              href="/pharmacy/orders"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Orders
            </Link>

            <Link
              href="/pharmacy/invoices"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Invoices
            </Link>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
