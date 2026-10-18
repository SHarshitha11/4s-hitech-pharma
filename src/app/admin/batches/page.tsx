"use client";

import { FormEvent, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  getProducts,
  saveProducts,
  type BatchStatus,
  type ManagedProduct,
  type ProductBatch,
} from "@/lib/product-inventory";

const EMPTY_BATCH: ProductBatch = {
  id: "",
  productId: "",
  batchNumber: "",
  manufacturingDate: "",
  expiryDate: "",
  quantity: 0,
  mrp: 0,
  purchasePrice: 0,
  wholesalePrice: 0,
  supplier: "",
  warehouse: "",
  status: "AVAILABLE",
};

export default function AdminBatchesPage() {
  const [products, setProducts] = useState(getProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ManagedProduct | null>(null);
  const [editingBatch, setEditingBatch] = useState<ProductBatch>(EMPTY_BATCH);

  const batches = useMemo(
    () =>
      products.flatMap((product) =>
        product.batches.map((batch) => ({
          product,
          batch,
        })),
      ),
    [products],
  );

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return batches;

    return batches.filter(
      ({ product, batch }) =>
        product.name.toLowerCase().includes(query) ||
        product.productCode.toLowerCase().includes(query) ||
        batch.batchNumber.toLowerCase().includes(query) ||
        batch.supplier.toLowerCase().includes(query) ||
        batch.warehouse.toLowerCase().includes(query),
    );
  }, [batches, search]);

  function openCreate(product: ManagedProduct) {
    setSelectedProduct(product);
    setEditingBatch({
      ...EMPTY_BATCH,
      id: `BAT-${product.id}-${product.batches.length + 1}`,
      productId: product.id,
    });
    setModalOpen(true);
  }

  function openEdit(product: ManagedProduct, batch: ProductBatch) {
    setSelectedProduct(product);
    setEditingBatch({ ...batch });
    setModalOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct) return;

    const updatedProducts = products.map((product) => {
      if (product.id !== selectedProduct.id) return product;

      const exists = product.batches.some(
        (batch) => batch.id === editingBatch.id,
      );

      return {
        ...product,
        batches: exists
          ? product.batches.map((batch) =>
              batch.id === editingBatch.id ? editingBatch : batch,
            )
          : [...product.batches, editingBatch],
      };
    });

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setModalOpen(false);
  }

  function statusVariant(status: BatchStatus) {
    if (status === "AVAILABLE") return "success" as const;
    if (status === "EXPIRED" || status === "RECALLED") return "danger" as const;
    return "warning" as const;
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Batch Management</h1>
        <p className="text-sm text-slate-600">
          Manage pharmaceutical batch details, quantities and expiry data.
        </p>
      </div>

      <Card>
        <div className="p-4">
          <input
            aria-label="Search batches"
            placeholder="Search product, batch, supplier or warehouse..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Batch Number</th>
                <th className="px-4 py-3">Manufacturing</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">MRP</th>
                <th className="px-4 py-3">Warehouse</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBatches.map(({ product, batch }) => (
                <tr key={batch.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{batch.batchNumber}</td>
                  <td className="px-4 py-3">{batch.manufacturingDate}</td>
                  <td className="px-4 py-3">{batch.expiryDate}</td>
                  <td className="px-4 py-3">{batch.quantity}</td>
                  <td className="px-4 py-3">?{batch.mrp}</td>
                  <td className="px-4 py-3">{batch.warehouse}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(batch.status)}>
                      {batch.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      onClick={() => openEdit(product, batch)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="mb-3 font-semibold">Add Batch</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-slate-500">
                    {product.productCode}
                  </div>
                </div>
                <Button onClick={() => openCreate(product)}>Add Batch</Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBatch.batchNumber ? "Edit Batch" : "Create Batch"}
        description={selectedProduct?.name}
      >
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Batch Number</span>
              <input
                required
                value={editingBatch.batchNumber}
                onChange={(event) =>
                  setEditingBatch((current) => ({
                    ...current,
                    batchNumber: event.target.value,
                  }))
                }
                className="rounded-md border px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Manufacturing Date</span>
              <input
                required
                type="date"
                value={editingBatch.manufacturingDate}
                onChange={(event) =>
                  setEditingBatch((current) => ({
                    ...current,
                    manufacturingDate: event.target.value,
                  }))
                }
                className="rounded-md border px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Expiry Date</span>
              <input
                required
                type="date"
                value={editingBatch.expiryDate}
                onChange={(event) =>
                  setEditingBatch((current) => ({
                    ...current,
                    expiryDate: event.target.value,
                  }))
                }
                className="rounded-md border px-3 py-2"
              />
            </label>

            {(
              [
                ["quantity", "Quantity"],
                ["mrp", "MRP"],
                ["purchasePrice", "Purchase Price"],
                ["wholesalePrice", "Wholesale Price"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="font-medium">{label}</span>
                <input
                  required
                  min="0"
                  type="number"
                  value={editingBatch[field]}
                  onChange={(event) =>
                    setEditingBatch((current) => ({
                      ...current,
                      [field]: Number(event.target.value),
                    }))
                  }
                  className="rounded-md border px-3 py-2"
                />
              </label>
            ))}

            {(
              [
                ["supplier", "Supplier"],
                ["warehouse", "Warehouse"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="font-medium">{label}</span>
                <input
                  required
                  value={editingBatch[field]}
                  onChange={(event) =>
                    setEditingBatch((current) => ({
                      ...current,
                      [field]: event.target.value,
                    }))
                  }
                  className="rounded-md border px-3 py-2"
                />
              </label>
            ))}

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Batch Status</span>
              <select
                value={editingBatch.status}
                onChange={(event) =>
                  setEditingBatch((current) => ({
                    ...current,
                    status: event.target.value as BatchStatus,
                  }))
                }
                className="rounded-md border px-3 py-2"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="EXPIRED">Expired</option>
                <option value="QUARANTINED">Quarantined</option>
                <option value="DAMAGED">Damaged</option>
                <option value="RECALLED">Recalled</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Batch</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}

