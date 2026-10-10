"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  pharmacyProducts,
  type PharmacyProduct,
  type StockStatus,
} from "@/features/pharmacy/products/catalogue";
import { addToCart, getCartItemCount } from "@/lib/cart";

const PAGE_SIZE = 6;

type SortOption =
  | "default"
  | "name-asc"
  | "name-desc"
  | "stock-desc"
  | "stock-asc";

const stockRank: Record<StockStatus, number> = {
  "In Stock": 3,
  "Low Stock": 2,
  "Out of Stock": 1,
};

function stockBadgeClass(status: StockStatus) {
  if (status === "In Stock") {
    return "bg-green-50 text-green-700";
  }

  if (status === "Low Stock") {
    return "bg-yellow-50 text-yellow-700";
  }

  return "bg-red-50 text-red-700";
}

function clampQuantity(product: PharmacyProduct, value: number) {
  if (product.stockStatus === "Out of Stock") {
    return 0;
  }

  const maximum = Math.max(product.stockQuantity, product.moq);

  return Math.min(Math.max(value, product.moq), maximum);
}

export default function PharmacyProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dosageForm, setDosageForm] = useState("All");
  const [manufacturer, setManufacturer] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState<SortOption>("default");
  const [page, setPage] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    setCartCount(getCartItemCount());
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(pharmacyProducts.map((product) => product.category)),
      ),
    ],
    [],
  );

  const dosageForms = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(pharmacyProducts.map((product) => product.dosageForm)),
      ),
    ],
    [],
  );

  const manufacturers = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(pharmacyProducts.map((product) => product.manufacturer)),
      ),
    ],
    [],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = pharmacyProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.brand.toLowerCase().includes(normalizedSearch) ||
        product.composition.toLowerCase().includes(normalizedSearch) ||
        product.code.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesDosageForm =
        dosageForm === "All" || product.dosageForm === dosageForm;

      const matchesManufacturer =
        manufacturer === "All" || product.manufacturer === manufacturer;

      const matchesAvailability =
        availability === "All" || product.stockStatus === availability;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDosageForm &&
        matchesManufacturer &&
        matchesAvailability
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sort === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sort === "stock-desc") {
        return stockRank[b.stockStatus] - stockRank[a.stockStatus];
      }

      if (sort === "stock-asc") {
        return stockRank[a.stockStatus] - stockRank[b.stockStatus];
      }

      return 0;
    });
  }, [
    availability,
    category,
    dosageForm,
    manufacturer,
    search,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredProducts]);

  function getQuantity(product: PharmacyProduct) {
    return (
      quantities[product.id] ??
      (product.stockStatus === "Out of Stock" ? 0 : product.moq)
    );
  }

  function updateQuantity(product: PharmacyProduct, value: number) {
    setQuantities((current) => ({
      ...current,
      [product.id]: clampQuantity(product, value),
    }));
  }

  function handleAddToCart(product: PharmacyProduct) {
    const quantity = getQuantity(product);

    addToCart({
      productId: product.id,
      productName: product.name,
      packSize: product.packSize,
      quantity,
      priceLabel: "Customer-specific",
    });

    setCartCount(getCartItemCount());
    setMessage(`${product.name} added to cart.`);

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setDosageForm("All");
    setManufacturer("All");
    setAvailability("All");
    setSort("default");
    setPage(1);
  }

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Pharmacy Product Portal
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Order Medicines
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
              Search and filter the pharmacy catalogue, check stock status,
              select quantity, and add products to your cart.
            </p>
          </div>

          <Link
            href="/pharmacy/cart"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Cart ({cartCount})
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">
            Customer-specific pricing
          </p>

          <p className="mt-1 text-sm text-blue-800">
            Wholesale prices are placeholders in this frontend build and will
            be populated from the pharmacy-specific pricing service.
          </p>
        </div>

        {message ? (
          <div
            role="status"
            className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-lg"
          >
            {message}
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2 lg:col-span-2">
              <label
                htmlFor="pharmacy-product-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search products
              </label>

              <input
                id="pharmacy-product-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by product name, brand, composition or code"
                aria-label="Search pharmacy products"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Category
              </label>

              <select
                id="product-category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-dosage-form"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Dosage form
              </label>

              <select
                id="product-dosage-form"
                value={dosageForm}
                onChange={(event) => {
                  setDosageForm(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900"
              >
                {dosageForms.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-manufacturer"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Manufacturer
              </label>

              <select
                id="product-manufacturer"
                value={manufacturer}
                onChange={(event) => {
                  setManufacturer(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900"
              >
                {manufacturers.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-availability"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Availability
              </label>

              <select
                id="product-availability"
                value={availability}
                onChange={(event) => {
                  setAvailability(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900"
              >
                <option value="All">All</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="product-sort"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Sort
              </label>

              <select
                id="product-sort"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortOption);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900"
              >
                <option value="default">Recommended</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="stock-desc">Availability: Best First</option>
                <option value="stock-asc">Availability: Lowest First</option>
              </select>
            </div>

            <div className="flex items-end md:col-span-2 lg:col-span-2">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Showing <strong>{filteredProducts.length}</strong> matching
            products.
          </p>

          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Try a different search term or reset the filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedProducts.map((product) => {
              const quantity = getQuantity(product);
              const disabled = product.stockStatus === "Out of Stock";
              const maximum = Math.max(
                product.stockQuantity,
                product.moq,
              );

              return (
                <article
                  key={product.id}
                  data-testid="product-card"
                  className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {product.code}
                      </p>

                      <h2 className="mt-1 break-words text-lg font-semibold text-gray-900">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-600">
                        {product.brand}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${stockBadgeClass(
                        product.stockStatus,
                      )}`}
                    >
                      {product.stockStatus}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Composition
                      </p>

                      <p className="mt-1 text-gray-700">
                        {product.composition}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Pack Size
                        </p>

                        <p className="mt-1 text-gray-700">
                          {product.packSize}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Dosage
                        </p>

                        <p className="mt-1 text-gray-700">
                          {product.dosageForm}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Manufacturer
                      </p>

                      <p className="mt-1 text-gray-700">
                        {product.manufacturer}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Wholesale Price
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        Customer-specific
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Price will be loaded for the pharmacy account.
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-500">
                        MOQ: {product.moq}
                      </span>

                      <span className="text-xs text-gray-500">
                        Available: {product.stockQuantity}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor={`quantity-${product.id}`}
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Quantity
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={disabled || quantity <= product.moq}
                        onClick={() =>
                          updateQuantity(product, quantity - 1)
                        }
                        aria-label={`Decrease quantity for ${product.name}`}
                        className="h-10 w-10 shrink-0 rounded-lg border border-gray-300 bg-white text-lg font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        -
                      </button>

                      <input
                        id={`quantity-${product.id}`}
                        type="number"
                        min={product.moq}
                        max={maximum}
                        value={quantity}
                        disabled={disabled}
                        aria-label={`Quantity for ${product.name}`}
                        onChange={(event) =>
                          updateQuantity(
                            product,
                            Number(event.target.value) || product.moq,
                          )
                        }
                        className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-center text-sm font-semibold text-gray-900"
                      />

                      <button
                        type="button"
                        disabled={disabled || quantity >= maximum}
                        onClick={() =>
                          updateQuantity(product, quantity + 1)
                        }
                        aria-label={`Increase quantity for ${product.name}`}
                        className="h-10 w-10 shrink-0 rounded-lg border border-gray-300 bg-white text-lg font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={disabled || quantity < product.moq}
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => handleAddToCart(product)}
                      className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {disabled ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {paginatedProducts.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={
                  currentPage === pageNumber ? "page" : undefined
                }
                className={
                  "rounded-lg px-4 py-2 text-sm font-semibold " +
                  (currentPage === pageNumber
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50")
                }
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}