import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import PharmacyProductsPage from "../../page";
import { CART_STORAGE_KEY } from "@/lib/cart";

describe("Pharmacy Product Search Portal Integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("searches for a product and adds the selected quantity to cart", () => {
    render(<PharmacyProductsPage />);

    fireEvent.change(screen.getByLabelText("Search pharmacy products"), {
      target: { value: "Amoxicillin" },
    });

    expect(
      screen.getByRole("heading", {
        name: "Amoxicillin 500 mg Capsules",
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByText("In Stock")).toHaveLength(2);

    const quantity = screen.getByRole("spinbutton", {
      name: "Quantity for Amoxicillin 500 mg Capsules",
    });

    fireEvent.change(quantity, {
      target: { value: "12" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Amoxicillin 500 mg Capsules to cart",
      }),
    );

    const cart = JSON.parse(
      sessionStorage.getItem(CART_STORAGE_KEY) ?? "[]",
    );

    expect(cart).toEqual([
      {
        productId: "amoxicillin-500",
        productName: "Amoxicillin 500 mg Capsules",
        packSize: "10 x 10 Capsules",
        quantity: 12,
        priceLabel: "Customer-specific",
      },
    ]);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Amoxicillin 500 mg Capsules added to cart.",
    );
  });

  it("filters products by dosage form and availability", () => {
    render(<PharmacyProductsPage />);

    fireEvent.change(screen.getByLabelText("Dosage form"), {
      target: { value: "Syrup" },
    });

    expect(screen.getAllByTestId("product-card")).toHaveLength(2);

    fireEvent.change(screen.getByLabelText("Availability"), {
      target: { value: "In Stock" },
    });

    expect(screen.getAllByTestId("product-card")).toHaveLength(1);

    expect(
      screen.getByRole("heading", {
        name: "Salbutamol Oral Syrup",
      }),
    ).toBeInTheDocument();
  });
});