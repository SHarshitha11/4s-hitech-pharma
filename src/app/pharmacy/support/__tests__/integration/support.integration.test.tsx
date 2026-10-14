import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import SupportPage from "@/app/pharmacy/support/page";

describe("Support page integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the support request form", () => {
    render(<SupportPage />);

    expect(
      screen.getByRole("heading", {
        name: "Returns & Product Support",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Order Number"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Product"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Quantity"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Description"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Supporting Documents / Images"),
    ).toBeInTheDocument();
  });

  it("validates required fields", () => {
    render(<SupportPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Submit Request",
      }),
    );

    expect(
      screen.getByText("Order number is required."),
    ).toBeInTheDocument();
  });

  it("submits a support request", () => {
    render(<SupportPage />);

    fireEvent.change(screen.getByLabelText("Order Number"), {
      target: { value: "ORD-TEST-12345" },
    });

    fireEvent.change(screen.getByLabelText("Product"), {
      target: { value: "Paracetamol 500 mg Tablets" },
    });

    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "2" },
    });

    fireEvent.change(screen.getByLabelText("Description"), {
      target: {
        value: "Two packs arrived damaged.",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Submit Request",
      }),
    );

    expect(
      screen.getByText("Support request submitted successfully"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("OPEN"),
    ).toBeInTheDocument();
  });

  it("rejects an unsupported attachment type", () => {
    render(<SupportPage />);

    const fileInput = screen.getByLabelText(
      "Supporting Documents / Images",
    );

    const file = new File(
      ["not allowed"],
      "notes.txt",
      { type: "text/plain" },
    );

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(
      screen.getByText(
        "Only JPG, PNG, and PDF files are allowed.",
      ),
    ).toBeInTheDocument();
  });
});
