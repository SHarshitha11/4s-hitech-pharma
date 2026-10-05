"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button, Card } from "@/components/ui";
import { getDemoCredentials, loginWithDemoCredentials } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const demoCredentials = getDemoCredentials();
  const resetSuccess = searchParams.get("reset") === "success";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      setError("Email or mobile number is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setSubmitting(true);

    window.setTimeout(() => {
      const session = loginWithDemoCredentials(
        trimmedIdentifier,
        password,
      );

      if (!session) {
        setSubmitting(false);
        setError("Invalid email/mobile number or password.");
        return;
      }

      router.replace("/pharmacy/dashboard");
    }, 300);
  }

  return (
    <Card>
      {resetSuccess ? (
        <div
          role="status"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          Password reset successfully. Please login with your new password.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="identifier"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Mobile / Email *
          </label>

          <input
            id="identifier"
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            placeholder="Enter mobile number or email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password *
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            placeholder="Enter your password"
          />
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Development Demo Credentials
        </p>

        <p className="mt-2 text-sm text-gray-700">
          Email: {demoCredentials.email}
        </p>

        <p className="text-sm text-gray-700">
          Password: {demoCredentials.password}
        </p>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-5 text-center text-sm text-gray-600">
        New pharmacy?{" "}
        <Link
          href="/register-pharmacy"
          className="font-medium text-blue-600 hover:underline"
        >
          Register Your Pharmacy
        </Link>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            4S HITECH PHARMA
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Pharmacy Partner Login
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Welcome back. Login to manage your pharmaceutical orders.
          </p>
        </div>

        <Suspense
          fallback={
            <Card>
              <div
                role="status"
                className="py-8 text-center text-sm text-gray-600"
              >
                Loading login...
              </div>
            </Card>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
