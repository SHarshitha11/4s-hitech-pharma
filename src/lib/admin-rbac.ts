import type { AuthRole } from "@/lib/auth";

export type AdminPermission =
  | "dashboard:view"
  | "pharmacies:view"
  | "pharmacies:manage"
  | "products:view"
  | "products:manage"
  | "categories:view"
  | "categories:manage"
  | "inventory:view"
  | "inventory:manage"
  | "batches:view"
  | "batches:manage"
  | "orders:view"
  | "orders:manage"
  | "invoices:view"
  | "payments:view"
  | "deliveries:view"
  | "deliveries:manage"
  | "returns:view"
  | "returns:manage"
  | "manufacturing:view"
  | "manufacturing:manage"
  | "users:view"
  | "users:manage"
  | "reports:view"
  | "settings:view"
  | "settings:manage";

export type AdminNavItem = {
  label: string;
  href: string;
  permission: AdminPermission;
};

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", permission: "dashboard:view" },
  { label: "Pharmacies", href: "/admin/pharmacies", permission: "pharmacies:view" },
  { label: "Products", href: "/admin/products", permission: "products:view" },
  { label: "Categories", href: "/admin/categories", permission: "categories:view" },
  { label: "Inventory", href: "/admin/inventory", permission: "inventory:view" },
  { label: "Batches", href: "/admin/batches", permission: "batches:view" },
  { label: "Orders", href: "/admin/orders", permission: "orders:view" },
  { label: "Invoices", href: "/admin/invoices", permission: "invoices:view" },
  { label: "Payments", href: "/admin/payments", permission: "payments:view" },
  { label: "Deliveries", href: "/admin/deliveries", permission: "deliveries:view" },
  { label: "Returns", href: "/admin/returns", permission: "returns:view" },
  { label: "Manufacturing", href: "/admin/manufacturing", permission: "manufacturing:view" },
  { label: "Users", href: "/admin/users", permission: "users:view" },
  { label: "Reports", href: "/admin/reports", permission: "reports:view" },
  { label: "Settings", href: "/admin/settings", permission: "settings:view" },
];

const ROLE_PERMISSIONS: Record<
  Exclude<AuthRole, "PHARMACY">,
  AdminPermission[]
> = {
  OPERATIONS: [
    "dashboard:view",
    "pharmacies:view",
    "pharmacies:manage",
    "inventory:view",
    "inventory:manage",
    "orders:view",
    "orders:manage",
    "invoices:view",
    "deliveries:view",
    "deliveries:manage",
    "returns:view",
    "returns:manage",
    "reports:view",
  ],

  PRODUCT_MANAGER: [
    "dashboard:view",
    "products:view",
    "products:manage",
    "categories:view",
    "categories:manage",
    "inventory:view",
    "inventory:manage",
    "batches:view",
    "batches:manage",
    "invoices:view",
    "reports:view",
  ],

  SUPER_ADMIN: [
    "dashboard:view",
    "pharmacies:view",
    "pharmacies:manage",
    "products:view",
    "products:manage",
    "categories:view",
    "categories:manage",
    "inventory:view",
    "inventory:manage",
    "batches:view",
    "batches:manage",
    "orders:view",
    "orders:manage",
    "invoices:view",
    "payments:view",
    "deliveries:view",
    "deliveries:manage",
    "returns:view",
    "returns:manage",
    "manufacturing:view",
    "manufacturing:manage",
    "users:view",
    "users:manage",
    "reports:view",
    "settings:view",
    "settings:manage",
  ],
};

export function hasAdminPermission(
  role: AuthRole | null | undefined,
  permission: AdminPermission,
) {
  if (!role || role === "PHARMACY") {
    return false;
  }

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getVisibleAdminNavigation(
  role: AuthRole | null | undefined,
) {
  return ADMIN_NAVIGATION.filter((item) =>
    hasAdminPermission(role, item.permission),
  );
}

export function getAdminRoleLabel(role: AuthRole | null | undefined) {
  switch (role) {
    case "OPERATIONS":
      return "Operations Staff";
    case "PRODUCT_MANAGER":
      return "Product Manager";
    case "SUPER_ADMIN":
      return "Super Admin";
    default:
      return "Unauthorized";
  }
}