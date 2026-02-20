import { Skeleton } from "@/components/ui/Skeleton";

export function ConfigurationsSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          {/* Title + Description */}
          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>

          {/* Criteria Block */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
