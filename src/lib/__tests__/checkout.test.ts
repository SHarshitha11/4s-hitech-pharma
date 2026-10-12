import { beforeEach, describe, expect, it } from "vitest";

import {
  createOrderId,
  getLastOrder,
  getOrderById,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_SEQUENCE,
  saveOrderRequest,
  type OrderRequest,
} from "../checkout";

const sampleOrder: OrderRequest = {
  orderId: "ORD-TEST-12345",
  status: "PENDING",
  createdAt: "2026-10-12T12:00:00.000Z",
  deliveryAddress: {
    businessName: "ABC Pharmacy",
    contactName: "Harshitha",
    phone: "9876543210",
    addressLine1: "123 Main Road",
    addressLine2: "Near City Market",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560001",
  },
  paymentTerm: "CREDIT",
  notes: "Deliver during business hours.",
  items: [
    {
      productId: "paracetamol-500",
      productName: "Paracetamol 500 mg Tablets",
      packSize: "10 x 10 Tablets",
      quantity: 10,
      unitPrice: 120,
      lineTotal: 1200,
    },
  ],
  subtotal: 1200,
  tax: 60,
  total: 1260,
};

describe("Checkout order helper", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("saves and retrieves the latest order", () => {
    saveOrderRequest(sampleOrder);

    expect(getLastOrder()).toEqual(sampleOrder);
  });

  it("finds an order by its order ID", () => {
    saveOrderRequest(sampleOrder);

    expect(getOrderById(sampleOrder.orderId)).toEqual(
      sampleOrder,
    );
  });

  it("returns null for an unknown order ID", () => {
    saveOrderRequest(sampleOrder);

    expect(getOrderById("ORD-UNKNOWN")).toBeNull();
  });

  it("defines the expected tracking status sequence", () => {
    expect(ORDER_STATUS_SEQUENCE).toEqual([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "PACKED",
      "DISPATCHED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ]);
  });

  it("provides labels for all tracking statuses", () => {
    for (const status of ORDER_STATUS_SEQUENCE) {
      expect(ORDER_STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it("creates an order ID with the expected prefix", () => {
    const orderId = createOrderId();

    expect(orderId).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);
  });
});