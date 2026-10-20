import {
  DEFAULT_ORDERS,
  type DeliveryStatus,
  type ManagedOrder,
  type OrderStatus,
} from "@/lib/order-delivery";

declare global {
  var fourSOrdersStore: ManagedOrder[] | undefined;
}

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

export const DELIVERY_STATUSES: DeliveryStatus[] = [
  "READY_FOR_DISPATCH",
  "ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function cloneOrders(orders: ManagedOrder[]) {
  return JSON.parse(JSON.stringify(orders)) as ManagedOrder[];
}

export function getServerOrders() {
  if (!globalThis.fourSOrdersStore) {
    globalThis.fourSOrdersStore = cloneOrders(DEFAULT_ORDERS);
  }

  return globalThis.fourSOrdersStore;
}

export function setServerOrders(orders: ManagedOrder[]) {
  globalThis.fourSOrdersStore = cloneOrders(orders);
  return globalThis.fourSOrdersStore;
}

