"use client";

import { FormEvent, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  getProducts,
  getStockTransactions,
  saveProducts,
  saveStockTransactions,
  type ManagedProduct,
  type ProductBatch,
  type StockTransaction,
} from "@/lib/product-inventory";

type AdjustmentType = "STOCK_IN" | "ADJUSTMENT" | "STOCK_OUT";

export default function InventoryPage() {
  const [products, setProducts] = useState(getProducts);
  const [transactions, setTransactions] = useState(getStockTransactions);
  const [search, setSearch] = useState("");
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ManagedProduct | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);

  const [adjustmentType, setAdjustmentType] =
    useState<AdjustmentType>("ADJUSTMENT");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.productCode.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.batches.some((batch) =>
          batch.batchNumber.toLowerCase().includes(query),
        ),
    );
  }, [products, search]);

  function stockStatus(quantityValue: number) {
    if (quantityValue === 0) return { label: "OUT OF STOCK", variant: "danger" as const };
    if (quantityValue <= 200) return { label: "LOW STOCK", variant: "warning" as const };
    return { label: "IN STOCK", variant: "success" as const };
  }

  function openAdjustment(product: ManagedProduct) {
    setSelectedProduct(product);
    setAdjustmentType("ADJUSTMENT");
    setQuantity(0);
    setReason("");
    setAdjustmentOpen(true);
  }

  function applyAdjustment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct || quantity <= 0 || !reason.trim()) return;

    const delta =
      adjustmentType === "STOCK_OUT" ? -quantity : quantity;

    const nextProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? {
            ...product,
            stockQuantity: Math.max(0, product.stockQuantity + delta),
          }
        : product,
    );

    const transaction: StockTransaction = {
      id: `STK-${Date.now()}`,
      productId: selectedProduct.id,
      batchId: selectedProduct.batches[0]?.id ?? "",
      type: adjustmentType,
      quantity,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextTransactions = [...transactions, transaction];

    setProducts(nextProducts);
    setTransactions(nextTransactions);
    saveProducts(nextProducts);
    saveStockTransactions(nextTransactions);
    setAdjustmentOpen(false);
  }

  function openBatch(product: ManagedProduct, batch: ProductBatch) {
    setSelectedProduct(product);
    setSelectedBatch(batch);
    setBatchOpen(true);
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <p className="text-sm text-slate-600">
          Monitor stock, batches, expiry and stock transactions.
        </p>
      </div>

      <Card>
        <div className="p-4">
          <input
            aria-label="Search inventory"
            placeholder="Search product, SKU or batch..."
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
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">MRP</th>
                <th className="px-4 py-3">Wholesale</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.flatMap((product) =>
                product.batches.map((batch) => {
                  const status = stockStatus(product.stockQuantity);

                  return (
                    <tr
                      key={batch.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-3 font-medium">
                        {product.name}
                      </td>
                      <td className="px-4 py-3">{product.productCode}</td>
                      <td className="px-4 py-3">{batch.batchNumber}</td>
                      <td className="px-4 py-3">{batch.expiryDate}</td>
                      <td className="px-4 py-3">{batch.quantity}</td>
                      <td className="px-4 py-3">?{batch.mrp}</td>
                      <td className="px-4 py-3">
                        ?{batch.wholesalePrice}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => openAdjustment(product)}
                          >
                            Stock Adjust
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => openBatch(product, batch)}
                          >
                            Batch Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                }),
              )}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No inventory records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="mb-3 font-semibold">Recent Stock Transactions</h2>

          {transactions.length === 0 ? (
            <p className="text-sm text-slate-500">No stock transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {transactions
                .slice(-5)
                .reverse()
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col justify-between gap-2 rounded-md border p-3 text-sm md:flex-row"
                  >
                    <span>{transaction.type}</span>
                    <span>Qty: {transaction.quantity}</span>
                    <span>{transaction.reason}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={adjustmentOpen}
        onClose={() => setAdjustmentOpen(false)}
        title="Stock Adjustment"
        description={
          selectedProduct
            ? `Update stock for ${selectedProduct.name}.`
            : "Update inventory stock."
        }
      >
        <form onSubmit={applyAdjustment} className="grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Action</span>
            <select
              value={adjustmentType}
              onChange={(event) =>
                setAdjustmentType(event.target.value as AdjustmentType)
              }
              className="rounded-md border px-3 py-2"
            >
              <option value="STOCK_IN">Stock In</option>
              <option value="ADJUSTMENT">Stock Adjustment</option>
              <option value="STOCK_OUT">Stock Out</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium">Quantity</span>
            <input
              required
              min="1"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="rounded-md border px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium">Reason</span>
            <textarea
              required
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-24 rounded-md border px-3 py-2"
              placeholder="Enter stock transaction reason"
            />
          </label>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAdjustmentOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Adjustment</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={batchOpen}
        onClose={() => setBatchOpen(false)}
        title="Batch Details"
        description={selectedProduct?.name}
      >
        {selectedBatch && (
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div>
              <strong>Batch ID:</strong> {selectedBatch.id}
            </div>
            <div>
              <strong>Batch Number:</strong> {selectedBatch.batchNumber}
            </div>
            <div>
              <strong>Manufacturing Date:</strong>{" "}
              {selectedBatch.manufacturingDate}
            </div>
            <div>
              <strong>Expiry Date:</strong> {selectedBatch.expiryDate}
            </div>
            <div>
              <strong>Quantity:</strong> {selectedBatch.quantity}
            </div>
            <div>
              <strong>MRP:</strong> ?{selectedBatch.mrp}
            </div>
            <div>
              <strong>Purchase Price:</strong> ?{selectedBatch.purchasePrice}
            </div>
            <div>
              <strong>Wholesale Price:</strong> ?{selectedBatch.wholesalePrice}
            </div>
            <div>
              <strong>Supplier:</strong> {selectedBatch.supplier}
            </div>
            <div>
              <strong>Warehouse:</strong> {selectedBatch.warehouse}
            </div>
            <div>
              <strong>Status:</strong> {selectedBatch.status}
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
