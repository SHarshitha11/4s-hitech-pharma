"use client";

import { FormEvent, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  getCategories,
  getProducts,
  saveProducts,
  type ManagedProduct,
  type ProductCategory,
} from "@/lib/product-inventory";

const EMPTY_PRODUCT: ManagedProduct = {
  id: "",
  name: "",
  brand: "",
  composition: "",
  strength: "",
  dosageForm: "",
  packSize: "",
  manufacturer: "",
  categoryId: "",
  productCode: "",
  mrp: 0,
  wholesalePrice: 0,
  taxPercent: 0,
  stockQuantity: 0,
  minimumOrderQuantity: 1,
  status: "ACTIVE",
  visibility: "VISIBLE",
  imageUrl: "",
  batches: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState(getProducts);
  const [categories] = useState<ProductCategory[]>(getCategories);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ManagedProduct>(EMPTY_PRODUCT);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.productCode.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "ALL" || product.categoryId === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const categoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name ??
    "Unassigned";

  function openCreate() {
    setEditingProduct({
      ...EMPTY_PRODUCT,
      id: `PRD-${Date.now()}`,
    });
    setFormOpen(true);
  }

  function openEdit(product: ManagedProduct) {
    setEditingProduct({ ...product });
    setFormOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextProducts = editingProduct.id
      ? products.some((product) => product.id === editingProduct.id)
        ? products.map((product) =>
            product.id === editingProduct.id ? editingProduct : product,
          )
        : [...products, editingProduct]
      : products;

    setProducts(nextProducts);
    saveProducts(nextProducts);
    setFormOpen(false);
  }

  function archiveProduct(id: string) {
    const nextProducts = products.map((product) =>
      product.id === id ? { ...product, status: "ARCHIVED" as const } : product,
    );

    setProducts(nextProducts);
    saveProducts(nextProducts);
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-sm text-slate-600">
            Create, edit and manage pharmaceutical products.
          </p>
        </div>

        <Button onClick={openCreate}>Add Product</Button>
      </div>

      <Card>
        <div className="grid gap-3 p-4 md:grid-cols-4">
          <input
            aria-label="Search products"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          />

          <select
            aria-label="Category filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="ALL">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Status filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <div className="flex items-center rounded-md bg-slate-50 px-3 text-sm">
            Products: <strong className="ml-1">{filteredProducts.length}</strong>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Wholesale</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-slate-500">
                      {product.brand} · {product.strength}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {categoryName(product.categoryId)}
                  </td>
                  <td className="px-4 py-3">{product.productCode}</td>
                  <td className="px-4 py-3">?{product.wholesalePrice}</td>
                  <td className="px-4 py-3">{product.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        product.status === "ACTIVE"
                          ? "success"
                          : product.status === "ARCHIVED"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openEdit(product)}
                      >
                        Edit
                      </Button>
                      {product.status !== "ARCHIVED" && (
                        <Button
                          variant="danger"
                          onClick={() => archiveProduct(product.id)}
                        >
                          Archive
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingProduct.name ? "Edit Product" : "Create Product"}
        description="Enter product, pricing and stock information."
      >
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["name", "Product Name"],
                ["brand", "Brand"],
                ["composition", "Composition"],
                ["strength", "Strength"],
                ["dosageForm", "Dosage Form"],
                ["packSize", "Pack Size"],
                ["manufacturer", "Manufacturer"],
                ["productCode", "Product Code"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="font-medium">{label}</span>
                <input
                  required
                  value={editingProduct[field]}
                  onChange={(event) =>
                    setEditingProduct((current) => ({
                      ...current,
                      [field]: event.target.value,
                    }))
                  }
                  className="rounded-md border px-3 py-2"
                />
              </label>
            ))}

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Category</span>
              <select
                required
                value={editingProduct.categoryId}
                onChange={(event) =>
                  setEditingProduct((current) => ({
                    ...current,
                    categoryId: event.target.value,
                  }))
                }
                className="rounded-md border px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            {(
              [
                ["mrp", "MRP"],
                ["wholesalePrice", "Wholesale Price"],
                ["taxPercent", "Tax %"],
                ["stockQuantity", "Stock Quantity"],
                ["minimumOrderQuantity", "Minimum Order Quantity"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="font-medium">{label}</span>
                <input
                  required
                  type="number"
                  min="0"
                  value={editingProduct[field]}
                  onChange={(event) =>
                    setEditingProduct((current) => ({
                      ...current,
                      [field]: Number(event.target.value),
                    }))
                  }
                  className="rounded-md border px-3 py-2"
                />
              </label>
            ))}

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Status</span>
              <select
                value={editingProduct.status}
                onChange={(event) =>
                  setEditingProduct((current) => ({
                    ...current,
                    status: event.target.value as ManagedProduct["status"],
                  }))
                }
                className="rounded-md border px-3 py-2"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Visibility</span>
              <select
                value={editingProduct.visibility}
                onChange={(event) =>
                  setEditingProduct((current) => ({
                    ...current,
                    visibility: event.target
                      .value as ManagedProduct["visibility"],
                  }))
                }
                className="rounded-md border px-3 py-2"
              >
                <option value="VISIBLE">Visible</option>
                <option value="HIDDEN">Hidden</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
