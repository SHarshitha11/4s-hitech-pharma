import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import RegisterPharmacyPage from "@/app/(public)/register-pharmacy/page";

describe("Pharmacy Registration Page", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the pharmacy registration heading", () => {
    render(<RegisterPharmacyPage />);

    expect(
      screen.getByRole("heading", {
        name: "Register Your Pharmacy",
      }),
    ).toBeInTheDocument();
  });

  it("renders all five registration steps", () => {
    render(<RegisterPharmacyPage />);

    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("Regulatory")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("blocks step one when required fields are empty", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    expect(
      screen.getAllByText("Business name is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("Business type is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("Owner name is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("Contact person is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("Phone number is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("Email is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByRole("heading", {
        name: /Step 1 .* Business Details/,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: /Step 2 .* Regulatory Details/,
      }),
    ).not.toBeInTheDocument();
  });

  it("moves from business details to regulatory details with valid data", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.change(screen.getByLabelText("Business Name *"), {
      target: { value: "Sample Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Business Type *"), {
      target: { value: "Retail Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Owner Name *"), {
      target: { value: "Sample Owner" },
    });

    fireEvent.change(screen.getByLabelText("Contact Person *"), {
      target: { value: "Sample Contact" },
    });

    fireEvent.change(screen.getByLabelText("Phone *"), {
      target: { value: "9876543210" },
    });

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "sample@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: /Step 2 .* Regulatory Details/,
      }),
    ).toBeInTheDocument();
  });

  it("persists business data when navigating back from the next step", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.change(screen.getByLabelText("Business Name *"), {
      target: { value: "Sample Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Business Type *"), {
      target: { value: "Retail Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Owner Name *"), {
      target: { value: "Sample Owner" },
    });

    fireEvent.change(screen.getByLabelText("Contact Person *"), {
      target: { value: "Sample Contact" },
    });

    fireEvent.change(screen.getByLabelText("Phone *"), {
      target: { value: "9876543210" },
    });

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "sample@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(
      screen.getByLabelText("Business Name *"),
    ).toHaveValue("Sample Pharmacy");

    expect(
      screen.getByLabelText("Business Type *"),
    ).toHaveValue("Retail Pharmacy");

    expect(
      screen.getByLabelText("Owner Name *"),
    ).toHaveValue("Sample Owner");

    expect(
      screen.getByLabelText("Contact Person *"),
    ).toHaveValue("Sample Contact");

    expect(
      screen.getByLabelText("Phone *"),
    ).toHaveValue("9876543210");

    expect(
      screen.getByLabelText("Email *"),
    ).toHaveValue("sample@example.com");
  });

  it("blocks invalid regulatory information", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.change(screen.getByLabelText("Business Name *"), {
      target: { value: "Sample Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Business Type *"), {
      target: { value: "Retail Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Owner Name *"), {
      target: { value: "Sample Owner" },
    });

    fireEvent.change(screen.getByLabelText("Contact Person *"), {
      target: { value: "Sample Contact" },
    });

    fireEvent.change(screen.getByLabelText("Phone *"), {
      target: { value: "9876543210" },
    });

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "sample@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(
      screen.getByLabelText("Drug Licence Number *"),
      {
        target: { value: "DL-12345" },
      },
    );

    fireEvent.change(screen.getByLabelText("Licence Expiry *"), {
      target: { value: "2000-01-01" },
    });

    fireEvent.change(screen.getByLabelText("GST Number *"), {
      target: { value: "INVALID" },
    });

    fireEvent.change(screen.getByLabelText("PAN *"), {
      target: { value: "INVALID" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    expect(
      screen.getAllByText(
        "Licence expiry date must be in the future.",
      ).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        "GST number must contain 15 uppercase letters and numbers.",
      ).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("Enter a valid PAN number.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByRole("heading", {
        name: /Step 2 .* Regulatory Details/,
      }),
    ).toBeInTheDocument();
  });

  it("validates the address step", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.change(screen.getByLabelText("Business Name *"), {
      target: { value: "Sample Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Business Type *"), {
      target: { value: "Retail Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Owner Name *"), {
      target: { value: "Sample Owner" },
    });

    fireEvent.change(screen.getByLabelText("Contact Person *"), {
      target: { value: "Sample Contact" },
    });

    fireEvent.change(screen.getByLabelText("Phone *"), {
      target: { value: "9876543210" },
    });

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "sample@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(
      screen.getByLabelText("Drug Licence Number *"),
      {
        target: { value: "DL-12345" },
      },
    );

    fireEvent.change(screen.getByLabelText("Licence Expiry *"), {
      target: { value: "2099-12-31" },
    });

    fireEvent.change(screen.getByLabelText("GST Number *"), {
      target: { value: "29ABCDE1234F1Z5" },
    });

    fireEvent.change(screen.getByLabelText("PAN *"), {
      target: { value: "ABCDE1234F" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: /Step 3 .* Address/,
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    expect(
      screen.getAllByText("Address is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("City is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("State is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("PIN code is required.").length,
    ).toBeGreaterThan(0);
  });

  it("renders document upload fields", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.change(screen.getByLabelText("Business Name *"), {
      target: { value: "Sample Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Business Type *"), {
      target: { value: "Retail Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Owner Name *"), {
      target: { value: "Sample Owner" },
    });

    fireEvent.change(screen.getByLabelText("Contact Person *"), {
      target: { value: "Sample Contact" },
    });

    fireEvent.change(screen.getByLabelText("Phone *"), {
      target: { value: "9876543210" },
    });

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "sample@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(
      screen.getByLabelText("Drug Licence Number *"),
      {
        target: { value: "DL-12345" },
      },
    );

    fireEvent.change(screen.getByLabelText("Licence Expiry *"), {
      target: { value: "2099-12-31" },
    });

    fireEvent.change(screen.getByLabelText("GST Number *"), {
      target: { value: "29ABCDE1234F1Z5" },
    });

    fireEvent.change(screen.getByLabelText("PAN *"), {
      target: { value: "ABCDE1234F" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(screen.getByLabelText("Address *"), {
      target: { value: "123 Main Street" },
    });

    fireEvent.change(screen.getByLabelText("City *"), {
      target: { value: "Bengaluru" },
    });

    fireEvent.change(screen.getByLabelText("State *"), {
      target: { value: "Karnataka" },
    });

    fireEvent.change(screen.getByLabelText("PIN *"), {
      target: { value: "560001" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    expect(
      screen.getByLabelText("Drug Licence *"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("GST Certificate *"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("PAN Document *"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Other Documents"),
    ).toBeInTheDocument();
  });

  it("blocks submission when required documents are missing", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.change(screen.getByLabelText("Business Name *"), {
      target: { value: "Sample Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Business Type *"), {
      target: { value: "Retail Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Owner Name *"), {
      target: { value: "Sample Owner" },
    });

    fireEvent.change(screen.getByLabelText("Contact Person *"), {
      target: { value: "Sample Contact" },
    });

    fireEvent.change(screen.getByLabelText("Phone *"), {
      target: { value: "9876543210" },
    });

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "sample@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(
      screen.getByLabelText("Drug Licence Number *"),
      {
        target: { value: "DL-12345" },
      },
    );

    fireEvent.change(screen.getByLabelText("Licence Expiry *"), {
      target: { value: "2099-12-31" },
    });

    fireEvent.change(screen.getByLabelText("GST Number *"), {
      target: { value: "29ABCDE1234F1Z5" },
    });

    fireEvent.change(screen.getByLabelText("PAN *"), {
      target: { value: "ABCDE1234F" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(screen.getByLabelText("Address *"), {
      target: { value: "123 Main Street" },
    });

    fireEvent.change(screen.getByLabelText("City *"), {
      target: { value: "Bengaluru" },
    });

    fireEvent.change(screen.getByLabelText("State *"), {
      target: { value: "Karnataka" },
    });

    fireEvent.change(screen.getByLabelText("PIN *"), {
      target: { value: "560001" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    expect(
      screen.getAllByText("Drug licence document is required.")
        .length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("GST certificate is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("PAN document is required.").length,
    ).toBeGreaterThan(0);

    expect(
      screen.queryByRole("heading", {
        name: /Step 5 .* Review & Submit/,
      }),
    ).not.toBeInTheDocument();
  });

  it("shows the review page after completing the first four steps", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.change(screen.getByLabelText("Business Name *"), {
      target: { value: "Sample Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Business Type *"), {
      target: { value: "Retail Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Owner Name *"), {
      target: { value: "Sample Owner" },
    });

    fireEvent.change(screen.getByLabelText("Contact Person *"), {
      target: { value: "Sample Contact" },
    });

    fireEvent.change(screen.getByLabelText("Phone *"), {
      target: { value: "9876543210" },
    });

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "sample@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(
      screen.getByLabelText("Drug Licence Number *"),
      {
        target: { value: "DL-12345" },
      },
    );

    fireEvent.change(screen.getByLabelText("Licence Expiry *"), {
      target: { value: "2099-12-31" },
    });

    fireEvent.change(screen.getByLabelText("GST Number *"), {
      target: { value: "29ABCDE1234F1Z5" },
    });

    fireEvent.change(screen.getByLabelText("PAN *"), {
      target: { value: "ABCDE1234F" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(screen.getByLabelText("Address *"), {
      target: { value: "123 Main Street" },
    });

    fireEvent.change(screen.getByLabelText("City *"), {
      target: { value: "Bengaluru" },
    });

    fireEvent.change(screen.getByLabelText("State *"), {
      target: { value: "Karnataka" },
    });

    fireEvent.change(screen.getByLabelText("PIN *"), {
      target: { value: "560001" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    const licenceFile = new File(
      ["drug licence"],
      "drug-licence.pdf",
      {
        type: "application/pdf",
      },
    );

    const gstFile = new File(
      ["gst certificate"],
      "gst-certificate.pdf",
      {
        type: "application/pdf",
      },
    );

    const panFile = new File(
      ["pan document"],
      "pan-document.pdf",
      {
        type: "application/pdf",
      },
    );

    fireEvent.change(screen.getByLabelText("Drug Licence *"), {
      target: { files: [licenceFile] },
    });

    fireEvent.change(screen.getByLabelText("GST Certificate *"), {
      target: { files: [gstFile] },
    });

    fireEvent.change(screen.getByLabelText("PAN Document *"), {
      target: { files: [panFile] },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: /Step 5 .* Review & Submit/,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sample Pharmacy"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Bengaluru/),
    ).toBeInTheDocument();

    expect(
      screen.getByText("drug-licence.pdf"),
    ).toBeInTheDocument();
  });

  it("submits a valid registration and shows pending verification", () => {
    render(<RegisterPharmacyPage />);

    fireEvent.change(screen.getByLabelText("Business Name *"), {
      target: { value: "Sample Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Business Type *"), {
      target: { value: "Retail Pharmacy" },
    });

    fireEvent.change(screen.getByLabelText("Owner Name *"), {
      target: { value: "Sample Owner" },
    });

    fireEvent.change(screen.getByLabelText("Contact Person *"), {
      target: { value: "Sample Contact" },
    });

    fireEvent.change(screen.getByLabelText("Phone *"), {
      target: { value: "9876543210" },
    });

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "sample@example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(
      screen.getByLabelText("Drug Licence Number *"),
      {
        target: { value: "DL-12345" },
      },
    );

    fireEvent.change(screen.getByLabelText("Licence Expiry *"), {
      target: { value: "2099-12-31" },
    });

    fireEvent.change(screen.getByLabelText("GST Number *"), {
      target: { value: "29ABCDE1234F1Z5" },
    });

    fireEvent.change(screen.getByLabelText("PAN *"), {
      target: { value: "ABCDE1234F" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.change(screen.getByLabelText("Address *"), {
      target: { value: "123 Main Street" },
    });

    fireEvent.change(screen.getByLabelText("City *"), {
      target: { value: "Bengaluru" },
    });

    fireEvent.change(screen.getByLabelText("State *"), {
      target: { value: "Karnataka" },
    });

    fireEvent.change(screen.getByLabelText("PIN *"), {
      target: { value: "560001" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    const licenceFile = new File(
      ["drug licence"],
      "drug-licence.pdf",
      {
        type: "application/pdf",
      },
    );

    const gstFile = new File(
      ["gst certificate"],
      "gst-certificate.pdf",
      {
        type: "application/pdf",
      },
    );

    const panFile = new File(
      ["pan document"],
      "pan-document.pdf",
      {
        type: "application/pdf",
      },
    );

    fireEvent.change(screen.getByLabelText("Drug Licence *"), {
      target: { files: [licenceFile] },
    });

    fireEvent.change(screen.getByLabelText("GST Certificate *"), {
      target: { files: [gstFile] },
    });

    fireEvent.change(screen.getByLabelText("PAN Document *"), {
      target: { files: [panFile] },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save & Continue",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Submit Registration",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Registration Submitted",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pending Verification"),
    ).toBeInTheDocument();
  });
});