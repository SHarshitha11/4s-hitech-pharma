"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button, Card } from "@/components/ui";
import { startPasswordReset } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      setError("Email or mobile number is required.");
      return;
    }

    setSubmitting(true);

    window.setTimeout(() => {
      const token = startPasswordReset(trimmedIdentifier);

      if (!token) {
        setSubmitting(false);
        setError(
          "We could not find a pharmacy account with that email or mobile number.",
        );
        return;
      }

      setResetToken(token);
      setSubmitting(false);
    }, 300);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            4S HITECH PHARMA
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Forgot Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Enter your registered mobile number or email address to reset your
            password.
          </p>
        </div>

        <Card>
          {resetToken ? (
            <div className="space-y-5">
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700"
              >
                A password reset request has been created for the development
                demo account.
              </div>

              <Link href={`/reset-password?token=${resetToken}`}>
                <Button className="w-full">
                  Continue to Reset Password
                </Button>
              </Link>

              <div className="text-center text-sm text-gray-600">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
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

              {error ? (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Checking..." : "Continue"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
