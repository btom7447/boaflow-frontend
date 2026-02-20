import { Skeleton } from "@/components/ui/Skeleton";

export function CriteriaSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Criteria Groups */}
      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-40 rounded-full" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
