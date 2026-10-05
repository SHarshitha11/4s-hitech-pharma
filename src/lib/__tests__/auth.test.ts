import { beforeEach, describe, expect, it } from "vitest";

import {
  AUTH_STORAGE_KEY,
  RESET_TOKEN_KEY,
  clearAuthSession,
  getAuthSession,
  getDemoCredentials,
  hasValidResetToken,
  isAuthenticated,
  loginWithDemoCredentials,
  resetDemoPassword,
  startPasswordReset,
} from "@/lib/auth";

describe("Authentication utilities", () => {
  beforeEach(() => {
    sessionStorage.clear();
    document.cookie = "4s-hitech-pharma-auth=; Path=/; Max-Age=0";
  });

  it("returns the development demo credentials", () => {
    expect(getDemoCredentials()).toEqual({
      email: "pharmacy@example.com",
      phone: "9876543210",
      password: "Pharma@123",
    });
  });

  it("rejects invalid login credentials", () => {
    expect(
      loginWithDemoCredentials("wrong@example.com", "WrongPassword"),
    ).toBeNull();

    expect(isAuthenticated()).toBe(false);
  });

  it("creates a pharmacy session with valid email credentials", () => {
    const session = loginWithDemoCredentials(
      "pharmacy@example.com",
      "Pharma@123",
    );

    expect(session).not.toBeNull();
    expect(session?.authenticated).toBe(true);
    expect(session?.role).toBe("PHARMACY");
    expect(session?.email).toBe("pharmacy@example.com");

    expect(getAuthSession()).toEqual(session);
    expect(isAuthenticated()).toBe(true);
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).not.toBeNull();
    expect(document.cookie).toContain("4s-hitech-pharma-auth=pharmacy");
  });

  it("accepts the registered pharmacy mobile number", () => {
    const session = loginWithDemoCredentials("9876543210", "Pharma@123");

    expect(session?.authenticated).toBe(true);
    expect(session?.role).toBe("PHARMACY");
  });

  it("clears the authentication session", () => {
    loginWithDemoCredentials("pharmacy@example.com", "Pharma@123");

    expect(isAuthenticated()).toBe(true);

    clearAuthSession();

    expect(isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("creates a password reset token for a known account", () => {
    const token = startPasswordReset("pharmacy@example.com");

    expect(token).toBe("4s-hitech-demo-reset-token");
    expect(hasValidResetToken(token)).toBe(true);
    expect(sessionStorage.getItem(RESET_TOKEN_KEY)).not.toBeNull();
  });

  it("rejects password reset for an unknown account", () => {
    expect(startPasswordReset("unknown@example.com")).toBeNull();
    expect(hasValidResetToken("4s-hitech-demo-reset-token")).toBe(false);
  });

  it("changes the demo password with a valid reset token", () => {
    const token = startPasswordReset("pharmacy@example.com");

    expect(token).not.toBeNull();

    const result = resetDemoPassword(token as string, "NewPass@123");

    expect(result).toBe(true);
    expect(hasValidResetToken(token)).toBe(false);
    expect(
      loginWithDemoCredentials("pharmacy@example.com", "NewPass@123"),
    ).not.toBeNull();
  });

  it("rejects password reset with an invalid token", () => {
    expect(
      resetDemoPassword("invalid-token", "NewPass@123"),
    ).toBe(false);
  });
});
