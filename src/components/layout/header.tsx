"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui";
import {
  publicCta,
  publicNavigation,
} from "@/components/navigation/public-navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900"
          onClick={closeMenu}
        >
          4S HITECH PHARMA
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {item.label}
            </Link>
          ))}

          <Link href={publicCta.href}>
            <Button size="sm">{publicCta.label}</Button>
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 lg:hidden"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="text-sm font-medium">
            {isMenuOpen ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            <Link href={publicCta.href} onClick={closeMenu}>
              <span className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                {publicCta.label}
              </span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
