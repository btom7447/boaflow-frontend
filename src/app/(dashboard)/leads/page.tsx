"use client"

import { useMemo, useRef, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { exportApi, leadsApi } from "@/lib/api"
import { Lead, LeadFilters, FitType, LeadStatus } from "@/lib/types"
import {
  FIT_LABELS,
  FIT_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  REMOTE_FLAG_LABELS,
} from "@/lib/constants"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { TableSkeleton } from "@/components/ui/Skeleton"
import { Pagination } from "@/components/ui/Pagination"
import { ExternalLink, ChevronDown, X, Search, Download, Check } from "lucide-react"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { toast } from "sonner"
import { error } from "console"

const LIMIT = 30

const FIT_OPTIONS: { value: FitType | ""; label: string }[] = [
  { value: "", label: "All Fits" },
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
]

const STATUS_OPTIONS: { value: LeadStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "not_interested", label: "Not Interested" },
  { value: "converted", label: "Converted" },
  { value: "ignored", label: "Ignored" },
]

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<LeadFilters>({
    limit: LIMIT,
    offset: 0,
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<LeadStatus>("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
    const [bulkStatus, setBulkStatus] = useState<LeadStatus>("contacted");
    const [showBulkModal, setShowBulkModal] = useState(false);

  const { data: result, isLoading } = useQuery({
    queryKey: ["leads", filters],
    queryFn: () => leadsApi.getLeads(filters),
  });

  const leads = result?.data ?? [];
  const total = result?.total ?? 0;

  const searchInputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts({
    search: () => searchInputRef.current?.focus(),
    escape: () => {
      if (selectedLead) setSelectedLead(null);
      else if (searchQuery) setSearchQuery("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      update,
    }: {
      id: number;
      update: Parameters<typeof leadsApi.updateLead>[1];
    }) => leadsApi.updateLead(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelectedLead(null);
      toast.success("Lead updated")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lead")
    }
  });

  const openDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setEditNotes(lead.notes || "");
    setEditStatus((lead.lead_status as LeadStatus) || "new");
  };

  const handleSave = () => {
    if (!selectedLead) return;
    updateMutation.mutate({
      id: selectedLead.id,
      update: { lead_status: editStatus, notes: editNotes },
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportApi.exportLeadsCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boaflow_leads_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Leads exported successfully")
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to update leads")
    } finally {
      setIsExporting(false);
    }
  };

  const bulkUpdateMutation = useMutation({
    mutationFn: ({
      leadIds,
      status,
    }: {
      leadIds: number[];
      status: LeadStatus;
    }) => leadsApi.bulkUpdateLeads(leadIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelectedLeads(new Set());
      setShowBulkModal(false);
      toast.success("Updated leads")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update leads")
    }
  });

  const toggleLead = (id: number) => {
    const newSet = new Set(selectedLeads);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedLeads(newSet);
  };

  const toggleAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const handleBulkUpdate = () => {
    bulkUpdateMutation.mutate({
      leadIds: Array.from(selectedLeads),
      status: bulkStatus,
    });
  };

  // Client-side search filter (title, role_type, location)
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const query = searchQuery.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.title.toLowerCase().includes(query) ||
        (lead.role_type && lead.role_type.toLowerCase().includes(query)) ||
        (lead.location && lead.location.toLowerCase().includes(query)),
    );
  }, [leads, searchQuery]);

  return (
    <div className="p-6">
      {/* Filters row */}
      <div className="flex flex-wrap gap-5 items-center justify-between mb-5">
        <div className="flex flex-wrap items-center gap-10">
          <p className="text-sm text-gray-500">
            {isLoading
              ? "Loading..."
              : `${total} total · showing ${leads.length}`}
          </p>
          {selectedLeads.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-400 font-medium">
                {selectedLeads.size} selected
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowBulkModal(true)}
              >
                Update Status
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
          {/* Export button */}
          <div className="">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              loading={isExporting}
            >
              <Download size={13} className="mr-1" />
              Export
            </Button>
          </div>

          {/* Search input */}
          <div className="relative col-span-2 flex-1 sm:flex-initial w-full min-w-80">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

          <FilterSelect
            value={filters.fit || ""}
            options={FIT_OPTIONS}
            onChange={(v) =>
              setFilters((f) => ({
                ...f,
                fit: (v as FitType) || undefined,
                offset: 0,
              }))
            }
          />
          <FilterSelect
            value={filters.status || ""}
            options={STATUS_OPTIONS}
            onChange={(v) =>
              setFilters((f) => ({
                ...f,
                status: (v as LeadStatus) || undefined,
                offset: 0,
              }))
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({ limit: LIMIT, offset: 0 });
              setSearchQuery("");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Table or skeleton */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden lg:overflow-x-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {[
                    "",
                    "Title",
                    "Location",
                    "Fit",
                    "Confidence",
                    "Status",
                    "",
                  ].map((h) => (
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
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      {searchQuery
                        ? `No leads found for "${searchQuery}"`
                        : "No leads found"}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => openDetail(lead)}
                    >
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                          className="rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-100 truncate max-w-xs">
                          {lead.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                          {lead.role_type || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        <p className="truncate max-w-35">
                          {lead.location || "—"}
                        </p>
                        {lead.remote_flag && lead.remote_flag !== "unknown" && (
                          <p className="text-xs text-gray-600 mt-0.5">
                            {REMOTE_FLAG_LABELS[lead.remote_flag] ||
                              lead.remote_flag}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {lead.boaflow_fit ? (
                          <Badge
                            label={
                              FIT_LABELS[lead.boaflow_fit] || lead.boaflow_fit
                            }
                            colorClass={
                              FIT_COLORS[lead.boaflow_fit] ||
                              "bg-gray-800 text-gray-400"
                            }
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {lead.confidence != null ? `${lead.confidence}%` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {lead.lead_status ? (
                          <Badge
                            label={
                              STATUS_LABELS[lead.lead_status] ||
                              lead.lead_status
                            }
                            colorClass={
                              STATUS_COLORS[lead.lead_status] ||
                              "bg-gray-800 text-gray-400"
                            }
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={lead.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-500 hover:text-emerald-400 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-12 text-center text-sm text-gray-500">
                {searchQuery
                  ? `No leads found for "${searchQuery}"`
                  : "No leads found"}
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => openDetail(lead)}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 active:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => toggleLead(lead.id)}
                      className="mt-1 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => openDetail(lead)}
                    >
                      <h3 className="font-medium text-gray-100 text-sm line-clamp-2 mb-1">
                        {lead.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {lead.role_type || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {lead.boaflow_fit && (
                      <Badge
                        label={FIT_LABELS[lead.boaflow_fit] || lead.boaflow_fit}
                        colorClass={
                          FIT_COLORS[lead.boaflow_fit] ||
                          "bg-gray-800 text-gray-400"
                        }
                      />
                    )}
                    {lead.lead_status && (
                      <Badge
                        label={
                          STATUS_LABELS[lead.lead_status] || lead.lead_status
                        }
                        colorClass={
                          STATUS_COLORS[lead.lead_status] ||
                          "bg-gray-800 text-gray-400"
                        }
                      />
                    )}
                    {lead.confidence != null && (
                      <span className="text-xs text-gray-500">
                        {lead.confidence}% confidence
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    <p className="text-xs text-gray-500 truncate">
                      {lead.location || "Location unknown"}
                    </p>
                    <a
                      href={lead.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          <Pagination
            total={total}
            limit={LIMIT}
            offset={filters.offset ?? 0}
            onChange={(offset) => setFilters((f) => ({ ...f, offset }))}
          />
        </>
      )}

      {/* Bulk Update Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-800">
              <h2 className="font-semibold text-white">
                Update {selectedLeads.size} Lead
                {selectedLeads.size !== 1 ? "s" : ""}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Change status for all selected leads
              </p>
            </div>

            <div className="px-6 py-5">
              <label className="text-sm font-medium text-gray-300 block mb-2">
                New Status
              </label>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowBulkModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={bulkUpdateMutation.isPending}
                onClick={handleBulkUpdate}
              >
                <Check size={13} className="mr-1.5" />
                Update {selectedLeads.size} Lead
                {selectedLeads.size !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-gray-800 flex items-start justify-between shrink-0">
              <div className="min-w-0 pr-4">
                <h2 className="font-semibold text-white truncate">
                  {selectedLead.title}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedLead.location || "Location unknown"}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
              <div className="flex items-center gap-3">
                {selectedLead.boaflow_fit && (
                  <Badge
                    label={FIT_LABELS[selectedLead.boaflow_fit]}
                    colorClass={FIT_COLORS[selectedLead.boaflow_fit]}
                  />
                )}
                {selectedLead.confidence != null && (
                  <span className="text-sm text-gray-400">
                    {selectedLead.confidence}% confidence
                  </span>
                )}
              </div>

              {selectedLead.reasons &&
                (() => {
                  try {
                    const reasons = JSON.parse(
                      selectedLead.reasons,
                    ) as string[];
                    return (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Reasons
                        </p>
                        <ul className="space-y-1.5">
                          {reasons.map((r, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-300 flex gap-2"
                            >
                              <span className="text-gray-600 mt-0.5 shrink-0">
                                •
                              </span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                  Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between shrink-0">
              <a
                href={selectedLead.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink size={13} />
                View job posting
              </a>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedLead(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={updateMutation.isPending}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="relative min-w-30">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
      >
        {options.map((o) => (
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
  )
}