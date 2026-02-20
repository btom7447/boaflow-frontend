import { Skeleton } from "@/components/ui/Skeleton";

export function OrganizationSkeleton() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3"
          >
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Usage Progress */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-64" />
      </div>

      {/* Organization Details */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <Skeleton className="h-4 w-40" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Management */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        {/* Plan Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>

        {/* Plan Comparison Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-gray-800 space-y-2"
            >
              <Skeleton className="h-3 w-16 mx-auto" />
              <Skeleton className="h-6 w-20 mx-auto" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
          ))}
        </div>

        <Skeleton className="h-3 w-64 mx-auto" />
      </div>
    </div>
  );
}
