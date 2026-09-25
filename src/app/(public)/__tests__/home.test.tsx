import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "../page";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Home page", () => {
  it("renders the hero section", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /wholesale pharmaceutical supply, built around your pharmacy/i,
      }),
    ).toBeInTheDocument();

    const registerLinks = screen.getAllByRole("link", {
      name: /register your pharmacy/i,
    });

    expect(registerLinks.length).toBeGreaterThan(0);

    expect(
      screen.getByRole("link", {
        name: /login & order/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the business highlights section", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /a pharmacy-focused supply network/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Wholesale Pharmaceutical Distribution"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Selected In-House Manufactured Products"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pharmacy-Focused Ordering Platform"),
    ).toBeInTheDocument();
  });

  it("renders product categories", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /find the products your pharmacy needs/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Tablets")).toBeInTheDocument();
    expect(screen.getByText("Capsules")).toBeInTheDocument();
    expect(screen.getByText("Syrups")).toBeInTheDocument();
    expect(screen.getByText("Injections")).toBeInTheDocument();
  });

  it("renders the pharmacy ordering steps", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /a simple way to order for your pharmacy/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Register Your Pharmacy").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByText("Browse and Order"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Track Your Order"),
    ).toBeInTheDocument();
  });

  it("renders the FAQ section", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /frequently asked questions/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Who can register on the pharmacy platform?"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("How can I find pharmaceutical products?"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Can I track my pharmacy orders?"),
    ).toBeInTheDocument();
  });

  it("renders the contact preview", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /let's connect/i,
      }),
    ).toBeInTheDocument();

    const contactLinks = screen.getAllByRole("link", {
      name: "Contact Us",
    });

    expect(contactLinks.length).toBeGreaterThan(0);

    expect(contactLinks[0]).toHaveAttribute("href", "/contact");
  });
});
