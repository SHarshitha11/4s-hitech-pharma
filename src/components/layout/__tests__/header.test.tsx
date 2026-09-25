import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "../header";

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

describe("Header", () => {
  it("renders the site name and primary navigation", () => {
    render(<Header />);

    expect(screen.getByText("4S HITECH PHARMA")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );

    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/products",
    );
  });

  it("renders the pharmacy registration CTA", () => {
    render(<Header />);

    expect(
      screen.getAllByRole("link", { name: "Register Your Pharmacy" }),
    ).toHaveLength(1);
  });

  it("opens and closes the mobile navigation menu", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).toBeNull();

    fireEvent.click(menuButton);

    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Close navigation menu" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Close navigation menu" }),
    );

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).toBeNull();
  });
});