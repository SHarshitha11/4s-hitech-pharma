import { beforeEach, describe, expect, it } from "vitest";
import {
  addDeliveryAddress,
  createDocumentRecord,
  getPharmacyProfile,
  markPasswordUpdateReady,
  removeDeliveryAddress,
  saveBusinessDetails,
  saveContactDetails,
  savePrimaryAddress,
  saveRegulatoryDetails,
  saveDocuments,
  validateProfilePassword,
} from "@/lib/pharmacy-profile";

describe("pharmacy profile helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("loads the default pharmacy profile", () => {
    const profile = getPharmacyProfile();

    expect(profile.businessName).toBe(
      "4S HITECH PHARMA Pharmacy",
    );
    expect(profile.email).toBe("pharmacy@example.com");
    expect(profile.addresses).toHaveLength(1);
  });

  it("saves business details", () => {
    const profile = saveBusinessDetails({
      businessName: "City Care Pharmacy",
      businessType: "Medical Store",
      ownerName: "Test Owner",
    });

    expect(profile.businessName).toBe("City Care Pharmacy");
    expect(profile.businessType).toBe("Medical Store");
    expect(profile.ownerName).toBe("Test Owner");
  });

  it("saves regulatory details", () => {
    const profile = saveRegulatoryDetails({
      drugLicenceNumber: "DL-12345",
      licenceExpiry: "2028-01-31",
      gstNumber: "GST12345",
      pan: "ABCDE1234F",
    });

    expect(profile.drugLicenceNumber).toBe("DL-12345");
    expect(profile.licenceExpiry).toBe("2028-01-31");
    expect(profile.gstNumber).toBe("GST12345");
    expect(profile.pan).toBe("ABCDE1234F");
  });

  it("saves contact details", () => {
    const profile = saveContactDetails({
      contactPerson: "Test Contact",
      phone: "9000000000",
      email: "test@example.com",
    });

    expect(profile.contactPerson).toBe("Test Contact");
    expect(profile.phone).toBe("9000000000");
    expect(profile.email).toBe("test@example.com");
  });

  it("saves the primary address", () => {
    const profile = savePrimaryAddress({
      businessAddress: "99 Main Road",
      city: "Bengaluru",
      state: "Karnataka",
      pin: "560002",
    });

    expect(profile.businessAddress).toBe("99 Main Road");
    expect(profile.addresses[0].address).toBe("99 Main Road");
    expect(profile.addresses[0].pin).toBe("560002");
  });

  it("adds and removes delivery addresses", () => {
    const address = addDeliveryAddress({
      label: "Warehouse",
      address: "20 Industrial Road",
      city: "Bengaluru",
      state: "Karnataka",
      pin: "560003",
      isDefault: false,
    });

    expect(getPharmacyProfile().addresses).toHaveLength(2);

    const profile = removeDeliveryAddress(address.id);

    expect(profile.addresses).toHaveLength(1);
  });

  it("stores uploaded document metadata", () => {
    const file = new File(
      ["demo"],
      "drug-licence.pdf",
      { type: "application/pdf" },
    );

    const document = createDocumentRecord(file);
    const profile = saveDocuments([document]);

    expect(profile.documents).toHaveLength(1);
    expect(profile.documents[0].name).toBe(
      "drug-licence.pdf",
    );
    expect(profile.documents[0].status).toBe(
      "PENDING_REVIEW",
    );
  });

  it("validates password update fields", () => {
    expect(
      validateProfilePassword("", "NewPassword123", "NewPassword123"),
    ).toBe("Current password is required.");

    expect(
      validateProfilePassword(
        "OldPassword",
        "short",
        "short",
      ),
    ).toBe("New password must contain at least 8 characters.");

    expect(
      validateProfilePassword(
        "OldPassword",
        "NewPassword123",
        "DifferentPassword",
      ),
    ).toBe("New password and confirmation do not match.");

    expect(
      validateProfilePassword(
        "OldPassword",
        "NewPassword123",
        "NewPassword123",
      ),
    ).toBeNull();
  });

  it("returns an API-ready password update message", () => {
    expect(markPasswordUpdateReady()).toContain(
      "API integration",
    );
  });
});
