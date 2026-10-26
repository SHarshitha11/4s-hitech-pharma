"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type UserRole = "ADMIN" | "PHARMACY" | "STAFF";
type UserStatus = "ACTIVE" | "SUSPENDED";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pharmacy: string;
  status: UserStatus;
};

const INITIAL_USERS: AdminUser[] = [
  {
    id: "USR-001",
    name: "Harshitha S",
    email: "admin@4shitechpharma.com",
    role: "ADMIN",
    pharmacy: "4S HITECH PHARMA",
    status: "ACTIVE",
  },
  {
    id: "USR-002",
    name: "Anita Rao",
    email: "anita@slmmedicals.com",
    role: "PHARMACY",
    pharmacy: "Sri Lakshmi Medicals",
    status: "ACTIVE",
  },
  {
    id: "USR-003",
    name: "Rahul Menon",
    email: "rahul@apollocare.com",
    role: "PHARMACY",
    pharmacy: "Apollo Care Pharmacy",
    status: "ACTIVE",
  },
  {
    id: "USR-004",
    name: "Support Staff",
    email: "support@4shitechpharma.com",
    role: "STAFF",
    pharmacy: "4S HITECH PHARMA",
    status: "SUSPENDED",
  },
];

function roleVariant(role: UserRole) {
  if (role === "ADMIN") return "danger" as const;
  if (role === "PHARMACY") return "success" as const;
  return "default" as const;
}

function statusVariant(status: UserStatus) {
  return status === "ACTIVE" ? ("success" as const) : ("danger" as const);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | UserStatus>("ALL");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.pharmacy.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function toggleStatus(userId: string) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
            }
          : user,
      ),
    );
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          View users, roles and account status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="mt-1 text-2xl font-bold">{users.length}</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {users.filter((user) => user.status === "ACTIVE").length}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-500">Suspended Users</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {
                users.filter(
                  (user) => user.status === "SUSPENDED",
                ).length
              }
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="grid gap-3 p-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="user-search"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Search users
            </label>

            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email, pharmacy or ID..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="user-role-filter"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <select
              id="user-role-filter"
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value as "ALL" | UserRole,
                )
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="PHARMACY">Pharmacy</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="user-status-filter"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="user-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "ALL" | UserStatus,
                )
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Pharmacy</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.id}
                    </div>
                  </td>

                  <td className="px-4 py-3">{user.email}</td>

                  <td className="px-4 py-3">
                    <Badge variant={roleVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">{user.pharmacy}</td>

                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <Button
                      variant={
                        user.status === "ACTIVE"
                          ? "danger"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleStatus(user.id)}
                      aria-label={
                        user.status === "ACTIVE"
                          ? `Suspend ${user.name}`
                          : `Activate ${user.name}`
                      }
                    >
                      {user.status === "ACTIVE"
                        ? "Suspend"
                        : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}