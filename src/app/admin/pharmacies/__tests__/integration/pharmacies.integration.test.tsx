import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import PharmaciesPage from "@/app/admin/pharmacies/page";
import { AUTH_STORAGE_KEY } from "@/lib/auth";

describe("Pharmacy Management integration", () => {
  beforeEach(() => {
    sessionStorage.clear();

    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        authenticated: true,
        role: "SUPER_ADMIN",
        email: "admin@example.com",
        loggedInAt: new Date().toISOString(),
      }),
    );
  });

  it("renders pharmacy list and search controls", () => {
    render(<PharmaciesPage />);

    expect(screen.getByText("Sri Lakshmi Medicals")).toBeInTheDocument();
    expect(screen.getByText("Apollo Care Pharmacy")).toBeInTheDocument();
    expect(screen.getByLabelText("Search Pharmacies")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Status")).toBeInTheDocument();
  });

  it("filters pharmacies by search text", () => {
    render(<PharmaciesPage />);

    fireEvent.change(screen.getByLabelText("Search Pharmacies"), {
      target: { value: "Apollo" },
    });

    expect(screen.getByText("Apollo Care Pharmacy")).toBeInTheDocument();
    expect(screen.queryByText("Sri Lakshmi Medicals")).not.toBeInTheDocument();
  });

  it("filters pharmacies by status", () => {
    render(<PharmaciesPage />);

    fireEvent.change(screen.getByLabelText("Filter by Status"), {
      target: { value: "PENDING" },
    });

    expect(screen.getByText("Sri Lakshmi Medicals")).toBeInTheDocument();
    expect(screen.queryByText("Apollo Care Pharmacy")).not.toBeInTheDocument();
  });

  it("opens registration review details", () => {
    render(<PharmaciesPage />);

    fireEvent.click(
      screen.getAllByRole("button", { name: "View" })[0],
    );

    expect(
      screen.getByText("Pharmacy Registration Review"),
    ).toBeInTheDocument();

    expect(screen.getByText("DL-KA-1001")).toBeInTheDocument();
    expect(screen.getByText("GSTKA1001")).toBeInTheDocument();
  });

  it("requires confirmation before changing status", () => {
    render(<PharmaciesPage />);

    fireEvent.click(
      screen.getAllByRole("button", { name: "Approve" })[0],
    );

    expect(
      screen.getByText("Confirm Pharmacy Status Change"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(
      screen.getByText(
        "Sri Lakshmi Medicals is now Approved.",
      ),
    ).toBeInTheDocument();
  });

  it("requires a reason for rejection", () => {
    render(<PharmaciesPage />);

    fireEvent.click(
      screen.getAllByRole("button", { name: "Reject" })[0],
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(
      screen.getByText(
        "A reason is required for reject or suspend actions.",
      ),
    ).toBeInTheDocument();
  });

  it("shows pharmacy documents and orders", () => {
    render(<PharmaciesPage />);

    fireEvent.click(
      screen.getAllByRole("button", { name: "Documents" })[0],
    );

    expect(screen.getByText("Pharmacy Documents")).toBeInTheDocument();
    expect(screen.getByText("Drug-Licence.pdf")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

    fireEvent.click(
      screen.getAllByRole("button", { name: "Orders" })[0],
    );

    expect(screen.getByText("Pharmacy Orders")).toBeInTheDocument();
    expect(screen.getByText("ORD-10001")).toBeInTheDocument();
  });
});