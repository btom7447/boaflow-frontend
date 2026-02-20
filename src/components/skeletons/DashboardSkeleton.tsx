"use client";

import { StatCardSkeleton } from "./StatCardSkeleton";
import { LineChartSkeleton } from "./LineChartSkeleton";
import { PieChartSkeleton } from "./PieChartSkeleton";
import { PipelineSkeleton } from "./PipelineSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="p-6 w-full space-y-6">
      {/* Stats Cards Skeleton */}
      <StatCardSkeleton />

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LineChartSkeleton height={250} />
        <PieChartSkeleton height={250} />
      </div>

      {/* Pipeline/Table Skeleton */}
      <PipelineSkeleton />
    </div>
  );
}
