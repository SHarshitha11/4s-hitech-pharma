import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createSupportTicketId,
  getSupportTickets,
  saveSupportTicket,
} from "@/lib/support";

describe("support ticket helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("starts with no support tickets", () => {
    expect(getSupportTickets()).toEqual([]);
  });

  it("saves and retrieves a support ticket", () => {
    const ticket = {
      id: "SUP-12345678",
      category: "Damaged Product" as const,
      orderNumber: "ORD-TEST-12345",
      product: "Paracetamol 500 mg Tablets",
      quantity: 2,
      description: "Two damaged packs received.",
      attachmentName: "damage.jpg",
      submittedAt: "2026-10-14T09:00:00.000Z",
      status: "OPEN" as const,
    };

    saveSupportTicket(ticket);

    expect(getSupportTickets()).toEqual([ticket]);
  });

  it("places newer tickets first", () => {
    const first = {
      id: "SUP-00000001",
      category: "Invoice Issue" as const,
      orderNumber: "ORD-1",
      product: "Product A",
      quantity: 1,
      description: "Invoice mismatch.",
      submittedAt: "2026-10-14T08:00:00.000Z",
      status: "OPEN" as const,
    };

    const second = {
      id: "SUP-00000002",
      category: "Delivery Issue" as const,
      orderNumber: "ORD-2",
      product: "Product B",
      quantity: 3,
      description: "Delivery delayed.",
      submittedAt: "2026-10-14T09:00:00.000Z",
      status: "OPEN" as const,
    };

    saveSupportTicket(first);
    saveSupportTicket(second);

    expect(getSupportTickets().map((ticket) => ticket.id)).toEqual([
      "SUP-00000002",
      "SUP-00000001",
    ]);
  });

  it("creates a support ticket id with the expected prefix", () => {
    vi.spyOn(Date, "now").mockReturnValue(1234567890123);

    expect(createSupportTicketId()).toBe("SUP-67890123");
  });
});
