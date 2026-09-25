import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "../footer";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  it("renders the site name and footer navigation", () => {
    render(<Footer />);

    expect(screen.getByText("4S HITECH PHARMA")).toBeInTheDocument();

    expect(
      screen.getByRole("navigation", { name: "Footer navigation" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );

    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/products",
    );

    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("renders the pharmacy registration CTA", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: "Register Your Pharmacy" }),
    ).toHaveAttribute("href", "/register-pharmacy");
  });

  it("renders the copyright notice", () => {
    render(<Footer />);

    expect(
      screen.getByText(/4S HITECH PHARMA\. All rights reserved\./),
    ).toBeInTheDocument();
  });
});