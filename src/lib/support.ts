export const SUPPORT_TICKET_STORAGE_KEY =
  "4s-hitech-pharma-support-tickets";

export const SUPPORT_CATEGORIES = [
  "Damaged Product",
  "Incorrect Product",
  "Short Supply",
  "Expired / Near-Expiry Product",
  "Packaging Issue",
  "Invoice Issue",
  "Delivery Issue",
  "Product Issue",
  "Other",
] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

export type SupportTicket = {
  id: string;
  category: SupportCategory;
  orderNumber: string;
  product: string;
  quantity: number;
  description: string;
  attachmentName?: string;
  submittedAt: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED";
};

export function getSupportTickets(): SupportTicket[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.sessionStorage.getItem(
      SUPPORT_TICKET_STORAGE_KEY,
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as unknown;

    return Array.isArray(parsed) ? (parsed as SupportTicket[]) : [];
  } catch {
    return [];
  }
}

export function saveSupportTicket(ticket: SupportTicket): void {
  const tickets = getSupportTickets();

  window.sessionStorage.setItem(
    SUPPORT_TICKET_STORAGE_KEY,
    JSON.stringify([ticket, ...tickets]),
  );
}

export function createSupportTicketId(): string {
  return `SUP-${Date.now().toString().slice(-8)}`;
}
