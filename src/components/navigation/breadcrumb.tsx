"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  about: "About",
  products: "Products",
  manufacturing: "Manufacturing",
  distribution: "Distribution",
  contact: "Contact",
  "register-pharmacy": "Register Pharmacy",
};

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-gray-200 bg-gray-50"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link
              href="/"
              className="text-gray-500 transition hover:text-gray-900"
            >
              Home
            </Link>
          </li>

          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const label =
              breadcrumbLabels[segment] ??
              segment.replace(/-/g, " ").replace(/\b\w/g, (char) =>
                char.toUpperCase(),
              );

            const href = `/${segments.slice(0, index + 1).join("/")}`;

            return (
              <li key={href} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-gray-400">
                  /
                </span>

                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-gray-900"
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-gray-500 transition hover:text-gray-900"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
