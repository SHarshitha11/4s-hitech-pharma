import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "../../page";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Home page integration", () => {
  it("connects the product category links to the products route", () => {
    render(<Home />);

    const productLinks = screen.getAllByRole("link", {
      name: /explore products/i,
    });

    expect(productLinks.length).toBeGreaterThan(0);

    productLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/products");
    });
  });

  it("connects distribution and manufacturing sections to their routes", () => {
    render(<Home />);

    expect(
      screen.getByRole("link", {
        name: /explore distribution/i,
      }),
    ).toHaveAttribute("href", "/distribution");

    expect(
      screen.getByRole("link", {
        name: /explore manufacturing/i,
      }),
    ).toHaveAttribute("href", "/manufacturing");
  });

  it("connects pharmacy actions to the correct routes", () => {
    render(<Home />);

    const registerLinks = screen.getAllByRole("link", {
      name: /register your pharmacy/i,
    });

    expect(registerLinks.length).toBeGreaterThan(0);

    registerLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/register-pharmacy");
    });

    expect(
      screen.getByRole("link", {
        name: /login & order/i,
      }),
    ).toHaveAttribute("href", "/pharmacy/dashboard");
  });

  it("connects the contact preview to the contact page", () => {
    render(<Home />);

    const contactLinks = screen.getAllByRole("link", {
      name: "Contact Us",
    });

    expect(contactLinks.length).toBeGreaterThan(0);

    contactLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/contact");
    });
  });
});
