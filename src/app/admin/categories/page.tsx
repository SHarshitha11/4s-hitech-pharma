"use client";

import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  getCategories,
  saveCategories,
  type ProductCategory,
} from "@/lib/product-inventory";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(getCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCategory | null>(null);

  function openCreate() {
    setEditing({
      id: `CAT-${Date.now()}`,
      name: "",
      description: "",
      status: "ACTIVE",
    });
    setModalOpen(true);
  }

  function openEdit(category: ProductCategory) {
    setEditing({ ...category });
    setModalOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const exists = categories.some((category) => category.id === editing.id);

    const next = exists
      ? categories.map((category) =>
          category.id === editing.id ? editing : category,
        )
      : [...categories, editing];

    setCategories(next);
    saveCategories(next);
    setModalOpen(false);
  }

  function toggleStatus(id: string) {
    const next = categories.map((category) =>
      category.id === id
        ? {
            ...category,
            status:
              category.status === "ACTIVE"
                ? ("INACTIVE" as const)
                : ("ACTIVE" as const),
          }
        : category,
    );

    setCategories(next);
    saveCategories(next);
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-sm text-slate-600">
            Manage product categories used in the catalogue.
          </p>
        </div>

        <Button onClick={openCreate}>Add Category</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-4 py-3">Category ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{category.id}</td>
                  <td className="px-4 py-3 font-medium">{category.name}</td>
                  <td className="px-4 py-3">{category.description}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        category.status === "ACTIVE" ? "success" : "warning"
                      }
                    >
                      {category.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openEdit(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleStatus(category.id)}
                      >
                        {category.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing?.name ? "Edit Category" : "Create Category"}
        description="Maintain product category details."
      >
        {editing && (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Category Name</span>
              <input
                required
                value={editing.name}
                onChange={(event) =>
                  setEditing((current) =>
                    current
                      ? { ...current, name: event.target.value }
                      : current,
                  )
                }
                className="rounded-md border px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Description</span>
              <textarea
                value={editing.description}
                onChange={(event) =>
                  setEditing((current) =>
                    current
                      ? { ...current, description: event.target.value }
                      : current,
                  )
                }
                className="min-h-24 rounded-md border px-3 py-2"
              />
            </label>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Category</Button>
            </div>
          </form>
        )}
      </Modal>
    </main>
  );
}
