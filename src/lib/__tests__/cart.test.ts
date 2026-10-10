import { beforeEach, describe, expect, it } from "vitest";

import {
  CART_STORAGE_KEY,
  addToCart,
  clearCart,
  getCartItemCount,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  type CartItem,
} from "../cart";

const sampleItem: CartItem = {
  productId: "paracetamol-500",
  productName: "Paracetamol 500 mg Tablets",
  packSize: "10 x 10 Tablets",
  quantity: 10,
  priceLabel: "Customer-specific",
};

describe("Cart helper", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("adds a product to the cart", () => {
    addToCart(sampleItem);

    expect(getCartItems()).toEqual([sampleItem]);
  });

  it("combines quantities when the same product is added again", () => {
    addToCart(sampleItem);
    addToCart({ ...sampleItem, quantity: 5 });

    expect(getCartItems()).toHaveLength(1);
    expect(getCartItems()[0].quantity).toBe(15);
  });

  it("updates an existing product quantity", () => {
    addToCart(sampleItem);
    updateCartItemQuantity(sampleItem.productId, 20);

    expect(getCartItems()[0].quantity).toBe(20);
  });

  it("prevents quantities below one", () => {
    addToCart(sampleItem);
    updateCartItemQuantity(sampleItem.productId, 0);

    expect(getCartItems()[0].quantity).toBe(1);
  });

  it("removes a product from the cart", () => {
    addToCart(sampleItem);
    removeFromCart(sampleItem.productId);

    expect(getCartItems()).toEqual([]);
  });

  it("counts all units in the cart", () => {
    addToCart(sampleItem);
    addToCart({
      ...sampleItem,
      productId: "amoxicillin-500",
      productName: "Amoxicillin 500 mg Capsules",
      quantity: 3,
    });

    expect(getCartItemCount()).toBe(13);
  });

  it("clears the cart", () => {
    addToCart(sampleItem);
    clearCart();

    expect(getCartItems()).toEqual([]);
    expect(sessionStorage.getItem(CART_STORAGE_KEY)).toBe("[]");
  });
});