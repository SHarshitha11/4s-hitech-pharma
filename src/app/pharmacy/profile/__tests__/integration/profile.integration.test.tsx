import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ProfilePage from "@/app/pharmacy/profile/page";

describe("Pharmacy Profile integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders all required profile sections", () => {
    render(<ProfilePage />);

    expect(
      screen.getByRole("heading", {
        name: "Pharmacy Profile",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Business Details",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Regulatory Information",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Contact Information",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Delivery Addresses",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Documents",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Password / Security",
      }),
    ).toBeInTheDocument();
  });

  it("saves business and contact details", () => {
    render(<ProfilePage />);

    const businessName = screen.getByLabelText("Business Name");

    fireEvent.change(businessName, {
      target: { value: "City Care Pharmacy" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Business Details",
      }),
    );

    expect(
      screen.getByText("Business details saved."),
    ).toBeInTheDocument();

    const contact = screen.getByLabelText("Contact Person");

    fireEvent.change(contact, {
      target: { value: "New Contact" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Contact Information",
      }),
    );

    expect(
      screen.getByText("Contact details saved."),
    ).toBeInTheDocument();
  });

  it("validates regulatory details", () => {
    render(<ProfilePage />);

    const licence = screen.getByLabelText(
      "Drug Licence Number",
    );

    fireEvent.change(licence, {
      target: { value: "" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Regulatory Details",
      }),
    );

    expect(
      screen.getByText("Drug licence number is required."),
    ).toBeInTheDocument();
  });

  it("validates and saves the primary address", () => {
    render(<ProfilePage />);

    const pin = screen.getByLabelText("PIN Code");

    fireEvent.change(pin, {
      target: { value: "5600" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Primary Address",
      }),
    );

    expect(
      screen.getByText("PIN code must contain 6 digits."),
    ).toBeInTheDocument();

    fireEvent.change(pin, {
      target: { value: "560002" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Primary Address",
      }),
    );

    expect(
      screen.getByText("Primary address saved."),
    ).toBeInTheDocument();
  });

  it("adds a delivery address", () => {
    render(<ProfilePage />);

    fireEvent.change(
      screen.getByLabelText("Address Label"),
      {
        target: { value: "Warehouse" },
      },
    );

    fireEvent.change(
      screen.getByLabelText("Address"),
      {
        target: { value: "20 Industrial Road" },
      },
    );

    fireEvent.change(
      screen.getByLabelText("Delivery City"),
      {
        target: { value: "Bengaluru" },
      },
    );

    fireEvent.change(
      screen.getByLabelText("Delivery State"),
      {
        target: { value: "Karnataka" },
      },
    );

    fireEvent.change(
      screen.getByLabelText("Delivery PIN Code"),
      {
        target: { value: "560003" },
      },
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Delivery Address",
      }),
    );

    expect(
      screen.getByText("Warehouse address added."),
    ).toBeInTheDocument();
  });

  it("uploads a valid document", () => {
    render(<ProfilePage />);

    const input = screen.getByLabelText("Upload Document");

    const file = new File(
      ["demo"],
      "gst-certificate.pdf",
      { type: "application/pdf" },
    );

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(
      screen.getByText(
        "gst-certificate.pdf uploaded and marked for review.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("gst-certificate.pdf"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("PENDING REVIEW"),
    ).toBeInTheDocument();
  });

  it("rejects invalid document types", () => {
    render(<ProfilePage />);

    const input = screen.getByLabelText("Upload Document");

    const file = new File(
      ["not allowed"],
      "notes.txt",
      { type: "text/plain" },
    );

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(
      screen.getByText(
        "Only PDF, JPG, and PNG documents are allowed.",
      ),
    ).toBeInTheDocument();
  });

  it("validates and prepares a password update", () => {
    render(<ProfilePage />);

    fireEvent.change(
      screen.getByLabelText("Current Password"),
      {
        target: { value: "" },
      },
    );

    fireEvent.change(
      screen.getByLabelText("New Password"),
      {
        target: { value: "NewPassword123" },
      },
    );

    fireEvent.change(
      screen.getByLabelText("Confirm New Password"),
      {
        target: { value: "NewPassword123" },
      },
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    expect(
      screen.getByText("Current password is required."),
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByLabelText("Current Password"),
      {
        target: { value: "OldPassword123" },
      },
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Password",
      }),
    );

    expect(
      screen.getByText(
        "Password update request is ready for API integration.",
      ),
    ).toBeInTheDocument();
  });
});
