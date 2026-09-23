import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Card({
  title,
  description,
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
      {...props}
    >
      {(title || description) && (
        <header className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}

          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </header>
      )}

      {children}
    </section>
  );
}

