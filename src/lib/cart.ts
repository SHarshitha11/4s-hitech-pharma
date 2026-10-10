export const CART_STORAGE_KEY = "4s-hitech-pharma-cart";

export type CartItem = {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  priceLabel: "Customer-specific";
};

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = sessionStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToCart(item: CartItem) {
  const items = getCartItems();

  const existingIndex = items.findIndex(
    (cartItem) => cartItem.productId === item.productId,
  );

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: items[existingIndex].quantity + item.quantity,
    };
  } else {
    items.push(item);
  }

  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

  return items;
}

export function getCartItemCount() {
  return getCartItems().reduce(
    (total, item) => total + item.quantity,
    0,
  );
}