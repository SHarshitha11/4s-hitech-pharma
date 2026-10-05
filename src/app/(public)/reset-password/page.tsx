"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button, Card } from "@/components/ui";
import { hasValidResetToken, resetDemoPassword } from "@/lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!hasValidResetToken(token)) {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    window.setTimeout(() => {
      if (!token) {
        setSubmitting(false);
        setError("Invalid password reset token.");
        return;
      }

      const success = resetDemoPassword(token, password);

      if (!success) {
        setSubmitting(false);
        setError("Unable to reset the password. Please request a new link.");
        return;
      }

      setSubmitting(false);
      router.replace("/login?reset=success");
    }, 300);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            New Password *
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm Password *
          </label>

          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            placeholder="Confirm new password"
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
          {submitting ? "Updating..." : "Reset Password"}
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
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            4S HITECH PHARMA
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Reset Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Create a new password for your pharmacy account.
          </p>
        </div>

        <Suspense
          fallback={
            <Card>
              <div
                role="status"
                className="py-8 text-center text-sm text-gray-600"
              >
                Loading password reset...
              </div>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
