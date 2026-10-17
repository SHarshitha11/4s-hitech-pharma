export type PharmacyStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "ACTIVE";

export type PharmacyDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
};

export type PharmacyOrder = {
  id: string;
  value: number;
  status: string;
};

export type ManagedPharmacy = {
  id: string;
  businessName: string;
  businessType: string;
  ownerName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  licenceNumber: string;
  gstNumber: string;
  status: PharmacyStatus;
  registeredAt: string;
  documents: PharmacyDocument[];
  orders: PharmacyOrder[];
};

export const PHARMACY_MANAGEMENT_STORAGE_KEY =
  "4s-hitech-pharma-admin-pharmacies";

export const DEFAULT_MANAGED_PHARMACIES: ManagedPharmacy[] = [
  {
    id: "PH-1001",
    businessName: "Sri Lakshmi Medicals",
    businessType: "Pharmacy",
    ownerName: "Anita Rao",
    contactPerson: "Anita Rao",
    phone: "9876501001",
    email: "srilakshmi@example.com",
    city: "Bengaluru",
    state: "Karnataka",
    licenceNumber: "DL-KA-1001",
    gstNumber: "GSTKA1001",
    status: "PENDING",
    registeredAt: "2026-10-14",
    documents: [
      {
        id: "DOC-1001",
        name: "Drug-Licence.pdf",
        type: "Drug Licence",
        size: "1.2 MB",
        uploadedAt: "2026-10-14",
      },
      {
        id: "DOC-1002",
        name: "GST-Certificate.pdf",
        type: "GST Certificate",
        size: "0.8 MB",
        uploadedAt: "2026-10-14",
      },
    ],
    orders: [
      { id: "ORD-10001", value: 18250, status: "Delivered" },
      { id: "ORD-10015", value: 7400, status: "Processing" },
    ],
  },
  {
    id: "PH-1002",
    businessName: "Apollo Care Pharmacy",
    businessType: "Medical Store",
    ownerName: "Rahul Menon",
    contactPerson: "Rahul Menon",
    phone: "9876501002",
    email: "apollocare@example.com",
    city: "Mysuru",
    state: "Karnataka",
    licenceNumber: "DL-KA-1002",
    gstNumber: "GSTKA1002",
    status: "APPROVED",
    registeredAt: "2026-10-10",
    documents: [
      {
        id: "DOC-2001",
        name: "Drug-Licence.pdf",
        type: "Drug Licence",
        size: "1.1 MB",
        uploadedAt: "2026-10-10",
      },
      {
        id: "DOC-2002",
        name: "PAN.pdf",
        type: "PAN",
        size: "0.5 MB",
        uploadedAt: "2026-10-10",
      },
    ],
    orders: [
      { id: "ORD-20001", value: 26100, status: "Delivered" },
      { id: "ORD-20012", value: 9100, status: "Delivered" },
    ],
  },
  {
    id: "PH-1003",
    businessName: "MedPlus Health Point",
    businessType: "Pharmacy",
    ownerName: "Suresh Kumar",
    contactPerson: "Suresh Kumar",
    phone: "9876501003",
    email: "medplus@example.com",
    city: "Mangaluru",
    state: "Karnataka",
    licenceNumber: "DL-KA-1003",
    gstNumber: "GSTKA1003",
    status: "SUSPENDED",
    registeredAt: "2026-09-28",
    documents: [
      {
        id: "DOC-3001",
        name: "Drug-Licence.pdf",
        type: "Drug Licence",
        size: "1.4 MB",
        uploadedAt: "2026-09-28",
      },
    ],
    orders: [],
  },
  {
    id: "PH-1004",
    businessName: "HealthFirst Chemists",
    businessType: "Healthcare Business",
    ownerName: "Meera Iyer",
    contactPerson: "Meera Iyer",
    phone: "9876501004",
    email: "healthfirst@example.com",
    city: "Hubballi",
    state: "Karnataka",
    licenceNumber: "DL-KA-1004",
    gstNumber: "GSTKA1004",
    status: "ACTIVE",
    registeredAt: "2026-09-20",
    documents: [
      {
        id: "DOC-4001",
        name: "Drug-Licence.pdf",
        type: "Drug Licence",
        size: "1.0 MB",
        uploadedAt: "2026-09-20",
      },
      {
        id: "DOC-4002",
        name: "Other-Documents.pdf",
        type: "Other Documents",
        size: "2.1 MB",
        uploadedAt: "2026-09-20",
      },
    ],
    orders: [
      { id: "ORD-40001", value: 12800, status: "Delivered" },
    ],
  },
];

export function getManagedPharmacies(): ManagedPharmacy[] {
  if (typeof window === "undefined") {
    return DEFAULT_MANAGED_PHARMACIES;
  }

  try {
    const stored = sessionStorage.getItem(
      PHARMACY_MANAGEMENT_STORAGE_KEY,
    );

    if (!stored) {
      return DEFAULT_MANAGED_PHARMACIES;
    }

    const parsed = JSON.parse(stored) as ManagedPharmacy[];

    return Array.isArray(parsed) ? parsed : DEFAULT_MANAGED_PHARMACIES;
  } catch {
    return DEFAULT_MANAGED_PHARMACIES;
  }
}

function persist(pharmacies: ManagedPharmacy[]) {
  sessionStorage.setItem(
    PHARMACY_MANAGEMENT_STORAGE_KEY,
    JSON.stringify(pharmacies),
  );
}

export function updatePharmacyStatus(
  id: string,
  status: PharmacyStatus,
) {
  const pharmacies = getManagedPharmacies();

  const updated = pharmacies.map((pharmacy) =>
    pharmacy.id === id ? { ...pharmacy, status } : pharmacy,
  );

  persist(updated);

  return updated.find((pharmacy) => pharmacy.id === id) ?? null;
}

export function updatePharmacyDetails(
  id: string,
  changes: Pick<
    ManagedPharmacy,
    "businessName" | "contactPerson" | "phone" | "email"
  >,
) {
  const pharmacies = getManagedPharmacies();

  const updated = pharmacies.map((pharmacy) =>
    pharmacy.id === id ? { ...pharmacy, ...changes } : pharmacy,
  );

  persist(updated);

  return updated.find((pharmacy) => pharmacy.id === id) ?? null;
}

export function getPharmacyStatusLabel(status: PharmacyStatus) {
  switch (status) {
    case "PENDING":
      return "Pending Review";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "SUSPENDED":
      return "Suspended";
    case "ACTIVE":
      return "Active";
    default:
      return status;
  }
}