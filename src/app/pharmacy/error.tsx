"use client";

export default function PharmacyError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-4 py-12">
      <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Unable to load the pharmacy portal
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Something went wrong while loading this page. Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
