import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumb } from "../breadcrumb";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

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

describe("Breadcrumb", () => {
  it("does not render on the home page", () => {
    mockUsePathname.mockReturnValue("/");

    const { container } = render(<Breadcrumb />);

    expect(container.firstChild).toBeNull();
  });

  it("renders Home and the current page", () => {
    mockUsePathname.mockReturnValue("/about");

    render(<Breadcrumb />);

    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );

    expect(screen.getByText("About")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders the correct label for the pharmacy registration route", () => {
    mockUsePathname.mockReturnValue("/register-pharmacy");

    render(<Breadcrumb />);

    expect(screen.getByText("Register Pharmacy")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});