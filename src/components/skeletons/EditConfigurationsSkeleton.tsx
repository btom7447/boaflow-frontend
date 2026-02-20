"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function EditConfigurationSkeleton() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-6 w-32 mb-4" />

      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />

        <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
          <Skeleton className="h-4 w-36" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700"
            >
              <Skeleton className="h-5 w-5 mt-0.5 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>

        <Skeleton className="h-8 w-full rounded-lg" />
      </div>

      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
