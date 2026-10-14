import { beforeEach, describe, expect, it } from "vitest";

import {
  getLastOrder,
  getOrderById,
  getOrderHistory,
  ORDER_HISTORY_STORAGE_KEY,
  saveOrderRequest,
  type OrderRequest,
} from "../checkout";

const orderOne: OrderRequest = {
  orderId: "ORD-H16-001",
  status: "DELIVERED",
  createdAt: "2026-10-10T10:00:00.000Z",
  deliveryAddress: {
    businessName: "ABC Pharmacy",
    contactName: "Harshitha",
    phone: "9876543210",
    addressLine1: "123 Main Road",
    addressLine2: "",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560001",
  },
  paymentTerm: "CREDIT",
  notes: "",
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

const orderTwo: OrderRequest = {
  ...orderOne,
  orderId: "ORD-H16-002",
  status: "PENDING",
  createdAt: "2026-10-12T10:00:00.000Z",
  items: [
    {
      productId: "amoxicillin-500",
      productName: "Amoxicillin 500 mg Capsules",
      packSize: "10 x 10 Capsules",
      quantity: 12,
      unitPrice: 450,
      lineTotal: 5400,
    },
  ],
  subtotal: 5400,
  tax: 270,
  total: 5670,
};

describe("Order history helper", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores the newest order in order history", () => {
    saveOrderRequest(orderOne);

    expect(getOrderHistory()).toEqual([orderOne]);
    expect(getLastOrder()).toEqual(orderOne);
  });

  it("keeps multiple previous orders in history", () => {
    saveOrderRequest(orderOne);
    saveOrderRequest(orderTwo);

    expect(getOrderHistory()).toEqual([
      orderTwo,
      orderOne,
    ]);
  });

  it("returns an order by order ID from history", () => {
    saveOrderRequest(orderOne);
    saveOrderRequest(orderTwo);

    expect(getOrderById(orderOne.orderId)).toEqual(orderOne);
    expect(getOrderById(orderTwo.orderId)).toEqual(orderTwo);
  });

  it("returns null for an unknown order ID", () => {
    saveOrderRequest(orderOne);

    expect(getOrderById("ORD-UNKNOWN")).toBeNull();
  });

  it("stores order history in session storage", () => {
    saveOrderRequest(orderOne);
    saveOrderRequest(orderTwo);

    const stored = JSON.parse(
      sessionStorage.getItem(ORDER_HISTORY_STORAGE_KEY) ?? "[]",
    ) as OrderRequest[];

    expect(stored).toHaveLength(2);
    expect(stored[0].orderId).toBe(orderTwo.orderId);
    expect(stored[1].orderId).toBe(orderOne.orderId);
  });

  it("does not duplicate an order when the same order is saved again", () => {
    saveOrderRequest(orderOne);
    saveOrderRequest(orderOne);

    expect(getOrderHistory()).toEqual([orderOne]);
  });
});