export const AUTH_STORAGE_KEY = "4s-hitech-pharma-auth-session";
export const RESET_TOKEN_KEY = "4s-hitech-pharma-reset-token";
export const AUTH_COOKIE_NAME = "4s-hitech-pharma-auth";

export type AuthSession = {
  authenticated: true;
  role: "PHARMACY";
  email: string;
  loggedInAt: string;
};

const DEMO_EMAIL = "pharmacy@example.com";
const DEMO_PHONE = "9876543210";
const DEFAULT_DEMO_PASSWORD = "Pharma@123";

function getStoredDemoPassword() {
  if (typeof window === "undefined") {
    return DEFAULT_DEMO_PASSWORD;
  }

  return (
    sessionStorage.getItem("4s-hitech-pharma-demo-password") ??
    DEFAULT_DEMO_PASSWORD
  );
}

export function getDemoCredentials() {
  return {
    email: DEMO_EMAIL,
    phone: DEMO_PHONE,
    password: getStoredDemoPassword(),
  };
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<AuthSession>;

    if (
      parsed.authenticated === true &&
      parsed.role === "PHARMACY" &&
      typeof parsed.email === "string"
    ) {
      return parsed as AuthSession;
    }
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return null;
}

export function isAuthenticated() {
  return getAuthSession() !== null;
}

function setAuthCookie() {
  if (typeof document === "undefined") {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${AUTH_COOKIE_NAME}=pharmacy; Path=/; Max-Age=28800; SameSite=Lax${secure}`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function loginWithDemoCredentials(
  identifier: string,
  password: string,
) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const normalizedPhone = identifier.trim();

  const isValidIdentifier =
    normalizedIdentifier === DEMO_EMAIL || normalizedPhone === DEMO_PHONE;

  if (!isValidIdentifier || password !== getStoredDemoPassword()) {
    return null;
  }

  const session: AuthSession = {
    authenticated: true,
    role: "PHARMACY",
    email: DEMO_EMAIL,
    loggedInAt: new Date().toISOString(),
  };

  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  setAuthCookie();

  return session;
}

export function startPasswordReset(identifier: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const normalizedPhone = identifier.trim();

  const isValidIdentifier =
    normalizedIdentifier === DEMO_EMAIL || normalizedPhone === DEMO_PHONE;

  if (!isValidIdentifier) {
    return null;
  }

  const token = "4s-hitech-demo-reset-token";

  sessionStorage.setItem(
    RESET_TOKEN_KEY,
    JSON.stringify({
      token,
      identifier: normalizedIdentifier || normalizedPhone,
      createdAt: new Date().toISOString(),
    }),
  );

  return token;
}

export function hasValidResetToken(token: string | null) {
  if (!token || typeof window === "undefined") {
    return false;
  }

  try {
    const stored = sessionStorage.getItem(RESET_TOKEN_KEY);

    if (!stored) {
      return false;
    }

    const parsed = JSON.parse(stored) as {
      token?: string;
    };

    return parsed.token === token;
  } catch {
    return false;
  }
}

export function resetDemoPassword(token: string, newPassword: string) {
  if (!hasValidResetToken(token)) {
    return false;
  }

  sessionStorage.setItem("4s-hitech-pharma-demo-password", newPassword);
  sessionStorage.removeItem(RESET_TOKEN_KEY);

  return true;
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  clearAuthCookie();
}
