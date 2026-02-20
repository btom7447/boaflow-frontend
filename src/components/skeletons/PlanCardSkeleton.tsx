"use client";

import { Skeleton } from "../ui/Skeleton";

export function PlanCardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-2"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}
