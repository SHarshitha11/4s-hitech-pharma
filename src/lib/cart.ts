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

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
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

  saveCartItems(items);

  return items;
}

export function updateCartItemQuantity(
  productId: string,
  quantity: number,
) {
  if (!Number.isFinite(quantity)) {
    return getCartItems();
  }

  const items = getCartItems();
  const index = items.findIndex(
    (item) => item.productId === productId,
  );

  if (index === -1) {
    return items;
  }

  items[index] = {
    ...items[index],
    quantity: Math.max(1, Math.floor(quantity)),
  };

  saveCartItems(items);

  return items;
}

export function removeFromCart(productId: string) {
  const items = getCartItems().filter(
    (item) => item.productId !== productId,
  );

  saveCartItems(items);

  return items;
}

export function clearCart() {
  saveCartItems([]);
}

export function getCartItemCount() {
  return getCartItems().reduce(
    (total, item) => total + item.quantity,
    0,
  );
}