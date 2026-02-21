"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { AppUser } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { UsersSkeleton } from "@/components/skeletons/UserSkeleton";
import {
  Plus,
  Trash2,
  X,
  ChevronDown,
  EyeClosed,
  Eye,
  UserPlus,
  Search,
} from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "sales", label: "Sales" },
  { value: "client", label: "Client" },
];

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-950/50 text-purple-300 border border-purple-800/50",
  sales: "bg-blue-950/50 text-blue-300 border border-blue-800/50",
  client: "bg-gray-800 text-gray-400",
};

function Avatar({
  name,
  avatarBase64,
}: {
  name: string;
  avatarBase64?: string | null;
}) {
  const initials =
    name
      .trim()
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shrink-0 overflow-hidden">
      {avatarBase64 ? (
        <img
          src={`data:image/png;base64,${avatarBase64}`}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs font-semibold text-blue-400">{initials}</span>
      )}
    </div>
  );
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AppUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "sales",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: settingsApi.getUsers,
  });

  const createMutation = useMutation({
    mutationFn: settingsApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowModal(false);
      setForm({ email: "", password: "", full_name: "", role: "sales" });
      toast.success(` User ${form.full_name || form.email} created`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: settingsApi.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setConfirmDelete(null);
      toast.success(`User ${confirmDelete?.full_name} deactivated`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate user");
    },
  });

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        (user.full_name && user.full_name.toLowerCase().includes(query)) ||
        user.email.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  const activeUsers = users.filter((u) => u.is_active);
  const inactiveUsers = users.filter((u) => !u.is_active);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-5">
          <p className="text-sm text-gray-500">
            {activeUsers.length} active · {inactiveUsers.length} inactive
          </p>
          {/* Search input */}
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <UserPlus size={14} className="mr-1.5" />
          Add User
        </Button>
      </div>

      {isLoading ? (
        <UsersSkeleton />
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {["User", "Role", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    {searchQuery
                      ? `No users found for "${searchQuery}"`
                      : "No users found"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr
                      key={u.id}
                      className={clsx(
                        "transition-colors",
                        u.is_active ? "hover:bg-gray-800/50" : "opacity-50",
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={u.full_name || u.email}
                            avatarBase64={u.avatar}
                          />
                          <div>
                            <p className="font-medium text-gray-200">
                              {u.full_name || "—"}
                              {isSelf && (
                                <span className="ml-2 text-xs text-gray-600">
                                  (you)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={
                            u.role.charAt(0).toUpperCase() + u.role.slice(1)
                          }
                          colorClass={
                            ROLE_COLORS[u.role] || "bg-gray-800 text-gray-400"
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={u.is_active ? "Active" : "Inactive"}
                          colorClass={
                            u.is_active
                              ? "bg-blue-950/50 text-blue-400"
                              : "bg-gray-800 text-gray-500"
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        {u.is_active && !isSelf && (
                          <button
                            onClick={() => setConfirmDelete(u)}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white">Add User</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <Input
                label="Full name"
                placeholder="Jane Smith"
                value={form.full_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, full_name: e.target.value }))
                }
              />
              <Input
                label="Email"
                type="email"
                placeholder="jane@company.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <div className="relative ">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 bottom-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeClosed size={18} strokeWidth={1} />
                  ) : (
                    <Eye size={18} strokeWidth={1} />
                  )}
                </button>
              </div>

              {/* Role selector */}
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value }))
                    }
                    className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ROLE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>

              {createMutation.error && (
                <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                  {(createMutation.error as Error).message}
                </p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={createMutation.isPending}
                disabled={!form.email || !form.password}
                onClick={() => createMutation.mutate(form)}
              >
                Create User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-6 py-5">
              <h2 className="font-semibold text-white mb-1">
                Deactivate user?
              </h2>
              <p className="text-sm text-gray-400">
                <span className="text-gray-200">
                  {confirmDelete.full_name || confirmDelete.email}
                </span>{" "}
                will lose access immediately.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={deactivateMutation.isPending}
                onClick={() => deactivateMutation.mutate(confirmDelete.id)}
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
