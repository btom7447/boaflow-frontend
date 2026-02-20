"use client";

import { useState, useRef } from "react";
import { Button } from "../ui/Button";
import { Upload, X, Play } from "lucide-react";
import { toast } from "sonner";
import { TriggerPipelineRequest } from "@/lib/types";

interface PipelineModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: TriggerPipelineRequest) => void;
  loading?: boolean;
  defaultInputFile?: string;
}

export function PipelineModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  defaultInputFile = "data/input/companies.csv",
}: PipelineModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<TriggerPipelineRequest>({
    input_file: defaultInputFile,
    dry_run: false,
    async_mode: false,
    concurrency: 10,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

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
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">Trigger Pipeline Run</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure and start a new run
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* File Upload */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Companies CSV
            </label>
            {selectedFile ? (
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-800 border border-blue-600/40">
                <div className="flex items-center gap-2 min-w-0">
                  <Upload size={14} className="text-blue-400 shrink-0" />
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
                    setForm((f) => ({ ...f, input_file: defaultInputFile }));
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-gray-500 hover:text-red-400 transition-colors ml-2 shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-4 rounded-lg border border-dashed border-gray-700 hover:border-blue-600/50 bg-gray-800/50 hover:bg-gray-800 transition-all text-center group"
              >
                <Upload
                  size={18}
                  className="mx-auto mb-1.5 text-gray-500 group-hover:text-blue-400 transition-colors"
                />
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Click to upload CSV
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  or use default: {defaultInputFile}
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

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.dry_run}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dry_run: e.target.checked }))
                }
                className="rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Dry run</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.async_mode}
                onChange={(e) =>
                  setForm((f) => ({ ...f, async_mode: e.target.checked }))
                }
                className="rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Async mode</span>
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
                  className="w-20 px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            onClick={() => onSubmit(form)}
          >
            <Play size={13} className="mr-1.5" /> Start Run
          </Button>
        </div>
      </div>
    </div>
  );
}