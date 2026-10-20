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

export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "PARTIALLY_PAID"
  | "FAILED"
  | "REFUNDED";

export type DeliveryStatus =
  | "READY_FOR_DISPATCH"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export type OrderItem = {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
};

export type DeliveryAssignment = {
  id: string;
  orderId: string;
  deliveryPartner: string;
  deliveryPerson: string;
  trackingNumber: string;
  dispatchDate: string;
  expectedDelivery: string;
  status: DeliveryStatus;
};

export type ManagedOrder = {
  id: string;
  pharmacyName: string;
  contactPerson: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  deliveryAddress: string;
  invoiceNumber: string;
  delivery: DeliveryAssignment | null;
};

export const ORDER_STORAGE_KEY = "4s-hitech-pharma-admin-orders";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "DISPATCHED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
];

export const DEFAULT_ORDERS: ManagedOrder[] = [
  {
    id: "ORD-1001",
    pharmacyName: "Sri Lakshmi Medicals",
    contactPerson: "Anita Rao",
    orderDate: "2026-10-20",
    items: [
      {
        id: "ITEM-1001",
        productName: "Paracetamol 500mg",
        productCode: "PCM500",
        quantity: 50,
        price: 62,
        tax: 372,
        total: 3472,
      },
      {
        id: "ITEM-1002",
        productName: "Vitamin C 500mg",
        productCode: "VITC500",
        quantity: 20,
        price: 88,
        tax: 211.2,
        total: 1971.2,
      },
    ],
    subtotal: 4840,
    tax: 583.2,
    total: 5423.2,
    paymentStatus: "PENDING",
    status: "PENDING",
    deliveryAddress: "12 MG Road, Bengaluru, Karnataka - 560001",
    invoiceNumber: "INV-1001",
    delivery: null,
  },
  {
    id: "ORD-1002",
    pharmacyName: "Apollo Care Pharmacy",
    contactPerson: "Rahul Menon",
    orderDate: "2026-10-19",
    items: [
      {
        id: "ITEM-1003",
        productName: "Paracetamol 500mg",
        productCode: "PCM500",
        quantity: 100,
        price: 62,
        tax: 744,
        total: 6944,
      },
    ],
    subtotal: 6200,
    tax: 744,
    total: 6944,
    paymentStatus: "PAID",
    status: "PROCESSING",
    deliveryAddress: "45 Kuvempunagar, Mysuru, Karnataka - 570023",
    invoiceNumber: "INV-1002",
    delivery: null,
  },
  {
    id: "ORD-1003",
    pharmacyName: "HealthFirst Chemists",
    contactPerson: "Meera Iyer",
    orderDate: "2026-10-18",
    items: [
      {
        id: "ITEM-1004",
        productName: "Vitamin C 500mg",
        productCode: "VITC500",
        quantity: 30,
        price: 88,
        tax: 316.8,
        total: 2956.8,
      },
    ],
    subtotal: 2640,
    tax: 316.8,
    total: 2956.8,
    paymentStatus: "AUTHORIZED",
    status: "DISPATCHED",
    deliveryAddress: "18 Gokul Road, Hubballi, Karnataka - 580030",
    invoiceNumber: "INV-1003",
    delivery: {
      id: "DEL-1001",
      orderId: "ORD-1003",
      deliveryPartner: "4S Express",
      deliveryPerson: "Ravi Kumar",
      trackingNumber: "4SHP-TRK-1003",
      dispatchDate: "2026-10-20",
      expectedDelivery: "2026-10-21",
      status: "ASSIGNED",
    },
  },
];

export function getOrders(): ManagedOrder[] {
  if (typeof window === "undefined") {
    return DEFAULT_ORDERS;
  }

  const stored = window.sessionStorage.getItem(ORDER_STORAGE_KEY);

  if (!stored) {
    window.sessionStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify(DEFAULT_ORDERS),
    );
    return DEFAULT_ORDERS;
  }

  try {
    return JSON.parse(stored) as ManagedOrder[];
  } catch {
    return DEFAULT_ORDERS;
  }
}

export function saveOrders(orders: ManagedOrder[]) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  }
}

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  const index = ORDER_STATUSES.indexOf(status);

  if (index < 0 || index >= 7) {
    return null;
  }

  return ORDER_STATUSES[index + 1];
}

export function formatOrderStatus(status: OrderStatus) {
  return status.replaceAll("_", " ");
}

export function formatDeliveryStatus(status: DeliveryStatus) {
  return status.replaceAll("_", " ");
}
