"use client";

import { Skeleton } from "../ui/Skeleton";

export function DetailSectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}
