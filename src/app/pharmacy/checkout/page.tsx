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
  type CartItem,
} from "@/lib/cart";

import {
  createOrderId,
  saveOrderRequest,
  type DeliveryAddress,
  type OrderRequest,
  type PaymentTerm,
} from "@/lib/checkout";

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

type CheckoutStep = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_LABELS = [
  "Cart Review",
  "Delivery Address",
  "Order Summary",
  "Payment / Credit Terms",
  "Confirmation",
  "Place Order",
];

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
    return "Product is unavailable.";
  }

  if (
    product.stockStatus === "Out of Stock" ||
    product.stockQuantity < product.moq
  ) {
    return `${product.name} is currently unavailable.`;
  }

  if (item.quantity < product.moq) {
    return `${product.name} requires a minimum quantity of ${product.moq}.`;
  }

  if (item.quantity > product.stockQuantity) {
    return `${product.name} has only ${product.stockQuantity} units available.`;
  }

  return "";
}

function getInitialAddress(): DeliveryAddress {
  return {
    businessName: "",
    contactName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
  };
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState<CheckoutStep>(1);
  const [address, setAddress] = useState<DeliveryAddress>(
    getInitialAddress(),
  );
  const [paymentTerm, setPaymentTerm] =
    useState<PaymentTerm>("CREDIT");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmation, setConfirmation] =
    useState<OrderRequest | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems(getCartItems());
      setLoaded(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
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

  const cartErrors = useMemo(
    () =>
      items
        .map((item) => getValidationMessage(item))
        .filter((message) => message.length > 0),
    [items],
  );

  function updateAddress(
    field: keyof DeliveryAddress,
    value: string,
  ) {
    setAddress((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors([]);
  }

  function validateDeliveryAddress() {
    const validationErrors: string[] = [];

    if (!address.businessName.trim()) {
      validationErrors.push("Business name is required.");
    }

    if (!address.contactName.trim()) {
      validationErrors.push("Contact name is required.");
    }

    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      validationErrors.push(
        "Enter a valid 10-digit Indian mobile number.",
      );
    }

    if (!address.addressLine1.trim()) {
      validationErrors.push("Address line 1 is required.");
    }

    if (!address.city.trim()) {
      validationErrors.push("City is required.");
    }

    if (!address.state.trim()) {
      validationErrors.push("State is required.");
    }

    if (!/^\d{6}$/.test(address.pinCode.trim())) {
      validationErrors.push("Enter a valid 6-digit PIN code.");
    }

    setErrors(validationErrors);

    return validationErrors.length === 0;
  }

  function canContinueFromCurrentStep() {
    if (step === 1) {
      return items.length > 0 && cartErrors.length === 0;
    }

    if (step === 2) {
      return validateDeliveryAddress();
    }

    return true;
  }

  function handleNext() {
    if (!canContinueFromCurrentStep()) {
      return;
    }

    setErrors([]);

    if (step < 6) {
      setStep((current) => (current + 1) as CheckoutStep);
    }
  }

  function handleBack() {
    setErrors([]);

    if (step > 1) {
      setStep((current) => (current - 1) as CheckoutStep);
    }
  }

  function handlePlaceOrder() {
    if (items.length === 0 || cartErrors.length > 0) {
      setErrors([
        "Your cart contains invalid or unavailable items.",
      ]);
      return;
    }

    const order: OrderRequest = {
      orderId: createOrderId(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
      deliveryAddress: address,
      paymentTerm,
      notes: notes.trim(),
      items: items.map((item) => {
        const unitPrice = DEMO_UNIT_PRICES[item.productId] ?? 0;

        return {
          productId: item.productId,
          productName: item.productName,
          packSize: item.packSize,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        };
      }),
      subtotal,
      tax,
      total,
    };

    saveOrderRequest(order);
    clearCart();
    setConfirmation(order);
    setStep(5);
    setErrors([]);
  }

  if (!loaded) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p
            className="text-sm text-gray-600"
            role="status"
          >
            Loading checkout...
          </p>
        </div>
      </section>
    );
  }

  if (confirmation) {
    return (
      <section className="min-h-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✓
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-green-700">
              Order Request Created
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Order placed successfully
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Your order request has been created and is awaiting processing.
            </p>

            <div className="mt-6 rounded-xl bg-gray-50 p-5 text-left">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-gray-600">
                  Order ID
                </span>

                <span className="break-all text-sm font-bold text-gray-900">
                  {confirmation.orderId}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600">
                  Status
                </span>

                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800">
                  PENDING
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600">
                  Payment term
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {confirmation.paymentTerm === "CREDIT"
                    ? "Credit Terms"
                    : "Prepaid"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600">
                  Total
                </span>

                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(confirmation.total)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/pharmacy/orders"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                View Orders
              </Link>

              <Link
                href="/pharmacy/products"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Pharmacy Partner Portal
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Complete the delivery, order, payment, and confirmation details before placing your order request.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {STEP_LABELS.map((label, index) => {
            const stepNumber = (index + 1) as CheckoutStep;
            const active = step === stepNumber;

            return (
              <div
                key={label}
                className={
                  "rounded-lg border p-3 text-center " +
                  (active
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600")
                }
              >
                <p className="text-xs font-bold">
                  {stepNumber}
                </p>

                <p className="mt-1 text-xs font-medium leading-4">
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        {errors.length > 0 ? (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm font-semibold text-red-800">
              Please fix the following:
            </p>

            <ul className="mt-2 space-y-1 text-sm text-red-700">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {cartErrors.length > 0 && step === 1 ? (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm font-semibold text-red-800">
              Cart validation failed
            </p>

            <ul className="mt-2 space-y-1 text-sm text-red-700">
              {cartErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>

            <Link
              href="/pharmacy/cart"
              className="mt-3 inline-flex text-sm font-semibold text-red-800 underline"
            >
              Return to Cart
            </Link>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Cart Review
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Review the products and quantities before entering delivery details.
                </p>
              </div>

              <Link
                href="/pharmacy/cart"
                className="text-sm font-semibold text-gray-700 underline"
              >
                Edit Cart
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                  <p className="text-sm text-gray-600">
                    Your cart is empty.
                  </p>

                  <Link
                    href="/pharmacy/products"
                    className="mt-3 inline-flex rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const price =
                    DEMO_UNIT_PRICES[item.productId] ?? 0;

                  return (
                    <div
                      key={item.productId}
                      className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-gray-900">
                          {item.productName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.packSize} · Qty {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-gray-900">
                        {formatCurrency(price * item.quantity)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Delivery Address
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Enter the pharmacy delivery details.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="business-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Business Name *
                </label>

                <input
                  id="business-name"
                  value={address.businessName}
                  onChange={(event) =>
                    updateAddress(
                      "businessName",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Contact Name *
                </label>

                <input
                  id="contact-name"
                  value={address.contactName}
                  onChange={(event) =>
                    updateAddress(
                      "contactName",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="delivery-phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Mobile Number *
                </label>

                <input
                  id="delivery-phone"
                  type="tel"
                  inputMode="numeric"
                  value={address.phone}
                  onChange={(event) =>
                    updateAddress("phone", event.target.value)
                  }
                  placeholder="10-digit mobile number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="delivery-pin"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  PIN Code *
                </label>

                <input
                  id="delivery-pin"
                  inputMode="numeric"
                  value={address.pinCode}
                  onChange={(event) =>
                    updateAddress("pinCode", event.target.value)
                  }
                  placeholder="6-digit PIN"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address-line-1"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address Line 1 *
                </label>

                <input
                  id="address-line-1"
                  value={address.addressLine1}
                  onChange={(event) =>
                    updateAddress(
                      "addressLine1",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address-line-2"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address Line 2
                </label>

                <input
                  id="address-line-2"
                  value={address.addressLine2}
                  onChange={(event) =>
                    updateAddress(
                      "addressLine2",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="delivery-city"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  City *
                </label>

                <input
                  id="delivery-city"
                  value={address.city}
                  onChange={(event) =>
                    updateAddress("city", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="delivery-state"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  State *
                </label>

                <input
                  id="delivery-state"
                  value={address.state}
                  onChange={(event) =>
                    updateAddress("state", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                {items.map((item) => {
                  const unitPrice =
                    DEMO_UNIT_PRICES[item.productId] ?? 0;

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-gray-900">
                          {item.productName}
                        </p>

                        <p className="text-xs text-gray-500">
                          Qty {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-gray-900">
                        {formatCurrency(
                          unitPrice * item.quantity,
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-bold text-gray-900">
                Total
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">
                    Demo tax (5%)
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(tax)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold">
                      Grand Total
                    </span>

                    <span className="text-lg font-bold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Payment / Credit Terms
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Select the payment preference for this order request.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className={
                  "cursor-pointer rounded-xl border p-4 " +
                  (paymentTerm === "CREDIT"
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200")
                }
              >
                <input
                  type="radio"
                  name="payment-term"
                  value="CREDIT"
                  checked={paymentTerm === "CREDIT"}
                  onChange={() => setPaymentTerm("CREDIT")}
                  className="sr-only"
                />

                <span className="block text-sm font-bold text-gray-900">
                  Credit Terms
                </span>

                <span className="mt-1 block text-xs leading-5 text-gray-600">
                  Use the pharmacy&apos;s approved credit arrangement. Final credit eligibility and limits must be verified by the backend.
                </span>
              </label>

              <label
                className={
                  "cursor-pointer rounded-xl border p-4 " +
                  (paymentTerm === "PREPAID"
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200")
                }
              >
                <input
                  type="radio"
                  name="payment-term"
                  value="PREPAID"
                  checked={paymentTerm === "PREPAID"}
                  onChange={() => setPaymentTerm("PREPAID")}
                  className="sr-only"
                />

                <span className="block text-sm font-bold text-gray-900">
                  Prepaid
                </span>

                <span className="mt-1 block text-xs leading-5 text-gray-600">
                  Payment can be handled through the future payment service. No live payment gateway is connected in this UI.
                </span>
              </label>
            </div>

            <div className="mt-6">
              <label
                htmlFor="order-notes"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Order Notes
              </label>

              <textarea
                id="order-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                maxLength={500}
                placeholder="Add delivery or order instructions..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />

              <p className="mt-1 text-right text-xs text-gray-500">
                {notes.length}/500
              </p>
            </div>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Confirmation
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Review the final order information before placing the order request.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="text-sm font-bold text-gray-900">
                  Delivery Address
                </h3>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>{address.businessName}</p>
                  <p>{address.contactName}</p>
                  <p>{address.phone}</p>
                  <p>{address.addressLine1}</p>

                  {address.addressLine2 ? (
                    <p>{address.addressLine2}</p>
                  ) : null}

                  <p>
                    {address.city}, {address.state} -{" "}
                    {address.pinCode}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="text-sm font-bold text-gray-900">
                  Payment / Credit Terms
                </h3>

                <p className="mt-3 text-sm text-gray-600">
                  {paymentTerm === "CREDIT"
                    ? "Credit Terms"
                    : "Prepaid"}
                </p>

                <p className="mt-4 text-sm text-gray-600">
                  Notes:
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {notes || "No additional notes."}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-3 text-sm">
                <span className="text-gray-600">
                  Demo tax
                </span>

                <span className="font-semibold">
                  {formatCurrency(tax)}
                </span>
              </div>

              <div className="mt-3 border-t border-gray-200 pt-3">
                <div className="flex justify-between gap-3">
                  <span className="font-bold text-gray-900">
                    Grand Total
                  </span>

                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === 6 ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Place Order
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">
              Submit this order request using the selected delivery address and payment terms.
            </p>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                items.length === 0 ||
                cartErrors.length > 0
              }
              className="mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Place Order
            </button>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
              >
                Back
              </button>
            ) : (
              <Link
                href="/pharmacy/cart"
                className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
              >
                Back to Cart
              </Link>
            )}
          </div>

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                step === 1 && items.length === 0
              }
              className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
            >
              {step === 5
                ? "Continue to Place Order"
                : "Continue"}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}