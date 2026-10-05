"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";
import { clearAuthSession } from "@/lib/auth";

const navigation = [
  { label: "Dashboard", href: "/pharmacy/dashboard" },
  { label: "Products", href: "/pharmacy/products" },
  { label: "Cart", href: "/pharmacy/cart" },
  { label: "Orders", href: "/pharmacy/orders" },
  { label: "Invoices", href: "/pharmacy/invoices" },
  { label: "Support", href: "/pharmacy/support" },
  { label: "Profile", href: "/pharmacy/profile" },
];

export default function PharmacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    clearAuthSession();
    setMobileOpen(false);
    router.replace("/login");
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <div className="flex min-h-screen w-full min-w-0">
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-gray-200 px-6 py-5">
            <Link
              href="/pharmacy/dashboard"
              className="block truncate text-lg font-bold tracking-tight text-gray-900"
            >
              4S HITECH PHARMA
            </Link>

            <p className="mt-1 text-xs text-gray-500">
              Pharmacy Partner Portal
            </p>
          </div>

          <nav
            aria-label="Pharmacy navigation"
            className="min-w-0 flex-1 space-y-1 overflow-y-auto px-3 py-5"
          >
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "block rounded-lg px-4 py-3 text-sm font-medium transition " +
                    (active
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
            <div className="flex min-h-16 w-full min-w-0 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open pharmacy navigation"
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen((value) => !value)}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 lg:hidden"
                >
                  {mobileOpen ? "Close" : "Menu"}
                </button>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    Pharmacy Partner Portal
                  </p>

                  <p className="hidden truncate text-xs text-gray-500 sm:block">
                    Manage orders, products and account information
                  </p>
                </div>
              </div>

              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  Pharmacy Account
                </p>

                <p className="text-xs text-gray-500">
                  Business Partner
                </p>
              </div>
            </div>

            {mobileOpen ? (
              <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
                <nav
                  aria-label="Mobile pharmacy navigation"
                  className="space-y-1"
                >
                  {navigation.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={
                          "block rounded-lg px-4 py-3 text-sm font-medium " +
                          (active
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100")
                        }
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            ) : null}
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
