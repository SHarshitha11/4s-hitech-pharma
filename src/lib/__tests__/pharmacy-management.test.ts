import { beforeEach, describe, expect, it } from "vitest";

import {
  DEFAULT_MANAGED_PHARMACIES,
  getManagedPharmacies,
  getPharmacyStatusLabel,
  updatePharmacyDetails,
  updatePharmacyStatus,
} from "@/lib/pharmacy-management";

describe("Pharmacy management utilities", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("loads the default pharmacy records", () => {
    const pharmacies = getManagedPharmacies();

    expect(pharmacies).toHaveLength(DEFAULT_MANAGED_PHARMACIES.length);
    expect(pharmacies[0].businessName).toBe("Sri Lakshmi Medicals");
  });

  it("updates pharmacy status", () => {
    const pharmacy = updatePharmacyStatus("PH-1001", "APPROVED");

    expect(pharmacy?.status).toBe("APPROVED");
    expect(getManagedPharmacies()[0].status).toBe("APPROVED");
  });

  it("updates pharmacy contact details", () => {
    const pharmacy = updatePharmacyDetails("PH-1001", {
      businessName: "Updated Medicals",
      contactPerson: "Updated Contact",
      phone: "9876509999",
      email: "updated@example.com",
    });

    expect(pharmacy?.businessName).toBe("Updated Medicals");
    expect(pharmacy?.contactPerson).toBe("Updated Contact");
    expect(pharmacy?.phone).toBe("9876509999");
    expect(pharmacy?.email).toBe("updated@example.com");
  });

  it("returns readable status labels", () => {
    expect(getPharmacyStatusLabel("PENDING")).toBe("Pending Review");
    expect(getPharmacyStatusLabel("APPROVED")).toBe("Approved");
    expect(getPharmacyStatusLabel("REJECTED")).toBe("Rejected");
    expect(getPharmacyStatusLabel("SUSPENDED")).toBe("Suspended");
    expect(getPharmacyStatusLabel("ACTIVE")).toBe("Active");
  });
});