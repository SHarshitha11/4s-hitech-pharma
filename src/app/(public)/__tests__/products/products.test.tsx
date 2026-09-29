import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProductsPage from "../../products/page";

describe("Products Catalogue", () => {
  it("renders the products catalogue heading", () => {
    render(<ProductsPage />);

    expect(
      screen.getByRole("heading", {
        name: "Pharmaceutical Products",
      }),
    ).toBeInTheDocument();
  });

  it("renders products on the first page", () => {
    render(<ProductsPage />);

    expect(
      screen.getByText("Sample Extended Release Tablet"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sample Injectable Product"),
    ).toBeInTheDocument();
  });

  it("filters products using the search field", () => {
    render(<ProductsPage />);

    const searchInput = screen.getByRole("searchbox", {
      name: "Search Products",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "capsule",
      },
    });

    expect(
      screen.getByText("Sample Pharmaceutical Capsule"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Sample Pharmaceutical Tablet"),
    ).not.toBeInTheDocument();
  });

  it("filters products by category", () => {
    render(<ProductsPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Injections",
      }),
    );

    expect(
      screen.getByText("Sample Injectable Product"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Sample Pharmaceutical Tablet"),
    ).not.toBeInTheDocument();
  });

  it("changes the product sorting option", () => {
    render(<ProductsPage />);

    const sortSelect = screen.getByRole("combobox", {
      name: "Sort By",
    });

    fireEvent.change(sortSelect, {
      target: {
        value: "availability",
      },
    });

    expect(sortSelect).toHaveValue("availability");
  });

  it("supports pagination", () => {
    render(<ProductsPage />);

    expect(
      screen.getByText("Page 1 of 2"),
    ).toBeInTheDocument();

    const firstPageProducts = screen.getAllByRole("link", {
      name: "View Details",
    });

    expect(firstPageProducts).toHaveLength(6);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(
      screen.getByText("Page 2 of 2"),
    ).toBeInTheDocument();

    const secondPageProducts = screen.getAllByRole("link", {
      name: "View Details",
    });

    expect(secondPageProducts).toHaveLength(6);
  });

  it("provides product detail links", () => {
    render(<ProductsPage />);

    const detailsLinks = screen.getAllByRole("link", {
      name: "View Details",
    });

    expect(detailsLinks.length).toBeGreaterThan(0);

    expect(detailsLinks[0]).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/products\/P\d+$/),
    );
  });

  it("shows a no-products message when the search has no match", () => {
    render(<ProductsPage />);

    const searchInput = screen.getByRole("searchbox", {
      name: "Search Products",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "product-that-does-not-exist",
      },
    });

    expect(
      screen.getByText("No Products Found"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Clear Search and Filters",
      }),
    ).toBeInTheDocument();
  });
});