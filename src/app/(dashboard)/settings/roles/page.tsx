"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { RoleConfig } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { toast } from "sonner";

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; role: RoleConfig }
  | { mode: "confirm-delete"; role: RoleConfig };

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    key: "",
    label: "",
    description: "",
    examples: "",
  });

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: settingsApi.getRoles,
  });

  const createMutation = useMutation({
    mutationFn: settingsApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setModal({ mode: "closed" });
      toast.success(`Role ${form.label} created`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create role")
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof settingsApi.updateRole>[1];
    }) => settingsApi.updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setModal({ mode: "closed" });
      toast.success(`Role ${form.label} updated`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update role")
    }
  });

  const deleteMutation = useMutation({
    mutationFn: settingsApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setModal({ mode: "closed" });
      toast.success(`Role ${form.label} deactivated`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate role")
    }
  });

  const openCreate = () => {
    setForm({ key: "", label: "", description: "", examples: "" });
    setModal({ mode: "create" });
  };

  const openEdit = (role: RoleConfig) => {
    setForm({
      key: role.key,
      label: role.label,
      description: role.description,
      examples: role.examples || "",
    });
    setModal({ mode: "edit", role });
  };

  const handleSubmit = () => {
    if (modal.mode === "create") {
      createMutation.mutate({
        key: form.key,
        label: form.label,
        description: form.description,
        examples: form.examples.trim() ? form.examples : null,
      });
    } else if (modal.mode === "edit") {
      updateMutation.mutate({
        id: modal.role.id,
        payload: {
          label: form.label,
          description: form.description,
          examples: form.examples.trim() ? form.examples : null,
        },
      });
    }
  };

  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const query = searchQuery.toLowerCase();
    return roles.filter(
      (role) =>
        role.key.toLowerCase().includes(query) ||
        role.label.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query),
    );
  }, [roles, searchQuery]);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">{roles.length} active roles</p>
          <div className="relative w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={14} className="mr-1.5" />
          Add Role
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {["Key", "Label", "Description", "Examples", ""].map((h) => (
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
              {filteredRoles.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    {searchQuery
                      ? `No roles found for "${searchQuery}"`
                      : "No roles configured"}
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded">
                        {role.key}
                      </code>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-200">
                      {role.label}
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-xs">
                      <p className="truncate">{role.description}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs">
                      <p className="truncate text-xs">{role.examples || "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(role)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-700 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() =>
                            setModal({ mode: "confirm-delete", role })
                          }
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal.mode === "create" || modal.mode === "edit") && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white">
                {modal.mode === "create" ? "Add Role" : "Edit Role"}
              </h2>
              <button
                onClick={() => setModal({ mode: "closed" })}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {modal.mode === "create" && (
                <Input
                  label="Key"
                  placeholder="e.g. executive_assistant"
                  value={form.key}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, key: e.target.value }))
                  }
                />
              )}
              <Input
                label="Label"
                placeholder="e.g. Executive Assistant"
                value={form.label}
                onChange={(e) =>
                  setForm((f) => ({ ...f, label: e.target.value }))
                }
              />
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What kind of roles does this cover?"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1.5">
                  Examples
                  <span className="text-gray-500 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Chief of Staff, EA to CEO, Executive Coordinator"
                  value={form.examples}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, examples: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                  {(error as Error).message}
                </p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModal({ mode: "closed" })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={isPending}
                onClick={handleSubmit}
              >
                {modal.mode === "create" ? "Create Role" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal.mode === "confirm-delete" && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-6 py-5">
              <h2 className="font-semibold text-white mb-1">
                Deactivate role?
              </h2>
              <p className="text-sm text-gray-400">
                <span className="text-gray-200">{modal.role.label}</span> will
                be removed from the classifier. This won't affect existing
                leads.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModal({ mode: "closed" })}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(modal.role.id)}
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
