"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pipelineApi } from "@/lib/api";
import { TriggerPipelineRequest } from "@/lib/types";
import { RUN_STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PipelineRunSkeleton } from "@/components/ui/Skeleton";
import { Play, RefreshCw, Upload, X } from "lucide-react";

export default function PipelinePage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<TriggerPipelineRequest>({
    input_file: "data/input/companies.csv",
    dry_run: false,
    async_mode: false,
    concurrency: 10,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: runs = [], isLoading } = useQuery({
    queryKey: ["pipeline-runs"],
    queryFn: pipelineApi.getRuns,
    refetchInterval: (query) => {
      const runs = query.state.data;
      if (!runs) return false;
      const hasActive = runs.some(
        (r) => r.status === "queued" || r.status === "running",
      );
      return hasActive ? 3000 : false;
    },
  });

  const triggerMutation = useMutation({
    mutationFn: pipelineApi.triggerRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-runs"] });
      setShowModal(false);
      setSelectedFile(null);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    // Parse CSV client-side — send as JSON so Railway doesn't need file access
    const text = await file.text();
    const lines = text.trim().split("\n");
    if (lines.length < 2) return;

    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase().replace(/"/g, ""));

    const companies = lines
      .slice(1)
      .map((line) => {
        const values = line
          .split(",")
          .map((v) => v.trim().replace(/^"|"$/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = values[i] || "";
        });
        return {
          name: row["name"] || row["company_name"] || row["company"] || "",
          website_url: row["website_url"] || row["website"] || row["url"] || "",
          industry: row["industry"] || undefined,
          location: row["location"] || undefined,
        };
      })
      .filter((c) => c.name && c.website_url);

    setForm((f) => ({ ...f, companies, input_file: file.name }));
    console.log(`Parsed ${companies.length} companies from ${file.name}`);
  };

  const formatDuration = (run: (typeof runs)[0]) => {
    if (!run.started_at || !run.completed_at) return "—";
    const ms =
      new Date(run.completed_at).getTime() - new Date(run.started_at).getTime();
    const s = Math.floor(ms / 1000);
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-end mb-6 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["pipeline-runs"] })
          }
        >
          <RefreshCw size={14} />
        </Button>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <Play size={13} className="mr-1.5" />
          Run Pipeline
        </Button>
      </div>

      {isLoading ? (
        <PipelineRunSkeleton rows={5} />
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-scroll xl:overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 ">
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
              {runs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No pipeline runs yet — trigger your first run above
                  </td>
                </tr>
              ) : (
                runs.map((run) => (
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
                        label={
                          run.status.charAt(0).toUpperCase() +
                          run.status.slice(1)
                        }
                        colorClass={
                          RUN_STATUS_COLORS[run.status] ||
                          "bg-gray-800 text-gray-400"
                        }
                      />
                      {run.dry_run && (
                        <span className="ml-2 text-xs text-gray-500">
                          dry run
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {run.jobs_found}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400">
                        {run.leads_yes} yes
                      </span>
                      <span className="text-gray-600 mx-1">·</span>
                      <span className="text-yellow-400">
                        {run.leads_maybe} maybe
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {formatDuration(run)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {run.triggered_by || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Trigger Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Trigger Pipeline Run
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Configure and start a new run
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                }}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* File upload */}
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Companies CSV
                </label>

                {selectedFile ? (
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-800 border border-emerald-600/40">
                    <div className="flex items-center gap-2 min-w-0">
                      <Upload size={14} className="text-emerald-400 shrink-0" />
                      <span className="text-sm text-gray-200 truncate">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-gray-500 shrink-0">
                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setForm((f) => ({
                          ...f,
                          input_file: "data/input/companies.csv",
                        }));
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors ml-2 shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-3 py-4 rounded-lg border border-dashed border-gray-700 hover:border-emerald-600/50 bg-gray-800/50 hover:bg-gray-800 transition-all text-center group"
                  >
                    <Upload
                      size={18}
                      className="mx-auto mb-1.5 text-gray-500 group-hover:text-emerald-400 transition-colors"
                    />
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Click to upload CSV
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      or use default: data/input/companies.csv
                    </p>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Limit */}
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Company limit{" "}
                  <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  placeholder="Leave blank to process all"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      limit: e.target.value ? parseInt(e.target.value) : null,
                    }))
                  }
                />
              </div>

              {/* Options */}
              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dry_run}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dry_run: e.target.checked }))
                    }
                    className="rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-300">Dry run</span>
                  <span className="text-xs text-gray-600">(no DB writes)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.async_mode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, async_mode: e.target.checked }))
                    }
                    className="rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-300">Async mode</span>
                  <span className="text-xs text-gray-600">
                    (faster, higher memory usage)
                  </span>
                </label>

                {form.async_mode && (
                  <div className="flex items-center gap-3 pl-6">
                    <label className="text-sm text-gray-400 shrink-0">
                      Concurrency
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={form.concurrency}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          concurrency: parseInt(e.target.value) || 10,
                        }))
                      }
                      className="w-20 px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-gray-600">
                      companies at once
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={triggerMutation.isPending}
                onClick={() => triggerMutation.mutate(form)}
              >
                <Play size={13} className="mr-1.5" />
                Start Run
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
