export type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type BatchStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "EXPIRED"
  | "QUARANTINED"
  | "DAMAGED"
  | "RECALLED";

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
};

export type ProductBatch = {
  id: string;
  productId: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  mrp: number;
  purchasePrice: number;
  wholesalePrice: number;
  supplier: string;
  warehouse: string;
  status: BatchStatus;
};

export type ManagedProduct = {
  id: string;
  name: string;
  brand: string;
  composition: string;
  strength: string;
  dosageForm: string;
  packSize: string;
  manufacturer: string;
  categoryId: string;
  productCode: string;
  mrp: number;
  wholesalePrice: number;
  taxPercent: number;
  stockQuantity: number;
  minimumOrderQuantity: number;
  status: ProductStatus;
  visibility: "VISIBLE" | "HIDDEN";
  imageUrl: string;
  batches: ProductBatch[];
};

export type StockTransaction = {
  id: string;
  productId: string;
  batchId: string;
  type: "STOCK_IN" | "ADJUSTMENT" | "TRANSFER" | "RESERVATION" | "RELEASE" | "STOCK_OUT";
  quantity: number;
  reason: string;
  createdAt: string;
};

export const PRODUCT_STORAGE_KEY = "4s-hitech-pharma-products";
export const CATEGORY_STORAGE_KEY = "4s-hitech-pharma-categories";
export const STOCK_TRANSACTION_STORAGE_KEY =
  "4s-hitech-pharma-stock-transactions";

export const DEFAULT_CATEGORIES: ProductCategory[] = [
  {
    id: "CAT-001",
    name: "Antibiotics",
    description: "Antibiotic medicines",
    status: "ACTIVE",
  },
  {
    id: "CAT-002",
    name: "Pain Relief",
    description: "Pain and fever relief medicines",
    status: "ACTIVE",
  },
  {
    id: "CAT-003",
    name: "Vitamins",
    description: "Vitamin and nutritional products",
    status: "ACTIVE",
  },
];

export const DEFAULT_PRODUCTS: ManagedProduct[] = [
  {
    id: "PRD-1001",
    name: "Paracetamol 500mg",
    brand: "4S Pharma",
    composition: "Paracetamol",
    strength: "500 mg",
    dosageForm: "Tablet",
    packSize: "10 x 10 Tablets",
    manufacturer: "4S HITECH PHARMA",
    categoryId: "CAT-002",
    productCode: "PCM500",
    mrp: 85,
    wholesalePrice: 62,
    taxPercent: 12,
    stockQuantity: 1250,
    minimumOrderQuantity: 10,
    status: "ACTIVE",
    visibility: "VISIBLE",
    imageUrl: "",
    batches: [
      {
        id: "BAT-1001",
        productId: "PRD-1001",
        batchNumber: "PCM24001",
        manufacturingDate: "2026-01-15",
        expiryDate: "2028-01-14",
        quantity: 750,
        mrp: 85,
        purchasePrice: 50,
        wholesalePrice: 62,
        supplier: "4S HITECH PHARMA",
        warehouse: "Bengaluru WH-01",
        status: "AVAILABLE",
      },
      {
        id: "BAT-1002",
        productId: "PRD-1001",
        batchNumber: "PCM24002",
        manufacturingDate: "2026-03-20",
        expiryDate: "2028-03-19",
        quantity: 500,
        mrp: 85,
        purchasePrice: 51,
        wholesalePrice: 62,
        supplier: "4S HITECH PHARMA",
        warehouse: "Bengaluru WH-01",
        status: "AVAILABLE",
      },
    ],
  },
  {
    id: "PRD-1002",
    name: "Vitamin C 500mg",
    brand: "4S Pharma",
    composition: "Ascorbic Acid",
    strength: "500 mg",
    dosageForm: "Tablet",
    packSize: "10 x 15 Tablets",
    manufacturer: "4S HITECH PHARMA",
    categoryId: "CAT-003",
    productCode: "VITC500",
    mrp: 120,
    wholesalePrice: 88,
    taxPercent: 12,
    stockQuantity: 180,
    minimumOrderQuantity: 20,
    status: "ACTIVE",
    visibility: "VISIBLE",
    imageUrl: "",
    batches: [
      {
        id: "BAT-1003",
        productId: "PRD-1002",
        batchNumber: "VTC24001",
        manufacturingDate: "2026-02-10",
        expiryDate: "2027-11-30",
        quantity: 180,
        mrp: 120,
        purchasePrice: 72,
        wholesalePrice: 88,
        supplier: "4S HITECH PHARMA",
        warehouse: "Mysuru WH-02",
        status: "AVAILABLE",
      },
    ],
  },
];

export function getProducts(): ManagedProduct[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS;

  const stored = window.sessionStorage.getItem(PRODUCT_STORAGE_KEY);
  if (!stored) {
    window.sessionStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(DEFAULT_PRODUCTS),
    );
    return DEFAULT_PRODUCTS;
  }

  try {
    return JSON.parse(stored) as ManagedProduct[];
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products: ManagedProduct[]) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(products),
    );
  }
}

export function getCategories(): ProductCategory[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;

  const stored = window.sessionStorage.getItem(CATEGORY_STORAGE_KEY);
  if (!stored) {
    window.sessionStorage.setItem(
      CATEGORY_STORAGE_KEY,
      JSON.stringify(DEFAULT_CATEGORIES),
    );
    return DEFAULT_CATEGORIES;
  }

  try {
    return JSON.parse(stored) as ProductCategory[];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: ProductCategory[]) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      CATEGORY_STORAGE_KEY,
      JSON.stringify(categories),
    );
  }
}

export function getStockTransactions(): StockTransaction[] {
  if (typeof window === "undefined") return [];

  const stored = window.sessionStorage.getItem(
    STOCK_TRANSACTION_STORAGE_KEY,
  );

  if (!stored) return [];

  try {
    return JSON.parse(stored) as StockTransaction[];
  } catch {
    return [];
  }
}

export function saveStockTransactions(transactions: StockTransaction[]) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      STOCK_TRANSACTION_STORAGE_KEY,
      JSON.stringify(transactions),
    );
  }
}

export function formatBatchStatus(status: BatchStatus) {
  return status.replace("_", " ");
}
