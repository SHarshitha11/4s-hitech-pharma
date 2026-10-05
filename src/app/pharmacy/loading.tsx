export default function PharmacyLoading() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-4 py-12">
      <div
        role="status"
        className="rounded-lg border border-gray-200 bg-white px-6 py-5 text-center shadow-sm"
      >
        <p className="text-sm font-medium text-gray-900">
          Loading pharmacy portal...
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Please wait while your session is verified.
        </p>
      </div>
    </main>
  );
}
