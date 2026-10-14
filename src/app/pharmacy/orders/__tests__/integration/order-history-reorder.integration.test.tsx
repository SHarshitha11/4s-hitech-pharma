import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import OrdersPage from "../../page";

import {
  saveOrderRequest,
  type OrderRequest,
} from "@/lib/checkout";

import { CART_STORAGE_KEY } from "@/lib/cart";

const deliveredOrder: OrderRequest = {
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

const pendingOrder: OrderRequest = {
  ...deliveredOrder,
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

const unavailableOrder: OrderRequest = {
  ...deliveredOrder,
  orderId: "ORD-H16-003",
  createdAt: "2026-10-11T10:00:00.000Z",
  items: [
    {
      productId: "paracetamol-500",
      productName: "Paracetamol 500 mg Tablets",
      packSize: "10 x 10 Tablets",
      quantity: 10,
      unitPrice: 120,
      lineTotal: 1200,
    },
    {
      productId: "multivitamin-syrup",
      productName: "Multivitamin Oral Syrup",
      packSize: "200 ml",
      quantity: 5,
      unitPrice: 110,
      lineTotal: 550,
    },
  ],
  subtotal: 1750,
  tax: 87.5,
  total: 1837.5,
};

describe("Order History and Reorder Integration", () => {
  beforeEach(() => {
    sessionStorage.clear();

    saveOrderRequest(deliveredOrder);
    saveOrderRequest(pendingOrder);
  });

  it("displays multiple previous orders", async () => {
    render(<OrdersPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Order History",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("ORD-H16-001"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("ORD-H16-002"),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Delivered").length,
    ).toBeGreaterThan(1);

    expect(
      screen.getAllByText("Pending").length,
    ).toBeGreaterThan(1);

    expect(
      screen.getByText("Showing 2 of 2 orders"),
    ).toBeInTheDocument();
  });

  it("filters orders by search and status", async () => {
    render(<OrdersPage />);

    await screen.findByRole("heading", {
      name: "Order History",
    });

    const search = screen.getByRole("searchbox", {
      name: "Search Orders",
    });

    fireEvent.change(search, {
      target: { value: "Amoxicillin" },
    });

    expect(
      screen.getByText("ORD-H16-002"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("ORD-H16-001"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Showing 1 of 2 orders"),
    ).toBeInTheDocument();

    fireEvent.change(search, {
      target: { value: "" },
    });

    fireEvent.change(
      screen.getByLabelText("Order Status"),
      {
        target: { value: "DELIVERED" },
      },
    );

    expect(
      screen.getByText("ORD-H16-001"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("ORD-H16-002"),
    ).not.toBeInTheDocument();
  });

  it("reorders eligible products and skips unavailable products", async () => {
    sessionStorage.clear();
    saveOrderRequest(unavailableOrder);

    render(<OrdersPage />);

    expect(
      await screen.findByText("ORD-H16-003"),
    ).toBeInTheDocument();

    const reorderButton = screen.getByRole("button", {
      name: "Reorder",
    });

    fireEvent.click(reorderButton);

    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(
      "1 item added to cart.",
    );

    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(
      "1 item skipped because they are unavailable or cannot meet the minimum order quantity.",
    );

    const cart = JSON.parse(
      sessionStorage.getItem(CART_STORAGE_KEY) ?? "[]",
    );

    expect(cart).toEqual([
      {
        productId: "paracetamol-500",
        productName: "Paracetamol 500 mg Tablets",
        packSize: "10 x 10 Tablets",
        quantity: 10,
        priceLabel: "Customer-specific",
      },
    ]);
  });
});