"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configurationsApi } from "@/lib/api";
import { SearchConfiguration } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfigurationsSkeleton } from "@/components/skeletons/ConfigurationsSkeleton";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Globe,
  Star,
  Users as UsersIcon,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type ModalState =
  | { mode: "closed" }
  | { mode: "confirm-delete"; config: SearchConfiguration };

export default function ConfigurationsPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ["configurations"],
    queryFn: configurationsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: configurationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      setModal({ mode: "closed" });
      toast.success("Search configuration deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete configuration");
    },
  });

  const filteredConfigs = useMemo(() => {
    if (!searchQuery.trim()) return configs;
    const query = searchQuery.toLowerCase();
    return configs.filter(
      (config) =>
        config.name.toLowerCase().includes(query) ||
        config.description?.toLowerCase().includes(query) ||
        config.criteria_prompt.toLowerCase().includes(query),
    );
  }, [configs, searchQuery]);

  const getDataSourceCount = (config: SearchConfiguration) => {
    return [
      config.check_website,
      config.check_google_reviews,
      config.check_social_media,
      config.check_jobs_page,
    ].filter(Boolean).length;
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">
            Configure what you're looking for and let AI find it
          </p>
        </div>
        <Link href="/configurations/new">
          <Button variant="primary" size="sm">
            <Plus size={14} className="mr-1.5" />
            New Search
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <p className="text-sm text-gray-500">
          {configs.length} {configs.length === 1 ? "search" : "searches"}
        </p>
        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search configurations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {isLoading ? (
        <ConfigurationsSkeleton />
      ) : filteredConfigs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            {searchQuery ? "No searches found" : "No searches yet"}
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "Create your first search configuration to get started"}
          </p>
          {!searchQuery && (
            <Link href="/configurations/new">
              <Button variant="primary" size="sm">
                <Plus size={14} className="mr-1.5" />
                Create Search
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConfigs.map((config) => (
            <div
              key={config.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {config.name}
                  </h3>
                  {config.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {config.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-400 mb-1">Criteria</p>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {config.criteria_prompt}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {config.check_website && (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-950/30 text-blue-400 px-2 py-1 rounded-md">
                    <Globe size={11} />
                    Website
                  </span>
                )}
                {config.check_google_reviews && (
                  <span className="inline-flex items-center gap-1 text-xs bg-yellow-950/30 text-yellow-400 px-2 py-1 rounded-md">
                    <Star size={11} />
                    Reviews
                  </span>
                )}
                {config.check_social_media && (
                  <span className="inline-flex items-center gap-1 text-xs bg-purple-950/30 text-purple-400 px-2 py-1 rounded-md">
                    <UsersIcon size={11} />
                    Social
                  </span>
                )}
                {config.check_jobs_page && (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-950/30 text-green-400 px-2 py-1 rounded-md">
                    <Briefcase size={11} />
                    Jobs
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                <Link href={`/configurations/${config.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Pencil size={13} className="mr-1.5" />
                    Edit
                  </Button>
                </Link>
                <button
                  onClick={() => setModal({ mode: "confirm-delete", config })}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal.mode === "confirm-delete" && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-6 py-5">
              <h2 className="font-semibold text-white mb-1">
                Delete search configuration?
              </h2>
              <p className="text-sm text-gray-400">
                <span className="text-gray-200">{modal.config.name}</span> will
                be permanently deleted. Existing leads from this search will
                remain.
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
                onClick={() => deleteMutation.mutate(modal.config.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
