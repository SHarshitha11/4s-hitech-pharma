"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Badge, Button, Card } from "@/components/ui";
import { mockProducts } from "@/lib/mock-products";
import type { ProductCategory } from "@/types/product";

const PRODUCTS_PER_PAGE = 6;

const categories: Array<"All" | ProductCategory> = [
  "All",
  "Tablets",
  "Capsules",
  "Syrups",
  "Suspensions",
  "Injections",
  "Creams",
  "Ointments",
  "Drops",
  "Powders",
  "Nutraceuticals",
  "Surgical & Healthcare",
];

type SortOption =
  | "name-asc"
  | "name-desc"
  | "category-asc"
  | "availability";

const availabilityOrder = {
  "In Stock": 1,
  "Limited Stock": 2,
  "Out of Stock": 3,
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | ProductCategory>("All");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const result = mockProducts.filter((product) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.brandName.toLowerCase().includes(searchTerm) ||
        product.composition.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.manufacturer.toLowerCase().includes(searchTerm) ||
        product.productCode.toLowerCase().includes(searchTerm);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((a, b) => {
      if (sort === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sort === "category-asc") {
        return a.category.localeCompare(b.category);
      }

      if (sort === "availability") {
        return (
          availabilityOrder[a.availability] -
          availabilityOrder[b.availability]
        );
      }

      return a.name.localeCompare(b.name);
    });
  }, [search, category, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: "All" | ProductCategory) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setPage(1);
  };

  return (
    <main className="min-w-0 overflow-x-hidden bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Page Header */}
        <section>
          <Badge>Products Catalogue</Badge>

          <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pharmaceutical Products
          </h1>

          <p className="mt-3 max-w-3xl break-words leading-7 text-gray-600">
            Browse the pharmaceutical product catalogue by category, search
            term and availability. Product information shown here is
            API-ready mock data and can be connected to the product service
            later.
          </p>
        </section>

        {/* Search and Filters */}
        <Card
          title="Search and Filter Products"
          description="Search by product name, brand, composition, category, manufacturer or product code."
        >
          <div className="grid min-w-0 gap-5 lg:grid-cols-3">
            {/* Search */}
            <div className="min-w-0 lg:col-span-2">
              <label
                htmlFor="product-search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search Products
              </label>

              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                placeholder="Search product name, brand, composition..."
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Sort */}
            <div className="min-w-0">
              <label
                htmlFor="product-sort"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Sort By
              </label>

              <select
                id="product-sort"
                value={sort}
                onChange={(event) =>
                  handleSortChange(event.target.value as SortOption)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="category-asc">Category</option>
                <option value="availability">Availability</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Product Category
            </p>

            <div className="flex min-w-0 flex-wrap gap-2">
              {categories.map((item) => {
                const selected = category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleCategoryChange(item)}
                    aria-pressed={selected}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {paginatedProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          {search || category !== "All" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSort("name-asc");
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          ) : null}
        </div>

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <section
            aria-label="Product catalogue"
            className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedProducts.map((product) => (
              <Card
                key={product.id}
                title={product.name}
                description={product.composition}
              >
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge>{product.category}</Badge>

                    <Badge
                      variant={
                        product.availability === "In Stock"
                          ? "success"
                          : product.availability === "Limited Stock"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {product.availability}
                    </Badge>
                  </div>

                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-medium text-gray-500">
                        Product Code
                      </dt>
                      <dd className="break-words text-gray-900">
                        {product.productCode}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-medium text-gray-500">
                        Brand
                      </dt>
                      <dd className="break-words text-gray-900">
                        {product.brandName}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-medium text-gray-500">
                        Manufacturer
                      </dt>
                      <dd className="break-words text-gray-900">
                        {product.manufacturer}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex w-full"
                  >
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </section>
        ) : (
          <Card
            title="No Products Found"
            description="No products match your current search and filter selections."
          >
            <div className="py-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setSort("name-asc");
                  setPage(1);
                }}
              >
                Clear Search and Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {filteredProducts.length > PRODUCTS_PER_PAGE && (
          <nav
            aria-label="Product pagination"
            className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row"
          >
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() =>
                  setPage((previousPage) =>
                    Math.max(1, previousPage - 1),
                  )
                }
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={
                      currentPage === pageNumber ? "page" : undefined
                    }
                    onClick={() => setPage(pageNumber)}
                    className={`hidden h-9 min-w-9 rounded-md border px-3 text-sm sm:inline-flex sm:items-center sm:justify-center ${
                      currentPage === pageNumber
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((previousPage) =>
                    Math.min(totalPages, previousPage + 1),
                  )
                }
              >
                Next
              </Button>
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}