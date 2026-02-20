"use client";

import { Skeleton } from "../ui/Skeleton";

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <Skeleton className="h-10 w-10 mb-3 rounded-lg" />
          <Skeleton className="h-6 w-20 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
