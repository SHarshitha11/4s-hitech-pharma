import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import InvoicesPage from "@/app/pharmacy/invoices/page";

describe("Invoice page integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("displays invoice records", () => {
    render(<InvoicesPage />);

    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("INV-002")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "View Invoice" }),
    ).toHaveLength(2);
  });

  it("filters invoices by search and status", () => {
    render(<InvoicesPage />);

    const search = screen.getByRole("searchbox", {
      name: "Search Invoices",
    });

    fireEvent.change(search, {
      target: { value: "INV-002" },
    });

    expect(screen.getByText("INV-002")).toBeInTheDocument();
    expect(screen.queryByText("INV-001")).not.toBeInTheDocument();

    fireEvent.change(search, {
      target: { value: "" },
    });

    const status = screen.getByRole("combobox", {
      name: "Invoice Status",
    });

    fireEvent.change(status, {
      target: { value: "PAID" },
    });

    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.queryByText("INV-002")).not.toBeInTheDocument();
  });

  it("filters invoices by date", () => {
    render(<InvoicesPage />);

    const date = screen.getByLabelText("Invoice Date");

    fireEvent.change(date, {
      target: { value: "2026-10-14" },
    });

    expect(screen.getByText("INV-002")).toBeInTheDocument();
    expect(screen.queryByText("INV-001")).not.toBeInTheDocument();
  });

  it("links to invoice details", () => {
    render(<InvoicesPage />);

    const links = screen.getAllByRole("link", {
      name: "View Invoice",
    });

    expect(links[0]).toHaveAttribute(
      "href",
      "/pharmacy/invoices/INV-001",
    );
  });
});
