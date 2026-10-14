import { beforeEach, describe, expect, it } from "vitest";
import {
  formatInvoiceCurrency,
  getInvoiceById,
  getInvoiceSubtotal,
  getInvoiceTax,
  getInvoiceTotal,
  getInvoices,
} from "@/lib/invoices";

describe("invoice helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("loads the demo invoice list", () => {
    const invoices = getInvoices();

    expect(invoices).toHaveLength(2);
    expect(invoices[0].id).toBe("INV-001");
    expect(invoices[1].status).toBe("PENDING");
  });

  it("finds an invoice by id", () => {
    const invoice = getInvoiceById("INV-001");

    expect(invoice?.orderId).toBe("ORD-TEST-12345");
  });

  it("calculates subtotal, tax, and total", () => {
    const invoice = getInvoiceById("INV-001");

    expect(invoice).toBeDefined();

    if (!invoice) {
      return;
    }

    expect(getInvoiceSubtotal(invoice)).toBe(1200);
    expect(getInvoiceTax(invoice)).toBe(60);
    expect(getInvoiceTotal(invoice)).toBe(1260);
  });

  it("formats Indian currency", () => {
    expect(formatInvoiceCurrency(1260)).toBe("\u20B91,260.00");
  });
});
