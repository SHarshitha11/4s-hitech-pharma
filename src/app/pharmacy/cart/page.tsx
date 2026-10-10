"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  pharmacyProducts,
  type PharmacyProduct,
} from "@/features/pharmacy/products/catalogue";

import {
  clearCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";

const DEMO_UNIT_PRICES: Record<string, number> = {
  "paracetamol-500": 120,
  "amoxicillin-500": 450,
  "azithromycin-500": 360,
  "cetirizine-10": 95,
  "omeprazole-20": 220,
  "pantoprazole-40": 195,
  "diclofenac-50": 135,
  "metformin-500": 175,
  "atorvastatin-10": 290,
  "ondansetron-4": 175,
  "salbutamol-syrup": 85,
  "multivitamin-syrup": 110,
};

const DEMO_TAX_RATE = 0.05;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getProduct(productId: string): PharmacyProduct | undefined {
  return pharmacyProducts.find((product) => product.id === productId);
}

function getValidationMessage(item: CartItem) {
  const product = getProduct(item.productId);

  if (!product) {
    return "Product is unavailable. Remove it from your cart.";
  }

  if (
    product.stockStatus === "Out of Stock" ||
    product.stockQuantity < product.moq
  ) {
    return "This product is currently unavailable.";
  }

  if (item.quantity < product.moq) {
    return `Minimum order quantity is ${product.moq}.`;
  }

  if (item.quantity > product.stockQuantity) {
    return `Only ${product.stockQuantity} units are available.`;
  }

  return "";
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems(getCartItems());
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          (DEMO_UNIT_PRICES[item.productId] ?? 0) * item.quantity,
        0,
      ),
    [items],
  );

  const tax = Math.round(subtotal * DEMO_TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const hasInvalidItems = items.some(
    (item) => getValidationMessage(item) !== "",
  );

  function handleQuantityChange(item: CartItem, value: number) {
    const product = getProduct(item.productId);

    if (
      !product ||
      product.stockStatus === "Out of Stock" ||
      !Number.isFinite(value)
    ) {
      return;
    }

    const quantity = Math.min(
      Math.max(Math.floor(value), product.moq),
      product.stockQuantity,
    );

    const updated = updateCartItemQuantity(item.productId, quantity);
    setItems(updated);
    setMessage("");
  }

  function handleRemove(productId: string) {
    setItems(removeFromCart(productId));
    setMessage("Product removed from cart.");
  }

  function handleClearCart() {
    clearCart();
    setItems([]);
    setMessage("Cart cleared.");
  }

  if (!loaded) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-gray-600" role="status">
            Loading your cart...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Pharmacy Partner Portal
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Review your products, update quantities, and check the order summary.
            </p>
          </div>

          <Link
            href="/pharmacy/products"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Demo price and tax calculation
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Prices and the 5% tax rate are sample values for testing only.
            Actual pharmacy-specific prices and applicable taxes must be
            supplied by the backend before production use.
          </p>
        </div>

        {message ? (
          <div
            role="status"
            className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            {message}
          </div>
        ) : null}

        {!items.length ? (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Browse the product catalogue and add products to your cart.
            </p>
            <Link
              href="/pharmacy/products"
              className="mt-5 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div className="min-w-0 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-600">
                  {items.length} {items.length === 1 ? "product" : "products"} in your cart
                </p>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-sm font-semibold text-red-700 hover:underline"
                >
                  Clear Cart
                </button>
              </div>

              {items.map((item) => {
                const product = getProduct(item.productId);
                const unitPrice = DEMO_UNIT_PRICES[item.productId] ?? 0;
                const validationMessage = getValidationMessage(item);
                const unavailable =
                  !product ||
                  product.stockStatus === "Out of Stock" ||
                  product.stockQuantity < product.moq;
                const minimum = product?.moq ?? 1;
                const maximum = product?.stockQuantity ?? 0;

                return (
                  <article
                    key={item.productId}
                    className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="break-words text-lg font-semibold text-gray-900">
                          {item.productName}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Pack size: {item.packSize}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Demo unit price: {formatCurrency(unitPrice)}
                        </p>

                        {product ? (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <span
                              className={
                                "rounded-full px-2.5 py-1 font-semibold " +
                                (product.stockStatus === "In Stock"
                                  ? "bg-green-50 text-green-700"
                                  : product.stockStatus === "Low Stock"
                                    ? "bg-yellow-50 text-yellow-800"
                                    : "bg-red-50 text-red-700")
                              }
                            >
                              {product.stockStatus}
                            </span>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                              Available: {product.stockQuantity}
                            </span>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                              MOQ: {product.moq}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="shrink-0 sm:text-right">
                        <p className="text-xs text-gray-500">Line subtotal</p>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {formatCurrency(unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {validationMessage ? (
                      <p
                        role="alert"
                        className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                      >
                        {validationMessage}
                      </p>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="w-full sm:max-w-xs">
                        <label
                          htmlFor={`cart-quantity-${item.productId}`}
                          className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                          Quantity
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${item.productName}`}
                            disabled={unavailable || item.quantity <= minimum}
                            onClick={() =>
                              handleQuantityChange(item, item.quantity - 1)
                            }
                            className="h-10 w-10 shrink-0 rounded-lg border border-gray-300 bg-white text-lg font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            -
                          </button>

                          <input
                            id={`cart-quantity-${item.productId}`}
                            type="number"
                            min={minimum}
                            max={maximum}
                            value={item.quantity}
                            disabled={unavailable}
                            aria-label={`Quantity for ${item.productName}`}
                            onChange={(event) =>
                              handleQuantityChange(
                                item,
                                Number(event.target.value),
                              )
                            }
                            className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-center text-sm font-semibold text-gray-900"
                          />

                          <button
                            type="button"
                            aria-label={`Increase quantity for ${item.productName}`}
                            disabled={unavailable || item.quantity >= maximum}
                            onClick={() =>
                              handleQuantityChange(item, item.quantity + 1)
                            }
                            className="h-10 w-10 shrink-0 rounded-lg border border-gray-300 bg-white text-lg font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="text-left text-sm font-semibold text-red-700 hover:underline sm:text-right"
                      >
                        Remove item
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-600">Demo tax (5%)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(tax)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {hasInvalidItems ? (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  Please fix or remove unavailable products and invalid
                  quantities before checkout.
                </p>
              ) : null}

              <Link
                href="/pharmacy/checkout"
                aria-disabled={hasInvalidItems}
                onClick={(event) => {
                  if (hasInvalidItems) {
                    event.preventDefault();
                    setMessage(
                      "Fix stock and quantity issues before continuing to checkout.",
                    );
                  }
                }}
                className={
                  "mt-5 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold " +
                  (hasInvalidItems
                    ? "cursor-not-allowed bg-gray-300 text-gray-600"
                    : "bg-gray-900 text-white hover:bg-gray-800")
                }
              >
                Continue to Checkout
              </Link>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Totals are estimates using demonstration prices and tax.
                Final amounts must be calculated by the backend.
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
