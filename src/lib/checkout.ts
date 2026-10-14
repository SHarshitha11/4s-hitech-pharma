export const ORDER_REQUEST_STORAGE_KEY =
  "4s-hitech-pharma-order-request";

export const LAST_ORDER_STORAGE_KEY =
  "4s-hitech-pharma-last-order";

export const ORDER_HISTORY_STORAGE_KEY =
  "4s-hitech-pharma-order-history";

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

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "DISPATCHED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED";

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
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: DeliveryAddress;
  paymentTerm: PaymentTerm;
  notes: string;
  items: CheckoutOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
};

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "DISPATCHED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  DISPATCHED: "Dispatched",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return Requested",
  RETURNED: "Returned",
};

export function getOrderHistory(): OrderRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = sessionStorage.getItem(
      ORDER_HISTORY_STORAGE_KEY,
    );

    if (stored) {
      const parsed: unknown = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed as OrderRequest[];
      }
    }

    const latestOrder = getLastOrder();

    return latestOrder ? [latestOrder] : [];
  } catch {
    return [];
  }
}

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

  const existingOrders = getOrderHistory();

  const updatedHistory = [
    order,
    ...existingOrders.filter(
      (existingOrder) =>
        existingOrder.orderId !== order.orderId,
    ),
  ];

  sessionStorage.setItem(
    ORDER_HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory),
  );
}

export function getLastOrder(): OrderRequest | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(
      LAST_ORDER_STORAGE_KEY,
    );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as OrderRequest;
  } catch {
    return null;
  }
}

export function getOrderById(
  orderId: string,
): OrderRequest | null {
  const order = getOrderHistory().find(
    (existingOrder) => existingOrder.orderId === orderId,
  );

  return order ?? null;
}

export function createOrderId() {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  return `ORD-${timestamp}-${random}`;
}