import Link from "next/link";
import { publicNavigation, publicCta } from "@/components/navigation/public-navigation";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              4S HITECH PHARMA
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600">
              Wholesale Pharmaceutical Distribution, Manufacturing and Pharmacy
              Ordering Platform.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Quick Links
            </h2>

            <nav aria-label="Footer navigation" className="mt-4">
              <ul className="space-y-3">
                {publicNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 transition hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Pharmacy Registration
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Register your pharmacy to access the ordering platform.
            </p>

            <div className="mt-4">
              <Link
                href={publicCta.href}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {publicCta.label}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} 4S HITECH PHARMA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
