import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PharmacyLayout from "@/app/pharmacy/layout";

const { replaceMock, clearAuthSessionMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  clearAuthSessionMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/pharmacy/dashboard",
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock("@/lib/auth", () => ({
  clearAuthSession: clearAuthSessionMock,
}));

describe("Pharmacy Portal Shell", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    clearAuthSessionMock.mockReset();
  });

  it("renders the pharmacy navigation links", () => {
    render(
      <PharmacyLayout>
        <div>Dashboard Content</div>
      </PharmacyLayout>,
    );

    expect(screen.getByText("4S HITECH PHARMA")).toBeInTheDocument();
    expect(screen.getAllByText("Pharmacy Partner Portal")).toHaveLength(2);

    expect(
      screen.getByRole("navigation", {
        name: "Pharmacy navigation",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Dashboard" }),
    ).toHaveAttribute("href", "/pharmacy/dashboard");

    expect(
      screen.getByRole("link", { name: "Products" }),
    ).toHaveAttribute("href", "/pharmacy/products");

    expect(
      screen.getByRole("link", { name: "Cart" }),
    ).toHaveAttribute("href", "/pharmacy/cart");

    expect(
      screen.getByRole("link", { name: "Orders" }),
    ).toHaveAttribute("href", "/pharmacy/orders");

    expect(
      screen.getByRole("link", { name: "Invoices" }),
    ).toHaveAttribute("href", "/pharmacy/invoices");

    expect(
      screen.getByRole("link", { name: "Support" }),
    ).toHaveAttribute("href", "/pharmacy/support");

    expect(
      screen.getByRole("link", { name: "Profile" }),
    ).toHaveAttribute("href", "/pharmacy/profile");
  });

  it("opens the mobile navigation", () => {
    render(
      <PharmacyLayout>
        <div>Dashboard Content</div>
      </PharmacyLayout>,
    );

    const menuButton = screen.getByRole("button", {
      name: "Open pharmacy navigation",
    });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    expect(
      screen.getByRole("navigation", {
        name: "Mobile pharmacy navigation",
      }),
    ).toBeInTheDocument();
  });

  it("closes mobile navigation after selecting a mobile link", () => {
    render(
      <PharmacyLayout>
        <div>Dashboard Content</div>
      </PharmacyLayout>,
    );

    const menuButton = screen.getByRole("button", {
      name: "Open pharmacy navigation",
    });

    fireEvent.click(menuButton);

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile pharmacy navigation",
    });

    const productsLink = Array.from(
      mobileNavigation.querySelectorAll("a"),
    ).find((link) => link.textContent?.trim() === "Products");

    expect(productsLink).toBeDefined();

    fireEvent.click(productsLink as HTMLAnchorElement);

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("logs out and redirects to login", () => {
    render(
      <PharmacyLayout>
        <div>Dashboard Content</div>
      </PharmacyLayout>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(clearAuthSessionMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/login");
  });
});
