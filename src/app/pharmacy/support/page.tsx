"use client";

import Link from "next/link";

import { ChangeEvent, FormEvent, useState } from "react";
import {
  createSupportTicketId,
  saveSupportTicket,
  SUPPORT_CATEGORIES,
  type SupportCategory,
} from "@/lib/support";

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

const allowedAttachmentTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

export default function SupportPage() {
  const [category, setCategory] = useState<SupportCategory>(
    SUPPORT_CATEGORIES[0],
  );
  const [orderNumber, setOrderNumber] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentError, setAttachmentError] = useState("");
  const [submittedTicketId, setSubmittedTicketId] = useState("");
  const [error, setError] = useState("");

  const handleAttachment = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setAttachmentError("");

    const file = event.target.files?.[0];

    if (!file) {
      setAttachmentName("");
      return;
    }

    if (!allowedAttachmentTypes.includes(file.type)) {
      setAttachmentName("");
      setAttachmentError(
        "Only JPG, PNG, and PDF files are allowed.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE) {
      setAttachmentName("");
      setAttachmentError(
        "Attachment must be 5 MB or smaller.",
      );
      event.target.value = "";
      return;
    }

    setAttachmentName(file.name);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!orderNumber.trim()) {
      setError("Order number is required.");
      return;
    }

    if (!product.trim()) {
      setError("Product name is required.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    if (attachmentError) {
      return;
    }

    const ticketId = createSupportTicketId();

    saveSupportTicket({
      id: ticketId,
      category,
      orderNumber: orderNumber.trim(),
      product: product.trim(),
      quantity: parsedQuantity,
      description: description.trim(),
      ...(attachmentName ? { attachmentName } : {}),
      submittedAt: new Date().toISOString(),
      status: "OPEN",
    });

    setSubmittedTicketId(ticketId);
    setOrderNumber("");
    setProduct("");
    setQuantity("1");
    setDescription("");
    setAttachmentName("");
    setAttachmentError("");
  };

  const resetForm = () => {
    setSubmittedTicketId("");
    setError("");
  };

  if (submittedTicketId) {
    return (
      <section className="min-w-0 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
                ?
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-green-700">
                Request Submitted
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Support request submitted successfully
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Our support team will review your request according to
                the applicable return and replacement process.
              </p>
            </div>

            <div className="mt-7 rounded-xl bg-gray-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-600">
                  Ticket ID
                </span>
                <span className="break-all text-sm font-bold text-gray-900">
                  {submittedTicketId}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-gray-600">
                  Status
                </span>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                  OPEN
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Submit Another Request
              </button>

              <Link
                href="/pharmacy/orders"
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Pharmacy Partner Portal
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Returns & Product Support
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Submit a support or return request for damaged, incorrect,
            short, expired, packaging, invoice, delivery, or product
            issues.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="support-category"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Select an Issue
              </label>

              <select
                id="support-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as SupportCategory,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                {SUPPORT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="support-order"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Order Number
              </label>

              <input
                id="support-order"
                value={orderNumber}
                onChange={(event) =>
                  setOrderNumber(event.target.value)
                }
                placeholder="ORD-XXXXXXXX"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="support-product"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Product
              </label>

              <input
                id="support-product"
                value={product}
                onChange={(event) =>
                  setProduct(event.target.value)
                }
                placeholder="Product name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="support-quantity"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Quantity
              </label>

              <input
                id="support-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="support-description"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Description
            </label>

            <textarea
              id="support-description"
              rows={6}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the problem and provide relevant details."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="support-attachment"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Supporting Documents / Images
            </label>

            <input
              id="support-attachment"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleAttachment}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
            />

            <p className="mt-2 text-xs text-gray-500">
              Optional. JPG, PNG, or PDF. Maximum size: 5 MB.
            </p>

            {attachmentName && (
              <p className="mt-2 text-sm font-medium text-gray-700">
                Selected: {attachmentName}
              </p>
            )}

            {attachmentError && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {attachmentError}
              </p>
            )}
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
