import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProductDetailsPage from "@/app/(public)/products/[id]/page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

describe("Product Details Page", () => {
  it("renders the product name", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(
      screen.getByRole("heading", {
        name: "Sample Pharmaceutical Tablet",
      }),
    ).toBeInTheDocument();
  });

  it("renders the product category", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(screen.getByText("Tablets")).toBeInTheDocument();
  });

  it("renders the product code", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(screen.getByText("MOCK-TAB-001")).toBeInTheDocument();
  });

  it("renders the brand name", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(screen.getByText("Sample Brand")).toBeInTheDocument();
  });

  it("renders the manufacturer", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(screen.getByText("Sample Manufacturer")).toBeInTheDocument();
  });

  it("renders the composition", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(screen.getByText("Sample Composition")).toBeInTheDocument();
  });

  it("renders the availability status", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("renders a back to products link", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    const productsLink = screen.getByRole("link", {
      name: /back to products/i,
    });

    expect(productsLink).toHaveAttribute("href", "/products");
  });
});