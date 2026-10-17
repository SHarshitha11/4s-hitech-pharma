export const AUTH_STORAGE_KEY = "4s-hitech-pharma-auth-session";
export const RESET_TOKEN_KEY = "4s-hitech-pharma-reset-token";
export const AUTH_COOKIE_NAME = "4s-hitech-pharma-auth";

export type AuthRole =
  | "PHARMACY"
  | "OPERATIONS"
  | "PRODUCT_MANAGER"
  | "SUPER_ADMIN";

export type AuthSession = {
  authenticated: true;
  role: AuthRole;
  email: string;
  loggedInAt: string;
};

type DemoAdminCredential = {
  email: string;
  password: string;
  role: Exclude<AuthRole, "PHARMACY">;
  label: string;
};

const DEMO_EMAIL = "pharmacy@example.com";
const DEMO_PHONE = "9876543210";
const DEFAULT_DEMO_PASSWORD = "Pharma@123";

const DEMO_ADMIN_CREDENTIALS: DemoAdminCredential[] = [
  {
    email: "operations@example.com",
    password: "Operations@123",
    role: "OPERATIONS",
    label: "Operations Staff",
  },
  {
    email: "product@example.com",
    password: "Product@123",
    role: "PRODUCT_MANAGER",
    label: "Product Manager",
  },
  {
    email: "admin@example.com",
    password: "Admin@123",
    role: "SUPER_ADMIN",
    label: "Super Admin",
  },
];

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

export function getAdminDemoCredentials() {
  return DEMO_ADMIN_CREDENTIALS.map((credential) => ({ ...credential }));
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

    const validRoles: AuthRole[] = [
      "PHARMACY",
      "OPERATIONS",
      "PRODUCT_MANAGER",
      "SUPER_ADMIN",
    ];

    if (
      parsed.authenticated === true &&
      typeof parsed.email === "string" &&
      typeof parsed.role === "string" &&
      validRoles.includes(parsed.role as AuthRole)
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

export function isAdminRole(
  role: AuthRole | null | undefined,
): role is Exclude<AuthRole, "PHARMACY"> {
  return (
    role === "OPERATIONS" ||
    role === "PRODUCT_MANAGER" ||
    role === "SUPER_ADMIN"
  );
}

export function canAccessAdmin(session: AuthSession | null) {
  return session !== null && isAdminRole(session.role);
}

function setAuthCookie(role: AuthRole) {
  if (typeof document === "undefined") {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  const cookieRole = role === "PHARMACY" ? "pharmacy" : role.toLowerCase();
  document.cookie = `${AUTH_COOKIE_NAME}=${cookieRole}; Path=/; Max-Age=28800; SameSite=Lax${secure}`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function createSession(email: string, role: AuthRole): AuthSession {
  return {
    authenticated: true,
    role,
    email,
    loggedInAt: new Date().toISOString(),
  };
}

export function loginWithDemoCredentials(
  identifier: string,
  password: string,
) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const normalizedPhone = identifier.trim();

  const isValidPharmacyIdentifier =
    normalizedIdentifier === DEMO_EMAIL || normalizedPhone === DEMO_PHONE;

  if (
    isValidPharmacyIdentifier &&
    password === getStoredDemoPassword()
  ) {
    const session = createSession(DEMO_EMAIL, "PHARMACY");

    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    setAuthCookie(session.role);

    return session;
  }

  const adminCredential = DEMO_ADMIN_CREDENTIALS.find(
    (credential) =>
      credential.email === normalizedIdentifier &&
      credential.password === password,
  );

  if (!adminCredential) {
    return null;
  }

  const session = createSession(
    adminCredential.email,
    adminCredential.role,
  );

  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  setAuthCookie(session.role);

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