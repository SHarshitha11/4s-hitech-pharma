import type {
  DeliveryStatus,
  ManagedOrder,
  OrderStatus,
} from "@/lib/order-delivery";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status = 0, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type ApiRequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, headers, ...requestOptions } = options;

  const authToken =
    token ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("4s-hitech-pharma-auth-token")
      : null);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {}),
      ...headers,
    },
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

type OrdersResponse = {
  success: boolean;
  data: ManagedOrder[];
};

type OrderResponse = {
  success: boolean;
  data: ManagedOrder;
};

export async function getAdminOrders() {
  const response = await apiRequest<OrdersResponse>("/admin/orders");
  return response.data;
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
) {
  const response = await apiRequest<OrderResponse>(
    `/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

  return response.data;
}

export async function updateAdminDelivery(
  orderId: string,
  data: {
    deliveryPartner: string;
    deliveryPerson: string;
    trackingNumber: string;
    dispatchDate?: string;
    expectedDelivery?: string;
    status: DeliveryStatus;
  },
) {
  const response = await apiRequest<OrderResponse>(
    `/admin/orders/${orderId}/delivery`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );

  return response.data;
}