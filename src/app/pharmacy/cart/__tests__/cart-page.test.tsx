import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import CartPage from "../page";
import { addToCart, type CartItem } from "@/lib/cart";

const paracetamol: CartItem = {
  productId: "paracetamol-500",
  productName: "Paracetamol 500 mg Tablets",
  packSize: "10 x 10 Tablets",
  quantity: 10,
  priceLabel: "Customer-specific",
};

describe("Pharmacy Cart Page", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("shows an empty cart message when there are no items", async () => {
    render(<CartPage />);

    expect(
      await screen.findByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });

  it("displays saved products and the order summary", async () => {
    addToCart(paracetamol);

    render(<CartPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Paracetamol 500 mg Tablets",
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Order Summary" }))
      .toBeInTheDocument();

    expect(screen.getByText("Demo tax (5%)")).toBeInTheDocument();
    expect(screen.getByText((text) => text.trim().endsWith("60.00") && !text.includes("1,260"))).toBeInTheDocument();
    expect(screen.getByText(/1,260\.00/)).toBeInTheDocument();
  });

  it("updates quantity and persists the change", async () => {
    addToCart(paracetamol);

    render(<CartPage />);

    const increaseButton = await screen.findByRole("button", {
      name: "Increase quantity for Paracetamol 500 mg Tablets",
    });

    fireEvent.click(increaseButton);

    const quantityInput = screen.getByRole("spinbutton", {
      name: "Quantity for Paracetamol 500 mg Tablets",
    });

    expect(quantityInput).toHaveValue(11);

    await waitFor(() => {
      const savedItems = JSON.parse(
        sessionStorage.getItem("4s-hitech-pharma-cart") ?? "[]",
      );

      expect(savedItems[0].quantity).toBe(11);
    });
  });

  it("removes a product and shows the empty cart state", async () => {
    addToCart(paracetamol);

    render(<CartPage />);

    await screen.findByRole("heading", {
      name: "Paracetamol 500 mg Tablets",
    });

    fireEvent.click(screen.getByRole("button", { name: "Remove item" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Product removed from cart.",
    );

    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });

  it("shows a validation message when quantity exceeds stock", async () => {
    addToCart({ ...paracetamol, quantity: 501 });

    render(<CartPage />);

    expect(await screen.findByText("Only 500 units are available.")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Continue to Checkout" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("prevents ordering a product that is out of stock", async () => {
    addToCart({
      productId: "multivitamin-syrup",
      productName: "Multivitamin Oral Syrup",
      packSize: "200 ml",
      quantity: 5,
      priceLabel: "Customer-specific",
    });

    render(<CartPage />);

    expect(
      await screen.findByText("This product is currently unavailable."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Continue to Checkout" }),
    ).toHaveAttribute("aria-disabled", "true");
  });
});