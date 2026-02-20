"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pipelineApi } from "@/lib/api";
import { TriggerPipelineRequest } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { PipelineSkeleton } from "@/components/skeletons/PipelineSkeleton";
import { Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PipelineTable } from "@/components/ui/PipelineTable";
import { PipelineModal } from "@/components/modals/PipelineModal";

// Helper to map API run type to PipelineTable type
const mapRunForTable = (run: any) => ({
  id: run.id,
  status: run.status,
  leads_found: run.jobs_found ?? 0,
  leads_match: run.leads_yes ?? 0,
  created_at: run.created_at,
});

export default function PipelinePage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const { data: runs = [], isLoading } = useQuery({
    queryKey: ["pipeline-runs"],
    queryFn: pipelineApi.getRuns,
    refetchInterval: (query) => {
      const runs = query.state.data;
      if (!runs) return false;
      const hasActive = runs.some(
        (r: any) => r.status === "queued" || r.status === "running",
      );
      return hasActive ? 3000 : false;
    },
  });

  const triggerMutation = useMutation({
    mutationFn: pipelineApi.triggerRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-runs"] });
      setShowModal(false);
      toast.success("Pipeline run started");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start pipeline");
    },
  });

  return (
    <div className="p-6">
      {/* Top Actions */}
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
          <Play size={13} className="mr-1.5" /> Run Pipeline
        </Button>
      </div>

      {/* Table / Skeleton */}
      {isLoading ? (
        <PipelineSkeleton rows={5} />
      ) : (
        <PipelineTable runs={runs.map(mapRunForTable)} />
      )}

      {/* Reusable Pipeline Modal */}
      <PipelineModal
        open={showModal}
        onClose={() => setShowModal(false)}
        loading={triggerMutation.isPending}
        onSubmit={(form: TriggerPipelineRequest) =>
          triggerMutation.mutate(form)
        }
      />
    </div>
  );
}
