import { describe, expect, it } from "vitest";

import {
  ADMIN_NAVIGATION,
  getAdminRoleLabel,
  getVisibleAdminNavigation,
  hasAdminPermission,
} from "@/lib/admin-rbac";

describe("Admin RBAC utilities", () => {
  it("denies every admin permission to pharmacy users", () => {
    expect(hasAdminPermission("PHARMACY", "dashboard:view")).toBe(false);
    expect(hasAdminPermission("PHARMACY", "users:manage")).toBe(false);
    expect(getVisibleAdminNavigation("PHARMACY")).toEqual([]);
  });

  it("gives operations staff operations-focused permissions", () => {
    expect(hasAdminPermission("OPERATIONS", "pharmacies:view")).toBe(true);
    expect(hasAdminPermission("OPERATIONS", "orders:manage")).toBe(true);
    expect(hasAdminPermission("OPERATIONS", "inventory:manage")).toBe(true);
    expect(hasAdminPermission("OPERATIONS", "products:manage")).toBe(false);
    expect(hasAdminPermission("OPERATIONS", "users:manage")).toBe(false);
  });

  it("gives product managers product-focused permissions", () => {
    expect(hasAdminPermission("PRODUCT_MANAGER", "products:manage")).toBe(true);
    expect(hasAdminPermission("PRODUCT_MANAGER", "categories:manage")).toBe(true);
    expect(hasAdminPermission("PRODUCT_MANAGER", "batches:manage")).toBe(true);
    expect(hasAdminPermission("PRODUCT_MANAGER", "orders:manage")).toBe(false);
    expect(hasAdminPermission("PRODUCT_MANAGER", "users:manage")).toBe(false);
  });

  it("gives super admins full permissions", () => {
    expect(hasAdminPermission("SUPER_ADMIN", "users:manage")).toBe(true);
    expect(hasAdminPermission("SUPER_ADMIN", "settings:manage")).toBe(true);
    expect(hasAdminPermission("SUPER_ADMIN", "manufacturing:manage")).toBe(true);
    expect(hasAdminPermission("SUPER_ADMIN", "orders:manage")).toBe(true);
  });

  it("filters navigation according to role", () => {
    const operations = getVisibleAdminNavigation("OPERATIONS");
    const product = getVisibleAdminNavigation("PRODUCT_MANAGER");
    const superAdmin = getVisibleAdminNavigation("SUPER_ADMIN");

    expect(operations.map((item) => item.label)).toContain("Pharmacies");
    expect(operations.map((item) => item.label)).toContain("Orders");
    expect(operations.map((item) => item.label)).not.toContain("Products");

    expect(product.map((item) => item.label)).toContain("Products");
    expect(product.map((item) => item.label)).toContain("Categories");
    expect(product.map((item) => item.label)).not.toContain("Users");

    expect(superAdmin).toHaveLength(ADMIN_NAVIGATION.length);
  });

  it("returns readable role labels", () => {
    expect(getAdminRoleLabel("OPERATIONS")).toBe("Operations Staff");
    expect(getAdminRoleLabel("PRODUCT_MANAGER")).toBe("Product Manager");
    expect(getAdminRoleLabel("SUPER_ADMIN")).toBe("Super Admin");
    expect(getAdminRoleLabel("PHARMACY")).toBe("Unauthorized");
  });
});