import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminLayout from "@/app/admin/layout";
import { AUTH_STORAGE_KEY } from "@/lib/auth";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/dashboard",
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe("Admin shell integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
    replaceMock.mockReset();
  });

  it("renders the super admin shell", () => {
    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        authenticated: true,
        role: "SUPER_ADMIN",
        email: "admin@example.com",
        loggedInAt: new Date().toISOString(),
      }),
    );

    render(
      <AdminLayout>
        <div>Admin child content</div>
      </AdminLayout>,
    );

    expect(screen.getAllByText("Admin Operations Portal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Super Admin").length).toBeGreaterThan(0);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Pharmacies")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Admin child content")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("hides unauthorized navigation for operations staff", () => {
    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        authenticated: true,
        role: "OPERATIONS",
        email: "operations@example.com",
        loggedInAt: new Date().toISOString(),
      }),
    );

    render(
      <AdminLayout>
        <div>Operations content</div>
      </AdminLayout>,
    );

    expect(screen.getAllByText("Operations Staff").length).toBeGreaterThan(0);
    expect(screen.getByText("Pharmacies")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.queryByText("Products")).not.toBeInTheDocument();
    expect(screen.queryByText("Users")).not.toBeInTheDocument();
  });

  it("redirects an unauthenticated visitor to login", () => {
    render(
      <AdminLayout>
        <div>Protected admin content</div>
      </AdminLayout>,
    );

    expect(replaceMock).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Protected admin content")).not.toBeInTheDocument();
  });

  it("redirects a pharmacy user away from admin routes", () => {
    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        authenticated: true,
        role: "PHARMACY",
        email: "pharmacy@example.com",
        loggedInAt: new Date().toISOString(),
      }),
    );

    render(
      <AdminLayout>
        <div>Protected admin content</div>
      </AdminLayout>,
    );

    expect(replaceMock).toHaveBeenCalledWith("/pharmacy/dashboard");
    expect(screen.queryByText("Protected admin content")).not.toBeInTheDocument();
  });

  it("supports mobile navigation", () => {
    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        authenticated: true,
        role: "SUPER_ADMIN",
        email: "admin@example.com",
        loggedInAt: new Date().toISOString(),
      }),
    );

    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>,
    );

    const menuButton = screen.getByRole("button", {
      name: "Open admin navigation",
    });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Mobile admin navigation" }),
    ).toBeInTheDocument();
  });
});