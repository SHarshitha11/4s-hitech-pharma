export type InvoiceStatus = "PAID" | "PENDING" | "OVERDUE";

export type InvoiceItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
};

export type Invoice = {
  id: string;
  orderId: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  deliveryAddress: string;
  paymentMethod: string;
};

export const INVOICE_STORAGE_KEY = "4s-hitech-pharma-invoices";

const demoInvoices: Invoice[] = [
  {
    id: "INV-001",
    orderId: "ORD-TEST-12345",
    invoiceDate: "2026-10-12",
    dueDate: "2026-10-27",
    status: "PAID",
    items: [
      {
        productName: "Paracetamol 500 mg Tablets",
        quantity: 10,
        unitPrice: 120,
        tax: 60,
      },
    ],
    deliveryAddress: "Bengaluru, Karnataka",
    paymentMethod: "Credit Terms",
  },
  {
    id: "INV-002",
    orderId: "ORD-TEST-12346",
    invoiceDate: "2026-10-14",
    dueDate: "2026-10-29",
    status: "PENDING",
    items: [
      {
        productName: "Cetirizine 10 mg Tablets",
        quantity: 10,
        unitPrice: 85,
        tax: 42.5,
      },
    ],
    deliveryAddress: "Bengaluru, Karnataka",
    paymentMethod: "Credit Terms",
  },
];

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") {
    return demoInvoices;
  }

  try {
    const stored = window.sessionStorage.getItem(INVOICE_STORAGE_KEY);

    if (!stored) {
      window.sessionStorage.setItem(
        INVOICE_STORAGE_KEY,
        JSON.stringify(demoInvoices),
      );
      return demoInvoices;
    }

    const parsed = JSON.parse(stored) as unknown;

    if (Array.isArray(parsed)) {
      return parsed as Invoice[];
    }
  } catch {
    // Fall back to demo invoices when session storage is unavailable.
  }

  return demoInvoices;
}

export function getInvoiceById(invoiceId: string): Invoice | undefined {
  return getInvoices().find((invoice) => invoice.id === invoiceId);
}

export function getInvoiceSubtotal(invoice: Invoice): number {
  return invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}

export function getInvoiceTax(invoice: Invoice): number {
  return invoice.items.reduce(
    (sum, item) => sum + item.tax,
    0,
  );
}

export function getInvoiceTotal(invoice: Invoice): number {
  return getInvoiceSubtotal(invoice) + getInvoiceTax(invoice);
}

export function formatInvoiceCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}
