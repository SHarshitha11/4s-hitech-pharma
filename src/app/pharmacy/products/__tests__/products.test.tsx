import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import PharmacyProductsPage from "../page";
import { CART_STORAGE_KEY } from "@/lib/cart";

describe("Pharmacy Product Search Portal", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the pharmacy product catalogue", () => {
    render(<PharmacyProductsPage />);

    expect(
      screen.getByRole("heading", { name: "Order Medicines" }),
    ).toBeInTheDocument();

    expect(screen.getAllByTestId("product-card")).toHaveLength(6);
  });

  it("searches products by name", () => {
    render(<PharmacyProductsPage />);

    fireEvent.change(screen.getByLabelText("Search pharmacy products"), {
      target: { value: "Paracetamol" },
    });

    expect(screen.getAllByTestId("product-card")).toHaveLength(1);

    expect(
      screen.getByRole("heading", {
        name: "Paracetamol 500 mg Tablets",
      }),
    ).toBeInTheDocument();
  });

  it("filters products by category", () => {
    render(<PharmacyProductsPage />);

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Antibiotics" },
    });

    expect(screen.getAllByTestId("product-card")).toHaveLength(2);
  });

  it("filters products by availability", () => {
    render(<PharmacyProductsPage />);

    fireEvent.change(screen.getByLabelText("Availability"), {
      target: { value: "Out of Stock" },
    });

    expect(screen.getAllByTestId("product-card")).toHaveLength(1);

    expect(
      screen.getByRole("heading", {
        name: "Multivitamin Oral Syrup",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Add Multivitamin Oral Syrup to cart",
      }),
    ).toBeDisabled();
  });

  it("sorts products by name", () => {
    render(<PharmacyProductsPage />);

    fireEvent.change(screen.getByLabelText("Sort"), {
      target: { value: "name-asc" },
    });

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);

    expect(headings[0]).toBe("Amoxicillin 500 mg Capsules");
  });

  it("supports pagination", () => {
    render(<PharmacyProductsPage />);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getAllByTestId("product-card")).toHaveLength(6);
  });

  it("respects minimum order quantity", () => {
    render(<PharmacyProductsPage />);

    const quantity = screen.getByRole("spinbutton", {
      name: "Quantity for Paracetamol 500 mg Tablets",
    });

    expect(quantity).toHaveValue(10);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Paracetamol 500 mg Tablets to cart",
      }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Paracetamol 500 mg Tablets added to cart.",
    );
  });

  it("adds the selected product quantity to session cart storage", () => {
    render(<PharmacyProductsPage />);

    const quantity = screen.getByRole("spinbutton", {
      name: "Quantity for Paracetamol 500 mg Tablets",
    });

    fireEvent.change(quantity, {
      target: { value: "15" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Paracetamol 500 mg Tablets to cart",
      }),
    );

    const cart = JSON.parse(
      sessionStorage.getItem(CART_STORAGE_KEY) ?? "[]",
    );

    expect(cart).toHaveLength(1);
    expect(cart[0].productId).toBe("paracetamol-500");
    expect(cart[0].quantity).toBe(15);
    expect(cart[0].priceLabel).toBe("Customer-specific");
  });
});