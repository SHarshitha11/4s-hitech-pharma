import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import OrdersPage from "../../page";
import OrderSuccessPage from "../../success/page";
import OrderDetailPage from "../../[orderId]/page";

import {
  saveOrderRequest,
  type OrderRequest,
} from "@/lib/checkout";

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

function findExactAmount(amount: string) {
  const expected = "\u20B9" + amount;

  return screen.getAllByText(
    (content) => content.trim() === expected,
  );
}

describe("Orders and Tracking Integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
    saveOrderRequest(sampleOrder);
  });

  it("displays the latest order and tracking links", async () => {
    render(<OrdersPage />);

    expect(
      await screen.findByRole("heading", {
        name: sampleOrder.orderId,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pending"),
    ).toBeInTheDocument();

    expect(findExactAmount("1,260.00")).toHaveLength(1);

    expect(
      screen.getByRole("link", {
        name: "Track Order",
      }),
    ).toHaveAttribute(
      "href",
      `/pharmacy/orders/${sampleOrder.orderId}`,
    );
  });

  it("displays the order success information", async () => {
    render(<OrderSuccessPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Your order request has been submitted",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(sampleOrder.orderId),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pending"),
    ).toBeInTheDocument();

    expect(findExactAmount("1,260.00")).toHaveLength(1);

    expect(
      screen.getByRole("link", {
        name: "Track Order",
      }),
    ).toHaveAttribute(
      "href",
      `/pharmacy/orders/${sampleOrder.orderId}`,
    );
  });

  it("displays order details and the tracking timeline", async () => {
    const params = Promise.resolve({
      orderId: sampleOrder.orderId,
    });

    render(<OrderDetailPage params={params} />);

    expect(
      await screen.findByRole("heading", {
        name: sampleOrder.orderId,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Order Tracking",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Pending").length,
    ).toBeGreaterThan(1);

    expect(
      screen.getByText("Confirmed"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Processing"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Packed"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Dispatched"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Out for Delivery"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Delivered"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Paracetamol 500 mg Tablets"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("ABC Pharmacy"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Deliver during business hours."),
    ).toBeInTheDocument();

    expect(findExactAmount("1,200.00")).toHaveLength(2);
    expect(findExactAmount("60.00")).toHaveLength(1);
    expect(findExactAmount("1,260.00")).toHaveLength(1);
  });
});