import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProductDetailsPage from "@/app/(public)/products/[id]/page";

const notFoundMock = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
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

  it("renders strength, dosage form and pack size", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(screen.getByText("500 mg")).toBeInTheDocument();
    expect(screen.getByText("Tablet")).toBeInTheDocument();
    expect(screen.getByText("10 tablets")).toBeInTheDocument();
  });

  it("renders the availability status", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("renders the ordering CTA", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    const orderingLink = screen.getByRole("link", {
      name: "Start Ordering",
    });

    expect(orderingLink).toHaveAttribute("href", "/register-pharmacy");
  });

  it("renders the product enquiry CTA", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    const enquiryLink = screen.getByRole("link", {
      name: "Product Enquiry",
    });

    expect(enquiryLink).toHaveAttribute("href", "/contact");
  });

  it("renders a back to products link", async () => {
    const page = await ProductDetailsPage({
      params: Promise.resolve({ id: "P001" }),
    });

    render(page);

    const productsLink = screen.getByRole("link", {
      name: "Back to Products",
    });

    expect(productsLink).toHaveAttribute("href", "/products");
  });

  it("handles a missing product", async () => {
    await ProductDetailsPage({
      params: Promise.resolve({ id: "INVALID-ID" }),
    });

    expect(notFoundMock).toHaveBeenCalled();
  });
});