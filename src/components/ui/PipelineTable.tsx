"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RUN_STATUS_COLORS } from "@/lib/constants";

const Spinner = ({ className = "text-gray-400" }: { className?: string }) => (
  <svg
    className={`animate-spin h-4 w-4 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

interface PipelineRun {
  id: number;
  status: string;
  jobs_found?: number;
  leads_yes?: number;
  leads_maybe?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  triggered_by?: string;
  dry_run?: boolean;
  [key: string]: any;
}

interface PipelineTableProps {
  runs: PipelineRun[];
  loading?: boolean;
  title?: string;
  limit?: number;
  showViewAll?: boolean;
  filterToday?: boolean;
}

export function PipelineTable({
  runs,
  loading = false,
  title = "Pipeline Runs",
  limit,
  showViewAll = true,
  filterToday = false,
}: PipelineTableProps) {
  const skeletonRows = Array.from({ length: limit || 5 }, (_, i) => i);

  let displayRuns = runs ?? [];
  if (filterToday) {
    const todayStr = new Date().toISOString().split("T")[0];
    displayRuns = displayRuns.filter(
      (r) => r.created_at.split("T")[0] === todayStr,
    );
  }
  if (limit) displayRuns = displayRuns.slice(0, limit);

  const isActive = (run: PipelineRun) =>
    run.status === "queued" || run.status === "running";

  const formatDuration = (run: PipelineRun) => {
    if (!run.started_at || !run.completed_at) return "—";
    const ms =
      new Date(run.completed_at).getTime() - new Date(run.started_at).getTime();
    const s = Math.floor(ms / 1000);
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-300">{title}</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {[
                "Run",
                "Status",
                "Jobs Found",
                "Leads",
                "Duration",
                "Triggered By",
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
            {skeletonRows.map((i) => (
              <tr key={i} className="h-10 bg-gray-800/50 rounded-md"></tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!displayRuns || displayRuns.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-medium text-gray-300">{title}</h2>
        </div>
        <div className="p-6 text-center text-gray-500 text-sm">
          No pipeline runs yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-300">{title}</h2>
        {showViewAll && (
          <Link
            href="/pipeline"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all →
          </Link>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {[
                "Run",
                "Status",
                "Jobs Found",
                "Leads",
                "Duration",
                "Triggered By",
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
            {displayRuns.map((run) => (
              <tr
                key={run.id}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-200">Run #{run.id}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(run.created_at).toLocaleString()}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    label={capitalize(run.status)}
                    colorClass={
                      RUN_STATUS_COLORS[run.status] ||
                      "bg-gray-800 text-gray-400"
                    }
                  />
                  {run.dry_run && (
                    <span className="ml-2 text-xs text-gray-500">dry run</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {isActive(run) ? <Spinner /> : (run.jobs_found ?? "—")}
                </td>
                <td className="px-4 py-3">
                  {isActive(run) ? (
                    <Spinner />
                  ) : (
                    <>
                      <span className="text-blue-400">
                        {run.leads_yes ?? 0} yes
                      </span>
                      <span className="text-gray-600 mx-1">·</span>
                      <span className="text-yellow-400">
                        {run.leads_maybe ?? 0} maybe
                      </span>
                    </>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {isActive(run) ? <Spinner /> : formatDuration(run)}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {run.triggered_by || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {displayRuns.map((run) => (
          <div
            key={run.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-200 text-sm">
                  Run #{run.id}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(run.created_at).toLocaleString()}
                </p>
              </div>
              <Badge
                label={capitalize(run.status)}
                colorClass={
                  RUN_STATUS_COLORS[run.status] || "bg-gray-800 text-gray-400"
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-600">Jobs Found</p>
                {isActive(run) ? (
                  <Spinner className="text-gray-400 mt-1" />
                ) : (
                  <p className="text-gray-300 font-medium">
                    {run.jobs_found ?? 0}
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                {isActive(run) ? (
                  <Spinner className="text-gray-400 mt-1" />
                ) : (
                  <p className="text-gray-300 font-medium">
                    {formatDuration(run)}
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Leads (Yes)</p>
                {isActive(run) ? (
                  <Spinner className="text-gray-400 mt-1" />
                ) : (
                  <p className="text-blue-400 font-medium">
                    {run.leads_yes ?? 0}
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Leads (Maybe)</p>
                {isActive(run) ? (
                  <Spinner className="text-gray-400 mt-1" />
                ) : (
                  <p className="text-yellow-400 font-medium">
                    {run.leads_maybe ?? 0}
                  </p>
                )}
              </div>
            </div>

            {run.dry_run && (
              <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-800">
                Dry run
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}