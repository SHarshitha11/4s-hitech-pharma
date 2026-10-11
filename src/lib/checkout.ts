export const ORDER_REQUEST_STORAGE_KEY = "4s-hitech-pharma-order-request";
export const LAST_ORDER_STORAGE_KEY = "4s-hitech-pharma-last-order";

export type DeliveryAddress = {
  businessName: string;
  contactName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
};

export type PaymentTerm = "CREDIT" | "PREPAID";

export type CheckoutOrderItem = {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderRequest = {
  orderId: string;
  status: "PENDING";
  createdAt: string;
  deliveryAddress: DeliveryAddress;
  paymentTerm: PaymentTerm;
  notes: string;
  items: CheckoutOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
};

export function saveOrderRequest(order: OrderRequest) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    ORDER_REQUEST_STORAGE_KEY,
    JSON.stringify(order),
  );

  sessionStorage.setItem(
    LAST_ORDER_STORAGE_KEY,
    JSON.stringify(order),
  );
}

export function getLastOrder(): OrderRequest | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(LAST_ORDER_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as OrderRequest;
  } catch {
    return null;
  }
}

export function createOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `ORD-${timestamp}-${random}`;
}