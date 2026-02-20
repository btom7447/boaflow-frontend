"use client";

import { Skeleton } from "../ui/Skeleton";

export function PieChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="flex flex-col items-center bg-gray-900 border border-gray-800 rounded-xl p-4">
      {/* Title */}
      <Skeleton className="w-40 h-5 mb-4 self-start" />

      {/* Donut */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: height, height: height }}
      >
        {/* Outer circle */}
        <Skeleton className="w-full h-full rounded-full" />

        {/* Inner cutout to simulate donut */}
        <div className="absolute w-55 h-55 bg-gray-900 rounded-full" />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
  );
}
