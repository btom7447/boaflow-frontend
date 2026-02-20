import { Skeleton } from "@/components/ui/Skeleton";

export function RolesSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header + Search + Add button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <Skeleton className="h-4 w-full rounded-md" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
