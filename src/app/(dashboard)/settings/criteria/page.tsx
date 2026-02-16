"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { FitCriteria } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ClipboardPlus, Plus, Trash2 } from "lucide-react";
import { clsx } from "clsx";

/* =============================
   Types
============================= */

type CreateCriteriaInput = Omit<FitCriteria, "id" | "is_active">;

type CriteriaType = FitCriteria["criteria_type"];

type CriteriaTypeMeta = {
  value: CriteriaType;
  label: string;
  description: string;
  color: string;
  dotColor: string;
};

/* =============================
   Constants (Domain-Typed)
============================= */

const CRITERIA_TYPES: CriteriaTypeMeta[] = [
  {
    value: "required_for_fit",
    label: "Required for Fit",
    description: "Must be true for a YES classification",
    color: "text-emerald-400 bg-emerald-950/30 border-emerald-800/50",
    dotColor: "bg-emerald-400",
  },
  {
    value: "automatic_disqualifier",
    label: "Automatic Disqualifier",
    description: "Triggers a NO classification immediately",
    color: "text-red-400 bg-red-950/30 border-red-800/50",
    dotColor: "bg-red-400",
  },
];

/* =============================
   Page
============================= */

export default function CriteriaPage() {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<FitCriteria | null>(null);

  const { data: criteria = [], isLoading } = useQuery({
    queryKey: ["criteria"],
    queryFn: settingsApi.getCriteria,
  });

  const createMutation = useMutation({
    mutationFn: settingsApi.createCriteria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      setShowModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: settingsApi.deleteCriteria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      setConfirmDelete(null);
    },
  });

  const grouped = CRITERIA_TYPES.map((type) => ({
    ...type,
    items: criteria.filter((c) => c.criteria_type === type.value),
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {criteria.length} active criteria
        </p>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <ClipboardPlus size={14} className="mr-1.5" />
          Add Criteria
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map((group) => (
            <div key={group.value}>
              <div
                className={clsx(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium mb-3",
                  group.color,
                )}
              >
                <div
                  className={clsx("w-1.5 h-1.5 rounded-full", group.dotColor)}
                />
                {group.label}
                <span className="opacity-60">·</span>
                <span className="opacity-60">{group.items.length}</span>
              </div>

              {group.items.length === 0 ? (
                <div className="bg-gray-900 border border-dashed border-gray-800 rounded-xl px-4 py-6 text-center text-sm text-gray-600">
                  No {group.label.toLowerCase()} criteria yet
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <ul className="divide-y divide-gray-800">
                    {group.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors gap-4"
                      >
                        <p className="text-sm text-gray-300 leading-relaxed flex-1">
                          {item.text}
                        </p>
                        <button
                          onClick={() => setConfirmDelete(item)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/30 transition-colors shrink-0 mt-0.5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddCriteriaModal
          onClose={() => setShowModal(false)}
          onSubmit={(payload) => createMutation.mutate(payload)}
          loading={createMutation.isPending}
        />
      )}

      {confirmDelete && (
        <DeleteConfirmModal
          item={confirmDelete}
          loading={deleteMutation.isPending}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => deleteMutation.mutate(confirmDelete.id)}
        />
      )}
    </div>
  );
}

/* =============================
   Add Modal (Isolated + Typed)
============================= */

function AddCriteriaModal({
  onClose,
  onSubmit,
  loading,
}: {
  onClose: () => void;
  onSubmit: (data: CreateCriteriaInput) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<CreateCriteriaInput>({
    criteria_type: "required_for_fit",
    text: "",
  });

  const selectedMeta = CRITERIA_TYPES.find(
    (t) => t.value === form.criteria_type,
  );

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="px-6 py-5 border-b border-gray-800">
          <h2 className="font-semibold text-white">Add Criteria</h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Type
            </label>

            <div className="grid grid-cols-2 gap-2">
              {CRITERIA_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      criteria_type: type.value,
                    }))
                  }
                  className={clsx(
                    "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left",
                    form.criteria_type === type.value
                      ? type.color
                      : "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300",
                  )}
                >
                  <div
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full mb-1.5",
                      form.criteria_type === type.value
                        ? type.dotColor
                        : "bg-gray-600",
                    )}
                  />
                  {type.label}
                </button>
              ))}
            </div>

            {selectedMeta && (
              <p className="text-xs text-gray-600 mt-2">
                {selectedMeta.description}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">
              Criteria text
            </label>
            <textarea
              rows={3}
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              autoFocus
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            disabled={!form.text.trim()}
            onClick={() =>
              onSubmit({
                ...form,
                text: form.text.trim(),
              })
            }
          >
            Add Criteria
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =============================
   Delete Modal
============================= */

function DeleteConfirmModal({
  item,
  loading,
  onCancel,
  onConfirm,
}: {
  item: FitCriteria;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="px-6 py-5">
          <h2 className="font-semibold text-white mb-2">Remove criteria?</h2>
          <p className="text-sm text-gray-400 leading-relaxed">"{item.text}"</p>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
