export type PharmacyAddress = {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  isDefault: boolean;
};

export type PharmacyDocument = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: "UPLOADED" | "PENDING_REVIEW";
};

export type PharmacyProfile = {
  businessName: string;
  businessType: string;
  ownerName: string;
  contactPerson: string;
  phone: string;
  email: string;
  drugLicenceNumber: string;
  licenceExpiry: string;
  gstNumber: string;
  pan: string;
  businessAddress: string;
  city: string;
  state: string;
  pin: string;
  addresses: PharmacyAddress[];
  documents: PharmacyDocument[];
};

export const PROFILE_STORAGE_KEY = "4s-hitech-pharma-profile";

const defaultProfile: PharmacyProfile = {
  businessName: "4S HITECH PHARMA Pharmacy",
  businessType: "Pharmacy",
  ownerName: "Demo Owner",
  contactPerson: "Demo Contact",
  phone: "9876543210",
  email: "pharmacy@example.com",
  drugLicenceNumber: "DL-DEMO-001",
  licenceExpiry: "2027-12-31",
  gstNumber: "GSTDEMO001",
  pan: "ABCDE1234F",
  businessAddress: "12 Pharmacy Business Park",
  city: "Bengaluru",
  state: "Karnataka",
  pin: "560001",
  addresses: [
    {
      id: "ADDR-001",
      label: "Primary Store",
      address: "12 Pharmacy Business Park",
      city: "Bengaluru",
      state: "Karnataka",
      pin: "560001",
      isDefault: true,
    },
  ],
  documents: [],
};

export function getPharmacyProfile(): PharmacyProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const stored = window.sessionStorage.getItem(
      PROFILE_STORAGE_KEY,
    );

    if (!stored) {
      window.sessionStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(defaultProfile),
      );
      return defaultProfile;
    }

    return {
      ...defaultProfile,
      ...(JSON.parse(stored) as Partial<PharmacyProfile>),
    };
  } catch {
    return defaultProfile;
  }
}

function saveProfile(profile: PharmacyProfile): PharmacyProfile {
  window.sessionStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  );
  return profile;
}

export function saveBusinessDetails(
  details: Pick<
    PharmacyProfile,
    "businessName" | "businessType" | "ownerName"
  >,
): PharmacyProfile {
  return saveProfile({
    ...getPharmacyProfile(),
    ...details,
  });
}

export function saveRegulatoryDetails(
  details: Pick<
    PharmacyProfile,
    "drugLicenceNumber" | "licenceExpiry" | "gstNumber" | "pan"
  >,
): PharmacyProfile {
  return saveProfile({
    ...getPharmacyProfile(),
    ...details,
  });
}

export function saveContactDetails(
  details: Pick<
    PharmacyProfile,
    "contactPerson" | "phone" | "email"
  >,
): PharmacyProfile {
  return saveProfile({
    ...getPharmacyProfile(),
    ...details,
  });
}

export function savePrimaryAddress(
  details: Pick<
    PharmacyProfile,
    "businessAddress" | "city" | "state" | "pin"
  >,
): PharmacyProfile {
  const profile = getPharmacyProfile();

  return saveProfile({
    ...profile,
    ...details,
    addresses: profile.addresses.map((address, index) =>
      index === 0
        ? {
            ...address,
            address: details.businessAddress,
            city: details.city,
            state: details.state,
            pin: details.pin,
          }
        : address,
    ),
  });
}

export function addDeliveryAddress(
  address: Omit<PharmacyAddress, "id">,
): PharmacyAddress {
  const profile = getPharmacyProfile();

  const newAddress: PharmacyAddress = {
    ...address,
    id: `ADDR-${Date.now().toString().slice(-8)}`,
  };

  saveProfile({
    ...profile,
    addresses: [
      ...profile.addresses,
      newAddress,
    ],
  });

  return newAddress;
}

export function removeDeliveryAddress(
  addressId: string,
): PharmacyProfile {
  const profile = getPharmacyProfile();

  return saveProfile({
    ...profile,
    addresses: profile.addresses.filter(
      (address) => address.id !== addressId,
    ),
  });
}

export function createDocumentRecord(
  file: Pick<File, "name" | "type" | "size">,
): PharmacyDocument {
  return {
    id: `DOC-${Date.now().toString().slice(-8)}`,
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    status: "PENDING_REVIEW",
  };
}

export function saveDocuments(
  documents: PharmacyDocument[],
): PharmacyProfile {
  return saveProfile({
    ...getPharmacyProfile(),
    documents,
  });
}

export function validateProfilePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): string | null {
  if (!currentPassword.trim()) {
    return "Current password is required.";
  }

  if (newPassword.length < 8) {
    return "New password must contain at least 8 characters.";
  }

  if (newPassword !== confirmPassword) {
    return "New password and confirmation do not match.";
  }

  return null;
}

export function markPasswordUpdateReady(): string {
  return "Password update request is ready for API integration.";
}