import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import RegisterPharmacyPage from "@/app/(public)/register-pharmacy/page";

function fillBusinessStep() {
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
}

function fillRegulatoryStep() {
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
}

function fillAddressStep() {
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
}

function fillDocumentsStep() {
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
}

describe("Pharmacy Registration Integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("completes the full five-step registration workflow", () => {
    render(<RegisterPharmacyPage />);

    fillBusinessStep();

    expect(
      screen.getByRole("heading", {
        name: /Step 2 .* Regulatory Details/,
      }),
    ).toBeInTheDocument();

    fillRegulatoryStep();

    expect(
      screen.getByRole("heading", {
        name: /Step 3 .* Address/,
      }),
    ).toBeInTheDocument();

    fillAddressStep();

    expect(
      screen.getByRole("heading", {
        name: /Step 4 .* Documents/,
      }),
    ).toBeInTheDocument();

    fillDocumentsStep();

    expect(
      screen.getByRole("heading", {
        name: /Step 5 .* Review & Submit/,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sample Pharmacy"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("drug-licence.pdf"),
    ).toBeInTheDocument();

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

  it("keeps entered data when moving between steps", () => {
    render(<RegisterPharmacyPage />);

    fillBusinessStep();
    fillRegulatoryStep();

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
        name: "Back",
      }),
    );

    expect(
      screen.getByLabelText("Drug Licence Number *"),
    ).toHaveValue("DL-12345");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(
      screen.getByLabelText("Business Name *"),
    ).toHaveValue("Sample Pharmacy");

    expect(
      screen.getByLabelText("Phone *"),
    ).toHaveValue("9876543210");

    expect(
      screen.getByLabelText("Email *"),
    ).toHaveValue("sample@example.com");
  });

  it("blocks an invalid submission before reaching the review step", () => {
    render(<RegisterPharmacyPage />);

    fillBusinessStep();
    fillRegulatoryStep();

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
      screen.getByRole("heading", {
        name: /Step 3 .* Address/,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: /Step 4 .* Documents/,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: /Step 5 .* Review & Submit/,
      }),
    ).not.toBeInTheDocument();
  });
});