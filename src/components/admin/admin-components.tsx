import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function AdminPageHeader({
  eyebrow = "Admin Operations",
  title,
  description,
}: AdminPageHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {eyebrow}
      </p>

      <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
        {title}
      </h1>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

type AdminMetricCardProps = {
  label: string;
  value: string;
  description: string;
};

export function AdminMetricCard({
  label,
  value,
  description,
}: AdminMetricCardProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </section>
  );
}

type AdminPlaceholderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function AdminPlaceholder({
  title,
  description,
  children,
}: AdminPlaceholderProps) {
  return (
    <section className="rounded-xl border border-dashed border-gray-300 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>

      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}