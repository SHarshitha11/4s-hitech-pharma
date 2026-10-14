"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  formatInvoiceCurrency,
  getInvoiceById,
  getInvoiceSubtotal,
  getInvoiceTax,
  getInvoiceTotal,
} from "@/lib/invoices";

function escapePdfText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function createInvoicePdf(invoice: ReturnType<typeof getInvoiceById>) {
  if (!invoice) {
    return null;
  }

  const lines = [
    "4S HITECH PHARMA",
    `Invoice: ${invoice.id}`,
    `Order: ${invoice.orderId}`,
    `Date: ${invoice.invoiceDate}`,
    `Due Date: ${invoice.dueDate}`,
    "",
    ...invoice.items.map(
      (item) =>
        `${item.productName} | Qty: ${item.quantity} | ${formatInvoiceCurrency(
          item.quantity * item.unitPrice + item.tax,
        )}`,
    ),
    "",
    `Subtotal: ${formatInvoiceCurrency(getInvoiceSubtotal(invoice))}`,
    `Tax: ${formatInvoiceCurrency(getInvoiceTax(invoice))}`,
    `Total: ${formatInvoiceCurrency(getInvoiceTotal(invoice))}`,
    `Payment: ${invoice.paymentMethod}`,
    `Delivery: ${invoice.deliveryAddress}`,
  ];

  const content = [
    "BT",
    "/F1 12 Tf",
    "50 760 Td",
    ...lines.map((line, index) =>
      `${index === 0 ? "" : "0 -18 Td "}(${escapePdfText(line)}) Tj`,
    ),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;

  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${
    objects.length + 1
  } /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export default function InvoiceDetailPage() {
  const params = useParams<{ invoiceId: string }>();
  const invoice = getInvoiceById(params.invoiceId);

  if (!invoice) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Invoice not found
          </h1>

          <Link
            href="/pharmacy/invoices"
            className="mt-5 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Invoices
          </Link>
        </div>
      </section>
    );
  }

  const downloadPdf = () => {
    const blob = createInvoicePdf(invoice);

    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${invoice.id}.pdf`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Pharmacy Partner Portal
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              Invoice {invoice.id}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Order {invoice.orderId}
            </p>
          </div>

          <button
            type="button"
            onClick={downloadPdf}
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Download PDF
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Invoice Date
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {invoice.invoiceDate}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Due Date
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {invoice.dueDate}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {invoice.status}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment Method
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {invoice.paymentMethod}
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {invoice.items.map((item) => (
                  <tr key={item.productName}>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                      {item.productName}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-gray-600">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatInvoiceCurrency(
                        item.quantity * item.unitPrice + item.tax,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto max-w-sm space-y-3 border-t border-gray-200 pt-5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>
                {formatInvoiceCurrency(getInvoiceSubtotal(invoice))}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span>
              <span>{formatInvoiceCurrency(getInvoiceTax(invoice))}</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatInvoiceCurrency(getInvoiceTotal(invoice))}</span>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">Delivery:</span>{" "}
              {invoice.deliveryAddress}
            </p>
          </div>
        </div>

        <Link
          href="/pharmacy/invoices"
          className="mt-5 inline-flex rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Back to Invoices
        </Link>
      </div>
    </section>
  );
}