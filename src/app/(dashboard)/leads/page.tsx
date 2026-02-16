"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api";
import { Lead, LeadFilters, FitType, LeadStatus } from "@/lib/types";
import {
  FIT_LABELS,
  FIT_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  REMOTE_FLAG_LABELS,
} from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { ExternalLink, ChevronDown } from "lucide-react";

const LIMIT = 30;

const FIT_OPTIONS: { value: FitType | ""; label: string }[] = [
  { value: "", label: "All Fits" },
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
];

const STATUS_OPTIONS: { value: LeadStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "not_interested", label: "Not Interested" },
  { value: "converted", label: "Converted" },
  { value: "ignored", label: "Ignored" },
];

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<LeadFilters>({
    limit: LIMIT,
    offset: 0,
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<LeadStatus>("new");

  const { data: result, isLoading } = useQuery({
    queryKey: ["leads", filters],
    queryFn: () => leadsApi.getLeads(filters),
  });

  const leads = result?.data ?? [];
  const total = result?.total ?? 0;

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
    },
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

  return (
    <div className="p-6">
      {/* Filters row */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {isLoading
            ? "Loading..."
            : `${total} total · showing ${leads.length}`}{" "}
        </p>
        <div className="flex items-center gap-2">
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
            onClick={() => setFilters({ limit: LIMIT, offset: 0 })}
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
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Title", "Location", "Fit", "Confidence", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => openDetail(lead)}
                    >
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

          <Pagination
            total={total}
            limit={LIMIT}
            offset={filters.offset ?? 0}
            onChange={(offset) => setFilters((f) => ({ ...f, offset }))}
          />
        </>
      )}

      {/* Detail Panel */}
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
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
  );
}
