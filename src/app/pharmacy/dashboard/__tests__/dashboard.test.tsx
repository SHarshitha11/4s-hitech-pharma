import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DashboardPage from "@/app/pharmacy/dashboard/page";

describe("Pharmacy Dashboard", () => {
  it("renders the dashboard summary cards", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Pending Orders")).toBeInTheDocument();
    expect(screen.getByText("Orders This Month")).toBeInTheDocument();
    expect(screen.getByText("Items in Cart")).toBeInTheDocument();
    expect(screen.getByText("Outstanding Amount")).toBeInTheDocument();
  });

  it("renders the quick actions", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Order Medicines" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Repeat Previous Order" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Track Orders" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "View Invoices" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact Support" })).toBeInTheDocument();
  });

  it("connects quick actions to the correct pharmacy routes", () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole("link", { name: "Browse Products" }),
    ).toHaveAttribute("href", "/pharmacy/products");

    expect(
      screen.getByRole("link", { name: "View Orders" }),
    ).toHaveAttribute("href", "/pharmacy/orders");

    expect(
      screen.getByRole("link", { name: "Track Orders" }),
    ).toHaveAttribute("href", "/pharmacy/orders");

    expect(
      screen.getByRole("link", { name: "Open Invoices" }),
    ).toHaveAttribute("href", "/pharmacy/invoices");

    expect(
      screen.getByRole("link", { name: "Get Support" }),
    ).toHaveAttribute("href", "/pharmacy/support");
  });

  it("renders recent orders and frequently ordered products", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Recent Orders")).toBeInTheDocument();
    expect(screen.getByText("#4SHP10021")).toBeInTheDocument();
    expect(screen.getByText("#4SHP10018")).toBeInTheDocument();

    expect(
      screen.getByText("Frequently Ordered Products"),
    ).toBeInTheDocument();

    expect(screen.getByText("Paracetamol 500 mg")).toBeInTheDocument();
    expect(screen.getByText("Amoxicillin 500 mg")).toBeInTheDocument();
    expect(screen.getByText("Pantoprazole 40 mg")).toBeInTheDocument();
  });

  it("shows the authenticated portal status", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Portal Status")).toBeInTheDocument();
    expect(screen.getByText("Authenticated")).toBeInTheDocument();
  });
});
