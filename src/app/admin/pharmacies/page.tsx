"use client";

import { useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-components";
import { Badge, Button, Modal, Table } from "@/components/ui";
import { getAuthSession } from "@/lib/auth";
import {
  getPharmacyStatusLabel,
  getManagedPharmacies,
  updatePharmacyDetails,
  updatePharmacyStatus,
  type ManagedPharmacy,
  type PharmacyStatus,
} from "@/lib/pharmacy-management";
import { hasAdminPermission } from "@/lib/admin-rbac";

const STATUS_OPTIONS: Array<"ALL" | PharmacyStatus> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
  "ACTIVE",
];

function getBadgeVariant(status: PharmacyStatus) {
  switch (status) {
    case "APPROVED":
    case "ACTIVE":
      return "success" as const;
    case "PENDING":
      return "warning" as const;
    case "REJECTED":
    case "SUSPENDED":
      return "danger" as const;
    default:
      return "default" as const;
  }
}

export default function PharmaciesPage() {
  const session = getAuthSession();
  const canManage = hasAdminPermission(
    session?.role,
    "pharmacies:manage",
  );

  const [pharmacies, setPharmacies] = useState(getManagedPharmacies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PharmacyStatus>(
    "ALL",
  );
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<ManagedPharmacy | null>(null);
  const [documentPharmacy, setDocumentPharmacy] =
    useState<ManagedPharmacy | null>(null);
  const [ordersPharmacy, setOrdersPharmacy] =
    useState<ManagedPharmacy | null>(null);
  const [editingPharmacy, setEditingPharmacy] =
    useState<ManagedPharmacy | null>(null);
  const [action, setAction] = useState<{
    pharmacy: ManagedPharmacy;
    status: PharmacyStatus;
  } | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [message, setMessage] = useState("");

  const filteredPharmacies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return pharmacies.filter((pharmacy) => {
      const matchesSearch =
        !normalizedSearch ||
        pharmacy.businessName.toLowerCase().includes(normalizedSearch) ||
        pharmacy.ownerName.toLowerCase().includes(normalizedSearch) ||
        pharmacy.email.toLowerCase().includes(normalizedSearch) ||
        pharmacy.phone.includes(normalizedSearch) ||
        pharmacy.city.toLowerCase().includes(normalizedSearch) ||
        pharmacy.licenceNumber.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || pharmacy.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [pharmacies, search, statusFilter]);

  function refreshPharmacies() {
    setPharmacies(getManagedPharmacies());
  }

  function requestStatusChange(
    pharmacy: ManagedPharmacy,
    status: PharmacyStatus,
  ) {
    setAction({ pharmacy, status });
    setActionReason("");
  }

  function confirmStatusChange() {
    if (!action) {
      return;
    }

    if (
      (action.status === "REJECTED" || action.status === "SUSPENDED") &&
      !actionReason.trim()
    ) {
      setMessage("A reason is required for reject or suspend actions.");
      return;
    }

    updatePharmacyStatus(action.pharmacy.id, action.status);
    refreshPharmacies();

    setMessage(
      `${action.pharmacy.businessName} is now ${getPharmacyStatusLabel(
        action.status,
      )}.`,
    );

    setAction(null);
    setActionReason("");
  }

  function saveEdit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!editingPharmacy) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    updatePharmacyDetails(editingPharmacy.id, {
      businessName: String(formData.get("businessName") ?? "").trim(),
      contactPerson: String(formData.get("contactPerson") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
    });

    refreshPharmacies();
    setEditingPharmacy(null);
    setMessage("Pharmacy details updated.");
  }

  const columns = [
    {
      key: "businessName",
      header: "Pharmacy",
      render: (pharmacy: ManagedPharmacy) => (
        <div>
          <p className="font-semibold text-gray-900">
            {pharmacy.businessName}
          </p>
          <p className="text-xs text-gray-500">{pharmacy.id}</p>
        </div>
      ),
    },
    {
      key: "ownerName",
      header: "Owner",
      render: (pharmacy: ManagedPharmacy) => pharmacy.ownerName,
    },
    {
      key: "location",
      header: "Location",
      render: (pharmacy: ManagedPharmacy) =>
        `${pharmacy.city}, ${pharmacy.state}`,
    },
    {
      key: "status",
      header: "Status",
      render: (pharmacy: ManagedPharmacy) => (
        <Badge variant={getBadgeVariant(pharmacy.status)}>
          {getPharmacyStatusLabel(pharmacy.status)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (pharmacy: ManagedPharmacy) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedPharmacy(pharmacy)}
          >
            View
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setDocumentPharmacy(pharmacy)}
          >
            Documents
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setOrdersPharmacy(pharmacy)}
          >
            Orders
          </Button>

          {canManage ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingPharmacy(pharmacy)}
              >
                Edit
              </Button>

              {pharmacy.status === "PENDING" ? (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      requestStatusChange(pharmacy, "APPROVED")
                    }
                  >
                    Approve
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      requestStatusChange(pharmacy, "REJECTED")
                    }
                  >
                    Reject
                  </Button>
                </>
              ) : null}

              {pharmacy.status === "APPROVED" ||
              pharmacy.status === "ACTIVE" ? (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    requestStatusChange(pharmacy, "SUSPENDED")
                  }
                >
                  Suspend
                </Button>
              ) : null}

              {pharmacy.status === "SUSPENDED" ||
              pharmacy.status === "REJECTED" ? (
                <Button
                  size="sm"
                  onClick={() =>
                    requestStatusChange(pharmacy, "ACTIVE")
                  }
                >
                  Activate
                </Button>
              ) : null}
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          title="Pharmacy Management"
          description="Review pharmacy registrations, inspect documents and orders, and manage pharmacy account status."
        />

        {message ? (
          <div
            role="status"
            className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
          >
            {message}
          </div>
        ) : null}

        {!canManage ? (
          <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            Your role can review pharmacies but does not have permission to
            change pharmacy status or edit records.
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
            <div>
              <label
                htmlFor="pharmacy-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search Pharmacies
              </label>

              <input
                id="pharmacy-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Business name, owner, email, phone, city or licence"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="pharmacy-status-filter"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Filter by Status
              </label>

              <select
                id="pharmacy-status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "ALL" | PharmacyStatus,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL"
                      ? "All Statuses"
                      : getPharmacyStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Table
            columns={columns}
            data={filteredPharmacies}
            getRowKey={(row) => row.id}
            emptyMessage="No pharmacies match the selected search and filter."
          />
        </div>
      </div>

      <Modal
        open={selectedPharmacy !== null}
        onClose={() => setSelectedPharmacy(null)}
        title="Pharmacy Registration Review"
        description="Review registration and regulatory information before taking action."
      >
        {selectedPharmacy ? (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-500">Business Name</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.businessName}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Business Type</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.businessType}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Owner</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.ownerName}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Contact</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.contactPerson}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Phone</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.phone}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Email</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.email}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Licence</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.licenceNumber}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">GST</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.gstNumber}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Location</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.city}, {selectedPharmacy.state}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Registered</p>
                <p className="mt-1 text-gray-900">
                  {selectedPharmacy.registeredAt}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4">
              {canManage && selectedPharmacy.status === "PENDING" ? (
                <>
                  <Button
                    onClick={() => {
                      requestStatusChange(
                        selectedPharmacy,
                        "APPROVED",
                      );
                      setSelectedPharmacy(null);
                    }}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => {
                      requestStatusChange(
                        selectedPharmacy,
                        "REJECTED",
                      );
                      setSelectedPharmacy(null);
                    }}
                  >
                    Reject
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={documentPharmacy !== null}
        onClose={() => setDocumentPharmacy(null)}
        title="Pharmacy Documents"
        description="Document metadata is shown here. Production document access should use authorized private storage URLs."
      >
        {documentPharmacy ? (
          <div className="space-y-3">
            {documentPharmacy.documents.map((document) => (
              <div
                key={document.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="font-semibold text-gray-900">
                  {document.name}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {document.type} · {document.size}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Uploaded {document.uploadedAt}
                </p>

                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setMessage(
                        `Document viewer requested for ${document.name}.`,
                      )
                    }
                  >
                    View Document
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={ordersPharmacy !== null}
        onClose={() => setOrdersPharmacy(null)}
        title="Pharmacy Orders"
        description="Recent order records for the selected pharmacy."
      >
        {ordersPharmacy ? (
          <div className="space-y-3">
            {ordersPharmacy.orders.length > 0 ? (
              ordersPharmacy.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.status}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ₹{order.value.toLocaleString("en-IN")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No orders available.
              </p>
            )}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={editingPharmacy !== null}
        onClose={() => setEditingPharmacy(null)}
        title="Edit Pharmacy"
        description="Update basic pharmacy contact details."
      >
        {editingPharmacy ? (
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <label
                htmlFor="edit-business-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Business Name
              </label>
              <input
                id="edit-business-name"
                name="businessName"
                defaultValue={editingPharmacy.businessName}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="edit-contact-person"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Contact Person
              </label>
              <input
                id="edit-contact-person"
                name="contactPerson"
                defaultValue={editingPharmacy.contactPerson}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="edit-phone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Phone
              </label>
              <input
                id="edit-phone"
                name="phone"
                defaultValue={editingPharmacy.phone}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="edit-email"
                name="email"
                type="email"
                defaultValue={editingPharmacy.email}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={action !== null}
        onClose={() => setAction(null)}
        title="Confirm Pharmacy Status Change"
        description="This status change is applied after confirmation."
      >
        {action ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Change{" "}
              <span className="font-semibold">
                {action.pharmacy.businessName}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {getPharmacyStatusLabel(action.status)}
              </span>
              ?
            </p>

            {action.status === "REJECTED" ||
            action.status === "SUSPENDED" ? (
              <div>
                <label
                  htmlFor="status-reason"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Reason
                </label>

                <textarea
                  id="status-reason"
                  value={actionReason}
                  onChange={(event) =>
                    setActionReason(event.target.value)
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                  placeholder="Enter the reason for this action"
                />
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setAction(null)}
              >
                Cancel
              </Button>

              <Button
                variant={
                  action.status === "REJECTED" ||
                  action.status === "SUSPENDED"
                    ? "danger"
                    : "primary"
                }
                onClick={confirmStatusChange}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}